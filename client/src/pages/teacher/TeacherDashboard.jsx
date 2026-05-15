import React, { useState } from "react";

const TeacherDashboard = ({ onBack, onHome, onAuthorClick, onVideoClick, onAISettings, onTestsClick, onSalonsClick, onStudentsClick }) => {
  const stats = [
    { label: "إجمالي القراء", count: "1,240", icon: "fa-eye", color: "#00458b" },
    { label: "متوسط التقييم", count: "4.8/5", icon: "fa-star", color: "#f9c851" },
    { label: "القصص النشطة", count: "12", icon: "fa-book", color: "#00458b" },
    { label: "ساعات البث", count: "85", icon: "fa-clock", color: "#f9c851" }
  ];

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
        body { margin: 0; font-family: 'Tajawal', sans-serif; background: var(--bg-light); direction: rtl; }

        .dashboard-container { display: flex; width: 100%; min-height: 100vh; }

        .sidebar {
          width: 300px; background: var(--sidebar-bg); border-left: 1px solid var(--border-color);
          display: flex; flex-direction: column; padding: 25px 0; flex-shrink: 0;
        }
        .sidebar-brand { font-size: 1.8rem; font-weight: 800; color: var(--primary-blue); text-align: center; margin-bottom: 25px; }

        .user-card {
          margin: 0 20px 25px; padding: 20px; background: #fff; border: 1px solid #f8f8f8; border-radius: 20px; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.03);
        }
        .user-avatar { width: 80px; height: 80px; margin: 0 auto 12px; border-radius: 50%; border: 3px solid var(--primary-blue); overflow: hidden; }
        .user-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .user-name { font-weight: 800; font-size: 1.1rem; margin-bottom: 4px; }
        .user-email { color: var(--text-muted); font-size: 0.8rem; }

        .nav-list { list-style: none; padding: 0 10px; margin: 0; flex-grow: 1; }
        .nav-link {
          display: flex; align-items: center; gap: 15px; padding: 12px 20px; text-decoration: none; color: var(--text-muted); font-weight: 700; cursor: pointer; border-radius: 12px; margin-bottom: 5px;
        }
        .nav-link.active { background: #eef2f7; color: var(--primary-blue); }
        .nav-link i { font-size: 1.1rem; width: 24px; text-align: center; }

        .sidebar-bottom { padding: 0 20px 20px; }
        .add-btn {
          width: 100%; background: var(--primary-blue); color: white; border: none; border-radius: 12px; padding: 14px; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 20px;
        }
        .logout-link { display: flex; align-items: center; gap: 12px; color: #d32f2f; font-weight: 800; cursor: pointer; justify-content: center; }

        .main-wrapper { flex-grow: 1; display: flex; flex-direction: column; }
        .topbar { height: 80px; padding: 0 40px; display: flex; align-items: center; justify-content: space-between; background: transparent; }
        .search-container { position: relative; width: 500px; }
        .search-input { width: 100%; background: #fff; border: 1px solid #eee; border-radius: 15px; padding: 12px 45px 12px 15px; outline: none; box-shadow: 0 2px 10px rgba(0,0,0,0.02); }
        .search-icon { position: absolute; right: 15px; top: 50%; transform: translateY(-50%); color: var(--text-muted); }
        .topbar-left { display: flex; align-items: center; gap: 20px; }
        .icon-btn { position: relative; font-size: 1.3rem; color: var(--primary-blue); cursor: pointer; }
        .badge { position: absolute; top: -5px; right: -5px; background: #d32f2f; color: white; font-size: 0.6rem; padding: 2px 5px; border-radius: 50%; }

        .content-area { padding: 0 40px 40px; }
        .welcome-section { margin-bottom: 30px; }
        .welcome-title { font-size: 1.8rem; font-weight: 800; color: #333; margin: 0; }
        .welcome-subtitle { color: #757575; font-weight: 600; }

        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 25px; margin-bottom: 40px; }
        .stat-card { background: #fff; border-radius: 20px; padding: 25px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #f8f8f8; box-shadow: 0 4px 20px rgba(0,0,0,0.02); position: relative; }
        .stat-card::after { content: ''; position: absolute; right: 0; top: 20%; bottom: 20%; width: 4px; border-radius: 4px; }
        .stat-card.blue::after { background: var(--primary-blue); }
        .stat-card.yellow::after { background: var(--primary-yellow); }
        .stat-label { display: block; color: #757575; font-weight: 700; font-size: 0.9rem; margin-bottom: 5px; }
        .stat-count { display: block; font-size: 1.8rem; font-weight: 800; color: #1a1a1a; }
        .stat-icon { width: 50px; height: 50px; border-radius: 15px; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; background: #f8faff; }
        .blue .stat-icon { color: var(--primary-blue); }
        .yellow .stat-icon { color: var(--primary-yellow); }

        .dashboard-grid { display: grid; grid-template-columns: 1.5fr 3.5fr; gap: 30px; margin-bottom: 40px; }
        .card-panel { background: #fff; border-radius: 24px; padding: 30px; border: 1px solid #f1f1f1; box-shadow: 0 10px 30px rgba(0,0,0,0.02); }
        .panel-title { font-size: 1.2rem; font-weight: 800; color: #333; margin-bottom: 25px; display: flex; justify-content: space-between; align-items: center; }

        .achievement-item { display: flex; align-items: center; gap: 15px; margin-bottom: 20px; }
        .ach-icon { width: 45px; height: 45px; border-radius: 50%; background: #fef9c3; display: flex; align-items: center; justify-content: center; color: #ca8a04; font-size: 1.2rem; }
        .ach-icon.blue { background: #dbeafe; color: #1e40af; }
        .ach-text .h4 { display: block; font-weight: 800; font-size: 0.95rem; }
        .ach-text .p { display: block; font-size: 0.8rem; color: #757575; line-height: 1.4; }

        .goal-box { background: #f0f7ff; padding: 20px; border-radius: 15px; margin-top: 20px; }
        .goal-header { display: flex; justify-content: space-between; font-weight: 800; font-size: 0.9rem; margin-bottom: 10px; }
        .progress-bg { width: 100%; height: 8px; background: #fff; border-radius: 4px; overflow: hidden; }
        .progress-bar { height: 100%; background: var(--primary-blue); width: 82%; }
        .progress-percent { display: block; text-align: left; font-size: 0.75rem; margin-top: 5px; font-weight: 700; color: var(--primary-blue); }

        .review-item { display: flex; gap: 15px; padding: 15px 0; border-bottom: 1px solid #f8f8f8; }
        .rev-avatar { width: 45px; height: 45px; border-radius: 50%; overflow: hidden; flex-shrink: 0; }
        .rev-content .r-name { display: block; font-weight: 800; font-size: 0.95rem; }
        .r-stars { color: #f9c851; font-size: 0.8rem; margin: 3px 0; }
        .r-text { font-size: 0.85rem; color: #666; line-height: 1.5; }

        .chart-placeholder { height: 300px; display: flex; align-items: flex-end; gap: 15px; justify-content: center; padding-top: 20px; }
        .bar { width: 40px; border-radius: 8px 8px 0 0; transition: 0.3s; }
        .bar.blue { background: #a5bbd6; }
        .bar.yellow { background: #f9c851; }
        .bar-label { font-size: 0.75rem; color: #999; text-align: center; margin-top: 10px; }

        .bottom-title { font-size: 1.4rem; font-weight: 800; color: #333; margin-bottom: 25px; }
        .stories-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; }
        .story-card { background: #fff; border-radius: 24px; overflow: hidden; border: 1px solid #f1f1f1; box-shadow: 0 4px 20px rgba(0,0,0,0.02); }
        .story-img { width: 100%; height: 180px; object-fit: cover; }
        .story-info { padding: 20px; }
        .story-cat { display: inline-block; padding: 4px 12px; background: #f1f3f8; border-radius: 8px; font-size: 0.75rem; font-weight: 700; color: #555; margin-bottom: 10px; }
        .story-name { font-size: 1.2rem; font-weight: 800; margin-bottom: 10px; }
        .story-meta { display: flex; justify-content: flex-end; gap: 15px; color: #757575; font-size: 0.85rem; font-weight: 700; }
        .btn-secondary-full { width: 100%; background: #f1f3f8; border: none; padding: 12px; border-radius: 10px; margin-top: 15px; font-weight: 800; color: #555; cursor: pointer; }
        .pill-select { border: none; background: #f1f3f8; padding: 5px 15px; border-radius: 8px; font-weight: 800; }
      `}</style>

      <aside className="sidebar">
        <div className="sidebar-brand">أجي تقرا</div>
        <div className="user-card">
          <div className="user-avatar"><img src="https://i.pravatar.cc/150?u=teacher" alt="Teacher" /></div>
          <div className="user-name">أستاذ خالد مؤمن</div>
          <div className="user-email">khaled.momen@ajiteqra.com</div>
        </div>
        <ul className="nav-list">
          <li onClick={onHome}><div className="nav-link active"><i className="fa-solid fa-house"></i><span>الرئيسية</span></div></li>
          <li onClick={onAuthorClick}><div className="nav-link"><i className="fa-solid fa-pen-nib"></i><span>مؤلف القصص</span></div></li>
          <li onClick={onVideoClick}><div className="nav-link"><i className="fa-solid fa-video"></i><span>إضافة فيديو قصير</span></div></li>
          <li onClick={onAISettings}><div className="nav-link"><i className="fa-solid fa-robot"></i><span>إعدادات الـ AI</span></div></li>
          <li onClick={onTestsClick}><div className="nav-link"><i className="fa-solid fa-vial"></i><span>الاختبارات</span></div></li>
          <li onClick={onSalonsClick}><div className="nav-link"><i className="fa-solid fa-microphone"></i><span>الصالونات الصوتية</span></div></li>
          <li onClick={onStudentsClick}><div className="nav-link"><i className="fa-solid fa-users"></i><span>متابعة الطلاب</span></div></li>
        </ul>
        <div className="sidebar-bottom">
          <button className="add-btn"><i className="fa-solid fa-plus"></i> إضافة محتوى</button>
          <div className="logout-link" onClick={onBack}><i className="fa-solid fa-arrow-right-from-bracket"></i><span>تسجيل الخروج</span></div>
        </div>
      </aside>

      <main className="main-wrapper">
        <header className="topbar">
          <div className="search-container">
            <i className="fa-solid fa-magnifying-glass search-icon"></i>
            <input type="text" className="search-input" placeholder="ابحث عن دروس، طلاب، أو تقارير..." />
          </div>
          <div className="topbar-left">
            <div className="icon-btn"><i className="fa-regular fa-envelope"></i><span className="badge">3</span></div>
            <div className="icon-btn"><i className="fa-regular fa-bell"></i><span className="badge">5</span></div>
            <div className="icon-btn"><i className="fa-regular fa-circle-user"></i></div>
          </div>
        </header>

        <div className="content-area">
          <section className="welcome-section">
            <h1 className="welcome-title">أهلاً بك، أستاذ خالد مؤمن</h1>
            <p className="welcome-subtitle">إليك ملخص أداء محتواك التعليمي اليوم</p>
          </section>

          <div className="stats-grid">
            {stats.map((stat, i) => (
              <div className={`stat-card ${i % 2 === 0 ? 'blue' : 'yellow'}`} key={i}>
                <div>
                  <span className="stat-label">{stat.label}</span>
                  <span className="stat-count">{stat.count}</span>
                </div>
                <div className="stat-icon"><i className={`fa-solid ${stat.icon}`}></i></div>
              </div>
            ))}
          </div>

          <div className="dashboard-grid">
            <div className="side-col">
              <div className="card-panel" style={{ marginBottom: '30px' }}>
                <h3 className="panel-title">إنجازات الأسبوع</h3>
                <div className="achievement-item">
                  <div className="ach-icon"><i className="fa-solid fa-award"></i></div>
                  <div className="ach-text">
                    <span className="h4">المعلم المتميز</span>
                    <span className="p">تم اختيارك كأفضل مقدم محتوى تفاعلي لهذا الشهر.</span>
                  </div>
                </div>
                <div className="achievement-item">
                  <div className="ach-icon blue"><i className="fa-solid fa-chart-line"></i></div>
                  <div className="ach-text">
                    <span className="h4">زيادة التفاعل</span>
                    <span className="p">ارتفع معدل إكمال القصص بنسبة 15% مقارنة بالأسبوع الماضي.</span>
                  </div>
                </div>
                <div className="goal-box">
                  <div className="goal-header"><span>هدف الأسبوع: 1,500 قارئ</span></div>
                  <div className="progress-bg"><div className="progress-bar"></div></div>
                  <span className="progress-percent">تم إنجاز 82%</span>
                </div>
              </div>

              <div className="card-panel">
                <h3 className="panel-title">آخر تقييمات الطلاب</h3>
                {[
                  { name: "أحمد العلي", text: "شرح رائع جداً ومبسط، القصة ممتعة جداً وأفادتني في فهم الدرس التاريخي بشكل..." },
                  { name: "سارة منصور", text: "أتمنى إضافة المزيد من التمارين التفاعلية في نهاية كل قصة. المحتوى ممتاز..." }
                ].map((rev, i) => (
                  <div className="review-item" key={i}>
                    <img className="rev-avatar" src={`https://i.pravatar.cc/150?u=${i + 10}`} alt="User" />
                    <div className="rev-content">
                      <span className="r-name">{rev.name}</span>
                      <div className="r-stars"><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i></div>
                      <p className="r-text">{rev.text}</p>
                    </div>
                  </div>
                ))}
                <button className="btn-secondary-full">قراءة جميع الملاحظات</button>
              </div>
            </div>

            <div className="card-panel">
              <div className="panel-title">
                <span>نمو عدد القراء</span>
                <select className="pill-select"><option>آخر 7 أيام</option></select>
              </div>
              <div className="chart-placeholder">
                <div className="bar-group"><div className="bar blue" style={{ height: '140px' }}></div><div className="bar-label">السبت</div></div>
                <div className="bar-group"><div className="bar blue" style={{ height: '220px' }}></div><div className="bar-label">الأحد</div></div>
                <div className="bar-group"><div className="bar blue" style={{ height: '180px' }}></div><div className="bar-label">الاثنين</div></div>
                <div className="bar-group"><div className="bar blue" style={{ height: '120px' }}></div><div className="bar-label">الثلاثاء</div></div>
                <div className="bar-group"><div className="bar blue" style={{ height: '160px' }}></div><div className="bar-label">الأربعاء</div></div>
                <div className="bar-group"><div className="bar yellow" style={{ height: '240px' }}></div><div className="bar-label">الخميس</div></div>
                <div className="bar-group"><div className="bar blue" style={{ height: '150px' }}></div><div className="bar-label">الجمعة</div></div>
              </div>
            </div>
          </div>

          <section>
            <h3 className="bottom-title">أفضل القصص أداءً</h3>
            <div className="stories-grid">
              {[
                { title: "تاريخ الأندلس: عصر الملوك", img: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600", views: "1.8k", likes: "452", cat: "تاريخ" },
                { title: "أسرار الفضاء للمبتدئين", img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600", views: "1.2k", likes: "312", cat: "علوم" }
              ].map((story, i) => (
                <div className="story-card" key={i}>
                  <img src={story.img} className="story-img" alt={story.title} />
                  <div className="story-info">
                    <span className="story-cat">{story.cat}</span>
                    <h4 className="story-name">{story.title}</h4>
                    <div className="story-meta">
                      <span><i className="fa-solid fa-heart" style={{ color: '#d32f2f' }}></i> {story.likes}</span>
                      <span><i className="fa-solid fa-eye"></i> {story.views}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;
