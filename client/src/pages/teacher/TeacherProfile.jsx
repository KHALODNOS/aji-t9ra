import React from "react";

const TeacherProfile = ({ onBack, onHome, onAuthorClick, onVideoClick, onAISettings, onTestsClick, onSalonsClick, onStudentsClick }) => {
  return (
    <div className="dashboard-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css');

        :root {
          --bg-light: #f8fafc;
          --sidebar-bg: #ffffff;
          --primary-blue: #00458b;
          --primary-yellow: #f9c851;
          --text-main: #1e293b;
          --text-muted: #64748b;
          --border-color: #f1f5f9;
          --success-green: #10b981;
          --active-blue: #eef2ff;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { margin: 0; font-family: 'Tajawal', sans-serif; background: var(--bg-light); direction: rtl; }

        .dashboard-container { display: flex; width: 100%; min-height: 100vh; background: var(--bg-light); }

        /* Sidebar */
        .sidebar {
          width: 280px; background: var(--sidebar-bg); border-left: 1px solid var(--border-color);
          display: flex; flex-direction: column; padding: 30px 0; flex-shrink: 0;
        }
        .sidebar-brand { text-align: center; margin-bottom: 40px; }
        .brand-logo { width: 50px; height: 50px; background: var(--primary-blue); color: #fff; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; font-size: 1.5rem; }
        .brand-name { font-size: 1.4rem; font-weight: 800; color: var(--primary-blue); display: block; }
        .brand-sub { font-size: 0.75rem; color: var(--text-muted); font-weight: 700; }

        .nav-list { list-style: none; padding: 0 15px; margin: 0; flex-grow: 1; }
        .nav-link {
          display: flex; align-items: center; gap: 15px; padding: 12px 20px; text-decoration: none; color: var(--text-muted); font-weight: 700; cursor: pointer; border-radius: 12px; margin-bottom: 5px; transition: 0.2s;
        }
        .nav-link:hover { background: #f8fafc; color: var(--primary-blue); }
        .nav-link.active { background: var(--active-blue); color: var(--primary-blue); border-right: 4px solid var(--primary-blue); border-radius: 0 12px 12px 0; }
        .nav-link i { font-size: 1.1rem; width: 24px; text-align: center; }

        /* Main Area */
        .main-wrapper { flex-grow: 1; display: flex; flex-direction: column; min-width: 0; }
        
        .topbar { height: 70px; padding: 0 40px; display: flex; align-items: center; justify-content: space-between; background: transparent; }
        .platform-name { font-weight: 800; color: var(--primary-blue); font-size: 1.2rem; display: flex; align-items: center; gap: 10px; }
        
        .topbar-icons { display: flex; align-items: center; gap: 20px; }
        .status-badge { background: #fffbeb; color: #d97706; padding: 6px 15px; border-radius: 10px; font-size: 0.75rem; font-weight: 800; display: flex; align-items: center; gap: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.02); }
        .pulse-dot { width: 8px; height: 8px; background: #f9c851; border-radius: 50%; box-shadow: 0 0 0 3px rgba(249, 200, 81, 0.2); }
        .icon-box { color: var(--text-muted); font-size: 1.2rem; cursor: pointer; }

        .content-area { padding: 0 40px 40px; }

        /* Profile Header */
        .profile-header-card {
          background: #fff; border-radius: 30px; padding: 40px; border: 1px solid #f1f5f9; box-shadow: 0 10px 40px rgba(0,0,0,0.02);
          display: flex; align-items: center; justify-content: space-between; margin-bottom: 30px; position: relative; overflow: hidden;
        }
        .profile-header-card::before { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 5px; background: var(--primary-blue); opacity: 0.1; }

        .p-info-main { display: flex; align-items: center; gap: 30px; }
        .p-avatar-box { position: relative; }
        .p-avatar { width: 140px; height: 140px; border-radius: 50%; border: 5px solid #fff; box-shadow: 0 10px 25px rgba(0,0,0,0.1); object-fit: cover; }
        .verify-badge { position: absolute; bottom: 10px; right: 10px; width: 28px; height: 28px; background: var(--primary-blue); color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid #fff; font-size: 0.7rem; }

        .p-text h1 { font-size: 2.2rem; font-weight: 800; color: var(--primary-blue); margin-bottom: 5px; }
        .p-spec { font-size: 1.1rem; color: var(--text-muted); font-weight: 700; }

        .header-actions { display: flex; flex-direction: column; gap: 15px; }
        .btn-edit { background: var(--primary-blue); color: #fff; border: none; padding: 12px 30px; border-radius: 12px; font-weight: 800; cursor: pointer; }
        .btn-download { background: #fff; color: var(--primary-blue); border: 1.5px solid var(--primary-blue); padding: 11px 30px; border-radius: 12px; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 10px; }

        .header-stats { display: flex; gap: 30px; margin-top: 30px; padding-top: 25px; border-top: 1px solid #f1f5f9; }
        .h-stat-item { display: flex; align-items: center; gap: 12px; }
        .h-stat-icon { width: 42px; height: 42px; border-radius: 12px; background: #f8fafc; display: flex; align-items: center; justify-content: center; color: var(--primary-blue); font-size: 1.1rem; }
        .h-stat-icon.yellow { background: #fff9eb; color: #ca8a04; }
        .h-stat-icon.red { background: #fef2f2; color: #dc2626; }
        .h-stat-text b { display: block; font-size: 1.1rem; color: var(--primary-blue); }
        .h-stat-text span { font-size: 0.8rem; color: var(--text-muted); font-weight: 700; }

        /* Grid Layout */
        .profile-grid { display: grid; grid-template-columns: 350px 1fr; gap: 30px; }

        /* Left Column */
        .p-card { background: #fff; border-radius: 24px; padding: 30px; border: 1px solid #f1f5f9; margin-bottom: 30px; }
        .p-card-title { font-size: 1.1rem; font-weight: 800; color: var(--primary-blue); margin-bottom: 25px; display: flex; align-items: center; gap: 12px; }
        .p-card-title i { color: var(--primary-blue); font-size: 1.2rem; }

        .lang-list { display: flex; flex-wrap: wrap; gap: 10px; }
        .lang-tag { padding: 8px 15px; border-radius: 10px; background: #f1f5f9; color: #475569; font-size: 0.85rem; font-weight: 800; }
        .lang-tag.active { background: var(--primary-blue); color: #fff; }
        .lang-tag.yellow { background: var(--primary-yellow); color: var(--primary-blue); }

        .skill-item { margin-bottom: 20px; }
        .skill-label { display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 800; color: #334155; margin-bottom: 8px; }
        .skill-bar-bg { width: 100%; height: 8px; background: #f1f5f9; border-radius: 10px; overflow: hidden; }
        .skill-bar-fill { height: 100%; background: var(--primary-yellow); border-radius: 10px; }

        .portfolio-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .portfolio-header span { color: var(--primary-blue); font-weight: 800; font-size: 0.85rem; cursor: pointer; }
        .portfolio-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .port-card { border-radius: 15px; overflow: hidden; position: relative; aspect-ratio: 4/6; box-shadow: 0 10px 20px rgba(0,0,0,0.1); cursor: pointer; }
        .port-img { width: 100%; height: 100%; object-fit: cover; }
        .port-overlay { position: absolute; bottom: 0; left: 0; width: 100%; padding: 15px; background: linear-gradient(transparent, rgba(0,0,0,0.8)); color: #fff; }
        .port-name { font-size: 0.85rem; font-weight: 800; margin-bottom: 2px; }
        .port-sub { font-size: 0.7rem; opacity: 0.8; font-weight: 700; }

        /* Right Column */
        .bio-text { font-size: 1rem; color: #475569; line-height: 1.8; font-weight: 600; }

        .qual-item { display: flex; align-items: center; gap: 20px; padding: 20px; background: #f8fafc; border-radius: 15px; margin-bottom: 15px; border: 1px solid #f1f5f9; }
        .qual-icon { width: 45px; height: 45px; border-radius: 12px; background: #fff; border: 1.5px solid #eee; display: flex; align-items: center; justify-content: center; color: var(--primary-blue); font-size: 1.1rem; }
        .qual-icon.yellow { color: #ca8a04; border-color: #fef3c7; }
        .qual-text b { display: block; font-size: 1rem; color: var(--primary-blue); margin-bottom: 2px; }
        .qual-text span { font-size: 0.8rem; color: var(--text-muted); font-weight: 700; }

        .timeline { position: relative; padding-right: 20px; }
        .timeline::before { content: ''; position: absolute; right: 0; top: 0; bottom: 0; width: 2px; background: #e2e8f0; }
        .timeline-item { position: relative; margin-bottom: 30px; }
        .timeline-dot { position: absolute; right: -25px; top: 5px; width: 12px; height: 12px; background: var(--primary-blue); border-radius: 50%; border: 3px solid #fff; box-shadow: 0 0 0 3px rgba(0, 69, 139, 0.1); }
        .timeline-dot.gray { background: #cbd5e1; box-shadow: none; }
        
        .t-date { display: inline-block; padding: 4px 12px; background: #f1f5f9; border-radius: 8px; font-size: 0.75rem; font-weight: 800; color: #475569; margin-bottom: 10px; }
        .t-date.active { background: var(--primary-blue); color: #fff; }
        .t-title { display: block; font-size: 1.1rem; font-weight: 800; color: var(--primary-blue); margin-bottom: 8px; }
        .t-desc { font-size: 0.9rem; color: var(--text-muted); line-height: 1.6; font-weight: 600; }

        /* Footer Alert */
        .footer-banner { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 15px; padding: 15px; display: flex; align-items: center; justify-content: center; gap: 15px; margin-top: 30px; }
        .f-icon { width: 32px; height: 32px; background: #eef2ff; color: var(--primary-blue); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; }
        .f-text { font-size: 0.85rem; font-weight: 800; color: #475569; }
      `}</style>

      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-logo"><i className="fa-solid fa-book-open-reader"></i></div>
          <span className="brand-name">بوابة المعلم</span>
          <span className="brand-sub">إدارة المسار التعليمي</span>
        </div>
        <ul className="nav-list">
          <li onClick={onHome}><div className="nav-link"><i className="fa-solid fa-house"></i><span>الرئيسية</span></div></li>
          <li onClick={onAuthorClick}><div className="nav-link"><i className="fa-solid fa-pen-nib"></i><span>مؤلف القصص</span></div></li>
          <li onClick={onAISettings}><div className="nav-link"><i className="fa-solid fa-robot"></i><span>إعدادات الـ AI</span></div></li>
          <li onClick={onTestsClick}><div className="nav-link"><i className="fa-solid fa-vial"></i><span>الاختبارات</span></div></li>
          <li onClick={onSalonsClick}><div className="nav-link"><i className="fa-solid fa-microphone"></i><span>الصالونات الصوتية</span></div></li>
          <li onClick={onStudentsClick}><div className="nav-link"><i className="fa-solid fa-users"></i><span>متابعة الطلاب</span></div></li>
        </ul>
      </aside>

      <main className="main-wrapper">
        <header className="topbar">
          <div className="platform-name">
            <i className="fa-solid fa-magnifying-glass icon-box"></i>
            <span>المنصة التعليمية</span>
          </div>
          <div className="topbar-icons">
            <div className="status-badge">
              <div className="pulse-dot"></div>
              <span>نشط الآن</span>
            </div>
            <i className="fa-regular fa-bell icon-box"></i>
            <i className="fa-solid fa-gear icon-box"></i>
            <img src="https://i.pravatar.cc/150?u=teacher" style={{ width: '35px', height: '35px', borderRadius: '50%' }} alt="Avatar" />
          </div>
        </header>

        <div className="content-area">
          <section className="profile-header-card">
            <div className="p-info-main">
              <div className="p-avatar-box">
                <img className="p-avatar" src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400" alt="Ahmed" />
                <div className="verify-badge"><i className="fa-solid fa-check"></i></div>
              </div>
              <div className="p-text">
                <h1>أستاذ محمد طويل</h1>
                <span className="p-spec">متخصص لغة تيفيناغ</span>
                
                <div className="header-stats">
                  <div className="h-stat-item">
                    <div className="h-stat-icon"><i className="fa-solid fa-users"></i></div>
                    <div className="h-stat-text"><b>1,240</b><span>إجمالي الطلاب</span></div>
                  </div>
                  <div className="h-stat-item">
                    <div className="h-stat-icon yellow"><i className="fa-solid fa-book"></i></div>
                    <div className="h-stat-text"><b>45</b><span>القصص المنشورة</span></div>
                  </div>
                  <div className="h-stat-item">
                    <div className="h-stat-icon red"><i className="fa-solid fa-star"></i></div>
                    <div className="h-stat-text"><b>4.9</b><span>التقييم العام</span></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="header-actions">
              <button className="btn-edit">تعديل الملف الشخصي</button>
              <button className="btn-download"><i className="fa-solid fa-download"></i> تحميل السيرة الذاتية</button>
            </div>
          </section>

          <div className="profile-grid">
            {/* Left Column */}
            <div className="p-left-col">
              <div className="p-card">
                <div className="p-card-title"><i className="fa-solid fa-language"></i> اللغات</div>
                <div className="lang-list">
                  <span className="lang-tag active">تيفيناغ (خبير)</span>
                  <span className="lang-tag yellow">العربية (أم)</span>
                  <span className="lang-tag">الإنجليزية (متقدم)</span>
                </div>
              </div>

              <div className="p-card">
                <div className="p-card-title"><i className="fa-solid fa-bolt"></i> المهارات</div>
                <div className="skill-item">
                  <div className="skill-label"><span>التعلم التفاعلي</span><span>95%</span></div>
                  <div className="skill-bar-bg"><div className="skill-bar-fill" style={{ width: '95%' }}></div></div>
                </div>
                <div className="skill-item">
                  <div className="skill-label"><span>رواية القصص Digital Storytelling</span><span>90%</span></div>
                  <div className="skill-bar-bg"><div className="skill-bar-fill" style={{ width: '90%' }}></div></div>
                </div>
                <div className="skill-item">
                  <div className="skill-label"><span>إدارة الفصول الافتراضية</span><span>85%</span></div>
                  <div className="skill-bar-bg"><div className="skill-bar-fill" style={{ width: '85%' }}></div></div>
                </div>
              </div>

              <div className="p-card">
                <div className="portfolio-header">
                  <div className="p-card-title" style={{ marginBottom: 0 }}><i className="fa-solid fa-briefcase"></i> معرض الأعمال</div>
                  <span>عرض الكل</span>
                </div>
                <div className="portfolio-grid">
                  <div className="port-card">
                    <img className="port-img" src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400" alt="p1" />
                    <div className="port-overlay">
                      <div className="port-name">مغامرة في الأطلس</div>
                      <div className="port-sub">Linguist Short</div>
                    </div>
                  </div>
                  <div className="port-card">
                    <img className="port-img" src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400" alt="p2" />
                    <div className="port-overlay">
                      <div className="port-name">أساسيات التيفيناغ</div>
                      <div className="port-sub">Author Story</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="p-right-col">
              <div className="p-card">
                <div className="p-card-title"><i className="fa-solid fa-user-tie"></i> النبذة الشخصية</div>
                <p className="bio-text">
                  أنا أستاذ متخصص في تدريس اللغة الأمازيغية وخط التيفيناغ، أسعى دائماً لدمج التكنولوجيا مع التراث الثقافي لخلق تجارب تعليمية فريدة. أؤمن بأن سرد القصص الرقمي هو المفتاح لفتح آفاق الإبداع لدى الطلاب وتحفيزهم على اكتشاف هويتهم اللغوية من خلال أدوات التعلم التفاعلية والذكاء الاصطناعي.
                </p>
              </div>

              <div className="p-card">
                <div className="p-card-title"><i className="fa-solid fa-graduation-cap"></i> المؤهلات العلمية</div>
                <div className="qual-item">
                  <div className="qual-icon"><i className="fa-solid fa-medal"></i></div>
                  <div className="qual-text">
                    <b>ماجستير في اللسانيات</b>
                    <span>جامعة محمد الخامس - الرباط</span>
                  </div>
                </div>
                <div className="qual-item">
                  <div className="qual-icon yellow"><i className="fa-solid fa-award"></i></div>
                  <div className="qual-text">
                    <b>بكالوريوس في الدراسات الأمازيغية</b>
                    <span>كلية الآداب والعلوم الإنسانية</span>
                  </div>
                </div>
              </div>

              <div className="p-card">
                <div className="p-card-title"><i className="fa-solid fa-clock-rotate-left"></i> الخبرة المهنية</div>
                <div className="timeline">
                  <div className="timeline-item">
                    <div className="timeline-dot"></div>
                    <span className="t-date active">2018 - الآن</span>
                    <span className="t-title">أستاذ لغة بجامعة الرباط</span>
                    <p className="t-desc">تدريس مساقات اللسانيات والخط الأمازيغي المتقدم للطلاب الجامعيين.</p>
                  </div>
                  <div className="timeline-item">
                    <div className="timeline-dot gray"></div>
                    <span className="t-date">2015 - 2018</span>
                    <span className="t-title">مطور محتوى تعليمي</span>
                    <p className="t-desc">تصميم مناهج تفاعلية لتعليم التيفيناغ عبر المنصات الرقمية.</p>
                  </div>
                </div>
              </div>

              <div className="footer-banner">
                <div className="f-icon"><i className="fa-solid fa-award"></i></div>
                <span className="f-text">تم إكمال 95% من تحديثات الملف الشخصي لعام 2024</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeacherProfile;
