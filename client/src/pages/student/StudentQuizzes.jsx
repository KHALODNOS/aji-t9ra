import React, { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import { publishStudentRewards } from "../../utils/studentRewards";

const FALLBACK_QUIZ_IMAGE = "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=900&auto=format&fit=crop&q=80";

const getMediaUrl = (path) => {
  if (!path) return FALLBACK_QUIZ_IMAGE;
  if (path.startsWith("http")) return path;
  return `http://localhost:5000/${path.replace(/\\/g, "/")}`;
};

const languageLabels = {
  Arabic: "العربية",
  French: "الفرنسية",
  English: "الإنجليزية",
  Tifinagh: "تيفيناغ",
};

const questionTypeLabels = {
  choice: "اختيار من متعدد",
  translate: "ترجمة",
  fill_blanks: "ملء الفراغ",
  correct_form: "الصيغة الصحيحة",
};

const StudentQuizzes = ({ onOpenJourney }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchText, setSearchText] = useState("");
  const [languageFilter, setLanguageFilter] = useState("all");
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await api.get("/student/journey/quizzes");
        setQuizzes(response.data || []);
      } catch (err) {
        console.error("Error fetching student quizzes:", err);
        setError(err.response?.data?.message || "تعذر تحميل الاختبارات.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const languages = useMemo(() => {
    const values = new Set(quizzes.map((quiz) => quiz.language || quiz.story?.language).filter(Boolean));
    return ["all", ...values];
  }, [quizzes]);

  const filteredQuizzes = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    return quizzes.filter((quiz) => {
      const quizLanguage = quiz.language || quiz.story?.language;
      const matchesLanguage = languageFilter === "all" || quizLanguage === languageFilter;
      const matchesSearch = !q ||
        quiz.title.toLowerCase().includes(q) ||
        (quiz.story?.title || "").toLowerCase().includes(q);

      return matchesLanguage && matchesSearch;
    });
  }, [quizzes, searchText, languageFilter]);

  const showToast = (message) => {
    setToast(message);
    window.clearTimeout(showToast.timeoutId);
    showToast.timeoutId = window.setTimeout(() => setToast(""), 2400);
  };

  const startQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setActiveQuestion(0);
    setAnswers({});
    setResult(null);
  };

  const updateAnswer = (questionIndex, answer) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: answer }));
  };

  const handleEarnedBadges = (earnedBadges = []) => {
    if (!earnedBadges.length) return;

    showToast("تهانينا! حصلت على وسام جديد.");
    if (onOpenJourney) {
      window.setTimeout(() => onOpenJourney(), 700);
    }
  };

  const submitQuiz = async () => {
    if (!activeQuiz) return;

    const payload = {
      answers: activeQuiz.questions.map((question) => ({
        questionIndex: question.index,
        answer: answers[question.index] || "",
      })),
    };

    setSubmitting(true);
    try {
      const response = await api.post(`/student/journey/quizzes/${activeQuiz.id}/attempts`, payload);
      setResult(response.data);
      setQuizzes((prev) => prev.map((quiz) => (
        quiz.id === activeQuiz.id
          ? {
              ...quiz,
              attemptsCount: (quiz.attemptsCount || 0) + 1,
              lastScore: response.data.score,
              bestScore: Math.max(quiz.bestScore || 0, response.data.score),
            }
          : quiz
      )));
      publishStudentRewards({
        xpAwarded: response.data?.xpAwarded,
        totalXp: response.data?.totalXp,
        earnedBadges: response.data?.earnedBadges || [],
        reason: "quiz",
      });
      if (response.data?.xpAwarded) {
        showToast(`+${response.data.xpAwarded} XP`);
      }
      handleEarnedBadges(response.data?.earnedBadges || []);
    } catch (err) {
      console.error("Error submitting quiz:", err);
      showToast(err.response?.data?.message || "تعذر إرسال الاختبار.");
    } finally {
      setSubmitting(false);
    }
  };

  const answeredCount = activeQuiz
    ? activeQuiz.questions.filter((question) => String(answers[question.index] || "").trim()).length
    : 0;
  const currentQuestion = activeQuiz?.questions?.[activeQuestion] || null;
  const canGoNext = currentQuestion && String(answers[currentQuestion.index] || "").trim();

  if (loading) {
    return (
      <div className="quizzes-state" dir="rtl">
        <i className="fa-solid fa-circle-notch fa-spin"></i>
        <span>جاري تحميل الاختبارات...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quizzes-state error" dir="rtl">
        <i className="fa-solid fa-triangle-exclamation"></i>
        <span>{error}</span>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');

        .quizzes-page {
          direction: rtl;
          font-family: 'Tajawal', sans-serif;
          color: #172033;
        }

        .quizzes-state {
          min-height: 420px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          color: #00458b;
          font-family: 'Tajawal', sans-serif;
          font-weight: 900;
        }

        .quizzes-state.error {
          color: #b91c1c;
        }

        .quizzes-toolbar {
          display: grid;
          grid-template-columns: minmax(220px, 1fr) auto;
          gap: 20px;
          align-items: end;
          margin-bottom: 24px;
        }

        .quizzes-title {
          margin: 0;
          color: #00458b;
          font-size: 1.85rem;
          font-weight: 900;
        }

        .quizzes-subtitle {
          margin: 6px 0 0;
          color: #64748b;
          font-size: 0.92rem;
          font-weight: 700;
        }

        .quizzes-search {
          position: relative;
          width: min(360px, 100%);
        }

        .quizzes-search i {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }

        .quizzes-search input {
          width: 100%;
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 16px;
          padding: 12px 16px 12px 42px;
          color: #172033;
          font-family: inherit;
          font-weight: 800;
          outline: none;
        }

        .quizzes-filters {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 24px;
        }

        .quiz-filter {
          border: 1px solid #e2e8f0;
          background: white;
          color: #475569;
          border-radius: 999px;
          padding: 9px 16px;
          font-family: inherit;
          font-size: 0.82rem;
          font-weight: 900;
          cursor: pointer;
        }

        .quiz-filter.active {
          background: #00458b;
          border-color: #00458b;
          color: white;
        }

        .quizzes-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 20px;
        }

        .quiz-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 22px;
          overflow: hidden;
          box-shadow: 0 10px 24px rgba(15, 23, 42, 0.04);
          display: flex;
          flex-direction: column;
          min-height: 380px;
        }

        .quiz-cover {
          height: 150px;
          position: relative;
          overflow: hidden;
        }

        .quiz-cover img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .quiz-badges {
          position: absolute;
          top: 12px;
          right: 12px;
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .quiz-badge {
          background: rgba(255, 255, 255, 0.92);
          color: #00458b;
          border-radius: 10px;
          padding: 5px 10px;
          font-size: 0.72rem;
          font-weight: 900;
        }

        .quiz-card-body {
          padding: 18px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .quiz-title {
          margin: 0 0 8px;
          color: #172033;
          font-size: 1.08rem;
          font-weight: 900;
          line-height: 1.45;
        }

        .quiz-meta {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          color: #64748b;
          font-size: 0.78rem;
          font-weight: 900;
          margin-bottom: 12px;
        }

        .quiz-story {
          color: #64748b;
          font-size: 0.84rem;
          line-height: 1.7;
          font-weight: 700;
          margin: 0 0 14px;
          flex: 1;
        }

        .quiz-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          margin-bottom: 14px;
        }

        .quiz-stat {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 9px;
          text-align: center;
        }

        .quiz-stat strong {
          display: block;
          color: #00458b;
          font-size: 1rem;
          font-weight: 900;
        }

        .quiz-stat span {
          color: #64748b;
          font-size: 0.68rem;
          font-weight: 900;
        }

        .quiz-btn, .quiz-primary-btn {
          border: 0;
          background: #00458b;
          color: white;
          border-radius: 12px;
          padding: 10px 16px;
          font-family: inherit;
          font-size: 0.84rem;
          font-weight: 900;
          cursor: pointer;
        }

        .quiz-primary-btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .quiz-secondary-btn {
          border: 1px solid #cbd5e1;
          background: white;
          color: #475569;
          border-radius: 12px;
          padding: 10px 16px;
          font-family: inherit;
          font-size: 0.84rem;
          font-weight: 900;
          cursor: pointer;
        }

        .empty-quizzes {
          background: white;
          border: 1px dashed #cbd5e1;
          border-radius: 22px;
          padding: 34px;
          text-align: center;
          color: #64748b;
          font-weight: 900;
        }

        .quiz-runner {
          direction: rtl;
          font-family: 'Tajawal', sans-serif;
          color: #172033;
        }

        .runner-header {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 22px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 10px 24px rgba(15, 23, 42, 0.04);
        }

        .runner-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 14px;
        }

        .runner-title {
          margin: 0 0 8px;
          color: #00458b;
          font-size: 1.65rem;
          font-weight: 900;
        }

        .runner-progress {
          height: 9px;
          background: #f1f5f9;
          border-radius: 999px;
          overflow: hidden;
        }

        .runner-progress div {
          height: 100%;
          background: linear-gradient(90deg, #00458b, #0f9f8f);
        }

        .simulation-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 290px;
          gap: 20px;
          align-items: start;
        }

        .simulation-stage {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 28px;
          padding: 22px;
        }

        .simulation-topline {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .simulation-pill {
          color: #00458b;
          background: #eef5fc;
          border-radius: 999px;
          padding: 7px 12px;
          font-size: 0.76rem;
          font-weight: 900;
        }

        .simulation-instruction {
          background: #fff7ed;
          border: 1px solid #fed7aa;
          color: #9a3412;
          border-radius: 18px;
          padding: 13px 15px;
          font-size: 0.82rem;
          line-height: 1.7;
          font-weight: 800;
          margin-bottom: 18px;
        }

        .question-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 26px;
          padding: 26px;
          box-shadow: 0 16px 38px rgba(15, 23, 42, 0.055);
        }

        .question-title {
          margin: 0;
          color: #172033;
          font-size: 1.18rem;
          font-weight: 900;
          line-height: 1.9;
          margin-bottom: 20px;
        }

        .options-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .option-btn {
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          color: #172033;
          border-radius: 18px;
          padding: 14px;
          font-family: inherit;
          font-weight: 900;
          cursor: pointer;
          text-align: right;
        }

        .option-btn.active {
          border-color: #00458b;
          background: #eef5fc;
          color: #00458b;
        }

        .answer-input {
          width: 100%;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          border-radius: 18px;
          padding: 15px 16px;
          color: #172033;
          font-family: inherit;
          font-weight: 800;
          outline: none;
        }

        .simulation-controls {
          margin-top: 18px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 18px;
          padding: 14px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          box-shadow: 0 16px 40px rgba(15, 23, 42, 0.08);
        }

        .quiz-info-panel {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 26px;
          overflow: hidden;
          box-shadow: 0 10px 24px rgba(15, 23, 42, 0.04);
        }

        .quiz-info-panel img {
          width: 100%;
          aspect-ratio: 4 / 3;
          object-fit: cover;
        }

        .quiz-info-body {
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .quiz-info-row {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          color: #64748b;
          font-size: 0.78rem;
          font-weight: 900;
        }

        .quiz-info-row strong {
          color: #172033;
          text-align: left;
        }

        .result-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 24px;
          padding: 28px;
          text-align: center;
          box-shadow: 0 10px 24px rgba(15, 23, 42, 0.04);
        }

        .result-score {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          margin: 0 auto 16px;
          background: #eef5fc;
          color: #00458b;
          font-size: 2rem;
          font-weight: 900;
        }

        .result-score.pass {
          background: #dcfce7;
          color: #15803d;
        }

        .result-title {
          margin: 0 0 10px;
          color: #172033;
          font-size: 1.35rem;
          font-weight: 900;
        }

        .result-details {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          max-width: 680px;
          margin: 18px auto 0;
          text-align: right;
        }

        .result-detail {
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 12px;
          background: #f8fafc;
          color: #475569;
          font-size: 0.78rem;
          font-weight: 800;
        }

        .result-detail.correct {
          border-color: #bbf7d0;
          background: #f0fdf4;
          color: #15803d;
        }

        .result-detail.wrong {
          border-color: #fecaca;
          background: #fef2f2;
          color: #b91c1c;
        }

        .toast-save {
          position: fixed;
          bottom: 28px;
          right: 28px;
          z-index: 1100;
          background: #172033;
          color: white;
          border-radius: 16px;
          padding: 13px 18px;
          font-weight: 900;
          box-shadow: 0 16px 40px rgba(15, 23, 42, 0.22);
        }

        @media (max-width: 1100px) {
          .quizzes-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .simulation-layout {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 760px) {
          .quizzes-toolbar, .runner-top, .simulation-controls {
            grid-template-columns: 1fr;
            flex-direction: column;
            align-items: stretch;
          }
          .quizzes-search {
            width: 100%;
          }
          .quizzes-grid, .options-grid, .result-details {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {activeQuiz ? (
        <div className="quiz-runner">
          <div className="runner-header">
            <div className="runner-top">
              <div>
                <h2 className="runner-title">{activeQuiz.title}</h2>
                <div className="quiz-meta">
                  <span>{activeQuiz.questionsCount} أسئلة</span>
                  <span>{activeQuiz.xpReward || 0} XP</span>
                  <span>{activeQuiz.story?.title ? `قصة: ${activeQuiz.story.title}` : "اختبار عام"}</span>
                </div>
              </div>
              <button className="quiz-secondary-btn" onClick={() => setActiveQuiz(null)}>
                العودة للاختبارات
              </button>
            </div>
            <div className="runner-progress">
              <div style={{ width: `${activeQuiz.questions.length ? Math.round((answeredCount / activeQuiz.questions.length) * 100) : 0}%` }}></div>
            </div>
          </div>

          {result ? (
            <div className="result-card">
              <div className={`result-score ${result.passed ? "pass" : ""}`}>{result.score}%</div>
              <h3 className="result-title">{result.passed ? "نجحت في الاختبار!" : "حاول مرة أخرى"}</h3>
              <p className="quizzes-subtitle">
                أجبت بشكل صحيح على {result.correctCount} من {result.totalQuestions} أسئلة.
              </p>
              <div className="result-details">
                {(result.results || []).map((item) => (
                  <div className={`result-detail ${item.isCorrect ? "correct" : "wrong"}`} key={item.questionIndex}>
                    السؤال {item.questionIndex + 1}: {item.isCorrect ? "إجابة صحيحة" : `الإجابة الصحيحة: ${item.correctAnswer}`}
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
                <button className="quiz-primary-btn" onClick={() => startQuiz(activeQuiz)}>
                  إعادة الاختبار
                </button>
                <button className="quiz-secondary-btn" onClick={() => setActiveQuiz(null)}>
                  العودة للقائمة
                </button>
              </div>
            </div>
          ) : (
            <div className="simulation-layout">
              <div>
                <div className="simulation-stage">
                  <div className="simulation-topline">
                    <span className="simulation-pill">
                      {questionTypeLabels[currentQuestion?.type] || currentQuestion?.type}
                    </span>
                    <span className="simulation-pill">
                      السؤال {activeQuestion + 1} من {activeQuiz.questions.length}
                    </span>
                  </div>

                  <div className="simulation-instruction">
                    {currentQuestion?.type === "choice"
                      ? "اقرأ السؤال بعناية ثم اختر الإجابة المناسبة من بين الخيارات."
                      : currentQuestion?.type === "translate"
                        ? "اكتب الترجمة المناسبة بدقة، ثم انتقل للسؤال التالي."
                        : currentQuestion?.type === "fill_blanks"
                          ? "اكتب الكلمة الناقصة المناسبة مكان [blank]."
                          : "اختر الصيغة الصحيحة التي تكمل الجملة."}
                  </div>

                  {currentQuestion && (
                    <div className="question-card">
                      <h3 className="question-title">{currentQuestion.text}</h3>

                      {currentQuestion.options?.length > 0 ? (
                        <div className="options-grid">
                          {currentQuestion.options.map((option) => (
                            <button
                              className={`option-btn ${answers[currentQuestion.index] === option ? "active" : ""}`}
                              key={option}
                              onClick={() => updateAnswer(currentQuestion.index, option)}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <input
                          className="answer-input"
                          value={answers[currentQuestion.index] || ""}
                          onChange={(event) => updateAnswer(currentQuestion.index, event.target.value)}
                          placeholder="اكتب إجابتك هنا..."
                        />
                      )}
                    </div>
                  )}
                </div>

                <div className="simulation-controls">
                  <button
                    className="quiz-secondary-btn"
                    onClick={() => setActiveQuestion((prev) => Math.max(0, prev - 1))}
                    disabled={activeQuestion === 0}
                  >
                    السؤال السابق
                  </button>

                  <span className="quizzes-subtitle">
                    تمت الإجابة على {answeredCount} من {activeQuiz.questions.length} أسئلة.
                  </span>

                  {activeQuestion < activeQuiz.questions.length - 1 ? (
                    <button
                      className="quiz-primary-btn"
                      onClick={() => setActiveQuestion((prev) => Math.min(activeQuiz.questions.length - 1, prev + 1))}
                      disabled={!canGoNext}
                    >
                      السؤال التالي
                    </button>
                  ) : (
                    <button
                      className="quiz-primary-btn"
                      onClick={submitQuiz}
                      disabled={submitting || answeredCount < activeQuiz.questions.length}
                    >
                      {submitting ? "جاري التصحيح..." : "إرسال الاختبار"}
                    </button>
                  )}
                </div>
              </div>

              <aside className="quiz-info-panel">
                <img src={getMediaUrl(activeQuiz.thumbnail || activeQuiz.story?.coverImage)} alt={activeQuiz.title} />
                <div className="quiz-info-body">
                  <div className="quiz-info-row">
                    <span>اسم الاختبار</span>
                    <strong>{activeQuiz.title}</strong>
                  </div>
                  <div className="quiz-info-row">
                    <span>المستوى</span>
                    <strong>{activeQuiz.level || activeQuiz.story?.level || "غير محدد"}</strong>
                  </div>
                  <div className="quiz-info-row">
                    <span>المكافأة</span>
                    <strong>{activeQuiz.xpReward || 0} XP</strong>
                  </div>
                  <div className="quiz-info-row">
                    <span>القصة</span>
                    <strong>{activeQuiz.story?.title || "اختبار عام"}</strong>
                  </div>
                  <div className="quiz-info-row">
                    <span>اللغة</span>
                    <strong>{languageLabels[activeQuiz.language || activeQuiz.story?.language] || activeQuiz.language || "عام"}</strong>
                  </div>
                </div>
              </aside>
            </div>
          )}
        </div>
      ) : (
        <div className="quizzes-page">
          <div className="quizzes-toolbar">
            <div>
              <h2 className="quizzes-title">الاختبارات</h2>
              <p className="quizzes-subtitle">كل الاختبارات المعتمدة في مكان واحد. اختر اختبارا وابدأ التحدي.</p>
            </div>
            <div className="quizzes-search">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="ابحث عن اختبار أو قصة..."
              />
            </div>
          </div>

          <div className="quizzes-filters">
            {languages.map((language) => (
              <button
                className={`quiz-filter ${languageFilter === language ? "active" : ""}`}
                key={language}
                onClick={() => setLanguageFilter(language)}
              >
                {language === "all" ? "كل اللغات" : languageLabels[language] || language}
              </button>
            ))}
          </div>

          {filteredQuizzes.length ? (
            <div className="quizzes-grid">
              {filteredQuizzes.map((quiz) => (
                <article className="quiz-card" key={quiz.id}>
                  <div className="quiz-cover">
                    <img src={getMediaUrl(quiz.thumbnail || quiz.story?.coverImage)} alt={quiz.title} />
                    <div className="quiz-badges">
                      <span className="quiz-badge">{languageLabels[quiz.language || quiz.story?.language] || quiz.language || "عام"}</span>
                      <span className="quiz-badge">{quiz.level || quiz.story?.level || "غير محدد"}</span>
                    </div>
                  </div>
                  <div className="quiz-card-body">
                    <h3 className="quiz-title">{quiz.title}</h3>
                    <div className="quiz-meta">
                      <span>{quiz.questionsCount} أسئلة</span>
                      <span>{quiz.xpReward || 0} XP</span>
                    </div>
                    <p className="quiz-story">{quiz.story?.title ? `مرتبط بقصة: ${quiz.story.title}` : "اختبار عام غير مرتبط بقصة."}</p>
                    <div className="quiz-stats">
                      <div className="quiz-stat">
                        <strong>{quiz.attemptsCount || 0}</strong>
                        <span>محاولات</span>
                      </div>
                      <div className="quiz-stat">
                        <strong>{quiz.bestScore ?? "-"}</strong>
                        <span>أفضل نتيجة</span>
                      </div>
                      <div className="quiz-stat">
                        <strong>{quiz.lastScore ?? "-"}</strong>
                        <span>آخر نتيجة</span>
                      </div>
                    </div>
                    <button className="quiz-btn" onClick={() => startQuiz(quiz)}>
                      {quiz.attemptsCount > 0 ? "إعادة الاختبار" : "ابدأ الاختبار"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-quizzes">لا توجد اختبارات مطابقة للبحث أو الفلتر الحالي.</div>
          )}
        </div>
      )}

      {toast && <div className="toast-save">{toast}</div>}
    </>
  );
};

export default StudentQuizzes;
