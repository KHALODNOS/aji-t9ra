import React from 'react';
import '../../styles/teacher.css';

const TeacherSidebar = ({ 
  activePage, 
  onPageChange, 
  onLogout,
  teacherName = "أستاذ خالد مؤمن",
  teacherEmail = "khaled.momen@ajiteqra.com",
  teacherAvatar = "https://i.pravatar.cc/150?u=teacher"
}) => {
  const navItems = [
    { id: 'home', label: 'الرئيسية', icon: 'fa-house' },
    { id: 'author', label: 'مؤلف القصص', icon: 'fa-pen-nib' },
    { id: 'video', label: 'إضافة فيديو قصير', icon: 'fa-video' },
    { id: 'ai', label: 'إعدادات الـ AI', icon: 'fa-robot' },
    { id: 'wordbank', label: 'بنك الكلمات', icon: 'fa-book-open-reader' },
    { id: 'tests', label: 'الاختبارات', icon: 'fa-vial' },
    { id: 'salons', label: 'الصالونات الصوتية', icon: 'fa-microphone' },
    { id: 'students', label: 'متابعة الطلاب', icon: 'fa-users' },
    { id: 'chat', label: 'الدردشة العامة', icon: 'fa-comments' },
  ];

  return (
    <aside className="teacher-sidebar">
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
            <img src={teacherAvatar} alt={teacherName} />
          </div>
          <div className="user-info-3d">
            <span className="user-name-3d">{teacherName}</span>
            <span className="user-role-3d">مدرس معتمد</span>
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
          <button className="btn-3d-primary" style={{ width: '100%', marginBottom: '1rem' }}>
            <i className="fa-solid fa-plus"></i>
            <span>إضافة محتوى</span>
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

export default TeacherSidebar;
