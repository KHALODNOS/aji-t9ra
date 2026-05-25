import React, { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useSocket } from "../../context/SocketContext";
import api from "../../services/api";
import { publishStudentRewards } from "../../utils/studentRewards";

const fallbackAvatar = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80";

const getCurrentUser = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return {
      id: user._id || user.id || "local-user",
      name: user.fullName || user.username || "طالب أجي تقرا",
      avatar: user.avatarUrl || user.photoProfile || user.avatar || fallbackAvatar,
      role: user.Role || user.role || "student",
    };
  } catch (error) {
    console.error("Error reading current user:", error);
    return {
      id: "local-user",
      name: "طالب أجي تقرا",
      avatar: fallbackAvatar,
      role: "student",
    };
  }
};

const formatTime = (value) => {
  const date = value ? new Date(value) : new Date();
  return date.toLocaleTimeString("ar-MA", { hour: "2-digit", minute: "2-digit" });
};

const GeneralChat = () => {
  const { socket: contextSocket } = useSocket();
  const [localSocket, setLocalSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState({});
  const [searchText, setSearchText] = useState("");
  const [inputVal, setInputVal] = useState("");
  const chatBottomRef = useRef(null);
  const typingTimerRef = useRef(null);
  const currentUser = useMemo(getCurrentUser, []);
  const socket = contextSocket || localSocket;

  useEffect(() => {
    if (contextSocket || localSocket) return undefined;

    const token = localStorage.getItem("token");
    if (!token || !currentUser.id) return undefined;

    const nextSocket = io("http://localhost:5000");
    nextSocket.on("connect", () => {
      nextSocket.emit("join", currentUser.id);
    });
    setLocalSocket(nextSocket);

    return () => {
      nextSocket.close();
      setLocalSocket(null);
    };
  }, [contextSocket, currentUser, localSocket]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUsers]);

  useEffect(() => {
    if (!socket) return undefined;

    socket.emit("general-chat:join", currentUser);

    const handleHistory = (history) => {
      setMessages(Array.isArray(history) ? history : []);
    };

    const handleMessage = (message) => {
      setMessages((current) => (
        current.some((item) => item.id === message.id) ? current : [...current, message]
      ));
    };

    const handleSystem = (event) => {
      setMessages((current) => [...current, { ...event, type: "system" }]);
    };

    const handleUsers = (users) => {
      setOnlineUsers(Array.isArray(users) ? users : []);
    };

    const handleTyping = ({ isTyping, user }) => {
      if (!user?.id || user.id === currentUser.id) return;
      setTypingUsers((current) => {
        const next = { ...current };
        if (isTyping) next[user.id] = user;
        else delete next[user.id];
        return next;
      });
    };

    socket.on("general-chat:history", handleHistory);
    socket.on("general-chat:message", handleMessage);
    socket.on("general-chat:system", handleSystem);
    socket.on("general-chat:users", handleUsers);
    socket.on("general-chat:typing", handleTyping);

    return () => {
      socket.emit("general-chat:typing", { isTyping: false, user: currentUser });
      socket.off("general-chat:history", handleHistory);
      socket.off("general-chat:message", handleMessage);
      socket.off("general-chat:system", handleSystem);
      socket.off("general-chat:users", handleUsers);
      socket.off("general-chat:typing", handleTyping);
      window.clearTimeout(typingTimerRef.current);
    };
  }, [socket, currentUser]);

  const filteredUsers = onlineUsers.filter((user) => (
    (user.name || "").toLowerCase().includes(searchText.toLowerCase())
  ));

  const typingList = Object.values(typingUsers);

  const recordChatActivity = async () => {
    try {
      const response = await api.post("/student/journey/activity", { type: "general_chat_message" });
      publishStudentRewards({ earnedBadges: response.data?.earnedBadges || [] });
    } catch (error) {
      console.error("Error recording chat activity:", error);
    }
  };

  const handleInputChange = (event) => {
    setInputVal(event.target.value);
    if (!socket) return;

    socket.emit("general-chat:typing", { isTyping: true, user: currentUser });
    window.clearTimeout(typingTimerRef.current);
    typingTimerRef.current = window.setTimeout(() => {
      socket.emit("general-chat:typing", { isTyping: false, user: currentUser });
    }, 900);
  };

  const handleSendMessage = (event) => {
    event.preventDefault();
    const text = inputVal.trim();
    if (!text || !socket) return;

    socket.emit("general-chat:message", { text, user: currentUser });
    socket.emit("general-chat:typing", { isTyping: false, user: currentUser });
    setInputVal("");
    recordChatActivity();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css');

        .general-chat-page {
          direction: rtl;
          font-family: 'Tajawal', sans-serif;
          display: grid;
          grid-template-columns: 300px minmax(0, 1fr);
          gap: 22px;
          min-height: calc(100vh - 150px);
        }

        .chat-side-panel,
        .chat-main-panel {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 24px;
          box-shadow: 0 12px 32px rgba(15, 23, 42, 0.05);
          overflow: hidden;
        }

        .chat-side-panel {
          display: flex;
          flex-direction: column;
          padding: 20px;
          min-height: 580px;
        }

        .chat-side-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .chat-side-title h3,
        .chat-title-block h3 {
          margin: 0;
          color: #315b55;
          font-size: 1.05rem;
          font-weight: 900;
        }

        .online-count {
          background: #f2f8f7;
          color: #5DA296;
          border-radius: 999px;
          padding: 5px 10px;
          font-size: 0.72rem;
          font-weight: 900;
        }

        .chat-search {
          position: relative;
          margin-bottom: 16px;
        }

        .chat-search input {
          width: 100%;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          border-radius: 14px;
          padding: 11px 36px 11px 12px;
          outline: none;
          font-family: inherit;
          font-weight: 800;
        }

        .chat-search i {
          position: absolute;
          right: 13px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }

        .online-list {
          display: grid;
          gap: 12px;
          overflow-y: auto;
          padding-left: 4px;
        }

        .online-user {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          border-radius: 16px;
          background: #f8fafc;
        }

        .user-avatar-wrap {
          position: relative;
          width: 42px;
          height: 42px;
          flex-shrink: 0;
        }

        .user-avatar-wrap img,
        .message-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
        }

        .online-dot {
          position: absolute;
          bottom: 1px;
          left: 1px;
          width: 11px;
          height: 11px;
          border-radius: 50%;
          border: 2px solid #ffffff;
          background: #22c55e;
        }

        .online-user strong {
          display: block;
          color: #172033;
          font-size: 0.86rem;
          font-weight: 900;
        }

        .online-user span {
          color: #64748b;
          font-size: 0.72rem;
          font-weight: 800;
        }

        .chat-main-panel {
          min-height: 580px;
          display: flex;
          flex-direction: column;
        }

        .chat-header {
          padding: 20px 24px;
          border-bottom: 1px solid #eef2f7;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
        }

        .chat-title-block {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .chat-title-icon {
          width: 44px;
          height: 44px;
          border-radius: 14px;
          display: grid;
          place-items: center;
          background: #f2f8f7;
          color: #5DA296;
        }

        .chat-title-block span {
          display: block;
          color: #64748b;
          font-size: 0.78rem;
          font-weight: 800;
          margin-top: 3px;
        }

        .socket-status {
          color: ${socket ? "#16a34a" : "#b91c1c"};
          font-size: 0.8rem;
          font-weight: 900;
        }

        .chat-stream {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          background: #f8fafc;
        }

        .system-message {
          align-self: center;
          background: #e2e8f0;
          color: #64748b;
          border-radius: 999px;
          padding: 7px 14px;
          font-size: 0.75rem;
          font-weight: 900;
        }

        .message-row {
          display: flex;
          gap: 10px;
          max-width: 72%;
          align-items: flex-start;
        }

        .message-row.mine {
          align-self: flex-end;
          flex-direction: row-reverse;
        }

        .message-row.other {
          align-self: flex-start;
        }

        .message-avatar {
          width: 36px;
          height: 36px;
          flex-shrink: 0;
        }

        .message-bubble {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 18px 4px 18px 18px;
          padding: 11px 14px;
          box-shadow: 0 8px 20px rgba(15, 23, 42, 0.04);
        }

        .message-row.mine .message-bubble {
          background: #5DA296;
          color: #ffffff;
          border-color: #5DA296;
          border-radius: 4px 18px 18px 18px;
        }

        .message-sender {
          display: block;
          color: #5DA296;
          font-size: 0.76rem;
          font-weight: 900;
          margin-bottom: 4px;
        }

        .message-row.mine .message-sender {
          color: rgba(255,255,255,0.82);
        }

        .message-text {
          font-size: 0.9rem;
          font-weight: 700;
          line-height: 1.55;
          white-space: pre-wrap;
          overflow-wrap: anywhere;
        }

        .message-time {
          display: block;
          margin-top: 6px;
          color: #94a3b8;
          font-size: 0.68rem;
          font-weight: 800;
          text-align: left;
        }

        .message-row.mine .message-time {
          color: rgba(255,255,255,0.76);
        }

        .typing-line {
          align-self: flex-start;
          color: #64748b;
          font-size: 0.8rem;
          font-weight: 900;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .typing-dots {
          display: inline-flex;
          gap: 4px;
        }

        .typing-dots span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #5DA296;
          animation: typingPulse 1.1s infinite ease-in-out;
        }

        .typing-dots span:nth-child(2) { animation-delay: 0.12s; }
        .typing-dots span:nth-child(3) { animation-delay: 0.24s; }

        @keyframes typingPulse {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.45; }
          40% { transform: scale(1); opacity: 1; }
        }

        .chat-form {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 18px 22px;
          background: #ffffff;
          border-top: 1px solid #eef2f7;
        }

        .chat-form input {
          flex: 1;
          min-width: 0;
          border: 1px solid #dbe4ea;
          background: #f8fafc;
          border-radius: 999px;
          padding: 14px 18px;
          outline: none;
          font-family: inherit;
          font-weight: 800;
        }

        .chat-form input:focus {
          border-color: #5DA296;
          box-shadow: 0 0 0 3px rgba(93, 162, 150, 0.12);
          background: #ffffff;
        }

        .chat-send {
          border: 0;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #5DA296;
          color: #ffffff;
          cursor: pointer;
          display: grid;
          place-items: center;
          flex-shrink: 0;
        }

        .chat-send:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .empty-chat {
          margin: auto;
          color: #64748b;
          font-weight: 900;
          text-align: center;
        }

        @media (max-width: 1050px) {
          .general-chat-page {
            grid-template-columns: 1fr;
          }

          .chat-side-panel {
            min-height: auto;
            max-height: 260px;
          }
        }
      `}</style>

      <div className="general-chat-page">
        <aside className="chat-side-panel">
          <div className="chat-side-title">
            <h3>المتصلون الآن</h3>
            <span className="online-count">{onlineUsers.length}</span>
          </div>

          <div className="chat-search">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="ابحث عن طالب..."
            />
          </div>

          <div className="online-list">
            {filteredUsers.map((user) => (
              <div className="online-user" key={`${user.id}-${user.name}`}>
                <div className="user-avatar-wrap">
                  <img src={user.avatar || fallbackAvatar} alt={user.name} />
                  <span className="online-dot"></span>
                </div>
                <div>
                  <strong>{user.name}</strong>
                  <span>{typingUsers[user.id] ? "يكتب الآن..." : "متصل"}</span>
                </div>
              </div>
            ))}
          </div>
        </aside>

        <section className="chat-main-panel">
          <header className="chat-header">
            <div className="chat-title-block">
              <div className="chat-title-icon">
                <i className="fa-solid fa-comments"></i>
              </div>
              <div>
                <h3>الدردشة العامة</h3>
                <span>رسائل مباشرة بين الطلاب عبر Socket.IO</span>
              </div>
            </div>
            <div className="socket-status">
              {socket ? "متصل مباشر" : "غير متصل"}
            </div>
          </header>

          <div className="chat-stream">
            {messages.length ? messages.map((message) => {
              if (message.type === "system") {
                return <div className="system-message" key={message.id}>{message.text}</div>;
              }

              const isMine = message.sender?.id === currentUser.id;
              return (
                <div className={`message-row ${isMine ? "mine" : "other"}`} key={message.id}>
                  {!isMine && (
                    <div className="message-avatar">
                      <img src={message.sender?.avatar || fallbackAvatar} alt={message.sender?.name || "طالب"} />
                    </div>
                  )}
                  <div className="message-bubble">
                    <span className="message-sender">{isMine ? "أنت" : message.sender?.name || "طالب"}</span>
                    <div className="message-text">{message.text}</div>
                    <span className="message-time">{formatTime(message.createdAt)}</span>
                  </div>
                </div>
              );
            }) : (
              <div className="empty-chat">
                لا توجد رسائل بعد. ابدأ المحادثة الآن.
              </div>
            )}

            {typingList.length > 0 && (
              <div className="typing-line">
                <span>{typingList.map((user) => user.name).join("، ")} يكتب</span>
                <span className="typing-dots"><span></span><span></span><span></span></span>
              </div>
            )}

            <div ref={chatBottomRef}></div>
          </div>

          <form className="chat-form" onSubmit={handleSendMessage}>
            <input
              value={inputVal}
              onChange={handleInputChange}
              placeholder={socket ? "اكتب رسالتك هنا..." : "انتظر الاتصال بالخادم..."}
              disabled={!socket}
            />
            <button className="chat-send" type="submit" disabled={!socket || !inputVal.trim()} title="إرسال">
              <i className="fa-solid fa-paper-plane" style={{ transform: "rotate(180deg)" }}></i>
            </button>
          </form>
        </section>
      </div>
    </>
  );
};

export default GeneralChat;
