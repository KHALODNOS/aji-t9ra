import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StudentLayout from "../../components/student/StudentLayout";
import EducationalJourney from "./EducationalJourney";
import SpeakingPractice from "./SpeakingPractice";
import AudioSalons from "./AudioSalons";
import Leaderboard from "./Leaderboard";
import Achievements from "./Achievements";
import GeneralChat from "./GeneralChat";
import StudentProfile from "./StudentProfile";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("home");
  
  // Real state for filtering by language and search text
  const [selectedLanguage, setSelectedLanguage] = useState("الكل");
  const [searchText, setSearchText] = useState("");
  const [selectedStory, setSelectedStory] = useState(null); // Modal state for reading stories
  const [studentInfo, setStudentInfo] = useState(null);

  // Authenticate and load student info from localStorage
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      navigate("/login");
      return;
    }
    try {
      const parsed = JSON.parse(userStr);
      setStudentInfo({
        fullName: parsed.username || parsed.fullName || "طالب أجي تقرا",
        level: parsed.level || "طالب مستوى متقدم",
        avatarUrl: parsed.photoProfile || parsed.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
        ...parsed
      });
    } catch (e) {
      console.error("Error parsing user from localStorage:", e);
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Dummy data matching the visual specs
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
    const matchesLang =
      selectedLanguage === "الكل" ||
      (selectedLanguage === "الأمازيغية (Tifinagh)" && item.langCode === "amazigh") ||
      (selectedLanguage === "العربية" && item.langCode === "arabic") ||
      (selectedLanguage === "الإنجليزية (English)" && item.langCode === "english") ||
      (selectedLanguage === "الفرنسية (French)" && item.langCode === "french");

    const matchesSearch =
      searchText.trim() === "" ||
      item.title.toLowerCase().includes(searchText.toLowerCase()) ||
      (item.desc && item.desc.toLowerCase().includes(searchText.toLowerCase()));

    return matchesLang && matchesSearch;
  };

  const filteredSuggested = suggestedStories.filter(matchesFilter);
  const filteredHeritage = heritageStories.filter(matchesFilter);
  const filteredFantasy = fantasyStories.filter(matchesFilter);

  const renderHomeContent = () => {
    return (
      <div className="student-home-wrapper">
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
    );
  };

  const renderContent = () => {
    switch (activePage) {
      case "home":
        return renderHomeContent();
      case "journey":
        return <EducationalJourney onBack={() => setActivePage("home")} onLogout={handleLogout} />;
      case "speaking":
        return <SpeakingPractice onBack={() => setActivePage("home")} onLogout={handleLogout} />;
      case "salons":
        return <AudioSalons onBack={() => setActivePage("home")} onLogout={handleLogout} />;
      case "leaderboard":
        return <Leaderboard onBack={() => setActivePage("home")} onLogout={handleLogout} />;
      case "achievements":
        return <Achievements onBack={() => setActivePage("home")} onLogout={handleLogout} />;
      case "chat":
        return <GeneralChat onBack={() => setActivePage("home")} onLogout={handleLogout} />;
      case "profile":
        return <StudentProfile onBack={() => setActivePage("home")} onLogout={handleLogout} />;
      default:
        return renderHomeContent();
    }
  };

  return (
    <StudentLayout
      activePage={activePage}
      onPageChange={(pageId) => setActivePage(pageId)}
      onLogout={handleLogout}
      studentInfo={studentInfo}
    >
      <style>{`
        /* Local overrides and layout compatibility styles */
        .student-home-wrapper {
          width: 100%;
          direction: rtl;
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
          box-shadow: 0 4px 15px rgba(0,0,0,0.015);
          transition: all 0.25s ease;
        }

        .filter-pill:hover {
          background: #fdfcf9;
          border-color: rgba(229, 222, 206, 0.8);
          color: var(--teacher-primary, #00458b);
        }

        .filter-pill.active {
          background: var(--teacher-primary, #00458b);
          color: #ffffff;
          border-color: var(--teacher-primary, #00458b);
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
          color: var(--teacher-primary, #00458b);
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

        /* Suggested Stories Grid */
        .suggested-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 30px;
        }

        .suggested-card {
          background: #ffffff;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.02);
          border: 1px solid rgba(229, 222, 206, 0.3);
          display: flex;
          flex-direction: column;
        }

        .suggested-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.05);
        }

        .card-img-wrapper {
          position: relative;
          height: 220px;
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
          background: rgba(0, 69, 139, 0.85);
          color: #ffffff;
          padding: 6px 12px;
          border-radius: 10px;
          font-size: 0.75rem;
          font-weight: 700;
          backdrop-filter: blur(4px);
        }

        .level-badge {
          background: rgba(249, 200, 81, 0.95);
          color: #4b3805;
          padding: 6px 12px;
          border-radius: 10px;
          font-size: 0.75rem;
          font-weight: 800;
        }

        .rating-badge {
          position: absolute;
          bottom: 15px;
          right: 15px;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 10px;
          padding: 6px 10px;
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.8rem;
          font-weight: 800;
          color: #1a1a1a;
          box-shadow: 0 4px 10px rgba(0,0,0,0.05);
        }

        .rating-badge i {
          color: #f9c851;
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
          color: #d17b2b;
          font-size: 0.9rem;
          box-shadow: 0 4px 10px rgba(0,0,0,0.05);
        }

        .card-body {
          padding: 22px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .card-title {
          font-size: 1.15rem;
          font-weight: 900;
          color: #1d1d1d;
          margin: 0 0 10px 0;
        }

        .card-desc {
          font-size: 0.85rem;
          color: #757575;
          line-height: 1.6;
          margin: 0 0 20px 0;
          flex-grow: 1;
        }

        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid rgba(229, 222, 206, 0.2);
          padding-top: 15px;
        }

        .btn-read-story {
          background: var(--teacher-primary, #00458b);
          color: #ffffff;
          border: none;
          padding: 10px 22px;
          border-radius: 12px;
          font-weight: 800;
          font-size: 0.85rem;
          cursor: pointer;
        }

        .btn-read-story:hover {
          background: #002d5c;
        }

        .xp-rewards {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          font-weight: 800;
          color: #b45309;
        }

        .xp-rewards i {
          color: #f9c851;
        }

        /* Short Videos horizontal scroll */
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
          background: #fdf8ea;
          border: 1px solid #f5ebd9;
          border-radius: 12px;
          padding: 6px 12px;
          font-size: 0.75rem;
          font-weight: 800;
          color: #785a06;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .videos-scroll-container {
          display: flex;
          gap: 20px;
          overflow-x: auto;
          padding-bottom: 15px;
          scroll-snap-type: x mandatory;
        }

        .videos-scroll-container::-webkit-scrollbar {
          height: 6px;
        }

        .videos-scroll-container::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }

        .video-card {
          width: 220px;
          height: 300px;
          border-radius: 24px;
          padding: 20px;
          color: #ffffff;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          flex-shrink: 0;
          scroll-snap-align: start;
        }

        .video-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%);
          z-index: 1;
        }

        .video-play-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
          backdrop-filter: blur(5px);
          z-index: 2;
        }

        .video-card-body {
          position: relative;
          z-index: 2;
        }

        .video-tag {
          font-size: 0.7rem;
          font-weight: 800;
          background: rgba(255, 255, 255, 0.25);
          padding: 4px 10px;
          border-radius: 8px;
          display: inline-block;
          margin-bottom: 8px;
        }

        .video-card-title {
          font-size: 1rem;
          font-weight: 900;
          margin: 0 0 6px 0;
          line-height: 1.4;
        }

        .video-author {
          font-size: 0.75rem;
          opacity: 0.85;
          font-weight: 700;
        }

        /* Library Section styling */
        .library-title-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 25px;
        }

        .library-title-row i {
          font-size: 1.4rem;
          color: #d17b2b;
        }

        .library-title-row h2 {
          font-size: 1.4rem;
          font-weight: 900;
          color: #1a1a1a;
          margin: 0;
        }

        .library-columns-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 30px;
        }

        .library-column {
          background: #ffffff;
          border-radius: 24px;
          padding: 25px;
          border: 1px solid rgba(229, 222, 206, 0.3);
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
          gap: 10px;
        }

        .orange-vertical-bar {
          width: 4px;
          height: 18px;
          background: #d17b2b;
          border-radius: 2px;
        }

        .column-title {
          font-size: 1rem;
          font-weight: 900;
          color: #1a1a1a;
          margin: 0;
        }

        .column-show-all {
          font-size: 0.8rem;
          font-weight: 800;
          color: #8c7f6b;
          cursor: pointer;
        }

        .library-story-row {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .library-story-card {
          display: flex;
          gap: 15px;
          align-items: center;
          background: #fafaf7;
          border-radius: 20px;
          padding: 12px;
          border: 1px solid rgba(229, 222, 206, 0.2);
        }

        .lib-img-wrapper {
          width: 80px;
          height: 80px;
          border-radius: 14px;
          overflow: hidden;
          position: relative;
          flex-shrink: 0;
        }

        .lib-img-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .lib-badges {
          position: absolute;
          top: 5px;
          right: 5px;
        }

        .lib-badges .lang-badge {
          padding: 2px 6px;
          font-size: 0.6rem;
          border-radius: 5px;
        }

        .ready-badge {
          position: absolute;
          bottom: 5px;
          left: 5px;
          background: rgba(34, 197, 94, 0.95);
          color: #ffffff;
          padding: 2px 6px;
          border-radius: 5px;
          font-size: 0.6rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 3px;
        }

        .lib-rating {
          position: absolute;
          bottom: 5px;
          right: 5px;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 5px;
          padding: 2px 4px;
          font-size: 0.65rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 2px;
        }

        .lib-rating i {
          color: #f9c851;
        }

        .lib-card-body {
          display: flex;
          flex-direction: column;
        }

        .lib-card-title {
          font-size: 0.95rem;
          font-weight: 900;
          color: #1a1a1a;
          margin: 0 0 4px 0;
        }

        .lib-card-lang {
          font-size: 0.75rem;
          color: #757575;
          font-weight: 700;
        }

        .empty-filter-state {
          text-align: center;
          padding: 30px 10px;
          color: #a59e8f;
          font-size: 0.85rem;
        }

        .empty-filter-state i {
          font-size: 1.8rem;
          margin-bottom: 8px;
        }

        /* Story Modal simulator */
        .story-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.6);
          z-index: 1000;
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

        .modal-img-header {
          height: 180px;
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

        .spinner {
          font-size: 1.8rem;
          color: var(--teacher-primary, #00458b);
          margin-bottom: 15px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          100% { transform: rotate(-360deg); }
        }

        .modal-title {
          font-size: 1.4rem;
          font-weight: 900;
          color: var(--teacher-primary, #00458b);
          margin: 0 0 10px 0;
        }

        .modal-text {
          font-size: 0.9rem;
          color: #757575;
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
          background: var(--teacher-primary, #00458b);
          color: #ffffff;
          border: none;
          padding: 14px;
          border-radius: 16px;
          font-weight: 800;
          font-size: 0.95rem;
          cursor: pointer;
        }

        .btn-modal-start:hover {
          background: #002d5c;
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
      {renderContent()}
    </StudentLayout>
  );
};

export default StudentDashboard;
