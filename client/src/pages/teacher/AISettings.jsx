import React, { useState, useEffect, useRef } from "react";
import api from "../../services/api";
import {
  Settings,
  Sparkles,
  Award,
  Send,
  MessageSquare,
  RefreshCw,
  Sliders,
  ChevronDown,
  ChevronUp,
  Check,
  AlertTriangle,
  BookOpen,
  Volume2,
  FileText,
  HelpCircle,
  Clock
} from "lucide-react";

const AISettings = () => {
  // Page states
  const [stories, setStories] = useState([]);
  const [selectedStoryId, setSelectedStoryId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [rechunking, setRechunking] = useState(false);

  // AI Personality states
  const [name, setName] = useState("حكيم القرية");
  const [tone, setTone] = useState("ودود (Friendly)");
  const [difficulty, setDifficulty] = useState(60);
  const [systemPrompt, setSystemPrompt] = useState(
    "تحدث كأنك شخصية من القصة. ركز على استخدام الكلمات الصعبة التي حددتها أنا. ولا تعط الإجابة مباشرة."
  );
  const [xp, setXp] = useState(50);

  // Chat Preview states
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]); // Array of { sender: 'student'|'bot', text: '', retrievedChunks: [] }
  const [chatLoading, setChatLoading] = useState(false);

  // Toast / Feedback state
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  
  // Ref for auto-scrolling chat
  const chatBottomRef = useRef(null);

  // Show floating feedback toast
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 4000);
  };

  // Fetch stories on component mount
  useEffect(() => {
    fetchStories();
  }, []);

  // Fetch stories authored by the teacher
  const fetchStories = async () => {
    try {
      setLoading(true);
      const response = await api.get("/stories/my-stories");
      const fetchedStories = response.data || [];
      setStories(fetchedStories);
      
      if (fetchedStories.length > 0) {
        const firstStory = fetchedStories[0];
        setSelectedStoryId(firstStory._id);
        fetchStoryAISettings(firstStory._id);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching teacher stories:", error);
      showToast("حدث خطأ أثناء تحميل القصص الخاصة بك", "error");
      setLoading(false);
    }
  };

  // Fetch AI settings for the selected story
  const fetchStoryAISettings = async (storyId) => {
    try {
      setLoading(true);
      const response = await api.get(`/ai/settings/${storyId}`);
      const data = response.data || {};
      const personality = data.personality || {};
      
      setName(personality.name || "حكيم القرية");
      setTone(personality.tone || "ودود (Friendly)");
      setDifficulty(personality.difficulty || 60);
      setSystemPrompt(
        personality.systemPrompt || 
        "تحدث كأنك شخصية من القصة. ركز على استخدام الكلمات الصعبة التي حددتها أنا. ولا تعط الإجابة مباشرة."
      );
      setXp(personality.xp || 50);

      // Initialize chat with customized welcome message
      setChatHistory([
        {
          sender: "bot",
          text: `مرحباً بك أيها البطل! أنا "${personality.name || "حكيم القرية"}". لقد قرأت قصتنا بعناية، وأنا مستعد لمساعدتك في استكشاف تفاصيلها والإجابة عن أي أسئلة تدور في ذهنك. ماذا تريد أن تعرف عن القصة اليوم؟ ✨`,
          retrievedChunks: []
        }
      ]);
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching story AI settings:", error);
      showToast("لم يتم العثور على إعدادات مخصصة، تم تحميل القيم الافتراضية", "warning");
      
      // Load defaults
      setName("حكيم القرية");
      setTone("ودود (Friendly)");
      setDifficulty(60);
      setSystemPrompt("تحدث كأنك شخصية من القصة. ركز على استخدام الكلمات الصعبة التي حددتها أنا. ولا تعط الإجابة مباشرة.");
      setXp(50);
      setChatHistory([
        {
          sender: "bot",
          text: "مرحباً بك! أنا حكيم القرية. كيف يمكنني مساعدتك اليوم؟",
          retrievedChunks: []
        }
      ]);
      setLoading(false);
    }
  };

  // Handle changing selected story
  const handleStoryChange = (e) => {
    const storyId = e.target.value;
    setSelectedStoryId(storyId);
    if (storyId) {
      fetchStoryAISettings(storyId);
    }
  };

  // Save AI Settings to backend
  const handleSaveSettings = async () => {
    if (!selectedStoryId) {
      showToast("يرجى اختيار قصة أولاً قبل تفعيل الشخصية", "error");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        name,
        tone,
        difficulty: Number(difficulty),
        systemPrompt,
        xp: Number(xp)
      };

      await api.put(`/ai/settings/${selectedStoryId}`, payload);
      showToast("تم حفظ وتفعيل شخصية الذكاء الاصطناعي بنجاح!", "success");

      // Reset preview chat log with the new name
      setChatHistory([
        {
          sender: "bot",
          text: `مرحباً بك! لقد تم تحديث برمجتي بنجاح. أنا الآن "${name}" بأسلوب (${tone}) ومستوى صعوبة (${difficulty}%). كيف يمكنني مساعدتك في سياق القصة الآن؟`,
          retrievedChunks: []
        }
      ]);
    } catch (error) {
      console.error("Error saving AI settings:", error);
      showToast(error.response?.data?.message || "فشل حفظ إعدادات الشخصية", "error");
    } finally {
      setSaving(false);
    }
  };

  // Re-generate Embeddings (re-chunk)
  const handleRechunk = async () => {
    if (!selectedStoryId) return;
    try {
      setRechunking(true);
      showToast("جاري تقسيم النص وتوليد متجهات الخصائص (Embeddings)... قد يستغرق هذا بضع ثوانٍ", "info");
      
      const response = await api.post(`/ai/rechunk/${selectedStoryId}`);
      showToast(response.data?.message || "تمت إعادة فهرسة القصة وتحديث المتجهات بنجاح!", "success");
    } catch (error) {
      console.error("Error rechunking story:", error);
      showToast("فشلت عملية إعادة الفهرسة. يرجى التأكد من مفتاح Gemini API في الخادم.", "error");
    } finally {
      setRechunking(false);
    }
  };

  // Send message to RAG Chatbot API
  const handleSendMessage = async (e) => {
    e.preventDefault();
    const message = chatInput.trim();
    if (!message || !selectedStoryId || chatLoading) return;

    // Append student message to visual chat log
    const updatedHistory = [
      ...chatHistory,
      { sender: "student", text: message, retrievedChunks: [] }
    ];
    setChatHistory(updatedHistory);
    setChatInput("");
    setChatLoading(true);

    // Auto-scroll to typing indicator
    setTimeout(scrollToBottom, 50);

    try {
      // Format chat history context for Gemini (excluding greeting first turn if desired, or keeping all)
      // We map our messages list to match backend expectations
      const apiHistory = updatedHistory.slice(1).map(msg => ({
        sender: msg.sender,
        text: msg.text
      }));

      const response = await api.post("/ai/chat", {
        storyId: selectedStoryId,
        message,
        chatHistory: apiHistory
      });

      const { answer, retrievedChunks, xpAwarded } = response.data;

      // Append bot response with RAG source context
      setChatHistory(prev => [
        ...prev,
        {
          sender: "bot",
          text: answer || "لم أتمكن من استخلاص إجابة من سياق القصة.",
          retrievedChunks: retrievedChunks || [],
          xpAwarded: xpAwarded
        }
      ]);
    } catch (error) {
      console.error("Error talking to story chatbot:", error);
      setChatHistory(prev => [
        ...prev,
        {
          sender: "bot",
          text: "⚠️ عذراً، حدث خطأ أثناء الاتصال بخادم الذكاء الاصطناعي. يرجى التأكد من تشغيل الخادم وتثبيت مفتاح Gemini API الخاص بك بنجاح.",
          retrievedChunks: []
        }
      ]);
    } finally {
      setChatLoading(false);
      setTimeout(scrollToBottom, 100);
    }
  };

  // Auto-scroll logic helper
  const scrollToBottom = () => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, chatLoading]);

  // Toggle RAG inspect view per message index
  const [inspectIndex, setInspectIndex] = useState(null);
  const toggleInspect = (index) => {
    setInspectIndex(inspectIndex === index ? null : index);
  };

  // Renders loading spinner on setup
  if (loading && stories.length === 0) {
    return (
      <div className="content-area" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '60vh', gap: '20px' }}>
        <RefreshCw className="animate-spin" style={{ width: '50px', height: '50px', color: 'var(--teacher-primary)' }} />
        <span style={{ fontWeight: 800, color: '#4b5563' }}>جاري تحميل إعدادات الذكاء الاصطناعي...</span>
      </div>
    );
  }

  return (
    <div className="content-area" dir="rtl" style={{ fontFamily: 'Cairo, sans-serif' }}>
      {/* Toast Notification */}
      {toast.show && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
          background: toast.type === 'success' ? '#10b981' : toast.type === 'error' ? '#ef4444' : toast.type === 'info' ? '#3b82f6' : '#f59e0b',
          color: '#fff',
          padding: '12px 30px',
          borderRadius: '16px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontWeight: 700,
          fontSize: '0.95rem',
          transition: 'all 0.3s ease'
        }}>
          {toast.type === 'success' && <Check style={{ width: '18px', height: '18px' }} />}
          {toast.type === 'error' && <AlertTriangle style={{ width: '18px', height: '18px' }} />}
          {toast.type === 'info' && <RefreshCw className="animate-spin" style={{ width: '18px', height: '18px' }} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Main Grid Layout: Left is live Demo test, Right is Settings Config */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '30px', minHeight: 'calc(100vh - 160px)' }}>
        
        {/* ========================================================
            LEFT COLUMN: CHAT SANDBOX SIMULATOR & TEST DEMO (Gemini API Test)
           ======================================================== */}
        <div className="preview-column" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div className="card-3d chat-preview" style={{ 
            background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)', 
            borderRadius: '32px', 
            display: 'flex', 
            flexDirection: 'column', 
            height: '100%', 
            padding: 0,
            overflow: 'hidden',
            border: '2px solid rgba(255,255,255,0.7)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.06)'
          }}>
            {/* Simulator Header */}
            <div style={{ 
              padding: '20px 25px', 
              background: 'rgba(255,255,255,0.85)', 
              backdropFilter: 'blur(10px)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(0,0,0,0.05)',
              zIndex: 10
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ 
                  width: '12px', 
                  height: '12px', 
                  background: stories.length > 0 ? '#10b981' : '#d1d5db', 
                  borderRadius: '50%',
                  boxShadow: stories.length > 0 ? '0 0 10px #10b981' : 'none'
                }}></div>
                <div>
                  <h4 style={{ margin: 0, fontWeight: 900, color: '#1f2937', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles style={{ width: '18px', height: '18px', color: 'var(--teacher-primary)' }} />
                    <span>مختبر المعاينة المباشرة (Demo Sandbox)</span>
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280', fontWeight: 600 }}>
                    اختبر استجابة البوت في سياق قصتك المحددة
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ 
                  background: 'var(--teacher-primary-light)', 
                  color: 'var(--teacher-primary)', 
                  padding: '5px 12px', 
                  borderRadius: '10px', 
                  fontSize: '0.75rem', 
                  fontWeight: 800 
                }}>
                  {stories.length > 0 ? `قصة نشطة: ${stories.find(s => s._id === selectedStoryId)?.title?.substring(0, 15)}...` : 'لا توجد قصة'}
                </span>
              </div>
            </div>
            
            {/* Scrollable Chat Area */}
            <div style={{ 
              flexGrow: 1, 
              padding: '25px', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '20px', 
              overflowY: 'auto',
              maxHeight: '520px'
            }}>
              {chatHistory.map((msg, idx) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                  
                  {/* Message Bubble wrapper */}
                  <div style={{ 
                    maxWidth: '85%', 
                    padding: '14px 20px', 
                    borderRadius: '24px', 
                    background: msg.sender === "student" ? 'var(--teacher-primary)' : '#fff', 
                    color: msg.sender === "student" ? '#fff' : '#1f2937', 
                    alignSelf: msg.sender === "student" ? 'flex-end' : 'flex-start', 
                    borderBottomRightRadius: msg.sender === "student" ? '24px' : '6px',
                    borderBottomLeftRadius: msg.sender === "student" ? '6px' : '24px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.03)', 
                    fontWeight: 600,
                    fontSize: '0.92rem',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-line'
                  }}>
                    {msg.text}

                    {/* XP Award Popup animation simulation */}
                    {msg.sender === "bot" && msg.xpAwarded && (
                      <div style={{
                        marginTop: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        color: '#d97706',
                        background: '#fef3c7',
                        padding: '3px 8px',
                        borderRadius: '8px',
                        width: 'fit-content'
                      }}>
                        <Award style={{ width: '12px', height: '12px' }} />
                        <span>+{msg.xpAwarded} XP للطالب عند المحادثة</span>
                      </div>
                    )}
                  </div>

                  {/* RAG Context Inspector - Show only for Bot replies */}
                  {msg.sender === "bot" && msg.retrievedChunks && msg.retrievedChunks.length > 0 && (
                    <div style={{ alignSelf: 'flex-start', marginTop: '6px', width: '85%' }}>
                      <button 
                        onClick={() => toggleInspect(idx)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--teacher-primary)',
                          fontSize: '0.78rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '3px 8px',
                          borderRadius: '8px',
                          backgroundColor: 'rgba(93, 162, 150, 0.07)'
                        }}
                      >
                        <FileText style={{ width: '13px', height: '13px' }} />
                        <span>{inspectIndex === idx ? 'إخفاء سياق RAG المسترجع ✖' : 'معاينة سياق RAG المسترجع (Story Context) 👁'}</span>
                      </button>

                      {inspectIndex === idx && (
                        <div style={{
                          marginTop: '8px',
                          padding: '15px',
                          background: 'rgba(255, 255, 255, 0.95)',
                          border: '1px solid rgba(93, 162, 150, 0.2)',
                          borderRadius: '16px',
                          fontSize: '0.8rem',
                          color: '#4b5563',
                          lineHeight: '1.5',
                          boxShadow: '0 5px 15px rgba(0,0,0,0.03)'
                        }}>
                          <div style={{ fontWeight: 800, color: 'var(--teacher-primary)', marginBottom: '8px', borderBottom: '1px solid #eee', paddingBottom: '4px' }}>
                            المقاطع النصية المسترجعة من MongoDB (الأعلى تشابهاً بجيب التمام):
                          </div>
                          {msg.retrievedChunks.map((chunkText, cIdx) => (
                            <div key={cIdx} style={{
                              marginBottom: '10px',
                              padding: '8px',
                              background: '#f9fafb',
                              borderRadius: '8px',
                              borderLeft: '3px solid var(--teacher-primary)',
                              fontSize: '0.78rem'
                            }}>
                              <strong>المقطع [{cIdx + 1}]:</strong> "{chunkText}"
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {/* Bot Typing Simulator animation */}
              {chatLoading && (
                <div style={{ 
                  maxWidth: '75px', 
                  padding: '15px 20px', 
                  borderRadius: '24px', 
                  background: '#fff', 
                  alignSelf: 'flex-start', 
                  borderBottomLeftRadius: '24px', 
                  borderBottomRightRadius: '6px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '5px',
                  alignItems: 'center'
                }}>
                  <div className="typing-dot" style={{ width: '8px', height: '8px', background: 'var(--teacher-primary)', borderRadius: '50%', animation: 'typingDot 1.4s infinite ease-in-out' }}></div>
                  <div className="typing-dot" style={{ width: '8px', height: '8px', background: 'var(--teacher-primary)', borderRadius: '50%', animation: 'typingDot 1.4s infinite ease-in-out', animationDelay: '0.2s' }}></div>
                  <div className="typing-dot" style={{ width: '8px', height: '8px', background: 'var(--teacher-primary)', borderRadius: '50%', animation: 'typingDot 1.4s infinite ease-in-out', animationDelay: '0.4s' }}></div>
                </div>
              )}
              
              <div ref={chatBottomRef} />
            </div>

            {/* Custom Keyframes for Typing Dot in JS */}
            <style>{`
              @keyframes typingDot {
                0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
                40% { transform: scale(1); opacity: 1; }
              }
              .custom-slider::-webkit-slider-runnable-track {
                background: #e5e7eb;
                height: 8px;
                border-radius: 4px;
              }
              .custom-slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                background: var(--teacher-primary);
                width: 20px;
                height: 20px;
                border-radius: 50%;
                margin-top: -6px;
                box-shadow: 0 4px 10px rgba(0,0,0,0.15);
                transition: transform 0.1s;
              }
              .custom-slider::-webkit-slider-thumb:hover {
                transform: scale(1.2);
              }
            `}</style>

            {/* Chat Input form */}
            <form onSubmit={handleSendMessage} style={{ padding: '20px', background: '#fff', borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '15px' }}>
              <input 
                type="text" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                disabled={!selectedStoryId || chatLoading}
                placeholder={stories.length === 0 ? "يرجى كتابة ورفع قصة أولاً للدردشة..." : "اطرح سؤالاً على البوت حول أحداث القصة..."} 
                style={{ 
                  flexGrow: 1, 
                  background: '#f3f4f6', 
                  border: 'none', 
                  padding: '14px 20px', 
                  borderRadius: '16px', 
                  outline: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  transition: 'box-shadow 0.2s',
                }} 
              />
              <button 
                type="submit"
                disabled={!chatInput.trim() || chatLoading}
                className="btn-send" 
                style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '16px', 
                  background: !chatInput.trim() || chatLoading ? '#d1d5db' : 'var(--teacher-primary)', 
                  color: '#fff', 
                  border: 'none', 
                  cursor: !chatInput.trim() || chatLoading ? 'default' : 'pointer',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  boxShadow: !chatInput.trim() || chatLoading ? 'none' : '0 5px 15px rgba(93, 162, 150, 0.3)',
                  transition: 'all 0.2s'
                }}
              >
                <Send style={{ width: '18px', height: '18px', transform: 'rotate(180deg)' }} />
              </button>
            </form>
          </div>
        </div>

        {/* ========================================================
            RIGHT COLUMN: SETTINGS FORM (AI Personality & Settings)
           ======================================================== */}
        <div className="form-column">
          <div className="card-3d" style={{ padding: '30px 40px', background: '#fff', borderRadius: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.03)' }}>
            
            {/* Section Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: 'var(--teacher-primary)', fontWeight: 900, fontSize: '1.25rem' }}>
                <Settings style={{ width: '24px', height: '24px' }} />
                <span>إعدادات البوت والذكاء الاصطناعي</span>
              </div>
              <span style={{ background: '#fef3c7', color: '#d97706', padding: '5px 14px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Sparkles style={{ width: '12px', height: '12px' }} />
                RAG Engine v2.5
              </span>
            </div>

            {/* 1. SELECT STORY ACCORDION / SELECTOR */}
            <div className="form-group" style={{ marginBottom: '25px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '0.92rem', marginBottom: '10px', color: '#374151' }}>
                <BookOpen style={{ width: '16px', height: '16px', color: 'var(--teacher-primary)' }} />
                <span>القصة المحددة للتطبيق والمحاكاة</span>
              </label>
              
              {stories.length === 0 ? (
                <div style={{
                  padding: '20px',
                  background: '#fef2f2',
                  border: '1px dashed #f87171',
                  borderRadius: '16px',
                  color: '#991b1b',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  lineHeight: '1.6'
                }}>
                  ⚠️ لم تقم برفع أي قصة بعد! لحماية الطلاب والـ RAG، يجب إضافة قصة أولاً في كاتب القصص لتتمكن من تفعيل شخصية البوت عليها.
                  <a href="/teacher/story-author" style={{
                    display: 'block',
                    marginTop: '10px',
                    color: 'var(--teacher-primary)',
                    textDecoration: 'underline',
                    fontWeight: 800
                  }}>
                    الانتقال لصفحة كتابة ورفع قصة 👈
                  </a>
                </div>
              ) : (
                <div style={{ position: 'relative' }}>
                  <select 
                    value={selectedStoryId}
                    onChange={handleStoryChange}
                    style={{ 
                      width: '100%', 
                      padding: '14px 20px', 
                      borderRadius: '16px', 
                      border: '1px solid #e5e7eb', 
                      background: '#f9fafb', 
                      outline: 'none',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      color: '#1f2937',
                      appearance: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {stories.map(s => (
                      <option key={s._id} value={s._id}>
                        {s.title} ({s.language})
                      </option>
                    ))}
                  </select>
                  <ChevronDown style={{ 
                    position: 'absolute', 
                    left: '20px', 
                    top: '50%', 
                    transform: 'translateY(-50%)', 
                    pointerEvents: 'none',
                    color: '#6b7280',
                    width: '18px',
                    height: '18px'
                  }} />
                </div>
              )}
            </div>

            {/* 2. PERSONALITY SETTINGS INPUTS */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
              <div className="form-group">
                <label style={{ display: 'block', fontWeight: 800, fontSize: '0.92rem', marginBottom: '10px', color: '#374151' }}>اسم الشخصية (AI Character Name)</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: حكيم القرية"
                  style={{ width: '100%', padding: '14px 20px', borderRadius: '16px', border: '1px solid #e5e7eb', background: '#f9fafb', outline: 'none', fontSize: '0.88rem', fontWeight: 700 }} 
                />
              </div>
              <div className="form-group">
                <label style={{ display: 'block', fontWeight: 800, fontSize: '0.92rem', marginBottom: '10px', color: '#374151' }}>نبرة وأسلوب البوت (Tone/Role)</label>
                <input 
                  type="text" 
                  value={tone} 
                  onChange={(e) => setTone(e.target.value)}
                  placeholder="مثال: ودود وصبور (Friendly)" 
                  style={{ width: '100%', padding: '14px 20px', borderRadius: '16px', border: '1px solid #e5e7eb', background: '#f9fafb', outline: 'none', fontSize: '0.88rem', fontWeight: 700 }} 
                />
              </div>
            </div>

            {/* Presets Quick Picker */}
            <div style={{ marginBottom: '25px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#6b7280', display: 'block', marginBottom: '8px' }}>
                نماذج شخصيات سريعة للتحميل:
              </span>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {[
                  { n: "حكيم القرية", t: "غامض ووقور", p: "أنت حكيم قرية قديم تتحدث بحكمة هادئة. ركز على معاني ومغزى القصة، واطرح أسئلة فلسفية بسيطة حول الدروس المستفادة. لا تعط الإجابة بطريقة مباشرة." },
                  { n: "المعلم المشجع", t: "مرح وحيوي", p: "أنت معلم لغة إنجليزية/عربية ودود للغاية ومرح ومتحمس جداً. شجع الطالب بكلمات حماسية كبرى مثل 'رائع!' و'أنت بطل!'. فسر الكلمات الصعبة ببساطة وعلمية." },
                  { n: "المستكشف الذكي", t: "فضولي وعلمي", p: "أنت مستكشف مغامر تسافر بين العوالم والقصص. تحب التفاصيل الدقيقة وحقائق العلوم. شجع الطالب على البحث خلف السطور وكشف الأسرار." }
                ].map((preset, pIdx) => (
                  <button 
                    key={pIdx}
                    onClick={() => {
                      setName(preset.n);
                      setTone(preset.t);
                      setSystemPrompt(preset.p);
                      showToast(`تم تحميل نموذج: ${preset.n}`, "success");
                    }}
                    style={{
                      background: '#f3f4f6',
                      border: '1px solid #e5e7eb',
                      padding: '6px 14px',
                      borderRadius: '10px',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      color: '#4b5563',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => { e.target.style.backgroundColor = '#e5e7eb'; }}
                    onMouseOut={(e) => { e.target.style.backgroundColor = '#f3f4f6'; }}
                  >
                    💡 {preset.n}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. COMPLEXITY / DIFFICULTY SLIDER */}
            <div className="difficulty-section" style={{ marginBottom: '30px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ display: 'block', fontWeight: '800', fontSize: '0.92rem', color: '#374151' }}>
                  مستوى صعوبة المحادثة واللغة (Complexity)
                </label>
                <span style={{ 
                  background: 'var(--teacher-primary-light)', 
                  color: 'var(--teacher-primary)', 
                  padding: '4px 12px', 
                  borderRadius: '10px', 
                  fontSize: '0.75rem', 
                  fontWeight: 900 
                }}>
                  {difficulty < 40 ? 'مبتدئ (مبسط)' : difficulty < 75 ? 'متوسط (تعليمي)' : 'متقدم (بلاغي)'} ({difficulty}%)
                </span>
              </div>
              <div style={{ width: '100%', position: 'relative', padding: '10px 0' }}>
                <input 
                  type="range" 
                  className="custom-slider" 
                  min="10"
                  max="100"
                  value={difficulty} 
                  onChange={(e) => setDifficulty(Number(e.target.value))} 
                  style={{ width: '100%', cursor: 'pointer', appearance: 'none', background: 'transparent' }} 
                />
              </div>
            </div>

            {/* 4. SYSTEM PROMPT INSTRUCTIONS */}
            <div className="form-group" style={{ marginBottom: '30px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <label style={{ display: 'block', fontWeight: 800, fontSize: '0.92rem', color: '#374151' }}>
                  تعليمات البوت وتوجيهات الحوار (System Prompt)
                </label>
                <span style={{ fontSize: '0.72rem', color: '#9ca3af', fontWeight: 700 }}>
                  تتحكم هذه التوجيهات في سلوك البوت وأهدافه التعليمية
                </span>
              </div>
              <textarea 
                value={systemPrompt} 
                onChange={(e) => setSystemPrompt(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '15px 20px', 
                  borderRadius: '16px', 
                  border: '1px solid #e5e7eb', 
                  background: '#f9fafb', 
                  outline: 'none', 
                  height: '110px', 
                  resize: 'none',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  lineHeight: '1.5'
                }}
              ></textarea>
            </div>

            {/* 5. XP REWARDS COUNTER */}
            <div style={{ 
              background: 'var(--teacher-primary-light)', 
              border: '2px dashed var(--teacher-primary)', 
              borderRadius: '20px', 
              padding: '20px 25px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              marginBottom: '30px' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div className="stat-icon-3d" style={{ 
                  width: '44px', 
                  height: '44px', 
                  background: '#f59e0b', 
                  color: '#fff',
                  borderRadius: '12px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  boxShadow: '0 5px 15px rgba(245, 158, 11, 0.3)'
                }}>
                  <Award style={{ width: '22px', height: '22px' }} />
                </div>
                <div className="xp-text">
                  <h5 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: 'var(--teacher-primary)' }}>مكافآت نقاط الخبرة (XP Rewards)</h5>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#4b5563', fontWeight: 600 }}>النقاط التي يكسبها الطالب عند كل تفاعل كامل</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button 
                  type="button"
                  style={{ width: '32px', height: '32px', borderRadius: '10px', border: '1px solid #d1d5db', background: '#fff', cursor: 'pointer', fontWeight: 800, display: 'flex', justifyContent: 'center', alignItems: 'center' }} 
                  onClick={() => setXp(Math.max(10, xp - 5))}
                >-</button>
                <div style={{ background: '#fff', padding: '6px 20px', borderRadius: '10px', fontWeight: 900, border: '1px solid #eee', fontSize: '1rem', minWidth: '55px', textAlign: 'center' }}>
                  {xp}
                </div>
                <button 
                  type="button"
                  style={{ width: '32px', height: '32px', borderRadius: '10px', border: '1px solid #d1d5db', background: '#fff', cursor: 'pointer', fontWeight: 800, display: 'flex', justifyContent: 'center', alignItems: 'center' }} 
                  onClick={() => setXp(Math.min(200, xp + 5))}
                >+</button>
              </div>
            </div>

            {/* BUTTON GROUP: Save Config & Re-chunk vector index */}
            <div className="btn-group" style={{ display: 'flex', gap: '15px' }}>
              <button 
                type="button"
                onClick={handleSaveSettings}
                disabled={saving || !selectedStoryId}
                className="btn-3d-primary" 
                style={{ 
                  flexGrow: 1, 
                  justifyContent: 'center',
                  background: saving ? '#9ca3af' : 'var(--teacher-primary)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '14px 20px',
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  cursor: saving ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: saving ? 'none' : '0 6px 20px rgba(93, 162, 150, 0.3)',
                  transition: 'all 0.2s'
                }}
              >
                {saving ? (
                  <>
                    <RefreshCw className="animate-spin" style={{ width: '18px', height: '18px' }} />
                    <span>جاري تفعيل الإعدادات...</span>
                  </>
                ) : (
                  <>
                    <Check style={{ width: '18px', height: '18px' }} />
                    <span>حفظ وتفعيل شخصية البوت</span>
                  </>
                )}
              </button>

              <button 
                type="button"
                onClick={handleRechunk}
                disabled={rechunking || !selectedStoryId}
                className="btn-3d-secondary" 
                style={{ 
                  width: '210px', 
                  justifyContent: 'center',
                  background: '#fff',
                  color: '#4b5563',
                  border: '1px solid #d1d5db',
                  borderRadius: '16px',
                  padding: '14px 20px',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  cursor: rechunking ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s'
                }}
              >
                <RefreshCw className={rechunking ? "animate-spin" : ""} style={{ width: '16px', height: '16px' }} />
                <span>{rechunking ? "جاري الفهرسة..." : "إعادة الفهرسة (RAG)"}</span>
              </button>
            </div>
          </div>

          {/* EXTRA STATS CARDS & DESIGN TIPS */}
          <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
            
            {/* System Info card */}
            <div className="card-3d" style={{ padding: '20px', background: 'rgba(93, 162, 150, 0.04)', border: '1px solid rgba(93, 162, 150, 0.1)', borderRadius: '24px', display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
              <div style={{ 
                width: '38px', 
                height: '38px', 
                background: 'rgba(93, 162, 150, 0.15)', 
                color: 'var(--teacher-primary)',
                borderRadius: '12px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexShrink: 0
              }}>
                <Sparkles style={{ width: '18px', height: '18px' }} />
              </div>
              <div>
                <h6 style={{ margin: '0 0 5px 0', fontSize: '0.85rem', fontWeight: 800, color: 'var(--teacher-primary)' }}>نصيحة لتوجيه الـ RAG:</h6>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#4b5563', lineHeight: '1.5', fontWeight: 600 }}>
                  كلما كانت القصة غنية بالأحداث والتفاصيل، كلما تمكن البوت من الرد بدقة مستشهداً بالنصوص المحددة دون أي تخيلات أو هلوسات خارجية!
                </p>
              </div>
            </div>

            {/* Performance status indicator card */}
            <div className="card-3d" style={{ padding: '20px', background: '#fff', borderRadius: '24px', border: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h6 style={{ margin: 0, fontSize: '0.72rem', color: '#6b7280', fontWeight: 800 }}>حالة اتصال Gemini AI</h6>
                <span style={{ 
                  fontSize: '0.9rem', 
                  fontWeight: 900, 
                  color: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginTop: '5px'
                }}>
                  <span style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%' }}></span>
                  نشط وآمن (TLS)
                </span>
              </div>
              <div style={{ fontSize: '1.4rem' }}>🚀</div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISettings;
