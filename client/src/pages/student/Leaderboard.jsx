import React, { useEffect, useMemo, useState } from "react";
import api from "../../services/api";

const FALLBACK_AVATAR = "avatar.png";

const getMediaUrl = (path) => {
  if (!path) return FALLBACK_AVATAR;
  if (path.startsWith("http")) return path;
  return `http://localhost:5000/${path.replace(/\\/g, "/")}`;
};

const levelLabels = {
  Beginner: "مبتدئ",
  Intermediate: "متوسط",
  Advanced: "متقدم",
};

const medalConfig = {
  1: { className: "gold", icon: "fa-crown", label: "المركز الأول" },
  2: { className: "silver", icon: "fa-medal", label: "المركز الثاني" },
  3: { className: "bronze", icon: "fa-award", label: "المركز الثالث" },
};

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchText, setSearchText] = useState("");
  const [highlightXp, setHighlightXp] = useState(null);

  const fetchLeaderboard = async ({ quiet = false } = {}) => {
    if (!quiet) setLoading(true);
    setError("");
    try {
      const response = await api.get("/student/journey/leaderboard");
      setLeaderboard(response.data);
    } catch (err) {
      console.error("Error loading leaderboard:", err);
      setError(err.response?.data?.message || "تعذر تحميل لوحة الصدارة.");
    } finally {
      if (!quiet) setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  useEffect(() => {
    const handleXpReward = (event) => {
      const amount = Number(event.detail?.xpAwarded) || 0;
      if (!amount) return;

      setHighlightXp(amount);
      window.clearTimeout(handleXpReward.timeoutId);
      handleXpReward.timeoutId = window.setTimeout(() => setHighlightXp(null), 2200);
      window.setTimeout(() => fetchLeaderboard({ quiet: true }), 450);
    };

    window.addEventListener("studentXpReward", handleXpReward);
    return () => {
      window.removeEventListener("studentXpReward", handleXpReward);
      window.clearTimeout(handleXpReward.timeoutId);
    };
  }, []);

  const allRows = useMemo(() => {
    const top = leaderboard?.topThree || [];
    const entries = leaderboard?.entries || [];
    return [...top, ...entries];
  }, [leaderboard]);

  const filteredRows = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return allRows;
    return allRows.filter((student) =>
      [student.name, student.targetLanguage, student.level]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(q))
    );
  }, [allRows, searchText]);

  const podium = leaderboard?.topThree || [];
  const orderedPodium = [podium[1], podium[0], podium[2]].filter(Boolean);
  const listRows = searchText ? filteredRows : (leaderboard?.entries || []);
  const currentUser = leaderboard?.currentUser;

  if (loading) {
    return (
      <div className="leaderboard-state" dir="rtl">
        <i className="fa-solid fa-circle-notch fa-spin"></i>
        <span>جاري تحميل لوحة الصدارة الحقيقية...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="leaderboard-state error" dir="rtl">
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

        .leaderboard-page {
          direction: rtl;
          font-family: 'Tajawal', sans-serif;
          color: #172033;
          padding-bottom: 92px;
        }

        .leaderboard-state {
          min-height: 420px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          color: #00458b;
          font-family: 'Tajawal', sans-serif;
          font-weight: 900;
        }

        .leaderboard-state.error {
          color: #b91c1c;
        }

        .leaderboard-header {
          display: flex;
          justify-content: space-between;
          align-items: end;
          gap: 20px;
          margin-bottom: 28px;
        }

        .leaderboard-title {
          margin: 0;
          color: #00458b;
          font-size: 1.85rem;
          font-weight: 900;
        }

        .leaderboard-subtitle {
          margin: 7px 0 0;
          color: #64748b;
          font-size: 0.93rem;
          font-weight: 700;
        }

        .leaderboard-search {
          position: relative;
          width: min(360px, 100%);
        }

        .leaderboard-search i {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }

        .leaderboard-search input {
          width: 100%;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          border-radius: 16px;
          padding: 12px 16px 12px 42px;
          font-family: inherit;
          font-weight: 800;
          outline: none;
        }

        .leaderboard-summary {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
          margin-bottom: 34px;
        }

        .summary-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 22px;
          padding: 18px;
          box-shadow: 0 10px 24px rgba(15, 23, 42, 0.04);
        }

        .summary-label {
          display: block;
          color: #64748b;
          font-size: 0.76rem;
          font-weight: 900;
          margin-bottom: 8px;
        }

        .summary-value {
          color: #00458b;
          font-size: 1.35rem;
          font-weight: 900;
        }

        .podium-container {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          align-items: end;
          gap: 22px;
          margin-bottom: 34px;
        }

        .podium-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 26px;
          padding: 24px;
          text-align: center;
          box-shadow: 0 14px 32px rgba(15, 23, 42, 0.06);
          position: relative;
        }

        .podium-card.rank-1 {
          min-height: 305px;
          border-color: rgba(249, 200, 81, 0.55);
          box-shadow: 0 18px 44px rgba(249, 200, 81, 0.16);
        }

        .podium-card.rank-2 { min-height: 265px; }
        .podium-card.rank-3 { min-height: 245px; }

        .podium-medal {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          color: #ffffff;
          font-size: 1rem;
        }

        .podium-medal.gold { background: #f59e0b; color: #78350f; }
        .podium-medal.silver { background: #cbd5e1; color: #475569; }
        .podium-medal.bronze { background: #b45309; }

        .podium-avatar {
          width: 96px;
          height: 96px;
          border-radius: 50%;
          margin: 18px auto 14px;
          overflow: hidden;
          border: 4px solid #f1f5f9;
        }

        .rank-1 .podium-avatar {
          width: 116px;
          height: 116px;
          border-color: #f9c851;
        }

        .podium-avatar img,
        .row-avatar img,
        .sticky-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .podium-name {
          margin: 0 0 8px;
          color: #00458b;
          font-size: 1.05rem;
          font-weight: 900;
        }

        .podium-xp {
          display: inline-flex;
          background: #fef3c7;
          color: #b45309;
          border: 1px solid #fde68a;
          border-radius: 999px;
          padding: 7px 14px;
          font-weight: 900;
          font-size: 0.85rem;
        }

        .podium-meta {
          margin-top: 12px;
          color: #64748b;
          font-size: 0.78rem;
          font-weight: 800;
        }

        .leaderboard-list {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 26px;
          padding: 24px;
          box-shadow: 0 12px 30px rgba(15, 23, 42, 0.045);
        }

        .section-title {
          margin: 0 0 18px;
          color: #172033;
          font-size: 1.05rem;
          font-weight: 900;
        }

        .leaderboard-row {
          display: grid;
          grid-template-columns: 64px 1fr auto;
          align-items: center;
          gap: 16px;
          padding: 14px;
          border: 1px solid #f1f5f9;
          border-radius: 18px;
          margin-bottom: 12px;
        }

        .leaderboard-row.current {
          border-color: #f9c851;
          background: #fffbeb;
        }

        .rank-number {
          color: #94a3b8;
          font-size: 1.1rem;
          font-weight: 900;
        }

        .row-student {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }

        .row-avatar {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid #e2e8f0;
          flex-shrink: 0;
        }

        .row-name {
          display: block;
          color: #172033;
          font-weight: 900;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .row-meta {
          display: block;
          color: #64748b;
          font-size: 0.76rem;
          font-weight: 800;
          margin-top: 3px;
        }

        .row-xp {
          color: #00458b;
          font-weight: 900;
          white-space: nowrap;
        }

        .empty-state {
          border: 1px dashed #cbd5e1;
          border-radius: 20px;
          padding: 30px;
          text-align: center;
          color: #64748b;
          font-weight: 900;
        }

        .sticky-rank-bar {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 20;
          background: #00458b;
          color: #ffffff;
          padding: 14px 34px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          box-shadow: 0 -10px 28px rgba(0, 69, 139, 0.2);
        }

        .sticky-user {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .sticky-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid #ffffff;
        }

        .sticky-rank {
          font-weight: 900;
        }

        .sticky-xp {
          color: #f9c851;
          font-weight: 900;
          font-size: 1.05rem;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .sticky-xp.bump {
          animation: rank-xp-bump 0.8s ease both;
        }

        @keyframes rank-xp-bump {
          0% { transform: scale(1); }
          45% { transform: scale(1.08); }
          100% { transform: scale(1); }
        }

        @media (max-width: 960px) {
          .leaderboard-summary, .podium-container {
            grid-template-columns: 1fr;
          }
          .podium-card,
          .podium-card.rank-1,
          .podium-card.rank-2,
          .podium-card.rank-3 {
            min-height: auto;
          }
        }

        @media (max-width: 680px) {
          .leaderboard-header {
            flex-direction: column;
            align-items: stretch;
          }
          .leaderboard-row {
            grid-template-columns: 44px 1fr;
          }
          .row-xp {
            grid-column: 2;
          }
          .sticky-rank-bar {
            flex-direction: column;
            align-items: stretch;
          }
        }
      `}</style>

      <div className="leaderboard-page">
        <header className="leaderboard-header">
          <div>
            <h2 className="leaderboard-title">لوحة الصدارة</h2>
            <p className="leaderboard-subtitle">ترتيب حقيقي حسب نقاط XP التي يجمعها الطلاب من القصص، الاختبارات، الذكاء الاصطناعي والصالونات الصوتية.</p>
          </div>
          <div className="leaderboard-search">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="ابحث عن طالب أو مستوى..."
            />
          </div>
        </header>

        <section className="leaderboard-summary">
          <div className="summary-card">
            <span className="summary-label">ترتيبك الحالي</span>
            <span className="summary-value">#{currentUser?.rank || "-"}</span>
          </div>
          <div className="summary-card">
            <span className="summary-label">نقاطك</span>
            <span className="summary-value">{currentUser?.xp || 0} XP</span>
          </div>
          <div className="summary-card">
            <span className="summary-label">عدد الطلاب</span>
            <span className="summary-value">{leaderboard?.totalStudents || 0}</span>
          </div>
          <div className="summary-card">
            <span className="summary-label">قصصك المكتملة</span>
            <span className="summary-value">{currentUser?.completedStoriesCount || 0}</span>
          </div>
        </section>

        {podium.length > 0 && !searchText && (
          <section className="podium-container">
            {orderedPodium.map((student) => {
              const medal = medalConfig[student.rank] || medalConfig[3];
              return (
                <article className={`podium-card rank-${student.rank}`} key={student.id}>
                  <div className={`podium-medal ${medal.className}`}>
                    <i className={`fa-solid ${medal.icon}`}></i>
                  </div>
                  <div className="podium-avatar">
                    <img src={getMediaUrl(student.avatar)} alt={student.name} />
                  </div>
                  <h3 className="podium-name">{student.name}</h3>
                  <span className="podium-xp">{student.xp.toLocaleString("en-US")} XP</span>
                  <div className="podium-meta">
                    {medal.label} · {levelLabels[student.level] || student.level}
                  </div>
                </article>
              );
            })}
          </section>
        )}

        <section className="leaderboard-list">
          <h3 className="section-title">{searchText ? "نتائج البحث" : "باقي المتنافسين"}</h3>
          {listRows.length ? (
            listRows.map((student) => (
              <div className={`leaderboard-row ${student.isCurrentUser ? "current" : ""}`} key={student.id}>
                <span className="rank-number">#{student.rank}</span>
                <div className="row-student">
                  <div className="row-avatar">
                    <img src={getMediaUrl(student.avatar)} alt={student.name} />
                  </div>
                  <div>
                    <span className="row-name">{student.name}</span>
                    <span className="row-meta">
                      {levelLabels[student.level] || student.level} · {student.completedStoriesCount || 0} قصص · {student.passedQuizzesCount || 0} اختبارات
                    </span>
                  </div>
                </div>
                <span className="row-xp">{student.xp.toLocaleString("en-US")} XP</span>
              </div>
            ))
          ) : (
            <div className="empty-state">لا توجد نتائج مطابقة حالياً.</div>
          )}
        </section>
      </div>

      {currentUser && (
        <footer className="sticky-rank-bar">
          <div className="sticky-user">
            <div className="sticky-avatar">
              <img src={getMediaUrl(currentUser.avatar)} alt={currentUser.name} />
            </div>
            <span className="sticky-rank">ترتيبك الحالي: #{currentUser.rank}</span>
          </div>
          <div className={`sticky-xp ${highlightXp ? "bump" : ""}`}>
            <i className="fa-solid fa-star"></i>
            <span>{currentUser.xp.toLocaleString("en-US")} XP</span>
            {highlightXp ? <span>+{highlightXp}</span> : null}
          </div>
        </footer>
      )}
    </>
  );
};

export default Leaderboard;
