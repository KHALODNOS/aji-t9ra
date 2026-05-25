import React, { useEffect, useMemo, useRef, useState } from "react";
import api from "../../services/api";
import { publishStudentRewards } from "../../utils/studentRewards";

const FALLBACK_AVATAR = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&auto=format&fit=crop&q=80";

const getMediaUrl = (path) => {
  if (!path) return FALLBACK_AVATAR;
  if (path.startsWith("http")) return path;
  return `http://localhost:5000/${path.replace(/\\/g, "/")}`;
};

const getLevelClass = (level = "") => {
  if (level.includes("مبتد") || level === "Beginner") return "green";
  if (level.includes("متوسط") || level === "Intermediate") return "orange";
  if (level.includes("متقدم") || level === "Advanced") return "blue";
  return "grey";
};

const quickPrompts = [
  "لخص لي ما حدث في القصة.",
  "اسألني سؤالاً عن أحداث القصة.",
  "علمني كلمة جديدة من القصة.",
];

const SpeakingPractice = () => {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchText, setSearchText] = useState("");
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef(null);

  useEffect(() => {
    const fetchCharacters = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await api.get("/student/journey/stories");
        const mapped = (response.data || []).map((story) => ({
          id: story.id,
          storyId: story.id,
          name: story.personality?.name || story.title,
          storyTitle: story.title,
          story: `من قصة: ${story.title}`,
          level: story.level || "غير محدد",
          levelClass: getLevelClass(story.level),
          avatar: getMediaUrl(story.coverImage),
          tone: story.personality?.tone || "ودود",
          difficulty: story.personality?.difficulty || 60,
          xp: story.personality?.xp || story.xp || 50,
          greeting: `مرحباً بك! أنا ${story.personality?.name || "شخصية القصة"} من قصة "${story.title}". اسألني عن أحداث القصة أو تحدث معي لأساعدك على ممارسة اللغة.`,
        }));
        setCharacters(mapped);
      } catch (err) {
        console.error("Error fetching speaking characters:", err);
        setError(err.response?.data?.message || "تعذر تحميل شخصيات القصص.");
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, []);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const filteredCharacters = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return characters;
    return characters.filter((char) =>
      char.name.toLowerCase().includes(q) ||
      char.storyTitle.toLowerCase().includes(q)
    );
  }, [characters, searchText]);

  const startChat = (character) => {
    setSelectedCharacter(character);
    setMessages([{ sender: "character", text: character.greeting, time: "الآن" }]);
    setUserMessage("");
  };

  const sendMessage = async (event, quickMessage = "") => {
    event?.preventDefault();
    const message = (quickMessage || userMessage).trim();
    if (!message || !selectedCharacter || isTyping) return;

    const nextMessages = [...messages, { sender: "user", text: message, time: "الآن" }];
    setMessages(nextMessages);
    setUserMessage("");
    setIsTyping(true);

    try {
      const chatHistory = nextMessages.slice(1).map((msg) => ({
        sender: msg.sender === "user" ? "student" : "bot",
        text: msg.text,
      }));

      const response = await api.post("/ai/chat", {
        storyId: selectedCharacter.storyId,
        message,
        chatHistory,
      });
      publishStudentRewards({
        xpAwarded: response.data?.xpAwarded,
        totalXp: response.data?.totalXp,
        earnedBadges: response.data?.earnedBadges || [],
        reason: "ai",
      });

      setMessages((prev) => [
        ...prev,
        {
          sender: "character",
          text: response.data?.answer || "لم أتمكن من استخراج إجابة من سياق القصة.",
          time: "الآن",
          xpAwarded: response.data?.xpAwarded,
        },
      ]);
    } catch (err) {
      console.error("Error talking to story chatbot:", err);
      setMessages((prev) => [
        ...prev,
        {
          sender: "character",
          text: err.response?.data?.message || "عذراً، حدث خطأ أثناء الاتصال بشخصية القصة. تأكد من تشغيل الخادم وإعداد Gemini API.",
          time: "الآن",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const currentSessionMessages = messages.filter((message) => message.sender === "user").length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css');

        .speaking-page {
          direction: rtl;
          font-family: 'Tajawal', sans-serif;
          color: #172033;
        }

        .speaking-header {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          align-items: end;
          margin-bottom: 26px;
        }

        .page-title {
          margin: 0;
          color: #00458b;
          font-size: 1.85rem;
          font-weight: 900;
        }

        .page-subtitle {
          margin: 7px 0 0;
          color: #64748b;
          font-size: 0.95rem;
          font-weight: 700;
        }

        .search-box {
          position: relative;
          width: min(360px, 100%);
        }

        .search-box i {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }

        .search-box input {
          width: 100%;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          border-radius: 16px;
          padding: 12px 16px 12px 42px;
          font-family: inherit;
          font-weight: 800;
          outline: none;
        }

        .speaking-state {
          min-height: 420px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          color: #00458b;
          font-weight: 900;
        }

        .speaking-state.error {
          color: #b91c1c;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 18px;
          margin-bottom: 32px;
        }

        .stat-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 22px;
          padding: 20px;
          box-shadow: 0 10px 24px rgba(15, 23, 42, 0.04);
        }

        .stat-label {
          display: block;
          color: #64748b;
          font-size: 0.78rem;
          font-weight: 900;
          margin-bottom: 8px;
        }

        .stat-value {
          color: #00458b;
          font-size: 1.5rem;
          font-weight: 900;
        }

        .characters-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 22px;
        }

        .character-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 24px;
          padding: 24px;
          box-shadow: 0 10px 24px rgba(15, 23, 42, 0.04);
          text-align: center;
          position: relative;
        }

        .character-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 16px 34px rgba(15, 23, 42, 0.07);
        }

        .status-dot-badge {
          position: absolute;
          top: 14px;
          right: 14px;
          color: #047857;
          background: #ecfdf5;
          border-radius: 999px;
          padding: 5px 10px;
          font-size: 0.68rem;
          font-weight: 900;
        }

        .char-avatar-wrapper {
          width: 96px;
          height: 96px;
          border-radius: 50%;
          overflow: hidden;
          margin: 8px auto 15px;
          border: 3px solid #eef5fc;
        }

        .char-avatar-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .char-name {
          margin: 0 0 6px;
          color: #172033;
          font-size: 1.12rem;
          font-weight: 900;
        }

        .char-story {
          display: block;
          color: #64748b;
          font-size: 0.8rem;
          font-weight: 800;
          margin-bottom: 10px;
        }

        .char-level-badge {
          display: inline-flex;
          border-radius: 999px;
          padding: 5px 11px;
          font-size: 0.72rem;
          font-weight: 900;
          margin-bottom: 16px;
        }

        .char-level-badge.green { background: #dcfce7; color: #166534; }
        .char-level-badge.orange { background: #ffedd5; color: #c2410c; }
        .char-level-badge.blue { background: #dbeafe; color: #1d4ed8; }
        .char-level-badge.grey { background: #f1f5f9; color: #475569; }

        .btn-start-chat {
          width: 100%;
          border: none;
          background: #00458b;
          color: white;
          border-radius: 14px;
          padding: 11px 16px;
          font-family: inherit;
          font-weight: 900;
          cursor: pointer;
        }

        .empty-state {
          background: white;
          border: 1px dashed #cbd5e1;
          border-radius: 22px;
          padding: 34px;
          text-align: center;
          color: #64748b;
          font-weight: 900;
        }

        .chat-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.58);
          backdrop-filter: blur(5px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .chat-dialog-card {
          background: #ffffff;
          width: min(820px, 100%);
          height: min(760px, 92vh);
          border-radius: 28px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 24px 70px rgba(15, 23, 42, 0.26);
          border: 1px solid rgba(255, 255, 255, 0.55);
        }

        .chat-card-header {
          background: linear-gradient(135deg, #003f7f 0%, #0067a8 55%, #0f766e 100%);
          color: #ffffff;
          padding: 18px 22px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .chat-header-profile {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }

        .chat-header-avatar {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          overflow: hidden;
          border: 3px solid rgba(255,255,255,0.85);
          flex-shrink: 0;
          box-shadow: 0 8px 20px rgba(0,0,0,0.16);
        }

        .chat-header-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .chat-char-title {
          display: block;
          font-weight: 900;
          font-size: 1rem;
        }

        .chat-char-sub {
          display: block;
          font-size: 0.76rem;
          opacity: 0.84;
          font-weight: 700;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 360px;
        }

        .chat-live-status {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 7px;
          background: rgba(255,255,255,0.14);
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 999px;
          padding: 4px 9px;
          font-size: 0.68rem;
          font-weight: 900;
        }

        .chat-live-status::before {
          content: "";
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 0 5px rgba(34,197,94,0.16);
        }

        .chat-close-btn {
          background: rgba(255,255,255,0.12);
          border: 0;
          color: #ffffff;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          cursor: pointer;
        }

        .chat-messages-log {
          flex: 1;
          padding: 24px;
          overflow-y: auto;
          background:
            radial-gradient(circle at top right, rgba(0,69,139,0.09), transparent 32%),
            linear-gradient(180deg, #f8fafc 0%, #eef5fc 100%);
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .chat-msg-bubble {
          max-width: 82%;
          padding: 14px 18px;
          border-radius: 20px;
          font-size: 0.9rem;
          line-height: 1.7;
          font-weight: 700;
          position: relative;
          animation: chat-bubble-in 0.22s ease both;
        }

        .chat-msg-bubble.character {
          background: #ffffff;
          color: #172033;
          align-self: flex-start;
          border-top-right-radius: 4px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 10px 22px rgba(15, 23, 42, 0.04);
        }

        .chat-msg-bubble.user {
          background: linear-gradient(135deg, #00458b, #0067a8);
          color: #ffffff;
          align-self: flex-end;
          border-top-left-radius: 4px;
          border: 1px solid rgba(255,255,255,0.3);
          box-shadow: 0 12px 26px rgba(0, 69, 139, 0.18);
        }

        .chat-msg-time {
          display: block;
          color: #94a3b8;
          font-size: 0.66rem;
          margin-top: 6px;
        }

        .chat-msg-bubble.user .chat-msg-time {
          color: rgba(255,255,255,0.72);
        }

        .xp-award {
          margin-top: 8px;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: #fef3c7;
          color: #b45309;
          border-radius: 999px;
          padding: 4px 9px;
          font-size: 0.72rem;
          font-weight: 900;
          animation: xp-award-pop 0.38s ease both;
        }

        .chat-session-strip {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
          padding: 12px 18px;
          background: #ffffff;
          border-bottom: 1px solid #e2e8f0;
        }

        .chat-session-pill {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 9px 10px;
          color: #334155;
          font-size: 0.76rem;
          font-weight: 900;
          min-width: 0;
        }

        .chat-session-pill i {
          color: #00458b;
        }

        .typing-loader {
          align-self: flex-start;
          background: #ffffff;
          padding: 12px 18px;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
          display: flex;
          gap: 5px;
        }

        .typing-dot {
          width: 7px;
          height: 7px;
          background: #00458b;
          border-radius: 50%;
          animation: flash 1.1s infinite alternate;
        }

        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes flash { from { opacity: 0.25; } to { opacity: 1; } }

        .chat-card-footer {
          padding: 14px 18px 16px;
          background: #ffffff;
          border-top: 1px solid #e2e8f0;
        }

        .quick-prompts {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 10px;
        }

        .quick-prompt-btn {
          flex: 0 0 auto;
          border: 1px solid #dbeafe;
          background: #eef5fc;
          color: #00458b;
          border-radius: 999px;
          padding: 8px 12px;
          font-family: inherit;
          font-size: 0.76rem;
          font-weight: 900;
          cursor: pointer;
        }

        .quick-prompt-btn:hover {
          background: #dbeafe;
          transform: translateY(-1px);
        }

        .chat-input-form {
          display: flex;
          gap: 10px;
        }

        .chat-msg-input {
          flex: 1;
          border: 1px solid #e2e8f0;
          border-radius: 15px;
          padding: 13px 16px;
          font-family: inherit;
          font-weight: 800;
          outline: none;
          background: #f8fafc;
        }

        .chat-msg-input:focus {
          border-color: #00458b;
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(0,69,139,0.08);
        }

        .chat-btn-send {
          background: #00458b;
          color: white;
          border: none;
          width: 46px;
          height: 46px;
          border-radius: 14px;
          cursor: pointer;
        }

        .chat-btn-send:disabled,
        .quick-prompt-btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        @keyframes chat-bubble-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes xp-award-pop {
          from { opacity: 0; transform: scale(0.82); }
          to { opacity: 1; transform: scale(1); }
        }

        @media (max-width: 1050px) {
          .stats-grid, .characters-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 720px) {
          .speaking-header {
            flex-direction: column;
            align-items: stretch;
          }
          .search-box {
            width: 100%;
          }
          .stats-grid, .characters-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="speaking-page">
        <header className="speaking-header">
          <div>
            <h2 className="page-title">تحدث مع شخصيات القصص</h2>
            <p className="page-subtitle">الشخصيات هنا تأتي من القصص الحقيقية وإعدادات الذكاء الاصطناعي التي فعلها المعلم.</p>
          </div>
          <div className="search-box">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="ابحث عن شخصية أو قصة..."
            />
          </div>
        </header>

        {loading ? (
          <div className="speaking-state">
            <i className="fa-solid fa-circle-notch fa-spin"></i>
            <span>جاري تحميل الشخصيات الحقيقية...</span>
          </div>
        ) : error ? (
          <div className="speaking-state error">
            <i className="fa-solid fa-triangle-exclamation"></i>
            <span>{error}</span>
          </div>
        ) : (
          <>
            <section className="stats-grid">
              <div className="stat-card">
                <span className="stat-label">الشخصيات المتاحة</span>
                <span className="stat-value">{characters.length}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">قصص مفعلة للمحادثة</span>
                <span className="stat-value">{characters.length}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">رسائل هذه الجلسة</span>
                <span className="stat-value">{currentSessionMessages}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">الشخصية الحالية</span>
                <span className="stat-value" style={{ fontSize: "1rem" }}>
                  {selectedCharacter?.name || "لا توجد"}
                </span>
              </div>
            </section>

            {filteredCharacters.length ? (
              <section className="characters-grid">
                {filteredCharacters.map((char) => (
                  <article className="character-card" key={char.id}>
                    <div className="status-dot-badge">نشط</div>
                    <div className="char-avatar-wrapper">
                      <img src={char.avatar} alt={char.name} />
                    </div>
                    <h4 className="char-name">{char.name}</h4>
                    <span className="char-story">{char.story}</span>
                    <span className={`char-level-badge ${char.levelClass}`}>{char.level}</span>
                    <button className="btn-start-chat" onClick={() => startChat(char)}>
                      <i className="fa-regular fa-comments"></i>
                      <span>ابدأ المحادثة</span>
                    </button>
                  </article>
                ))}
              </section>
            ) : (
              <div className="empty-state">لا توجد شخصيات مطابقة للبحث الحالي.</div>
            )}
          </>
        )}
      </div>

      {selectedCharacter && (
        <div className="chat-modal-overlay" onClick={() => setSelectedCharacter(null)}>
          <div className="chat-dialog-card" onClick={(event) => event.stopPropagation()}>
            <div className="chat-card-header">
              <div className="chat-header-profile">
                <div className="chat-header-avatar">
                  <img src={selectedCharacter.avatar} alt={selectedCharacter.name} />
                </div>
                <div>
                  <span className="chat-char-title">{selectedCharacter.name}</span>
                  <span className="chat-char-sub">{selectedCharacter.story}</span>
                  <span className="chat-live-status">متصل الآن</span>
                </div>
              </div>
              <button className="chat-close-btn" onClick={() => setSelectedCharacter(null)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="chat-session-strip">
              <div className="chat-session-pill">
                <i className="fa-solid fa-message"></i>
                <span>{currentSessionMessages} رسائل</span>
              </div>
              <div className="chat-session-pill">
                <i className="fa-solid fa-star"></i>
                <span>+5 XP لكل رسالة</span>
              </div>
              <div className="chat-session-pill">
                <i className="fa-solid fa-wand-magic-sparkles"></i>
                <span>{selectedCharacter.tone}</span>
              </div>
            </div>

            <div className="chat-messages-log">
              {messages.map((msg, index) => (
                <div className={`chat-msg-bubble ${msg.sender}`} key={`${msg.sender}-${index}`}>
                  <div>{msg.text}</div>
                  {msg.xpAwarded && (
                    <div className="xp-award">
                      <i className="fa-solid fa-award"></i>
                      <span>+{msg.xpAwarded} XP</span>
                    </div>
                  )}
                  <span className="chat-msg-time">{msg.time}</span>
                </div>
              ))}
              {isTyping && (
                <div className="typing-loader">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              )}
              <div ref={chatBottomRef}></div>
            </div>

            <div className="chat-card-footer">
              <div className="quick-prompts">
                {quickPrompts.map((prompt) => (
                  <button
                    type="button"
                    className="quick-prompt-btn"
                    key={prompt}
                    onClick={(event) => sendMessage(event, prompt)}
                    disabled={isTyping}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
              <form className="chat-input-form" onSubmit={sendMessage}>
                <input
                  type="text"
                  className="chat-msg-input"
                  placeholder="اكتب رسالتك للشخصية..."
                  value={userMessage}
                  onChange={(event) => setUserMessage(event.target.value)}
                  disabled={isTyping}
                />
                <button type="submit" className="chat-btn-send" disabled={isTyping || !userMessage.trim()}>
                  <i className="fa-solid fa-paper-plane"></i>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SpeakingPractice;
