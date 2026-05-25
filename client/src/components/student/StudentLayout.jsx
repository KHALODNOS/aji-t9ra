import React from 'react';
import StudentSidebar from './StudentSidebar';
import NotificationBell from '../common/NotificationBell';
import '../../styles/teacher.css';

const StudentLayout = ({ children, activePage, onPageChange, onLogout, studentInfo }) => {
  return (
    <div className="teacher-layout student-layout">
      <StudentSidebar 
        activePage={activePage} 
        onPageChange={onPageChange} 
        onLogout={onLogout} 
        studentName={studentInfo?.fullName}
        studentLevel={studentInfo?.level || "طالب مستوى متقدم"}
        studentAvatar={studentInfo?.avatarUrl}
      />
      
      <main className="teacher-main student-main">
        <header className="teacher-header student-header">
          <div className="header-search-3d">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input type="text" placeholder="ابحث عن قصص، فيديوهات أو دروس..." />
          </div>
          
          <div className="header-actions-3d">
            {/* XP Points */}
            <div className="xp-pill-3d" style={{
              display: 'flex',
              alignItems: 'center',
              background: 'white',
              border: 'var(--teacher-border)',
              borderRadius: '12px',
              padding: '8px 16px',
              gap: '8px',
              fontWeight: 800,
              fontSize: '0.85rem',
              color: 'var(--teacher-primary)',
              boxShadow: 'var(--teacher-card-shadow)'
            }}>
              <i className="fa-solid fa-coins" style={{ color: '#f9c851' }}></i>
              <span>2,450 XP</span>
            </div>
            
            <div className="action-btn-3d">
              <i className="fa-regular fa-envelope"></i>
              <span className="notification-dot"></span>
            </div>
            <NotificationBell />
            <div 
              className={`action-btn-3d ${activePage === 'profile' ? 'active' : ''}`}
              onClick={() => onPageChange('profile')}
              title="الملف الشخصي"
            >
              <i className="fa-regular fa-circle-user"></i>
            </div>
          </div>
        </header>

        <div className="teacher-content student-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default StudentLayout;
