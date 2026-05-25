import React, { useState } from "react";

const AudioSalonsStudent = ({ onBack, onLogout }) => {
  // State management
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("الصالونات الصوتية");
  const [reminders, setReminders] = useState({}); // Track scheduled reminders
  const [activeSalonRoom, setActiveSalonRoom] = useState(null); // Active live room modal simulator
  const [isMuted, setIsMuted] = useState(false); // User mic state in room
  const [hasRaisedHand, setHasRaisedHand] = useState(false); // User raise hand state
  const [showScheduleModal, setShowScheduleModal] = useState(false); // Schedule form modal
  const [newSalonTitle, setNewSalonTitle] = useState("");

  // Live salons dummy data matching the screenshot
  const liveSalons = [
    {
      id: "grammar",
      title: "أساسيات الإعراب والنحو",
      langTag: "اللغة العربية",
      langClass: "arabic",
      broadClass: "live",
      broadText: "مباشر",
      host: "أ. يوسف إدريسي",
      role: "أستاذ لغة عربية",
      listeners: 22,
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
      listenerAvatars: [
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80"
      ]
    },
    {
      id: "proverbs",
      title: "أمثال وحكم شعبية",
      langTag: "الدارجة المغربية",
      langClass: "darija",
      broadClass: "live",
      broadText: "مباشر",
      host: "أ. ليلى العلمي",
      role: "متخصصة في التراث",
      listeners: 45,
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80",
      listenerAvatars: [
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
      ]
    },
    {
      id: "amazigh-culture",
      title: "نقاش حول الثقافة الأمازيغية",
      langTag: "تيفيناغ",
      langClass: "amazigh",
      broadClass: "global",
      broadText: "عالمي",
      host: "أ. كريم بناني",
      role: "خبير لسانيات",
      listeners: 118,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80",
      listenerAvatars: [
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80"
      ]
    }
  ];

  // Upcoming salons dummy data matching the screenshot
  const upcomingSalons = [
    {
      id: "fluent-3",
      title: "كيف تتحدث بطلاقة في 3 أشهر؟",
      tag: "جدول",
      time: "يبدأ بعد ساعتين",
      host: "أ. سفيان",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80"
    },
    {
      id: "diaspora-lit",
      title: "أدب المهجر: جبران خليل جبران",
      tag: "جدول",
      time: "غداً 10:00 مساءً",
      host: "د. منى حكيمي",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80"
    },
    {
      id: "free-poetry",
      title: "ورشة كتابة الشعر الحر",
      tag: "جدول",
      time: "الجمعة القادم",
      host: "أ. رشيد",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80"
    }
  ];

  // Toggle Reminder
  const toggleReminder = (id, title) => {
    setReminders(prev => {
      const active = !prev[id];
      if (active) {
        alert(`تم تفعيل التنبيه لصالون: "${title}"! سنرسل لك إشعاراً عند البدء.`);
      }
      return { ...prev, [id]: active };
    });
  };

  // Join Room Handler
  const joinRoom = (salon) => {
    setActiveSalonRoom(salon);
    setIsMuted(true);
    setHasRaisedHand(false);
  };

  // Schedule Salon handler
  const handleScheduleSalon = (e) => {
    e.preventDefault();
    if (!newSalonTitle.trim()) return;
    alert(`تم جدولة صالونك الصوتي بنجاح: "${newSalonTitle}"!`);
    setNewSalonTitle("");
    setShowScheduleModal(false);
  };

  // Filter salons by search text
  const filteredLive = liveSalons.filter(s =>
    s.title.toLowerCase().includes(searchText.toLowerCase()) ||
    s.host.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css');

        :root {
          --bg-light: #fcfcfa; /* Soft warm ivory background matching screenshot colors */
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

        .salons-container {
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

        /* Profile Bottom Card in Sidebar */
        .sidebar-bottom {
          padding: 20px 20px 0;
          border-top: 1px solid #f1f4f8;
        }

        .profile-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: #fafafa;
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
          color: #ef4444;
          font-weight: 700;
          font-size: 0.85rem;
          cursor: pointer;
          padding: 10px;
          border-radius: 12px;
        }

        .logout-btn:hover {
          background: #fef2f2;
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

        .topbar-left-controls {
          display: flex;
          align-items: center;
          gap: 25px;
        }

        .topbar-right-controls {
          display: flex;
          align-items: center;
          gap: 20px;
          font-size: 1.25rem;
          color: #64748b;
        }

        .topbar-right-controls i {
          cursor: pointer;
        }

        .topbar-right-controls i:hover {
          color: var(--primary-blue);
        }

        /* Live Indicator */
        .live-indicator-wrapper {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .live-title {
          font-size: 1.6rem;
          font-weight: 900;
          color: var(--primary-blue);
          margin: 0;
        }

        .live-tag-now {
          background: #ffe3e3;
          color: #ef4444;
          font-size: 0.75rem;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .live-tag-dot {
          width: 6px;
          height: 6px;
          background: #ef4444;
          border-radius: 50%;
          animation: flash 1s infinite alternate;
        }

        @keyframes flash {
          from { opacity: 0.3; }
          to { opacity: 1; }
        }

        /* Stats Badge Header */
        .topbar-stats-card {
          background: #ffffff;
          border: 1px solid #f1ebd9;
          border-radius: 16px;
          padding: 8px 16px;
          display: flex;
          gap: 20px;
          box-shadow: var(--shadow-sm);
        }

        .topbar-stat-sub {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .topbar-stat-lbl {
          font-size: 0.65rem;
          color: #94a3b8;
          font-weight: 700;
        }

        .topbar-stat-val {
          font-size: 0.95rem;
          font-weight: 900;
          color: var(--primary-blue);
          margin-top: 2px;
        }

        .stat-divider {
          width: 1px;
          background: #f1ebd9;
        }

        /* Search input wrapper */
        .search-wrapper {
          position: relative;
          width: 300px;
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
          padding: 10px 15px 10px 40px;
          font-family: inherit;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-main);
          outline: none;
        }

        .search-input:focus {
          border-color: var(--primary-blue);
        }

        /* Content Area container */
        .content-area {
          padding: 10px 40px 40px;
        }

        /* Featured Audio Salon Card (الصالون المميز) */
        .featured-salon-section {
          margin-bottom: 35px;
        }

        .featured-card {
          background: #ffffff;
          border-radius: 28px;
          padding: 30px;
          border: 1px solid rgba(241, 235, 217, 0.5);
          box-shadow: var(--shadow-md);
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          overflow: hidden;
        }

        .featured-card::before {
          content: "";
          position: absolute;
          top: -50px;
          left: -50px;
          width: 200px;
          height: 200px;
          background: rgba(0, 69, 139, 0.02);
          border-radius: 50%;
          z-index: 0;
        }

        .featured-card-left {
          display: flex;
          align-items: center;
          gap: 25px;
          z-index: 1;
        }

        .featured-avatar-globe {
          position: relative;
          width: 100px;
          height: 100px;
        }

        /* Globe pattern icon behind host avatar */
        .globe-pattern-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: #edf5fd;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(0, 69, 139, 0.08);
          font-size: 5rem;
          z-index: 0;
        }

        .featured-host-avatar {
          position: absolute;
          top: 10px;
          left: 10px;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          overflow: hidden;
          border: 3px solid #ffffff;
          box-shadow: 0 4px 15px rgba(0,0,0,0.06);
          z-index: 1;
        }

        .featured-host-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .featured-info {
          display: flex;
          flex-direction: column;
        }

        .featured-tag {
          background: #fef3c7;
          color: #ca8a04;
          font-size: 0.75rem;
          font-weight: 800;
          padding: 4px 12px;
          border-radius: 8px;
          width: fit-content;
          margin-bottom: 12px;
        }

        .featured-title {
          font-size: 1.7rem;
          font-weight: 900;
          color: var(--primary-blue);
          margin: 0 0 6px 0;
        }

        .featured-host-name {
          font-size: 0.95rem;
          color: #64748b;
          font-weight: 700;
          margin-bottom: 12px;
        }

        .featured-attendees {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          color: #94a3b8;
          font-weight: 700;
        }

        .featured-card-right {
          z-index: 1;
        }

        .btn-join-featured {
          background: var(--primary-blue);
          color: #ffffff;
          border: none;
          padding: 15px 35px;
          border-radius: 18px;
          font-weight: 900;
          font-size: 1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 6px 20px rgba(0, 69, 139, 0.15);
        }

        .btn-join-featured:hover {
          background: var(--primary-blue-dark);
          transform: translateY(-2px);
        }

        /* Explore Salons (استكشف الصالونات) */
        .explore-section {
          margin-bottom: 35px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .section-title {
          font-size: 1.25rem;
          font-weight: 950;
          color: #1e293b;
          margin: 0;
        }

        .view-all-link {
          font-size: 0.85rem;
          font-weight: 700;
          color: #3b82f6;
          text-decoration: none;
          cursor: pointer;
        }

        .view-all-link:hover {
          text-decoration: underline;
        }

        .explore-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 25px;
        }

        .salon-card {
          background: #ffffff;
          border-radius: 24px;
          padding: 22px;
          border: 1px solid rgba(241, 235, 217, 0.4);
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 220px;
        }

        .salon-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
        }

        .salon-top-tags {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .salon-lang-tag {
          font-size: 0.7rem;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 8px;
        }

        .salon-lang-tag.arabic { background: #eef2ff; color: #4f46e5; }
        .salon-lang-tag.darija { background: #fffbeb; color: #d97706; }
        .salon-lang-tag.amazigh { background: #ecfdf5; color: #059669; }

        .salon-status-tag {
          font-size: 0.7rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .salon-status-tag.live { color: #ef4444; }
        .salon-status-tag.global { color: #0284c7; }

        .salon-status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .salon-status-tag.live .salon-status-dot { background: #ef4444; animation: flash 1s infinite alternate; }
        .salon-status-tag.global .salon-status-dot { background: #0284c7; }

        .salon-title {
          font-size: 1.15rem;
          font-weight: 900;
          color: var(--primary-blue);
          margin: 0 0 15px 0;
          line-height: 1.4;
        }

        .salon-host-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
        }

        .salon-host-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          overflow: hidden;
          border: 1.5px solid #e2e8f0;
        }

        .salon-host-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .salon-host-info {
          display: flex;
          flex-direction: column;
        }

        .salon-host-name {
          font-size: 0.8rem;
          font-weight: 800;
          color: #334155;
        }

        .salon-host-role {
          font-size: 0.65rem;
          color: #94a3b8;
          font-weight: 600;
        }

        .salon-footer-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid #f8f6f0;
          padding-top: 12px;
        }

        /* Stacked Avatars */
        .listeners-stack {
          display: flex;
          align-items: center;
        }

        .listener-avatar-stacked {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          border: 2px solid #ffffff;
          overflow: hidden;
          margin-left: -8px;
        }

        .listener-avatar-stacked img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .listeners-count-badge {
          background: #f1f5f9;
          color: #475569;
          font-size: 0.65rem;
          font-weight: 800;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #ffffff;
          margin-left: -8px;
        }

        .btn-enter-salon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #eff6ff;
          color: var(--primary-blue);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 0.85rem;
        }

        .btn-enter-salon:hover {
          background: var(--primary-blue);
          color: #ffffff;
        }

        /* Upcoming Salons (الصالونات القادمة) */
        .upcoming-section {
          margin-bottom: 20px;
        }

        .upcoming-header-wrapper {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .carousel-arrows {
          display: flex;
          gap: 10px;
        }

        .arrow-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 0.8rem;
        }

        .arrow-btn:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
          color: var(--primary-blue);
        }

        /* Floating Plus Button */
        .floating-add-btn {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: #1d3f75;
          color: #ffffff;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(29, 63, 117, 0.3);
        }

        .floating-add-btn:hover {
          background: #11284d;
          transform: rotate(90deg);
        }

        .upcoming-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 25px;
        }

        .upcoming-card {
          background: #ffffff;
          border-radius: 24px;
          padding: 20px;
          border: 1px solid rgba(241, 235, 217, 0.4);
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 180px;
        }

        .upcoming-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }

        .upcoming-tag {
          background: #f1f5f9;
          color: #64748b;
          font-size: 0.7rem;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 8px;
        }

        .upcoming-title {
          font-size: 0.95rem;
          font-weight: 850;
          color: var(--primary-blue);
          margin: 0 0 10px 0;
          line-height: 1.4;
        }

        .upcoming-time-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.75rem;
          color: #d97706;
          font-weight: 700;
        }

        .upcoming-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid #f8f6f0;
          padding-top: 12px;
          margin-top: 12px;
        }

        .btn-remind-me {
          background: #ffffff;
          border: 1px solid var(--primary-blue);
          color: var(--primary-blue);
          padding: 6px 14px;
          border-radius: 10px;
          font-size: 0.75rem;
          font-weight: 800;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .btn-remind-me:hover {
          background: #f0f7ff;
        }

        .btn-remind-me.active {
          background: var(--primary-yellow);
          color: #4b3805;
          border-color: var(--primary-yellow);
        }

        /* 🌟 Live Simulated Audio Room Overlay */
        .live-room-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(8px);
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .live-room-card {
          background: #0f172a;
          color: #ffffff;
          width: 600px;
          border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(0,0,0,0.3);
          display: flex;
          flex-direction: column;
          height: 520px;
          animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes scaleUp {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .room-header {
          padding: 20px 30px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .room-title-sub {
          display: flex;
          flex-direction: column;
        }

        .room-tag-lbl {
          font-size: 0.7rem;
          color: #ef4444;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .room-main-title {
          font-size: 1.15rem;
          font-weight: 900;
          margin-top: 4px;
        }

        .btn-leave-room {
          background: #ef4444;
          color: #ffffff;
          border: none;
          padding: 8px 16px;
          border-radius: 12px;
          font-weight: 800;
          font-size: 0.8rem;
          cursor: pointer;
        }

        .btn-leave-room:hover {
          background: #dc2626;
        }

        /* Speakers Grid */
        .room-speakers-grid {
          flex-grow: 1;
          padding: 30px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          overflow-y: auto;
        }

        .speaker-bubble {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          position: relative;
        }

        .speaker-avatar-frame {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
        }

        .speaker-avatar-frame img {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #334155;
        }

        /* Animated border if speaking */
        .speaker-avatar-frame.speaking {
          border: 2px solid #3b82f6;
          animation: speakRing 1.2s infinite ease-in-out;
        }

        @keyframes speakRing {
          0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
          70% { box-shadow: 0 0 0 8px rgba(59, 130, 246, 0); }
          100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
        }

        .speaker-indicator-mic {
          position: absolute;
          bottom: 0;
          left: 5px;
          width: 22px;
          height: 22px;
          background: #1e293b;
          border: 1.5px solid #475569;
          color: #ffffff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.6rem;
        }

        .speaker-indicator-mic.muted {
          color: #ef4444;
        }

        .speaker-name {
          font-size: 0.8rem;
          font-weight: 700;
          color: #e2e8f0;
        }

        .speaker-lbl-tag {
          font-size: 0.65rem;
          color: #64748b;
          font-weight: 700;
          margin-top: 2px;
        }

        /* Controls Footer */
        .room-controls-footer {
          background: #1e293b;
          padding: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 20px;
        }

        .control-action-btn {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #334155;
          color: #ffffff;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          cursor: pointer;
        }

        .control-action-btn:hover {
          background: #475569;
        }

        .control-action-btn.muted-btn {
          background: #fee2e2;
          color: #ef4444;
        }

        .control-action-btn.active-btn {
          background: var(--primary-yellow);
          color: #4b3805;
        }

        /* Schedule salon modal */
        .schedule-modal-overlay {
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

        .schedule-modal-card {
          background: #ffffff;
          width: 440px;
          padding: 30px;
          border-radius: 24px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        .schedule-modal-card h3 {
          font-size: 1.25rem;
          font-weight: 900;
          color: var(--primary-blue);
          margin: 0 0 20px 0;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 20px;
        }

        .form-group label {
          font-size: 0.8rem;
          font-weight: 700;
          color: #475569;
        }

        .form-input {
          border: 1px solid #cbd5e1;
          border-radius: 12px;
          padding: 10px 15px;
          font-family: inherit;
          font-size: 0.85rem;
          outline: none;
        }

        .form-input:focus {
          border-color: var(--primary-blue);
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }

        .btn-cancel {
          background: #f1f5f9;
          color: #475569;
          border: none;
          padding: 8px 16px;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 700;
        }

        .btn-submit {
          background: var(--primary-blue);
          color: #ffffff;
          border: none;
          padding: 8px 20px;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 700;
        }

        @media (max-width: 1024px) {
          .explore-grid {
            grid-template-columns: 1fr;
          }
          .upcoming-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

        {/* Content Area */}
        <div className="content-area" style={{ padding: 0 }}>
          {/* Featured Audio Salon Card (الصالون المميز) */}
          <section className="featured-salon-section">
            <div className="featured-card">
              <div className="featured-card-left">
                <div className="featured-avatar-globe">
                  <div className="globe-pattern-bg">
                    <i className="fa-solid fa-globe"></i>
                  </div>
                  <div className="featured-host-avatar">
                    <img
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
                      alt="Sara Mahmoud Avatar"
                    />
                  </div>
                </div>
                <div className="featured-info">
                  <span className="featured-tag">الصالون المميز</span>
                  <h3 className="featured-title">ممارسة التيفيناغ للمبتدئين</h3>
                  <span className="featured-host-name">بواسطة: أ. سارة محمود</span>
                  <div className="featured-attendees">
                    <i className="fa-solid fa-users"></i>
                    <span>120 حاضر حالياً</span>
                  </div>
                </div>
              </div>

              <div className="featured-card-right">
                <button
                  className="btn-join-featured"
                  onClick={() =>
                    joinRoom({
                      title: "ممارسة التيفيناغ للمبتدئين",
                      host: "أ. سارة محمود",
                      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
                      role: "أستاذة لغة أمازيغية"
                    })
                  }
                >
                  <span>انضم الآن</span>
                  <i className="fa-solid fa-headphones"></i>
                </button>
              </div>
            </div>
          </section>

          {/* Section 2: Explore Salons (استكشف الصالونات) */}
          <section className="explore-section">
            <div className="section-header">
              <h3 className="section-title">استكشف الصالونات</h3>
              <span className="view-all-link" onClick={() => alert("تصفح جميع الصالونات")}>
                عرض الكل
              </span>
            </div>

            <div className="explore-grid">
              {filteredLive.map((salon) => (
                <div className="salon-card" key={salon.id}>
                  <div>
                    {/* Tags row */}
                    <div className="salon-top-tags">
                      <span className={`salon-lang-tag ${salon.langClass}`}>{salon.langTag}</span>
                      <span className={`salon-status-tag ${salon.broadClass}`}>
                        <span className="salon-status-dot"></span>
                        <span>{salon.broadText}</span>
                      </span>
                    </div>

                    <h4 className="salon-title">{salon.title}</h4>

                    {/* Host details */}
                    <div className="salon-host-row">
                      <div className="salon-host-avatar">
                        <img src={salon.avatar} alt={salon.host} />
                      </div>
                      <div className="salon-host-info">
                        <span className="salon-host-name">{salon.host}</span>
                        <span className="salon-host-role">{salon.role}</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer details */}
                  <div className="salon-footer-row">
                    <div className="listeners-stack">
                      {salon.listenerAvatars.map((url, index) => (
                        <div className="listener-avatar-stacked" key={index}>
                          <img src={url} alt="listener" />
                        </div>
                      ))}
                      <div className="listeners-count-badge">+{salon.listeners - salon.listenerAvatars.length}</div>
                    </div>

                    <button className="btn-enter-salon" onClick={() => joinRoom(salon)} title="دخول الغرفة">
                      <i className="fa-solid fa-arrow-left"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3: Upcoming Salons (الصالونات القادمة) */}
          <section className="upcoming-section">
            <div className="upcoming-header-wrapper">
              <h3 className="section-title">الصالونات القادمة</h3>

              <div className="carousel-arrows" style={{ alignItems: "center", gap: "15px" }}>
                {/* Carousel directional arrows */}
                <div className="arrow-btn">
                  <i className="fa-solid fa-chevron-right"></i>
                </div>
                <div className="arrow-btn">
                  <i className="fa-solid fa-chevron-left"></i>
                </div>

                {/* Floating blue addition button */}
                <button className="floating-add-btn" onClick={() => setShowScheduleModal(true)}>
                  <i className="fa-solid fa-plus"></i>
                </button>
              </div>
            </div>

            <div className="upcoming-grid">
              {upcomingSalons.map((salon) => (
                <div className="upcoming-card" key={salon.id}>
                  <div>
                    <div className="upcoming-top">
                      <span className="upcoming-tag">{salon.tag}</span>
                    </div>

                    <h4 className="upcoming-title">{salon.title}</h4>

                    <div className="upcoming-time-row">
                      <i className="fa-regular fa-clock"></i>
                      <span>{salon.time}</span>
                    </div>
                  </div>

                  <div className="upcoming-footer">
                    <div className="salon-host-row" style={{ margin: 0 }}>
                      <div className="salon-host-avatar" style={{ width: "32px", height: "32px" }}>
                        <img src={salon.avatar} alt={salon.host} />
                      </div>
                      <div className="salon-host-info">
                        <span className="salon-host-name" style={{ fontSize: "0.75rem" }}>
                          {salon.host}
                        </span>
                      </div>
                    </div>

                    <button
                      className={`btn-remind-me ${reminders[salon.id] ? "active" : ""}`}
                      onClick={() => toggleReminder(salon.id, salon.title)}
                    >
                      <i className="fa-regular fa-bell"></i>
                      <span>{reminders[salon.id] ? "مفعّل" : "ذكرني"}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

      {/* 🌟 Live Simulated Audio Room overlay simulator */}
      {activeSalonRoom && (
        <div className="live-room-overlay">
          <div className="live-room-card">
            {/* Header info */}
            <div className="room-header">
              <div className="room-title-sub">
                <span className="room-tag-lbl">
                  <span className="live-tag-dot"></span>
                  صالون صوتي مباشر
                </span>
                <h3 className="room-main-title">{activeSalonRoom.title}</h3>
              </div>
              <button className="btn-leave-room" onClick={() => setActiveSalonRoom(null)}>
                مغادرة الصالون
              </button>
            </div>

            {/* Speaking Board */}
            <div className="room-speakers-grid">
              {/* Host */}
              <div className="speaker-bubble">
                <div className="speaker-avatar-frame speaking">
                  <img src={activeSalonRoom.avatar} alt="host" />
                  <span className="speaker-indicator-mic">
                    <i className="fa-solid fa-microphone"></i>
                  </span>
                </div>
                <span className="speaker-name">{activeSalonRoom.host}</span>
                <span className="speaker-lbl-tag">المتحدث الرئيسي</span>
              </div>

              {/* Speaker 2 */}
              <div className="speaker-bubble">
                <div className="speaker-avatar-frame speaking" style={{ animationDelay: "0.4s" }}>
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
                    alt="listener"
                  />
                  <span className="speaker-indicator-mic">
                    <i className="fa-solid fa-microphone"></i>
                  </span>
                </div>
                <span className="speaker-name">وفاء السالم</span>
                <span className="speaker-lbl-tag">متحدث</span>
              </div>

              {/* Speaker 3 */}
              <div className="speaker-bubble">
                <div className="speaker-avatar-frame">
                  <img
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80"
                    alt="listener"
                  />
                  <span className="speaker-indicator-mic muted">
                    <i className="fa-solid fa-microphone-slash"></i>
                  </span>
                </div>
                <span className="speaker-name">أسماء الفاسي</span>
                <span className="speaker-lbl-tag">متحدث</span>
              </div>

              {/* Current Student (Ahmed) */}
              <div className="speaker-bubble">
                <div className="speaker-avatar-frame">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
                    alt="Ahmed Bennani"
                  />
                  <span className={`speaker-indicator-mic ${isMuted ? "muted" : ""}`}>
                    <i className={`fa-solid ${isMuted ? "fa-microphone-slash" : "fa-microphone"}`}></i>
                  </span>
                </div>
                <span className="speaker-name">أحمد بناني (أنت)</span>
                <span className="speaker-lbl-tag">{isMuted ? "مستمع" : "متحدث"}</span>
              </div>
            </div>

            {/* Room Mute/Hand Controls */}
            <div className="room-controls-footer">
              {/* Mic state */}
              <button
                className={`control-action-btn ${isMuted ? "muted-btn" : ""}`}
                onClick={() => {
                  setIsMuted(!isMuted);
                  if (isMuted) setHasRaisedHand(false);
                }}
                title={isMuted ? "تفعيل الميكروفون" : "كتم الصوت"}
              >
                <i className={`fa-solid ${isMuted ? "fa-microphone-slash" : "fa-microphone"}`}></i>
              </button>

              {/* Raise hand */}
              <button
                className={`control-action-btn ${hasRaisedHand ? "active-btn" : ""}`}
                onClick={() => {
                  setHasRaisedHand(!hasRaisedHand);
                  if (!hasRaisedHand) {
                    alert("لقد قمت برفع يدك لطلب التحدث! المعلم سيمنحك الميكروفون قريباً.");
                  }
                }}
                title="طلب التحدث"
              >
                <i className="fa-solid fa-hand"></i>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule a new salon form modal */}
      {showScheduleModal && (
        <div className="schedule-modal-overlay" onClick={() => setShowScheduleModal(false)}>
          <div className="schedule-modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>جدولة صالون صوتي جديد</h3>
            <form onSubmit={handleScheduleSalon}>
              <div className="form-group">
                <label>عنوان الصالون</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="مثال: مناقشة رواية الخبز الحافي"
                  value={newSalonTitle}
                  onChange={(e) => setNewSalonTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>اللغة أو اللهجة</label>
                <select className="form-input" style={{ background: "#ffffff" }}>
                  <option>اللغة العربية</option>
                  <option>الدارجة المغربية</option>
                  <option>الأمازيغية (Tifinagh)</option>
                </select>
              </div>

              <div className="form-group">
                <label>التوقيت المقترح</label>
                <input type="datetime-local" className="form-input" required />
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowScheduleModal(false)}>
                  إلغاء
                </button>
                <button type="submit" className="btn-submit">
                  حفظ الجدولة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AudioSalonsStudent;
