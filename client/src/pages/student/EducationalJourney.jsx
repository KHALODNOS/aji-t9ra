import React, { useEffect, useMemo, useState } from "react";
import api from "../../services/api";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80";

const getMediaUrl = (path) => {
  if (!path) return FALLBACK_IMAGE;
  if (path.startsWith("http")) return path;
  return `http://localhost:5000/${path.replace(/\\/g, "/")}`;
};

const formatDate = (value) => {
  if (!value) return "غير محدد";
  return new Intl.DateTimeFormat("ar-MA", { day: "numeric", month: "long", year: "numeric" }).format(new Date(value));
};

const EducationalJourney = () => {
  const [journey, setJourney] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchText, setSearchText] = useState("");
  const [favorites, setFavorites] = useState({});
  const [playingWord, setPlayingWord] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [xpReward, setXpReward] = useState(null);

  useEffect(() => {
    const fetchJourney = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await api.get("/student/journey");
        setJourney(response.data);
        const initialFavorites = {};
        (response.data.wordBank || []).forEach((item) => {
          initialFavorites[item.word] = Boolean(item.isFavorite);
        });
        setFavorites(initialFavorites);
      } catch (err) {
        console.error("Error loading educational journey:", err);
        setError(err.response?.data?.message || "تعذر تحميل بيانات رحلتك التعليمية.");
      } finally {
        setLoading(false);
      }
    };

    fetchJourney();
  }, []);

  useEffect(() => {
    const readEarnedBadges = () => {
      const raw = localStorage.getItem("newlyEarnedBadges");
      if (!raw) return;

      try {
        const badges = JSON.parse(raw);
        if (Array.isArray(badges) && badges.length > 0) {
          setEarnedBadges(badges);
          localStorage.removeItem("newlyEarnedBadges");
        }
      } catch (err) {
        console.error("Error parsing earned badges:", err);
        localStorage.removeItem("newlyEarnedBadges");
      }
    };

    readEarnedBadges();
    window.addEventListener("newlyEarnedBadges", readEarnedBadges);
    return () => window.removeEventListener("newlyEarnedBadges", readEarnedBadges);
  }, []);

  useEffect(() => {
    const applyXpReward = (event) => {
      let reward = event?.detail;

      if (!reward) {
        const raw = localStorage.getItem("newlyEarnedXp");
        if (!raw) return;

        try {
          reward = JSON.parse(raw);
        } catch (err) {
          console.error("Error parsing earned XP:", err);
          localStorage.removeItem("newlyEarnedXp");
          return;
        }
      }

      const amount = Number(reward?.xpAwarded) || 0;
      if (!amount) return;

      setJourney((prev) => {
        if (!prev) return prev;
        const currentTotal = Number(prev.stats?.totalXp) || 0;
        return {
          ...prev,
          stats: {
            ...prev.stats,
            totalXp: reward.totalXp ?? currentTotal + amount,
          },
        };
      });
      setXpReward(reward);
      localStorage.removeItem("newlyEarnedXp");
      window.clearTimeout(applyXpReward.timeoutId);
      applyXpReward.timeoutId = window.setTimeout(() => setXpReward(null), 2600);
    };

    applyXpReward();
    window.addEventListener("studentXpReward", applyXpReward);
    return () => {
      window.removeEventListener("studentXpReward", applyXpReward);
      window.clearTimeout(applyXpReward.timeoutId);
    };
  }, []);

  const filteredWords = useMemo(() => {
    const words = journey?.wordBank || [];
    const q = searchText.trim().toLowerCase();
    if (!q) return words;
    return words.filter((item) =>
      [item.word, item.translation, item.arabic, item.storyTitle]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(q))
    );
  }, [journey, searchText]);

  const playAudio = (wordName) => {
    setPlayingWord(wordName);
    setTimeout(() => setPlayingWord(null), 900);
  };

  const toggleFavorite = async (wordName) => {
    setFavorites((prev) => ({ ...prev, [wordName]: !prev[wordName] }));
    try {
      await api.post("/student/journey/words/favorite", { word: wordName });
    } catch (err) {
      console.error("Error toggling favorite word:", err);
      setFavorites((prev) => ({ ...prev, [wordName]: !prev[wordName] }));
    }
  };

  const stats = journey?.stats || {};
  const completedPercent = stats.totalStoriesCount
    ? Math.min(100, Math.round((stats.completedStoriesCount / stats.totalStoriesCount) * 100))
    : 0;

  if (loading) {
    return (
      <div className="journey-state" dir="rtl">
        <i className="fa-solid fa-circle-notch fa-spin"></i>
        <p>جاري تحميل رحلتك التعليمية من قاعدة البيانات...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="journey-state error" dir="rtl">
        <i className="fa-solid fa-triangle-exclamation"></i>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css');

        .journey-page {
          direction: rtl;
          font-family: 'Tajawal', sans-serif;
          color: #1e293b;
        }

        .journey-state {
          min-height: 420px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 14px;
          direction: rtl;
          color: #00458b;
          font-family: 'Tajawal', sans-serif;
          font-weight: 800;
        }

        .journey-state i {
          font-size: 2rem;
        }

        .journey-state.error {
          color: #b91c1c;
        }

        .journey-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          margin-bottom: 26px;
        }

        .journey-title {
          margin: 0;
          color: #00458b;
          font-size: 1.8rem;
          font-weight: 900;
        }

        .journey-subtitle {
          margin: 6px 0 0;
          color: #64748b;
          font-size: 0.9rem;
          font-weight: 700;
        }

        .search-wrapper {
          position: relative;
          width: min(340px, 100%);
        }

        .search-wrapper i {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }

        .search-input {
          width: 100%;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          border-radius: 16px;
          padding: 12px 16px 12px 42px;
          font-family: inherit;
          font-size: 0.9rem;
          font-weight: 700;
          color: #1e293b;
          outline: none;
        }

        .section-title {
          font-size: 1.15rem;
          font-weight: 900;
          color: #1e293b;
          margin: 0 0 18px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 18px;
          margin-bottom: 34px;
        }

        .stat-card, .data-card, .badges-row {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          box-shadow: 0 10px 24px rgba(15, 23, 42, 0.035);
        }

        .stat-card {
          border-radius: 22px;
          padding: 22px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          min-height: 118px;
        }

        .stat-label {
          display: block;
          color: #64748b;
          font-size: 0.82rem;
          font-weight: 800;
          margin-bottom: 8px;
        }

        .stat-value {
          color: #00458b;
          font-size: 1.8rem;
          font-weight: 900;
        }

        .stat-icon {
          width: 54px;
          height: 54px;
          border-radius: 17px;
          display: grid;
          place-items: center;
          background: #e0f2fe;
          color: #0284c7;
          font-size: 1.35rem;
        }

        .stat-icon.gold {
          background: #fef3c7;
          color: #b45309;
        }

        .section-block {
          margin-bottom: 34px;
        }

        .cards-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 20px;
        }

        .data-card {
          border-radius: 22px;
          padding: 18px;
          display: flex;
          gap: 18px;
          align-items: center;
        }

        .card-image {
          width: 132px;
          height: 94px;
          border-radius: 16px;
          object-fit: cover;
          flex-shrink: 0;
        }

        .card-body {
          min-width: 0;
          flex: 1;
        }

        .card-title {
          margin: 0 0 5px;
          font-size: 1rem;
          font-weight: 900;
          color: #1e293b;
        }

        .card-meta {
          color: #64748b;
          font-size: 0.78rem;
          font-weight: 800;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 12px;
        }

        .progress-bar {
          height: 8px;
          background: #f1f5f9;
          border-radius: 999px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .progress-fill {
          height: 100%;
          background: #00458b;
        }

        .card-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
        }

        .soft-text {
          color: #64748b;
          font-size: 0.75rem;
          font-weight: 800;
        }

        .primary-btn {
          border: 0;
          background: #00458b;
          color: white;
          border-radius: 12px;
          padding: 8px 16px;
          font-family: inherit;
          font-size: 0.78rem;
          font-weight: 900;
          cursor: pointer;
        }

        .words-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 18px;
          margin-bottom: 18px;
        }

        .words-row {
          display: flex;
          gap: 15px;
          overflow-x: auto;
          padding-bottom: 10px;
        }

        .word-card {
          min-width: 168px;
          background: #f4f8fd;
          border: 1px solid #e0ecf8;
          border-radius: 20px;
          padding: 18px 14px;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }

        .word-action {
          position: absolute;
          top: 12px;
          width: 28px;
          height: 28px;
          border: 0;
          border-radius: 50%;
          background: transparent;
          color: #00458b;
          cursor: pointer;
        }

        .word-speaker {
          right: 12px;
        }

        .word-fav {
          left: 12px;
          color: #cbd5e1;
        }

        .word-fav.active {
          color: #ef4444;
        }

        .word-main {
          margin-top: 16px;
          color: #00458b;
          font-size: 1.1rem;
          font-weight: 900;
        }

        .word-translation, .word-story {
          color: #475569;
          font-size: 0.82rem;
          font-weight: 800;
          text-align: center;
        }

        .word-story {
          margin-top: 5px;
          color: #94a3b8;
          font-size: 0.7rem;
        }

        .audio-wave {
          display: flex;
          gap: 2px;
          align-items: center;
          height: 12px;
          margin-top: 8px;
        }

        .audio-bar {
          width: 2px;
          height: 100%;
          background: #00458b;
          animation: bounce 0.6s infinite alternate;
        }

        .audio-bar:nth-child(2) { animation-delay: 0.15s; }
        .audio-bar:nth-child(3) { animation-delay: 0.3s; }
        @keyframes bounce { from { height: 3px; } to { height: 12px; } }

        .badges-row {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 18px;
          padding: 22px;
          border-radius: 22px;
        }

        .badge-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          text-align: center;
          position: relative;
        }

        .badge-circle {
          width: 66px;
          height: 66px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          color: #ffffff;
          font-size: 1.45rem;
          box-shadow: inset 0 -8px 18px rgba(0,0,0,0.08);
        }

        .badge-circle.gold { background: #f59e0b; }
        .badge-circle.blue { background: #0284c7; }
        .badge-circle.brown { background: #92400e; }
        .badge-item.locked .badge-circle { background: #cbd5e1; color: #64748b; }

        .badge-name {
          color: #1e293b;
          font-size: 0.78rem;
          font-weight: 900;
        }

        .badge-desc {
          color: #64748b;
          font-size: 0.68rem;
          font-weight: 700;
          line-height: 1.45;
        }

        .quiz-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }

        .quiz-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 22px;
          overflow: hidden;
          box-shadow: 0 10px 24px rgba(15, 23, 42, 0.035);
        }

        .quiz-card img {
          width: 100%;
          height: 128px;
          object-fit: cover;
        }

        .quiz-body {
          padding: 16px;
        }

        .quiz-reward {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #b45309;
          background: #fef3c7;
          border-radius: 999px;
          padding: 5px 10px;
          font-size: 0.72rem;
          font-weight: 900;
          margin-bottom: 10px;
        }

        .empty-state {
          background: #ffffff;
          border: 1px dashed #cbd5e1;
          border-radius: 20px;
          padding: 24px;
          color: #64748b;
          text-align: center;
          font-weight: 800;
        }

        .story-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.55);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          backdrop-filter: blur(4px);
        }

        .story-modal-card {
          background: white;
          width: min(480px, 100%);
          border-radius: 26px;
          overflow: hidden;
          text-align: center;
        }

        .modal-header-img {
          height: 178px;
          position: relative;
        }

        .modal-header-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .modal-close-btn {
          position: absolute;
          top: 14px;
          left: 14px;
          width: 34px;
          height: 34px;
          border: 0;
          border-radius: 50%;
          background: white;
          cursor: pointer;
        }

        .modal-body {
          padding: 24px;
        }

        .modal-title {
          margin: 0 0 10px;
          color: #00458b;
          font-size: 1.25rem;
          font-weight: 900;
        }

        .modal-text {
          margin: 0 0 20px;
          color: #64748b;
          font-size: 0.9rem;
          line-height: 1.7;
          font-weight: 700;
        }

        .modal-questions {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-height: 260px;
          overflow-y: auto;
          text-align: right;
          margin-bottom: 18px;
        }

        .modal-question {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 14px;
        }

        .modal-question-title {
          margin: 0 0 10px;
          color: #1e293b;
          font-size: 0.86rem;
          font-weight: 900;
          line-height: 1.6;
        }

        .modal-options {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .modal-option {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 999px;
          padding: 6px 10px;
          color: #475569;
          font-size: 0.74rem;
          font-weight: 800;
        }

        .earned-badge-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.58);
          z-index: 1200;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          backdrop-filter: blur(4px);
        }

        .earned-badge-card {
          width: min(430px, 100%);
          background: #ffffff;
          border-radius: 26px;
          padding: 28px;
          text-align: center;
          box-shadow: 0 24px 70px rgba(15, 23, 42, 0.28);
        }

        .earned-badge-icon {
          width: 86px;
          height: 86px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          margin: 0 auto 16px;
          color: white;
          font-size: 2rem;
          background: #f59e0b;
          box-shadow: inset 0 -10px 22px rgba(0,0,0,0.12);
        }

        .earned-badge-icon.blue { background: #0284c7; }
        .earned-badge-icon.brown { background: #92400e; }

        .earned-badge-title {
          margin: 0 0 8px;
          color: #00458b;
          font-size: 1.35rem;
          font-weight: 900;
        }

        .earned-badge-text {
          margin: 0 0 18px;
          color: #64748b;
          line-height: 1.7;
          font-weight: 800;
        }

        .xp-toast {
          position: fixed;
          top: 24px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1300;
          display: flex;
          align-items: center;
          gap: 10px;
          background: #111827;
          color: #ffffff;
          border: 1px solid rgba(255,255,255,0.14);
          border-radius: 999px;
          padding: 12px 18px;
          box-shadow: 0 18px 45px rgba(15, 23, 42, 0.26);
          font-weight: 900;
          animation: xp-pop 0.45s ease both, xp-float 2.2s ease 0.45s both;
        }

        .xp-toast i {
          color: #facc15;
        }

        @keyframes xp-pop {
          from { opacity: 0; transform: translate(-50%, -18px) scale(0.86); }
          to { opacity: 1; transform: translate(-50%, 0) scale(1); }
        }

        @keyframes xp-float {
          0%, 75% { opacity: 1; }
          100% { opacity: 0; transform: translate(-50%, -18px) scale(0.96); }
        }

        @media (max-width: 1100px) {
          .stats-grid, .quiz-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .badges-row {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 760px) {
          .journey-header, .words-header {
            flex-direction: column;
            align-items: stretch;
          }
          .stats-grid, .cards-grid, .quiz-grid, .badges-row {
            grid-template-columns: 1fr;
          }
          .data-card {
            align-items: flex-start;
          }
          .card-image {
            width: 96px;
            height: 82px;
          }
        }
      `}</style>

      <div className="journey-page">
        <header className="journey-header">
          <div>
            <h2 className="journey-title">رحلتي التعليمية</h2>
            <p className="journey-subtitle">بيانات حقيقية من القصص، بنك الكلمات، الاختبارات، وتقدمك المحفوظ.</p>
          </div>
          <div className="search-wrapper">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              className="search-input"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="ابحث في بنك الكلمات..."
            />
          </div>
        </header>

        <section className="stats-grid">
          <div className="stat-card">
            <div>
              <span className="stat-label">نقاط XP</span>
              <span className="stat-value">{stats.totalXp || 0} XP</span>
            </div>
            <div className="stat-icon gold"><i className="fa-solid fa-star"></i></div>
          </div>
          <div className="stat-card">
            <div>
              <span className="stat-label">الكلمات المتاحة</span>
              <span className="stat-value">{stats.wordBankCount || 0}</span>
            </div>
            <div className="stat-icon gold"><i className="fa-solid fa-book"></i></div>
          </div>
          <div className="stat-card">
            <div>
              <span className="stat-label">القصص المكتملة</span>
              <span className="stat-value">{stats.completedStoriesCount || 0}</span>
            </div>
            <div className="stat-icon"><i className="fa-solid fa-check"></i></div>
          </div>
          <div className="stat-card">
            <div>
              <span className="stat-label">الاختبارات الحقيقية</span>
              <span className="stat-value">{stats.availableQuizzesCount || 0}</span>
            </div>
            <div className="stat-icon gold"><i className="fa-solid fa-file-circle-question"></i></div>
          </div>
        </section>

        <section className="section-block">
          <h3 className="section-title">تابع القراءة</h3>
          {journey.continueStories?.length ? (
            <div className="cards-grid">
              {journey.continueStories.map((story) => (
                <div className="data-card" key={story.id}>
                  <img className="card-image" src={getMediaUrl(story.coverImage)} alt={story.title} />
                  <div className="card-body">
                    <h4 className="card-title">{story.title}</h4>
                    <div className="card-meta">
                      <span>المستوى: {story.level || "غير محدد"}</span>
                      <span>{story.language}</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${story.progress || 0}%` }}></div>
                    </div>
                    <div className="card-actions">
                      <span className="soft-text">اكتملت بنسبة {story.progress || 0}%</span>
                      <button className="primary-btn" onClick={() => setActiveItem({ type: "story", ...story })}>
                        استكمال
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">لا توجد قصص معتمدة أو تقدم قراءة محفوظ حاليا.</div>
          )}
        </section>

        <section className="section-block">
          <div className="words-header">
            <h3 className="section-title" style={{ margin: 0 }}>بنك الكلمات</h3>
            <span className="soft-text">{filteredWords.length} كلمة من القصص المعتمدة</span>
          </div>
          {filteredWords.length ? (
            <div className="words-row">
              {filteredWords.map((item) => (
                <div className="word-card" key={item.id}>
                  <button className="word-action word-speaker" onClick={() => playAudio(item.word)} title="استمع للنطق">
                    <i className="fa-solid fa-volume-high"></i>
                  </button>
                  <button
                    className={`word-action word-fav ${favorites[item.word] ? "active" : ""}`}
                    onClick={() => toggleFavorite(item.word)}
                    title={favorites[item.word] ? "إزالة من المفضلة" : "إضافة للمفضلة"}
                  >
                    <i className="fa-solid fa-heart"></i>
                  </button>
                  <span className="word-main">{item.word}</span>
                  <span className="word-translation">{item.translation || item.arabic || "بدون ترجمة"}</span>
                  <span className="word-story">{item.storyTitle}</span>
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
          ) : (
            <div className="empty-state">لا توجد كلمات مطابقة. أضف كلمات في قصص المعلمين المعتمدة لتظهر هنا.</div>
          )}
        </section>

        <section className="section-block">
          <h3 className="section-title">الأوسمة المحققة</h3>
          <div className="badges-row">
            {journey.badges?.map((badge) => (
              <div className={`badge-item ${badge.active ? "" : "locked"}`} key={badge.id}>
                <div className={`badge-circle ${badge.active ? badge.type : ""}`}>
                  <i className={`fa-solid ${badge.active ? badge.icon : "fa-lock"}`}></i>
                </div>
                <span className="badge-name">{badge.title}</span>
                <span className="badge-desc">{badge.desc}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="section-block">
          <h3 className="section-title">الاختبارات المتاحة</h3>
          {journey.quizzes?.length ? (
            <div className="quiz-grid">
              {journey.quizzes.map((quiz) => (
                <div className="quiz-card" key={quiz.id}>
                  <img src={getMediaUrl(quiz.thumbnail || quiz.story?.coverImage)} alt={quiz.title} />
                  <div className="quiz-body">
                    <span className="quiz-reward">
                      <i className="fa-solid fa-award"></i>
                      {quiz.xpReward || 0} XP
                    </span>
                    <h4 className="card-title">{quiz.title}</h4>
                    <div className="card-meta">
                      <span>{quiz.questionsCount} أسئلة</span>
                      <span>{quiz.level || quiz.story?.level || "غير محدد"}</span>
                    </div>
                    <p className="soft-text">{quiz.story?.title ? `مرتبط بقصة: ${quiz.story.title}` : "اختبار عام"}</p>
                    <button className="primary-btn" onClick={() => setActiveItem({ type: "quiz", ...quiz })}>
                      عرض الاختبار
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">لا توجد اختبارات معتمدة حاليا. ستظهر هنا بعد موافقة الإدارة عليها.</div>
          )}
        </section>

        <section className="section-block">
          <h3 className="section-title">المكتبة المكتملة</h3>
          {journey.completedStories?.length ? (
            <div className="cards-grid">
              {journey.completedStories.map((story) => (
                <div className="data-card" key={story.id}>
                  <img className="card-image" src={getMediaUrl(story.coverImage)} alt={story.title} />
                  <div className="card-body">
                    <h4 className="card-title">{story.title}</h4>
                    <div className="card-meta">
                      <span>تم الإكمال في: {formatDate(story.completedAt)}</span>
                      <span>{story.xp} XP</span>
                    </div>
                    <button className="primary-btn" onClick={() => setActiveItem({ type: "completed", ...story })}>
                      إعادة القراءة
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">لم يتم تسجيل قصص مكتملة بعد. عند حفظ تقدم الطالب ستظهر هنا تلقائيا.</div>
          )}
        </section>
      </div>

      {activeItem && (
        <div className="story-modal-overlay" onClick={() => setActiveItem(null)}>
          <div className="story-modal-card" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header-img">
              <img src={getMediaUrl(activeItem.coverImage || activeItem.thumbnail || activeItem.story?.coverImage)} alt={activeItem.title} />
              <button className="modal-close-btn" onClick={() => setActiveItem(null)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="modal-body">
              <h3 className="modal-title">{activeItem.title}</h3>
              <p className="modal-text">
                {activeItem.type === "quiz"
                  ? `هذا اختبار حقيقي معتمد يحتوي على ${activeItem.questionsCount} أسئلة ومكافأة ${activeItem.xpReward || 0} XP.`
                  : `تقدمك الحالي في هذه القصة هو ${activeItem.progress || completedPercent}% من المسار التعليمي.`}
              </p>
              {activeItem.type === "quiz" && (
                <div className="modal-questions">
                  {(activeItem.questions || []).map((question, index) => (
                    <div className="modal-question" key={question.id}>
                      <p className="modal-question-title">{index + 1}. {question.text}</p>
                      {question.options?.length > 0 && (
                        <div className="modal-options">
                          {question.options.map((option) => (
                            <span className="modal-option" key={option}>{option}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <button className="primary-btn" onClick={() => setActiveItem(null)}>
                حسنا
              </button>
            </div>
          </div>
        </div>
      )}

      {earnedBadges.length > 0 && (
        <div className="earned-badge-overlay" onClick={() => setEarnedBadges([])}>
          <div className="earned-badge-card" onClick={(event) => event.stopPropagation()}>
            <div className={`earned-badge-icon ${earnedBadges[0].type || ""}`}>
              <i className={`fa-solid ${earnedBadges[0].icon || "fa-award"}`}></i>
            </div>
            <h3 className="earned-badge-title">وسام جديد!</h3>
            <p className="earned-badge-text">
              لقد حصلت على وسام <strong>{earnedBadges[0].title}</strong>.
              {earnedBadges.length > 1 ? ` ومعه ${earnedBadges.length - 1} أوسمة أخرى.` : ""}
            </p>
            <button className="primary-btn" onClick={() => setEarnedBadges([])}>
              رائع
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default EducationalJourney;
