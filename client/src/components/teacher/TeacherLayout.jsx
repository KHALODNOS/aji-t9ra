import React from 'react';
import TeacherSidebar from './TeacherSidebar';
import NotificationBell from '../common/NotificationBell';
import '../../styles/teacher.css';

const TeacherLayout = ({ children, activePage, onPageChange, onLogout }) => {
  return (
    <div className="teacher-layout">
      <TeacherSidebar 
        activePage={activePage} 
        onPageChange={onPageChange} 
        onLogout={onLogout} 
      />
      
      <main className="teacher-main">
        <header className="teacher-header">
          <div className="header-search-3d">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input type="text" placeholder="ابحث عن دروس، طلاب، أو تقارير..." />
          </div>
          
          <div className="header-actions-3d">
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

        <div className="teacher-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default TeacherLayout;
