import React, { useState } from "react";

const StoryAuthor = ({ onBack, onHome }) => {
  const [difficultWords, setDifficultWords] = useState(["الحضارة", "الاستكشاف", "المثابرة"]);

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

        /* Main Area */
        .main-wrapper { flex-grow: 1; display: flex; flex-direction: column; }
        
        .topbar {
          height: 80px; padding: 0 40px; display: flex; align-items: center; justify-content: space-between; background: transparent;
        }
        .top-title-row { display: flex; align-items: center; gap: 15px; font-weight: 800; color: var(--primary-blue); font-size: 1.2rem; }
        .topbar-left { display: flex; align-items: center; gap: 20px; }
        .icon-btn { position: relative; font-size: 1.3rem; color: var(--primary-blue); cursor: pointer; }

        .author-container { padding: 0 40px 40px; }

        /* Stepper */
        .stepper-row {
          display: flex; align-items: center; justify-content: center; gap: 20px; margin-bottom: 40px; margin-top: 10px;
        }
        .step { display: flex; align-items: center; gap: 12px; color: #999; font-weight: 700; }
        .step.active { color: #00458b; }
        .step-icon {
          width: 36px; height: 36px; border-radius: 50%; background: #eee; display: flex; align-items: center; justify-content: center; font-size: 0.9rem;
        }
        .active .step-icon { background: #00458b; color: #fff; }
        .step-line { width: 100px; height: 2px; background: #eee; }

        .author-grid { display: grid; grid-template-columns: 320px 1fr; gap: 30px; align-items: start; }

        .author-card {
          background: #fff; border-radius: 20px; padding: 25px; border: 1px solid #f1f1f1; 
          box-shadow: 0 4px 15px rgba(0,0,0,0.02); margin-bottom: 25px;
        }
        .card-title { font-size: 1rem; font-weight: 800; margin: 0 0 20px; color: #333; display: flex; align-items: center; gap: 10px; }
        .section-label { font-size: 1.1rem; font-weight: 800; color: #00458b; margin: 0 0 20px; border-right: 4px solid #f9c851; padding-right: 12px; }

        /* Form Elements */
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; font-weight: 800; font-size: 0.9rem; margin-bottom: 8px; color: #555; }
        .form-group input, .form-group select {
          width: 100%; padding: 12px 15px; border-radius: 12px; border: 1px solid #eee; background: #fafafa; outline: none; font-family: inherit;
        }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

        /* Editor */
        .editor-alert {
          background: #fef9c3; color: #854d0e; padding: 12px 20px; border-radius: 10px; font-weight: 700; font-size: 0.85rem;
          display: flex; align-items: center; gap: 10px; margin-bottom: 20px;
        }
        .editor-container { position: relative; border: 1px solid #eee; border-radius: 15px; overflow: hidden; }
        .editor-container textarea {
          width: 100%; height: 350px; padding: 20px; border: none; outline: none; font-family: inherit; line-height: 1.8; resize: none; background: #fafafa;
        }
        .editor-toolbar {
          position: absolute; bottom: 15px; left: 15px; display: flex; gap: 15px; color: #999; font-size: 1.1rem;
        }

        /* Multimedia */
        .media-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .upload-box {
          border: 2px dashed #eee; border-radius: 20px; padding: 30px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 10px;
        }
        .upload-icon { font-size: 2rem; color: #00458b; opacity: 0.3; }
        .upload-box span { font-weight: 800; font-size: 0.95rem; }
        .upload-box p { font-size: 0.8rem; color: #999; margin: 0; }
        .btn-audio-upload {
          background: #fff; border: 1px solid #00458b; color: #00458b; border-radius: 10px; padding: 8px 20px; font-weight: 800; cursor: pointer; margin: 5px 0;
        }

        /* Sidebar Side (Left) */
        .words-list { display: flex; flex-direction: column; gap: 10px; }
        .word-tag {
          background: #fff; border: 1px solid #eee; padding: 10px 15px; border-radius: 12px; display: flex; align-items: center; justify-content: space-between;
          border-right: 4px solid #f9c851; font-weight: 700;
        }
        .word-tag i { color: #ccc; cursor: pointer; font-size: 0.8rem; }
        .word-count { text-align: center; font-size: 0.8rem; color: #999; font-weight: 700; margin-top: 15px; }

        .preview-card { background: #fff; border-radius: 24px; overflow: hidden; border: 1px solid #f1f1f1; margin-bottom: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.02); }
        .preview-img-box { position: relative; height: 160px; }
        .preview-img-box img { width: 100%; height: 100%; object-fit: cover; }
        .preview-badge { position: absolute; bottom: 10px; right: 10px; background: #f9c851; color: #1a1a1a; font-weight: 800; font-size: 0.65rem; padding: 4px 10px; border-radius: 6px; }
        .preview-info { padding: 20px; text-align: center; }
        .preview-info h4 { margin: 0 0 8px; font-weight: 800; color: #00458b; }
        .preview-info p { margin: 0; font-size: 0.8rem; color: #999; line-height: 1.5; }

        .points-card { background: #fff; border-radius: 16px; padding: 15px; border: 1px solid #eee; margin-bottom: 25px; }
        .points-header { display: flex; align-items: center; gap: 15px; }
        .trophy-icon { width: 45px; height: 45px; border-radius: 50%; background: #fef9c3; color: #ca8a04; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; }
        .points-text span { display: block; font-weight: 800; font-size: 0.9rem; margin-bottom: 5px; }
        .progress-mini { width: 100px; height: 6px; background: #eee; border-radius: 3px; }
        .prog-fill { width: 60%; height: 100%; background: #f9c851; border-radius: 3px; }

        .action-btns { display: flex; flex-direction: column; gap: 12px; }
        .btn-save-draft { background: #00458b; color: #fff; border: none; padding: 15px; border-radius: 12px; font-weight: 800; cursor: pointer; }
        .btn-send-review { background: #fff; color: #00458b; border: 1px solid #00458b; padding: 15px; border-radius: 12px; font-weight: 800; cursor: pointer; }
      `}</style>

      <aside className="sidebar">
        <div className="sidebar-brand">أجي تقرا</div>
        <div className="user-card">
          <div className="user-avatar"><img src="https://i.pravatar.cc/150?u=teacher" alt="Teacher" /></div>
          <div className="user-name">أستاذ خالد مؤمن</div>
          <div className="user-email">khaled.momen@ajiteqra.com</div>
        </div>
        <ul className="nav-list">
          <li onClick={onHome}><div className="nav-link"><i className="fa-solid fa-house"></i><span>الرئيسية</span></div></li>
          <li><div className="nav-link active"><i className="fa-solid fa-pen-nib"></i><span>مؤلف القصص</span></div></li>
          <li><div className="nav-link"><i className="fa-solid fa-robot"></i><span>إعدادات الـ AI</span></div></li>
          <li><div className="nav-link"><i className="fa-solid fa-vial"></i><span>الاختبارات</span></div></li>
          <li><div className="nav-link"><i className="fa-solid fa-microphone"></i><span>الصالونات الصوتية</span></div></li>
          <li><div className="nav-link"><i className="fa-solid fa-users"></i><span>متابعة الطلاب</span></div></li>
        </ul>
        <div className="sidebar-bottom">
          <button className="add-btn"><i className="fa-solid fa-plus"></i> إضافة محتوى</button>
          <div className="logout-link" onClick={onBack}><i className="fa-solid fa-arrow-right-from-bracket"></i><span>تسجيل الخروج</span></div>
        </div>
      </aside>

      <main className="main-wrapper">
        <header className="topbar">
          <div className="top-title-row">
            <i className="fa-solid fa-book-open"></i>
            <span>مؤلف القصص</span>
          </div>
          <div className="topbar-left">
            <div className="icon-btn"><i className="fa-regular fa-envelope"></i></div>
            <div className="icon-btn"><i className="fa-regular fa-bell"></i></div>
            <div className="icon-btn"><i className="fa-regular fa-circle-user"></i></div>
          </div>
        </header>

        <div className="author-container">
          {/* Stepper Header */}
          <div className="stepper-row">
            <div className="step active">
              <div className="step-icon"><i className="fa-solid fa-check"></i></div>
              <span>معلومات القصة</span>
            </div>
            <div className="step-line"></div>
            <div className="step">
              <div className="step-icon"><i className="fa-solid fa-pen-nib"></i></div>
              <span>المحتوى والكلمات</span>
            </div>
            <div className="step-line"></div>
            <div className="step">
              <div className="step-icon"><i className="fa-solid fa-photo-film"></i></div>
              <span>الوسائط والنشر</span>
            </div>
          </div>

          <div className="author-grid">
            {/* Left Side (Preview & Words) */}
            <div className="side-column">
              <div className="author-card">
                <h4 className="card-title"><i className="fa-solid fa-book-bookmark"></i> الكلمات الصعبة المضافة</h4>
                <div className="words-list">
                  {difficultWords.map((word, i) => (
                    <div className="word-tag" key={i}>
                      <i className="fa-solid fa-xmark"></i>
                      <span>{word}</span>
                    </div>
                  ))}
                </div>
                <div className="word-count">إجمالي الكلمات: {difficultWords.length} كلمات</div>
              </div>

              <div className="preview-card">
                <div className="preview-img-box">
                  <img src="https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600" alt="Preview" />
                  <div className="preview-badge">PREVIEW</div>
                </div>
                <div className="preview-info">
                  <h4>معاينة القصة</h4>
                  <p>ستظهر قصتك بهذا الشكل للطلاب بعد اعتمادها من قبل المشرفين.</p>
                </div>
              </div>

              <div className="points-card">
                <div className="points-header">
                  <div className="trophy-icon"><i className="fa-solid fa-trophy"></i></div>
                  <div className="points-text">
                    <span>نقاط الإبداع</span>
                    <div className="progress-mini"><div className="prog-fill"></div></div>
                  </div>
                </div>
              </div>

              <div className="action-btns">
                <button className="btn-save-draft">حفظ المسودة</button>
                <button className="btn-send-review">إرسال للمراجعة</button>
              </div>
            </div>

            {/* Middle Section (Form) */}
            <div className="main-form-column">
              <div className="author-card">
                <h4 className="section-label">معلومات القصة</h4>
                <div className="form-group">
                  <label>عنوان القصة</label>
                  <input type="text" placeholder="أدخل عنواناً جذاباً للقصة..." />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>المستوى التعليمي</label>
                    <select><option>المستوى الأول</option></select>
                  </div>
                  <div className="form-group">
                    <label>لغة القصة</label>
                    <select><option>العربية</option></select>
                  </div>
                </div>
              </div>

              <div className="author-card">
                <h4 className="section-label">محرر المحتوى</h4>
                <div className="editor-alert">
                  <i className="fa-solid fa-lightbulb"></i>
                  <span>حدد كلمة لتصنيفها ككلمة صعبة</span>
                </div>
                <div className="editor-container">
                  <textarea placeholder="اكتب قصتك هنا... يدعم النظام حروف التيفيناغ..."></textarea>
                  <div className="editor-toolbar">
                    <i className="fa-solid fa-list-ul"></i>
                    <i className="fa-solid fa-italic"></i>
                    <i className="fa-solid fa-bold"></i>
                  </div>
                </div>
              </div>

              <div className="author-card">
                <h4 className="section-label">الوسائط المتعددة</h4>
                <div className="media-row">
                  <div className="upload-box cover-upload">
                    <div className="upload-icon"><i className="fa-regular fa-image"></i></div>
                    <span>اسحب صورة الغلاف هنا</span>
                    <p>أو اضغط لاختيار ملف (PNG, JPG)</p>
                  </div>
                  <div className="upload-box audio-upload">
                    <div className="upload-icon"><i className="fa-solid fa-microphone"></i></div>
                    <span>التسجيل الصوتي</span>
                    <button className="btn-audio-upload"><i className="fa-solid fa-upload"></i> رفع ملف صوتي</button>
                    <p>تنسيقات مدعومة: MP3, WAV</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StoryAuthor;
