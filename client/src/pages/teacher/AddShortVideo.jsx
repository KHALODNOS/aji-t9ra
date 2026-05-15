import React, { useState } from "react";

const AddShortVideo = ({ onBack, onHome, onAuthorClick }) => {
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
        .nav-link.active { background: #eef2f7; color: var(--primary-blue); }
        .nav-link i { font-size: 1.1rem; width: 24px; text-align: center; }

        .sidebar-bottom { padding: 0 20px 20px; text-align: center; }
        .logout-link { color: var(--text-muted); font-weight: 800; cursor: pointer; font-size: 0.9rem; }

        /* Main Area */
        .main-wrapper { flex-grow: 1; display: flex; flex-direction: column; }
        
        .topbar {
          height: 80px; padding: 0 40px; display: flex; align-items: center; justify-content: space-between; background: transparent;
        }
        .topbar-right { display: flex; align-items: center; gap: 40px; }
        .brand-logo { font-size: 1.6rem; font-weight: 800; color: var(--primary-blue); }
        .search-container { position: relative; width: 300px; }
        .search-input { width: 100%; background: #f8f9fa; border: none; border-radius: 12px; padding: 10px 40px 10px 15px; outline: none; }
        .search-icon { position: absolute; right: 15px; top: 50%; transform: translateY(-50%); color: var(--text-muted); }
        
        .topbar-left { display: flex; align-items: center; gap: 20px; }
        .icon-btn { font-size: 1.2rem; color: var(--primary-blue); cursor: pointer; }
        .profile-thumb { width: 40px; height: 40px; border-radius: 50%; overflow: hidden; }
        .profile-thumb img { width: 100%; height: 100%; object-fit: cover; }

        .content-area { padding: 0 60px 40px; max-width: 1400px; margin: 0 auto; width: 100%; }
        .page-header { text-align: center; margin-bottom: 50px; }
        .page-header h1 { font-size: 2.2rem; font-weight: 800; color: var(--primary-blue); margin-bottom: 10px; }
        .page-header p { color: var(--text-muted); font-weight: 600; }

        .video-author-grid { display: grid; grid-template-columns: 350px 1fr 380px; gap: 40px; align-items: start; }

        /* Left: Phone Preview */
        .phone-section { text-align: center; }
        .phone-mockup {
          width: 280px; height: 580px; background: #000; border: 12px solid #1a1a1a; border-radius: 45px; margin: 0 auto 20px;
          position: relative; overflow: hidden; box-shadow: 0 25px 50px rgba(0,0,0,0.15);
        }
        .phone-screen { width: 100%; height: 100%; position: relative; background-image: url('https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600'); background-size: cover; background-position: center; }
        .phone-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.8)); display: flex; flex-direction: column; justify-content: flex-end; padding: 25px; color: #fff; text-align: right; }
        
        .phone-actions { position: absolute; left: 15px; bottom: 120px; display: flex; flex-direction: column; gap: 20px; align-items: center; }
        .p-action { text-align: center; }
        .p-action i { font-size: 1.4rem; display: block; margin-bottom: 5px; }
        .p-action span { font-size: 0.75rem; font-weight: 700; }

        .p-user-info { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
        .p-avatar { width: 32px; height: 32px; border-radius: 50%; border: 2px solid #fff; }
        .p-handle { font-weight: 800; font-size: 0.9rem; }
        .p-caption { font-size: 0.85rem; line-height: 1.4; opacity: 0.9; }

        .preview-label { font-weight: 700; color: #999; font-size: 0.9rem; }

        /* Achievement Card */
        .achieve-card {
          margin-top: 40px; background: #fff; border-radius: 20px; padding: 20px; display: flex; align-items: center; gap: 15px;
          border: 1px solid #f1f1f1; box-shadow: 0 4px 15px rgba(0,0,0,0.02);
        }
        .trophy-box { width: 45px; height: 45px; border-radius: 50%; background: #fef9c3; color: #ca8a04; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; }
        .achieve-text h5 { margin: 0; font-weight: 800; font-size: 0.95rem; }
        .achieve-text p { margin: 0; font-size: 0.8rem; color: #999; font-weight: 600; }

        /* Middle: Upload */
        .upload-panel { text-align: center; }
        .upload-area {
          background: #fff; border: 2px dashed #d1d5db; border-radius: 30px; padding: 80px 40px; margin-bottom: 30px;
          display: flex; flex-direction: column; align-items: center; gap: 15px; transition: 0.3s;
        }
        .upload-area:hover { border-color: var(--primary-blue); background: #f8fbff; }
        .upload-cloud { width: 70px; height: 70px; border-radius: 50%; background: #eef2ff; color: var(--primary-blue); display: flex; align-items: center; justify-content: center; font-size: 2rem; margin-bottom: 10px; }
        .upload-area h3 { font-size: 1.4rem; font-weight: 800; color: #1f2937; margin: 0; }
        .upload-area p { color: #6b7280; font-size: 0.9rem; font-weight: 600; }

        .progress-container { width: 100%; max-width: 300px; margin-top: 20px; }
        .progress-header { display: flex; justify-content: space-between; font-weight: 800; font-size: 0.85rem; margin-bottom: 10px; }
        .progress-bg { width: 100%; height: 8px; background: #f1f1f1; border-radius: 4px; overflow: hidden; }
        .progress-fill { width: 65%; height: 100%; background: #ca8a04; transition: 0.5s; }
        .progress-label { color: var(--primary-blue); }

        .btn-row { display: flex; gap: 15px; justify-content: center; }
        .btn-publish { background: var(--primary-blue); color: white; border: none; padding: 16px 35px; border-radius: 14px; font-weight: 800; font-size: 1rem; cursor: pointer; display: flex; align-items: center; gap: 10px; }
        .btn-draft { background: var(--primary-yellow); color: #1a1a1a; border: none; padding: 16px 35px; border-radius: 14px; font-weight: 800; font-size: 1rem; cursor: pointer; display: flex; align-items: center; gap: 10px; }

        /* Right: Details */
        .details-panel { display: flex; flex-direction: column; gap: 25px; }
        .details-card { background: #fff; border-radius: 24px; padding: 30px; border: 1px solid #f1f1f1; box-shadow: 0 4px 20px rgba(0,0,0,0.02); }
        .card-header { display: flex; align-items: center; gap: 12px; margin-bottom: 25px; color: #333; font-weight: 800; font-size: 1.1rem; }
        .card-header i { color: #ca8a04; }

        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; font-weight: 800; font-size: 0.9rem; margin-bottom: 8px; color: #4b5563; }
        .form-group input, .form-group textarea, .form-group select {
          width: 100%; padding: 12px 15px; border-radius: 12px; border: 1px solid #eee; background: #fff; outline: none; font-family: inherit;
        }
        .form-group textarea { height: 120px; resize: none; }
        
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }

        .tip-card { background: #fff; border-radius: 24px; padding: 30px; border: 1px solid #f1f1f1; }
        .tip-header { display: flex; align-items: center; gap: 12px; color: #ca8a04; font-weight: 800; margin-bottom: 15px; }
        .tip-text { color: #6b7280; font-size: 0.9rem; line-height: 1.6; font-weight: 600; }
      `}</style>

      <aside className="sidebar">
        <div className="sidebar-brand">LinguistPro</div>
        <span className="sidebar-sub">بوابة المعلم</span>
        <ul className="nav-list">
          <li onClick={onHome}><div className="nav-link"><i className="fa-solid fa-house"></i><span>الرئيسية</span></div></li>
          <li onClick={onAuthorClick}><div className="nav-link"><i className="fa-solid fa-pen-nib"></i><span>مؤلف القصص</span></div></li>
          <li><div className="nav-link active"><i className="fa-solid fa-video"></i><span>إضافة فيديو قصير</span></div></li>
          <li><div className="nav-link"><i className="fa-solid fa-robot"></i><span>إعدادات الـ AI</span></div></li>
          <li><div className="nav-link"><i className="fa-solid fa-vial"></i><span>الاختبارات</span></div></li>
          <li><div className="nav-link"><i className="fa-solid fa-microphone"></i><span>الصالونات الصوتية</span></div></li>
          <li><div className="nav-link"><i className="fa-solid fa-users"></i><span>متابعة الطلاب</span></div></li>
        </ul>
        <div className="sidebar-bottom">
          <div className="logout-link" onClick={onBack}><i className="fa-solid fa-arrow-right-from-bracket"></i><span> تسجيل الخروج</span></div>
        </div>
      </aside>

      <main className="main-wrapper">
        <header className="topbar">
          <div className="topbar-right">
            <div className="brand-logo">أجي تقرا</div>
            <div className="search-container">
              <i className="fa-solid fa-magnifying-glass search-icon"></i>
              <input type="text" className="search-input" placeholder="بحث عن محتوى..." />
            </div>
          </div>
          <div className="topbar-left">
            <div className="icon-btn"><i className="fa-regular fa-bell"></i></div>
            <div className="icon-btn"><i className="fa-solid fa-gear"></i></div>
            <div className="profile-thumb"><img src="https://i.pravatar.cc/150?u=teacher" alt="Profile" /></div>
          </div>
        </header>

        <div className="content-area">
          <div className="page-header">
            <h1>إضافة فيديو قصير (Linguist Short)</h1>
            <p>شارك مقطعاً تعليمياً سريعاً مع طلابك لإثراء رحلتهم اللغوية.</p>
          </div>

          <div className="video-author-grid">
            {/* Left: Phone Preview */}
            <div className="phone-section">
              <div className="phone-mockup">
                <div className="phone-screen">
                  <div className="phone-overlay">
                    <div className="phone-actions">
                      <div className="p-action"><i className="fa-solid fa-heart"></i><span>1.2k</span></div>
                      <div className="p-action"><i className="fa-solid fa-comment"></i><span>45</span></div>
                      <div className="p-action"><i className="fa-solid fa-share"></i><span>مشاركة</span></div>
                    </div>
                    <div className="p-user-info">
                      <img className="p-avatar" src="https://i.pravatar.cc/150?u=teacher" alt="Avatar" />
                      <span className="p-handle">Teacher_Ahmed@</span>
                    </div>
                    <div className="p-caption">كيف تنطق حروف العلة في اللغة الفرنسية...</div>
                  </div>
                </div>
              </div>
              <span className="preview-label">معاينة مباشرة كما تظهر للطلاب</span>

              <div className="achieve-card">
                <div className="trophy-box"><i className="fa-solid fa-trophy"></i></div>
                <div className="achieve-text">
                  <h5>إنجاز اليوم</h5>
                  <p>رفعت 5 فيديوهات هذا الأسبوع!</p>
                </div>
              </div>
            </div>

            {/* Middle: Upload */}
            <div className="upload-panel">
              <div className="upload-area">
                <div className="upload-cloud"><i className="fa-solid fa-cloud-arrow-up"></i></div>
                <h3>اسحب الفيديو هنا أو اختر ملفاً</h3>
                <p>يدعم تنسيقات MP4, MOV بحد أقصى 100 ميجابايت</p>
                
                <div className="progress-container">
                  <div className="progress-header">
                    <span className="progress-label">جاري الرفع...</span>
                    <span>65%</span>
                  </div>
                  <div className="progress-bg"><div className="progress-fill"></div></div>
                </div>
              </div>

              <div className="btn-row">
                <button className="btn-publish"><i className="fa-solid fa-paper-plane"></i> نشر للمراجعة</button>
                <button className="btn-draft"><i className="fa-solid fa-box-archive"></i> حفظ كمسودة</button>
              </div>
            </div>

            {/* Right: Details */}
            <div className="details-panel">
              <div className="details-card">
                <div className="card-header"><i className="fa-solid fa-pen-to-square"></i> تفاصيل الفيديو</div>
                <div className="form-group">
                  <label>عنوان الفيديو</label>
                  <input type="text" placeholder="مثال: نطق حرف القاف" />
                </div>
                <div className="form-group">
                  <label>وصف قصير</label>
                  <textarea placeholder="اشرح محتوى الفيديو باختصار..."></textarea>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>اللغة المستهدفة</label>
                    <select><option>الإنجليزية</option></select>
                  </div>
                  <div className="form-group">
                    <label>المستوى</label>
                    <select><option>مبتدئ</option></select>
                  </div>
                </div>
              </div>

              <div className="tip-card">
                <div className="tip-header"><i className="fa-solid fa-lightbulb"></i> نصيحة تعليمية</div>
                <p className="tip-text">
                  الفيديوهات القصيرة (أقل من 60 ثانية) تحقق تفاعلاً أعلى بنسبة 40%. تأكد من إضاءة وجهك جيداً والبدء بعبارة مشوقة!
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddShortVideo;
