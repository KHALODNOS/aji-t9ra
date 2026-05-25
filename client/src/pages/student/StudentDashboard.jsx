import React, { useState } from "react";

const StudentDashboard = ({ onBack, onLogout }) => {
  // Real state for filtering by language and search text
  const [selectedLanguage, setSelectedLanguage] = useState("الكل");
  const [searchText, setSearchText] = useState("");
  const [selectedStory, setSelectedStory] = useState(null); // Modal state for reading stories

  // Dummy data matching the first screenshot exactly
  const suggestedStories = [
    {
      id: "atlas",
      title: "أسرار جبال الأطلس",
      desc: "رحلة سحرية لاستكشاف كنوز جبال الأطلس المغربية بتنسيق تفاعلي ممتع",
      img: "https://images.unsplash.com/photo-1538964173425-85c6a41d3b4b?w=600&auto=format&fit=crop&q=80",
      rating: "4.9",
      xp: "50+ XP",
      level: "مبتدئ",
      language: "الأمازيغية (Tifinagh)",
      langCode: "amazigh",
      location: "المغرب",
    },
    {
      id: "future-city",
      title: "مدينة المستقبل الخضراء",
      desc: "كيف ستبدو المدن المغربية في المستقبل باستخدام الطاقة النظيفة؟",
      img: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600&auto=format&fit=crop&q=80",
      rating: "4.8",
      xp: "75+ XP",
      level: "متوسط",
      language: "عربي",
      langCode: "arabic",
      location: "المغرب",
    }
  ];

  const shortVideos = [
    {
      id: 1,
      title: "نطق حروف الأمازيغية...",
      cat: "لغة",
      author: "أ. سارة العلمي",
      gradient: "linear-gradient(135deg, #159c98 0%, #124e54 100%)",
    },
    {
      id: 2,
      title: "تاريخ فاس في 60 ثانية",
      cat: "ثقافة",
      author: "أ. فريد بني",
      gradient: "linear-gradient(135deg, #1e7075 0%, #0c3538 100%)",
    },
    {
      id: 3,
      title: "كيف تقرأ أسرع؟",
      cat: "نصيحة",
      author: "د. ليلى فوزي",
      gradient: "linear-gradient(135deg, #238a91 0%, #0f4044 100%)",
    },
    {
      id: 4,
      title: "Daily Greetings in English",
      cat: "English",
      author: "Mr. James",
      gradient: "linear-gradient(135deg, #1c7c82 0%, #0d383b 100%)",
    },
    {
      id: 5,
      title: "حكاية السندباد البحري",
      cat: "قصة",
      author: "أ. مريم",
      gradient: "linear-gradient(135deg, #14918e 0%, #0e4448 100%)",
    }
  ];

  const heritageStories = [
    {
      id: "crafts",
      title: "حرف بلادي",
      img: "https://images.unsplash.com/photo-1565192647048-f997ded87958?w=600&auto=format&fit=crop&q=80",
      rating: "4.7",
      language: "تيفيناغ",
      langCode: "amazigh",
      isReady: true
    },
    {
      id: "time-travel",
      title: "رحلة عبر الزمن",
      img: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&auto=format&fit=crop&q=80",
      rating: "4.9",
      language: "عربي",
      langCode: "arabic",
      isReady: false
    }
  ];

  const fantasyStories = [
    {
      id: "word-adventure",
      title: "مغامرة الكلمات",
      img: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=600&auto=format&fit=crop&q=80",
      rating: "4.8",
      language: "عربي",
      langCode: "arabic",
      isReady: true
    }
  ];

  // Filtering function
  const matchesFilter = (item) => {
    // Language Filter Match
    const matchesLang =
      selectedLanguage === "الكل" ||
      (selectedLanguage === "الأمازيغية (Tifinagh)" && item.langCode === "amazigh") ||
      (selectedLanguage === "العربية" && item.langCode === "arabic") ||
      (selectedLanguage === "الإنجليزية (English)" && item.langCode === "english") ||
      (selectedLanguage === "الفرنسية (French)" && item.langCode === "french");

    // Search Text Match
    const matchesSearch =
      searchText.trim() === "" ||
      item.title.toLowerCase().includes(searchText.toLowerCase()) ||
      (item.desc && item.desc.toLowerCase().includes(searchText.toLowerCase()));

    return matchesLang && matchesSearch;
  };

  const filteredSuggested = suggestedStories.filter(matchesFilter);
  const filteredHeritage = heritageStories.filter(matchesFilter);
  const filteredFantasy = fantasyStories.filter(matchesFilter);

  return (
    <div className="dashboard-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css');

        :root {
          --bg-light: #fcfbfa; /* Soft warm ivory background */
          --sidebar-bg: #ffffff;
          --primary-blue: #00458b; /* Deep Brand Blue */
          --primary-blue-dark: #002d5c;
          --primary-yellow: #f9c851; /* Golden Yellow */
          --primary-yellow-hover: #e5b23d;
          --text-main: #1d1d1d;
          --text-muted: #757575;
          --border-color: #f1ebd9;
          --shadow-sm: 0 4px 15px rgba(0, 0, 0, 0.02);
          --shadow-md: 0 8px 30px rgba(0, 0, 0, 0.04);
        }

        * {
          box-sizing: border-box;
          transition: all 0.25s ease;
        }

        body {
          margin: 0;
          font-family: 'Tajawal', sans-serif;
          background: var(--bg-light);
          direction: rtl;
          color: var(--text-main);
        }

        .dashboard-container {
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
          border-left: 1px solid rgba(229, 222, 206, 0.4);
          display: flex;
          flex-direction: column;
          padding: 30px 0;
          flex-shrink: 0;
          box-shadow: -5px 0 25px rgba(0, 0, 0, 0.015);
        }

        .brand-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 25px;
          padding: 0 20px;
        }

        .brand-logo-container {
          width: 60px;
          height: 60px;
          background: var(--primary-blue);
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 20px rgba(0, 69, 139, 0.25);
          margin-bottom: 12px;
        }

        .brand-logo-container i {
          color: #ffffff;
          font-size: 1.8rem;
        }

        .sidebar-brand {
          font-size: 1.6rem;
          font-weight: 800;
          color: var(--primary-blue);
          margin: 0;
          text-align: center;
        }

        .sidebar-subtitle {
          font-size: 0.85rem;
          color: var(--text-muted);
          font-weight: 600;
          margin-top: 4px;
        }

        .nav-list {
          list-style: none;
          padding: 0 15px;
          margin: 15px 0 0 0;
          flex-grow: 1;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 14px 20px;
          text-decoration: none;
          color: var(--text-muted);
          font-weight: 700;
          cursor: pointer;
          border-radius: 16px;
          margin-bottom: 8px;
          font-size: 0.95rem;
        }

        .nav-link:hover {
          background: #f5f8fc;
          color: var(--primary-blue);
        }

        .nav-link.active {
          background: #eef4fb;
          color: var(--primary-blue);
          position: relative;
        }

        .nav-link.active::after {
          content: "";
          position: absolute;
          right: 0;
          top: 25%;
          bottom: 25%;
          width: 5px;
          background: var(--primary-blue);
          border-radius: 5px 0 0 5px;
        }

        .nav-link i {
          font-size: 1.15rem;
          width: 24px;
          text-align: center;
        }

        .sidebar-action-container {
          padding: 0 20px;
          margin-bottom: 20px;
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
          box-shadow: 0 4px 15px rgba(249, 200, 81, 0.25);
        }

        .action-add-btn:hover {
          background: var(--primary-yellow-hover);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(249, 200, 81, 0.35);
        }

        .sidebar-bottom {
          border-top: 1px solid #f5f0e3;
          padding: 20px 20px 0;
          margin-top: auto;
        }

        .profile-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: #faf9f6;
          border: 1px solid #f1ebd9;
          border-radius: 20px;
          margin-bottom: 15px;
        }

        .profile-img-container {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid var(--primary-blue);
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
          color: var(--text-muted);
          font-weight: 600;
          margin-top: 2px;
        }

        .logout-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          color: #ca3e41;
          font-weight: 800;
          font-size: 0.9rem;
          cursor: pointer;
          padding: 10px;
          border-radius: 12px;
          width: 100%;
        }

        .logout-btn:hover {
          background: #fff0f0;
        }

        .main-wrapper {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          height: 100vh;
        }

        .topbar {
          padding: 30px 40px 15px 40px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
        }

        .welcome-block {
          display: flex;
          flex-direction: column;
        }

        .greeting-text {
          font-size: 1.8rem;
          font-weight: 900;
          color: var(--primary-blue);
          margin: 0;
        }

        .greeting-sub {
          font-size: 0.95rem;
          color: var(--text-muted);
          font-weight: 600;
          margin-top: 6px;
        }

        .search-and-xp {
          display: flex;
          align-items: center;
          gap: 25px;
        }

        .xp-pill {
          background: #fdf8ea;
          border: 1px solid #f5ebd9;
          border-radius: 20px;
          padding: 10px 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: var(--shadow-sm);
        }

        .xp-pill .coin-icon {
          width: 32px;
          height: 32px;
          background: var(--primary-yellow);
          color: #4b3805;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.95rem;
          font-weight: 800;
          box-shadow: 0 4px 10px rgba(249, 200, 81, 0.3);
        }

        .xp-text-container {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .xp-label {
          font-size: 0.7rem;
          color: #a39b85;
          font-weight: 700;
        }

        .xp-count {
          font-size: 1rem;
          font-weight: 900;
          color: #785a06;
          margin-top: 2px;
        }

        .search-container {
          display: flex;
          background: #ffffff;
          border: 1px solid rgba(229, 222, 206, 0.5);
          border-radius: 20px;
          padding: 4px;
          width: 480px;
          box-shadow: var(--shadow-sm);
        }

        .search-input-wrapper {
          position: relative;
          flex-grow: 1;
          display: flex;
          align-items: center;
        }

        .search-icon-inside {
          position: absolute;
          right: 18px;
          color: #a59e8f;
          font-size: 1rem;
        }

        .search-input {
          width: 100%;
          border: none;
          outline: none;
          padding: 14px 45px 14px 15px;
          font-family: inherit;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-main);
          background: transparent;
        }

        .search-input::placeholder {
          color: #bcae9b;
        }

        .search-action-btn {
          background: var(--primary-yellow);
          color: #4b3805;
          border: none;
          border-radius: 16px;
          padding: 0 28px;
          font-weight: 800;
          font-size: 0.9rem;
          cursor: pointer;
        }

        .search-action-btn:hover {
          background: var(--primary-yellow-hover);
        }

        .content-area {
          padding: 10px 40px 40px;
        }

        .filters-row {
          display: flex;
          gap: 12px;
          margin-bottom: 30px;
          flex-wrap: wrap;
        }

        .filter-pill {
          background: #ffffff;
          border: 1px solid rgba(229, 222, 206, 0.4);
          border-radius: 15px;
          padding: 10px 22px;
          font-weight: 700;
          font-size: 0.85rem;
          color: #5d5649;
          cursor: pointer;
          box-shadow: var(--shadow-sm);
        }

        .filter-pill:hover {
          background: #fdfcf9;
          border-color: rgba(229, 222, 206, 0.8);
          color: var(--primary-blue);
        }

        .filter-pill.active {
          background: var(--primary-blue);
          color: #ffffff;
          border-color: var(--primary-blue);
          box-shadow: 0 4px 15px rgba(0, 69, 139, 0.2);
        }

        .section-container {
          margin-bottom: 40px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .section-title-wrapper {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .section-title-wrapper i {
          font-size: 1.25rem;
          color: var(--primary-blue);
        }

        .section-title-wrapper.spark i {
          color: #cca529;
        }

        .section-title {
          font-size: 1.3rem;
          font-weight: 900;
          color: #1a1a1a;
          margin: 0;
        }

        .view-all-link {
          font-size: 0.85rem;
          font-weight: 700;
          color: #d17b2b;
          text-decoration: none;
          cursor: pointer;
        }

        .view-all-link:hover {
          text-decoration: underline;
        }

        .suggested-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 30px;
        }

        .suggested-card {
          background: #ffffff;
          border-radius: 24px;
          overflow: hidden;
          border: 1px solid rgba(229, 222, 206, 0.3);
          box-shadow: var(--shadow-md);
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .suggested-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.06);
        }

        .card-img-wrapper {
          position: relative;
          width: 100%;
          height: 240px;
          overflow: hidden;
        }

        .card-img-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .badges-top {
          position: absolute;
          top: 15px;
          right: 15px;
          display: flex;
          gap: 8px;
        }

        .lang-badge {
          background: #fdf6e2;
          color: #c99304;
          font-size: 0.75rem;
          font-weight: 800;
          padding: 6px 12px;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .level-badge {
          background: #eef4ff;
          color: #1e40af;
          font-size: 0.75rem;
          font-weight: 800;
          padding: 6px 12px;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .rating-badge {
          position: absolute;
          bottom: 15px;
          right: 15px;
          background: rgba(255, 255, 255, 0.95);
          color: #1a1a1a;
          padding: 5px 12px;
          border-radius: 20px;
          font-weight: 800;
          font-size: 0.75rem;
          display: flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .rating-badge i {
          color: var(--primary-yellow);
        }

        .map-pin-badge {
          position: absolute;
          bottom: 15px;
          left: 15px;
          background: rgba(255, 255, 255, 0.9);
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary-blue);
          font-size: 0.9rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .card-body {
          padding: 20px 25px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .card-title {
          font-size: 1.25rem;
          font-weight: 900;
          margin: 0 0 10px 0;
          color: var(--text-main);
        }

        .card-desc {
          font-size: 0.85rem;
          color: var(--text-muted);
          line-height: 1.6;
          margin: 0 0 20px 0;
          flex-grow: 1;
        }

        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
          border-top: 1px solid #fbfaf7;
          padding-top: 15px;
        }

        .btn-read-story {
          background: var(--primary-blue);
          color: #ffffff;
          border: none;
          padding: 12px 28px;
          border-radius: 12px;
          font-weight: 800;
          font-size: 0.85rem;
          cursor: pointer;
        }

        .btn-read-story:hover {
          background: var(--primary-blue-dark);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 69, 139, 0.2);
        }

        .xp-rewards {
          font-size: 0.85rem;
          font-weight: 800;
          color: #ca8a04;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .short-videos-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .videos-title-and-level {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .user-level-badge {
          background: #fdf3d7;
          border: 1px solid #f6deb4;
          color: #855305;
          padding: 8px 16px;
          border-radius: 14px;
          font-size: 0.8rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .user-level-badge i {
          color: #d97706;
        }

        .videos-scroll-container {
          display: flex;
          gap: 20px;
          overflow-x: auto;
          padding-bottom: 15px;
          scrollbar-width: thin;
        }

        .video-card {
          width: 200px;
          height: 290px;
          border-radius: 24px;
          position: relative;
          overflow: hidden;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 20px;
          box-shadow: 0 8px 25px rgba(0,0,0,0.05);
          cursor: pointer;
        }

        .video-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.1);
        }

        .video-play-btn {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(5px);
          border: 1.5px solid rgba(255, 255, 255, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-size: 0.95rem;
        }

        .video-card-body {
          position: relative;
          z-index: 2;
          color: #ffffff;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .video-tag {
          font-size: 0.7rem;
          font-weight: 800;
          padding: 4px 10px;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 8px;
          width: fit-content;
        }

        .video-card-title {
          font-size: 0.95rem;
          font-weight: 800;
          margin: 4px 0 6px 0;
          line-height: 1.4;
        }

        .video-author {
          font-size: 0.75rem;
          opacity: 0.85;
          font-weight: 600;
        }

        .library-title-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 25px;
          border-bottom: 1.5px dashed #ebdcb8;
          padding-bottom: 12px;
        }

        .library-title-row i {
          font-size: 1.4rem;
          color: var(--primary-blue);
        }

        .library-title-row h2 {
          font-size: 1.4rem;
          font-weight: 900;
          margin: 0;
        }

        .library-columns-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 40px;
        }

        .library-column-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .column-title-with-bar {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .orange-vertical-bar {
          width: 5px;
          height: 24px;
          background: #d97706;
          border-radius: 4px;
        }

        .column-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: #2b2b2b;
          margin: 0;
        }

        .column-show-all {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-muted);
          cursor: pointer;
        }

        .column-show-all:hover {
          color: var(--primary-blue);
        }

        .library-story-row {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .library-story-card {
          background: #ffffff;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid rgba(229, 222, 206, 0.3);
          box-shadow: var(--shadow-sm);
        }

        .library-story-card:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-md);
        }

        .lib-img-wrapper {
          position: relative;
          height: 140px;
          overflow: hidden;
        }

        .lib-img-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .lib-badges {
          position: absolute;
          top: 10px;
          right: 10px;
          display: flex;
          gap: 6px;
        }

        .ready-badge {
          background: #e0f2fe;
          color: #0284c7;
          font-size: 0.65rem;
          font-weight: 800;
          padding: 4px 8px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .lib-rating {
          position: absolute;
          bottom: 10px;
          right: 10px;
          background: rgba(255, 255, 255, 0.9);
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.7rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .lib-rating i {
          color: var(--primary-yellow);
        }

        .lib-card-body {
          padding: 15px;
        }

        .lib-card-title {
          font-size: 0.95rem;
          font-weight: 800;
          margin: 0 0 5px 0;
          color: var(--text-main);
        }

        .lib-card-lang {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        .empty-filter-state {
          grid-column: span 3;
          background: #ffffff;
          padding: 40px;
          text-align: center;
          border-radius: 20px;
          border: 1.5px dashed #ebdcb8;
          color: var(--text-muted);
        }

        .empty-filter-state i {
          font-size: 2.5rem;
          color: var(--primary-yellow);
          margin-bottom: 15px;
        }

        /* Modal Overlay */
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
          backdrop-filter: blur(5px);
        }

        .story-modal-card {
          background: #ffffff;
          width: 500px;
          border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 15px 50px rgba(0,0,0,0.15);
          animation: modalAppear 0.3s ease;
        }

        @keyframes modalAppear {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .modal-img-header {
          height: 200px;
          position: relative;
        }

        .modal-img-header img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .modal-close-btn {
          position: absolute;
          top: 15px;
          left: 15px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.9);
          border: none;
          color: var(--text-main);
          font-size: 1.1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-body {
          padding: 25px 30px;
          text-align: center;
        }

        .modal-body i.spinner {
          font-size: 2.2rem;
          color: var(--primary-blue);
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }

        @keyframes spin {
          100% { transform: rotate(-360deg); }
        }

        .modal-title {
          font-size: 1.4rem;
          font-weight: 900;
          color: var(--primary-blue);
          margin: 0 0 10px 0;
        }

        .modal-text {
          font-size: 0.9rem;
          color: var(--text-muted);
          line-height: 1.6;
          margin: 0 0 25px 0;
        }

        .modal-rewards {
          background: #fdfcf9;
          border: 1px solid #ebdcb8;
          border-radius: 16px;
          padding: 12px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-weight: 800;
          color: #b45309;
          font-size: 0.85rem;
          margin-bottom: 25px;
        }

        .btn-modal-start {
          width: 100%;
          background: var(--primary-blue);
          color: #ffffff;
          border: none;
          padding: 14px;
          border-radius: 16px;
          font-weight: 800;
          font-size: 0.95rem;
          cursor: pointer;
        }

        .btn-modal-start:hover {
          background: var(--primary-blue-dark);
        }

        @media (max-width: 1200px) {
          .suggested-grid {
            grid-template-columns: 1fr;
          }
          .library-columns-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* Sidebar Section */}
      <aside className="sidebar">
        <div className="brand-section">
          <div className="brand-logo-container">
            <i className="fa-solid fa-graduation-cap"></i>
          </div>
          <h1 className="sidebar-brand">أجي تقرا</h1>
          <span className="sidebar-subtitle">نظام إدارة التعلم</span>
        </div>

        <ul className="nav-list">
          <li>
            <div className="nav-link active">
              <i className="fa-solid fa-house"></i>
              <span>الرئيسية</span>
            </div>
          </li>
          <li>
            <div className="nav-link">
              <i className="fa-solid fa-book-open"></i>
              <span>مؤلف القصص</span>
            </div>
          </li>
          <li>
            <div className="nav-link">
              <i className="fa-solid fa-robot"></i>
              <span>إعدادات الـ AI</span>
            </div>
          </li>
          <li>
            <div className="nav-link">
              <i className="fa-solid fa-vial"></i>
              <span>الاختبارات</span>
            </div>
          </li>
          <li>
            <div className="nav-link">
              <i className="fa-solid fa-microphone"></i>
              <span>الصالونات الصوتية</span>
            </div>
          </li>
          <li>
            <div className="nav-link">
              <i className="fa-solid fa-users"></i>
              <span>متابعة الطلاب</span>
            </div>
          </li>
        </ul>

        <div className="sidebar-action-container">
          <button className="action-add-btn">
            <i className="fa-solid fa-circle-plus"></i>
            <span>إضافة محتوى</span>
          </button>
        </div>

        <div className="sidebar-bottom">
          <div className="profile-card">
            <div className="profile-img-container">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
                alt="Supervisor Avatar"
              />
            </div>
            <div className="profile-info">
              <span className="profile-name">أدمن المنصة</span>
              <span className="profile-role">المشرف العام</span>
            </div>
          </div>

          <div className="logout-btn" onClick={onLogout || onBack}>
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
            <span>تسجيل الخروج</span>
          </div>
        </div>
      </aside>

      {/* Main Wrapper */}
      <main className="main-wrapper">
        {/* Topbar */}
        <header className="topbar">
          <div className="welcome-block">
            <h2 className="greeting-text">مرحباً أحمد</h2>
            <span className="greeting-sub">ماذا تريد أن تتعلم اليوم؟</span>
          </div>

          <div className="search-and-xp">
            {/* Search */}
            <div className="search-container">
              <div className="search-input-wrapper">
                <i className="fa-solid fa-magnifying-glass search-icon-inside"></i>
                <input
                  type="text"
                  className="search-input"
                  placeholder="ابحث عن قصص، فيديوهات أو دروس..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>
              <button className="search-action-btn">ابحث</button>
            </div>

            {/* XP Points */}
            <div className="xp-pill">
              <div className="xp-text-container">
                <span className="xp-label">رصيد نقاطك</span>
                <span className="xp-count">XP 2,450</span>
              </div>
              <div className="coin-icon">
                <i className="fa-solid fa-coins"></i>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="content-area">
          {/* Language filters */}
          <div className="filters-row">
            {["الكل", "الأمازيغية (Tifinagh)", "العربية", "الإنجليزية (English)", "الفرنسية (French)"].map((lang) => (
              <div
                key={lang}
                className={`filter-pill ${selectedLanguage === lang ? "active" : ""}`}
                onClick={() => setSelectedLanguage(lang)}
              >
                {lang}
              </div>
            ))}
          </div>

          {/* Section: Suggested for you */}
          <section className="section-container">
            <div className="section-header">
              <div className="section-title-wrapper spark">
                <i className="fa-solid fa-wand-magic-sparkles"></i>
                <h3 className="section-title">مقترح لك</h3>
              </div>
              <span className="view-all-link">عرض الكل</span>
            </div>

            {filteredSuggested.length > 0 ? (
              <div className="suggested-grid">
                {filteredSuggested.map((story) => (
                  <div className="suggested-card" key={story.id}>
                    <div className="card-img-wrapper">
                      <img src={story.img} alt={story.title} />
                      <div className="badges-top">
                        <span className="lang-badge">{story.language}</span>
                        <span className="level-badge">{story.level}</span>
                      </div>
                      <div className="rating-badge">
                        <i className="fa-solid fa-star"></i>
                        <span>{story.rating}</span>
                      </div>
                      <div className="map-pin-badge">
                        <i className="fa-solid fa-map-pin"></i>
                      </div>
                    </div>
                    <div className="card-body">
                      <h4 className="card-title">{story.title}</h4>
                      <p className="card-desc">{story.desc}</p>
                      <div className="card-footer">
                        <button className="btn-read-story" onClick={() => setSelectedStory(story)}>
                          ابدأ القراءة
                        </button>
                        <span className="xp-rewards">
                          <i className="fa-solid fa-award"></i>
                          <span>{story.xp}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-filter-state">
                <i className="fa-regular fa-folder-open"></i>
                <p>لا توجد نتائج مطابقة لبحثك أو خيار اللغة المحدد في هذا القسم.</p>
              </div>
            )}
          </section>

          {/* Section: Short Videos */}
          <section className="section-container">
            <div className="short-videos-header">
              <div className="videos-title-and-level">
                <div className="section-title-wrapper">
                  <i className="fa-regular fa-circle-play"></i>
                  <h3 className="section-title">فيديوهات قصيرة</h3>
                </div>
                <div className="user-level-badge">
                  <i className="fa-solid fa-award"></i>
                  <span>المستوى الحالي: قارئ متميز ★</span>
                </div>
              </div>
              <span className="view-all-link">عرض الكل</span>
            </div>

            <div className="videos-scroll-container">
              {shortVideos.map((video) => (
                <div
                  className="video-card"
                  key={video.id}
                  style={{ background: video.gradient }}
                  onClick={() => alert(`جاري تشغيل فيديو: ${video.title}`)}
                >
                  <div className="video-play-btn">
                    <i className="fa-solid fa-play"></i>
                  </div>
                  <div className="video-card-body">
                    <span className="video-tag">{video.cat}</span>
                    <h4 className="video-card-title">{video.title}</h4>
                    <span className="video-author">{video.author}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Comprehensive Library */}
          <section className="section-container">
            <div className="library-title-row">
              <i className="fa-solid fa-book-bookmark"></i>
              <h2>المكتبة الشاملة</h2>
            </div>

            <div className="library-columns-grid">
              {/* Left Column: Heritage Stories */}
              <div className="library-column">
                <div className="library-column-header">
                  <div className="column-title-with-bar">
                    <div className="orange-vertical-bar"></div>
                    <h4 className="column-title">قصص التراث</h4>
                  </div>
                  <span className="column-show-all">عرض المزيد</span>
                </div>

                {filteredHeritage.length > 0 ? (
                  <div className="library-story-row">
                    {filteredHeritage.map((story) => (
                      <div className="library-story-card" key={story.id}>
                        <div className="lib-img-wrapper">
                          <img src={story.img} alt={story.title} />
                          <div className="lib-badges">
                            <span className="lang-badge">{story.language}</span>
                            {story.isReady && (
                              <span className="ready-badge">
                                <i className="fa-solid fa-circle-check"></i> Ready
                              </span>
                            )}
                          </div>
                          <div className="lib-rating">
                            <i className="fa-solid fa-star"></i>
                            <span>{story.rating}</span>
                          </div>
                        </div>
                        <div className="lib-card-body">
                          <h4 className="lib-card-title">{story.title}</h4>
                          <span className="lib-card-lang">اللغة: {story.language}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-filter-state">
                    <p>لا توجد قصص تراثية مطابقة لبحثك.</p>
                  </div>
                )}
              </div>

              {/* Right Column: Fictional Adventures */}
              <div className="library-column">
                <div className="library-column-header">
                  <div className="column-title-with-bar">
                    <div className="orange-vertical-bar"></div>
                    <h4 className="column-title">مغامرات خيالية</h4>
                  </div>
                  <span className="column-show-all">عرض المزيد</span>
                </div>

                {filteredFantasy.length > 0 ? (
                  <div className="library-story-row" style={{ gridTemplateColumns: "1fr" }}>
                    {filteredFantasy.map((story) => (
                      <div className="library-story-card" key={story.id}>
                        <div className="lib-img-wrapper">
                          <img src={story.img} alt={story.title} />
                          <div className="lib-badges">
                            <span className="lang-badge">{story.language}</span>
                            {story.isReady && (
                              <span className="ready-badge">
                                <i className="fa-solid fa-circle-check"></i> Ready
                              </span>
                            )}
                          </div>
                          <div className="lib-rating">
                            <i className="fa-solid fa-star"></i>
                            <span>{story.rating}</span>
                          </div>
                        </div>
                        <div className="lib-card-body">
                          <h4 className="lib-card-title">{story.title}</h4>
                          <span className="lib-card-lang">اللغة: {story.language}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-filter-state">
                    <p>لا توجد مغامرات خيالية مطابقة لبحثك.</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Story Modal */}
      {selectedStory && (
        <div className="story-modal-overlay" onClick={() => setSelectedStory(null)}>
          <div className="story-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-img-header">
              <img src={selectedStory.img} alt={selectedStory.title} />
              <button className="modal-close-btn" onClick={() => setSelectedStory(null)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="modal-body">
              <i className="fa-solid fa-spinner spinner"></i>
              <h3 className="modal-title">{selectedStory.title}</h3>
              <p className="modal-text">
                جاري تحضير كتاب <strong>"{selectedStory.title}"</strong> للمستوى <strong>({selectedStory.level})</strong>.
                استعد لرحلة تفاعلية مليئة بالمغامرة والتعلم!
              </p>
              <div className="modal-rewards">
                <i className="fa-solid fa-coins"></i>
                <span>عند إتمام القراءة، ستحصل على {selectedStory.xp}!</span>
              </div>
              <button className="btn-modal-start" onClick={() => {
                alert("بدأت المغامرة! استمتع بالقراءة.");
                setSelectedStory(null);
              }}>
                انطلق الآن!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
