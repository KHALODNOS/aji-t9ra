import React, { useState, useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import {
  CheckCircle,
  XCircle,
  Eye,
  Globe,
  User,
  Trash2,
  Search,
  Filter,
  Loader2,
  BookOpen,
  MessageSquare,
  Volume2,
  Calendar,
  X,
  Trophy,
  Gamepad2,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  HelpCircle,
  Sparkles,
  Info,
  Check,
  AlertCircle
} from "lucide-react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

const getArabicExplanation = (question: any, selected: string, isCorrect: boolean) => {
  const type = question.type;
  const correct = question.correctAnswer;
  
  if (isCorrect) {
    switch (type) {
      case 'choice':
        return `أحسنت! إجابتك صحيحة تماماً. الخيار "${correct}" هو الإجابة الدقيقة والمطابقة لسياق السؤال.`;
      case 'translate':
        return `ترجمة ممتازة ومطابقة! الترجمة النموذجية المعتمدة هي "${correct}".`;
      case 'fill_blanks':
        return `ملء رائع! الكلمة "${correct}" هي اللفظة الأصح لسد الفراغ وإتمام المعنى اللغوي للجملة.`;
      case 'correct_form':
        return `صيغة صحيحة 100%! الكلمة "${correct}" تمثل الهيكل الصرفي/الزمني المناسب لقواعد هذه الجملة.`;
      default:
        return `أحسنت! إجابتك مطابقة للإجابة النموذجية المعتمدة.`;
    }
  } else {
    switch (type) {
      case 'choice':
        return `للأسف الإجابة غير صحيحة. الإجابة النموذجية هي "${correct}". الشرح: هذا الخيار يعبّر بدقة عن الجواب المطلوب لغوياً بينما الخيارات الأخرى غير مناسبة.`;
      case 'translate':
        return `للأسف، الترجمة المقترحة غير دقيقة. الترجمة النموذجية هي "${correct}". الشرح: هذه هي الترجمة الأكثر مطابقة للمعنى والسياق اللغوي الأصلي.`;
      case 'fill_blanks':
        return `للأسف الإجابة خاطئة. الكلمة الصحيحة لملء الفراغ هي "${correct}". الشرح: تناسب هذه الكلمة السياق اللفظي لتصبح الجملة مفهومة ومكتملة.`;
      case 'correct_form':
        return `صيغة غير صحيحة. الصيغة النحوية الصحيحة هي "${correct}". الشرح: يجب الانتباه لعلامة الإعراب وتطابق الزمن في الجملة لتكون سليمة من الناحية الإملائية والتركيبية.`;
      default:
        return `إجابة خاطئة. الإجابة النموذجية الصحيحة هي "${correct}".`;
    }
  }
};

const ContentReview = () => {
  const [activeTab, setActiveTab] = useState("stories");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [previewItem, setPreviewItem] = useState<any>(null);
  const [isRejecting, setIsRejecting] = useState<string | null>(null);

  // Simulation states for quizzes
  const [simActiveQuestion, setSimActiveQuestion] = useState(0);
  const [simSelectedAnswer, setSimSelectedAnswer] = useState("");
  const [simShowFeedback, setSimShowFeedback] = useState(false);
  const [simAnswers, setSimAnswers] = useState<{ [key: number]: { answer: string; isCorrect: boolean } }>({});
  const [simCompleted, setSimCompleted] = useState(false);
  const [simMode, setSimMode] = useState<"simulation" | "overview">("simulation");
  const [simInputText, setSimInputText] = useState("");

  // Automatically reset simulation whenever a new preview item is opened
  useEffect(() => {
    if (previewItem && (previewItem.type === 'exam' || previewItem.type === 'test' || activeTab === 'tests')) {
      setSimActiveQuestion(0);
      setSimSelectedAnswer("");
      setSimShowFeedback(false);
      setSimAnswers({});
      setSimCompleted(false);
      setSimMode("simulation");
      setSimInputText("");
    }
  }, [previewItem]);

  const fetchPendingContent = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/admin/pending-content?type=${activeTab}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching content:", error);
      toast.error("فشل تحميل المحتوى");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingContent();
  }, [activeTab]);

  const handleApprove = async (id: string, type: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/admin/approve-content/${id}?contentType=${type}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("تمت الموافقة على المحتوى ونشره");
      setItems(items.filter(item => item._id !== id));
      if (previewItem?._id === id) setPreviewItem(null);
    } catch (error) {
      toast.error("فشل اعتماد المحتوى");
    }
  };

  const handleReject = async (id: string, type: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/admin/reject-content/${id}?contentType=${type}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("تم رفض المحتوى وحذفه");
      setItems(items.filter(item => item._id !== id));
      if (previewItem?._id === id) setPreviewItem(null);
    } catch (error) {
      toast.error("فشل رفض المحتوى");
    } finally {
      setIsRejecting(null);
    }
  };

  const handleBulkApprove = async () => {
    if (selectedItems.length === 0) return;
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/admin/bulk-approve`, {
        contentIds: selectedItems,
        contentType: activeTab === 'stories' ? 'story' : activeTab
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`تمت الموافقة على ${selectedItems.length} عناصر`);
      setItems(items.filter(item => !selectedItems.includes(item._id)));
      setSelectedItems([]);
    } catch (error) {
      toast.error("فشل الموافقة الجماعية");
    }
  };

  const handleBulkReject = async () => {
    if (selectedItems.length === 0) return;
    if (!window.confirm(`هل أنت متأكد من رفض وحذف ${selectedItems.length} عناصر؟`)) return;
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/admin/bulk-reject`, {
        contentIds: selectedItems,
        contentType: activeTab === 'stories' ? 'story' : activeTab
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`تم رفض وحذف ${selectedItems.length} عناصر`);
      setItems(items.filter(item => !selectedItems.includes(item._id)));
      setSelectedItems([]);
    } catch (error) {
      toast.error("فشل الرفض الجماعي");
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedItems.length === items.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(items.map(i => i._id));
    }
  };

  return (
    <AdminLayout>
      <Toaster position="top-center" />
      <div className="space-y-8" dir="rtl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-[#003F87] mb-2 font-heading">مراجعة المحتوى</h1>
            <p className="text-slate-400 font-medium">قم بمراجعة واعتماد القصص والوسائط المضافة من قبل المدرسين.</p>
          </div>

          <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
            {["stories", "videos", "tests"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === tab
                  ? "bg-[#003F87] text-white shadow-lg shadow-[#003F87]/20"
                  : "text-slate-400 hover:bg-slate-50"
                  }`}
              >
                {tab === "stories" ? "القصص" : tab === "videos" ? "الفيديوهات" : "الاختبارات"}
              </button>
            ))}
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <button
              onClick={selectAll}
              className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#003F87] transition-colors"
            >
              <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${selectedItems.length === items.length && items.length > 0
                ? "bg-[#003F87] border-[#003F87]"
                : "border-slate-200"
                }`}>
                {selectedItems.length === items.length && items.length > 0 && <X className="w-3 h-3 text-white" />}
              </div>
              تحديد الكل
            </button>

            {selectedItems.length > 0 && (
              <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4">
                <span className="text-sm font-bold text-[#003F87] ml-2">تم تحديد {selectedItems.length}</span>
                <button
                  onClick={handleBulkApprove}
                  className="px-4 py-2 bg-green-50 text-green-600 rounded-xl font-bold text-xs hover:bg-green-100 transition-all border border-green-100 flex items-center gap-2"
                >
                  <CheckCircle size={14} /> موافقة
                </button>
                <button
                  onClick={handleBulkReject}
                  className="px-4 py-2 bg-red-50 text-red-600 rounded-xl font-bold text-xs hover:bg-red-100 transition-all border border-red-100 flex items-center gap-2"
                >
                  <Trash2 size={14} /> حذف
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="ابحث بالعنوان أو المدرس..."
                className="bg-slate-50 border border-slate-100 rounded-xl py-2.5 pr-12 pl-4 text-sm focus:ring-2 focus:ring-[#003F87]/10 outline-none w-64"
              />
            </div>
            <button className="p-2.5 text-slate-400 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all border border-slate-100">
              <Filter size={18} />
            </button>
          </div>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-[#003F87]" size={40} />
            <p className="text-slate-400 font-bold">جاري تحميل المحتوى...</p>
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                key={item._id}
                className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative"
              >
                {/* Selection Checkbox */}
                <div
                  onClick={() => toggleSelect(item._id)}
                  className={`absolute top-4 right-4 z-10 w-6 h-6 rounded-lg border-2 cursor-pointer transition-all flex items-center justify-center ${selectedItems.includes(item._id)
                    ? "bg-[#003F87] border-[#003F87]"
                    : "bg-white/80 backdrop-blur border-white shadow-sm"
                    }`}
                >
                  {selectedItems.includes(item._id) && <X className="w-4 h-4 text-white" />}
                </div>

                <div className="relative aspect-video">
                  <img
                    src={item.thumbnail || item.coverImage || (activeTab === 'tests' ? 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600' : item.type === 'video' ? 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600' : 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=500')}
                    className="w-full h-full object-cover"
                    alt={item.title || item.name}
                  />
                  {item.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30">
                        <i className="fa-solid fa-play"></i>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  
                  {/* Top Level Badge for Tests */}
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10 pointer-events-none">
                    {activeTab === 'tests' && (
                      <span className={`px-3 py-1 rounded-full text-xs font-black text-white shadow-md ${
                        item.level === 'مبتدئ' ? 'bg-emerald-500' :
                        item.level === 'متوسط' ? 'bg-amber-500' :
                        'bg-rose-500'
                      }`}>
                        {item.level || 'مبتدئ'}
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                      {item.language || (activeTab === 'tests' ? 'العربية' : 'Arabic')}
                    </span>
                    <span className="text-white/80 text-[10px] font-bold flex items-center gap-1">
                      <Calendar size={10} /> {new Date(item.createdAt || Date.now()).toLocaleDateString('ar-MA')}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 mb-1 line-clamp-1">{item.title || item.name}</h3>
                    <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                      <div className="flex items-center gap-2">
                        <User size={14} className="text-[#003F87]" />
                        {item.teacherName || item.teacher?.username || 'مدرس المادة'}
                      </div>
                      {activeTab === 'tests' && (
                        <div className="flex items-center gap-3">
                          <span className="bg-blue-50 text-[#003F87] px-2 py-0.5 rounded-lg font-black text-[10px]">
                            {item.questions?.length || 0} أسئلة
                          </span>
                          <span className="bg-amber-50 text-amber-600 px-2 py-0.5 rounded-lg font-black text-[10px]">
                            ⭐ {item.xpReward || 150} XP
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      onClick={() => setPreviewItem({ ...item, type: item.type || 'test' })}
                      className="flex items-center justify-center gap-2 py-3 bg-slate-50 text-slate-600 rounded-2xl font-bold text-xs hover:bg-[#003F87] hover:text-white transition-all group/btn"
                    >
                      <Eye size={14} /> معاينة وتجربة
                    </button>
                    <button
                      onClick={() => handleApprove(item._id, item.type || (activeTab === 'tests' ? 'test' : 'story'))}
                      className="flex items-center justify-center gap-2 py-3 bg-[#003F87] text-white rounded-2xl font-bold text-xs hover:bg-[#002d61] shadow-lg shadow-[#003F87]/20 transition-all"
                    >
                      <CheckCircle size={14} /> اعتماد
                    </button>
                  </div>

                  <button
                    onClick={() => handleReject(item._id, item.type || (activeTab === 'tests' ? 'test' : 'story'))}
                    className="w-full py-3 text-red-500 font-bold text-xs hover:bg-red-50 rounded-2xl transition-all border border-transparent hover:border-red-100"
                  >
                    رفض المحتوى
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] p-20 text-center border border-slate-100">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
              <BookOpen size={48} />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-2">لا يوجد محتوى بانتظار المراجعة</h3>
            <p className="text-slate-400 font-medium">سيظهر هنا أي محتوى يقوم المدرسون بإضافته للمراجعة.</p>
          </div>
        )}

        {/* Preview Modal */}
        <AnimatePresence>
          {previewItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10"
            >
              <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                onClick={() => setPreviewItem(null)}
              ></div>

              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden relative z-10 flex flex-col"
              >
                {/* Modal Header */}
                <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#003F87]/10 rounded-2xl flex items-center justify-center text-[#003F87]">
                      <BookOpen size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-slate-900">{previewItem.title}</h2>
                      <p className="text-sm text-slate-400 font-bold flex items-center gap-2">
                        <User size={14} /> {previewItem.teacherName || previewItem.teacher?.username}
                        <span className="mx-2">•</span>
                        <Globe size={14} /> {previewItem.language}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setPreviewItem(null)}
                    className="w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center hover:bg-slate-100 transition-all"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="flex-1 overflow-y-auto p-8 space-y-10">
                  {previewItem.type === 'video' ? (
                    <div className="space-y-6">
                      <div className="aspect-video w-full rounded-[2.5rem] overflow-hidden shadow-2xl bg-black border-4 border-slate-100">
                        <video
                          key={previewItem.url}
                          controls
                          className="w-full h-full object-contain"
                          src={previewItem.url}
                          poster={previewItem.thumbnail || previewItem.coverImage}
                        >
                          متصفحك لا يدعم تشغيل الفيديو.
                        </video>
                      </div>

                      <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                        <h4 className="text-lg font-black text-[#003F87] mb-4 flex items-center gap-2">
                          <MessageSquare size={20} /> وصف الفيديو
                        </h4>
                        <p className="text-slate-700 leading-relaxed font-medium">
                          {previewItem.description || "لا يوجد وصف متاح."}
                        </p>
                      </div>

                      <div className="bg-blue-50 p-6 rounded-[2rem] border border-blue-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#003F87] shadow-sm">
                            <Globe size={20} />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-[#003F87] uppercase tracking-wider">اللغة</p>
                            <p className="font-black text-[#003F87]">{previewItem.language}</p>
                          </div>
                        </div>
                        <div className="text-left">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">تاريخ الرفع</p>
                          <p className="font-black text-slate-600">{new Date(previewItem.createdAt).toLocaleDateString('ar-MA')}</p>
                        </div>
                      </div>
                    </div>
                  ) : previewItem.type === 'exam' || previewItem.type === 'test' || activeTab === 'tests' ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {/* Left Side: Quiz View / Simulation */}
                      <div className="md:col-span-2 space-y-6">
                        
                        {/* Simulation / Overview Mode Switcher */}
                        <div className="flex justify-between items-center bg-slate-50 p-4 rounded-3xl border border-slate-100">
                          <div className="flex items-center gap-3">
                            <span className="w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
                            <h4 className="text-sm font-bold text-slate-700">شاشة مراجعة الاختبار</h4>
                          </div>
                          
                          <div className="flex bg-slate-200/60 p-1.5 rounded-2xl">
                            <button
                              onClick={() => setSimMode("simulation")}
                              className={`px-5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                                simMode === "simulation" 
                                  ? "bg-white text-[#003F87] shadow-md shadow-slate-200/50" 
                                  : "text-slate-500 hover:text-slate-700"
                              }`}
                            >
                              <Gamepad2 size={14} /> 🎮 وضع المحاكاة التفاعلية
                            </button>
                            <button
                              onClick={() => setSimMode("overview")}
                              className={`px-5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                                simMode === "overview" 
                                  ? "bg-white text-[#003F87] shadow-md shadow-slate-200/50" 
                                  : "text-slate-500 hover:text-slate-700"
                              }`}
                            >
                              <BookOpen size={14} /> 📋 الهيكل الكامل للأسئلة
                            </button>
                          </div>
                        </div>

                        {/* Interactive Simulation Mode */}
                        {simMode === "simulation" ? (
                          <div className="bg-slate-50/70 p-8 rounded-[2.5rem] border border-slate-100/80 shadow-inner relative overflow-hidden text-right" dir="rtl">
                            {!previewItem.questions || previewItem.questions.length === 0 ? (
                              <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
                                <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                <h5 className="font-black text-slate-700 mb-2">لا توجد أسئلة مضافة</h5>
                                <p className="text-slate-400 text-xs font-medium">هذا الاختبار لا يحتوي على أي أسئلة للمحاكاة.</p>
                              </div>
                            ) : simCompleted ? (
                              /* Scoreboard Screen */
                              <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl text-center space-y-6"
                              >
                                <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-500 shadow-md">
                                  <Trophy size={40} className="animate-bounce" />
                                </div>
                                
                                <div className="space-y-2">
                                  <h3 className="text-2xl font-black text-slate-800">اكتملت محاكاة الاختبار بنجاح! 🏆</h3>
                                  <p className="text-slate-400 text-xs font-medium max-w-md mx-auto">
                                    لقد قمت بمحاكاة تجربة الطالب بالكامل. يمكنك مراجعة النتيجة أدناه واتخاذ قرار الاعتماد أو الرفض.
                                  </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                  <div className="text-center border-l border-slate-200">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">النتيجة المحققة</p>
                                    <p className="text-2xl font-black text-[#003F87]">
                                      {Object.values(simAnswers).filter(a => a.isCorrect).length} / {previewItem.questions.length}
                                    </p>
                                  </div>
                                  <div className="text-center">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">نقاط الخبرة المتوقعة</p>
                                    <p className="text-2xl font-black text-amber-500">
                                      ⭐ {previewItem.xpReward || 150} XP
                                    </p>
                                  </div>
                                </div>

                                <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
                                  <button
                                    onClick={() => {
                                      setSimActiveQuestion(0);
                                      setSimSelectedAnswer("");
                                      setSimShowFeedback(false);
                                      setSimAnswers({});
                                      setSimCompleted(false);
                                      setSimInputText("");
                                    }}
                                    className="px-6 py-3 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2"
                                  >
                                    <RotateCcw size={14} /> إعادة تشغيل المحاكاة
                                  </button>
                                  <button
                                    onClick={() => setSimMode("overview")}
                                    className="px-6 py-3 bg-blue-50 text-[#003F87] hover:bg-blue-100 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2"
                                  >
                                    <BookOpen size={14} /> عرض الأسئلة كاملة
                                  </button>
                                </div>
                              </motion.div>
                            ) : (
                              /* Question Simulation Step */
                              <div className="space-y-6">
                                {/* Top Progress and Indicators */}
                                <div className="flex justify-between items-center text-xs font-bold text-slate-400">
                                  <div className="flex items-center gap-2">
                                    <span className="bg-[#003F87]/10 text-[#003F87] px-2.5 py-1 rounded-lg text-[10px] font-black uppercase">
                                      {previewItem.questions[simActiveQuestion].type === "choice" ? "اختيار من متعدد" :
                                       previewItem.questions[simActiveQuestion].type === "translate" ? "ترجمة عبارة" :
                                       previewItem.questions[simActiveQuestion].type === "fill_blanks" ? "ملء الفراغات" :
                                       "صيغة الكلمة الصحيحة"}
                                    </span>
                                  </div>
                                  <span>السؤال {simActiveQuestion + 1} من {previewItem.questions.length}</span>
                                </div>

                                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-6 flex">
                                  <div 
                                    className="bg-gradient-to-r from-emerald-400 to-[#003F87] h-full rounded-full transition-all duration-300"
                                    style={{ width: `${((simActiveQuestion + 1) / previewItem.questions.length) * 100}%` }}
                                  ></div>
                                </div>

                                {/* Active Question Card */}
                                <motion.div 
                                  key={simActiveQuestion}
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4"
                                >
                                  {/* Explanation Header in Arabic */}
                                  <div className="bg-[#003F87]/5 p-4 rounded-2xl border border-[#003F87]/10 flex gap-3 items-start text-right">
                                    <Info className="w-4 h-4 text-[#003F87] mt-0.5 flex-shrink-0" />
                                    <div>
                                      <p className="text-[10px] font-black text-[#003F87] mb-1">توضيح السؤال بالعربية:</p>
                                      <p className="text-slate-600 text-xs font-medium leading-relaxed">
                                        {previewItem.questions[simActiveQuestion].type === "choice" ? "اقرأ السؤال باللغة الأجنبية ثم اختر الإجابة المناسبة من بين الخيارات المعروضة لتكمل المعنى." :
                                         previewItem.questions[simActiveQuestion].type === "translate" ? "ترجم الجملة المكتوبة بدقة وعناية واكتب إجابتك لتطابق المعنى الصحيح." :
                                         previewItem.questions[simActiveQuestion].type === "fill_blanks" ? "اكتب الكلمة الناقصة المناسبة لتعبئة الفراغ [blank] في الجملة لغوياً وسياقياً." :
                                         "اختر الهيكل النحوي أو الصيغة الصرفية الصحيحة للكلمة لتناسب سياق الجملة."}
                                      </p>
                                    </div>
                                  </div>

                                  <h4 className="text-lg font-black text-slate-800 leading-relaxed text-right">
                                    {previewItem.questions[simActiveQuestion].text}
                                  </h4>

                                  {/* Question Input Area */}
                                  <div className="pt-2">
                                    {/* Choice & Grammatical Form Options */}
                                    {(previewItem.questions[simActiveQuestion].type === "choice" || previewItem.questions[simActiveQuestion].type === "correct_form") && (
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {previewItem.questions[simActiveQuestion].options?.map((opt: string, idx: number) => {
                                          const isSelected = simSelectedAnswer === opt;
                                          const isCorrectAnswer = opt === previewItem.questions[simActiveQuestion].correctAnswer;
                                          
                                          let btnClass = "bg-slate-50/50 border-slate-100 hover:bg-slate-50 text-slate-600";
                                          if (isSelected && !simShowFeedback) {
                                            btnClass = "bg-blue-50 border-blue-300 text-blue-800 shadow-sm";
                                          } else if (simShowFeedback) {
                                            if (isCorrectAnswer) {
                                              btnClass = "bg-emerald-50 border-emerald-300 text-emerald-800 font-black shadow-sm";
                                            } else if (isSelected) {
                                              btnClass = "bg-rose-50 border-rose-300 text-rose-800 font-bold shadow-sm";
                                            } else {
                                              btnClass = "bg-slate-100/50 border-slate-200/50 text-slate-400 opacity-60";
                                            }
                                          }

                                          return (
                                            <button
                                              key={idx}
                                              disabled={simShowFeedback}
                                              onClick={() => setSimSelectedAnswer(opt)}
                                              className={`p-4 rounded-2xl border text-sm font-bold flex items-center justify-between text-right transition-all duration-200 ${btnClass}`}
                                            >
                                              <span>{opt}</span>
                                              <div className="flex items-center gap-2">
                                                {simShowFeedback && isCorrectAnswer && <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />}
                                                {simShowFeedback && isSelected && !isCorrectAnswer && <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />}
                                                {!simShowFeedback && (
                                                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? "border-blue-500 bg-blue-500" : "border-slate-300 bg-white"}`}>
                                                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                                                  </div>
                                                )}
                                              </div>
                                            </button>
                                          );
                                        })}
                                      </div>
                                    )}

                                    {/* Translation Input */}
                                    {previewItem.questions[simActiveQuestion].type === "translate" && (
                                      <div className="space-y-4">
                                        <textarea
                                          disabled={simShowFeedback}
                                          value={simInputText}
                                          onChange={(e) => setSimInputText(e.target.value)}
                                          placeholder="اكتب ترجمتك هنا باللغة العربية..."
                                          className="w-full min-h-[100px] p-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 font-medium focus:ring-2 focus:ring-[#003F87]/20 outline-none resize-none transition-all text-right"
                                          dir="rtl"
                                        />
                                        {simShowFeedback && (
                                          <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start gap-3 text-right">
                                            <Check className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                              <p className="text-[10px] font-black text-emerald-600">الترجمة النموذجية المعتمدة:</p>
                                              <p className="font-black text-emerald-800 text-sm">{previewItem.questions[simActiveQuestion].correctAnswer}</p>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    )}

                                    {/* Fill Blanks Input */}
                                    {previewItem.questions[simActiveQuestion].type === "fill_blanks" && (
                                      <div className="space-y-4">
                                        <div className="flex items-center gap-3 justify-end text-right">
                                          <input
                                            type="text"
                                            disabled={simShowFeedback}
                                            value={simInputText}
                                            onChange={(e) => setSimInputText(e.target.value)}
                                            placeholder="اكتب الكلمة هنا..."
                                            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-black focus:ring-2 focus:ring-[#003F87]/20 outline-none transition-all text-right"
                                            dir="rtl"
                                          />
                                          <span className="text-sm font-bold text-slate-500">أدخل الكلمة المفقودة:</span>
                                        </div>
                                        {simShowFeedback && (
                                          <div className="space-y-3 text-right">
                                            <div className="p-4 bg-slate-100 border border-slate-200 rounded-2xl text-slate-700 text-xs font-bold leading-relaxed">
                                              <span className="font-bold text-slate-400">معاينة الجملة المحلولة:</span>
                                              <p className="mt-1 font-black text-slate-800">
                                                {previewItem.questions[simActiveQuestion].text.replace("[blank]", ` (${previewItem.questions[simActiveQuestion].correctAnswer}) `)}
                                              </p>
                                            </div>
                                            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start gap-3">
                                              <Check className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                                              <div>
                                                <p className="text-[10px] font-black text-emerald-600">الكلمة المفقودة الصحيحة:</p>
                                                <p className="font-black text-emerald-800 text-sm">{previewItem.questions[simActiveQuestion].correctAnswer}</p>
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </motion.div>

                                {/* Interactive Verification Alert / Feedback with Arabic explanation */}
                                {simShowFeedback && (
                                  <motion.div
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`p-5 rounded-3xl border flex gap-4 text-right ${
                                      simAnswers[simActiveQuestion]?.isCorrect
                                        ? "bg-emerald-50 border-emerald-100 text-emerald-800"
                                        : "bg-rose-50 border-rose-100 text-rose-800"
                                    }`}
                                    dir="rtl"
                                  >
                                    <div className="mt-0.5">
                                      {simAnswers[simActiveQuestion]?.isCorrect ? (
                                        <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                                      ) : (
                                        <XCircle className="w-6 h-6 text-rose-600 flex-shrink-0" />
                                      )}
                                    </div>
                                    
                                    <div className="space-y-1">
                                      <h5 className="font-black text-sm">
                                        {simAnswers[simActiveQuestion]?.isCorrect ? "إجابة صحيحة وممتازة! 🎉" : "للأسف، إجابة غير صحيحة"}
                                      </h5>
                                      <p className="text-xs font-semibold leading-relaxed">
                                        {getArabicExplanation(
                                          previewItem.questions[simActiveQuestion],
                                          simSelectedAnswer || simInputText,
                                          simAnswers[simActiveQuestion]?.isCorrect
                                        )}
                                      </p>
                                    </div>
                                  </motion.div>
                                )}

                                {/* Action Bar for Simulation Step */}
                                <div className="flex items-center justify-between pt-2">
                                  <button
                                    onClick={() => {
                                      if (simActiveQuestion > 0) {
                                        setSimActiveQuestion(prev => prev - 1);
                                        const prevAns = simAnswers[simActiveQuestion - 1]?.answer || "";
                                        if (previewItem.questions[simActiveQuestion - 1].type === "choice" || previewItem.questions[simActiveQuestion - 1].type === "correct_form") {
                                          setSimSelectedAnswer(prevAns);
                                          setSimInputText("");
                                        } else {
                                          setSimInputText(prevAns);
                                          setSimSelectedAnswer("");
                                        }
                                        setSimShowFeedback(true);
                                      }
                                    }}
                                    disabled={simActiveQuestion === 0}
                                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-500 disabled:opacity-40 disabled:hover:bg-slate-100 rounded-xl font-bold text-xs transition-all flex items-center gap-2"
                                  >
                                    <ArrowRight size={14} /> السؤال السابق
                                  </button>

                                  {!simShowFeedback ? (
                                    <button
                                      onClick={() => {
                                        const question = previewItem.questions[simActiveQuestion];
                                        let isCorrect = false;
                                        const adminAns = (question.type === "choice" || question.type === "correct_form")
                                          ? simSelectedAnswer
                                          : simInputText;
                                        
                                        if (question.type === "choice" || question.type === "correct_form") {
                                          isCorrect = (simSelectedAnswer === question.correctAnswer);
                                        } else {
                                          isCorrect = (simInputText.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase());
                                        }

                                        setSimAnswers(prev => ({
                                          ...prev,
                                          [simActiveQuestion]: { answer: adminAns, isCorrect }
                                        }));
                                        setSimShowFeedback(true);
                                      }}
                                      disabled={
                                        (previewItem.questions[simActiveQuestion].type === "choice" || previewItem.questions[simActiveQuestion].type === "correct_form")
                                          ? !simSelectedAnswer
                                          : !simInputText.trim()
                                      }
                                      className="px-8 py-3 bg-[#003F87] text-white hover:bg-[#002d61] disabled:opacity-50 disabled:hover:bg-[#003F87] rounded-xl font-black text-xs transition-all flex items-center gap-2 shadow-lg shadow-[#003F87]/10"
                                    >
                                      التحقق من الإجابة <Sparkles size={14} />
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => {
                                        if (simActiveQuestion < previewItem.questions.length - 1) {
                                          setSimActiveQuestion(prev => prev + 1);
                                          setSimSelectedAnswer("");
                                          setSimInputText("");
                                          setSimShowFeedback(false);
                                        } else {
                                          setSimCompleted(true);
                                        }
                                      }}
                                      className="px-8 py-3 bg-[#003F87] text-white hover:bg-[#002d61] rounded-xl font-black text-xs transition-all flex items-center gap-2 shadow-lg shadow-[#003F87]/10"
                                    >
                                      {simActiveQuestion < previewItem.questions.length - 1 ? (
                                        <>السؤال التالي <ArrowLeft size={14} /></>
                                      ) : (
                                        <>عرض نتائج المحاكاة <Trophy size={14} /></>
                                      )}
                                    </button>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          /* Detailed Structure Overview Mode */
                          <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 text-right" dir="rtl">
                            <h4 className="text-lg font-black text-[#003F87] mb-6 flex items-center justify-end gap-2">
                              أسئلة الاختبار الكاملة ({previewItem.questions?.length || 0}) <BookOpen size={20} />
                            </h4>
                            
                            {previewItem.questions?.length > 0 ? (
                              <div className="space-y-6">
                                {previewItem.questions.map((question: any, idx: number) => (
                                  <div key={idx} className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm space-y-4 text-right">
                                    <div className="flex items-start justify-between gap-4">
                                      <div className="flex items-center gap-2.5">
                                        <span className="w-8 h-8 rounded-full bg-[#003F87]/10 flex items-center justify-center text-[#003F87] text-xs font-black">
                                          {idx + 1}
                                        </span>
                                        <div>
                                          <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 uppercase tracking-wider">
                                            {question.type === "choice" ? "اختيار من متعدد" :
                                             question.type === "translate" ? "ترجمة عبارة" :
                                             question.type === "fill_blanks" ? "ملء الفراغات" :
                                             "صيغة الكلمة الصحيحة"}
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    <p className="text-slate-800 font-bold text-sm leading-relaxed text-right">
                                      {question.text}
                                    </p>

                                    {/* Render Question Answer Details Based on Type */}
                                    {question.type === "choice" && (
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-right">
                                        {question.options?.map((opt: string, optIdx: number) => (
                                          <div 
                                            key={optIdx} 
                                            className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between text-right ${
                                              opt === question.correctAnswer
                                                ? "bg-green-50 border-green-200 text-green-700 font-black"
                                                : "bg-slate-50/50 border-slate-100 text-slate-500"
                                            }`}
                                          >
                                            <span>{opt}</span>
                                            {opt === question.correctAnswer && (
                                              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    )}

                                    {question.type === "translate" && (
                                      <div className="p-4 rounded-xl bg-green-50/70 border border-green-100/50 flex items-center justify-between text-right">
                                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                                        <div className="text-right">
                                          <p className="text-[10px] text-green-600 font-black mb-1">الترجمة الصحيحة النموذجية:</p>
                                          <p className="text-green-800 font-bold text-xs">{question.correctAnswer}</p>
                                        </div>
                                      </div>
                                    )}

                                    {question.type === "fill_blanks" && (
                                      <div className="space-y-3 text-right">
                                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                          <p className="text-[10px] text-slate-400 font-black mb-1">معاينة الجملة المحلولة:</p>
                                          <p className="text-slate-800 font-bold text-xs leading-relaxed">
                                            {question.text.replace("[blank]", ` (${question.correctAnswer}) `)}
                                          </p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-green-50/70 border border-green-100/50 flex items-center justify-between">
                                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                                          <div className="text-right">
                                            <p className="text-[10px] text-green-600 font-black mb-1">الكلمة المفقودة الصحيحة:</p>
                                            <p className="text-green-800 font-black text-xs">{question.correctAnswer}</p>
                                          </div>
                                        </div>
                                      </div>
                                    )}

                                    {question.type === "correct_form" && (
                                      <div className="space-y-3 text-right">
                                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                          <p className="text-[10px] text-slate-400 font-black mb-1">معاينة الجملة المحلولة:</p>
                                          <p className="text-slate-800 font-bold text-xs leading-relaxed">
                                            {question.text.replace("[blank]", ` (${question.correctAnswer}) `)}
                                          </p>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                          {question.options?.map((opt: string, optIdx: number) => (
                                            <div 
                                              key={optIdx} 
                                              className={`p-2.5 rounded-lg border text-center text-[10px] font-bold ${
                                                opt === question.correctAnswer
                                                  ? "bg-green-50 border-green-200 text-green-700 font-black"
                                                  : "bg-slate-50/50 border-slate-100 text-slate-400"
                                              }`}
                                            >
                                              {opt}
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-10 text-slate-400 font-bold bg-white rounded-[1.5rem] border border-slate-100">
                                لا توجد أسئلة مضافة في هذا الاختبار بعد.
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Right Side: Quiz Info Panel */}
                      <div className="space-y-6">
                        <div className="rounded-[2rem] overflow-hidden shadow-lg border border-slate-100 bg-white">
                          <img 
                            src={previewItem.thumbnail || "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600"} 
                            className="w-full aspect-[4/3] object-cover" 
                            alt="Exam" 
                          />
                        </div>

                        <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 space-y-4 text-right" dir="rtl">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-400 font-bold">اسم الاختبار:</span>
                            <span className="text-slate-900 font-black text-left line-clamp-2 max-w-[60%]">{previewItem.title || previewItem.name}</span>
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-400 font-bold">المستوى الدراسي:</span>
                            <span className={`px-2.5 py-0.5 rounded-lg text-xs font-black text-white ${
                              previewItem.level === 'مبتدئ' ? 'bg-emerald-500' :
                              previewItem.level === 'متوسط' ? 'bg-amber-500' :
                              'bg-rose-500'
                            }`}>
                              {previewItem.level || "غير محدد"}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-400 font-bold">المكافأة (XP):</span>
                            <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-black flex items-center gap-1">
                              ⭐ {previewItem.xpReward || 150} XP
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-400 font-bold">القصة المرتبطة:</span>
                            <span className="text-slate-800 font-black text-left line-clamp-1 max-w-[60%]">
                              {previewItem.storyId?.title || "عام / غير مرتبط"}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-400 font-bold">اللغة المستهدفة:</span>
                            <span className="bg-blue-50 text-[#003F87] border border-blue-100 px-3 py-1 rounded-full text-xs font-black">
                              {previewItem.language === "Arabic" ? "العربية" :
                               previewItem.language === "French" ? "الفرنسية" :
                               previewItem.language === "English" ? "الإنجليزية" :
                               previewItem.language || "العربية"}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-sm border-t border-slate-200 pt-3">
                            <span className="text-slate-400 font-bold">الحالة:</span>
                            <span className="bg-amber-100 text-amber-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">بانتظار المراجعة</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="md:col-span-2 space-y-6">
                        <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                          <h4 className="text-lg font-black text-[#003F87] mb-4 flex items-center gap-2">
                            <BookOpen size={20} /> نص القصة
                          </h4>
                          <p className="text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">
                            {previewItem.content || "لا يوجد نص متاح."}
                          </p>
                        </div>

                        {previewItem.vocabulary?.length > 0 && (
                          <div className="space-y-4">
                            <h4 className="text-lg font-black text-slate-800 flex items-center gap-2">
                              <MessageSquare size={20} className="text-[#003F87]" /> المفردات والكلمات
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {previewItem.vocabulary.map((v: any, i: number) => (
                                <div key={i} className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                                  <span className="font-black text-[#003F87]">{v.word}</span>
                                  <span className="text-slate-300">←</span>
                                  <span className="font-bold text-slate-600">{v.translation}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-6">
                        <div className="rounded-[2rem] overflow-hidden shadow-lg border border-slate-100">
                          <img src={previewItem.thumbnail || previewItem.coverImage} className="w-full aspect-[4/5] object-cover" alt="Preview" />
                        </div>

                        {previewItem.audioUrl && (
                          <div className="bg-[#003F87] p-6 rounded-[2rem] text-white">
                            <div className="flex items-center gap-3 mb-4">
                              <Volume2 size={24} />
                              <h4 className="font-black">التسجيل الصوتي</h4>
                            </div>
                            <audio controls className="w-full h-10 accent-white">
                              <source src={previewItem.audioUrl} type="audio/mpeg" />
                              متصفحك لا يدعم تشغيل الصوت.
                            </audio>
                          </div>
                        )}

                        <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 space-y-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-400 font-bold">المستوى:</span>
                            <span className="text-slate-900 font-black">{previewItem.level || "غير محدد"}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-400 font-bold">الحالة:</span>
                            <span className="bg-amber-100 text-amber-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">بانتظار المراجعة</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                 {/* Modal Footer */}
                <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-4">
                  <button
                    onClick={() => handleReject(previewItem._id, previewItem.type || (activeTab === 'tests' ? 'test' : 'story'))}
                    className="px-8 py-4 bg-white text-red-500 rounded-2xl font-bold hover:bg-red-50 transition-all border border-red-100"
                  >
                    رفض وحذف
                  </button>
                  <button
                    onClick={() => handleApprove(previewItem._id, previewItem.type || (activeTab === 'tests' ? 'test' : 'story'))}
                    className="px-12 py-4 bg-[#003F87] text-white rounded-2xl font-bold hover:bg-[#002d61] shadow-xl shadow-[#003F87]/20 transition-all flex items-center gap-3"
                  >
                    <CheckCircle size={20} /> {previewItem.type === 'video' ? 'اعتماد ونشر الفيديو' : previewItem.type === 'exam' || previewItem.type === 'test' || activeTab === 'tests' ? 'اعتماد ونشر الاختبار' : 'اعتماد ونشر القصة'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
};

export default ContentReview;
