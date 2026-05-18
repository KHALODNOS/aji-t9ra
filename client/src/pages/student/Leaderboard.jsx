import React, { useState, useEffect } from "react";

const Leaderboard = ({ onBack, onLogout }) => {
  // State management
  const [activeTab, setActiveTab] = useState("لوحة الصدارة");
  const [selectedPath, setSelectedPath] = useState("مسار التيفيناغ");
  const [timeRange, setTimeRange] = useState("أسبوعي");

  // User XP and Rank state
  const [userXP, setUserXP] = useState(1250);
  const [userRank, setUserRank] = useState(42);

  // Fast challenge modal states
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);

  // Competitor data by path matching screenshot
  const competitorsData = {
    "مسار التيفيناغ": {
      podium: {
        first: { name: "أحمد بن محمد", xp: 5250, avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80" },
        second: { name: "ليلى الذكية", xp: 4800, avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80" },
        third: { name: "ياسين الفارس", xp: 4550, avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80" }
      },
      list: [
        { rank: 4, name: "سارة العلي", xp: 4200, trend: "+2", trendClass: "green", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80" },
        { rank: 5, name: "عمر الفاروق", xp: 4050, trend: "-1", trendClass: "red", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80" },
        { rank: 7, name: "خالد العبيدي", xp: 3750, trend: "0", trendClass: "grey", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80" }
      ]
    },
    "مسار الإنجليزية": {
      podium: {
        first: { name: "مريم فوزي", xp: 6100, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80" },
        second: { name: "خالد علام", xp: 5800, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80" },
        third: { name: "هدى عاصم", xp: 5500, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80" }
      },
      list: [
        { rank: 4, name: "يوسف خليل", xp: 5200, trend: "+1", trendClass: "green", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80" },
        { rank: 5, name: "دينا رامي", xp: 5050, trend: "0", trendClass: "grey", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80" },
        { rank: 6, name: "بدر عثمان", xp: 4900, trend: "+3", trendClass: "green", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80" }
      ]
    },
    "مسار الفرنسية": {
      podium: {
        first: { name: "سامي منصور", xp: 4950, avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80" },
        second: { name: "نهى الجميل", xp: 4600, avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80" },
        third: { name: "أمير كريم", xp: 4300, avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80" }
      },
      list: [
        { rank: 4, name: "زينب نور", xp: 4100, trend: "-2", trendClass: "red", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80" },
        { rank: 5, name: "كمال وحيد", xp: 3950, trend: "+1", trendClass: "green", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80" },
        { rank: 6, name: "سلوى عماد", xp: 3800, trend: "0", trendClass: "grey", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80" }
      ]
    }
  };

  // Mini quiz questions for Tifinagh challenge
  const quizQuestions = [
    {
      q: "ما هو الحرف المقابل لرمز التيفيناغ 'ⵣ'؟",
      options: ["حرف الياء", "حرف الزاي (الـ Yaz)", "حرف الميم", "حرف الراء"],
      correctIdx: 1
    },
    {
      q: "كيف تكتب كلمة 'أغرم' (Aghrum - الخبز) بالتيفيناغ؟",
      options: ["ⴰⵖⵔⵓⵎ", "ⵜⴰⴼⵓⴽⵜ", "ⵉⵜⵔⵉ", "ⴰⵎⴰⵏ"],
      correctIdx: 0
    },
    {
      q: "أي من الرموز التالية يمثل حرف السين 'ⵙ'؟",
      options: ["ⴹ", "ⵜ", "ⵙ", "ⴼ"],
      correctIdx: 2
    }
  ];

  // Answer handler
  const handleAnswerSubmit = (idx) => {
    setSelectedAnswer(idx);
    setTimeout(() => {
      if (idx === quizQuestions[currentQuestionIdx].correctIdx) {
        if (currentQuestionIdx < quizQuestions.length - 1) {
          setCurrentQuestionIdx(prev => prev + 1);
          setSelectedAnswer(null);
        } else {
          // Success challenge completion!
          setUserXP(prev => prev + 150);
          setUserRank(35); // Rank boosts from 42 to 35!
          setShowSuccessScreen(true);
        }
      } else {
        alert("إجابة خاطئة! حاول التركيز مرة أخرى.");
        setSelectedAnswer(null);
      }
    }, 1000);
  };

  const activeData = competitorsData[selectedPath];

  return (
    <div className="leaderboard-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css');

        :root {
          --bg-light: #fefef9; /* Warm luxury ivory tone matching screenshot */
          --sidebar-bg: #ffffff;
          --primary-blue: #00458b; /* Main Deep Blue */
          --primary-blue-dark: #002d5c;
          --primary-yellow: #f9c851; /* Main Gold Yellow */
          --primary-yellow-hover: #e5b23d;
          --text-main: #1d1d1d;
          --text-muted: #7d8b9b;
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

        .leaderboard-container {
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

        .sidebar-brand-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 30px;
          padding: 0 20px;
          text-align: center;
        }

        .sidebar-brand-title {
          font-size: 1.4rem;
          font-weight: 900;
          color: var(--primary-blue);
          margin: 0;
        }

        .sidebar-brand-subtitle {
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

        /* Main Wrapper */
        .main-wrapper {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          height: 100vh;
          padding-bottom: 90px; /* Space for sticky user bar */
        }

        /* Topbar styling */
        .topbar {
          padding: 20px 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #f8f6f0;
          background: var(--bg-light);
          flex-shrink: 0;
        }

        .topbar-right-logo {
          display: flex;
          align-items: center;
          gap: 30px;
        }

        .brand-logo-text {
          font-size: 1.6rem;
          font-weight: 950;
          color: var(--primary-blue);
          margin: 0;
        }

        .topbar-nav-tabs {
          display: flex;
          gap: 25px;
        }

        .topbar-tab-link {
          font-size: 0.95rem;
          font-weight: 800;
          color: #64748b;
          cursor: pointer;
          padding-bottom: 6px;
          position: relative;
        }

        .topbar-tab-link.active {
          color: var(--primary-blue);
        }

        .topbar-tab-link.active::after {
          content: "";
          position: absolute;
          bottom: -22px;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--primary-blue);
          border-radius: 2px 2px 0 0;
        }

        .topbar-left-profile {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .student-profile-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          border: 1.5px solid #cbd5e1;
          cursor: pointer;
        }

        .student-profile-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .topbar-icons {
          display: flex;
          gap: 15px;
          font-size: 1.25rem;
          color: #64748b;
        }

        .topbar-icons i {
          cursor: pointer;
        }

        .topbar-icons i:hover {
          color: var(--primary-blue);
        }

        /* Content Area */
        .content-area {
          padding: 30px 40px;
        }

        /* Filter header row */
        .leaderboard-filters-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
        }

        .path-pills-row {
          display: flex;
          background: #f1f5f9;
          padding: 4px;
          border-radius: 14px;
          gap: 5px;
        }

        .path-pill-btn {
          border: none;
          background: transparent;
          padding: 10px 24px;
          border-radius: 10px;
          font-family: inherit;
          font-size: 0.85rem;
          font-weight: 800;
          color: #64748b;
          cursor: pointer;
        }

        .path-pill-btn.active {
          background: var(--primary-blue);
          color: #ffffff;
          box-shadow: 0 4px 15px rgba(0, 69, 139, 0.15);
        }

        .left-time-filters {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .dropdown-select-time {
          border: 1px solid #cbd5e1;
          background: #ffffff;
          border-radius: 12px;
          padding: 8px 15px;
          font-family: inherit;
          font-size: 0.8rem;
          font-weight: 700;
          color: #475569;
          outline: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .grey-flower-decor {
          font-size: 3rem;
          color: #cbd5e1;
          opacity: 0.6;
        }

        /* Podium Top 3 Section */
        .podium-container {
          display: flex;
          justify-content: center;
          align-items: flex-end;
          gap: 30px;
          margin-bottom: 50px;
          padding: 0 50px;
        }

        .podium-card {
          background: #ffffff;
          border-radius: 28px;
          border: 1px solid rgba(241, 235, 217, 0.35);
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 24px;
          position: relative;
        }

        /* Podium Ranks sizes */
        .podium-card.first {
          width: 250px;
          min-height: 310px;
          border-color: rgba(249, 200, 81, 0.4);
          z-index: 2;
          box-shadow: var(--shadow-md);
        }

        .podium-card.second {
          width: 220px;
          min-height: 260px;
          z-index: 1;
        }

        .podium-card.third {
          width: 220px;
          min-height: 240px;
          z-index: 1;
        }

        /* Ribbon Medals */
        .podium-hanging-medal {
          position: absolute;
          top: -20px;
          font-size: 2.2rem;
          color: #f59e0b;
          animation: swing 3s infinite ease-in-out;
        }

        @keyframes swing {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }

        .avatar-podium-wrapper {
          position: relative;
          width: 90px;
          height: 90px;
          margin-bottom: 15px;
        }

        .podium-card.first .avatar-podium-wrapper {
          width: 110px;
          height: 110px;
        }

        .avatar-podium-img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          overflow: hidden;
          border: 3px solid #ffffff;
          box-shadow: 0 4px 15px rgba(0,0,0,0.06);
        }

        .avatar-podium-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* Laurel/Crown badges overlay */
        .medal-badge-overlay {
          position: absolute;
          top: 0;
          right: 0;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .medal-badge-overlay.gold { background: #f9c851; color: #78350f; }
        .medal-badge-overlay.silver { background: #cbd5e1; color: #475569; }
        .medal-badge-overlay.bronze { background: #ca8a04; color: #ffffff; }

        .competitor-podium-name {
          font-size: 0.95rem;
          font-weight: 850;
          color: var(--primary-blue);
          margin: 0;
        }

        .podium-card.first .competitor-podium-name {
          font-size: 1.1rem;
        }

        .xp-score-pill {
          background: #fffbeb;
          color: #d97706;
          font-size: 0.8rem;
          font-weight: 900;
          padding: 6px 18px;
          border-radius: 20px;
          margin-top: 10px;
          border: 1px solid #fef3c7;
        }

        .weekly-champion-tag {
          background: #ecfdf5;
          color: #059669;
          font-size: 0.75rem;
          font-weight: 800;
          padding: 4px 12px;
          border-radius: 8px;
          margin-top: 15px;
        }

        /* Others competitors list (باقي المنافسين) */
        .competitors-list-section {
          background: #ffffff;
          border-radius: 28px;
          padding: 30px;
          border: 1px solid rgba(241, 235, 217, 0.4);
          box-shadow: var(--shadow-sm);
          max-width: 900px;
          margin: 0 auto;
        }

        .section-header-lbl {
          font-size: 1rem;
          font-weight: 800;
          color: #94a3b8;
          margin-bottom: 25px;
        }

        .competitors-list-flow {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .competitor-list-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 20px;
          border-radius: 20px;
          border: 1px solid #f8fafc;
        }

        .competitor-list-row:hover {
          background: #fafaf9;
          border-color: #cbd5e1;
        }

        .competitor-rank-and-name {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .rank-position-lbl {
          font-size: 1.15rem;
          font-weight: 900;
          color: #94a3b8;
          width: 30px;
        }

        .competitor-row-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          overflow: hidden;
          border: 1.5px solid #cbd5e1;
        }

        .competitor-row-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .competitor-row-name {
          font-size: 0.95rem;
          font-weight: 800;
          color: #334155;
        }

        .competitor-score-trend {
          display: flex;
          align-items: center;
          gap: 30px;
        }

        .competitor-trend-pill {
          font-size: 0.8rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 6px;
          width: 60px;
        }

        .competitor-trend-pill.green { color: #22c55e; }
        .competitor-trend-pill.red { color: #ef4444; }
        .competitor-trend-pill.grey { color: #94a3b8; }

        .competitor-row-xp-val {
          font-size: 0.95rem;
          font-weight: 900;
          color: #475569;
          width: 80px;
          text-align: left;
        }

        /* 🏆 Sticky User Rank Status Bar */
        .sticky-user-status-bar {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: #00458b;
          color: #ffffff;
          padding: 15px 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 10;
          box-shadow: 0 -8px 25px rgba(0, 69, 139, 0.15);
        }

        .sticky-user-left-btn {
          z-index: 1;
        }

        .btn-climb-rank {
          background: #f9c851;
          color: #4b3805;
          border: none;
          padding: 10px 24px;
          border-radius: 14px;
          font-weight: 900;
          font-size: 0.9rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 15px rgba(249, 200, 81, 0.25);
        }

        .btn-climb-rank:hover {
          background: #e5b23d;
          transform: scale(1.02);
        }

        .sticky-user-center-info {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .sticky-user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid #ffffff;
        }

        .sticky-user-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .sticky-user-rank-val {
          font-size: 1rem;
          font-weight: 800;
        }

        .sticky-user-right-score {
          font-size: 1.15rem;
          font-weight: 900;
          display: flex;
          align-items: center;
          gap: 8px;
          color: #f9c851;
        }

        .divider-sticky {
          width: 1px;
          height: 30px;
          background: rgba(255,255,255,0.15);
          margin: 0 20px;
        }

        /* 🌟 Interactive Rank Booster challenge modal */
        .challenge-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.75);
          backdrop-filter: blur(8px);
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .challenge-modal-card {
          background: #ffffff;
          width: 500px;
          border-radius: 28px;
          padding: 35px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.25);
          text-align: center;
          animation: zoomIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes zoomIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .challenge-title-row {
          font-size: 1.3rem;
          font-weight: 900;
          color: var(--primary-blue);
          margin-bottom: 10px;
        }

        .challenge-desc-lbl {
          font-size: 0.85rem;
          color: #64748b;
          margin-bottom: 25px;
          font-weight: 600;
        }

        .challenge-progress-dots {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-bottom: 25px;
        }

        .challenge-dot-step {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #cbd5e1;
        }

        .challenge-dot-step.active {
          background: var(--primary-blue);
          width: 20px;
          border-radius: 4px;
        }

        .challenge-dot-step.completed {
          background: #22c55e;
        }

        .question-box-card {
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          border-radius: 20px;
          padding: 24px;
          margin-bottom: 25px;
        }

        .question-title-lbl {
          font-size: 1.05rem;
          font-weight: 900;
          color: #1e293b;
        }

        .quiz-options-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .quiz-option-btn {
          width: 100%;
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          border-radius: 14px;
          padding: 12px 20px;
          text-align: right;
          font-family: inherit;
          font-size: 0.85rem;
          font-weight: 700;
          color: #475569;
          cursor: pointer;
        }

        .quiz-option-btn:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
        }

        .quiz-option-btn.selected {
          border-color: var(--primary-blue);
          background: #eff6ff;
          color: var(--primary-blue);
        }

        .quiz-option-btn.correct {
          border-color: #22c55e;
          background: #ecfdf5;
          color: #15803d;
        }

        /* Success animation card */
        .celebration-panel {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px 0;
        }

        .celebrate-icon-box {
          font-size: 4rem;
          color: #f9c851;
          animation: popCelebrate 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
        }

        @keyframes popCelebrate {
          0% { transform: scale(0); }
          100% { transform: scale(1); }
        }

        .celebrate-title {
          font-size: 1.5rem;
          font-weight: 900;
          color: #15803d;
          margin: 15px 0 10px 0;
        }

        .btn-modal-close-final {
          background: var(--primary-blue);
          color: #ffffff;
          border: none;
          padding: 12px 40px;
          border-radius: 14px;
          font-weight: 800;
          font-size: 0.9rem;
          cursor: pointer;
          margin-top: 20px;
        }

        @media (max-width: 1024px) {
          .podium-container {
            flex-direction: column;
            align-items: center;
            gap: 20px;
          }
          .podium-card {
            width: 100% !important;
            min-height: auto !important;
          }
          .leaderboard-filters-header {
            flex-direction: column;
            gap: 20px;
          }
        }
      `}</style>

      {/* Right Sidebar Section */}
      <aside className="sidebar">
        <div className="sidebar-brand-header">
          <h1 className="sidebar-brand-title">لوحة التحكم</h1>
          <span className="sidebar-brand-subtitle">طريقك نحو الإتقان</span>
        </div>

        <ul className="nav-list">
          <li className="nav-item-wrapper" onClick={() => alert("التوجه لاكتشف")}>
            <div className="nav-link">
              <i className="fa-solid fa-compass"></i>
              <span>اكتشف</span>
            </div>
          </li>
          <li className="nav-item-wrapper" onClick={() => alert("التوجه لرحلتي التعليمية")}>
            <div className="nav-link">
              <i className="fa-solid fa-book-open"></i>
              <span>رحلتي التعليمية</span>
            </div>
          </li>
          <li className="nav-item-wrapper">
            <div className={`nav-link ${activeTab === "لوحة الصدارة" ? "active" : ""}`}>
              <i className="fa-solid fa-trophy"></i>
              <span>لوحة الصدارة</span>
            </div>
          </li>
          <li className="nav-item-wrapper" onClick={() => alert("التوجه لممارسة التحدث")}>
            <div className="nav-link">
              <i className="fa-solid fa-headset"></i>
              <span>ممارسة التحدث</span>
            </div>
          </li>
          <li className="nav-item-wrapper" onClick={() => alert("التوجه للصالونات الصوتية")}>
            <div className="nav-link">
              <i className="fa-solid fa-microphone"></i>
              <span>الصالونات الصوتية</span>
            </div>
          </li>
          <li className="nav-item-wrapper" onClick={() => alert("التوجه لإنجازاتي")}>
            <div className="nav-link">
              <i className="fa-solid fa-award"></i>
              <span>إنجازاتي</span>
            </div>
          </li>
          <li className="nav-item-wrapper" onClick={() => alert("التوجه للملف الشخصي")}>
            <div className="nav-link">
              <i className="fa-regular fa-user"></i>
              <span>الملف الشخصي</span>
            </div>
          </li>
          <li className="nav-item-wrapper" onClick={() => alert("التوجه للشات")}>
            <div className="nav-link">
              <i className="fa-regular fa-comments"></i>
              <span>الشات</span>
            </div>
          </li>
        </ul>
      </aside>

      {/* Main Wrapper */}
      <main className="main-wrapper">
        {/* Topbar */}
        <header className="topbar">
          <div className="topbar-right-logo">
            <h2 className="brand-logo-text">لغتي التعليمية</h2>
            <div className="topbar-nav-tabs">
              <span className="topbar-tab-link" onClick={() => alert("التوجه للرئيسية")}>
                الرئيسية
              </span>
              <span className="topbar-tab-link" onClick={() => alert("التوجه للمسارات")}>
                المسارات
              </span>
              <span className="topbar-tab-link active">لوحة الصدارة</span>
            </div>
          </div>

          <div className="topbar-left-profile">
            <div className="student-profile-avatar" onClick={() => alert("الملف الشخصي")}>
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80"
                alt="Ahmed Profile"
              />
            </div>
            <div className="topbar-icons">
              <i className="fa-solid fa-gear" onClick={() => alert("الإعدادات العامة")}></i>
              <i className="fa-regular fa-bell" style={{ marginRight: "10px" }} onClick={() => alert("عرض التنبيهات")}></i>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="content-area">
          {/* Filters header bar */}
          <section className="leaderboard-filters-header">
            {/* Paths selector Pills */}
            <div className="path-pills-row">
              {["مسار التيفيناغ", "مسار الإنجليزية", "مسار الفرنسية"].map((path) => (
                <button
                  key={path}
                  className={`path-pill-btn ${selectedPath === path ? "active" : ""}`}
                  onClick={() => setSelectedPath(path)}
                >
                  {path}
                </button>
              ))}
            </div>

            {/* Time filters & Flower ornament */}
            <div className="left-time-filters">
              <select
                className="dropdown-select-time"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <option value="أسبوعي">أسبوعي</option>
                <option value="شهري">شهري</option>
                <option value="سنوي">سنوي</option>
              </select>

              {/* Decorative Flower icon */}
              <div className="grey-flower-decor">
                <i className="fa-solid fa-spa"></i>
              </div>
            </div>
          </section>

          {/* Section 2: Top 3 Podium Winners list */}
          <section className="podium-container">
            {/* 2nd Place Winner (Right side) */}
            <div className="podium-card second">
              <div className="medal-badge-overlay silver">
                <i className="fa-solid fa-medal"></i>
              </div>
              <div className="avatar-podium-wrapper">
                <div className="avatar-podium-img">
                  <img src={activeData.podium.second.avatar} alt="2nd place" />
                </div>
              </div>
              <h4 className="competitor-podium-name">{activeData.podium.second.name}</h4>
              <span className="xp-score-pill">{activeData.podium.second.xp} XP</span>
            </div>

            {/* 1st Place Winner (Center - Tallest) */}
            <div className="podium-card first">
              {/* Hanging golden medal ribbon */}
              <div className="podium-hanging-medal">
                <i className="fa-solid fa-ribbon"></i>
              </div>
              <div className="avatar-podium-wrapper">
                <div className="avatar-podium-img" style={{ border: "4px solid #f9c851" }}>
                  <img src={activeData.podium.first.avatar} alt="1st place" />
                </div>
                <div className="medal-badge-overlay gold">
                  <i className="fa-solid fa-crown"></i>
                </div>
              </div>
              <h3 className="competitor-podium-name">{activeData.podium.first.name}</h3>
              <span className="xp-score-pill" style={{ background: "#fef3c7" }}>
                {activeData.podium.first.xp} XP
              </span>
              <span className="weekly-champion-tag">بطل الأسبوع</span>
            </div>

            {/* 3rd Place Winner (Left side) */}
            <div className="podium-card third">
              <div className="medal-badge-overlay bronze">
                <i className="fa-solid fa-award"></i>
              </div>
              <div className="avatar-podium-wrapper">
                <div className="avatar-podium-img">
                  <img src={activeData.podium.third.avatar} alt="3rd place" />
                </div>
              </div>
              <h4 className="competitor-podium-name">{activeData.podium.third.name}</h4>
              <span className="xp-score-pill">{activeData.podium.third.xp} XP</span>
            </div>
          </section>

          {/* Section 3: Other Competitors list (باقي المنافسين) */}
          <section className="competitors-list-section">
            <span className="section-header-lbl">باقي المنافسين</span>

            <div className="competitors-list-flow">
              {activeData.list.map((competitor) => (
                <div className="competitor-list-row" key={competitor.rank}>
                  <div className="competitor-rank-and-name">
                    <span className="rank-position-lbl">#{competitor.rank}</span>
                    <div className="competitor-row-avatar">
                      <img src={competitor.avatar} alt={competitor.name} />
                    </div>
                    <span className="competitor-row-name">{competitor.name}</span>
                  </div>

                  <div className="competitor-score-trend">
                    <span className={`competitor-trend-pill ${competitor.trendClass}`}>
                      {competitor.trend === "0" ? (
                        <i className="fa-solid fa-minus"></i>
                      ) : competitor.trendClass === "green" ? (
                        <i className="fa-solid fa-circle-chevron-up"></i>
                      ) : (
                        <i className="fa-solid fa-circle-chevron-down"></i>
                      )}
                      <span>{competitor.trend}</span>
                    </span>
                    <span className="competitor-row-xp-val">{competitor.xp} XP</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* 🏆 Sticky User Current Status Bar */}
      <footer className="sticky-user-status-bar">
        <div className="sticky-user-left-btn">
          <button className="btn-climb-rank" onClick={() => setShowChallengeModal(true)}>
            <span>انطلق للمركز التالي</span>
            <i className="fa-solid fa-bolt"></i>
          </button>
        </div>

        <div className="sticky-user-center-info">
          <div className="sticky-user-avatar">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80"
              alt=" Ahmed Bennani Avatar"
            />
          </div>
          <span className="sticky-user-rank-val">ترتيبك الحالي: #{userRank}</span>
        </div>

        <div className="sticky-user-right-score">
          <i className="fa-solid fa-star"></i>
          <span>نقاطك: {userXP} XP</span>
        </div>
      </footer>

      {/* 🌟 Interactive challenge quiz modal (WOW feature) */}
      {showChallengeModal && (
        <div className="challenge-modal-overlay">
          <div className="challenge-modal-card">
            {!showSuccessScreen ? (
              <>
                <h3 className="challenge-title-row">
                  <i className="fa-solid fa-bolt" style={{ color: "#f9c851", marginLeft: "10px" }}></i>
                  تحدي الارتقاء بالترتيب!
                </h3>
                <p className="challenge-desc-lbl">
                  أجب عن 3 أسئلة صحيحة متتالية لكسب **+150 XP** والارتقاء إلى المركز #35!
                </p>

                {/* Progress Indicators */}
                <div className="challenge-progress-dots">
                  {quizQuestions.map((_, idx) => (
                    <div
                      key={idx}
                      className={`challenge-dot-step ${
                        idx === currentQuestionIdx
                          ? "active"
                          : idx < currentQuestionIdx
                          ? "completed"
                          : ""
                      }`}
                    ></div>
                  ))}
                </div>

                {/* Active Question Box */}
                <div className="question-box-card">
                  <h4 className="question-title-lbl" style={{ marginBottom: "20px" }}>
                    {quizQuestions[currentQuestionIdx].q}
                  </h4>

                  <div className="quiz-options-list">
                    {quizQuestions[currentQuestionIdx].options.map((opt, oIdx) => (
                      <button
                        key={oIdx}
                        className={`quiz-option-btn ${
                          selectedAnswer === oIdx
                            ? oIdx === quizQuestions[currentQuestionIdx].correctIdx
                              ? "correct"
                              : "selected"
                            : ""
                        }`}
                        onClick={() => handleAnswerSubmit(oIdx)}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  className="btn-cancel"
                  style={{ width: "100%", padding: "12px" }}
                  onClick={() => {
                    setShowChallengeModal(false);
                    setCurrentQuestionIdx(0);
                    setSelectedAnswer(null);
                  }}
                >
                  انسحاب
                </button>
              </>
            ) : (
              <div className="celebration-panel">
                <div className="celebrate-icon-box">
                  <i className="fa-solid fa-trophy"></i>
                </div>
                <h3 className="celebrate-title">عمل رائع ومتميز! 🌟</h3>
                <p className="challenge-desc-lbl" style={{ margin: "10px 0 20px" }}>
                  لقد حصلت على **+150 XP** وارتفع ترتيبك بنجاح من **#42** إلى **#35** في لوحة الصدارة!
                </p>

                <button
                  className="btn-modal-close-final"
                  onClick={() => {
                    setShowChallengeModal(false);
                    setShowSuccessScreen(false);
                    setCurrentQuestionIdx(0);
                    setSelectedAnswer(null);
                  }}
                >
                  رائع! العودة للمنافسة
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
