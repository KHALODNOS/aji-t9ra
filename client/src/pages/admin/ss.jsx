import React, { useState } from "react";

const AdminDashboard = ({ onBack }) => {
  const [activeMenu, setActiveMenu] = useState("stats");

  const renderContent = () => {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1 style={{ color: '#00458b', fontSize: '2.5rem', fontWeight: '800' }}>لوحة تحكم المسؤول</h1>
        <p style={{ color: '#757575', fontSize: '1.1rem' }}>مرحباً بك في نظام إدارة المنصة. يرجى اختيار أحد الأقسام من القائمة الجانبية.</p>
        <div style={{ marginTop: '50px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          <div style={{ background: '#fff', padding: '30px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid #f1f1f1' }}>
            <i className="fa-solid fa-chart-line" style={{ fontSize: '2rem', color: '#00458b', marginBottom: '15px' }}></i>
            <h3 style={{ margin: '0' }}>الإحصائيات</h3>
          </div>
          <div style={{ background: '#fff', padding: '30px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid #f1f1f1' }}>
            <i className="fa-solid fa-user-group" style={{ fontSize: '2rem', color: '#00458b', marginBottom: '15px' }}></i>
            <h3 style={{ margin: '0' }}>المستخدمين</h3>
          </div>
          <div style={{ background: '#fff', padding: '30px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid #f1f1f1' }}>
            <i className="fa-solid fa-paste" style={{ fontSize: '2rem', color: '#00458b', marginBottom: '15px' }}></i>
            <h3 style={{ margin: '0' }}>المراجعة</h3>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css');

        * { box-sizing: border-box; }
        body { margin: 0; font-family: 'Tajawal', sans-serif; background: #fdfdfd; direction: rtl; }

        .dashboard-container { display: flex; width: 100%; min-height: 100vh; }

        .sidebar {
          width: 280px; background: #fff; border-left: 1px solid #f1f1f1;
          display: flex; flex-direction: column; padding: 30px 0; flex-shrink: 0;
        }

        .user-info { padding: 0 25px 30px; border-bottom: 1px solid #f8f8f8; margin-bottom: 20px; }
        .user-avatar { width: 60px; height: 60px; border-radius: 18px; margin-bottom: 15px; }
        .user-details h4 { margin: 0; font-size: 1rem; font-weight: 800; }
        .user-details p { margin: 0; font-size: 0.8rem; color: #757575; }

        .nav-list { list-style: none; padding: 0 15px; margin: 0; flex-grow: 1; }
        .nav-link {
          display: flex; align-items: center; gap: 15px; padding: 14px 20px; text-decoration: none; color: #757575; font-weight: 700; cursor: pointer; border-radius: 14px; margin-bottom: 8px;
        }
        .nav-link.active { background: #00458b; color: #fff; }
        .nav-link i { font-size: 1.1rem; }

        .sidebar-bottom { padding: 0 20px; }
        .btn-add {
          width: 100%; background: #00458b; color: white; border: none; border-radius: 14px; padding: 14px; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 20px;
        }

        .main-wrapper { flex-grow: 1; display: flex; flex-direction: column; }
        .topbar { height: 80px; padding: 0 40px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #f1f1f1; }
        .search-box { background: #f8f9fa; border-radius: 12px; padding: 10px 20px; width: 400px; display: flex; align-items: center; gap: 10px; }
        .search-box input { border: none; background: transparent; outline: none; flex-grow: 1; font-family: inherit; }
      `}</style>

      <aside className="sidebar">
        <div className="user-info">
          <img className="user-avatar" src="https://i.pravatar.cc/150?u=admin" alt="Admin" />
          <div className="user-details">
            <h4>مدير النظام</h4>
            <p>admin@ajiteqra.com</p>
          </div>
        </div>
        <ul className="nav-list">
          <li onClick={() => setActiveMenu("stats")}><div className={`nav-link ${activeMenu === "stats" ? "active" : ""}`}><i className="fa-solid fa-chart-line"></i><span>الإحصائيات</span></div></li>
          <li onClick={() => setActiveMenu("users")}><div className={`nav-link ${activeMenu === "users" ? "active" : ""}`}><i className="fa-solid fa-user-group"></i><span>إدارة المستخدمين</span></div></li>
          <li onClick={() => setActiveMenu("review")}><div className={`nav-link ${activeMenu === "review" ? "active" : ""}`}><i className="fa-solid fa-paste"></i><span>مراجعة المحتوى</span></div></li>
          <li onClick={() => setActiveMenu("support")}><div className={`nav-link ${activeMenu === "support" ? "active" : ""}`}><i className="fa-solid fa-headset"></i><span>الدعم الفني</span></div></li>
        </ul>
        <div className="sidebar-bottom">
          <button className="btn-add"><i className="fa-solid fa-plus"></i> إضافة محتوى</button>
          <button onClick={onBack} style={{ width: '100%', background: 'transparent', border: 'none', color: '#d32f2f', fontWeight: '800', cursor: 'pointer' }}>تسجيل الخروج</button>
        </div>
      </aside>

      <main className="main-wrapper">
        <header className="topbar">
          <div className="search-box">
            <i className="fa-solid fa-magnifying-glass" style={{ color: '#999' }}></i>
            <input type="text" placeholder="ابحث عن أي شيء..." />
          </div>
          <div style={{ display: 'flex', gap: '20px', color: '#00458b' }}>
            <i className="fa-regular fa-bell" style={{ fontSize: '1.3rem' }}></i>
            <i className="fa-solid fa-globe" style={{ fontSize: '1.3rem' }}></i>
          </div>
        </header>

        {renderContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;
