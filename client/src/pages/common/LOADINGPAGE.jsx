import React from "react";

const LOADINGPAGE = ({ onProfessorClick }) => {
  const logoCandidates = ["/logo.jpeg"];

  const handleLogoError = (event) => {
    const index = Number(event.currentTarget.dataset.index || 0);
    const nextIndex = index + 1;
    if (nextIndex < logoCandidates.length) {
      event.currentTarget.src = logoCandidates[nextIndex];
      event.currentTarget.dataset.index = String(nextIndex);
    } else {
      event.currentTarget.style.display = "none";
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap');

        :root {
          --bg: #f7f8f2;
          --text: #1f2937;
          --muted: #667085;
          --primary: #0f4a97;
          --green: #58cc02;
          --green-dark: #479e08;
          --line: #e5ebf5;
          --footer: #12233f;
        }

        * { box-sizing: border-box; }
        html, body, #root { margin: 0; width: 100%; min-height: 100%; }
        body { font-family: 'Tajawal', sans-serif; background: var(--bg); color: var(--text); }

        .page { direction: rtl; min-height: 100dvh; scroll-behavior: smooth; }

        .navbar {
          position: sticky;
          top: 0;
          z-index: 50;
          backdrop-filter: blur(10px);
          background: rgba(247, 248, 242, 0.85);
          border-bottom: 1px solid #e8edf6;
        }

        .nav-inner {
          width: min(1180px, 100%);
          margin: 0 auto;
          padding: 10px clamp(16px, 4vw, 64px);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
        }

        .nav-brand {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          color: #0f4a97;
          font-weight: 800;
          font-size: 1.05rem;
        }

        .nav-logo {
          width: 56px;
          height: 56px;
          object-fit: contain;
          border-radius: 8px;
          background: #fff;
          padding: 2px;
          border: 1px solid #e6ebf5;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
        }

        .nav-link {
          text-decoration: none;
          color: #334155;
          font-weight: 700;
          font-size: 0.95rem;
        }

        .nav-btn {
          border: none;
          border-radius: 10px;
          background: #eef5ff;
          color: #0f4a97;
          font-weight: 800;
          font-family: inherit;
          padding: 9px 14px;
          cursor: pointer;
        }

        .section {
          min-height: 100dvh;
          padding: clamp(28px, 4vw, 56px) clamp(16px, 4vw, 64px);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .container { width: min(1180px, 100%); margin: 0 auto; }

        .hero {
          background:
            radial-gradient(circle at 12% 10%, #eaf8dd 0%, transparent 34%),
            radial-gradient(circle at 88% 88%, #e8f0ff 0%, transparent 36%),
            #f7f8f2;
        }

        .hero-container {
          min-height: calc(100dvh - 90px);
          display: flex;
          flex-direction: column;
        }

        .hero-copy {
          min-height: calc(100dvh - 220px);
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .kicker { margin: 0 0 10px; color: var(--green-dark); font-size: 0.92rem; font-weight: 800; }
        .title { margin: 0; font-size: clamp(2.3rem, 1.8rem + 2.4vw, 4rem); line-height: 1.15; font-weight: 800; }
        .desc { margin: 14px 0 24px; color: var(--muted); font-size: clamp(1.2rem, 1.05rem + 0.7vw, 1.65rem); line-height: 1.95; max-width: 100%; }

        .btn-row { display: flex; gap: 12px; flex-wrap: wrap; }
        .btn {
          border: none;
          border-radius: 14px;
          height: 50px;
          padding: 0 22px;
          font-family: inherit;
          font-size: 1rem;
          font-weight: 800;
          cursor: pointer;
        }
        .btn-main { background: linear-gradient(180deg, #72d827, var(--green)); color: #fff; box-shadow: 0 5px 0 #4da607; }
        .btn-alt { background: #eef5ff; border: 1px solid #d8e6ff; color: var(--primary); }

        .languages-strip {
          margin-top: 22px;
          border-top: 1px solid #dfe6f2;
          padding-top: 18px;
          padding-bottom: 10px;
          text-align: center;
        }

        .languages-title { margin: 0 0 10px; font-size: 1.08rem; font-weight: 800; color: #0f4a97; }
        .chips { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; }
        .chip {
          border-radius: 14px;
          border: 1px solid #dfe8f6;
          background: #ffffff;
          padding: 9px 12px;
          color: #475467;
          font-size: 0.95rem;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          min-width: 140px;
          justify-content: center;
        }

        .lang-flag {
          width: 20px;
          height: 20px;
          object-fit: cover;
          border-radius: 50%;
          border: 1px solid #d8e2f0;
          background: #fff;
        }

        .amazigh-icon {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 1px solid #d8e2f0;
          background: linear-gradient(180deg, #2d9cdb 0%, #2d9cdb 33%, #f2c94c 33%, #f2c94c 66%, #6fcf97 66%, #6fcf97 100%);
          color: #e63946;
          font-size: 0.72rem;
          font-weight: 800;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .section-title { margin: 0 0 16px; font-size: clamp(1.7rem, 1.2rem + 1vw, 2.5rem); font-weight: 800; }
        .about { background: #fff; }
        .about-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
        .card { background: #f9fbff; border: 1px solid var(--line); border-radius: 16px; padding: 18px; }
        .card h3 { margin: 0 0 8px; font-size: 1.18rem; font-weight: 800; }
        .card p { margin: 0; color: #586273; line-height: 1.8; }

        .tips {
          background:
            radial-gradient(circle at 85% 15%, #edf8df 0%, transparent 38%),
            #f5f8ff;
        }
        .tips-wrap { display: grid; gap: 14px; }
        .tip {
          background: rgba(255, 255, 255, 0.78);
          border: 1px solid rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(8px);
          border-radius: 16px;
          padding: 14px 16px;
          color: #334155;
          font-size: 1.04rem;
          line-height: 1.75;
        }
        .tip strong { color: #3b8f05; }

        .footer { background: var(--footer); color: #dbe7ff; min-height: 100dvh; }
        .footer-grid { display: grid; grid-template-columns: 1.2fr 1fr 1fr 1fr; gap: 20px; }
        .footer-title { margin: 0 0 10px; font-size: 1.18rem; font-weight: 800; color: #fff; }
        .footer-logo {
          width: 120px; height: auto; display: block; margin-bottom: 10px;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
          border-radius: 10px; background: #fff; padding: 4px;
        }
        .footer-text { margin: 0; color: #b7c7e8; line-height: 1.85; }
        .footer-link { display: block; color: #c9d7f2; text-decoration: none; margin: 8px 0; }
        .copyright { margin-top: 24px; padding-top: 16px; border-top: 1px solid rgba(173, 194, 230, 0.2); color: #aac0e7; font-weight: 700; }

        @media (max-width: 980px) {
          .about-grid { grid-template-columns: 1fr; }
          .footer-grid { grid-template-columns: 1fr 1fr; }
          .chips { justify-content: center; }
        }

        @media (max-width: 640px) {
          .footer-grid { grid-template-columns: 1fr; }
          .nav-inner { padding-inline: 12px; }
          .nav-links { gap: 10px; }
          .nav-link { font-size: 0.88rem; }
        }
      `}</style>

      <main className="page">
        <nav className="navbar">
          <div className="nav-inner">
            <a href="#hero" className="nav-brand">
              <img src="/logo.jpeg" alt="شعار aji-t9ra" className="nav-logo" />
              aji-t9ra
            </a>
            <div className="nav-links">
              <a href="#hero" className="nav-link">
                الرئيسية
              </a>
              <a href="#about" className="nav-link">
                من نحن
              </a>
              <a href="#tips" className="nav-link">
                نصائح
              </a>
              <a href="#footer" className="nav-link">
                تواصل
              </a>
              <button
                className="nav-btn"
                type="button"
                onClick={onProfessorClick}
              >
                فضاء الأستاذ
              </button>
            </div>
          </div>
        </nav>

        <section id="hero" className="section hero">
          <div className="container hero-container">
            <div className="hero-copy">
              <p className="kicker">منصة تعلم لغات حديثة</p>
              <h1 className="title">
                تعلّم اللغات بطريقة ذكية، سريعة، ومحفّزة
              </h1>
              <p className="desc">
                منصة SaaS تعليمية تجمع بين القصص التفاعلية، الصالونات الصوتية
                المباشرة، والاختبارات الذكية بالذكاء الاصطناعي، لمساعدة الطالب
                على بناء مهارات التحدث والفهم بشكل عملي ومستمر.
              </p>
              <div className="btn-row">
                <button className="btn btn-main" type="button">
                  ابدأ الآن
                </button>
                <button
                  className="btn btn-alt"
                  type="button"
                  onClick={onProfessorClick}
                >
                  فضاء الأستاذ
                </button>
              </div>
            </div>

            <div className="languages-strip">
              <div className="chips">
                <span className="chip">
                  <img
                    className="lang-flag"
                    src="https://flagcdn.com/w40/fr.png"
                    alt="France"
                  />
                  Français
                </span>
                <span className="chip">
                  <span className="amazigh-icon">ⵣ</span>
                  Tamazight
                </span>
                <span className="chip">
                  <img
                    className="lang-flag"
                    src="https://flagcdn.com/w40/gb.png"
                    alt="United Kingdom"
                  />
                  English
                </span>
                <span className="chip">
                  <img
                    className="lang-flag"
                    src="https://flagcdn.com/w40/de.png"
                    alt="Germany"
                  />
                  Germany
                </span>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="section about">
          <div className="container">
            <h2 className="section-title">من نحن</h2>
            <div className="about-grid">
              <article className="card">
                <h3>رؤيتنا</h3>
                <p>
                  نؤمن أن تعلم اللغات يجب أن يكون ممتعاً وواقعياً، وليس مجرد حفظ
                  نظري.
                </p>
              </article>
              <article className="card">
                <h3>منهجنا</h3>
                <p>
                  نعتمد على الممارسة اليومية، التفاعل الصوتي، والمحتوى المتدرج
                  حسب مستوى المتعلم.
                </p>
              </article>
              <article className="card">
                <h3>النتيجة</h3>
                <p>
                  تقدم واضح في المفردات والنطق والثقة في التحدث داخل مواقف
                  حقيقية.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section id="tips" className="section tips">
          <div className="container">
            <h2 className="section-title">نصائح عملية للتقدم السريع</h2>
            <div className="tips-wrap">
              <div className="tip">
                <strong>نصيحة 1:</strong> خصّص 15 دقيقة يومياً للتدريب الصوتي.
              </div>
              <div className="tip">
                <strong>نصيحة 2:</strong> اقرأ قصة قصيرة كل يوم وسجّل الكلمات
                الجديدة.
              </div>
              <div className="tip">
                <strong>نصيحة 3:</strong> شارك في صالون صوتي مرتين أسبوعياً على
                الأقل.
              </div>
              <div className="tip">
                <strong>نصيحة 4:</strong> أعد اختبار الذكاء الاصطناعي مباشرة بعد
                كل درس لتثبيت التعلم.
              </div>
            </div>
          </div>
        </section>

        <footer id="footer" className="section footer">
          <div className="container">
            <div className="footer-grid">
              <div>
                <img
                  className="footer-logo"
                  src={logoCandidates[0]}
                  data-index="0"
                  onError={handleLogoError}
                  alt="شعار aji-t9ra"
                />
                <h3 className="footer-title">Aji Lingua</h3>
                <p className="footer-text">
                  منصة تعليم لغات موجهة للطلبة والأساتذة، تجمع بين التكنولوجيا
                  الحديثة والتجربة التعليمية الممتعة.
                </p>
              </div>
              <div>
                <h3 className="footer-title">الخدمات</h3>
                <a href="#" className="footer-link">
                  القصص التفاعلية
                </a>
                <a href="#" className="footer-link">
                  الصالونات الصوتية
                </a>
                <a href="#" className="footer-link">
                  الاختبارات الذكية
                </a>
              </div>
              <div>
                <h3 className="footer-title">الدعم</h3>
                <a href="#" className="footer-link">
                  مركز المساعدة
                </a>
                <a href="#" className="footer-link">
                  الأسئلة الشائعة
                </a>
                <a href="#" className="footer-link">
                  تواصل معنا
                </a>
              </div>
              <div>
                <h3 className="footer-title">القانون</h3>
                <a href="#" className="footer-link">
                  سياسة الخصوصية
                </a>
                <a href="#" className="footer-link">
                  الشروط والأحكام
                </a>
                <a href="#" className="footer-link">
                  الأمان والموثوقية
                </a>
              </div>
            </div>
            <div className="copyright">
              © 2026 Aji Lit9ra - جميع الحقوق محفوظة
            </div>
          </div>
        </footer>
      </main>
    </>
  );
};

export default LOADINGPAGE;
