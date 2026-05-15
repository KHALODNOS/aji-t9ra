import React, { useState } from "react";

const TestBank = ({ onBack, onHome, onAuthorClick, onVideoClick, onAISettings, onSalonsClick, onStudentsClick }) => {
  const [activeType, setActiveType] = useState("choice");

  const tests = [
    { name: "مفردات الغابة الجميلة", story: "أسد الأطلس والذئب", questions: 15, participants: "1,240", status: "published" },
    { name: "تحدي رحلة طنجة", story: "ابن بطوطة حول العالم", questions: 10, participants: "850", status: "draft" }
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
        body { margin: 0; font-family: 'Tajawal', sans-serif; background: #f9fafb; direction: rtl; }

        .dashboard-container { display: flex; width: 100%; min-height: 100vh; }

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
        .nav-link.active { background: #f0f7ff; color: var(--primary-blue); border-right: 4px solid var(--primary-blue); border-radius: 0 12px 12px 0; }
        .nav-link i { font-size: 1.1rem; width: 24px; text-align: center; }

        .sidebar-bottom { padding: 0 20px 20px; text-align: center; }
        .btn-main { width: 100%; background: var(--primary-blue); color: #fff; border: none; padding: 14px; border-radius: 12px; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 15px; }

        /* Main Wrapper */
        .main-wrapper { flex-grow: 1; display: flex; flex-direction: column; }
        
        .topbar { height: 80px; padding: 0 40px; display: flex; align-items: center; justify-content: space-between; }
        .search-bar { position: relative; width: 400px; }
        .search-bar input { width: 100%; padding: 12px 45px 12px 20px; border-radius: 15px; border: none; background: #fff; box-shadow: 0 2px 10px rgba(0,0,0,0.02); outline: none; }
        .search-bar i { position: absolute; right: 15px; top: 50%; transform: translateY(-50%); color: #9ca3af; }

        .content-area { padding: 0 40px 40px; display: grid; grid-template-columns: 320px 1fr; gap: 40px; }

        .page-header { margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-end; }
        .breadcrumb { font-size: 0.8rem; color: #9ca3af; font-weight: 700; margin-bottom: 10px; display: block; }
        .page-title { font-size: 2rem; font-weight: 800; color: var(--primary-blue); margin: 0; }

        .filters { display: flex; gap: 15px; }
        .filter-select { background: #fff; border: 1px solid #eee; padding: 8px 15px; border-radius: 10px; font-weight: 700; color: #555; }

        /* Table Section */
        .table-card { background: #fff; border-radius: 24px; padding: 25px; border: 1px solid #f1f1f1; margin-bottom: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.02); }
        table { width: 100%; border-collapse: collapse; text-align: right; }
        th { padding: 15px; color: var(--primary-blue); font-weight: 800; font-size: 0.9rem; border-bottom: 2px solid #f9fafb; }
        td { padding: 15px; font-size: 0.9rem; font-weight: 700; color: #4b5563; border-bottom: 1px solid #f9fafb; }
        
        .status-pill { padding: 5px 12px; border-radius: 8px; font-size: 0.75rem; font-weight: 800; }
        .status-pill.published { background: #dcfce7; color: #166534; }
        .status-pill.draft { background: #f3f4f6; color: #4b5563; }
        .count-badge { background: #f9fafb; padding: 4px 10px; border-radius: 6px; font-size: 0.8rem; }

        .actions { display: flex; gap: 10px; color: #9ca3af; cursor: pointer; }
        .actions i:hover { color: var(--primary-blue); }
        .actions .fa-trash:hover { color: #d32f2f; }

        /* Creator Section */
        .creator-card { background: #fff; border-radius: 30px; padding: 35px; border: 1px solid #f1f1f1; box-shadow: 0 10px 40px rgba(0,0,0,0.02); }
        .creator-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
        .creator-title { display: flex; align-items: center; gap: 12px; font-weight: 800; color: var(--primary-blue); font-size: 1.2rem; }
        .btn-add-q { background: var(--primary-yellow); color: #1a1a1a; border: none; padding: 10px 25px; border-radius: 12px; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 10px; }

        .q-type-box { background: #f8fbff; border-radius: 20px; padding: 30px; border: 1px solid #eef2ff; margin-bottom: 20px; }
        .q-type-header { display: flex; align-items: center; gap: 10px; font-weight: 800; color: var(--primary-blue); margin-bottom: 20px; }
        .q-input { width: 100%; padding: 15px; border-radius: 15px; border: 1px solid #eee; background: #fff; outline: none; margin-bottom: 20px; font-family: inherit; }

        .options-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .option-item { background: #fff; border: 1px solid #eee; padding: 12px 15px; border-radius: 12px; display: flex; align-items: center; gap: 12px; color: #757575; font-weight: 700; }
        .dot { width: 18px; height: 18px; border-radius: 50%; border: 2px solid #ddd; }

        .tf-toggle { display: flex; align-items: center; gap: 20px; font-weight: 800; color: #4b5563; }
        .switch { width: 50px; height: 26px; background: var(--primary-blue); border-radius: 20px; position: relative; }
        .switch::after { content: ''; position: absolute; left: 4px; top: 3px; width: 20px; height: 20px; background: #fff; border-radius: 50%; transition: 0.3s; }

        .fill-box { position: relative; }
        .kbd-icon { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: #9ca3af; }

        /* Left Column Cards */
        .left-cards { display: flex; flex-direction: column; gap: 25px; margin-top: 110px; }
        .info-card { background: #fff; border-radius: 24px; padding: 30px; border: 1px solid #f1f1f1; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.02); }
        .xp-val { font-size: 2.2rem; font-weight: 800; color: #ca8a04; margin: 15px 0; display: block; }
        .xp-label { color: var(--primary-blue); font-weight: 800; font-size: 1.1rem; }
        
        .publish-card { background: linear-gradient(135deg, #00458b 0%, #002d5a 100%); color: #fff; padding: 35px 25px; border-radius: 24px; position: relative; overflow: hidden; }
        .publish-card .fa-puzzle-piece { font-size: 3rem; opacity: 0.2; position: absolute; top: 20px; right: 20px; }
        .pub-title { font-size: 1.3rem; font-weight: 800; margin-bottom: 10px; display: block; }
        .pub-desc { font-size: 0.85rem; opacity: 0.8; line-height: 1.6; margin-bottom: 25px; display: block; }
        .btn-create { width: 100%; background: var(--primary-yellow); color: #1a1a1a; border: none; padding: 15px; border-radius: 14px; font-weight: 800; font-size: 1.1rem; cursor: pointer; }

        .guide-card { background: #fff; border-radius: 20px; padding: 20px; border: 1px solid #f1f1f1; }
        .guide-title { font-weight: 800; color: #9ca3af; font-size: 0.9rem; margin-bottom: 15px; display: flex; align-items: center; gap: 8px; }
        .guide-item { display: flex; align-items: center; gap: 10px; font-size: 0.8rem; font-weight: 700; color: #6b7280; margin-bottom: 10px; }
        .g-dot { width: 8px; height: 8px; border-radius: 50%; }
      `}</style>

      <aside className="sidebar">
        <div className="sidebar-brand">أجي تقرا</div>
        <span className="sidebar-sub">لوحة الإدارة الذكية</span>
        <ul className="nav-list">
          <li onClick={onHome}><div className="nav-link"><i className="fa-solid fa-house"></i><span>الرئيسية</span></div></li>
          <li onClick={onAuthorClick}><div className="nav-link"><i className="fa-solid fa-pen-nib"></i><span>مؤلف القصص</span></div></li>
          <li onClick={onVideoClick}><div className="nav-link"><i className="fa-solid fa-video"></i><span>إضافة فيديو قصير</span></div></li>
          <li onClick={onAISettings}><div className="nav-link"><i className="fa-solid fa-robot"></i><span>إعدادات الـ AI</span></div></li>
          <li><div className="nav-link active"><i className="fa-solid fa-vial"></i><span>الاختبارات</span></div></li>
          <li onClick={onSalonsClick}><div className="nav-link"><i className="fa-solid fa-microphone"></i><span>الصالونات الصوتية</span></div></li>
          <li onClick={onStudentsClick}><div className="nav-link"><i className="fa-solid fa-users"></i><span>متابعة الطلاب</span></div></li>
        </ul>
        <div className="sidebar-bottom">
          <button className="btn-main"><i className="fa-solid fa-circle-plus"></i> إضافة محتوى</button>
          <div className="logout-link" onClick={onBack}><i className="fa-solid fa-arrow-right-from-bracket"></i><span> تسجيل الخروج</span></div>
        </div>
      </aside>

      <main className="main-wrapper">
        <header className="topbar">
          <div className="search-bar">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input type="text" placeholder="بحث عن اختبار..." />
          </div>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div className="icon-box" style={{ background: '#fff', padding: '10px', borderRadius: '50%', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}><i className="fa-regular fa-bell"></i></div>
            <div className="icon-box" style={{ background: '#fff', padding: '10px', borderRadius: '50%', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}><i className="fa-regular fa-circle-question"></i></div>
            <img src="https://i.pravatar.cc/150?u=teacher" style={{ width: '40px', height: '40px', borderRadius: '50%' }} alt="Avatar" />
          </div>
        </header>

        <div className="content-area">
          <div className="left-cards">
            <div className="info-card">
              <span className="xp-label">مكافأة النجاح (XP) <i className="fa-solid fa-star" style={{ color: '#ca8a04' }}></i></span>
              <span className="xp-val">150</span>
              <p style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: '600' }}>هذه النقاط تمنح للطالب عند تجاوز الاختبار بنسبة نجاح تزيد عن 70%.</p>
            </div>

            <div className="publish-card">
              <i className="fa-solid fa-puzzle-piece"></i>
              <span className="pub-title">جاهز للنشر؟</span>
              <span className="pub-desc">تأكد من مراجعة كافة الأسئلة وتحديد الخيارات الصحيحة قبل الاعتماد.</span>
              <button className="btn-create">إنشاء الاختبار</button>
            </div>

            <div className="guide-card">
              <div className="guide-title"><i className="fa-solid fa-circle-info"></i> توجيهات المستوى</div>
              <div className="guide-item"><div className="g-dot" style={{ background: '#10b981' }}></div> المبتدئ: 5-8 أسئلة، مفردات بسيطة.</div>
              <div className="guide-item"><div className="g-dot" style={{ background: '#f59e0b' }}></div> المتوسط: 10-15 سؤال، تشمل القواعد.</div>
              <div className="guide-item"><div className="g-dot" style={{ background: '#ef4444' }}></div> المتقدم: +20 سؤال، تحليل نقدي.</div>
            </div>
          </div>

          <div className="right-panels">
            <div className="page-header">
              <div>
                <span className="breadcrumb">الرئيسية / بنك الاختبارات</span>
                <h1 className="page-title">بنك الاختبارات</h1>
              </div>
              <div className="filters">
                <select className="filter-select"><option>القصة المرتبطة: الكل</option></select>
                <select className="filter-select"><option>مستوى الصعوبة: الكل</option></select>
              </div>
            </div>

            <div className="table-card">
              <table>
                <thead>
                  <tr>
                    <th>اسم الاختبار</th>
                    <th>القصة المرتبطة</th>
                    <th>عدد الأسئلة</th>
                    <th>المشاركات</th>
                    <th>الحالة</th>
                    <th>إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {tests.map((test, i) => (
                    <tr key={i}>
                      <td style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <i className={`fa-solid ${i === 0 ? 'fa-clipboard-question' : 'fa-vial'}`} style={{ color: 'var(--primary-blue)' }}></i>
                        {test.name}
                      </td>
                      <td>{test.story}</td>
                      <td>{test.questions} سؤال</td>
                      <td><span className="count-badge">{test.participants}</span></td>
                      <td><span className={`status-pill ${test.status}`}>{test.status === 'published' ? 'منشور' : 'مسودة'}</span></td>
                      <td className="actions">
                        <i className="fa-regular fa-trash-can"></i>
                        <i className="fa-regular fa-copy"></i>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="creator-card">
              <div className="creator-header">
                <div className="creator-title"><i className="fa-solid fa-wand-magic-sparkles"></i> منشئ الأسئلة الذكي</div>
                <button className="btn-add-q"><i className="fa-solid fa-file-circle-plus"></i> إضافة سؤال جديد</button>
              </div>

              <div className="q-type-box">
                <div className="q-type-header"><i className="fa-solid fa-circle-dot"></i> اختيار من متعدد</div>
                <textarea className="q-input" placeholder="اكتب سؤالك هنا..."></textarea>
                <div className="options-grid">
                  <div className="option-item"><div className="dot"></div> الخيار الأول</div>
                  <div className="option-item"><div className="dot"></div> الخيار الثاني</div>
                  <div className="option-item"><div className="dot"></div> الخيار الثالث</div>
                  <div className="option-item"><div className="dot"></div> الخيار الرابع</div>
                </div>
              </div>

              <div className="q-type-box" style={{ background: '#f8fafc' }}>
                <div className="q-type-header"><i className="fa-solid fa-circle-check"></i> صح أم خطأ</div>
                <div className="tf-toggle">
                  <span>خطأ</span>
                  <div className="switch"></div>
                  <span style={{ color: 'var(--primary-blue)' }}>صح</span>
                </div>
              </div>

              <div className="q-type-box" style={{ background: '#f8fafc' }}>
                <div className="q-type-header"><i className="fa-solid fa-pen-clip"></i> إكمال الفراغ (Tifinagh/Arabic)</div>
                <div className="fill-box">
                  <i className="fa-solid fa-keyboard kbd-icon"></i>
                  <input type="text" className="q-input" style={{ marginBottom: '0', paddingLeft: '45px' }} placeholder="أدخل الكلمة المفقودة..." />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TestBank;
