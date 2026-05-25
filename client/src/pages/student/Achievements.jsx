import React, { useState } from "react";

const Achievements = ({ onBack, onLogout }) => {
  // State management
  const [selectedFilter, setSelectedFilter] = useState("الكل");
  const [activeTab, setActiveTab] = useState("الرئيسية");
  const [showShareModal, setShowShareModal] = useState(false); // Certificate download/share modal
  const [copiedLink, setCopiedLink] = useState(false);

  // Badges data categorized for filtering
  const badgesList = [
    {
      id: "reading",
      title: "بطل القراءة",
      category: "التعلم",
      img: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=120&auto=format&fit=crop&q=80",
      active: true,
      glowColor: "rgba(59, 130, 246, 0.4)",
      desc: "منح لقراءة 10 قصص مختلفة بنجاح كامل.",
      icon: "fa-book-open"
    },
    {
      id: "robot",
      title: "صديق الروبوت",
      category: "ذكاء",
      img: "https://images.unsplash.com/photo-1531747118685-ca8fa6e08806?w=120&auto=format&fit=crop&q=80",
      active: true,
      glowColor: "rgba(16, 185, 129, 0.4)",
      desc: "منح لإجراء أول محادثة صوتية ناجحة مع معلم الـ AI.",
      icon: "fa-robot"
    },
    {
      id: "tifinagh",
      title: "مستكشف تيفيناغ",
      category: "التعلم",
      img: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=120&auto=format&fit=crop&q=80",
      active: true,
      glowColor: "rgba(249, 115, 22, 0.4)",
      desc: "منح لإتقان الحروف الأمازيغية وقراءة أول نص تيفيناغ.",
      icon: "fa-compass"
    },
    {
      id: "speaker",
      title: "الخطيب المفوه",
      category: "التفاعل",
      active: false,
      desc: "يقفل حتى تشارك في 5 صالونات صوتية وتتحدث فيها."
    },
    {
      id: "scientist",
      title: "العالم الصغير",
      category: "ذكاء",
      active: false,
      desc: "يقفل حتى تجيب على 3 اختبارات علمية متتالية بنسبة 100%."
    },
    {
      id: "shield",
      title: "درع الحماية",
      category: "التفاعل",
      active: false,
      desc: "يقفل حتى تكمل درس الأمان الرقمي وتجتاز اختباره."
    }
  ];

  // Milestone timeline data
  const milestones = [
    {
      id: 1,
      title: "أكملت أول قصة تيفيناغ",
      desc: "تم الانتهاء من قصة \"أسد الأطلس\" بنسبة نجاح 100%.",
      date: "12 أكتوبر، 2023",
      circleClass: "gold"
    },
    {
      id: 2,
      title: "الارتقاء للمستوى الخامس",
      desc: "تهانينا! لقد تجاوزت مرحلة المبتدئين بنجاح باهر.",
      date: "05 أكتوبر، 2023",
      circleClass: "blue"
    },
    {
      id: 3,
      title: "بدء رحلة التفاعل الذكي",
      desc: "أول محادثة صوتية ناجحة مع المعلم الآلي.",
      date: "28 سبتمبر، 2023",
      circleClass: "red"
    }
  ];

  // Handle sharing action
  const handleCopyLink = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Filter badge list
  const filteredBadges = badgesList.filter(badge =>
    selectedFilter === "الكل" || badge.category === selectedFilter
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css');

        :root {
          --bg-light: #fcfcfa; /* Warm ivory/off-white tone */
          --sidebar-bg: #ffffff;
          --primary-blue: #00458b; /* Deep Brand Blue */
          --primary-blue-dark: #002d5c;
          --primary-yellow: #f9c851; /* Golden Yellow */
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

        .achieve-container {
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

        .brand-logo-container {
          width: 60px;
          height: 60px;
          background: var(--primary-blue);
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
          box-shadow: 0 8px 20px rgba(0, 69, 139, 0.15);
        }

        .brand-logo-container i {
          color: #ffffff;
          font-size: 1.8rem;
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

        /* Sidebar Action Button */
        .sidebar-action-container {
          padding: 0 20px;
          margin-top: auto;
          margin-bottom: 10px;
        }

        .action-add-btn {
          width: 100%;
          background: var(--primary-yellow);
          color: #4b3805;
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
          box-shadow: 0 4px 15px rgba(249, 200, 81, 0.2);
        }

        .action-add-btn:hover {
          background: var(--primary-yellow-hover);
          transform: translateY(-2px);
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

        .page-subtitle {
          font-size: 0.9rem;
          color: #64748b;
          font-weight: 600;
          margin-top: 4px;
        }

        .topbar-controls {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .topbar-icon-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 1rem;
        }

        .topbar-icon-btn:hover {
          color: var(--primary-blue);
          border-color: #94a3b8;
          background: #f8fafc;
        }

        /* Content Area */
        .content-area {
          padding: 10px 40px 40px;
        }

        /* Hero Progress Panel */
        .hero-progress-section {
          margin-bottom: 35px;
        }

        .hero-progress-card {
          background: #ffffff;
          border-radius: 28px;
          border: 1px solid rgba(241, 235, 217, 0.5);
          box-shadow: var(--shadow-md);
          padding: 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
        }

        /* Golden Trophy box */
        .trophy-image-box {
          width: 200px;
          height: 150px;
          border-radius: 20px;
          overflow: hidden;
          background: radial-gradient(circle, #254b73 0%, #001226 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 25px rgba(0,0,0,0.1);
        }

        .trophy-image-box img {
          width: 80%;
          height: 80%;
          object-fit: contain;
        }

        /* Center Details */
        .progress-details-block {
          flex-grow: 1;
          padding: 0 40px;
          display: flex;
          flex-direction: column;
        }

        .progress-title-row {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 12px;
        }

        .progress-title {
          font-size: 1.4rem;
          font-weight: 900;
          color: var(--primary-blue);
          margin: 0;
        }

        .pink-tag {
          background: #fee2e2;
          color: #ef4444;
          font-size: 0.75rem;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 8px;
        }

        .custom-prog-bar-container {
          width: 100%;
          height: 10px;
          background: #f1f5f9;
          border-radius: 5px;
          overflow: hidden;
          margin-bottom: 20px;
        }

        .custom-prog-bar-fill {
          height: 100%;
          background: #c29525;
          border-radius: 5px;
        }

        .progress-mini-stats {
          display: flex;
          gap: 40px;
        }

        .mini-stat-item {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .mini-stat-circle {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
        }

        .mini-stat-item.days .mini-stat-circle { background: #fff7ed; color: #ea580c; }
        .mini-stat-item.tasks .mini-stat-circle { background: #eff6ff; color: #2563eb; }

        .mini-stat-text {
          display: flex;
          flex-direction: column;
        }

        .mini-stat-val {
          font-size: 0.95rem;
          font-weight: 800;
          color: #1e293b;
        }

        .mini-stat-lbl {
          font-size: 0.75rem;
          color: #64748b;
          font-weight: 700;
        }

        /* SVG XP Radial Dial */
        .radial-xp-block {
          position: relative;
          width: 120px;
          height: 120px;
          flex-shrink: 0;
        }

        .radial-xp-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          display: flex;
          flex-direction: column;
        }

        .radial-xp-val {
          font-size: 1.5rem;
          font-weight: 900;
          color: #7b5b05;
        }

        .radial-xp-lbl {
          font-size: 0.75rem;
          color: #94a3b8;
          font-weight: 700;
        }

        .star-radial-badge {
          position: absolute;
          top: 0;
          right: 5px;
          width: 24px;
          height: 24px;
          background: #c29525;
          color: #ffffff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          border: 1.5px solid #ffffff;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        /* Badge Showcase Section (معرض الأوسمة) */
        .showcase-section {
          background: #ffffff;
          border-radius: 28px;
          padding: 30px;
          border: 1px solid rgba(241, 235, 217, 0.4);
          box-shadow: var(--shadow-sm);
          margin-bottom: 35px;
        }

        .showcase-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
        }

        .showcase-title-row {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1.25rem;
          font-weight: 950;
          color: #1e293b;
        }

        .showcase-title-row i {
          color: #c29525;
        }

        /* Filter Pills */
        .filter-pills-bar {
          display: flex;
          background: #f1f5f9;
          padding: 4px;
          border-radius: 14px;
          gap: 5px;
        }

        .filter-pill-btn {
          background: transparent;
          border: none;
          padding: 8px 20px;
          border-radius: 10px;
          font-family: inherit;
          font-size: 0.85rem;
          font-weight: 700;
          color: #64748b;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .filter-pill-btn.active {
          background: #ffffff;
          color: var(--primary-blue);
          box-shadow: 0 4px 10px rgba(0,0,0,0.04);
          border: 1px solid #cbd5e1;
        }

        /* Badges grid */
        .badges-grid-list {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 20px;
        }

        .badge-box-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          cursor: pointer;
          position: relative;
        }

        /* Hexagonal custom mask structure matching screenshot */
        .hex-badge-container {
          width: 72px;
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          margin-bottom: 12px;
        }

        /* Active Badge with beautiful hexagon design */
        .hex-badge-frame {
          width: 64px;
          height: 64px;
          background: #1e293b;
          clip-path: polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #ffffff;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .hex-badge-frame img {
          width: 85%;
          height: 85%;
          object-fit: cover;
          clip-path: polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%);
        }

        /* Active border glow */
        .hex-badge-container.glow::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 50%;
          background: var(--glow-color);
          filter: blur(10px);
          z-index: 0;
          opacity: 0.45;
        }

        .hex-badge-frame {
          position: relative;
          z-index: 1;
        }

        /* Locked badge dashed gray frame */
        .hex-badge-locked-dashed {
          width: 64px;
          height: 64px;
          border: 1.5px dashed #cbd5e1;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #94a3b8;
          font-size: 1.25rem;
          background: #fcfcfa;
        }

        .badge-box-title {
          font-size: 0.8rem;
          font-weight: 800;
          color: #475569;
        }

        .badge-box-item.locked .badge-box-title {
          color: #94a3b8;
        }

        /* Hover description tooltips */
        .badge-hover-tooltip {
          position: absolute;
          bottom: 85px;
          background: #1e293b;
          color: #ffffff;
          font-size: 0.75rem;
          padding: 8px 12px;
          border-radius: 10px;
          width: 150px;
          z-index: 10;
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
          line-height: 1.4;
          font-weight: 600;
        }

        .badge-hover-tooltip::after {
          content: "";
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border-width: 6px;
          border-style: solid;
          border-color: #1e293b transparent transparent transparent;
        }

        /* Timeline Section (محطات الإنجاز) */
        .timeline-section {
          background: #ffffff;
          border-radius: 28px;
          padding: 30px;
          border: 1px solid rgba(241, 235, 217, 0.4);
          box-shadow: var(--shadow-sm);
          margin-bottom: 25px;
        }

        .timeline-header {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1.25rem;
          font-weight: 950;
          color: #1e293b;
          margin-bottom: 25px;
        }

        .timeline-header i {
          color: #0d3b66;
        }

        /* Vertical Line list */
        .timeline-vertical-flow {
          position: relative;
          padding-right: 35px;
        }

        .timeline-vertical-flow::before {
          content: "";
          position: absolute;
          top: 10px;
          right: 9px;
          bottom: 10px;
          width: 2px;
          background: #eff2f6;
        }

        .timeline-row-item {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 25px;
          position: relative;
        }

        .timeline-row-item:last-child {
          margin-bottom: 0;
        }

        /* Timeline bullet circle */
        .timeline-bullet-node {
          position: absolute;
          right: -31px;
          top: 5px;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 3px solid #ffffff;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }

        .timeline-bullet-node.gold { background: #d97706; }
        .timeline-bullet-node.blue { background: #2563eb; }
        .timeline-bullet-node.red { background: #b91c1c; }

        .timeline-details {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .timeline-item-title {
          font-size: 0.95rem;
          font-weight: 850;
          color: #1e293b;
        }

        .timeline-item-desc {
          font-size: 0.85rem;
          color: #64748b;
          font-weight: 600;
        }

        .timeline-item-date {
          font-size: 0.8rem;
          color: #94a3b8;
          font-weight: 700;
        }

        /* Footer alerts & actions */
        .footer-action-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 15px;
        }

        .alert-pre-win {
          background: #ffffff;
          border: 1.5px solid #f1ebd9;
          border-radius: 18px;
          padding: 12px 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.85rem;
          font-weight: 700;
          color: #1d1d1d;
          box-shadow: var(--shadow-sm);
        }

        .alert-pre-win i {
          color: #c29525;
          font-size: 1.1rem;
        }

        .alert-pre-win strong {
          color: #c29525;
        }

        .btn-share-achievements {
          background: #00458b;
          color: #ffffff;
          border: none;
          padding: 14px 35px;
          border-radius: 16px;
          font-weight: 800;
          font-size: 0.95rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 4px 15px rgba(0, 69, 139, 0.15);
        }

        .btn-share-achievements:hover {
          background: var(--primary-blue-dark);
          transform: translateY(-2px);
        }

        /* 🌟 Interactive Share Certificate Modal Panel (WOW Feature) */
        .certificate-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(5px);
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .certificate-modal-card {
          background: #ffffff;
          width: 580px;
          border-radius: 28px;
          padding: 35px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.15);
          text-align: center;
          animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes slideIn {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        /* Framed Certificate layout */
        .cert-mockup-frame {
          border: 8px double #c29525;
          background: #fffcf4;
          padding: 25px;
          border-radius: 14px;
          margin-bottom: 25px;
          position: relative;
        }

        .cert-mockup-frame::before {
          content: "★";
          position: absolute;
          top: 10px;
          left: 10px;
          color: #c29525;
          font-size: 1rem;
        }

        .cert-mockup-frame::after {
          content: "★";
          position: absolute;
          top: 10px;
          right: 10px;
          color: #c29525;
          font-size: 1rem;
        }

        .cert-brand {
          font-size: 0.95rem;
          font-weight: 800;
          color: var(--primary-blue);
          margin-bottom: 5px;
        }

        .cert-title-lbl {
          font-size: 1.6rem;
          font-family: 'Tajawal', sans-serif;
          font-weight: 900;
          color: #1e293b;
          margin: 10px 0;
        }

        .cert-awardee-name {
          font-size: 1.4rem;
          font-weight: 900;
          color: #c29525;
          margin: 10px 0;
          text-decoration: underline;
        }

        .cert-description {
          font-size: 0.85rem;
          color: #64748b;
          line-height: 1.6;
          margin: 0 20px 20px 20px;
          font-weight: 600;
        }

        .cert-stamp-row {
          display: flex;
          justify-content: space-around;
          align-items: center;
          margin-top: 15px;
        }

        .cert-stamp {
          width: 48px;
          height: 48px;
          background: #c29525;
          color: #ffffff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          box-shadow: 0 4px 10px rgba(194, 149, 37, 0.3);
        }

        .cert-date-sub {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .cert-date-sub span:first-child {
          font-size: 0.65rem;
          color: #94a3b8;
          font-weight: 700;
        }

        .cert-date-sub span:last-child {
          font-size: 0.75rem;
          font-weight: 800;
          color: #334155;
          margin-top: 2px;
        }

        /* Certificate Control actions */
        .cert-modal-actions {
          display: flex;
          gap: 15px;
        }

        .btn-cert-download {
          flex-grow: 1;
          background: #c29525;
          color: #ffffff;
          border: none;
          padding: 12px;
          border-radius: 12px;
          font-weight: 800;
          font-size: 0.9rem;
          cursor: pointer;
        }

        .btn-cert-download:hover {
          background: #b2851d;
        }

        .btn-cert-copy {
          background: #f1f5f9;
          color: #475569;
          border: 1px solid #cbd5e1;
          padding: 12px 25px;
          border-radius: 12px;
          font-weight: 800;
          font-size: 0.9rem;
          cursor: pointer;
        }

        .btn-cert-copy:hover {
          background: #e2e8f0;
        }

        .btn-close-cert {
          position: absolute;
          top: 15px;
          left: 15px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #f1f5f9;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @media (max-width: 1024px) {
          .hero-progress-card {
            flex-direction: column;
            gap: 20px;
          }
          .progress-details-block {
            padding: 0;
            margin: 15px 0;
          }
          .badges-grid-list {
            grid-template-columns: repeat(3, 1fr);
          }
          .footer-action-row {
            flex-direction: column;
            gap: 15px;
          }
        }
      `}</style>

        {/* Content Area */}
        <div className="content-area" style={{ padding: 0 }}>
          {/* Section 1: Hero Progress (مستوانا الحالي والتحديات) */}
          <section className="hero-progress-section">
            <div className="hero-progress-card">
              {/* Gold trophy box frame */}
              <div className="trophy-image-box">
                <img
                  src="https://images.unsplash.com/photo-1578269174936-2709b5a8c0e7?w=300&auto=format&fit=crop&q=80"
                  alt="Gold Trophy"
                />
              </div>

              {/* Progress details */}
              <div className="progress-details-block">
                <div className="progress-title-row">
                  <h3 className="progress-title">مستوى 5: خبير التيفيناغ</h3>
                  <span className="pink-tag">أعلى 5%</span>
                </div>

                <div className="custom-prog-bar-container">
                  <div className="custom-prog-bar-fill" style={{ width: "65%" }}></div>
                </div>

                <div className="progress-mini-stats">
                  {/* Daily streak */}
                  <div className="mini-stat-item days">
                    <div className="mini-stat-circle">
                      <i className="fa-solid fa-fire"></i>
                    </div>
                    <div className="mini-stat-text">
                      <span className="mini-stat-val">7 أيام</span>
                      <span className="mini-stat-lbl">متتالية</span>
                    </div>
                  </div>

                  {/* Completed tasks */}
                  <div className="mini-stat-item tasks">
                    <div className="mini-stat-circle">
                      <i className="fa-solid fa-wand-magic-sparkles"></i>
                    </div>
                    <div className="mini-stat-text">
                      <span className="mini-stat-val">12</span>
                      <span className="mini-stat-lbl">مهمة كاملة</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Large Radial XP graph */}
              <div className="radial-xp-block">
                <svg width="120" height="120" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#f1f5f9"
                    strokeWidth="2"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#c29525"
                    strokeWidth="2"
                    strokeDasharray="80, 100"
                  />
                </svg>
                <div className="radial-xp-text">
                  <span className="radial-xp-val">5,420</span>
                  <span className="radial-xp-lbl">نقطة XP</span>
                </div>
                <div className="star-radial-badge">
                  <i className="fa-solid fa-star"></i>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Badge Showcase (معرض الأوسمة) */}
          <section className="showcase-section">
            <div className="showcase-header">
              <div className="showcase-title-row">
                <i className="fa-solid fa-trophy"></i>
                <span>معرض الأوسمة</span>
              </div>

              {/* Filter pills bar */}
              <div className="filter-pills-bar">
                {["الكل", "التعلم", "التفاعل", "ذكاء"].map((filter) => (
                  <button
                    key={filter}
                    className={`filter-pill-btn ${selectedFilter === filter ? "active" : ""}`}
                    onClick={() => setSelectedFilter(filter)}
                  >
                    {filter === "التعلم" && <i className="fa-solid fa-book-open"></i>}
                    {filter === "التفاعل" && <i className="fa-regular fa-comments"></i>}
                    {filter === "ذكاء" && <i className="fa-regular fa-lightbulb"></i>}
                    <span>{filter}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Badges Grid list */}
            <div className="badges-grid-list">
              {filteredBadges.map((badge) => {
                const [hovered, setHovered] = useState(false);
                return (
                  <div
                    className={`badge-box-item ${badge.active ? "" : "locked"}`}
                    key={badge.id}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                  >
                    <div
                      className={`hex-badge-container ${badge.active ? "glow" : ""}`}
                      style={badge.active ? { "--glow-color": badge.glowColor } : {}}
                    >
                      {badge.active ? (
                        <div className="hex-badge-frame">
                          <img src={badge.img} alt={badge.title} />
                        </div>
                      ) : (
                        <div className="hex-badge-locked-dashed">
                          <i className="fa-solid fa-lock"></i>
                        </div>
                      )}
                    </div>
                    <span className="badge-box-title">{badge.title}</span>

                    {/* Tooltip Description */}
                    {hovered && (
                      <div className="badge-hover-tooltip">
                        <strong>{badge.title}</strong>
                        <p style={{ margin: "5px 0 0 0", fontSize: "0.7rem", opacity: 0.9 }}>
                          {badge.desc}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Section 3: Achievement Timeline (محطات الإنجاز) */}
          <section className="timeline-section">
            <div className="timeline-header">
              <i className="fa-solid fa-arrow-trend-up"></i>
              <span>محطات الإنجاز</span>
            </div>

            <div className="timeline-vertical-flow">
              {milestones.map((milestone) => (
                <div className="timeline-row-item" key={milestone.id}>
                  <div className={`timeline-bullet-node ${milestone.circleClass}`}></div>
                  <div className="timeline-details">
                    <span className="timeline-item-title">{milestone.title}</span>
                    <span className="timeline-item-desc">{milestone.desc}</span>
                  </div>
                  <span className="timeline-item-date">{milestone.date}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Bottom Alerts & Share action */}
          <div className="footer-action-row">
            {/* Warning / tip badge */}
            <div className="alert-pre-win">
              <i className="fa-solid fa-award"></i>
              <span>
                أنت على وشك الفوز! تحتاج <strong>80 نقطة فقط</strong> للحصول على وسام "العبقري".
              </span>
            </div>

            {/* Share button */}
            <button className="btn-share-achievements" onClick={() => setShowShareModal(true)}>
              <span>شارك إنجازاتك مع أصدقائك</span>
              <i className="fa-solid fa-share-nodes"></i>
            </button>
          </div>
        </div>

      {/* 🌟 Share Certificate Modal Simulator */}
      {showShareModal && (
        <div className="certificate-modal-overlay" onClick={() => setShowShareModal(false)}>
          <div className="certificate-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="btn-close-cert" onClick={() => setShowShareModal(false)}>
              <i className="fa-solid fa-xmark"></i>
            </button>

            {/* Framed Certificate */}
            <div className="cert-mockup-frame">
              <span className="cert-brand">منصة أجي تقرا للتعلم الذكي</span>
              <h4 className="cert-title-lbl">شهادة تميز وتقدير</h4>
              <p className="cert-description" style={{ margin: "5px 0", color: "#475569" }}>
                تمنح هذه الشهادة بكل فخر للطالب المتميز
              </p>
              <h3 className="cert-awardee-name">أحمد بن محمد</h3>
              <p className="cert-description">
                لاجتيازه مستوى <strong>(خبير التيفيناغ)</strong> وتجميعه لأكثر من <strong>5,420 نقطة تفاعلية</strong>،
                وإتمامه لجميع المهمات بتميز واقتدار.
              </p>

              <div className="cert-stamp-row">
                <div className="cert-stamp">
                  <i className="fa-solid fa-ribbon"></i>
                </div>
                <div className="cert-date-sub">
                  <span>تاريخ الإصدار</span>
                  <span>18 مايو، 2026</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="cert-modal-actions">
              <button
                className="btn-cert-download"
                onClick={() => {
                  alert("جاري تحضير الشهادة بصيغة PDF... تم التنزيل بنجاح!");
                  setShowShareModal(false);
                }}
              >
                <i className="fa-solid fa-download" style={{ marginLeft: "8px" }}></i>
                <span>تحميل الشهادة</span>
              </button>
              <button className="btn-cert-copy" onClick={handleCopyLink}>
                <span>{copiedLink ? "تم النسخ!" : "نسخ رابط المشاركة"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Achievements;
