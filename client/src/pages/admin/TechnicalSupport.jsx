import React, { useState } from "react";

const TechnicalSupport = () => {
  const [activeTicket, setActiveTicket] = useState(0);

  const stats = [
    { label: "تذاكر مفتوحة", count: "12", color: "red", icon: "fa-asterisk" },
    { label: "قيد المعالجة", count: "08", color: "orange", icon: "fa-rotate" },
    { label: "تذاكر مغلقة", count: "142", color: "green", icon: "fa-check" }
  ];

  const tickets = [
    { id: "4492", user: "سارة أحمد", avatar: "https://i.pravatar.cc/150?u=sara", subject: "مشكلة في تحميل فيديو الفيزياء", category: "محتوى تعليمي", time: "منذ ساعتين", priority: "عالية", color: "#d32f2f" },
    { id: "8821", user: "محمد العلي", avatar: "https://i.pravatar.cc/150?u=mohammed", subject: "خطأ في معالجة الدفع الشهري", category: "مالي", time: "منذ 5 ساعات", priority: "متوسطة", color: "#854d0e" },
    { id: "1029", user: "أ. ليلى فهمي", avatar: "https://i.pravatar.cc/150?u=layla", subject: "تعديل الملف الشخصي للمعلم", category: "تقني", time: "أمس، 10:30 م", priority: "منخفضة", color: "#757575" }
  ];

  return (
    <div className="support-container">
      <header className="support-header">
        <div className="header-info">
          <h1 className="page-title">مركز الدعم الفني</h1>
          <p className="page-subtitle">إدارة استفسارات المعلمين والطلاب وحل المشكلات التقنية.</p>
        </div>
        <button className="export-btn"><i className="fa-solid fa-download"></i> تصدير البيانات</button>
      </header>

      {/* Stats Section */}
      <div className="stats-row">
        {stats.map((stat, i) => (
          <div className={`stat-card ${stat.color}`} key={i}>
            <div className="stat-content">
              <span className="stat-label">{stat.label}</span>
              <span className="stat-count">{stat.count}</span>
            </div>
            <div className="stat-icon-circle"><i className={`fa-solid ${stat.icon}`}></i></div>
          </div>
        ))}
      </div>

      <div className="support-grid">
        {/* Chat Window (Left) */}
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-user-info">
              <div className="chat-avatar"><img src="https://i.pravatar.cc/150?u=mohammed" alt="Avatar" /></div>
              <div className="chat-user-details">
                <span className="chat-user-name">محمد العلي</span>
                <span className="chat-ticket-id">تذكرة رقم: #8821# - مالي</span>
              </div>
            </div>
            <button className="close-chat"><i className="fa-solid fa-xmark"></i></button>
          </div>

          <div className="chat-messages">
            <div className="message user-msg">
              <div className="msg-bubble">
                السلام عليكم، واجهت مشكلة عند محاولة دفع الاشتراك الشهري. تم سحب المبلغ من حسابي البنكي لكن حالة الاشتراك ما زالت "غير مفعل". يرجى المساعدة.
                <span className="msg-time">AM 11:05</span>
              </div>
            </div>
            <div className="message admin-msg">
              <div className="msg-bubble">
                وعليكم السلام يا محمد، نعتذر عن هذا الخلل. هل يمكنك تزويدنا بصورة من عملية التحويل البنكي أو رقم العملية للتأكد من النظام؟
                <span className="msg-time">AM 11:20</span>
              </div>
            </div>
          </div>

          <div className="chat-input-area">
            <textarea placeholder="اكتب ردك هنا..."></textarea>
            <div className="chat-actions">
              <div className="input-tools">
                <button className="tool-btn"><i className="fa-solid fa-paperclip"></i></button>
                <button className="tool-btn"><i className="fa-regular fa-face-smile"></i></button>
              </div>
              <div className="main-btns">
                <button className="btn-close-ticket">إغلاق التذكرة</button>
                <button className="btn-send">إرسال الرد</button>
              </div>
            </div>
          </div>
        </div>

        {/* Ticket List (Right) */}
        <div className="tickets-panel">
          <div className="panel-header">
            <h3>قائمة التذاكر الحالية</h3>
            <div className="filters">
              <span className="filter-pill">الفئة: الكل</span>
              <span className="filter-pill">الأولوية: الكل</span>
            </div>
          </div>

          <div className="tickets-list">
            {tickets.map((ticket, i) => (
              <div className={`ticket-item ${i === 1 ? 'active' : ''}`} key={i}>
                <div className="ticket-user">
                  <img src={ticket.avatar} alt={ticket.user} />
                  <div className="user-meta">
                    <span className="u-name">{ticket.user}</span>
                    <span className="u-id">#{ticket.id}</span>
                  </div>
                </div>
                <div className="ticket-info">
                  <span className="t-subject">{ticket.subject}</span>
                  <span className="t-category">الفئة: {ticket.category}</span>
                </div>
                <div className="ticket-time">{ticket.time}</div>
                <div className="ticket-status">
                  <span className="priority-badge" style={{ backgroundColor: ticket.color + '15', color: ticket.color }}>
                    {ticket.priority}
                  </span>
                </div>
                <div className="ticket-action"><i className="fa-solid fa-chevron-left"></i></div>
              </div>
            ))}
          </div>
          <div className="panel-footer">عرض جميع التذاكر (42)</div>
        </div>
      </div>

      <style>{`
        .support-container { padding: 30px; background: #fafbfc; min-height: 100vh; }
        .support-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
        .page-title { font-size: 2.4rem; font-weight: 800; color: #00458b; margin: 0; }
        .page-subtitle { color: #757575; font-weight: 600; margin: 5px 0 0; }

        .export-btn {
          background: #fff; border: 1px solid #e0e0e0; padding: 10px 20px; border-radius: 12px;
          font-family: inherit; font-weight: 800; cursor: pointer; color: #00458b;
          display: flex; align-items: center; gap: 10px;
        }

        /* Stats Card Row */
        .stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 25px; margin-bottom: 35px; }
        .stat-card {
          background: #fff; border-radius: 20px; padding: 25px; display: flex; justify-content: space-between; align-items: center;
          box-shadow: 0 4px 15px rgba(0,0,0,0.02); position: relative; overflow: hidden;
        }
        .stat-card::after { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 6px; }
        .stat-card.red::after { background: #d32f2f; }
        .stat-card.orange::after { background: #ea580c; }
        .stat-card.green::after { background: #16a34a; }

        .stat-label { display: block; color: #757575; font-weight: 800; margin-bottom: 5px; }
        .stat-count { display: block; font-size: 2.2rem; font-weight: 800; color: #1a1a1a; }
        .stat-icon-circle { width: 50px; height: 50px; border-radius: 50%; background: #f8f9fa; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; color: #757575; }

        /* Support Grid */
        .support-grid { display: grid; grid-template-columns: 1fr 1.6fr; gap: 30px; align-items: start; }

        /* Ticket List Panel (Right) */
        .tickets-panel { background: #fff; border-radius: 24px; border: 1px solid #f1f1f1; box-shadow: 0 10px 30px rgba(0,0,0,0.02); }
        .panel-header { padding: 20px 25px; border-bottom: 1px solid #f1f1f1; display: flex; justify-content: space-between; align-items: center; }
        .panel-header h3 { margin: 0; font-size: 1.1rem; font-weight: 800; }
        .filters { display: flex; gap: 10px; }
        .filter-pill { background: #f1f3f8; padding: 6px 15px; border-radius: 8px; font-size: 0.85rem; font-weight: 700; color: #555; }

        .tickets-list { padding: 10px; }
        .ticket-item {
          display: grid; grid-template-columns: 180px 1fr 120px 100px 40px; align-items: center; padding: 18px;
          border-radius: 16px; transition: 0.2s; cursor: pointer;
        }
        .ticket-item:hover { background: #f8f9fa; }
        .ticket-item.active { background: #eef2ff; }

        .ticket-user { display: flex; align-items: center; gap: 12px; }
        .ticket-user img { width: 45px; height: 45px; border-radius: 50%; }
        .user-meta .u-name { display: block; font-weight: 800; font-size: 0.95rem; }
        .user-meta .u-id { display: block; font-size: 0.8rem; color: #999; }

        .ticket-info .t-subject { display: block; font-weight: 700; color: #00458b; margin-bottom: 3px; }
        .ticket-info .t-category { display: block; font-size: 0.85rem; color: #757575; }

        .ticket-time { font-size: 0.85rem; color: #757575; font-weight: 600; }
        .priority-badge { padding: 4px 12px; border-radius: 8px; font-size: 0.8rem; font-weight: 800; }
        .ticket-action { text-align: left; color: #00458b; font-size: 1.1rem; }

        .panel-footer { padding: 15px; text-align: center; font-weight: 800; color: #00458b; border-top: 1px solid #f1f1f1; cursor: pointer; }

        /* Chat Window (Left) */
        .chat-window {
          background: #fff; border-radius: 24px; border: 1px solid #f1f1f1; box-shadow: 0 10px 30px rgba(0,0,0,0.02);
          display: flex; flex-direction: column; height: 600px; overflow: hidden;
        }
        .chat-header {
          padding: 20px; background: #00458b; color: white; display: flex; justify-content: space-between; align-items: center;
        }
        .chat-user-info { display: flex; align-items: center; gap: 12px; }
        .chat-avatar { width: 45px; height: 45px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.3); overflow: hidden; }
        .chat-avatar img { width: 100%; height: 100%; }
        .chat-user-name { display: block; font-weight: 800; font-size: 1.1rem; }
        .chat-ticket-id { display: block; font-size: 0.8rem; opacity: 0.8; }
        .close-chat { background: rgba(255,255,255,0.15); border: none; color: white; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; }

        .chat-messages { flex: 1; padding: 25px; overflow-y: auto; background: #fcfcfc; display: flex; flex-direction: column; gap: 20px; }
        .msg-bubble { max-width: 85%; padding: 15px; border-radius: 20px; font-size: 0.95rem; line-height: 1.6; position: relative; font-weight: 600; }
        .msg-time { display: block; font-size: 0.75rem; margin-top: 8px; opacity: 0.6; }

        .user-msg { align-self: flex-start; }
        .user-msg .msg-bubble { background: #fff; border: 1px solid #eee; border-top-right-radius: 4px; color: #333; }

        .admin-msg { align-self: flex-end; }
        .admin-msg .msg-bubble { background: #e8f0fe; border-top-left-radius: 4px; color: #00458b; text-align: left; }

        .chat-input-area { padding: 20px; border-top: 1px solid #f1f1f1; background: #fff; }
        .chat-input-area textarea {
          width: 100%; height: 80px; border: none; resize: none; font-family: inherit; font-size: 1rem; outline: none; margin-bottom: 15px;
        }
        .chat-actions { display: flex; justify-content: space-between; align-items: center; }
        .input-tools { display: flex; gap: 15px; }
        .tool-btn { background: transparent; border: none; color: #757575; font-size: 1.2rem; cursor: pointer; }

        .main-btns { display: flex; gap: 10px; }
        .btn-send { background: #00458b; color: white; border: none; padding: 10px 25px; border-radius: 10px; font-weight: 800; cursor: pointer; }
        .btn-close-ticket { background: #ffeaea; color: #d32f2f; border: none; padding: 10px 20px; border-radius: 10px; font-weight: 800; cursor: pointer; }

        @media (max-width: 1200px) {
          .support-grid { grid-template-columns: 1fr; }
          .stats-row { grid-template-columns: 1fr 1fr; }
        }
      `}</style>
    </div>
  );
};

export default TechnicalSupport;
