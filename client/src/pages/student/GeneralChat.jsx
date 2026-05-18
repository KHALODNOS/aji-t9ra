import React, { useState, useEffect, useRef } from "react";

const GeneralChat = ({ onBack, onLogout }) => {
  // State management
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("الدردشة");
  const [messages, setMessages] = useState([
    {
      id: "join-1",
      type: "system",
      text: "سارة الراجحي انضمت إلى الدردشة"
    },
    {
      id: "msg-1",
      type: "user-other",
      sender: "مريم الشريف",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80",
      text: "السلام عليكم يا شباب، حد عنده فكرة عن موعد محاضرة الرياضيات القادمة؟",
      time: "10:15 ص",
      bgClass: "blue-bubble"
    },
    {
      id: "msg-2",
      type: "user-current",
      sender: "أحمد العلمي",
      text: "أهلاً مريم، المحاضرة يوم الثلاثاء الساعة 10 صباحاً إن شاء الله.",
      time: "10:16 ص",
      bgClass: "yellow-bubble",
      reaction: "🔥"
    },
    {
      id: "msg-3",
      type: "user-other",
      sender: "ياسين نوري",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80",
      text: "شكراً جزيلاً! كنت سأقوم بوضع تذكير الآن.",
      time: "10:18 ص",
      bgClass: "blue-bubble"
    },
    {
      id: "join-2",
      type: "system",
      text: "سعد الموسى انضم إلى الدردشة"
    },
    {
      id: "msg-4",
      type: "user-current",
      sender: "أحمد العلمي",
      text: 'هل قام أحدكم بتحميل ملف المراجعة الأخير؟ الملف يبدو مفقوداً في قسم "التعلم الخاص بي".',
      time: "10:22 ص",
      bgClass: "yellow-bubble"
    }
  ]);
  
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false); // Typing indicator for Sara
  const [onlineStatus, setOnlineStatus] = useState("تكتب الآن..."); // Sara status text
  const chatBottomRef = useRef(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Online members list
  const onlineMembers = [
    {
      id: "sara",
      name: "سارة الراجحي",
      status: onlineStatus,
      isTyping: isTyping,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
    },
    {
      id: "ibrahim",
      name: "إبراهيم فكري",
      status: "متصل",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80"
    },
    {
      id: "layla",
      name: "ليلى عمر",
      status: "متصل",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80"
    },
    {
      id: "hamza",
      name: "حمزة خالد",
      status: "متصل",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80"
    }
  ];

  // Send Message Handler
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    // Get current Arabic time
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "م" : "ص";
    hours = hours % 12;
    hours = hours ? hours : 12; // key 12 hour formatting
    const timeString = `${hours}:${minutes} ${ampm}`;

    const newMsg = {
      id: `user-msg-${Date.now()}`,
      type: "user-current",
      sender: "أحمد العلمي",
      text: inputVal,
      time: timeString,
      bgClass: "yellow-bubble"
    };

    setMessages(prev => [...prev, newMsg]);
    const originalText = inputVal;
    setInputVal("");

    // Simulate online reply
    setIsTyping(true);
    setOnlineStatus("تكتب الآن...");

    setTimeout(() => {
      setIsTyping(false);
      setOnlineStatus("متصل");

      let replyText = "مرحباً أحمد! سأتحقق من ذلك فوراً في لوحة التحكم الخاصة بي وأعلمك.";
      if (originalText.includes("ملف") || originalText.includes("مفقود")) {
        replyText = "نعم يا أحمد، لقد واجهت نفس المشكلة! أعتقد أن الأستاذ سيقوم بإعادة رفعه الليلة.";
      } else if (originalText.includes("محاضرة") || originalText.includes("موعد")) {
        replyText = "أعتقد أن موعد المحاضرة مؤكد يوم الثلاثاء، لقد أرسلوا لنا بريداً إلكترونياً بذلك.";
      }

      const botReply = {
        id: `bot-msg-${Date.now()}`,
        type: "user-other",
        sender: "سارة الراجحي",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
        text: replyText,
        time: timeString,
        bgClass: "blue-bubble"
      };

      setMessages(prev => [...prev, botReply]);
    }, 3000);
  };

  // Filter peers
  const filteredPeers = onlineMembers.filter(member =>
    member.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="chat-page-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css');

        :root {
          --bg-light: #fbfbf6; /* Premium light ivory background color */
          --sidebar-bg: #ffffff;
          --primary-blue: #00458b; /* Main Deep Blue */
          --primary-blue-dark: #002d5c;
          --primary-yellow: #f9c851; /* Main Gold Yellow */
          --primary-yellow-light: #fef5d8;
          --text-main: #1d1d1d;
          --text-muted: #7d8b9b;
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

        .chat-page-container {
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

        /* Sidebar Bottom Points Balance Card */
        .sidebar-points-card {
          margin: 20px;
          background: #f1f5f9;
          border-radius: 20px;
          padding: 18px;
          border: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .points-title-lbl {
          font-size: 0.8rem;
          color: #64748b;
          font-weight: 700;
        }

        .points-value-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 1.3rem;
          font-weight: 900;
          color: var(--primary-blue);
        }

        .points-value-row i {
          color: var(--primary-yellow);
        }

        /* Main Wrapper */
        .main-wrapper {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          height: 100vh;
        }

        /* Topbar styling */
        .topbar {
          padding: 20px 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: var(--bg-light);
          flex-shrink: 0;
        }

        .topbar-left-brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .topbar-brand-title {
          font-size: 1.6rem;
          font-weight: 950;
          color: var(--primary-blue);
          margin: 0;
        }

        .topbar-right-controls {
          display: flex;
          align-items: center;
          gap: 25px;
        }

        /* Student profile box */
        .topbar-student-card {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #ffffff;
          padding: 8px 16px;
          border-radius: 16px;
          border: 1px solid #f1ebd9;
          box-shadow: var(--shadow-sm);
        }

        .student-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          overflow: hidden;
          border: 1.5px solid #cbd5e1;
        }

        .student-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .student-info-mini {
          display: flex;
          flex-direction: column;
        }

        .student-name-lbl {
          font-size: 0.85rem;
          font-weight: 850;
          color: var(--text-main);
        }

        .student-role-lbl {
          font-size: 0.7rem;
          color: #64748b;
          font-weight: 700;
          margin-top: 2px;
        }

        .topbar-actions-bell {
          display: flex;
          align-items: center;
          gap: 15px;
          font-size: 1.2rem;
          color: #64748b;
        }

        .topbar-actions-bell i {
          cursor: pointer;
        }

        .topbar-actions-bell i:hover {
          color: var(--primary-blue);
        }

        /* Grid Main Content Panels */
        .panels-grid-container {
          flex-grow: 1;
          display: grid;
          grid-template-columns: 1fr 3fr;
          padding: 0 40px 30px;
          gap: 30px;
          overflow: hidden;
        }

        /* Left Panel: Online list */
        .online-list-panel {
          background: #ffffff;
          border-radius: 28px;
          border: 1px solid rgba(241, 235, 217, 0.4);
          box-shadow: var(--shadow-sm);
          padding: 25px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .panel-title-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .panel-main-lbl {
          font-size: 1.05rem;
          font-weight: 900;
          color: #1e293b;
        }

        .online-badge-count {
          background: #eff6ff;
          color: var(--primary-blue);
          font-size: 0.75rem;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 20px;
        }

        .peer-search-wrapper {
          position: relative;
          margin-bottom: 20px;
        }

        .peer-search-input {
          width: 100%;
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          border-radius: 14px;
          padding: 10px 12px 10px 35px;
          font-family: inherit;
          font-size: 0.8rem;
          outline: none;
          font-weight: 600;
        }

        .peer-search-input:focus {
          border-color: var(--primary-blue);
          background: #ffffff;
        }

        .peer-search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          font-size: 0.85rem;
        }

        .online-users-scrollable {
          flex-grow: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .online-peer-card {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
        }

        .peer-avatar-wrapper {
          position: relative;
          width: 44px;
          height: 44px;
          flex-shrink: 0;
        }

        .peer-avatar-img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          overflow: hidden;
          border: 1px solid #e2e8f0;
        }

        .peer-avatar-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .online-light-dot {
          position: absolute;
          bottom: 2px;
          left: 2px;
          width: 10px;
          height: 10px;
          background: #22c55e;
          border-radius: 50%;
          border: 2px solid #ffffff;
        }

        .peer-info-sub {
          display: flex;
          flex-direction: column;
        }

        .peer-name-lbl {
          font-size: 0.85rem;
          font-weight: 800;
          color: #334155;
        }

        .peer-status-lbl {
          font-size: 0.7rem;
          color: #94a3b8;
          font-weight: 600;
          margin-top: 2px;
        }

        .peer-status-lbl.typing {
          color: var(--primary-blue);
          font-weight: 800;
        }

        .btn-view-all-members {
          text-align: center;
          color: #3b82f6;
          font-weight: 700;
          font-size: 0.8rem;
          margin-top: auto;
          padding-top: 15px;
          cursor: pointer;
        }

        .btn-view-all-members:hover {
          text-decoration: underline;
        }

        /* Right Panel: Chat window */
        .chat-main-panel {
          background: #ffffff;
          border-radius: 28px;
          border: 1px solid rgba(241, 235, 217, 0.4);
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .chat-panel-header {
          padding: 20px 30px;
          border-bottom: 1px solid #f8f6f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-shrink: 0;
        }

        .chat-header-info {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .chat-header-icon-box {
          width: 44px;
          height: 44px;
          background: #eef2ff;
          color: var(--primary-blue);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.15rem;
        }

        .chat-header-text-block {
          display: flex;
          flex-direction: column;
        }

        .chat-main-title-lbl {
          font-size: 1rem;
          font-weight: 900;
          color: #1e293b;
        }

        .chat-main-subtitle-lbl {
          font-size: 0.75rem;
          color: #64748b;
          font-weight: 600;
          margin-top: 2px;
        }

        .chat-header-actions {
          display: flex;
          align-items: center;
          gap: 15px;
          font-size: 1.1rem;
          color: #64748b;
        }

        .chat-header-actions i {
          cursor: pointer;
        }

        /* Chat Stream Area */
        .chat-stream-scrollable {
          flex-grow: 1;
          overflow-y: auto;
          padding: 30px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          background: #fafaf7;
        }

        /* System join event log pill */
        .system-event-log-pill {
          align-self: center;
          background: #f1f5f9;
          color: #64748b;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 6px 16px;
          border-radius: 14px;
        }

        /* Message Bubble Container */
        .message-bubble-wrapper {
          display: flex;
          gap: 12px;
          max-width: 70%;
        }

        /* Blue Bubble Left (Others) */
        .message-bubble-wrapper.left {
          align-self: flex-start;
        }

        /* Yellow Bubble Right (Current User) */
        .message-bubble-wrapper.right {
          align-self: flex-end;
          flex-direction: row-reverse;
        }

        .msg-avatar-container {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
        }

        .msg-avatar-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .msg-bubble-card {
          position: relative;
          padding: 12px 18px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          line-height: 1.5;
        }

        /* Colors based on screens */
        .blue-bubble {
          background: #dbeafe;
          color: #1e293b;
          border-radius: 20px 0 20px 20px;
        }

        .yellow-bubble {
          background: var(--primary-yellow-light);
          color: #3b2a04;
          border-radius: 0 20px 20px 20px;
        }

        .msg-sender-name {
          font-size: 0.75rem;
          font-weight: 850;
          color: var(--primary-blue);
          margin-bottom: 4px;
          display: block;
        }

        .msg-timestamp-lbl {
          font-size: 0.65rem;
          color: #94a3b8;
          font-weight: 700;
          margin-top: 6px;
          text-align: left;
          display: block;
        }

        .yellow-bubble .msg-timestamp-lbl {
          color: #786432;
        }

        /* Reaction fire floating badge */
        .bubble-reaction-badge {
          position: absolute;
          bottom: -10px;
          right: -5px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }

        /* Live typing indicator bubble style */
        .typing-indicator-bubble {
          align-self: flex-start;
          background: #e2e8f0;
          border-radius: 20px 0 20px 20px;
          padding: 12px 18px;
          display: flex;
          align-items: center;
          gap: 4px;
          margin-left: 48px; /* Offset avatar */
        }

        .typing-dot {
          width: 6px;
          height: 6px;
          background: #64748b;
          border-radius: 50%;
          animation: dotBounce 1.4s infinite ease-in-out both;
        }

        .typing-dot:nth-child(1) { animation-delay: -0.32s; }
        .typing-dot:nth-child(2) { animation-delay: -0.16s; }

        @keyframes dotBounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }

        /* Chat Action controls box */
        .chat-input-bar-controls {
          padding: 20px 30px;
          background: #ffffff;
          border-top: 1px solid #f8f6f0;
          display: flex;
          align-items: center;
          gap: 15px;
          flex-shrink: 0;
        }

        .btn-chat-send {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: var(--primary-blue);
          color: #ffffff;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 1rem;
        }

        .btn-chat-send:hover {
          background: var(--primary-blue-dark);
        }

        .chat-input-field-wrapper {
          flex-grow: 1;
          position: relative;
        }

        .chat-text-input {
          width: 100%;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 24px;
          padding: 12px 20px 12px 100px;
          font-family: inherit;
          font-size: 0.85rem;
          outline: none;
          font-weight: 600;
        }

        .chat-text-input:focus {
          border-color: var(--primary-blue);
          background: #ffffff;
        }

        .chat-input-attached-icons {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          align-items: center;
          gap: 15px;
          color: #94a3b8;
          font-size: 1rem;
        }

        .chat-input-attached-icons i {
          cursor: pointer;
        }

        .chat-input-attached-icons i:hover {
          color: var(--primary-blue);
        }

        @media (max-width: 1024px) {
          .panels-grid-container {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* Right Sidebar Section */}
      <aside className="sidebar">
        <ul className="nav-list" style={{ marginTop: "30px" }}>
          <li className="nav-item-wrapper" onClick={() => alert("التوجه للرئيسية")}>
            <div className="nav-link">
              <i className="fa-solid fa-house"></i>
              <span>الرئيسية</span>
            </div>
          </li>
          <li className="nav-item-wrapper" onClick={() => alert("التوجه لمؤلف القصص")}>
            <div className="nav-link">
              <i className="fa-solid fa-pen-nib"></i>
              <span>مؤلف القصص</span>
            </div>
          </li>
          <li className="nav-item-wrapper" onClick={() => alert("التوجه لإعدادات الـ AI")}>
            <div className="nav-link">
              <i className="fa-solid fa-robot"></i>
              <span>إعدادات الـ AI</span>
            </div>
          </li>
          <li className="nav-item-wrapper" onClick={() => alert("التوجه للصالونات الصوتية")}>
            <div className="nav-link">
              <i className="fa-solid fa-microphone"></i>
              <span>الصالونات الصوتية</span>
            </div>
          </li>
          <li className="nav-item-wrapper" onClick={() => alert("التوجه للاختبارات")}>
            <div className="nav-link">
              <i className="fa-solid fa-vial"></i>
              <span>الاختبارات</span>
            </div>
          </li>
          <li className="nav-item-wrapper" onClick={() => alert("التوجه لمتابعة الطلاب")}>
            <div className="nav-link">
              <i className="fa-solid fa-users"></i>
              <span>متابعة الطلاب</span>
            </div>
          </li>
          <li className="nav-item-wrapper" onClick={() => alert("إضافة محتوى")}>
            <div className="nav-link">
              <i className="fa-solid fa-circle-plus"></i>
              <span>إضافة محتوى</span>
            </div>
          </li>
        </ul>

        {/* Sidebar Bottom Current points balance card */}
        <div className="sidebar-points-card">
          <span className="points-title-lbl">رصيدك الحالي</span>
          <div className="points-value-row">
            <span>1,250 نقطة</span>
            <i className="fa-solid fa-coins"></i>
          </div>
        </div>
      </aside>

      {/* Main Wrapper */}
      <main className="main-wrapper">
        {/* Topbar */}
        <header className="topbar">
          <div className="topbar-left-brand">
            <h1 className="topbar-brand-title">أجي تقرا</h1>
          </div>

          <div className="topbar-right-controls">
            {/* Student profile mini card */}
            <div className="topbar-student-card">
              <div className="student-avatar">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80"
                  alt="Ahmad Al Alami Avatar"
                />
              </div>
              <div className="student-info-mini">
                <span className="student-name-lbl">أحمد العلمي</span>
                <span className="student-role-lbl">مستوى متقدم</span>
              </div>
            </div>

            <div className="topbar-actions-bell">
              <i className="fa-solid fa-gear" onClick={() => alert("إعدادات المحادثة")}></i>
              <i className="fa-regular fa-bell" style={{ marginRight: "10px" }} onClick={() => alert("عرض الإشعارات")}></i>
            </div>
          </div>
        </header>

        {/* Main Grid Panels container */}
        <div className="panels-grid-container">
          {/* Panel 1: Online Members (المتصلون الآن) */}
          <aside className="online-list-panel">
            <div className="panel-title-row">
              <h3 className="panel-main-lbl">المتصلون الآن</h3>
              <span className="online-badge-count">24</span>
            </div>

            {/* Peers Search Box */}
            <div className="peer-search-wrapper">
              <i className="fa-solid fa-magnifying-glass peer-search-icon"></i>
              <input
                type="text"
                className="peer-search-input"
                placeholder="ابحث عن زملاء..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>

            {/* Online Scroll list */}
            <div className="online-users-scrollable">
              {filteredPeers.map((peer) => (
                <div className="online-peer-card" key={peer.id}>
                  <div className="peer-avatar-wrapper">
                    <div className="peer-avatar-img">
                      <img src={peer.avatar} alt={peer.name} />
                    </div>
                    <div className="online-light-dot"></div>
                  </div>
                  <div className="peer-info-sub">
                    <span className="peer-name-lbl">{peer.name}</span>
                    <span className={`peer-status-lbl ${peer.isTyping ? "typing" : ""}`}>{peer.status}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="btn-view-all-members" onClick={() => alert("عرض قائمة جميع أعضاء المنصة")}>
              مشاهدة جميع الأعضاء
            </div>
          </aside>

          {/* Panel 2: Chat Box (الدردشة العامة) */}
          <section className="chat-main-panel">
            {/* Header info */}
            <div className="chat-panel-header">
              <div className="chat-header-info">
                <div className="chat-header-icon-box">
                  <i className="fa-solid fa-users-line"></i>
                </div>
                <div className="chat-header-text-block">
                  <h3 className="chat-main-title-lbl">الدردشة العامة</h3>
                  <span className="chat-main-subtitle-lbl">مجتمع الطلاب - ساحة الحوار المفتوحة</span>
                </div>
              </div>

              <div className="chat-header-actions">
                <i className="fa-solid fa-circle-info" title="معلومات المجموعة" onClick={() => alert("غرفة الدردشة العامة لطلاب منصة أجي تقرا.")}></i>
                <i className="fa-solid fa-ellipsis-vertical" style={{ marginRight: "10px" }} onClick={() => alert("خيارات إضافية")}></i>
              </div>
            </div>

            {/* Stream Scrollable */}
            <div className="chat-stream-scrollable">
              {messages.map((msg) => {
                if (msg.type === "system") {
                  return (
                    <div className="system-event-log-pill" key={msg.id}>
                      {msg.text}
                    </div>
                  );
                }

                const isCurrentUser = msg.type === "user-current";
                return (
                  <div className={`message-bubble-wrapper ${isCurrentUser ? "right" : "left"}`} key={msg.id}>
                    {!isCurrentUser && (
                      <div className="msg-avatar-container">
                        <img src={msg.avatar} alt={msg.sender} />
                      </div>
                    )}
                    <div className={`msg-bubble-card ${msg.bgClass}`}>
                      {!isCurrentUser && <span className="msg-sender-name">{msg.sender}</span>}
                      <span>{msg.text}</span>
                      <span className="msg-timestamp-lbl">{msg.time}</span>

                      {/* Fire reaction */}
                      {msg.reaction && <span className="bubble-reaction-badge">{msg.reaction}</span>}
                    </div>
                  </div>
                );
              })}

              {/* Live typing indicator */}
              {isTyping && (
                <div className="typing-indicator-bubble">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="chat-input-bar-controls">
              {/* Send Button */}
              <button type="submit" className="btn-chat-send" title="إرسال الرسالة">
                <i className="fa-solid fa-paper-plane" style={{ transform: "rotate(180deg)" }}></i>
              </button>

              {/* Text Input area */}
              <div className="chat-input-field-wrapper">
                <input
                  type="text"
                  className="chat-text-input"
                  placeholder="اكتب رسالتك هنا..."
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                />

                <div className="chat-input-attached-icons">
                  <i className="fa-solid fa-face-smile" onClick={() => alert("فتح قائمة الإيموجي 😊")}></i>
                  <i className="fa-solid fa-paperclip" onClick={() => alert("إرفاق ملف أو صورة 📎")}></i>
                  <i className="fa-solid fa-microphone" onClick={() => alert("تسجيل مقطع صوتي 🎙️")}></i>
                </div>
              </div>
            </form>
          </section>
        </div>
          </main>
      </div>
    );
  };

export default GeneralChat;
