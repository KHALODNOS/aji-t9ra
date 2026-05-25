import React, { useEffect, useMemo, useState } from "react";
import api from "../../services/api";

const FALLBACK_AVATAR = "avatar.png";

const getMediaUrl = (path) => {
  if (!path) return `http://localhost:5000/${FALLBACK_AVATAR}`;
  if (path.startsWith("http")) return path;
  return `http://localhost:5000/${path.replace(/\\/g, "/")}`;
};

const levelLabels = {
  Beginner: "مبتدئ",
  Intermediate: "متوسط",
  Advanced: "متقدم",
};

const StudentTracking = () => {
  const [leaderboard, setLeaderboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchText, setSearchText] = useState("");
  const [languageFilter, setLanguageFilter] = useState("all");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await api.get("/teacher/leaderboard");
        setLeaderboard(response.data);
      } catch (err) {
        console.error("Error loading teacher leaderboard:", err);
        setError(err.response?.data?.message || "تعذر تحميل لوحة الطلاب.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const languages = useMemo(() => {
    const values = new Set((leaderboard?.students || []).map((student) => student.targetLanguage).filter(Boolean));
    return ["all", ...values];
  }, [leaderboard]);

  const filteredStudents = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    return (leaderboard?.students || []).filter((student) => {
      const matchesLanguage = languageFilter === "all" || student.targetLanguage === languageFilter;
      const matchesSearch = !q ||
        [student.name, student.targetLanguage, student.level]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(q));

      return matchesLanguage && matchesSearch;
    });
  }, [leaderboard, languageFilter, searchText]);

  if (loading) {
    return (
      <div className="teacher-board-state" dir="rtl">
        <i className="fa-solid fa-circle-notch fa-spin"></i>
        <span>جاري تحميل لوحة الطلاب الحقيقية...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="teacher-board-state error" dir="rtl">
        <i className="fa-solid fa-triangle-exclamation"></i>
        <span>{error}</span>
      </div>
    );
  }

  const stats = leaderboard?.stats || {};
  const topThree = leaderboard?.topThree || [];

  return (
    <div className="content-area" dir="rtl">
      <style>{`
        .teacher-board-state {
          min-height: 420px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          color: var(--teacher-primary);
          font-weight: 900;
        }

        .teacher-board-state.error {
          color: #b91c1c;
        }

        .teacher-board-header {
          display: flex;
          justify-content: space-between;
          align-items: end;
          gap: 20px;
          margin-bottom: 28px;
        }

        .teacher-board-title {
          margin: 0;
          font-size: 1.85rem;
          font-weight: 900;
          color: var(--teacher-primary);
        }

        .teacher-board-subtitle {
          margin: 7px 0 0;
          color: #64748b;
          font-size: 0.92rem;
          font-weight: 700;
        }

        .teacher-board-actions {
          display: flex;
          gap: 10px;
          align-items: center;
          flex-wrap: wrap;
        }

        .teacher-board-search {
          position: relative;
          width: min(330px, 100%);
        }

        .teacher-board-search i {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }

        .teacher-board-search input,
        .teacher-board-select {
          border: 1px solid #e2e8f0;
          background: #ffffff;
          border-radius: 14px;
          padding: 11px 14px;
          font-family: inherit;
          font-weight: 800;
          outline: none;
        }

        .teacher-board-search input {
          width: 100%;
          padding-left: 40px;
        }

        .teacher-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
          margin-bottom: 28px;
        }

        .teacher-stat-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 20px;
          box-shadow: var(--teacher-card-shadow);
        }

        .teacher-stat-label {
          display: block;
          color: #64748b;
          font-size: 0.78rem;
          font-weight: 900;
          margin-bottom: 8px;
        }

        .teacher-stat-value {
          color: var(--teacher-primary);
          font-size: 1.45rem;
          font-weight: 900;
        }

        .teacher-top-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
          margin-bottom: 28px;
        }

        .teacher-top-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 22px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 14px;
          box-shadow: var(--teacher-card-shadow);
        }

        .teacher-top-rank {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: #fef3c7;
          color: #b45309;
          font-weight: 900;
          flex-shrink: 0;
        }

        .teacher-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid #e2e8f0;
          flex-shrink: 0;
        }

        .teacher-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .teacher-student-name {
          display: block;
          color: var(--teacher-primary);
          font-weight: 900;
        }

        .teacher-student-meta {
          display: block;
          color: #64748b;
          font-size: 0.76rem;
          font-weight: 800;
          margin-top: 4px;
        }

        .teacher-table-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 24px;
          padding: 24px;
          box-shadow: var(--teacher-card-shadow);
          overflow-x: auto;
        }

        .teacher-students-table {
          width: 100%;
          border-collapse: collapse;
          text-align: right;
          min-width: 860px;
        }

        .teacher-students-table th {
          padding: 14px 12px;
          color: #94a3b8;
          font-size: 0.78rem;
          font-weight: 900;
          border-bottom: 2px solid #f1f5f9;
        }

        .teacher-students-table td {
          padding: 16px 12px;
          border-bottom: 1px solid #f8fafc;
          color: #334155;
          font-weight: 800;
        }

        .student-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .rank-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 42px;
          padding: 6px 10px;
          border-radius: 999px;
          background: #f1f5f9;
          color: #475569;
          font-weight: 900;
        }

        .xp-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 12px;
          border-radius: 999px;
          background: #fffbeb;
          color: #b45309;
          font-weight: 900;
        }

        .score-bar {
          width: 92px;
          height: 7px;
          border-radius: 999px;
          background: #f1f5f9;
          overflow: hidden;
          margin-top: 7px;
        }

        .score-bar-fill {
          height: 100%;
          background: #f9c851;
        }

        .empty-board {
          border: 1px dashed #cbd5e1;
          border-radius: 18px;
          padding: 28px;
          text-align: center;
          color: #64748b;
          font-weight: 900;
        }

        @media (max-width: 980px) {
          .teacher-stats-grid,
          .teacher-top-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .teacher-board-header {
            flex-direction: column;
            align-items: stretch;
          }
        }

        @media (max-width: 680px) {
          .teacher-stats-grid,
          .teacher-top-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <header className="teacher-board-header">
        <div>
          <h1 className="teacher-board-title">لوحة الطلاب</h1>
          <p className="teacher-board-subtitle">بيانات حقيقية من حسابات الطلاب ونقاط XP المحفوظة في تقدمهم.</p>
        </div>
        <div className="teacher-board-actions">
          <div className="teacher-board-search">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="ابحث عن طالب..."
            />
          </div>
          <select
            className="teacher-board-select"
            value={languageFilter}
            onChange={(event) => setLanguageFilter(event.target.value)}
          >
            {languages.map((language) => (
              <option value={language} key={language}>
                {language === "all" ? "كل اللغات" : language}
              </option>
            ))}
          </select>
        </div>
      </header>

      <section className="teacher-stats-grid">
        <div className="teacher-stat-card">
          <span className="teacher-stat-label">إجمالي الطلاب</span>
          <span className="teacher-stat-value">{stats.totalStudents || 0}</span>
        </div>
        <div className="teacher-stat-card">
          <span className="teacher-stat-label">طلاب نشطون</span>
          <span className="teacher-stat-value">{stats.activeStudents || 0}</span>
        </div>
        <div className="teacher-stat-card">
          <span className="teacher-stat-label">مجموع XP</span>
          <span className="teacher-stat-value">{(stats.totalXp || 0).toLocaleString("en-US")}</span>
        </div>
        <div className="teacher-stat-card">
          <span className="teacher-stat-label">متوسط الاختبارات</span>
          <span className="teacher-stat-value">{stats.averageQuizScore || 0}%</span>
        </div>
      </section>

      {topThree.length > 0 && (
        <section className="teacher-top-grid">
          {topThree.map((student) => (
            <article className="teacher-top-card" key={student.id}>
              <div className="teacher-top-rank">#{student.rank}</div>
              <div className="teacher-avatar">
                <img src={getMediaUrl(student.avatar)} alt={student.name} />
              </div>
              <div>
                <span className="teacher-student-name">{student.name}</span>
                <span className="teacher-student-meta">{student.xp.toLocaleString("en-US")} XP · {student.completedStoriesCount} قصص</span>
              </div>
            </article>
          ))}
        </section>
      )}

      <section className="teacher-table-card">
        <h3 style={{ margin: "0 0 18px", color: "var(--teacher-primary)", fontWeight: 900 }}>ترتيب الطلاب الحقيقي</h3>
        {filteredStudents.length ? (
          <table className="teacher-students-table">
            <thead>
              <tr>
                <th>الترتيب</th>
                <th>الطالب</th>
                <th>اللغة / المستوى</th>
                <th>القصص</th>
                <th>الاختبارات</th>
                <th>متوسط النتائج</th>
                <th>رسائل AI</th>
                <th>XP</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td><span className="rank-pill">#{student.rank}</span></td>
                  <td>
                    <div className="student-cell">
                      <div className="teacher-avatar">
                        <img src={getMediaUrl(student.avatar)} alt={student.name} />
                      </div>
                      <div>
                        <span className="teacher-student-name">{student.name}</span>
                        <span className="teacher-student-meta">{student.status === "active" ? "نشط" : student.status}</span>
                      </div>
                    </div>
                  </td>
                  <td>{student.targetLanguage || "عام"} · {levelLabels[student.level] || student.level}</td>
                  <td>{student.completedStoriesCount || 0}</td>
                  <td>{student.passedQuizzesCount || 0} / {student.quizAttemptsCount || 0}</td>
                  <td>
                    <span>{student.averageQuizScore || 0}%</span>
                    <div className="score-bar">
                      <div className="score-bar-fill" style={{ width: `${Math.min(100, student.averageQuizScore || 0)}%` }}></div>
                    </div>
                  </td>
                  <td>{student.aiMessagesCount || 0}</td>
                  <td>
                    <span className="xp-pill">
                      <i className="fa-solid fa-star"></i>
                      {student.xp.toLocaleString("en-US")} XP
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-board">لا توجد بيانات طلاب مطابقة للفلاتر الحالية.</div>
        )}
      </section>
    </div>
  );
};

export default StudentTracking;
