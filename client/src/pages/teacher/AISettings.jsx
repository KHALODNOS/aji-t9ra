import React, { useState } from "react";

const AISettings = ({ onBack, onHome, onAuthorClick, onVideoClick, onTestsClick, onSalonsClick, onStudentsClick }) => {
  const [difficulty, setDifficulty] = useState(60);
  const [xp, setXp] = useState(50);

  return (
    <div className="dashboard-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css');

        :root {
          --bg-light: #fdfdfd;
          --sidebar-bg: #ffffff;
          --primary-blue: #00458b;
          --primary-yellow: #f9c851;
          --text-main: #1d1d1d;
          --text-muted: #757575;
          --border-color: #f1f1f1;
        }

        * { box-sizing: border-box; }
        body { margin: 0; font-family: 'Tajawal', sans-serif; background: #f9fafb; direction: rtl; }

        .dashboard-container { display: flex; width: 100%; min-height: 100vh; }

        /* Sidebar - Teacher Style */
        .sidebar {
          width: 300px; background: var(--sidebar-bg); border-left: 1px solid var(--border-color);
          display: flex; flex-direction: column; padding: 25px 0; flex-shrink: 0;
        }
        .sidebar-brand { font-size: 1.8rem; font-weight: 800; color: var(--primary-blue); text-align: center; margin-bottom: 5px; }
        .sidebar-sub { font-size: 0.8rem; color: var(--text-muted); text-align: center; margin-bottom: 25px; display: block; font-weight: 700; }

        .nav-list { list-style: none; padding: 0 10px; margin: 0; flex-grow: 1; }
        .nav-link {
          display: flex; align-items: center; gap: 15px; padding: 12px 20px; text-decoration: none; color: var(--text-muted); font-weight: 700; cursor: pointer; border-radius: 12px; margin-bottom: 5px;
        }
        .nav-link.active { background: #f0f7ff; color: var(--primary-blue); }
        .nav-link i { font-size: 1.1rem; width: 24px; text-align: center; }

        .sidebar-bottom { padding: 0 20px 20px; text-align: center; }
        .logout-link { color: var(--text-muted); font-weight: 800; cursor: pointer; font-size: 0.9rem; }

        /* Main Area */
        .main-wrapper { flex-grow: 1; display: flex; flex-direction: column; position: relative; }
        
        .topbar { height: 80px; padding: 0 40px; display: flex; align-items: center; justify-content: space-between; }
        .story-selector { background: #fff; border: 1px solid #eee; border-radius: 15px; padding: 10px 20px; display: flex; align-items: center; gap: 15px; cursor: pointer; min-width: 200px; box-shadow: 0 2px 10px rgba(0,0,0,0.02); }
        .story-selector span { font-weight: 800; color: var(--primary-blue); }
        .story-label { font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 2px; }

        .topbar-icons { display: flex; align-items: center; gap: 20px; }
        .icon-box { width: 40px; height: 40px; border-radius: 50%; background: #fff; display: flex; align-items: center; justify-content: center; color: var(--primary-blue); font-size: 1.1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.05); cursor: pointer; }

        .content-area { padding: 20px 40px 40px; display: grid; grid-template-columns: 1fr 450px; gap: 40px; }

        /* Form Section */
        .settings-card { background: #fff; border-radius: 30px; padding: 40px; border: 1px solid #f1f1f1; box-shadow: 0 10px 40px rgba(0,0,0,0.02); position: relative; }
        .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
        .card-title { display: flex; align-items: center; gap: 15px; color: var(--primary-blue); font-weight: 800; font-size: 1.3rem; }
        .badge-beta { background: #fef3c7; color: #d97706; padding: 4px 12px; border-radius: 8px; font-size: 0.75rem; font-weight: 800; }

        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 35px; }
        .form-group label { display: block; font-weight: 800; font-size: 0.95rem; margin-bottom: 12px; color: #374151; }
        .form-group input, .form-group textarea { width: 100%; padding: 15px 20px; border-radius: 15px; border: 1px solid #f3f4f6; background: #f9fafb; outline: none; font-family: inherit; font-size: 1rem; }
        .form-group textarea { height: 180px; line-height: 1.6; }

        /* Difficulty Slider */
        .difficulty-section { margin-bottom: 40px; }
        .slider-labels { display: flex; justify-content: space-between; color: #9ca3af; font-size: 0.8rem; font-weight: 700; margin-top: 15px; }
        .difficulty-pill { background: #eff6ff; color: #3b82f6; padding: 4px 15px; border-radius: 20px; font-size: 0.75rem; font-weight: 800; display: inline-block; margin-bottom: 10px; }
        
        .slider-container { width: 100%; position: relative; padding: 10px 0; }
        .custom-slider { -webkit-appearance: none; width: 100%; height: 10px; border-radius: 5px; background: #e5e7eb; outline: none; }
        .custom-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 24px; height: 24px; border-radius: 50%; background: #fff; border: 6px solid var(--primary-blue); cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }

        /* XP Section */
        .xp-card { background: #f0f7ff; border: 2px dashed #bfdbfe; border-radius: 20px; padding: 25px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 40px; }
        .xp-info { display: flex; align-items: center; gap: 20px; }
        .xp-icon { width: 50px; height: 50px; border-radius: 15px; background: var(--primary-yellow); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; }
        .xp-text h5 { margin: 0; font-size: 1.1rem; font-weight: 800; color: var(--primary-blue); }
        .xp-text p { margin: 0; font-size: 0.85rem; color: #6b7280; font-weight: 600; }
        
        .xp-counter { display: flex; align-items: center; gap: 15px; }
        .counter-btn { width: 32px; height: 32px; border-radius: 8px; border: 1px solid #d1d5db; background: #fff; cursor: pointer; font-weight: 800; }
        .counter-val { background: #fff; padding: 8px 25px; border-radius: 12px; font-weight: 800; border: 1px solid #eee; color: var(--primary-blue); }

        .btn-group { display: flex; gap: 20px; }
        .btn-save { flex-grow: 1; background: var(--primary-blue); color: #fff; border: none; padding: 18px; border-radius: 15px; font-weight: 800; font-size: 1.1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 12px; }
        .btn-reset { width: 150px; background: transparent; border: 2px solid #e5e7eb; color: #757575; padding: 18px; border-radius: 15px; font-weight: 800; cursor: pointer; }

        /* Chat Preview */
        .chat-preview { background: #eef2f3; border-radius: 40px; display: flex; flex-direction: column; overflow: hidden; height: 100%; border: 8px solid #fff; box-shadow: 0 20px 50px rgba(0,0,0,0.05); }
        .chat-header { padding: 25px; background: rgba(255,255,255,0.7); backdrop-filter: blur(10px); display: flex; align-items: center; justify-content: space-between; }
        .preview-title { display: flex; align-items: center; gap: 12px; font-weight: 800; color: #1f2937; }
        .status-dot { width: 10px; height: 10px; background: #10b981; border-radius: 50%; }

        .chat-body { flex-grow: 1; padding: 25px; display: flex; flex-direction: column; gap: 20px; overflow-y: auto; }
        .msg { max-width: 85%; padding: 15px 20px; border-radius: 20px; font-size: 0.95rem; line-height: 1.6; font-weight: 600; }
        .msg-bot { background: #fff; color: #374151; align-self: flex-start; border-bottom-right-radius: 5px; box-shadow: 0 4px 12px rgba(0,0,0,0.02); }
        .msg-user { background: var(--primary-blue); color: #fff; align-self: flex-end; border-bottom-left-radius: 5px; }

        .chat-footer { padding: 20px; background: #fff; display: flex; align-items: center; gap: 15px; }
        .chat-input { flex-grow: 1; background: #f3f4f6; border: none; padding: 12px 20px; border-radius: 15px; outline: none; font-family: inherit; }
        .btn-send { width: 45px; height: 45px; border-radius: 12px; background: var(--primary-blue); color: #fff; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; }

        /* Analytics Footer */
        .analytics-row { margin-top: 30px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .stat-small { background: #fff; padding: 20px; border-radius: 20px; border: 1px solid #f1f1f1; display: flex; align-items: center; justify-content: space-between; }
        .stat-small h6 { margin: 0; font-size: 0.8rem; color: #757575; }
        .stat-small span { font-size: 1.2rem; font-weight: 800; color: var(--primary-blue); }
        .stat-icon-s { font-size: 1.5rem; }

        /* Floating Alert */
        .floating-alert {
          position: absolute; bottom: 100px; left: 40px; background: #fff; padding: 15px 25px; border-radius: 20px;
          box-shadow: 0 15px 40px rgba(0,0,0,0.1); border-right: 6px solid #f9c851; display: flex; align-items: center; gap: 15px;
          animation: slideIn 0.5s ease-out; z-index: 100;
        }
        .alert-icon { width: 40px; height: 40px; border-radius: 50%; background: #fef9c3; color: #ca8a04; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; }
        .alert-text b { display: block; font-size: 0.9rem; color: #1a1a1a; }
        .alert-text span { font-size: 0.75rem; color: #757575; }

        @keyframes slideIn { from { transform: translateX(-100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      `}</style>

      <aside className="sidebar">
        <div className="sidebar-brand">أجي تقرا</div>
        <span className="sidebar-sub">لوحة الإدارة الذكية</span>
        <ul className="nav-list">
          <li onClick={onHome}><div className="nav-link"><i className="fa-solid fa-house"></i><span>الرئيسية</span></div></li>
          <li onClick={onAuthorClick}><div className="nav-link"><i className="fa-solid fa-pen-nib"></i><span>مؤلف القصص</span></div></li>
          <li onClick={onVideoClick}><div className="nav-link"><i className="fa-solid fa-video"></i><span>إضافة فيديو قصير</span></div></li>
          <li><div className="nav-link active"><i className="fa-solid fa-robot"></i><span>إعدادات الـ AI</span></div></li>
          <li onClick={onTestsClick}><div className="nav-link"><i className="fa-solid fa-vial"></i><span>الاختبارات</span></div></li>
          <li onClick={onSalonsClick}><div className="nav-link"><i className="fa-solid fa-microphone"></i><span>الصالونات الصوتية</span></div></li>
          <li onClick={onStudentsClick}><div className="nav-link"><i className="fa-solid fa-users"></i><span>متابعة الطلاب</span></div></li>
        </ul>
        <div className="sidebar-bottom">
          <div className="logout-link" onClick={onBack}><i className="fa-solid fa-arrow-right-from-bracket"></i><span> تسجيل الخروج</span></div>
        </div>
      </aside>

      <main className="main-wrapper">
        <header className="topbar">
          <div className="story-selector">
            <div>
              <span className="story-label">القصة المختارة</span>
              <span>أسرار الفضاء</span>
            </div>
            <i className="fa-solid fa-chevron-down" style={{ fontSize: '0.8rem', color: '#999' }}></i>
            <i className="fa-solid fa-book-open" style={{ marginRight: 'auto', color: 'var(--primary-blue)' }}></i>
          </div>
          <div className="topbar-icons">
            <div className="icon-box"><i className="fa-regular fa-bell"></i></div>
            <div className="icon-box"><i className="fa-regular fa-circle-question"></i></div>
          </div>
        </header>

        <div className="content-area">
          {/* Left Column: Settings */}
          <div className="form-column">
            <div className="settings-card">
              <div className="card-header">
                <div className="card-title">
                  <i className="fa-solid fa-gear"></i>
                  <span>إعدادات مختبر الذكاء الاصطناعي</span>
                </div>
                <span className="badge-beta">إصدار تجريبي v2.0</span>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>اسم الشخصية</label>
                  <input type="text" defaultValue="حكيم القرية" />
                </div>
                <div className="form-group">
                  <label>نبرة الصوت</label>
                  <input type="text" defaultValue="ودود (Friendly)" />
                </div>
              </div>

              <div className="difficulty-section">
                <span className="difficulty-pill">متوسط</span>
                <label style={{ display: 'block', fontWeight: '800', marginBottom: '10px' }}>مستوى الصعوبة</label>
                <div className="slider-container">
                  <input type="range" className="custom-slider" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} />
                  <div className="slider-labels">
                    <span>سهل جداً</span>
                    <span>متحدي</span>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>تعليمات البوت (System Prompt) <i className="fa-regular fa-circle-question" style={{ color: '#9ca3af', fontSize: '0.8rem' }}></i></label>
                <textarea defaultValue="تحدث كأنك شخصية من القصة. ركز على استخدام الكلمات الصعبة التي حددتها أنا. ولا تعط الإجابة مباشرة."></textarea>
              </div>

              <div className="xp-card">
                <div className="xp-info">
                  <div className="xp-icon"><i className="fa-solid fa-medal"></i></div>
                  <div className="xp-text">
                    <h5>مكافآت الخبرة (XP)</h5>
                    <p>نقاط يكتسبها الطالب عند كل حوار</p>
                  </div>
                </div>
                <div className="xp-counter">
                  <button className="counter-btn" onClick={() => setXp(xp - 5)}>-</button>
                  <div className="counter-val">{xp}</div>
                  <button className="counter-btn" onClick={() => setXp(xp + 5)}>+</button>
                </div>
              </div>

              <div className="btn-group">
                <button className="btn-save"><i className="fa-solid fa-file-shield"></i> حفظ وتفعيل الشخصية</button>
                <button className="btn-reset">إعادة تعيين</button>
              </div>
            </div>

            <div className="analytics-row">
              <div className="stat-small">
                <div>
                  <h6>إجمالي المحادثات اليوم</h6>
                  <span>1,284</span>
                </div>
                <div className="stat-icon-s">💬</div>
              </div>
              <div className="stat-small">
                <div>
                  <h6>تقييم رضا الطلاب</h6>
                  <span>94%</span>
                </div>
                <div className="stat-icon-s">😊</div>
              </div>
            </div>
          </div>

          {/* Right Column: Chat Preview */}
          <div className="preview-column">
            <div className="chat-preview">
              <div className="chat-header">
                <div className="preview-title">
                  <div className="status-dot"></div>
                  <span>معاينة الشخصية</span>
                </div>
                <i className="fa-solid fa-flask" style={{ color: 'var(--primary-blue)' }}></i>
              </div>
              
              <div className="chat-body">
                <div className="msg msg-bot">
                  مرحباً أيها المستكشف! أنا "حكيم القرية". هل أنت مستعد للغوص في أسرار الفضاء؟ أخبرني ماذا تعرف عن الثقوب السوداء؟
                </div>
                <div className="msg msg-user">
                  أريد أن أعرف كيف تتكون النجوم.
                </div>
                <div className="msg msg-bot">
                  سؤال ذكي! النجوم تولد من سحب غبار هائلة تسمى "السديم". تخيلها كحضانات كونية... هل يمكنك نطق كلمة "سديم"؟
                </div>
              </div>

              <div className="chat-footer">
                <input type="text" className="chat-input" placeholder="اكتب رسالتك هنا..." />
                <button className="btn-send"><i className="fa-solid fa-paper-plane"></i></button>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Alert */}
        <div className="floating-alert">
          <div className="alert-icon"><i className="fa-solid fa-wand-magic-sparkles"></i></div>
          <div className="alert-text">
            <b>شخصية "حكيم القرية" تعمل الآن بكفاءة عالية!</b>
            <span>تم ربط 15 كلمة صعبة من درس الفضاء بنجاح في حوارات اليوم.</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AISettings;
