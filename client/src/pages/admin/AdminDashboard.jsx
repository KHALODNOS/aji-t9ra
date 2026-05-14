import React, { useState } from "react";

const AdminDashboard = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css');

        :root {
          --bg: #f8f7ee;
          --glass: rgba(255, 255, 255, 0.72);
          --text: #111827;
          --muted: #6b7280;
          --primary: #0f4a97;
          --primary-dark: #0b3f82;
          --accent: #58cc02;
          --soft-blue: #eef1fa;
          --shadow: 0 20px 40px rgba(24, 39, 75, 0.08);
          --sidebar-width: 280px;
        }

        * { box-sizing: border-box; }
        body { 
          margin: 0; 
          font-family: 'Tajawal', sans-serif; 
          background: var(--bg); 
          color: var(--text);
          direction: rtl;
        }

        .dashboard-container {
          display: flex;
          min-height: 100dvh;
          position: relative;
          overflow: hidden;
        }

        /* Background Shapes */
        .blur-shape { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.35; pointer-events: none; z-index: 0; }
        .shape-1 { width: 400px; height: 400px; top: -100px; right: -100px; background: #ffefcc; }
        .shape-2 { width: 350px; height: 350px; bottom: -50px; left: -50px; background: #d7e5ff; }
        .shape-3 { width: 300px; height: 300px; top: 40%; left: 10%; background: #ebe8d7; }

        /* Sidebar */
        .sidebar {
          width: var(--sidebar-width);
          background: var(--glass);
          backdrop-filter: blur(20px);
          border-left: 1px solid rgba(255, 255, 255, 0.8);
          display: flex;
          flex-direction: column;
          padding: 24px;
          z-index: 10;
          box-shadow: 4px 0 24px rgba(0,0,0,0.02);
        }

        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--primary);
          margin-bottom: 48px;
          text-decoration: none;
        }

        .sidebar-logo img { width: 40px; height: 40px; border-radius: 8px; }

        .nav-menu { list-style: none; padding: 0; margin: 0; flex: 1; }
        .nav-item { margin-bottom: 8px; }
        .nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 18px;
          text-decoration: none;
          color: var(--muted);
          font-weight: 700;
          border-radius: 14px;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .nav-link:hover, .nav-link.active {
          background: var(--primary);
          color: white;
          box-shadow: 0 10px 20px rgba(15, 74, 151, 0.2);
        }

        .nav-link i { font-size: 1.2rem; width: 24px; text-align: center; }

        .logout-btn {
          margin-top: auto;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 18px;
          color: #e63946;
          font-weight: 700;
          cursor: pointer;
          border-radius: 14px;
          transition: all 0.3s ease;
        }
        .logout-btn:hover { background: rgba(230, 57, 70, 0.1); }

        /* Main Content */
        .main-content {
          flex: 1;
          padding: 32px;
          z-index: 1;
          display: flex;
          flex-direction: column;
          gap: 32px;
          overflow-y: auto;
        }

        /* Header */
        .content-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .welcome-text h1 { margin: 0; font-size: 1.8rem; font-weight: 800; color: var(--primary-dark); }
        .welcome-text p { margin: 4px 0 0; color: var(--muted); font-size: 1rem; }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 14px;
          background: var(--glass);
          padding: 8px 16px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
        }

        .user-info { text-align: left; }
        .user-name { display: block; font-weight: 800; font-size: 0.95rem; }
        .user-role { display: block; font-size: 0.75rem; color: var(--muted); }
        .user-avatar { width: 40px; height: 40px; border-radius: 50%; background: #dfe6f2; display: flex; align-items: center; justify-content: center; color: var(--primary); font-weight: 800; }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 24px;
        }

        .stat-card {
          background: var(--glass);
          backdrop-filter: blur(15px);
          border-radius: 24px;
          padding: 24px;
          border: 1px solid rgba(255, 255, 255, 0.7);
          box-shadow: var(--shadow);
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .stat-icon {
          width: 60px;
          height: 60px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }

        .icon-blue { background: #eef5ff; color: #0f4a97; }
        .icon-green { background: #f0fdf4; color: #16a34a; }
        .icon-orange { background: #fff7ed; color: #ea580c; }
        .icon-purple { background: #f5f3ff; color: #7c3aed; }

        .stat-details h3 { margin: 0; font-size: 0.9rem; color: var(--muted); }
        .stat-value { font-size: 1.8rem; font-weight: 800; color: var(--primary-dark); }

        /* Glass Table Section */
        .section-card {
          background: var(--glass);
          backdrop-filter: blur(15px);
          border-radius: 28px;
          padding: 28px;
          border: 1px solid rgba(255, 255, 255, 0.7);
          box-shadow: var(--shadow);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .section-title { margin: 0; font-size: 1.4rem; font-weight: 800; color: var(--primary-dark); }

        .btn-action {
          border: none;
          background: var(--primary);
          color: white;
          padding: 10px 20px;
          border-radius: 12px;
          font-family: inherit;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: 0.3s;
        }
        .btn-action:hover { opacity: 0.9; transform: translateY(-2px); }

        .data-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0 12px;
          margin-top: -12px;
        }

        .data-table th {
          padding: 12px 20px;
          text-align: right;
          color: var(--muted);
          font-weight: 700;
          font-size: 0.9rem;
        }

        .data-table td {
          padding: 20px;
          background: rgba(255, 255, 255, 0.4);
          border-top: 1px solid rgba(255, 255, 255, 0.5);
          border-bottom: 1px solid rgba(255, 255, 255, 0.5);
        }

        .data-table td:first-child { border-right: 1px solid rgba(255, 255, 255, 0.5); border-radius: 0 16px 16px 0; }
        .data-table td:last-child { border-left: 1px solid rgba(255, 255, 255, 0.5); border-radius: 16px 0 0 16px; }

        .user-cell { display: flex; align-items: center; gap: 12px; }
        .user-cell img { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; }
        
        .status-pill {
          padding: 4px 12px;
          border-radius: 999px;
          font-size: 0.8rem;
          font-weight: 800;
        }
        .status-active { background: #dcfce7; color: #166534; }
        .status-pending { background: #fef9c3; color: #854d0e; }

        .actions-cell { display: flex; gap: 8px; }
        .icon-btn {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          border: 1px solid #dfe6f2;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--muted);
          transition: 0.2s;
        }
        .icon-btn:hover { background: var(--soft-blue); color: var(--primary); }

        @media (max-width: 1024px) {
          .sidebar { width: 80px; padding: 20px 10px; }
          .sidebar-logo span, .nav-link span { display: none; }
          .sidebar-logo { justify-content: center; }
          .nav-link { justify-content: center; padding: 14px; }
          .logout-btn span { display: none; }
          .logout-btn { justify-content: center; }
        }

        @media (max-width: 768px) {
          .dashboard-container { flex-direction: column; }
          .sidebar { width: 100%; height: auto; border-left: none; border-bottom: 1px solid rgba(255,255,255,0.8); flex-direction: row; padding: 10px 20px; }
          .sidebar-logo { margin-bottom: 0; }
          .nav-menu { display: flex; flex-direction: row; gap: 10px; flex: initial; }
          .nav-item { margin-bottom: 0; }
          .logout-btn { margin-top: 0; margin-right: auto; }
          .main-content { padding: 20px; }
          .stats-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="dashboard-container">
        {/* Background Decorations */}
        <span className="blur-shape shape-1" />
        <span className="blur-shape shape-2" />
        <span className="blur-shape shape-3" />

        {/* Sidebar */}
        <aside className="sidebar">
          <a href="#" className="sidebar-logo">
            <img src="/logo.jpeg" alt="Logo" />
            <span>Aji-t9ra</span>
          </a>

          <ul className="nav-menu">
            <li className="nav-item">
              <a 
                className={`nav-link ${activeTab === "overview" ? "active" : ""}`}
                onClick={() => setActiveTab("overview")}
              >
                <i className="fa-solid fa-chart-pie"></i>
                <span>لوحة التحكم</span>
              </a>
            </li>
            <li className="nav-item">
              <a 
                className={`nav-link ${activeTab === "students" ? "active" : ""}`}
                onClick={() => setActiveTab("students")}
              >
                <i className="fa-solid fa-user-graduate"></i>
                <span>الطلاب</span>
              </a>
            </li>
            <li className="nav-item">
              <a 
                className={`nav-link ${activeTab === "teachers" ? "active" : ""}`}
                onClick={() => setActiveTab("teachers")}
              >
                <i className="fa-solid fa-chalkboard-user"></i>
                <span>الأساتذة</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link">
                <i className="fa-solid fa-book-open"></i>
                <span>الدورات</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link">
                <i className="fa-solid fa-gear"></i>
                <span>الإعدادات</span>
              </a>
            </li>
          </ul>

          <div className="logout-btn" onClick={onBack}>
            <i className="fa-solid fa-right-from-bracket"></i>
            <span>تسجيل الخروج</span>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="main-content">
          <header className="content-header">
            <div className="welcome-text">
              <h1>مرحباً، المدير</h1>
              <p>إليك نظرة عامة على أداء المنصة اليوم.</p>
            </div>

            <div className="user-profile">
              <div className="user-info">
                <span className="user-name">أمين المدير</span>
                <span className="user-role">مسؤول النظام</span>
              </div>
              <div className="user-avatar">AD</div>
            </div>
          </header>

          {/* Stats Section */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon icon-blue">
                <i className="fa-solid fa-users"></i>
              </div>
              <div className="stat-details">
                <h3>إجمالي الطلاب</h3>
                <div className="stat-value">1,284</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon icon-green">
                <i className="fa-solid fa-chalkboard-user"></i>
              </div>
              <div className="stat-details">
                <h3>الأساتذة النشطون</h3>
                <div className="stat-value">42</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon icon-orange">
                <i className="fa-solid fa-layer-group"></i>
              </div>
              <div className="stat-details">
                <h3>الدورات المتاحة</h3>
                <div className="stat-value">156</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon icon-purple">
                <i className="fa-solid fa-circle-dollar-to-slot"></i>
              </div>
              <div className="stat-details">
                <h3>الإيرادات (MAD)</h3>
                <div className="stat-value">42.5K</div>
              </div>
            </div>
          </div>

          {/* Users Table Section */}
          <div className="section-card">
            <div className="section-header">
              <h2 className="section-title">إدارة المستخدمين</h2>
              <button className="btn-action">
                <i className="fa-solid fa-plus"></i>
                إضافة مستخدم
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>المستخدم</th>
                    <th>الدور</th>
                    <th>تاريخ الانضمام</th>
                    <th>الحالة</th>
                    <th>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: "سارة أحمد", role: "طالب", date: "12 مايو 2026", status: "نشط", img: "https://i.pravatar.cc/150?u=sara" },
                    { name: "محمد علي", role: "أستاذ", date: "10 مايو 2026", status: "نشط", img: "https://i.pravatar.cc/150?u=mohamed" },
                    { name: "ليلى خالد", role: "طالب", date: "08 مايو 2026", status: "معلق", img: "https://i.pravatar.cc/150?u=layla" },
                    { name: "ياسين كريم", role: "أستاذ", date: "05 مايو 2026", status: "نشط", img: "https://i.pravatar.cc/150?u=yassine" },
                  ].map((user, i) => (
                    <tr key={i}>
                      <td>
                        <div className="user-cell">
                          <img src={user.img} alt={user.name} />
                          <span style={{ fontWeight: 700 }}>{user.name}</span>
                        </div>
                      </td>
                      <td>{user.role}</td>
                      <td style={{ color: 'var(--muted)' }}>{user.date}</td>
                      <td>
                        <span className={`status-pill ${user.status === "نشط" ? "status-active" : "status-pending"}`}>
                          {user.status}
                        </span>
                      </td>
                      <td>
                        <div className="actions-cell">
                          <button className="icon-btn"><i className="fa-solid fa-pen-to-square"></i></button>
                          <button className="icon-btn" style={{ color: '#e63946' }}><i className="fa-solid fa-trash"></i></button>
                          <button className="icon-btn"><i className="fa-solid fa-ellipsis-vertical"></i></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminDashboard;
