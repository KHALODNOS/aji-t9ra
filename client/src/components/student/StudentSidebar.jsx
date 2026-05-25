import React from 'react';
import '../../styles/teacher.css';

const StudentSidebar = ({ 
  activePage, 
  onPageChange, 
  onLogout,
  studentName = "أحمد محمد",
  studentLevel = "طالب مستوى متقدم",
  studentAvatar = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80"
}) => {
  const navItems = [
    { id: 'home', label: 'الرئيسية', icon: 'fa-house' },
    { id: 'journey', label: 'الرحلة التعليمية', icon: 'fa-book-open' },
    { id: 'speaking', label: 'ممارسة AI', icon: 'fa-robot' },
    { id: 'salons', label: 'غرف الصوت', icon: 'fa-microphone' },
    { id: 'leaderboard', label: 'لوحة الصدارة', icon: 'fa-trophy' },
    { id: 'achievements', label: 'الإنجازات', icon: 'fa-award' },
    { id: 'chat', label: 'الدردشة العامة', icon: 'fa-comments' },
  ];

  return (
    <aside className="teacher-sidebar student-sidebar">
      <div className="sidebar-3d-content">
        <div className="teacher-brand">
          <div className="brand-logo-3d">
            <i className="fa-solid fa-graduation-cap"></i>
          </div>
          <span className="brand-name">أجي تقرا</span>
        </div>

        <div 
          className={`teacher-user-card ${activePage === 'profile' ? 'active-card' : ''}`}
          onClick={() => onPageChange('profile')}
          style={{ cursor: 'pointer' }}
          title="الملف الشخصي"
        >
          <div className="avatar-container-3d">
            <img src={studentAvatar} alt={studentName} />
          </div>
          <div className="user-info-3d">
            <span className="user-name-3d">{studentName}</span>
            <span className="user-role-3d">{studentLevel}</span>
          </div>
        </div>

        <nav className="teacher-nav">
          {navItems.map((item) => (
            <div 
              key={item.id}
              className={`nav-item-3d ${activePage === item.id ? 'active' : ''}`}
              onClick={() => onPageChange(item.id)}
            >
              <i className={`fa-solid ${item.icon}`}></i>
              <span>{item.label}</span>
            </div>
          ))}
        </nav>

        <div className="sidebar-footer-3d">
          <button 
            className="btn-3d-primary" 
            style={{ width: '100%', marginBottom: '1rem' }}
            onClick={() => onPageChange('journey')}
          >
            <i className="fa-solid fa-play"></i>
            <span>ابدأ الدرس الآن</span>
          </button>
          <div className="logout-btn-3d" onClick={onLogout}>
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
            <span>تسجيل الخروج</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default StudentSidebar;
