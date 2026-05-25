import React, { useEffect, useState } from 'react';
import StudentSidebar from './StudentSidebar';
import NotificationBell from '../common/NotificationBell';
import api from '../../services/api';
import '../../styles/teacher.css';

const StudentLayout = ({ children, activePage, onPageChange, onLogout, studentInfo }) => {
  const [totalXp, setTotalXp] = useState(0);
  const [xpGain, setXpGain] = useState(null);
  const [xpPulseKey, setXpPulseKey] = useState(0);

  useEffect(() => {
    const fetchStudentXp = async () => {
      try {
        const response = await api.get('/student/journey');
        setTotalXp(Number(response.data?.stats?.totalXp) || 0);
      } catch (error) {
        console.error('Error loading student XP:', error);
      }
    };

    fetchStudentXp();
  }, []);

  useEffect(() => {
    const applyXpReward = (event) => {
      let reward = event?.detail;

      if (!reward) {
        const raw = localStorage.getItem('newlyEarnedXp');
        if (!raw) return;

        try {
          reward = JSON.parse(raw);
        } catch (error) {
          console.error('Error parsing XP reward:', error);
          localStorage.removeItem('newlyEarnedXp');
          return;
        }
      }

      const amount = Number(reward?.xpAwarded) || 0;
      if (!amount) return;

      setTotalXp((current) => Number(reward.totalXp) || current + amount);
      setXpGain(amount);
      setXpPulseKey((key) => key + 1);
      localStorage.removeItem('newlyEarnedXp');

      window.clearTimeout(applyXpReward.timeoutId);
      applyXpReward.timeoutId = window.setTimeout(() => setXpGain(null), 1800);
    };

    applyXpReward();
    window.addEventListener('studentXpReward', applyXpReward);
    return () => {
      window.removeEventListener('studentXpReward', applyXpReward);
      window.clearTimeout(applyXpReward.timeoutId);
    };
  }, []);

  return (
    <div className="teacher-layout student-layout">
      <style>{`
        .student-sidebar .sidebar-3d-content {
          padding: 1.35rem 1.1rem;
          min-height: 0;
          overflow: hidden;
        }

        .student-sidebar .teacher-brand {
          margin-bottom: 1rem;
        }

        .student-sidebar .teacher-user-card {
          margin-bottom: 1rem;
          padding: 0.9rem;
        }

        .student-sidebar .teacher-nav {
          min-height: 0;
          overflow-y: auto;
          padding: 0 0 0.35rem 0.25rem;
          scrollbar-width: thin;
          scrollbar-color: rgba(93, 162, 150, 0.45) transparent;
        }

        .student-sidebar .teacher-nav::-webkit-scrollbar {
          width: 6px;
        }

        .student-sidebar .teacher-nav::-webkit-scrollbar-thumb {
          background: rgba(93, 162, 150, 0.45);
          border-radius: 999px;
        }

        .student-sidebar .nav-item-3d {
          padding: 0.68rem 0.95rem;
          min-height: 42px;
          flex-shrink: 0;
        }

        .student-sidebar .sidebar-footer-3d {
          margin-top: 0.85rem;
          padding-top: 0.85rem;
          flex-shrink: 0;
        }

        .student-sidebar .btn-3d-primary {
          padding: 0.72rem 0.9rem;
        }

        .student-sidebar .logout-btn-3d {
          padding: 0.72rem 0.95rem;
        }

        @media (max-width: 1024px) {
          .student-sidebar.teacher-sidebar {
            width: 250px;
          }

          .student-main.teacher-main {
            margin-right: 250px;
          }

          .student-sidebar .brand-name,
          .student-sidebar .user-info-3d,
          .student-sidebar .nav-item-3d span,
          .student-sidebar .logout-btn-3d span,
          .student-sidebar .btn-3d-primary span {
            display: inline;
          }

          .student-sidebar .teacher-brand,
          .student-sidebar .teacher-user-card,
          .student-sidebar .nav-item-3d {
            justify-content: flex-start;
          }
        }

        @media (max-width: 720px) {
          .student-sidebar.teacher-sidebar {
            width: 220px;
          }

          .student-main.teacher-main {
            margin-right: 220px;
            padding: 1rem;
          }
        }

        .student-xp-pill {
          position: relative;
          display: flex;
          align-items: center;
          background: white;
          border: var(--teacher-border);
          border-radius: 12px;
          padding: 8px 16px;
          gap: 8px;
          font-weight: 800;
          font-size: 0.85rem;
          color: var(--teacher-primary);
          box-shadow: var(--teacher-card-shadow);
          overflow: visible;
        }

        .student-xp-pill.pulse {
          animation: student-xp-pulse 0.65s ease both;
        }

        .student-xp-gain {
          position: absolute;
          top: -18px;
          right: 12px;
          background: #111827;
          color: #ffffff;
          border-radius: 999px;
          padding: 4px 9px;
          font-size: 0.72rem;
          box-shadow: 0 10px 25px rgba(15, 23, 42, 0.22);
          animation: student-xp-float 1.7s ease both;
          pointer-events: none;
        }

        @keyframes student-xp-pulse {
          0% { transform: scale(1); box-shadow: var(--teacher-card-shadow); }
          45% { transform: scale(1.06); box-shadow: 0 14px 32px rgba(249, 200, 81, 0.32); }
          100% { transform: scale(1); box-shadow: var(--teacher-card-shadow); }
        }

        @keyframes student-xp-float {
          0% { opacity: 0; transform: translateY(8px) scale(0.88); }
          18%, 72% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-12px) scale(0.96); }
        }
      `}</style>
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
            <div key={xpPulseKey} className={`xp-pill-3d student-xp-pill ${xpGain ? 'pulse' : ''}`}>
              <i className="fa-solid fa-coins" style={{ color: '#f9c851' }}></i>
              <span>{totalXp.toLocaleString('en-US')} XP</span>
              {xpGain && <span className="student-xp-gain">+{xpGain} XP</span>}
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
