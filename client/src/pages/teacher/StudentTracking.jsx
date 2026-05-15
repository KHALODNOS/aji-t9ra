import React from "react";

const StudentTracking = ({ onBack, onHome, onAuthorClick, onVideoClick, onAISettings, onTestsClick, onSalonsClick }) => {
  const students = [
    { name: "ياسين المنصوري", level: "المستوى الرابع", activity: "قراءة قصة: رحلة ابن بطوطة", score: "9/10", xp: "450 XP", avatar: "https://i.pravatar.cc/150?u=yassin" },
    { name: "ليلى الفاسي", level: "المستوى الثالث", activity: "اختبار: قواعد اللغة الأساسية", score: "7/10", xp: "320 XP", avatar: "https://i.pravatar.cc/150?u=leila" },
    { name: "عمر بناني", level: "المستوى الخامس", activity: "قراءة قصة: الأسد والفأر", score: "10/10", xp: "580 XP", avatar: "https://i.pravatar.cc/150?u=omar" }
  ];

  return (
    <div className="dashboard-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css');

        :root {
          --bg-light: #f9fafb;
          --sidebar-bg: #ffffff;
          --primary-blue: #00458b;
          --primary-yellow: #f9c851;
          --text-main: #1d1d1d;
          --text-muted: #757575;
          --border-color: #f1f1f1;
          --success-green: #10b981;
          --active-blue: #eef2ff;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { margin: 0; font-family: 'Tajawal', sans-serif; background: var(--bg-light); direction: rtl; }

        .dashboard-container { display: flex; width: 100%; min-height: 100vh; background: var(--bg-light); }

        /* Sidebar */
        .sidebar {
          width: 300px; background: var(--sidebar-bg); border-left: 1px solid var(--border-color);
          display: flex; flex-direction: column; padding: 25px 0; flex-shrink: 0;
        }
        .sidebar-brand { display: flex; flex-direction: column; align-items: center; margin-bottom: 30px; }
        .brand-logo { font-size: 2rem; color: var(--primary-blue); margin-bottom: 5px; }
        .brand-name { font-size: 1.5rem; font-weight: 800; color: var(--primary-blue); }
        .brand-sub { font-size: 0.8rem; color: var(--text-muted); font-weight: 700; }

        .nav-list { list-style: none; padding: 0 15px; margin: 0; flex-grow: 1; }
        .nav-link {
          display: flex; align-items: center; gap: 15px; padding: 14px 20px; text-decoration: none; color: var(--text-muted); font-weight: 700; cursor: pointer; border-radius: 12px; margin-bottom: 8px; transition: 0.2s;
        }
        .nav-link:hover { background: #f8fafc; color: var(--primary-blue); }
        .nav-link.active { background: var(--active-blue); color: var(--primary-blue); }
        .nav-link i { font-size: 1.1rem; width: 24px; text-align: center; }

        .sidebar-bottom { padding: 0 20px 20px; }
        .add-content-btn {
          width: 100%; background: var(--primary-blue); color: #fff; border: none; padding: 15px; border-radius: 15px; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 20px;
        }
        .user-profile {
          display: flex; align-items: center; gap: 12px; padding: 15px; background: #fff; border: 1px solid #eee; border-radius: 15px; text-align: right;
        }
        .u-avatar { width: 45px; height: 45px; border-radius: 50%; border: 2px solid var(--success-green); }
        .u-info b { display: block; font-size: 0.9rem; color: #1e293b; }
        .u-info span { font-size: 0.75rem; color: var(--text-muted); }

        /* Main Area */
        .main-wrapper { flex-grow: 1; display: flex; flex-direction: column; min-width: 0; }
        
        .topbar { height: 80px; padding: 0 40px; display: flex; align-items: center; justify-content: space-between; background: transparent; }
        .search-container { position: relative; width: 400px; }
        .search-input { width: 100%; background: #fff; border: 1px solid #eee; border-radius: 15px; padding: 12px 45px 12px 20px; outline: none; font-family: inherit; font-size: 0.9rem; }
        .search-icon { position: absolute; right: 15px; top: 50%; transform: translateY(-50%); color: #9ca3af; }

        .topbar-left { display: flex; align-items: center; gap: 15px; }
        .icon-btn { width: 42px; height: 42px; border-radius: 12px; background: #fff; border: 1px solid #eee; display: flex; align-items: center; justify-content: center; color: var(--text-muted); cursor: pointer; font-size: 1.1rem; }

        .content-area { padding: 20px 40px 40px; }

        .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
        .page-title h1 { font-size: 1.8rem; font-weight: 800; color: var(--primary-blue); }
        .update-time { font-size: 0.85rem; color: var(--text-muted); font-weight: 700; margin-top: 5px; }

        .filters { display: flex; gap: 10px; align-items: center; }
        .filter-label { font-weight: 800; color: var(--primary-blue); margin-left: 10px; }
        .filter-btn { padding: 8px 18px; border-radius: 10px; background: #fff; border: 1px solid #eee; color: var(--text-muted); font-weight: 700; cursor: pointer; font-size: 0.85rem; }
        .filter-btn.active { background: var(--primary-blue); color: #fff; border-color: var(--primary-blue); }

        /* Stats Row */
        .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 25px; margin-bottom: 40px; }
        .stat-card { background: #fff; border-radius: 24px; padding: 25px; border: 1px solid #f1f1f1; box-shadow: 0 10px 30px rgba(0,0,0,0.02); display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; }
        .stat-label { font-size: 0.95rem; font-weight: 800; color: var(--text-muted); margin-bottom: 15px; }
        .stat-value { font-size: 2rem; font-weight: 800; color: var(--primary-blue); margin-bottom: 5px; }
        .stat-sub { font-size: 1rem; font-weight: 800; color: var(--primary-blue); }
        .stat-trend { font-size: 0.85rem; font-weight: 800; color: var(--success-green); margin-top: 5px; }
        
        .progress-container { width: 100%; height: 8px; background: #f1f5f9; border-radius: 10px; margin-top: 15px; overflow: hidden; }
        .progress-fill { height: 100%; background: var(--primary-yellow); border-radius: 10px; }

        /* Table Card */
        .table-card { background: #fff; border-radius: 30px; padding: 35px; border: 1px solid #f1f1f1; box-shadow: 0 10px 40px rgba(0,0,0,0.02); }
        .card-header-flex { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
        .card-header-flex h3 { font-size: 1.4rem; font-weight: 800; color: var(--primary-blue); }
        .export-btn { color: var(--primary-blue); font-weight: 800; font-size: 0.9rem; cursor: pointer; display: flex; align-items: center; gap: 8px; background: none; border: none; }

        table { width: 100%; border-collapse: collapse; text-align: right; }
        th { padding: 15px; font-size: 0.85rem; color: #94a3b8; border-bottom: 2px solid #f8fafc; font-weight: 800; }
        td { padding: 20px 15px; border-bottom: 1px solid #f8fafc; font-size: 0.95rem; font-weight: 700; color: #1e293b; }

        .student-cell { display: flex; align-items: center; gap: 15px; }
        .student-avatar { width: 48px; height: 48px; border-radius: 50%; }
        .student-name { display: block; font-weight: 800; color: var(--primary-blue); }
        .student-level { font-size: 0.75rem; color: var(--text-muted); font-weight: 600; }

        .score-box { display: flex; flex-direction: column; gap: 5px; }
        .score-val { font-weight: 800; color: var(--primary-blue); }
        .score-bar { width: 80px; height: 6px; background: #f1f5f9; border-radius: 3px; overflow: hidden; }
        .score-fill { height: 100%; background: var(--primary-yellow); }

        .xp-badge { display: inline-block; padding: 5px 12px; background: #fff9eb; color: #d97706; border-radius: 8px; font-size: 0.85rem; font-weight: 800; }

        .action-btns { display: flex; gap: 10px; }
        .btn-view { padding: 8px 15px; border-radius: 10px; background: var(--active-blue); color: var(--primary-blue); font-weight: 800; border: none; cursor: pointer; font-size: 0.85rem; }
        .btn-star { width: 35px; height: 35px; border-radius: 10px; background: #fff; border: 1px solid #eee; color: #f59e0b; cursor: pointer; }

        .view-all { text-align: center; margin-top: 25px; color: var(--primary-blue); font-weight: 800; cursor: pointer; font-size: 0.95rem; }

        /* Bottom Row */
        .bottom-grid { display: grid; grid-template-columns: 1fr 380px; gap: 30px; margin-top: 30px; }
        .chart-card { background: #fff; border-radius: 30px; padding: 30px; border: 1px solid #f1f1f1; }
        .chart-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
        .chart-title { font-size: 1.2rem; font-weight: 800; color: var(--primary-blue); }
        .chart-legend { display: flex; gap: 15px; font-size: 0.8rem; font-weight: 700; color: #64748b; }
        .legend-item { display: flex; align-items: center; gap: 6px; }
        .dot { width: 8px; height: 8px; border-radius: 50%; }

        .achievement-card { background: var(--primary-blue); border-radius: 30px; padding: 30px; color: #fff; position: relative; overflow: hidden; }
        .ach-icon-big { font-size: 3rem; margin-bottom: 20px; opacity: 0.9; }
        .ach-title { font-size: 1.4rem; font-weight: 800; margin-bottom: 10px; }
        .ach-desc { font-size: 0.9rem; line-height: 1.6; opacity: 0.9; margin-bottom: 25px; }
        .btn-congratulate { width: 100%; background: var(--primary-yellow); color: var(--primary-blue); border: none; padding: 15px; border-radius: 15px; font-weight: 800; cursor: pointer; font-size: 1rem; }
      `}</style>

      <aside className="sidebar">
        <div className="sidebar-brand">
          <i className="fa-solid fa-graduation-cap brand-logo"></i>
          <span className="brand-name">أجي تقرا</span>
          <span className="brand-sub">لوحة الإدارة الذكية</span>
        </div>
        <ul className="nav-list">
          <li onClick={onHome}><div className="nav-link"><i className="fa-solid fa-house"></i><span>الرئيسية</span></div></li>
          <li onClick={onAuthorClick}><div className="nav-link"><i className="fa-solid fa-pen-nib"></i><span>مؤلف القصص</span></div></li>
          <li onClick={onAISettings}><div className="nav-link"><i className="fa-solid fa-robot"></i><span>إعدادات الـ AI</span></div></li>
          <li onClick={onTestsClick}><div className="nav-link"><i className="fa-solid fa-vial"></i><span>الاختبارات</span></div></li>
          <li onClick={onSalonsClick}><div className="nav-link"><i className="fa-solid fa-microphone"></i><span>الصالونات الصوتية</span></div></li>
          <li><div className="nav-link active"><i className="fa-solid fa-users"></i><span>متابعة الطلاب</span></div></li>
        </ul>
        <div className="sidebar-bottom">
          <button className="add-content-btn"><i className="fa-solid fa-plus-circle"></i> إضافة محتوى</button>
          <div className="user-profile">
            <img className="u-avatar" src="https://i.pravatar.cc/150?u=ahmed" alt="User" />
            <div className="u-info">
              <b>أحمد العلمي</b>
              <span>معلم لغة عربية</span>
            </div>
            <i className="fa-solid fa-chevron-left" style={{ marginRight: 'auto', fontSize: '0.8rem', color: '#999' }}></i>
          </div>
        </div>
      </aside>

      <main className="main-wrapper">
        <header className="topbar">
          <div className="search-container">
            <i className="fa-solid fa-magnifying-glass search-icon"></i>
            <input type="text" className="search-input" placeholder="بحث عن طالب..." />
          </div>
          <div className="topbar-left">
            <div className="icon-btn"><i className="fa-regular fa-bell"></i></div>
            <div className="icon-btn"><i className="fa-solid fa-gear"></i></div>
            <img className="u-avatar" style={{ border: 'none', width: '40px', height: '40px' }} src="https://i.pravatar.cc/150?u=teacher" alt="Profile" />
          </div>
        </header>

        <div className="content-area">
          <header className="page-header">
            <div className="page-title">
              <h1>متابعة الطلاب</h1>
              <div className="update-time">آخر تحديث: منذ دقيقتين</div>
            </div>
            <div className="filters">
              <span className="filter-label">فلترة اللغة:</span>
              <button className="filter-btn active">الكل</button>
              <button className="filter-btn">الأمازيغية (Tifinagh)</button>
              <button className="filter-btn">الإنجليزية</button>
              <button className="filter-btn">الفرنسية</button>
            </div>
          </header>

          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-label">معدل إكمال المحتوى</span>
              <span className="stat-value">72%</span>
              <div className="progress-container"><div className="progress-fill" style={{ width: '72%' }}></div></div>
            </div>
            <div className="stat-card">
              <span className="stat-label">أكثر القصص قراءة</span>
              <span className="stat-sub" style={{ color: 'var(--primary-blue)', fontSize: '1.2rem' }}>أسرار الغابة</span>
              <span className="stat-trend" style={{ color: '#64748b' }}><i className="fa-solid fa-users"></i> 432 طالب هذا الأسبوع</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">متوسط درجات الاختبارات</span>
              <span className="stat-value">85%</span>
              <span className="stat-trend"><i className="fa-solid fa-arrow-up"></i> +2%</span>
            </div>
          </div>

          <section className="table-card">
            <div className="card-header-flex">
              <h3>جدول متابعة الطلاب</h3>
              <button className="export-btn"><i className="fa-solid fa-file-export"></i> تصدير التقرير</button>
            </div>
            <table>
              <thead>
                <tr>
                  <th>الطالب</th>
                  <th>آخر نشاط</th>
                  <th>نتائج الاختبارات</th>
                  <th>نقاط XP</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, i) => (
                  <tr key={i}>
                    <td>
                      <div className="student-cell">
                        <img className="student-avatar" src={student.avatar} alt={student.name} />
                        <div className="student-info">
                          <span className="student-name">{student.name}</span>
                          <span className="student-level">{student.level}</span>
                        </div>
                      </div>
                    </td>
                    <td><div style={{ color: '#475569', fontSize: '0.9rem' }}>{student.activity}</div></td>
                    <td>
                      <div className="score-box">
                        <span className="score-val">{student.score}</span>
                        <div className="score-bar"><div className="score-fill" style={{ width: (parseInt(student.score) * 10) + '%' }}></div></div>
                      </div>
                    </td>
                    <td><span className="xp-badge">{student.xp}</span></td>
                    <td>
                      <div className="action-btns">
                        <button className="btn-view">عرض الملف</button>
                        <button className="btn-star"><i className="fa-solid fa-star"></i></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="view-all">عرض جميع الطلاب (42)</div>
          </section>

          <div className="bottom-grid">
            <div className="chart-card">
              <div className="chart-header">
                <h3 className="chart-title">تحليل التفاعل</h3>
                <div className="chart-legend">
                  <div className="legend-item"><div className="dot" style={{ background: 'var(--primary-blue)' }}></div>إجابات</div>
                  <div className="legend-item"><div className="dot" style={{ background: 'var(--primary-yellow)' }}></div>تعليقات</div>
                </div>
              </div>
              <div style={{ height: '180px', display: 'flex', alignItems: 'flex-end', gap: '40px', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '5px', alignItems: 'flex-end' }}>
                    <div style={{ width: '12px', height: '100px', background: 'var(--primary-blue)', borderRadius: '4px' }}></div>
                    <div style={{ width: '12px', height: '60px', background: 'var(--primary-yellow)', borderRadius: '4px' }}></div>
                  </div>
                  <div style={{ marginTop: '10px', fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8' }}>ابن بطوطة</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '5px', alignItems: 'flex-end' }}>
                    <div style={{ width: '12px', height: '140px', background: 'var(--primary-blue)', borderRadius: '4px' }}></div>
                    <div style={{ width: '12px', height: '80px', background: 'var(--primary-yellow)', borderRadius: '4px' }}></div>
                  </div>
                  <div style={{ marginTop: '10px', fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8' }}>أسرار الغابة</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '5px', alignItems: 'flex-end' }}>
                    <div style={{ width: '12px', height: '110px', background: 'var(--primary-blue)', borderRadius: '4px' }}></div>
                    <div style={{ width: '12px', height: '40px', background: 'var(--primary-yellow)', borderRadius: '4px' }}></div>
                  </div>
                  <div style={{ marginTop: '10px', fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8' }}>الأسد والفأر</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '5px', alignItems: 'flex-end' }}>
                    <div style={{ width: '12px', height: '90px', background: 'var(--primary-blue)', borderRadius: '4px' }}></div>
                    <div style={{ width: '12px', height: '30px', background: 'var(--primary-yellow)', borderRadius: '4px' }}></div>
                  </div>
                  <div style={{ marginTop: '10px', fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8' }}>سندباد</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '5px', alignItems: 'flex-end' }}>
                    <div style={{ width: '12px', height: '120px', background: 'var(--primary-blue)', borderRadius: '4px' }}></div>
                    <div style={{ width: '12px', height: '50px', background: 'var(--primary-yellow)', borderRadius: '4px' }}></div>
                  </div>
                  <div style={{ marginTop: '10px', fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8' }}>كليلة ودمنة</div>
                </div>
              </div>
            </div>

            <div className="achievement-card">
              <div className="ach-icon-big"><i className="fa-solid fa-trophy"></i></div>
              <h3 className="ach-title">إنجاز جديد!</h3>
              <p className="ach-desc">
                وصل 15 طالباً جديداً إلى المستوى الذهبي في اللغة الأمازيغية هذا الأسبوع. هل ترغب في إرسال رسالة تهنئة جماعية؟
              </p>
              <button className="btn-congratulate">إرسال تهنئة</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentTracking;
