import React, { useState } from "react";

const StudentProfile = ({ onBack, onLogout }) => {
  // State management
  const [activeTab, setActiveTab] = useState("الملف الشخصي");
  const [fullName, setFullName] = useState("أحمد محمد");
  const [email, setEmail] = useState("ahmed.m@edu.ma");
  const [currentPassword, setCurrentPassword] = useState("password123");
  const [newPassword, setNewPassword] = useState("password123");
  
  // Toggles state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [browserAlerts, setBrowserAlerts] = useState(false);

  // Linked accounts state
  const [isGoogleLinked, setIsGoogleLinked] = useState(true);
  const [isMicrosoftLinked, setIsMicrosoftLinked] = useState(false);

  // Avatar upload simulator state
  const [avatarUrl, setAvatarUrl] = useState("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=180&auto=format&fit=crop&q=80");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  // Save profile changes action
  const handleSaveChanges = (e) => {
    e.preventDefault();
    setToastMessage("تم حفظ التغييرات وتحديث ملفك الشخصي بنجاح! 💾");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Avatar Selection Simulator
  const selectAvatar = (url) => {
    setAvatarUrl(url);
    setShowAvatarModal(false);
    setToastMessage("تم تحديث صورة الملف الشخصي بنجاح! 📸");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css');

        :root {
          --bg-light: #fdfcf7; /* Warm clean ivory background matching screenshot colors */
          --sidebar-bg: #ffffff;
          --primary-blue: #00458b; /* Main Deep Blue */
          --primary-blue-dark: #002d5c;
          --primary-yellow: #f9c851; /* Main Gold Yellow */
          --primary-yellow-hover: #e5b23d;
          --text-main: #1d1d1d;
          --text-muted: #7e8b9b;
          --border-color: #f1ebd9;
          --shadow-sm: 0 4px 15px rgba(0, 0, 0, 0.015);
          --shadow-md: 0 10px 25px rgba(0, 0, 0, 0.03);
        }

        * {
          box-sizing: border-box;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        body {
          margin: 0;
          font-family: 'Tajawal', sans-serif;
          background: var(--bg-light);
          direction: rtl;
          color: var(--text-main);
        }

        .profile-container {
          display: flex;
          width: 100%;
          min-height: 100vh;
          background: var(--bg-light);
          direction: rtl;
        }

        /* Sidebar RTL */
        .sidebar {
          width: 300px;
          background: var(--sidebar-bg);
          border-left: 1px solid #f2f5f9;
          display: flex;
          flex-direction: column;
          padding: 30px 0;
          flex-shrink: 0;
          box-shadow: -4px 0 20px rgba(0, 0, 0, 0.01);
        }

        .brand-logo-container {
          width: 60px;
          height: 60px;
          background: var(--primary-blue);
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
          box-shadow: 0 8px 20px rgba(0, 69, 139, 0.15);
        }

        .brand-logo-container i {
          color: #ffffff;
          font-size: 1.8rem;
        }

        .brand-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 30px;
          padding: 0 20px;
        }

        .brand-title {
          font-size: 1.8rem;
          font-weight: 900;
          color: var(--primary-blue);
          margin: 0;
        }

        .brand-subtitle {
          font-size: 0.8rem;
          color: #94a3b8;
          font-weight: 700;
          margin-top: 4px;
        }

        .nav-list {
          list-style: none;
          padding: 0 15px;
          margin: 0;
          flex-grow: 1;
        }

        .nav-item-wrapper {
          margin-bottom: 5px;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 12px 20px;
          text-decoration: none;
          color: #64748b;
          font-weight: 700;
          cursor: pointer;
          border-radius: 14px;
          font-size: 0.95rem;
        }

        .nav-link:hover {
          background: #f8fafc;
          color: var(--primary-blue);
        }

        .nav-link.active {
          background: #eef5fc;
          color: var(--primary-blue);
          border-right: 4px solid var(--primary-blue);
          border-radius: 0 14px 14px 0;
        }

        .nav-link i {
          font-size: 1.15rem;
          width: 24px;
          text-align: center;
        }

        .sidebar-action-container {
          padding: 0 20px;
          margin-top: auto;
          margin-bottom: 10px;
        }

        .action-add-btn {
          width: 100%;
          background: var(--primary-blue);
          color: #ffffff;
          border: none;
          border-radius: 16px;
          padding: 14px;
          font-weight: 800;
          font-size: 0.95rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          box-shadow: 0 4px 15px rgba(0, 69, 139, 0.15);
        }

        .action-add-btn:hover {
          background: var(--primary-blue-dark);
          transform: translateY(-2px);
        }

        /* Main Wrapper */
        .main-wrapper {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          height: 100vh;
        }

        /* Content Area Container */
        .content-area {
          padding: 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* Hero Avatar section at top */
        .profile-hero {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 40px;
          text-align: center;
        }

        .avatar-outer-wrapper {
          position: relative;
          width: 120px;
          height: 120px;
          margin-bottom: 15px;
        }

        .avatar-image-container {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          overflow: hidden;
          border: 4px solid #ffffff;
          box-shadow: 0 8px 25px rgba(0,0,0,0.08);
        }

        .avatar-image-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .avatar-camera-btn {
          position: absolute;
          bottom: 0;
          right: 5px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--primary-blue);
          color: #ffffff;
          border: 2px solid #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 0.85rem;
          box-shadow: 0 4px 10px rgba(0,0,0,0.15);
        }

        .avatar-camera-btn:hover {
          background: var(--primary-blue-dark);
        }

        .profile-user-name {
          font-size: 1.5rem;
          font-weight: 900;
          color: var(--primary-blue);
          margin: 0;
        }

        .profile-user-role {
          font-size: 0.85rem;
          color: #64748b;
          font-weight: 700;
          margin-top: 6px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        /* Two columns details row */
        .profile-details-grid {
          display: grid;
          grid-template-columns: 2fr 3fr;
          gap: 30px;
          width: 100%;
          max-width: 1000px;
          margin-bottom: 30px;
        }

        .profile-detail-card {
          background: #ffffff;
          border-radius: 24px;
          padding: 30px;
          border: 1px solid rgba(241, 235, 217, 0.4);
          box-shadow: var(--shadow-sm);
        }

        .card-header-lbl {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1.1rem;
          font-weight: 850;
          color: #1e293b;
          border-bottom: 1px solid #f8f6f0;
          padding-bottom: 15px;
          margin-bottom: 25px;
        }

        .card-header-lbl i {
          color: var(--primary-blue);
        }

        /* Form styling */
        .form-row {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-bottom: 20px;
        }

        .form-input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-input-group label {
          font-size: 0.8rem;
          font-weight: 800;
          color: #475569;
        }

        .form-control-input {
          width: 100%;
          border: 1px solid #cbd5e1;
          border-radius: 14px;
          padding: 12px 15px;
          font-family: inherit;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-main);
          outline: none;
          background: #ffffff;
        }

        .form-control-input:focus {
          border-color: var(--primary-blue);
        }

        /* Dropdown custom */
        .form-control-select {
          width: 100%;
          border: 1px solid #cbd5e1;
          border-radius: 14px;
          padding: 12px 15px;
          font-family: inherit;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-main);
          outline: none;
          background: #ffffff;
          cursor: pointer;
        }

        /* Toggle Switches */
        .toggle-options-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .toggle-option-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .toggle-option-text {
          display: flex;
          flex-direction: column;
        }

        .toggle-option-title {
          font-size: 0.85rem;
          font-weight: 800;
          color: #1e293b;
        }

        .toggle-option-sub {
          font-size: 0.75rem;
          color: #94a3b8;
          font-weight: 600;
          margin-top: 3px;
        }

        /* Custom iOS Toggle Swinger */
        .toggle-switch-wrapper {
          position: relative;
          width: 46px;
          height: 24px;
          background: #e2e8f0;
          border-radius: 20px;
          cursor: pointer;
        }

        .toggle-switch-wrapper.active {
          background: var(--primary-blue);
        }

        .toggle-switch-knob {
          position: absolute;
          top: 2px;
          right: 2px;
          width: 20px;
          height: 20px;
          background: #ffffff;
          border-radius: 50%;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }

        .toggle-switch-wrapper.active .toggle-switch-knob {
          transform: translateX(-22px);
        }

        /* Bottom Security Section */
        .security-row-block {
          width: 100%;
          max-width: 1000px;
          margin-bottom: 40px;
        }

        .security-card {
          background: #ffffff;
          border-radius: 24px;
          padding: 30px;
          border: 1px solid rgba(241, 235, 217, 0.4);
          box-shadow: var(--shadow-sm);
        }

        .security-card .card-header-lbl i {
          color: #ef4444;
        }

        .security-columns {
          display: grid;
          grid-template-columns: 3fr 4fr;
          gap: 30px;
        }

        /* Left Shield box */
        .security-shield-status-card {
          background: #f4f7fa;
          border-radius: 20px;
          padding: 24px;
          border-right: 4px solid #c29525;
          display: flex;
          gap: 15px;
          align-items: center;
        }

        .shield-icon-container {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.4rem;
          color: #c29525;
          flex-shrink: 0;
        }

        .shield-text-info {
          display: flex;
          flex-direction: column;
        }

        .shield-title-lbl {
          font-size: 0.9rem;
          font-weight: 850;
          color: #1e293b;
        }

        .shield-sub-lbl {
          font-size: 0.75rem;
          color: #64748b;
          font-weight: 600;
          margin-top: 3px;
          line-height: 1.4;
        }

        .shield-action-link {
          font-size: 0.8rem;
          font-weight: 800;
          color: #c29525;
          text-decoration: none;
          margin-top: 10px;
          cursor: pointer;
          display: inline-block;
        }

        .shield-action-link:hover {
          text-decoration: underline;
        }

        /* Linked accounts cards */
        .linked-accounts-block {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .linked-accounts-lbl {
          font-size: 0.85rem;
          font-weight: 800;
          color: #475569;
        }

        .linked-cards-row {
          display: flex;
          gap: 15px;
        }

        .linked-platform-card {
          flex-grow: 1;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 16px;
          padding: 12px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
        }

        .linked-platform-card:hover {
          background: #f8fafc;
          border-color: #94a3b8;
        }

        .platform-icon-and-name {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.85rem;
          font-weight: 800;
          color: #334155;
        }

        .platform-icon-and-name img {
          width: 24px;
          height: 24px;
          object-fit: contain;
        }

        .linked-status-pill {
          font-size: 0.65rem;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 8px;
        }

        .linked-status-pill.connected {
          background: #ecfdf5;
          color: #059669;
        }

        .linked-status-pill.not-connected {
          background: #f1f5f9;
          color: #64748b;
        }

        /* Bottom Save controls */
        .profile-action-footer {
          width: 100%;
          max-width: 1000px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
        }

        .btn-profile-save {
          background: #00458b;
          color: #ffffff;
          border: none;
          padding: 14px 45px;
          border-radius: 18px;
          font-weight: 900;
          font-size: 1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 6px 20px rgba(0, 69, 139, 0.15);
        }

        .btn-profile-save:hover {
          background: var(--primary-blue-dark);
          transform: translateY(-2px);
        }

        .btn-profile-logout {
          background: #ffffff;
          border: 1px solid #ef4444;
          color: #ef4444;
          padding: 12px 30px;
          border-radius: 18px;
          font-weight: 800;
          font-size: 0.9rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-profile-logout:hover {
          background: #fef2f2;
        }

        /* Centered Nature Icons at far bottom */
        .bottom-decorations {
          display: flex;
          gap: 25px;
          justify-content: center;
          color: #cbd5e1;
          font-size: 1.4rem;
          margin-bottom: 25px;
        }

        .bottom-decorations i:hover {
          color: var(--primary-blue);
        }

        /* Toast Notifications styles */
        .toast-popup {
          position: fixed;
          bottom: 30px;
          right: 30px;
          background: #1e293b;
          color: #ffffff;
          padding: 16px 24px;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
          z-index: 100;
          font-weight: 700;
          font-size: 0.85rem;
          animation: toastAppear 0.3s ease;
        }

        @keyframes toastAppear {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Avatar Picker Simulator modal */
        .avatar-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
        }

        .avatar-modal-card {
          background: #ffffff;
          width: 380px;
          padding: 25px;
          border-radius: 24px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          text-align: center;
        }

        .avatar-modal-card h3 {
          font-size: 1.15rem;
          font-weight: 900;
          color: var(--primary-blue);
          margin: 0 0 20px 0;
        }

        .avatar-options-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          margin-bottom: 20px;
        }

        .avatar-pick-option {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          overflow: hidden;
          cursor: pointer;
          border: 3px solid transparent;
        }

        .avatar-pick-option:hover {
          border-color: var(--primary-blue);
        }

        .avatar-pick-option img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        @media (max-width: 1024px) {
          .profile-details-grid {
            grid-template-columns: 1fr;
          }
          .security-columns {
            grid-template-columns: 1fr;
          }
          .profile-action-footer {
            flex-direction: column;
            gap: 15px;
          }
        }
      `}</style>

        {/* Main Scrollable Content Area */}
        <div className="content-area" style={{ padding: 0 }}>
          {/* Profile Hero Header */}
          <section className="profile-hero">
            <div className="avatar-outer-wrapper">
              <div className="avatar-image-container">
                <img src={avatarUrl} alt="Ahmed Profile" />
              </div>
              <button
                className="avatar-camera-btn"
                onClick={() => setShowAvatarModal(true)}
                title="تعديل الصورة الشخصية"
              >
                <i className="fa-solid fa-camera"></i>
              </button>
            </div>

            <h2 className="profile-user-name">{fullName}</h2>
            <div className="profile-user-role">
              <i className="fa-solid fa-graduation-cap"></i>
              <span>طالب مستوى متقدم</span>
            </div>
          </section>

          {/* Form and Toggles Grid */}
          <section className="profile-details-grid">
            {/* Left Card: Preferences & Language (التفضيلات واللغة) */}
            <div className="profile-detail-card">
              <div className="card-header-lbl">
                <i className="fa-solid fa-sliders"></i>
                <span>التفضيلات واللغة</span>
              </div>

              <div className="toggle-options-list">
                {/* Interface Language */}
                <div className="form-input-group">
                  <label>لغة الواجهة المفضلة</label>
                  <select className="form-control-select">
                    <option>العربية</option>
                    <option>الأمازيغية (Tifinagh)</option>
                    <option>English</option>
                  </select>
                </div>

                {/* Primary Learning Path */}
                <div className="form-input-group">
                  <label>مسار التعلم الأساسي</label>
                  <input
                    type="text"
                    className="form-control-input"
                    defaultValue="الأمازيغية (Tifinagh)"
                    readOnly
                  />
                </div>

                {/* Email Notifications toggle */}
                <div className="toggle-option-item" style={{ marginTop: "10px" }}>
                  <div className="toggle-option-text">
                    <span className="toggle-option-title">إشعارات البريد</span>
                    <span className="toggle-option-sub">تلقي تحديثات أسبوعية</span>
                  </div>
                  <div
                    className={`toggle-switch-wrapper ${emailNotifications ? "active" : ""}`}
                    onClick={() => setEmailNotifications(!emailNotifications)}
                  >
                    <div className="toggle-switch-knob"></div>
                  </div>
                </div>

                {/* Browser Alerts toggle */}
                <div className="toggle-option-item">
                  <div className="toggle-option-text">
                    <span className="toggle-option-title">تنبيهات المتصفح</span>
                    <span className="toggle-option-sub">للحصص المباشرة والرسائل</span>
                  </div>
                  <div
                    className={`toggle-switch-wrapper ${browserAlerts ? "active" : ""}`}
                    onClick={() => setBrowserAlerts(!browserAlerts)}
                  >
                    <div className="toggle-switch-knob"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Card: Account Details (بيانات الحساب) */}
            <div className="profile-detail-card">
              <div className="card-header-lbl">
                <i className="fa-regular fa-user"></i>
                <span>بيانات الحساب</span>
              </div>

              <form onSubmit={handleSaveChanges}>
                <div className="form-row">
                  <div className="form-input-group">
                    <label>الاسم الكامل</label>
                    <input
                      type="text"
                      className="form-control-input"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-input-group">
                    <label>البريد الإلكتروني</label>
                    <input
                      type="email"
                      className="form-control-input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Change password section */}
                <div
                  className="card-header-lbl"
                  style={{
                    borderBottom: "none",
                    marginTop: "25px",
                    marginBottom: "15px",
                    paddingBottom: 0,
                    fontSize: "0.95rem"
                  }}
                >
                  <i className="fa-solid fa-key" style={{ transform: "rotate(-45deg)" }}></i>
                  <span>تغيير كلمة المرور</span>
                </div>

                <div className="form-row">
                  <div className="form-input-group">
                    <label>كلمة المرور الحالية</label>
                    <input
                      type="password"
                      className="form-control-input"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>

                  <div className="form-input-group">
                    <label>كلمة المرور الجديدة</label>
                    <input
                      type="password"
                      className="form-control-input"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                </div>
              </form>
            </div>
          </section>

          {/* Bottom Security Card (الأمان والخصوصية) */}
          <section className="security-row-block">
            <div className="security-card">
              <div className="card-header-lbl">
                <i className="fa-solid fa-shield-halved"></i>
                <span>الأمان والخصوصية</span>
              </div>

              <div className="security-columns">
                {/* Shield card warning */}
                <div className="security-shield-status-card">
                  <div className="shield-icon-container">
                    <i className="fa-solid fa-circle-check"></i>
                  </div>
                  <div className="shield-text-info">
                    <span className="shield-title-lbl">حسابك محمي بشكل جيد</span>
                    <span className="shield-sub-lbl">تأكد من تفعيل التحقق بخطوتين لزيادة الأمان.</span>
                    <span
                      className="shield-action-link"
                      onClick={() => alert("فتح إعدادات التحقق بخطوتين (2-Step Verification)...")}
                    >
                      إدارة الخصوصية
                    </span>
                  </div>
                </div>

                {/* Connected accounts */}
                <div className="linked-accounts-block">
                  <span className="linked-accounts-lbl">الحسابات المرتبطة</span>
                  <div className="linked-cards-row">
                    {/* Google card */}
                    <div
                      className="linked-platform-card"
                      onClick={() => {
                        setIsGoogleLinked(!isGoogleLinked);
                        setToastMessage(isGoogleLinked ? "تم إلغاء ربط حساب Google" : "تم ربط حساب Google بنجاح!");
                        setShowToast(true);
                        setTimeout(() => setShowToast(false), 3000);
                      }}
                    >
                      <div className="platform-icon-and-name">
                        <img
                          src="https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=60&auto=format&fit=crop&q=80"
                          alt="Google Logo"
                        />
                        <span>Google</span>
                      </div>
                      <span className={`linked-status-pill ${isGoogleLinked ? "connected" : "not-connected"}`}>
                        {isGoogleLinked ? "تم الربط بنجاح" : "غير مرتبط"}
                      </span>
                    </div>

                    {/* Microsoft card */}
                    <div
                      className="linked-platform-card"
                      onClick={() => {
                        setIsMicrosoftLinked(!isMicrosoftLinked);
                        setToastMessage(isMicrosoftLinked ? "تم إلغاء ربط حساب Microsoft" : "تم ربط حساب Microsoft بنجاح!");
                        setShowToast(true);
                        setTimeout(() => setShowToast(false), 3000);
                      }}
                    >
                      <div className="platform-icon-and-name">
                        <img
                          src="https://images.unsplash.com/photo-1625014020771-712ad5981a3e?w=60&auto=format&fit=crop&q=80"
                          alt="Microsoft Logo"
                        />
                        <span>Microsoft</span>
                      </div>
                      <span className={`linked-status-pill ${isMicrosoftLinked ? "connected" : "not-connected"}`}>
                        {isMicrosoftLinked ? "تم الربط بنجاح" : "غير مرتبط"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Action Footer */}
          <div className="profile-action-footer">
            {/* Save Button */}
            <button className="btn-profile-save" onClick={handleSaveChanges}>
              <span>حفظ التغييرات</span>
              <i className="fa-solid fa-floppy-disk"></i>
            </button>

            {/* Logout Button */}
            <button className="btn-profile-logout" onClick={onLogout || onBack}>
              <i className="fa-solid fa-arrow-right-from-bracket"></i>
              <span>تسجيل الخروج</span>
            </button>
          </div>

          {/* Far bottom center tree decorations */}
          <div className="bottom-decorations">
            <i className="fa-solid fa-tree"></i>
            <i className="fa-solid fa-leaf"></i>
            <i className="fa-solid fa-clover"></i>
          </div>
        </div>

      {/* Toast popup alerts */}
      {showToast && (
        <div className="toast-popup">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Avatar Picker Modal Simulation */}
      {showAvatarModal && (
        <div className="avatar-modal-overlay" onClick={() => setShowAvatarModal(false)}>
          <div className="avatar-modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>اختر صورتك الرمزية</h3>
            <div className="avatar-options-grid">
              {[
                "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=120&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80"
              ].map((url, idx) => (
                <div className="avatar-pick-option" key={idx} onClick={() => selectAvatar(url)}>
                  <img src={url} alt={`avatar-${idx}`} />
                </div>
              ))}
            </div>
            <button className="btn-cancel" style={{ width: "100%" }} onClick={() => setShowAvatarModal(false)}>
              إلغاء
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentProfile;
