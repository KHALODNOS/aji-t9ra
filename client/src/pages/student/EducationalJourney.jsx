import React, { useState } from "react";

const EducationalJourney = ({ onBack, onLogout }) => {
  // State for search and interactions
  const [searchText, setSearchText] = useState("");
  const [favorites, setFavorites] = useState({ Itri: true }); // Heart toggle state
  const [activeTab, setActiveTab] = useState("الرئيسية");
  const [showNotification, setShowNotification] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [playingWord, setPlayingWord] = useState(null); // Audio click animation state
  const [activeStory, setActiveStory] = useState(null); // Modal state for resuming/taking tests

  // Vocabulary bank dummy data
  const wordBank = [
    { id: "aman", word: "Aman", tifinagh: "ⴰⵎⴰⵏ", arabic: "الماء" },
    { id: "aghrum", word: "Aghrum", tifinagh: "ⴰⵖⵔⵓⵎ", arabic: "الخبز" },
    { id: "itri", word: "Itri", tifinagh: "ⵉⵜⵔⵉ", arabic: "النجم" },
    { id: "tafukt", word: "Tafukt", tifinagh: "ⵜⴰଫⵓⴽⵜ", arabic: "الشمس" },
    { id: "asif", word: "Asif", tifinagh: "ⴰⵙⵉⴼ", arabic: "النهر" }
  ];

  // Badges dummy data
  const badges = [
    { id: 1, title: "بطل التيفيناغ", icon: "fa-award", type: "gold", active: true, desc: "منح لإتقان الحروف الأمازيغية وقراءة 5 نصوص تيفيناغ" },
    { id: 2, title: "قارئ متميز", icon: "fa-book-open", type: "blue", active: true, desc: "منح لقراءة 10 قصص كاملة بانتظام" },
    { id: 3, title: "خبير اللسانيات", icon: "fa-trophy", type: "brown", active: true, desc: "منح لحفظ أكثر من 100 كلمة في بنك الكلمات" },
    { id: 4, title: "كاتب القصص", icon: "fa-lock", type: "locked", active: false, desc: "يقفل حتى تقوم بتأليف أول قصة خاصة بك" },
    { id: 5, title: "المتحدث اللبق", icon: "fa-lock", type: "locked", active: false, desc: "يقفل حتى تشارك في 3 صالونات صوتية تفاعلية" }
  ];

  // Handle playing word audio mock
  const playAudio = (wordName) => {
    setPlayingWord(wordName);
    setTimeout(() => setPlayingWord(null), 1000);
  };

  // Toggle favorite words
  const toggleFavorite = (wordName) => {
    setFavorites(prev => ({
      ...prev,
      [wordName]: !prev[wordName]
    }));
  };

  return (
    <div className="journey-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css');

        :root {
          --bg-light: #f7f9fc; /* Clean modern slate background */
          --sidebar-bg: #ffffff;
          --primary-blue: #00458b; /* Deep Brand Blue */
          --primary-blue-dark: #002d5c;
          --primary-yellow: #f9c851; /* Vibrant Gold/Yellow */
          --primary-yellow-hover: #e5b23d;
          --text-main: #1d1d1d;
          --text-muted: #8a98a5;
          --shadow-sm: 0 4px 12px rgba(0, 0, 0, 0.02);
          --shadow-md: 0 10px 25px rgba(0, 0, 0, 0.04);
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

        .journey-container {
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
          border-left: 1px solid #f1f4f8;
          display: flex;
          flex-direction: column;
          padding: 30px 0;
          flex-shrink: 0;
          box-shadow: -4px 0 20px rgba(0, 0, 0, 0.01);
        }

        .brand-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 35px;
          padding: 0 20px;
        }

        .brand-title {
          font-size: 1.8rem;
          font-weight: 900;
          color: var(--primary-blue);
          margin: 0;
          letter-spacing: -0.5px;
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
          padding: 13px 20px;
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

        /* Add Content Button */
        .sidebar-action-container {
          padding: 0 20px;
          margin-bottom: 20px;
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

        /* Sidebar Profile Card */
        .sidebar-bottom {
          padding: 20px 20px 0;
          border-top: 1px solid #f1f4f8;
        }

        .profile-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          margin-bottom: 12px;
        }

        .profile-img-container {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid #e2e8f0;
          flex-shrink: 0;
        }

        .profile-img-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .profile-info {
          display: flex;
          flex-direction: column;
        }

        .profile-name {
          font-size: 0.95rem;
          font-weight: 800;
          color: var(--text-main);
        }

        .profile-role {
          font-size: 0.75rem;
          color: #64748b;
          font-weight: 600;
          margin-top: 2px;
        }

        .logout-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: #64748b;
          font-weight: 700;
          font-size: 0.85rem;
          cursor: pointer;
          padding: 10px;
          border-radius: 12px;
        }

        .logout-btn:hover {
          background: #fef2f2;
          color: #ef4444;
        }

        /* Main Wrapper */
        .main-wrapper {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          height: 100vh;
        }

        /* Topbar styling */
        .topbar {
          padding: 30px 40px 15px 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .page-brand-title {
          font-size: 1.8rem;
          font-weight: 900;
          color: var(--primary-blue);
          margin: 0;
        }

        .topbar-controls {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        /* Search input wrapper */
        .search-wrapper {
          position: relative;
          width: 320px;
        }

        .search-icon-inside {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          font-size: 0.95rem;
        }

        .search-input {
          width: 100%;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          border-radius: 16px;
          padding: 11px 15px 11px 40px;
          font-family: inherit;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-main);
          outline: none;
        }

        .search-input::placeholder {
          color: #94a3b8;
        }

        .search-input:focus {
          border-color: var(--primary-blue);
          box-shadow: 0 0 0 3px rgba(0, 69, 139, 0.1);
        }

        /* Action Icons */
        .topbar-icon-btn {
          width: 44px;
          height: 44px;
          border-radius: 14px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 1.1rem;
          position: relative;
        }

        .topbar-icon-btn:hover {
          color: var(--primary-blue);
          background: #f8fafc;
          border-color: #cbd5e1;
        }

        .dot-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #ef4444;
        }

        /* Main Content Container */
        .content-area {
          padding: 10px 40px 40px;
        }

        /* Stats Grid (ملخص التقدم) */
        .stats-section {
          margin-bottom: 35px;
        }

        .section-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: #1e293b;
          margin: 0 0 20px 0;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 25px;
        }

        .stat-card {
          background: #ffffff;
          border-radius: 24px;
          padding: 24px;
          border: 1px solid #e2e8f0;
          box-shadow: var(--shadow-sm);
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          overflow: hidden;
        }

        .stat-card:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-md);
        }

        .stat-content {
          display: flex;
          flex-direction: column;
        }

        .stat-label {
          font-size: 0.85rem;
          color: #64748b;
          font-weight: 700;
          margin-bottom: 5px;
        }

        .stat-value {
          font-size: 1.8rem;
          font-weight: 900;
          color: var(--primary-blue);
        }

        .stat-icon-wrapper {
          width: 56px;
          height: 56px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.4rem;
        }

        .stat-icon-wrapper.blue {
          background: #e0f2fe;
          color: #0284c7;
        }

        .stat-icon-wrapper.yellow {
          background: #fef3c7;
          color: #d97706;
        }

        /* Top Tag inside hours stat card */
        .stat-top-tag {
          position: absolute;
          top: 12px;
          right: 20px;
          font-size: 0.65rem;
          font-weight: 700;
          color: #94a3b8;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        /* SVG Circular Progress Gauge */
        .circular-progress-wrapper {
          position: relative;
          width: 60px;
          height: 60px;
        }

        .circular-progress-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 0.8rem;
          font-weight: 800;
          color: var(--primary-blue);
        }

        /* Continue Reading (تابع القراءة) */
        .continue-section {
          margin-bottom: 35px;
        }

        .continue-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 25px;
        }

        .continue-card {
          background: #ffffff;
          border-radius: 24px;
          padding: 20px;
          border: 1px solid #e2e8f0;
          box-shadow: var(--shadow-sm);
          display: flex;
          gap: 20px;
          align-items: center;
        }

        .continue-card:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-md);
        }

        .continue-img {
          width: 140px;
          height: 100px;
          border-radius: 16px;
          object-fit: cover;
          flex-shrink: 0;
        }

        .continue-body {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }

        .continue-title {
          font-size: 1rem;
          font-weight: 800;
          color: #1e293b;
          margin: 0 0 4px 0;
        }

        .continue-level {
          font-size: 0.75rem;
          color: #64748b;
          font-weight: 700;
          margin-bottom: 12px;
        }

        .progress-bar-container {
          width: 100%;
          height: 8px;
          background: #f1f5f9;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 6px;
        }

        .progress-bar-fill {
          height: 100%;
          background: #3b82f6;
          border-radius: 4px;
        }

        .progress-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .progress-percent {
          font-size: 0.7rem;
          color: #64748b;
          font-weight: 700;
        }

        .btn-continue {
          background: var(--primary-blue);
          color: #ffffff;
          border: none;
          padding: 6px 16px;
          border-radius: 10px;
          font-weight: 800;
          font-size: 0.75rem;
          cursor: pointer;
        }

        .btn-continue:hover {
          background: var(--primary-blue-dark);
        }

        /* Word Bank (بنك الكلمات) */
        .words-section {
          margin-bottom: 35px;
        }

        .words-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 18px;
        }

        .view-all-link {
          font-size: 0.85rem;
          font-weight: 700;
          color: #0ea5e9;
          text-decoration: none;
          cursor: pointer;
        }

        .view-all-link:hover {
          text-decoration: underline;
        }

        .words-row {
          display: flex;
          gap: 15px;
          overflow-x: auto;
          padding-bottom: 10px;
          scrollbar-width: thin;
        }

        .word-card {
          min-width: 160px;
          background: #f4f8fd;
          border: 1px solid #e0ecf8;
          border-radius: 20px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }

        .word-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(15, 61, 107, 0.05);
          background: #ebf3fc;
        }

        .word-speaker-btn {
          position: absolute;
          right: 12px;
          top: 12px;
          background: transparent;
          border: none;
          color: var(--primary-blue);
          font-size: 0.85rem;
          cursor: pointer;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .word-speaker-btn:hover {
          background: rgba(0, 69, 139, 0.08);
        }

        .word-fav-btn {
          position: absolute;
          left: 12px;
          top: 12px;
          background: transparent;
          border: none;
          color: #cbd5e1;
          font-size: 0.85rem;
          cursor: pointer;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .word-fav-btn:hover {
          background: rgba(239, 68, 68, 0.08);
          color: #fca5a5;
        }

        .word-fav-btn.active {
          color: #ef4444;
        }

        .word-phonetic {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--primary-blue);
          margin-top: 10px;
        }

        .word-tifinagh {
          font-size: 0.75rem;
          color: #64748b;
          margin: 4px 0;
          font-weight: 700;
          letter-spacing: 1px;
        }

        .word-translation {
          font-size: 0.85rem;
          color: #475569;
          font-weight: 700;
        }

        /* Sound Playing Animation Wave */
        .audio-wave {
          display: flex;
          gap: 2px;
          align-items: center;
          height: 12px;
          margin-top: 5px;
        }

        .audio-bar {
          width: 2px;
          height: 100%;
          background: var(--primary-blue);
          animation: bounce 0.6s infinite alternate;
        }

        .audio-bar:nth-child(2) { animation-delay: 0.15s; }
        .audio-bar:nth-child(3) { animation-delay: 0.3s; }

        @keyframes bounce {
          from { height: 3px; }
          to { height: 12px; }
        }

        /* Achieved Badges (الأوسمة المحققة) */
        .badges-section {
          margin-bottom: 35px;
        }

        .badges-row {
          display: flex;
          gap: 30px;
          justify-content: space-around;
          background: #ffffff;
          padding: 25px;
          border-radius: 24px;
          border: 1px solid #e2e8f0;
          box-shadow: var(--shadow-sm);
        }

        .badge-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          position: relative;
        }

        .badge-circle {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.6rem;
          margin-bottom: 10px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.05);
          position: relative;
        }

        /* Badge Custom Types */
        .badge-circle.gold {
          background: #fef3c7;
          color: #ca8a04;
          border: 2px solid #fde68a;
        }

        .badge-circle.blue {
          background: #e0f2fe;
          color: #0284c7;
          border: 2px solid #bae6fd;
        }

        .badge-circle.brown {
          background: #ffedd5;
          color: #a855f7;
          border: 2px solid #f5d0fe;
        }

        .badge-circle.locked {
          background: #f1f5f9;
          color: #94a3b8;
          border: 2px solid #e2e8f0;
          opacity: 0.5;
        }

        .badge-name {
          font-size: 0.85rem;
          font-weight: 800;
          color: #334155;
        }

        .badge-item.locked .badge-name {
          color: #94a3b8;
        }

        /* Tooltip style */
        .badge-tooltip {
          position: absolute;
          bottom: 85px;
          background: #1e293b;
          color: #ffffff;
          font-size: 0.75rem;
          padding: 8px 12px;
          border-radius: 10px;
          width: 160px;
          text-align: center;
          z-index: 10;
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
          line-height: 1.4;
          font-weight: 600;
        }

        .badge-tooltip::after {
          content: "";
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border-width: 6px;
          border-style: solid;
          border-color: #1e293b transparent transparent transparent;
        }

        /* Completed Library (المكتبة المكتملة) */
        .completed-section {
          margin-bottom: 20px;
        }

        .completed-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 25px;
        }

        .completed-card {
          background: #ffffff;
          border-radius: 24px;
          padding: 20px;
          border: 1px solid #e2e8f0;
          box-shadow: var(--shadow-sm);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .completed-card:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-md);
        }

        .completed-left {
          display: flex;
          flex-direction: column;
        }

        .completed-title {
          font-size: 1.15rem;
          font-weight: 900;
          color: var(--primary-blue);
          margin: 0 0 5px 0;
        }

        .completed-date {
          font-size: 0.75rem;
          color: #64748b;
          font-weight: 700;
          margin-bottom: 15px;
        }

        .completed-actions {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .link-re-read {
          font-size: 0.8rem;
          font-weight: 800;
          color: #3b82f6;
          text-decoration: none;
          cursor: pointer;
        }

        .link-re-read:hover {
          text-decoration: underline;
        }

        .btn-take-test {
          background: var(--primary-yellow);
          color: #4b3805;
          border: none;
          padding: 8px 16px;
          border-radius: 12px;
          font-weight: 800;
          font-size: 0.8rem;
          cursor: pointer;
          box-shadow: 0 3px 8px rgba(249, 200, 81, 0.2);
        }

        .btn-take-test:hover {
          background: var(--primary-yellow-hover);
        }

        .completed-img-wrapper {
          position: relative;
          width: 90px;
          height: 90px;
          border-radius: 18px;
          overflow: hidden;
          flex-shrink: 0;
        }

        .completed-img-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .check-badge {
          position: absolute;
          top: 6px;
          right: 6px;
          width: 22px;
          height: 22px;
          background: #22c55e;
          color: #ffffff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.65rem;
          border: 1.5px solid #ffffff;
        }

        /* Popups / Custom Toasts style */
        .toast-popup {
          position: fixed;
          bottom: 30px;
          right: 30px;
          background: #1e293b;
          color: #ffffff;
          padding: 15px 25px;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
          z-index: 100;
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 700;
          font-size: 0.85rem;
          animation: toastAppear 0.3s ease;
        }

        @keyframes toastAppear {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .toast-popup i {
          color: var(--primary-yellow);
        }

        /* Story Modal simulator */
        .story-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.6);
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(4px);
        }

        .story-modal-card {
          background: #ffffff;
          width: 480px;
          border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 15px 40px rgba(0,0,0,0.15);
          text-align: center;
        }

        .modal-header-img {
          height: 180px;
          position: relative;
        }

        .modal-header-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .modal-close-btn {
          position: absolute;
          top: 15px;
          left: 15px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #ffffff;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.95rem;
        }

        .modal-body {
          padding: 25px 30px;
        }

        .modal-title {
          font-size: 1.3rem;
          font-weight: 900;
          color: var(--primary-blue);
          margin: 0 0 10px 0;
        }

        .modal-text {
          font-size: 0.9rem;
          color: #64748b;
          line-height: 1.6;
          margin: 0 0 20px 0;
        }

        .btn-modal-action {
          width: 100%;
          background: var(--primary-blue);
          color: #ffffff;
          border: none;
          padding: 12px;
          border-radius: 14px;
          font-weight: 800;
          font-size: 0.9rem;
          cursor: pointer;
        }

        .btn-modal-action:hover {
          background: var(--primary-blue-dark);
        }

        @media (max-width: 1024px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
          .continue-grid {
            grid-template-columns: 1fr;
          }
          .completed-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* Right Sidebar Section */}
      <aside className="sidebar">
        <div className="brand-header">
          <h1 className="brand-title">أجي تقرا</h1>
        </div>

        <ul className="nav-list">
          <li className="nav-item-wrapper" onClick={() => setActiveTab("الرئيسية")}>
            <div className={`nav-link ${activeTab === "الرئيسية" ? "active" : ""}`}>
              <i className="fa-solid fa-house"></i>
              <span>الرئيسية</span>
            </div>
          </li>
          <li className="nav-item-wrapper" onClick={() => setActiveTab("مؤلف القصص")}>
            <div className={`nav-link ${activeTab === "مؤلف القصص" ? "active" : ""}`}>
              <i className="fa-solid fa-pen-nib"></i>
              <span>مؤلف القصص</span>
            </div>
          </li>
          <li className="nav-item-wrapper" onClick={() => setActiveTab("إعدادات الـ AI")}>
            <div className={`nav-link ${activeTab === "إعدادات الـ AI" ? "active" : ""}`}>
              <i className="fa-solid fa-robot"></i>
              <span>إعدادات الـ AI</span>
            </div>
          </li>
          <li className="nav-item-wrapper" onClick={() => setActiveTab("الاختبارات")}>
            <div className={`nav-link ${activeTab === "الاختبارات" ? "active" : ""}`}>
              <i className="fa-solid fa-vial"></i>
              <span>الاختبارات</span>
            </div>
          </li>
          <li className="nav-item-wrapper" onClick={() => setActiveTab("الصالونات الصوتية")}>
            <div className={`nav-link ${activeTab === "الصالونات الصوتية" ? "active" : ""}`}>
              <i className="fa-solid fa-microphone"></i>
              <span>الصالونات الصوتية</span>
            </div>
          </li>
          <li className="nav-item-wrapper" onClick={() => setActiveTab("متابعة الطلاب")}>
            <div className={`nav-link ${activeTab === "متابعة الطلاب" ? "active" : ""}`}>
              <i className="fa-solid fa-users"></i>
              <span>متابعة الطلاب</span>
            </div>
          </li>
        </ul>

        {/* Action Button */}
        <div className="sidebar-action-container">
          <button className="action-add-btn" onClick={() => alert("إضافة محتوى تعليمي جديد")}>
            <i className="fa-solid fa-circle-plus"></i>
            <span>إضافة محتوى</span>
          </button>
        </div>

        {/* Bottom Profile Details */}
        <div className="sidebar-bottom">
          <div className="profile-card">
            <div className="profile-img-container">
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
                alt="Ahmed Profile"
              />
            </div>
            <div className="profile-info">
              <span className="profile-name">أحمد بن محمد</span>
              <span className="profile-role">مستوى متقدم</span>
            </div>
          </div>

          <div className="logout-btn" onClick={onLogout || onBack}>
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
            <span>تسجيل الخروج</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-wrapper">
        {/* Topbar */}
        <header className="topbar">
          <h2 className="page-brand-title">رحلتي التعليمية</h2>

          <div className="topbar-controls">
            {/* Search Input */}
            <div className="search-wrapper">
              <i className="fa-solid fa-magnifying-glass search-icon-inside"></i>
              <input
                type="text"
                className="search-input"
                placeholder="ابحث عن قصص..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>

            {/* Notification Control */}
            <div className="topbar-icon-btn" onClick={() => setShowNotification(true)}>
              <i className="fa-regular fa-bell"></i>
              <div className="dot-badge"></div>
            </div>

            {/* Settings Control */}
            <div className="topbar-icon-btn" onClick={() => setShowSettings(true)}>
              <i className="fa-solid fa-sliders"></i>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="content-area">
          {/* Section 1: Progress Summary (ملخص التقدم) */}
          <section className="stats-section">
            <h3 className="section-title">ملخص التقدم</h3>
            <div className="stats-grid">
              {/* Learning Hours */}
              <div className="stat-card">
                <span className="stat-top-tag">
                  <i className="fa-solid fa-cloud-arrow-up"></i>
                  <span>تحديث منذ 5 دقائق</span>
                </span>
                <div className="stat-content" style={{ marginTop: "10px" }}>
                  <span className="stat-label">ساعات التعلم</span>
                  <span className="stat-value">24 ساعة</span>
                </div>
                <div className="stat-icon-wrapper blue" style={{ marginTop: "10px" }}>
                  <i className="fa-regular fa-clock"></i>
                </div>
              </div>

              {/* New Words */}
              <div className="stat-card">
                <div className="stat-content">
                  <span className="stat-label">الكلمات الجديدة</span>
                  <span className="stat-value">150 كلمة</span>
                </div>
                <div className="stat-icon-wrapper yellow">
                  <i className="fa-solid fa-book"></i>
                </div>
              </div>

              {/* Completed Stories (75% circular progress) */}
              <div className="stat-card">
                <div className="stat-content">
                  <span className="stat-label">القصص المكتملة</span>
                  <span className="stat-value">12 قصص</span>
                </div>
                <div className="circular-progress-wrapper">
                  <svg width="60" height="60" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#f1f5f9"
                      strokeWidth="3.5"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#1e3a8a"
                      strokeWidth="3.5"
                      strokeDasharray="75, 100"
                    />
                  </svg>
                  <div className="circular-progress-text">75%</div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Continue Reading (تابع القراءة) */}
          <section className="continue-section">
            <h3 className="section-title">تابع القراءة</h3>
            <div className="continue-grid">
              {/* Forest Adventure */}
              <div className="continue-card">
                <img
                  src="https://images.unsplash.com/photo-1448375240586-882707db888b?w=300&auto=format&fit=crop&q=80"
                  alt="Forest Adventure"
                  className="continue-img"
                />
                <div className="continue-body">
                  <h4 className="continue-title">مغامرة في الغابة</h4>
                  <span className="continue-level">المستوى: متوسط</span>
                  <div className="progress-bar-container">
                    <div className="progress-bar-fill" style={{ width: "60%" }}></div>
                  </div>
                  <div className="progress-meta">
                    <span className="progress-percent">اكتملت بنسبة 60%</span>
                    <button
                      className="btn-continue"
                      onClick={() =>
                        setActiveStory({
                          title: "مغامرة في الغابة",
                          level: "متوسط",
                          progress: "60%",
                          img: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=300&auto=format&fit=crop&q=80"
                        })
                      }
                    >
                      استكمال
                    </button>
                  </div>
                </div>
              </div>

              {/* Ancient City Secrets */}
              <div className="continue-card">
                <img
                  src="https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=300&auto=format&fit=crop&q=80"
                  alt="Ancient City"
                  className="continue-img"
                />
                <div className="continue-body">
                  <h4 className="continue-title">أسرار المدينة القديمة</h4>
                  <span className="continue-level">المستوى: مبتدئ</span>
                  <div className="progress-bar-container">
                    <div className="progress-bar-fill" style={{ width: "30%" }}></div>
                  </div>
                  <div className="progress-meta">
                    <span className="progress-percent">اكتملت بنسبة 30%</span>
                    <button
                      className="btn-continue"
                      onClick={() =>
                        setActiveStory({
                          title: "أسرار المدينة القديمة",
                          level: "مبتدئ",
                          progress: "30%",
                          img: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=300&auto=format&fit=crop&q=80"
                        })
                      }
                    >
                      استكمال
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Word Bank (بنك الكلمات) */}
          <section className="words-section">
            <div className="words-header">
              <h3 className="section-title" style={{ margin: 0 }}>
                بنك الكلمات
              </h3>
              <span className="view-all-link" onClick={() => alert("فتح كامل بنك الكلمات")}>
                عرض الكل ←
              </span>
            </div>

            <div className="words-row">
              {wordBank.map((item) => (
                <div className="word-card" key={item.id}>
                  {/* Speaker action */}
                  <button
                    className="word-speaker-btn"
                    onClick={() => playAudio(item.word)}
                    title="استمع للنطق"
                  >
                    <i className="fa-solid fa-volume-high"></i>
                  </button>

                  {/* Favorite Toggle action */}
                  <button
                    className={`word-fav-btn ${favorites[item.word] ? "active" : ""}`}
                    onClick={() => toggleFavorite(item.word)}
                    title={favorites[item.word] ? "أزل من المفضلة" : "أضف للمفضلة"}
                  >
                    <i className="fa-solid fa-heart"></i>
                  </button>

                  <span className="word-phonetic">{item.word}</span>
                  <span className="word-tifinagh">{item.tifinagh}</span>
                  <span className="word-translation">{item.arabic}</span>

                  {/* Micro audio feedback simulation */}
                  {playingWord === item.word && (
                    <div className="audio-wave">
                      <div className="audio-bar"></div>
                      <div className="audio-bar"></div>
                      <div className="audio-bar"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Section 4: Achieved Badges (الأوسمة المحققة) */}
          <section className="badges-section">
            <h3 className="section-title">الأوسمة المحققة</h3>
            <div className="badges-row">
              {badges.map((badge) => {
                const [hovered, setHovered] = useState(false);
                return (
                  <div
                    className={`badge-item ${badge.active ? "" : "locked"}`}
                    key={badge.id}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                  >
                    <div className={`badge-circle ${badge.type}`}>
                      <i className={`fa-solid ${badge.icon}`}></i>
                    </div>
                    <span className="badge-name">{badge.title}</span>

                    {/* Tooltip Description */}
                    {hovered && <div className="badge-tooltip">{badge.desc}</div>}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Section 5: Completed Library (المكتبة المكتملة) */}
          <section className="completed-section">
            <h3 className="section-title">المكتبة المكتملة</h3>
            <div className="completed-grid">
              {/* Ancestors Tales */}
              <div className="completed-card">
                <div className="completed-left">
                  <h4 className="completed-title">حكايات الأجداد</h4>
                  <span className="completed-date">تم الإكمال في: 12 أكتوبر</span>
                  <div className="completed-actions">
                    <span className="link-re-read" onClick={() => alert("إعادة تحميل قصة حكايات الأجداد")}>
                      إعادة القراءة
                    </span>
                    <button className="btn-take-test" onClick={() => alert("بدء اختبار حكايات الأجداد")}>
                      إجراء اختبار
                    </button>
                  </div>
                </div>
                <div className="completed-img-wrapper">
                  <img
                    src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&auto=format&fit=crop&q=80"
                    alt="Ancestors Tales"
                  />
                  <div className="check-badge">
                    <i className="fa-solid fa-check"></i>
                  </div>
                </div>
              </div>

              {/* Desert Journey */}
              <div className="completed-card">
                <div className="completed-left">
                  <h4 className="completed-title">رحلة في الصحراء</h4>
                  <span className="completed-date">تم الإكمال في: 5 أكتوبر</span>
                  <div className="completed-actions">
                    <span className="link-re-read" onClick={() => alert("إعادة تحميل قصة رحلة في الصحراء")}>
                      إعادة القراءة
                    </span>
                    <button className="btn-take-test" onClick={() => alert("بدء اختبار رحلة في الصحراء")}>
                      إجراء اختبار
                    </button>
                  </div>
                </div>
                <div className="completed-img-wrapper">
                  <img
                    src="https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=300&auto=format&fit=crop&q=80"
                    alt="Desert Journey"
                  />
                  <div className="check-badge">
                    <i className="fa-solid fa-check"></i>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Interactive popups for Controls */}
      {showNotification && (
        <div className="toast-popup" onClick={() => setShowNotification(false)}>
          <i className="fa-solid fa-circle-info"></i>
          <span>لديك 3 تنبيهات جديدة! تم تحديث بنك الكلمات اليوم.</span>
        </div>
      )}

      {showSettings && (
        <div className="toast-popup" onClick={() => setShowSettings(false)}>
          <i className="fa-solid fa-circle-check"></i>
          <span>تم تحميل إعدادات رحلتك التعليمية بنجاح!</span>
        </div>
      )}

      {/* Resuming Modal Simulation */}
      {activeStory && (
        <div className="story-modal-overlay" onClick={() => setActiveStory(null)}>
          <div className="story-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-img">
              <img src={activeStory.img} alt={activeStory.title} />
              <button className="modal-close-btn" onClick={() => setActiveStory(null)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="modal-body">
              <h3 className="modal-title">{activeStory.title}</h3>
              <p className="modal-text">
                أنت مستعد لاستكمال القراءة من <strong>{activeStory.progress}</strong> بمستوى <strong>({activeStory.level})</strong>.
                استمر في تقدمك لتحصل على المزيد من الأوسمة والنقاط!
              </p>
              <button
                className="btn-modal-action"
                onClick={() => {
                  alert(`مرحباً بك مجدداً في "${activeStory.title}"!`);
                  setActiveStory(null);
                }}
              >
                استئناف الآن
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EducationalJourney;
