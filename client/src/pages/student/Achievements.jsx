import React, { useEffect, useMemo, useState } from "react";
import api from "../../services/api";

const filters = ["الكل", "القصص", "الفيديوهات", "الدردشة", "الذكاء", "النقاط"];

const getBadgeCategory = (badge) => {
  if (badge.id.includes("story") || badge.id.includes("reader") || badge.id.includes("tifinagh") || badge.id.includes("word")) return "القصص";
  if (badge.id.includes("video")) return "الفيديوهات";
  if (badge.id.includes("chat_voice")) return "الدردشة";
  if (badge.id.includes("ai")) return "الذكاء";
  if (badge.id.includes("xp") || badge.id.includes("quiz")) return "النقاط";
  return "الكل";
};

const Achievements = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("الكل");
  const [selectedBadge, setSelectedBadge] = useState(null);

  const fetchAchievements = async ({ quiet = false } = {}) => {
    if (!quiet) setLoading(true);
    setError("");
    try {
      const response = await api.get("/student/journey/achievements");
      setData(response.data);
    } catch (err) {
      console.error("Error loading achievements:", err);
      setError(err.response?.data?.message || "تعذر تحميل الأوسمة.");
    } finally {
      if (!quiet) setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  useEffect(() => {
    const refresh = () => fetchAchievements({ quiet: true });
    window.addEventListener("newlyEarnedBadges", refresh);
    window.addEventListener("studentXpReward", refresh);
    return () => {
      window.removeEventListener("newlyEarnedBadges", refresh);
      window.removeEventListener("studentXpReward", refresh);
    };
  }, []);

  const badges = data?.badges || [];
  const filteredBadges = useMemo(() => (
    badges.filter((badge) => selectedFilter === "الكل" || getBadgeCategory(badge) === selectedFilter)
  ), [badges, selectedFilter]);

  const stats = data?.stats || {};
  const progressPercent = data?.totalCount ? Math.round(((data?.unlockedCount || 0) / data.totalCount) * 100) : 0;

  if (loading) {
    return (
      <div className="achievements-state" dir="rtl">
        <i className="fa-solid fa-circle-notch fa-spin"></i>
        <span>جاري تحميل أوسمتك الحقيقية...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="achievements-state error" dir="rtl">
        <i className="fa-solid fa-triangle-exclamation"></i>
        <span>{error}</span>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css');

        .achievements-page {
          direction: rtl;
          font-family: 'Tajawal', sans-serif;
          color: #172033;
        }

        .achievements-state {
          min-height: 420px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          color: #5DA296;
          font-family: 'Tajawal', sans-serif;
          font-weight: 900;
        }

        .achievements-state.error { color: #b91c1c; }

        .achievements-header {
          display: flex;
          justify-content: space-between;
          align-items: end;
          gap: 20px;
          margin-bottom: 26px;
        }

        .achievements-title {
          margin: 0;
          color: #5DA296;
          font-size: 1.85rem;
          font-weight: 900;
        }

        .achievements-subtitle {
          margin: 7px 0 0;
          color: #64748b;
          font-size: 0.92rem;
          font-weight: 700;
        }

        .level-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 26px;
          padding: 24px;
          display: grid;
          grid-template-columns: 1fr 130px;
          gap: 24px;
          align-items: center;
          box-shadow: 0 12px 30px rgba(15, 23, 42, 0.045);
          margin-bottom: 26px;
        }

        .progress-title {
          margin: 0 0 12px;
          color: #5DA296;
          font-size: 1.2rem;
          font-weight: 900;
        }

        .progress-bar {
          height: 12px;
          border-radius: 999px;
          background: #f1f5f9;
          overflow: hidden;
          margin-bottom: 16px;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #f9c851, #5DA296);
        }

        .mini-stats {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
        }

        .mini-stat {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 12px;
        }

        .mini-stat span {
          display: block;
          color: #64748b;
          font-size: 0.72rem;
          font-weight: 900;
          margin-bottom: 5px;
        }

        .mini-stat strong {
          color: #3d6b64;
          font-size: 1rem;
          font-weight: 900;
        }

        .radial {
          width: 126px;
          height: 126px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: conic-gradient(#5DA296 ${progressPercent}%, #eef2f7 0);
          position: relative;
        }

        .radial::after {
          content: "";
          position: absolute;
          inset: 12px;
          border-radius: 50%;
          background: #ffffff;
        }

        .radial-text {
          position: relative;
          z-index: 1;
          text-align: center;
          color: #5DA296;
          font-weight: 900;
        }

        .filter-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 22px;
        }

        .filter-btn {
          border: 1px solid #e2e8f0;
          background: #ffffff;
          color: #64748b;
          border-radius: 999px;
          padding: 9px 16px;
          font-family: inherit;
          font-weight: 900;
          cursor: pointer;
        }

        .filter-btn.active {
          background: #5DA296;
          color: #ffffff;
          border-color: #5DA296;
        }

        .badges-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 18px;
          margin-bottom: 28px;
        }

        .badge-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 22px;
          padding: 20px;
          box-shadow: 0 10px 24px rgba(15, 23, 42, 0.04);
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .badge-card.locked {
          opacity: 0.68;
          background: #f8fafc;
        }

        .badge-icon {
          width: 60px;
          height: 60px;
          border-radius: 18px;
          display: grid;
          place-items: center;
          color: #ffffff;
          background: #5DA296;
          font-size: 1.35rem;
          margin-bottom: 14px;
        }

        .badge-icon.gold { background: linear-gradient(135deg, #f9c851, #5DA296); }
        .badge-icon.brown { background: #5DA296; }
        .badge-card.locked .badge-icon { background: #94a3b8; }

        .badge-title {
          margin: 0 0 7px;
          color: #315b55;
          font-size: 1rem;
          font-weight: 900;
        }

        .badge-desc {
          margin: 0 0 14px;
          color: #64748b;
          font-size: 0.82rem;
          line-height: 1.55;
          font-weight: 700;
        }

        .badge-progress {
          height: 8px;
          border-radius: 999px;
          background: #e2e8f0;
          overflow: hidden;
        }

        .badge-progress-fill {
          height: 100%;
          background: #f9c851;
        }

        .badge-state {
          position: absolute;
          top: 16px;
          left: 16px;
          border-radius: 999px;
          padding: 4px 9px;
          font-size: 0.68rem;
          font-weight: 900;
          background: #f2f8f7;
          color: #5DA296;
        }

        .badge-card.locked .badge-state {
          background: #e2e8f0;
          color: #475569;
        }

        .timeline-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 24px;
          padding: 24px;
          box-shadow: 0 10px 24px rgba(15, 23, 42, 0.04);
        }

        .timeline-title {
          margin: 0 0 16px;
          color: #5DA296;
          font-size: 1.1rem;
          font-weight: 900;
        }

        .timeline-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 0;
          border-bottom: 1px solid #f1f5f9;
        }

        .timeline-row:last-child { border-bottom: 0; }

        .timeline-dot {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          color: #ffffff;
          background: #5DA296;
          flex-shrink: 0;
        }

        .badge-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.58);
          z-index: 1300;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          backdrop-filter: blur(4px);
        }

        .badge-modal {
          width: min(420px, 100%);
          background: #ffffff;
          border-radius: 24px;
          padding: 26px;
          text-align: center;
        }

        @media (max-width: 1050px) {
          .badges-grid, .mini-stats {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .level-card {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 680px) {
          .achievements-header {
            flex-direction: column;
            align-items: stretch;
          }
          .badges-grid, .mini-stats {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="achievements-page">
        <header className="achievements-header">
          <div>
            <h2 className="achievements-title">الأوسمة والإنجازات</h2>
            <p className="achievements-subtitle">كل وسام هنا يفتح حسب تقدمك الحقيقي في القصص، الفيديوهات، الدردشة والذكاء الاصطناعي.</p>
          </div>
        </header>

        <section className="level-card">
          <div>
            <h3 className="progress-title">تقدم فتح الأوسمة</h3>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
            </div>
            <div className="mini-stats">
              <div className="mini-stat"><span>الأوسمة المفتوحة</span><strong>{data?.unlockedCount || 0}/{data?.totalCount || 0}</strong></div>
              <div className="mini-stat"><span>القصص المكتملة</span><strong>{stats.completedStoriesCount || 0}</strong></div>
              <div className="mini-stat"><span>الفيديوهات</span><strong>{stats.watchedVideosCount || 0}</strong></div>
              <div className="mini-stat"><span>رسائل AI</span><strong>{stats.aiMessagesCount || 0}</strong></div>
            </div>
          </div>
          <div className="radial">
            <div className="radial-text">
              <div>{progressPercent}%</div>
              <small>مفتوح</small>
            </div>
          </div>
        </section>

        <div className="filter-row">
          {filters.map((filter) => (
            <button
              key={filter}
              className={`filter-btn ${selectedFilter === filter ? "active" : ""}`}
              onClick={() => setSelectedFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        <section className="badges-grid">
          {filteredBadges.map((badge) => (
            <article
              className={`badge-card ${badge.active ? "" : "locked"}`}
              key={badge.id}
              onClick={() => setSelectedBadge(badge)}
            >
              <span className="badge-state">{badge.active ? "مفتوح" : "مغلق"}</span>
              <div className={`badge-icon ${badge.type || ""}`}>
                <i className={`fa-solid ${badge.active ? badge.icon || "fa-award" : "fa-lock"}`}></i>
              </div>
              <h3 className="badge-title">{badge.title}</h3>
              <p className="badge-desc">{badge.desc}</p>
              {badge.target ? (
                <div>
                  <div className="badge-progress">
                    <div className="badge-progress-fill" style={{ width: `${badge.percent || 0}%` }}></div>
                  </div>
                  <small style={{ color: "#64748b", fontWeight: 900 }}>
                    {badge.progress || 0}/{badge.target}
                  </small>
                </div>
              ) : null}
            </article>
          ))}
        </section>

        <section className="timeline-card">
          <h3 className="timeline-title">آخر الأوسمة المفتوحة</h3>
          {data?.recent?.length ? data.recent.map((badge) => (
            <div className="timeline-row" key={badge.id}>
              <div className="timeline-dot">
                <i className={`fa-solid ${badge.icon || "fa-award"}`}></i>
              </div>
              <div>
                <strong>{badge.title}</strong>
                <div style={{ color: "#64748b", fontWeight: 700, marginTop: 3 }}>{badge.desc}</div>
              </div>
            </div>
          )) : (
            <div style={{ color: "#64748b", fontWeight: 900 }}>لم يتم فتح أوسمة بعد. ابدأ بالقراءة أو مشاهدة فيديو.</div>
          )}
        </section>
      </div>

      {selectedBadge && (
        <div className="badge-modal-overlay" onClick={() => setSelectedBadge(null)}>
          <div className="badge-modal" onClick={(event) => event.stopPropagation()}>
            <div className={`badge-icon ${selectedBadge.type || ""}`} style={{ margin: "0 auto 14px" }}>
              <i className={`fa-solid ${selectedBadge.active ? selectedBadge.icon || "fa-award" : "fa-lock"}`}></i>
            </div>
            <h3 className="badge-title">{selectedBadge.title}</h3>
            <p className="badge-desc">{selectedBadge.desc}</p>
            {selectedBadge.target ? (
              <strong>{selectedBadge.progress || 0}/{selectedBadge.target}</strong>
            ) : null}
            <button className="filter-btn active" style={{ marginTop: 18 }} onClick={() => setSelectedBadge(null)}>
              حسناً
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Achievements;
