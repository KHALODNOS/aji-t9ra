import React, { useEffect, useMemo, useRef, useState } from "react";
import api from "../../services/api";
import { publishStudentRewards } from "../../utils/studentRewards";

const FALLBACK_COVER = "https://images.unsplash.com/photo-1455885666463-9b6b53f00f4c?w=900&auto=format&fit=crop&q=80";

const getMediaUrl = (path) => {
  if (!path) return FALLBACK_COVER;
  if (path.startsWith("http")) return path;
  return `http://localhost:5000/${path.replace(/\\/g, "/")}`;
};

const languageLabels = {
  Arabic: "العربية",
  French: "الفرنسية",
  English: "الإنجليزية",
  Tifinagh: "تيفيناغ",
};

const fontOptions = [
  { label: "Tajawal", value: "'Tajawal', sans-serif" },
  { label: "Cairo", value: "'Cairo', sans-serif" },
  { label: "Arial", value: "Arial, sans-serif" },
];

const StudentStories = ({ onOpenJourney }) => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchText, setSearchText] = useState("");
  const [languageFilter, setLanguageFilter] = useState("all");
  const [selectedStory, setSelectedStory] = useState(null);
  const [readerProgress, setReaderProgress] = useState(0);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [readerPrefs, setReaderPrefs] = useState({
    fontFamily: "'Tajawal', sans-serif",
    fontSize: 20,
    lineHeight: 2.1,
    letterSpacing: 0,
    theme: "light",
  });
  const [showReaderSettings, setShowReaderSettings] = useState(false);
  const readerRef = useRef(null);

  useEffect(() => {
    const savedPrefs = localStorage.getItem("storyReaderPrefs");
    if (savedPrefs) {
      try {
        setReaderPrefs((prev) => ({ ...prev, ...JSON.parse(savedPrefs) }));
      } catch (err) {
        console.error("Error parsing reader prefs:", err);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("storyReaderPrefs", JSON.stringify(readerPrefs));
  }, [readerPrefs]);

  useEffect(() => {
    const fetchStories = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await api.get("/student/journey/stories");
        setStories(response.data || []);
      } catch (err) {
        console.error("Error fetching student stories:", err);
        setError(err.response?.data?.message || "تعذر تحميل القصص.");
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  useEffect(() => {
    if (!selectedStory) return;
    setReaderProgress(selectedStory.progress || 0);
    requestAnimationFrame(() => {
      if (readerRef.current) readerRef.current.scrollTop = 0;
    });
  }, [selectedStory]);

  const languages = useMemo(() => {
    const values = new Set(stories.map((story) => story.language).filter(Boolean));
    return ["all", ...values];
  }, [stories]);

  const filteredStories = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    return stories.filter((story) => {
      const matchesLanguage = languageFilter === "all" || story.language === languageFilter;
      const matchesSearch = !q ||
        story.title.toLowerCase().includes(q) ||
        (story.content || "").toLowerCase().includes(q) ||
        (story.vocabulary || []).some((entry) =>
          [entry.word, entry.translation].filter(Boolean).some((value) => value.toLowerCase().includes(q))
        );

      return matchesLanguage && matchesSearch;
    });
  }, [stories, searchText, languageFilter]);

  const showToast = (message) => {
    setToast(message);
    window.clearTimeout(showToast.timeoutId);
    showToast.timeoutId = window.setTimeout(() => setToast(""), 2400);
  };

  const updateLocalProgress = (storyId, percent) => {
    setStories((prev) => prev.map((story) => (
      story.id === storyId
        ? { ...story, progress: percent, completedAt: percent >= 100 ? new Date().toISOString() : story.completedAt }
        : story
    )));
    setSelectedStory((prev) => prev && prev.id === storyId
      ? { ...prev, progress: percent, completedAt: percent >= 100 ? new Date().toISOString() : prev.completedAt }
      : prev
    );
  };

  const handleEarnedBadges = (earnedBadges = []) => {
    if (!earnedBadges.length) return;

    showToast("تهانينا! حصلت على وسام جديد.");
    if (onOpenJourney) {
      window.setTimeout(() => onOpenJourney(), 700);
    }
  };

  const saveProgress = async (percent = readerProgress, { finish = false } = {}) => {
    if (!selectedStory) return;

    const safePercent = finish ? 100 : Math.max(selectedStory.progress || 0, Math.min(100, Math.round(percent)));
    setSaving(true);
    try {
      const response = await api.put(`/student/journey/stories/${selectedStory.id}/progress`, { percent: safePercent });
      updateLocalProgress(selectedStory.id, safePercent);
      setReaderProgress(safePercent);
      publishStudentRewards({
        xpAwarded: response.data?.xpAwarded,
        totalXp: response.data?.totalXp,
        earnedBadges: response.data?.earnedBadges || [],
        reason: "story",
      });
      showToast(response.data?.xpAwarded
        ? `+${response.data.xpAwarded} XP`
        : (safePercent >= 100 ? "تم إكمال القصة وحفظ تقدمك." : "تم حفظ تقدم القراءة."));
      handleEarnedBadges(response.data?.earnedBadges || []);
    } catch (err) {
      console.error("Error saving story progress:", err);
      showToast("تعذر حفظ التقدم. حاول مرة أخرى.");
    } finally {
      setSaving(false);
    }
  };

  const handleReaderScroll = () => {
    const element = readerRef.current;
    if (!element || !selectedStory) return;

    const maxScroll = element.scrollHeight - element.clientHeight;
    if (maxScroll <= 0) {
      setReaderProgress(Math.max(selectedStory.progress || 0, 100));
      return;
    }

    const percent = Math.min(100, Math.max(0, Math.round((element.scrollTop / maxScroll) * 100)));
    setReaderProgress(Math.max(selectedStory.progress || 0, percent));
  };

  const updatePrefs = (key, value) => {
    setReaderPrefs((prev) => ({ ...prev, [key]: value }));
  };

  const readerThemeClass = `reader-theme-${readerPrefs.theme || "light"}`;

  if (loading) {
    return (
      <div className="stories-state" dir="rtl">
        <i className="fa-solid fa-circle-notch fa-spin"></i>
        <span>جاري تحميل القصص...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stories-state error" dir="rtl">
        <i className="fa-solid fa-triangle-exclamation"></i>
        <span>{error}</span>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&family=Cairo:wght@400;600;700;800;900&display=swap');

        .stories-page, .reader-page {
          direction: rtl;
          font-family: 'Tajawal', sans-serif;
          color: #172033;
        }

        .stories-state {
          min-height: 420px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          color: #00458b;
          font-family: 'Tajawal', sans-serif;
          font-weight: 900;
        }

        .stories-state.error {
          color: #b91c1c;
        }

        .stories-toolbar {
          display: grid;
          grid-template-columns: minmax(220px, 1fr) auto;
          gap: 20px;
          align-items: end;
          margin-bottom: 26px;
        }

        .stories-title, .reader-page-title {
          margin: 0;
          color: #00458b;
          font-size: 1.85rem;
          font-weight: 900;
        }

        .stories-subtitle, .reader-page-subtitle {
          margin: 6px 0 0;
          color: #64748b;
          font-size: 0.92rem;
          font-weight: 700;
        }

        .stories-search {
          position: relative;
          width: min(360px, 100%);
        }

        .stories-search i {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }

        .stories-search input {
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

        .stories-filters {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 24px;
        }

        .stories-filter {
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

        .stories-filter.active {
          background: #00458b;
          border-color: #00458b;
          color: white;
        }

        .stories-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 20px;
        }

        .story-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 22px;
          overflow: hidden;
          box-shadow: 0 10px 24px rgba(15, 23, 42, 0.04);
          display: flex;
          flex-direction: column;
          min-height: 410px;
        }

        .story-cover {
          height: 170px;
          position: relative;
          overflow: hidden;
        }

        .story-cover img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .story-badges {
          position: absolute;
          top: 12px;
          right: 12px;
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .story-badge {
          background: rgba(255, 255, 255, 0.92);
          color: #00458b;
          border-radius: 10px;
          padding: 5px 10px;
          font-size: 0.72rem;
          font-weight: 900;
        }

        .story-card-body {
          padding: 18px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .story-title {
          margin: 0 0 8px;
          color: #172033;
          font-size: 1.08rem;
          font-weight: 900;
          line-height: 1.45;
        }

        .story-desc {
          color: #64748b;
          font-size: 0.84rem;
          line-height: 1.7;
          font-weight: 700;
          margin: 0 0 14px;
          flex: 1;
        }

        .story-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 12px;
          color: #64748b;
          font-size: 0.76rem;
          font-weight: 900;
        }

        .story-xp {
          color: #92400e;
          background: #fef3c7;
          border-radius: 999px;
          padding: 5px 10px;
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }

        .story-progress-track, .reader-progress-track {
          height: 8px;
          background: #f1f5f9;
          border-radius: 999px;
          overflow: hidden;
        }

        .story-progress-track {
          margin-bottom: 12px;
        }

        .story-progress-fill, .reader-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #00458b, #0f9f8f);
        }

        .story-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .story-progress-label {
          color: #64748b;
          font-size: 0.75rem;
          font-weight: 900;
        }

        .story-btn, .reader-primary-btn {
          border: 0;
          background: #00458b;
          color: white;
          border-radius: 12px;
          padding: 9px 16px;
          font-family: inherit;
          font-size: 0.82rem;
          font-weight: 900;
          cursor: pointer;
        }

        .story-btn:disabled, .reader-primary-btn:disabled, .reader-secondary-btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .empty-stories {
          background: white;
          border: 1px dashed #cbd5e1;
          border-radius: 22px;
          padding: 34px;
          text-align: center;
          color: #64748b;
          font-weight: 900;
        }

        .reader-fullscreen {
          position: fixed;
          inset: 0;
          z-index: 2000;
          background: #eef4f8;
          display: grid;
          grid-template-rows: auto auto minmax(0, 1fr) auto;
          direction: rtl;
          font-family: 'Tajawal', sans-serif;
        }

        .reader-fullscreen.reader-theme-warm {
          background: #f4efe6;
        }

        .reader-fullscreen.reader-theme-dark {
          background: #111827;
        }

        .reader-minimal-topbar {
          background: rgba(255, 255, 255, 0.86);
          border-bottom: 1px solid rgba(226, 232, 240, 0.9);
          padding: 12px 22px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          backdrop-filter: blur(16px);
          position: relative;
          z-index: 2;
        }

        .reader-theme-warm .reader-minimal-topbar {
          background: rgba(255, 250, 242, 0.88);
          border-color: rgba(221, 208, 188, 0.85);
        }

        .reader-theme-dark .reader-minimal-topbar {
          background: rgba(17, 24, 39, 0.88);
          border-color: rgba(71, 85, 105, 0.7);
        }

        .reader-top-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .reader-title-stack {
          min-width: 0;
          text-align: center;
        }

        .reader-live-title {
          margin: 0;
          color: #00458b;
          font-size: 1.05rem;
          font-weight: 900;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: min(520px, 42vw);
        }

        .reader-theme-dark .reader-live-title {
          color: #93c5fd;
        }

        .reader-live-meta {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-top: 4px;
          color: #64748b;
          font-size: 0.72rem;
          font-weight: 900;
        }

        .reader-theme-dark .reader-live-meta {
          color: #cbd5e1;
        }

        .reader-close-btn, .reader-tool-btn {
          width: 38px;
          height: 38px;
          border: 0;
          border-radius: 50%;
          background: #f1f5f9;
          color: #475569;
          cursor: pointer;
          display: grid;
          place-items: center;
        }

        .reader-tool-btn.active {
          background: #00458b;
          color: #ffffff;
        }

        .reader-theme-dark .reader-close-btn,
        .reader-theme-dark .reader-tool-btn {
          background: #1f2937;
          color: #dbeafe;
        }

        .reader-controls {
          background: rgba(255, 255, 255, 0.92);
          border-bottom: 1px solid #e2e8f0;
          padding: 14px 22px;
          display: grid;
          grid-template-columns: 170px repeat(3, minmax(140px, 1fr)) 190px;
          gap: 14px;
          align-items: center;
          box-shadow: 0 12px 28px rgba(15, 23, 42, 0.05);
        }

        .reader-controls.hidden {
          display: none;
        }

        .reader-theme-warm .reader-controls {
          background: rgba(255, 250, 242, 0.95);
          border-color: #e5d6c0;
        }

        .reader-theme-dark .reader-controls {
          background: rgba(17, 24, 39, 0.96);
          border-color: #334155;
        }

        .reader-control-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
          min-width: 0;
        }

        .reader-control-group label {
          color: #475569;
          font-size: 0.72rem;
          font-weight: 900;
          white-space: nowrap;
        }

        .reader-theme-dark .reader-control-group label {
          color: #cbd5e1;
        }

        .reader-control-group input,
        .reader-control-group select {
          width: 100%;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          background: #f8fafc;
          padding: 8px 10px;
          font-family: inherit;
          font-weight: 800;
          color: #172033;
        }

        .reader-theme-dark .reader-control-group input,
        .reader-theme-dark .reader-control-group select {
          background: #1f2937;
          border-color: #334155;
          color: #e5e7eb;
        }

        .reader-percent {
          color: #00458b;
          font-weight: 900;
          font-size: 0.86rem;
          white-space: nowrap;
        }

        .reader-theme-dark .reader-percent {
          color: #93c5fd;
        }

        .reader-content {
          overflow-y: auto;
          padding: 42px 28px 78px;
          background:
            linear-gradient(90deg, rgba(0,69,139,0.08) 0 1px, transparent 1px) center/100% 100% no-repeat,
            transparent;
        }

        .reader-text {
          white-space: pre-wrap;
          color: #172033;
          max-width: 860px;
          margin: 0 auto;
          font-weight: 700;
          background: rgba(255, 255, 255, 0.92);
          border: 1px solid rgba(226, 232, 240, 0.95);
          border-radius: 28px;
          padding: clamp(28px, 5vw, 64px);
          box-shadow: 0 24px 70px rgba(15, 23, 42, 0.11);
          min-height: 68vh;
        }

        .reader-theme-warm .reader-text {
          background: #fff9ef;
          border-color: #ead8bd;
          color: #2f2418;
          box-shadow: 0 24px 70px rgba(120, 83, 38, 0.12);
        }

        .reader-theme-dark .reader-text {
          background: #0f172a;
          border-color: #334155;
          color: #e5e7eb;
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.32);
        }

        .reader-footer {
          background: rgba(255, 255, 255, 0.88);
          border-top: 1px solid rgba(226, 232, 240, 0.9);
          padding: 14px 22px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          backdrop-filter: blur(16px);
        }

        .reader-theme-warm .reader-footer {
          background: rgba(255, 250, 242, 0.9);
          border-color: rgba(221, 208, 188, 0.85);
        }

        .reader-theme-dark .reader-footer {
          background: rgba(17, 24, 39, 0.9);
          border-color: rgba(71, 85, 105, 0.7);
        }

        .reader-footer-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .reader-secondary-btn {
          border: 1px solid #cbd5e1;
          background: white;
          color: #475569;
          border-radius: 12px;
          padding: 9px 15px;
          font-family: inherit;
          font-weight: 900;
          cursor: pointer;
        }

        .reader-theme-dark .reader-secondary-btn {
          background: #111827;
          border-color: #334155;
          color: #e5e7eb;
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
          .stories-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .reader-controls {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 820px) {
          .stories-toolbar {
            grid-template-columns: 1fr;
          }
          .stories-search {
            width: 100%;
          }
          .stories-grid {
            grid-template-columns: 1fr;
          }
          .reader-minimal-topbar, .reader-footer {
            align-items: stretch;
            flex-direction: column;
          }
          .reader-controls {
            grid-template-columns: 1fr;
          }
          .reader-content {
            padding: 24px;
          }
          .reader-live-title {
            max-width: 70vw;
          }
        }
      `}</style>

      {selectedStory ? (
        <div className={`reader-fullscreen ${readerThemeClass}`}>
          <div className="reader-minimal-topbar">
            <div className="reader-top-actions">
              <button className="reader-close-btn" onClick={() => setSelectedStory(null)} title="العودة إلى المكتبة">
                <i className="fa-solid fa-xmark"></i>
              </button>
              <button
                className={`reader-tool-btn ${showReaderSettings ? "active" : ""}`}
                onClick={() => setShowReaderSettings((prev) => !prev)}
                title="إعدادات القراءة"
              >
                <i className="fa-solid fa-sliders"></i>
              </button>
            </div>
            <div className="reader-title-stack">
              <h2 className="reader-live-title">{selectedStory.title}</h2>
              <div className="reader-live-meta">
                <span>{languageLabels[selectedStory.language] || selectedStory.language}</span>
                <span>•</span>
                <span>{selectedStory.level || "غير محدد"}</span>
              </div>
            </div>
            <span className="reader-percent">تقدم القراءة: {readerProgress}%</span>
          </div>

          <div className={`reader-controls ${showReaderSettings ? "" : "hidden"}`}>
            <div className="reader-control-group">
              <label>نوع الخط</label>
              <select value={readerPrefs.fontFamily} onChange={(event) => updatePrefs("fontFamily", event.target.value)}>
                {fontOptions.map((font) => (
                  <option value={font.value} key={font.value}>{font.label}</option>
                ))}
              </select>
            </div>

            <div className="reader-control-group">
              <label>حجم الخط: {readerPrefs.fontSize}px</label>
              <input
                type="range"
                min="16"
                max="30"
                value={readerPrefs.fontSize}
                onChange={(event) => updatePrefs("fontSize", Number(event.target.value))}
              />
            </div>

            <div className="reader-control-group">
              <label>تباعد الأسطر: {readerPrefs.lineHeight}</label>
              <input
                type="range"
                min="1.5"
                max="2.8"
                step="0.1"
                value={readerPrefs.lineHeight}
                onChange={(event) => updatePrefs("lineHeight", Number(event.target.value))}
              />
            </div>

            <div className="reader-control-group">
              <label>تباعد الحروف: {readerPrefs.letterSpacing}px</label>
              <input
                type="range"
                min="0"
                max="3"
                step="0.5"
                value={readerPrefs.letterSpacing}
                onChange={(event) => updatePrefs("letterSpacing", Number(event.target.value))}
              />
            </div>

            <div className="reader-control-group">
              <label>نمط القراءة</label>
              <select value={readerPrefs.theme} onChange={(event) => updatePrefs("theme", event.target.value)}>
                <option value="light">هادئ</option>
                <option value="warm">دافئ</option>
                <option value="dark">ليلي</option>
              </select>
            </div>
          </div>

          <div className="reader-progress-track">
            <div className="reader-progress-fill" style={{ width: `${readerProgress}%` }}></div>
          </div>

          <div className="reader-content" ref={readerRef} onScroll={handleReaderScroll}>
            <p
              className="reader-text"
              style={{
                fontFamily: readerPrefs.fontFamily,
                fontSize: `${readerPrefs.fontSize}px`,
                lineHeight: readerPrefs.lineHeight,
                letterSpacing: `${readerPrefs.letterSpacing}px`,
              }}
            >
              {selectedStory.content}
            </p>
          </div>

          <footer className="reader-footer">
            <span className="story-progress-label">
              يتم حساب التقدم حسب مكان وصولك في النص.
            </span>
            <div className="reader-footer-actions">
              <button className="reader-secondary-btn" onClick={() => saveProgress(readerProgress)} disabled={saving}>
                {saving ? "جاري الحفظ..." : "حفظ التقدم"}
              </button>
              <button
                className="reader-primary-btn"
                onClick={() => saveProgress(100, { finish: true })}
                disabled={saving || readerProgress < 95}
                title={readerProgress < 95 ? "اقرأ حتى نهاية القصة ليظهر الإنهاء" : "إنهاء القصة وحفظ 100%"}
              >
                إنهاء القصة
              </button>
            </div>
          </footer>
        </div>
      ) : (
        <div className="stories-page">
          <div className="stories-toolbar">
            <div>
              <h2 className="stories-title">مكتبة القصص</h2>
              <p className="stories-subtitle">كل القصص المعتمدة في مكان واحد. اختر قصة، اقرأها، واحفظ تقدمك.</p>
            </div>
            <div className="stories-search">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="ابحث عن قصة أو كلمة..."
              />
            </div>
          </div>

          <div className="stories-filters">
            {languages.map((language) => (
              <button
                className={`stories-filter ${languageFilter === language ? "active" : ""}`}
                key={language}
                onClick={() => setLanguageFilter(language)}
              >
                {language === "all" ? "كل اللغات" : languageLabels[language] || language}
              </button>
            ))}
          </div>

          {filteredStories.length ? (
            <div className="stories-grid">
              {filteredStories.map((story) => (
                <article className="story-card" key={story.id}>
                  <div className="story-cover">
                    <img src={getMediaUrl(story.coverImage)} alt={story.title} />
                    <div className="story-badges">
                      <span className="story-badge">{languageLabels[story.language] || story.language}</span>
                      <span className="story-badge">{story.level || "غير محدد"}</span>
                    </div>
                  </div>
                  <div className="story-card-body">
                    <h3 className="story-title">{story.title}</h3>
                    <p className="story-desc">
                      {(story.content || "").slice(0, 150)}
                      {(story.content || "").length > 150 ? "..." : ""}
                    </p>
                    <div className="story-meta">
                      <span>{story.teacher?.name || "أستاذ"}</span>
                      <span className="story-xp">
                        <i className="fa-solid fa-award"></i>
                        {story.xp} XP
                      </span>
                    </div>
                    <div className="story-progress-track">
                      <div className="story-progress-fill" style={{ width: `${story.progress || 0}%` }}></div>
                    </div>
                    <div className="story-actions">
                      <span className="story-progress-label">{story.progress || 0}% مكتملة</span>
                      <button className="story-btn" onClick={() => setSelectedStory(story)}>
                        {story.progress > 0 ? "تابع القراءة" : "ابدأ القراءة"}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-stories">لا توجد قصص مطابقة للبحث أو الفلتر الحالي.</div>
          )}
        </div>
      )}

      {toast && <div className="toast-save">{toast}</div>}
    </>
  );
};

export default StudentStories;
