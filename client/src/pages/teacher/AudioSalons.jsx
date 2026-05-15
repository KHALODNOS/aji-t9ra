import React from "react";

const AudioSalons = ({ onBack, onHome, onAuthorClick, onVideoClick, onAISettings, onTestsClick, onStudentsClick }) => {
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
          --success-green: #10b981;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { margin: 0; font-family: 'Tajawal', sans-serif; background: #f9fafb; direction: rtl; }

        .dashboard-container { display: flex; width: 100%; min-height: 100vh; background: #f9fafb; }

        /* Sidebar */
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
        .nav-link.active { background: #eef2ff; color: var(--primary-blue); border-right: 4px solid var(--primary-blue); border-radius: 0 12px 12px 0; }
        .nav-link i { font-size: 1.1rem; width: 24px; text-align: center; }

        .sidebar-bottom { padding: 0 20px 20px; text-align: center; }
        .logout-link { color: #ef4444; font-weight: 800; cursor: pointer; font-size: 0.9rem; border-top: 1px solid #eee; padding-top: 20px; display: block; }

        /* Main Area */
        .main-wrapper { flex-grow: 1; display: flex; flex-direction: column; min-width: 0; }
        
        .topbar { height: 80px; padding: 0 40px; display: flex; align-items: center; justify-content: space-between; background: #fff; border-bottom: 1px solid #f1f1f1; }
        .search-container { position: relative; width: 400px; }
        .search-input { width: 100%; background: #f8f9fa; border: none; border-radius: 15px; padding: 12px 45px 12px 20px; outline: none; font-family: inherit; font-size: 0.9rem; color: #1e293b; }
        .search-icon { position: absolute; right: 15px; top: 50%; transform: translateY(-50%); color: #9ca3af; }

        .topbar-left { display: flex; align-items: center; gap: 20px; }
        .icon-btn { font-size: 1.3rem; color: var(--primary-blue); cursor: pointer; position: relative; }
        .notif-dot { position: absolute; top: -2px; right: -2px; width: 8px; height: 8px; background: #ef4444; border-radius: 50%; border: 2px solid #fff; }
        .p-thumb { width: 40px; height: 40px; border-radius: 50%; border: 2px solid var(--primary-blue); }

        .content-area { padding: 40px; display: grid; grid-template-columns: 380px 1fr; gap: 30px; }

        .page-header { grid-column: 1 / -1; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; }
        .page-title { font-size: 1.8rem; font-weight: 800; color: var(--primary-blue); display: flex; align-items: center; gap: 15px; }
        .live-dot { width: 12px; height: 12px; background: var(--success-green); border-radius: 50%; box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.2); animation: pulse 2s infinite; }
        @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); } 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); } }
        .date-badge { background: #fff; padding: 10px 20px; border-radius: 12px; border: 1px solid #eee; font-weight: 800; color: #555; font-size: 0.85rem; display: flex; align-items: center; gap: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.02); }

        /* Left Column */
        .controls-col { display: flex; flex-direction: column; gap: 25px; }
        .control-card { background: #fff; border-radius: 24px; padding: 25px; border: 1px solid #f1f1f1; box-shadow: 0 4px 15px rgba(0,0,0,0.02); }
        .card-header { display: flex; align-items: center; gap: 10px; font-weight: 800; color: #1e293b; margin-bottom: 20px; font-size: 1rem; }
        .card-header i { color: #f59e0b; }

        .mic-box { background: #f8fafc; border: 2px dashed #e2e8f0; border-radius: 20px; padding: 35px 20px; text-align: center; margin-bottom: 20px; }
        .mic-icon { font-size: 2.2rem; color: #cbd5e1; margin-bottom: 12px; display: block; }
        .mic-status { font-weight: 800; font-size: 0.95rem; color: #334155; }

        .vol-label { display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: 800; color: #64748b; margin-bottom: 10px; }
        .vol-slider { width: 100%; -webkit-appearance: none; height: 6px; background: #e2e8f0; border-radius: 10px; outline: none; }
        .vol-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 18px; height: 18px; background: var(--primary-blue); border-radius: 50%; cursor: pointer; border: 3px solid #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }

        .waveform { height: 35px; display: flex; align-items: center; gap: 4px; justify-content: center; margin-top: 20px; }
        .wave-bar { width: 3px; background: var(--primary-blue); border-radius: 3px; animation: wave 1.2s ease-in-out infinite; }
        @keyframes wave { 0%, 100% { height: 8px; opacity: 0.3; } 50% { height: 28px; opacity: 1; } }

        /* Schedule */
        .form-group { margin-bottom: 18px; }
        .form-group label { display: block; font-weight: 800; font-size: 0.85rem; margin-bottom: 8px; color: #475569; }
        .form-input { width: 100%; padding: 12px 15px; border-radius: 12px; border: 1px solid #e2e8f0; background: #f8fafc; outline: none; font-family: inherit; font-size: 0.9rem; color: #1e293b; }
        .check-group { display: flex; align-items: center; gap: 10px; font-size: 0.85rem; font-weight: 700; color: #64748b; margin-top: 5px; cursor: pointer; }
        .btn-schedule { width: 100%; background: #fff; border: 2px solid #f1f5f9; padding: 14px; border-radius: 14px; font-weight: 800; color: #1e293b; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 12px; margin-top: 15px; transition: 0.2s; }
        .btn-schedule:hover { background: #f8fafc; border-color: #e2e8f0; }

        .upcoming-list { margin-top: 25px; display: flex; flex-direction: column; gap: 15px; }
        .upcoming-item { display: flex; align-items: center; gap: 15px; padding: 12px; border-radius: 15px; background: #f8fafc; }
        .up-icon { width: 42px; height: 42px; border-radius: 12px; background: #fff; border: 1px solid #f1f1f1; display: flex; align-items: center; justify-content: center; color: #f59e0b; font-size: 1.1rem; flex-shrink: 0; }
        .up-text b { display: block; font-size: 0.85rem; font-weight: 800; color: #1e293b; margin-bottom: 2px; }
        .up-text span { font-size: 0.75rem; color: #64748b; font-weight: 600; }

        /* Right Column */
        .rooms-col { display: flex; flex-direction: column; gap: 30px; }
        .quick-open-card { background: #fff; border-radius: 30px; padding: 30px; border: 1px solid #f1f1f1; box-shadow: 0 10px 40px rgba(0,0,0,0.02); position: relative; overflow: hidden; }
        .quick-open-card::before { content: '⚡'; position: absolute; top: -10px; left: -10px; font-size: 8rem; opacity: 0.03; transform: rotate(-15deg); }
        
        .card-title-main { display: flex; align-items: center; gap: 12px; color: var(--primary-blue); font-weight: 800; font-size: 1.2rem; margin-bottom: 25px; position: relative; }
        .open-room-form { display: grid; grid-template-columns: 1.5fr 1fr 150px; gap: 20px; align-items: flex-end; position: relative; }
        .btn-open-now { background: var(--primary-blue); color: #fff; border: none; padding: 14px; border-radius: 12px; font-weight: 800; cursor: pointer; font-size: 0.95rem; }

        .table-card { background: #fff; border-radius: 30px; padding: 30px; border: 1px solid #f1f1f1; box-shadow: 0 4px 20px rgba(0,0,0,0.02); }
        .table-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
        .table-header h3 { font-size: 1.2rem; font-weight: 800; color: var(--primary-blue); }
        .rooms-count { background: #f1f5f9; padding: 4px 12px; border-radius: 8px; font-size: 0.8rem; color: #475569; font-weight: 800; }

        table { width: 100%; border-collapse: collapse; text-align: right; }
        th { padding: 15px; font-size: 0.85rem; color: #94a3b8; border-bottom: 2px solid #f8fafc; font-weight: 800; }
        td { padding: 18px 15px; border-bottom: 1px solid #f8fafc; font-size: 0.95rem; font-weight: 700; color: #1e293b; }

        .host-cell { display: flex; align-items: center; gap: 15px; }
        .host-avatar { width: 45px; height: 45px; border-radius: 50%; border: 3px solid #f8fafc; }
        .host-name { color: var(--primary-blue); font-weight: 800; }

        .participants-badge { display: flex; align-items: center; gap: 8px; color: #64748b; font-size: 0.9rem; }
        .participants-badge i { color: #94a3b8; }

        .actions-cell { display: flex; gap: 12px; }
        .btn-action { padding: 8px 20px; border-radius: 10px; font-weight: 800; border: none; cursor: pointer; font-size: 0.85rem; }
        .btn-join { background: #eff6ff; color: #2563eb; }
        .btn-end { background: #fef2f2; color: #ef4444; }
      `}</style>

      <aside className="sidebar">
        <div className="sidebar-brand">أجي تقرا</div>
        <span className="sidebar-sub">لوحة الإدارة الذكية</span>
        <ul className="nav-list">
          <li onClick={onHome}><div className="nav-link"><i className="fa-solid fa-house"></i><span>الرئيسية</span></div></li>
          <li onClick={onAuthorClick}><div className="nav-link"><i className="fa-solid fa-pen-nib"></i><span>مؤلف القصص</span></div></li>
          <li onClick={onVideoClick}><div className="nav-link"><i className="fa-solid fa-video"></i><span>إضافة فيديو قصير</span></div></li>
          <li onClick={onAISettings}><div className="nav-link"><i className="fa-solid fa-robot"></i><span>إعدادات الـ AI</span></div></li>
          <li onClick={onTestsClick}><div className="nav-link"><i className="fa-solid fa-vial"></i><span>الاختبارات</span></div></li>
          <li><div className="nav-link active"><i className="fa-solid fa-microphone"></i><span>الصالونات الصوتية</span></div></li>
          <li onClick={onStudentsClick}><div className="nav-link"><i className="fa-solid fa-users"></i><span>متابعة الطلاب</span></div></li>
        </ul>
        <div className="sidebar-bottom">
          <div className="logout-link" onClick={onBack}><i className="fa-solid fa-arrow-right-from-bracket"></i><span> تسجيل الخروج</span></div>
        </div>
      </aside>

      <main className="main-wrapper">
        <header className="topbar">
          <div className="search-container">
            <i className="fa-solid fa-magnifying-glass search-icon"></i>
            <input type="text" className="search-input" placeholder="بحث عن غرف أو مديرين..." />
          </div>
          <div className="topbar-left">
            <div className="icon-btn">
              <i className="fa-regular fa-bell"></i>
              <div className="notif-dot"></div>
            </div>
            <div className="icon-btn"><i className="fa-solid fa-gear"></i></div>
            <img className="p-thumb" src="https://i.pravatar.cc/150?u=teacher" alt="Profile" />
          </div>
        </header>

        <div className="content-area">
          <header className="page-header">
            <div className="page-title">
              <div className="live-dot"></div>
              <h1>الصالونات الصوتية المباشرة</h1>
            </div>
            <div className="date-badge">
              <i className="fa-regular fa-calendar-check" style={{ color: 'var(--primary-blue)' }}></i>
              اليوم: 24 مايو 2024
            </div>
          </header>

          {/* Left Column */}
          <div className="controls-col">
            <section className="control-card">
              <div className="card-header"><i className="fa-solid fa-wave-square"></i> إعدادات البث</div>
              <div className="mic-box">
                <i className="fa-solid fa-microphone-lines mic-icon"></i>
                <div className="mic-status">الميكروفون نشط</div>
              </div>
              <div className="vol-label"><span>مستوى الصوت</span><span>85%</span></div>
              <input type="range" className="vol-slider" defaultValue="85" />
              <div className="waveform">
                {[1,2,3,4,5,6,7,8,9,10,11,12].map(i => (
                  <div key={i} className="wave-bar" style={{ animationDelay: `${i * 0.1}s` }}></div>
                ))}
              </div>
            </section>

            <section className="control-card">
              <div className="card-header"><i className="fa-solid fa-calendar-days"></i> جدولة غرفة جديدة</div>
              <div className="form-group">
                <label>التاريخ والوقت</label>
                <input type="datetime-local" className="form-input" />
              </div>
              <label className="check-group">
                <input type="checkbox" /> 
                <span>تنبيه جميع الطلاب المشتركين</span>
              </label>
              <button className="btn-schedule"><i className="fa-solid fa-plus-circle"></i> إضافة إلى الجدول</button>

              <div className="upcoming-list">
                <div style={{ fontWeight: '800', color: '#94a3b8', fontSize: '0.8rem', paddingRight: '5px' }}>الغرف القادمة</div>
                <div className="upcoming-item">
                  <div className="up-icon"><i className="fa-solid fa-headphones"></i></div>
                  <div className="up-text">
                    <b>تطوير مهارات الاستماع</b>
                    <span>غداً 10:00 - المستوى المتوسط</span>
                  </div>
                </div>
                <div className="upcoming-item">
                  <div className="up-icon"><i className="fa-solid fa-stethoscope"></i></div>
                  <div className="up-text">
                    <b>ورشة المصطلحات الطبية</b>
                    <span>الأحد 14:00 - المستوى المتقدم</span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="rooms-col">
            <section className="quick-open-card">
              <div className="card-title-main"><i className="fa-solid fa-bolt-lightning"></i> فتح غرفة الآن</div>
              <div className="open-room-form">
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>عنوان الغرفة</label>
                  <input type="text" className="form-input" placeholder="مثال: ممارسة المحادثة اليومية" />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>مستوى اللغة</label>
                  <select className="form-input">
                    <option>مبتدئ (A1-A2)</option>
                    <option>متوسط (B1-B2)</option>
                    <option>متقدم (C1-C2)</option>
                  </select>
                </div>
                <button className="btn-open-now">ابدأ البث</button>
              </div>
            </section>

            <section className="table-card">
              <div className="table-header">
                <h3>الغرف النشطة حالياً</h3>
                <div className="rooms-count">12 غرفة جارية</div>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>المضيف</th>
                    <th>الموضوع</th>
                    <th>الحضور</th>
                    <th>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="host-cell">
                        <img className="host-avatar" src="https://i.pravatar.cc/150?u=samir" alt="Host" />
                        <div className="host-name">أ. سمير العلوي</div>
                      </div>
                    </td>
                    <td><div style={{ color: '#475569' }}>قواعد اللغة الأمازيغية للمبتدئين</div></td>
                    <td>
                      <div className="participants-badge">
                        <i className="fa-solid fa-users"></i>
                        145 طالب
                      </div>
                    </td>
                    <td className="actions-cell">
                      <button className="btn-action btn-join">انضمام</button>
                      <button className="btn-action btn-end">إنهاء</button>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="host-cell">
                        <img className="host-avatar" src="https://i.pravatar.cc/150?u=leila" alt="Host" />
                        <div className="host-name">أ. ليلى بناني</div>
                      </div>
                    </td>
                    <td><div style={{ color: '#475569' }}>نادي المحادثة باللغة الفرنسية</div></td>
                    <td>
                      <div className="participants-badge">
                        <i className="fa-solid fa-users"></i>
                        82 طالب
                      </div>
                    </td>
                    <td className="actions-cell">
                      <button className="btn-action btn-join">انضمام</button>
                      <button className="btn-action btn-end">إنهاء</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AudioSalons;
