import React, { useState } from "react";

const SpeakingPractice = ({ onBack, onLogout }) => {
  // States for search and interactions
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("ممارسة التحدث");
  const [selectedCharacter, setSelectedCharacter] = useState(null); // Chat dialog modal state
  const [messages, setMessages] = useState([]); // Dynamic chat messages
  const [userMessage, setUserMessage] = useState(""); // Message input state
  const [isTyping, setIsTyping] = useState(false); // Character typing loader state

  // Character list dummy data matching the screenshot exactly
  const characters = [
    {
      id: "tariq",
      name: "الفارس طارق",
      story: "من قصة: أبطال الأندلس",
      level: "متوسط",
      levelClass: "orange",
      active: true,
      avatar: "https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=150&auto=format&fit=crop&q=80",
      greeting: "السلام عليكم ورحمة الله! أنا الفارس طارق، خضت معارك باسلة في الأندلس وأحمل لكم أسرار الشجاعة والفروسية. هل تود أن تسمع عن أبطال قرطبة اليوم؟"
    },
    {
      id: "layla",
      name: "ليلى الذكية",
      story: "من قصة: ليلى والذئب الرقمي",
      level: "مبتدئ",
      levelClass: "green",
      active: true,
      avatar: "https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?w=150&auto=format&fit=crop&q=80",
      greeting: "أهلاً بك! أنا ليلى. الذئب الرقمي حاول خداعي في الغابة التفاعلية، لكني تغلبت عليه بفضل ذكائي وحذري في العالم الافتراضي. كيف تحمي نفسك عبر الإنترنت؟ دعنا نتحدث!"
    },
    {
      id: "battuta",
      name: "ابن بطوطة / ⵉⴱⵏ ⴱⴰⵟⵓⵟⴰ",
      story: "من قصة: رحلة عبر الزمن",
      level: "متقدم",
      levelClass: "blue",
      active: true,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      greeting: "مرحباً يا بني! طفت بلاد السند والهند، ورأيت عجائب البحار والبلدان في طنجة وخارجها. ما هي وجهتك المفضلة في السفر؟ دعنا نتبادل الأحاديث الممتعة!"
    },
    {
      id: "scientist",
      name: "عالمة المستقبل",
      story: "من قصة: مختبر الأحلام",
      level: "متقدم",
      levelClass: "grey",
      active: false, // Locked state
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      greeting: "مرحباً! أعمل في مختبر الأحلام لتطوير طاقات الغد النظيفة. القصة مغلقة حالياً، أكمل المهام لتتحدث معي!"
    }
  ];

  // Start chat handler
  const startChat = (char) => {
    if (!char.active) return;
    setSelectedCharacter(char);
    setMessages([
      { sender: "character", text: char.greeting, time: "الآن" }
    ]);
  };

  // Send message simulation
  const sendMessage = (e) => {
    e.preventDefault();
    if (!userMessage.trim()) return;

    // Add user message
    const newMsg = { sender: "user", text: userMessage, time: "الآن" };
    setMessages(prev => [...prev, newMsg]);
    setUserMessage("");
    setIsTyping(true);

    // Simulate character reply after 1.5 seconds
    setTimeout(() => {
      let replyText = "رائع جداً! كلامك يعبر عن ذكاء وشغف حقيقي بالتعلم. أخبرني المزيد عن رأيك في هذا المجال؟";
      if (selectedCharacter.id === "tariq") {
        replyText = "شجاعتك بالحديث تسعدني! فرسان الأندلس يثمنون البلاغة بقدر ما يثمنون المبارزة بالسيف. ما رأيك في قيم الفروسية؟";
      } else if (selectedCharacter.id === "layla") {
        replyText = "إجابة ذكية للغاية! الأمان الرقمي يبدأ بخطوات بسيطة كحفظ كلمات المرور وعدم مشاركة معلوماتنا الشخصية. هل تطبق ذلك دائماً؟";
      } else if (selectedCharacter.id === "battuta") {
        replyText = "يا لك من مستمع رائع! السفر يمد العقل بالحكمة وينير البصيرة. هل تود سماع رحلتي إلى جزر المالديف الساحرة؟";
      }

      setMessages(prev => [...prev, { sender: "character", text: replyText, time: "الآن" }]);
      setIsTyping(false);
    }, 1500);
  };

  // Filter characters by search text
  const filteredCharacters = characters.filter(char =>
    char.name.toLowerCase().includes(searchText.toLowerCase()) ||
    char.story.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css');

        :root {
          --bg-light: #fdfcf7; /* Warm clean ivory background matching screenshot colors */
          --sidebar-bg: #ffffff;
          --primary-blue: #00458b; /* Main Deep Blue */
          --primary-blue-dark: #002d5c;
          --primary-yellow: #f9c851; /* Main Gold Yellow */
          --primary-yellow-hover: #e5b23d;
          --text-main: #1d1d1d;
          --text-muted: #7e8b9b;
          --border-color: #f1ebd9;
          --shadow-sm: 0 4px 15px rgba(0, 0, 0, 0.015);
          --shadow-md: 0 10px 25px rgba(0, 0, 0, 0.03);
        }

        * {
          box-sizing: border-box;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        body {
          margin: 0;
          font-family: 'Tajawal', sans-serif;
          background: var(--bg-light);
          direction: rtl;
          color: var(--text-main);
        }

        .speaking-container {
          display: flex;
          width: 100%;
          min-height: 100vh;
          background: var(--bg-light);
          direction: rtl;
        }

        /* Sidebar RTL */
        .sidebar {
          width: 300px;
          background: var(--sidebar-bg);
          border-left: 1px solid #f2f5f9;
          display: flex;
          flex-direction: column;
          padding: 30px 0;
          flex-shrink: 0;
          box-shadow: -4px 0 20px rgba(0, 0, 0, 0.01);
        }

        .brand-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 30px;
          padding: 0 20px;
        }

        .brand-title {
          font-size: 1.8rem;
          font-weight: 900;
          color: var(--primary-blue);
          margin: 0;
        }

        .brand-subtitle {
          font-size: 0.8rem;
          color: #94a3b8;
          font-weight: 700;
          margin-top: 4px;
        }

        .nav-list {
          list-style: none;
          padding: 0 15px;
          margin: 0;
          flex-grow: 1;
        }

        .nav-item-wrapper {
          margin-bottom: 5px;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 12px 20px;
          text-decoration: none;
          color: #64748b;
          font-weight: 700;
          cursor: pointer;
          border-radius: 14px;
          font-size: 0.95rem;
        }

        .nav-link:hover {
          background: #f8fafc;
          color: var(--primary-blue);
        }

        .nav-link.active {
          background: #eef5fc;
          color: var(--primary-blue);
          border-right: 4px solid var(--primary-blue);
          border-radius: 0 14px 14px 0;
        }

        .nav-link i {
          font-size: 1.15rem;
          width: 24px;
          text-align: center;
        }

        .sidebar-bottom {
          padding: 20px 20px 0;
          border-top: 1px solid #f1f4f8;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .bottom-link {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 12px 20px;
          color: #64748b;
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          border-radius: 14px;
        }

        .bottom-link:hover {
          background: #f8fafc;
          color: var(--primary-blue);
        }

        .bottom-link.logout {
          color: #ef4444;
        }

        .bottom-link.logout:hover {
          background: #fef2f2;
        }

        /* Main Wrapper */
        .main-wrapper {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          height: 100vh;
        }

        /* Topbar */
        .topbar {
          padding: 30px 40px 15px 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .topbar-right-controls {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .topbar-avatar-container {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid #cbd5e1;
        }

        .topbar-avatar-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .topbar-icon-btn {
          font-size: 1.25rem;
          color: #64748b;
          cursor: pointer;
        }

        .topbar-icon-btn:hover {
          color: var(--primary-blue);
        }

        .topbar-brand-lbl {
          font-size: 1.35rem;
          font-weight: 800;
          color: var(--primary-blue);
        }

        .search-container {
          position: relative;
          width: 380px;
        }

        .search-icon-inside {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          font-size: 0.95rem;
        }

        .search-input {
          width: 100%;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          border-radius: 20px;
          padding: 10px 15px 10px 40px;
          font-family: inherit;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-main);
          outline: none;
        }

        .search-input:focus {
          border-color: var(--primary-blue);
        }

        /* Main Content Container */
        .content-area {
          padding: 10px 40px 40px;
        }

        .header-title-section {
          margin-bottom: 30px;
        }

        .page-title {
          font-size: 1.8rem;
          font-weight: 900;
          color: var(--primary-blue);
          margin: 0;
        }

        .page-subtitle {
          font-size: 0.95rem;
          color: #64748b;
          font-weight: 600;
          margin-top: 6px;
        }

        /* Stats Row (ملخص ممارسة التحدث) */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 35px;
        }

        .stat-card {
          background: #ffffff;
          border-radius: 24px;
          padding: 24px;
          border: 1px solid #f1ebd9;
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
          min-height: 140px;
        }

        .stat-card:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-md);
        }

        /* Active session dark card (جلسة حالية) */
        .stat-card.active-session {
          background: #003666;
          border: none;
          color: #ffffff;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 20px;
        }

        .session-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.75rem;
          font-weight: 700;
          opacity: 0.95;
        }

        .session-dot-active {
          display: inline-block;
          width: 7px;
          height: 7px;
          background: #f9c851;
          border-radius: 50%;
          margin-left: 6px;
        }

        .session-char-name {
          font-size: 1.15rem;
          font-weight: 900;
          margin: 10px 0 3px 0;
        }

        .session-time-sub {
          font-size: 0.75rem;
          opacity: 0.75;
          margin-bottom: 12px;
          font-weight: 600;
        }

        .btn-continue-chat {
          width: 100%;
          background: var(--primary-yellow);
          color: #382703;
          border: none;
          border-radius: 12px;
          padding: 8px;
          font-weight: 800;
          font-size: 0.8rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .btn-continue-chat:hover {
          background: var(--primary-yellow-hover);
        }

        /* Standard stats inside cards */
        .stat-content {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: #f8f9fc;
          color: var(--primary-blue);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
        }

        .stat-card:nth-child(2) .stat-icon { background: #fff0f0; color: #ef4444; }
        .stat-card:nth-child(3) .stat-icon { background: #fef8e6; color: #d97706; }
        .stat-card:nth-child(4) .stat-icon { background: #eff6ff; color: #3b82f6; }

        .stat-details {
          display: flex;
          flex-direction: column;
        }

        .stat-lbl {
          font-size: 0.75rem;
          color: #64748b;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .stat-val {
          font-size: 1.2rem;
          font-weight: 900;
          color: #1e293b;
        }

        /* Fluency Progress bar */
        .fluency-progress {
          width: 100%;
          height: 6px;
          background: #f1f5f9;
          border-radius: 3px;
          margin-top: 10px;
          overflow: hidden;
        }

        .fluency-fill {
          height: 100%;
          background: var(--primary-yellow);
          border-radius: 3px;
        }

        /* Characters Grid section */
        .characters-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 25px;
        }

        .character-card {
          background: #ffffff;
          border-radius: 24px;
          padding: 25px;
          border: 1px solid rgba(241, 235, 217, 0.4);
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          text-align: center;
        }

        .character-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
        }

        .status-dot-badge {
          position: absolute;
          top: 15px;
          right: 15px;
          padding: 4px 8px;
          border-radius: 10px;
          font-size: 0.65rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .status-dot-badge.active {
          background: #e6fcf5;
          color: #0ca678;
        }

        .status-dot-badge.locked {
          background: #f1f3f5;
          color: #868e96;
        }

        .status-circle {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .status-dot-badge.active .status-circle { background: #0ca678; }
        .status-dot-badge.locked .status-circle { background: #868e96; }

        .char-avatar-wrapper {
          width: 96px;
          height: 96px;
          border-radius: 50%;
          overflow: hidden;
          margin-top: 10px;
          margin-bottom: 15px;
          border: 3px solid #f1ebd9;
          box-shadow: 0 4px 12px rgba(0,0,0,0.04);
        }

        .char-avatar-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .character-card.locked-card .char-avatar-wrapper {
          filter: grayscale(100%);
          opacity: 0.6;
        }

        .char-name {
          font-size: 1.15rem;
          font-weight: 850;
          color: var(--text-main);
          margin: 0 0 4px 0;
        }

        .char-story {
          font-size: 0.8rem;
          color: #64748b;
          font-weight: 600;
          margin-bottom: 10px;
        }

        .char-level-badge {
          font-size: 0.7rem;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .char-level-badge.green { background: #ebfbee; color: #2b8a3e; }
        .char-level-badge.orange { background: #fff4e6; color: #e67e22; }
        .char-level-badge.blue { background: #e7f5ff; color: #1971c2; }
        .char-level-badge.grey { background: #f1f3f5; color: #868e96; }

        .char-actions {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .btn-start-chat {
          width: 100%;
          background: var(--primary-blue);
          color: #ffffff;
          border: none;
          padding: 10px;
          border-radius: 12px;
          font-weight: 800;
          font-size: 0.85rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .btn-start-chat:hover {
          background: var(--primary-blue-dark);
        }

        .btn-start-chat.btn-locked {
          background: #e9ecef;
          color: #adb5bd;
          cursor: not-allowed;
          box-shadow: none;
        }

        .btn-view-profile {
          width: 100%;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          color: #475569;
          padding: 9px;
          border-radius: 12px;
          font-weight: 800;
          font-size: 0.85rem;
          cursor: pointer;
        }

        .btn-view-profile:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
        }

        /* Voice Chat Dialog Panel Modal (WOW interactive voice panel) */
        .chat-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(5px);
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .chat-dialog-card {
          background: #ffffff;
          width: 550px;
          height: 600px;
          border-radius: 28px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(0,0,0,0.15);
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .chat-card-header {
          background: #00458b;
          color: #ffffff;
          padding: 20px 25px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .chat-header-profile {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .chat-header-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid #ffffff;
        }

        .chat-header-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .chat-header-details {
          display: flex;
          flex-direction: column;
        }

        .chat-char-title {
          font-weight: 800;
          font-size: 1rem;
        }

        .chat-char-sub {
          font-size: 0.75rem;
          opacity: 0.8;
          font-weight: 600;
        }

        .chat-close-btn {
          background: transparent;
          border: none;
          color: #ffffff;
          font-size: 1.3rem;
          cursor: pointer;
        }

        /* Message Log Area */
        .chat-messages-log {
          flex-grow: 1;
          padding: 25px;
          overflow-y: auto;
          background: #f8fafc;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .chat-msg-bubble {
          max-width: 80%;
          padding: 14px 18px;
          border-radius: 20px;
          font-size: 0.85rem;
          line-height: 1.6;
          font-weight: 600;
          position: relative;
        }

        .chat-msg-bubble.character {
          background: #ffffff;
          color: #1e293b;
          align-self: flex-start;
          border-top-right-radius: 4px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.02);
          border: 1px solid #f1ebd9;
        }

        .chat-msg-bubble.user {
          background: #eef5fc;
          color: var(--primary-blue);
          align-self: flex-end;
          border-top-left-radius: 4px;
          border: 1px solid #cbd5e1;
        }

        .chat-msg-time {
          font-size: 0.65rem;
          color: #94a3b8;
          margin-top: 5px;
          text-align: left;
          display: block;
        }

        /* Typing loader indicator */
        .typing-loader {
          align-self: flex-start;
          background: #ffffff;
          padding: 10px 18px;
          border-radius: 20px;
          border: 1px solid #f1ebd9;
          display: flex;
          gap: 5px;
          align-items: center;
        }

        .typing-dot {
          width: 6px;
          height: 6px;
          background: var(--primary-blue);
          border-radius: 50%;
          animation: flash 1.4s infinite alternate;
        }

        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes flash {
          from { opacity: 0.2; }
          to { opacity: 1; }
        }

        /* Input Controls Footer */
        .chat-card-footer {
          padding: 15px 20px;
          background: #ffffff;
          border-top: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .chat-input-form {
          display: flex;
          width: 100%;
          gap: 10px;
        }

        .chat-msg-input {
          flex-grow: 1;
          border: 1px solid #e2e8f0;
          border-radius: 15px;
          padding: 12px 18px;
          font-family: inherit;
          font-size: 0.85rem;
          font-weight: 600;
          outline: none;
        }

        .chat-msg-input:focus {
          border-color: var(--primary-blue);
        }

        .chat-btn-send {
          background: var(--primary-blue);
          color: #ffffff;
          border: none;
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 1.05rem;
        }

        .chat-btn-send:hover {
          background: var(--primary-blue-dark);
        }

        .chat-mic-btn {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #64748b;
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 1.15rem;
        }

        .chat-mic-btn:hover {
          background: #e0f2fe;
          color: #0284c7;
          border-color: #bae6fd;
        }

        .chat-mic-btn.recording {
          background: #fee2e2;
          color: #ef4444;
          border-color: #fca5a5;
          animation: pulse 1s infinite alternate;
        }

        @keyframes pulse {
          from { transform: scale(1); }
          to { transform: scale(1.05); }
        }

        @media (max-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .characters-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

        {/* Main Content Area */}
        <div className="content-area" style={{ padding: 0 }}>
          <section className="header-title-section">
            <h2 className="page-title">تحدث مع شخصيات القصص</h2>
            <p className="page-subtitle">اختر شخصية لتمارس معها ما تعلمته في القصص بطريقة تفاعلية وممتعة.</p>
          </section>

          {/* Section 1: Stats summary (ملخص ممارسة التحدث) */}
          <section className="stats-grid">
            {/* Active Session Dark Card */}
            <div className="stat-card active-session">
              <div className="session-header">
                <span>جلسة حالية</span>
                <span>
                  <span className="session-dot-active"></span>
                  نشط
                </span>
              </div>
              <div>
                <h4 className="session-char-name">المعلم بن خلدون</h4>
                <p className="session-time-sub">تحدثت معه منذ 5 دقائق</p>
              </div>
              <button
                className="btn-continue-chat"
                onClick={() =>
                  startChat({
                    id: "khaldun",
                    name: "المعلم بن خلدون",
                    story: "من قصة: المقدمة الكبرى",
                    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
                    greeting: "أهلاً بك يا تلميذي البار! أنا عبد الرحمن بن خلدون، مؤرخ علم الاجتماع وكاتب العبر والمقدمة. يسعدني أن نتناقش اليوم حول تطور المجتمعات وعلوم التمدن الإنساني. ماذا تود أن تفهم؟"
                  })
                }
              >
                <span>متابعة المحادثة</span>
                <i className="fa-solid fa-arrow-left"></i>
              </button>
            </div>

            {/* Total Conversations */}
            <div className="stat-card">
              <div className="stat-content">
                <div className="stat-icon">
                  <i className="fa-regular fa-comments"></i>
                </div>
                <div className="stat-details">
                  <span className="stat-lbl">إجمالي المحادثات</span>
                  <span className="stat-val">15 محادثة</span>
                </div>
              </div>
            </div>

            {/* Fluency Level */}
            <div className="stat-card">
              <div className="stat-content">
                <div className="stat-icon">
                  <i className="fa-solid fa-bolt"></i>
                </div>
                <div className="stat-details">
                  <span className="stat-lbl">مستوى الطلاقة</span>
                  <span className="stat-val">75%</span>
                </div>
              </div>
              <div className="fluency-progress">
                <div className="fluency-fill" style={{ width: "75%" }}></div>
              </div>
            </div>

            {/* Speaking Minutes */}
            <div className="stat-card">
              <div className="stat-content">
                <div className="stat-icon">
                  <i className="fa-regular fa-clock"></i>
                </div>
                <div className="stat-details">
                  <span className="stat-lbl">دقائق التحدث</span>
                  <span className="stat-val">120 دقيقة</span>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Character cards grid */}
          <section style={{ marginBottom: "20px" }}>
            <h3 className="section-title">شخصيات القصص</h3>
            <div className="characters-grid">
              {filteredCharacters.map((char) => (
                <div className={`character-card ${char.active ? "" : "locked-card"}`} key={char.id}>
                  {/* Status dot tag */}
                  <div className={`status-dot-badge ${char.active ? "active" : "locked"}`}>
                    <span className="status-circle"></span>
                    <span>{char.active ? "نشط" : "غير متاح"}</span>
                  </div>

                  {/* Character Avatar */}
                  <div className="char-avatar-wrapper">
                    <img src={char.avatar} alt={char.name} />
                  </div>

                  <h4 className="char-name">{char.name}</h4>
                  <span className="char-story">{char.story}</span>

                  {/* Level Badge */}
                  <span className={`char-level-badge ${char.levelClass}`}>{char.level}</span>

                  {/* Button Actions */}
                  <div className="char-actions">
                    {char.active ? (
                      <button className="btn-start-chat" onClick={() => startChat(char)}>
                        <i className="fa-regular fa-comments"></i>
                        <span>ابدأ الدردشة</span>
                      </button>
                    ) : (
                      <button className="btn-start-chat btn-locked" disabled>
                        <i className="fa-solid fa-lock"></i>
                        <span>أكمل القصة للفتح</span>
                      </button>
                    )}
                    <button className="btn-view-profile" onClick={() => alert(`عرض السيرة الذاتية لشخصية: ${char.name}`)}>
                      عرض الشخصية
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

      {/* WOW Interactive Voice & Chat Simulation Panel */}
      {selectedCharacter && (
        <div className="chat-modal-overlay" onClick={() => setSelectedCharacter(null)}>
          <div className="chat-dialog-card" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="chat-card-header">
              <div className="chat-header-profile">
                <div className="chat-header-avatar">
                  <img src={selectedCharacter.avatar} alt={selectedCharacter.name} />
                </div>
                <div className="chat-header-details">
                  <span className="chat-char-title">{selectedCharacter.name}</span>
                  <span className="chat-char-sub">{selectedCharacter.story}</span>
                </div>
              </div>
              <button className="chat-close-btn" onClick={() => setSelectedCharacter(null)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* Chat Body messages log */}
            <div className="chat-messages-log">
              {messages.map((msg, i) => (
                <div className={`chat-msg-bubble ${msg.sender}`} key={i}>
                  <div>{msg.text}</div>
                  <span className="chat-msg-time">{msg.time}</span>
                </div>
              ))}

              {/* Character Typing Loader */}
              {isTyping && (
                <div className="typing-loader">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              )}
            </div>

            {/* Input Send Controls Footer */}
            <div className="chat-card-footer">
              {/* Mic audio trigger simulated */}
              <button
                className="chat-mic-btn"
                onMouseDown={(e) => {
                  e.currentTarget.classList.add("recording");
                  setUserMessage("... جاري الاستماع لنطقك ...");
                }}
                onMouseUp={(e) => {
                  e.currentTarget.classList.remove("recording");
                  setUserMessage("أنا أستمتع بالقصة جداً وأريد استكشاف المزيد");
                }}
                title="اضغط وتحدث (اضغط باستمرار للتسجيل)"
              >
                <i className="fa-solid fa-microphone"></i>
              </button>

              <form className="chat-input-form" onSubmit={sendMessage}>
                <input
                  type="text"
                  className="chat-msg-input"
                  placeholder="اكتب ردك أو اضغط على الميكروفون للتحدث..."
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                />
                <button type="submit" className="chat-btn-send">
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
