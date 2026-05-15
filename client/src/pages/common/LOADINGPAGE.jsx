import React, { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import {
  LogIn,
  UserPlus,
  ArrowLeft,
  Globe,
  Sparkles,
  BookOpen,
  Headphones,
  MessageCircle,
  PlayCircle
} from "lucide-react";

const LOADINGPAGE = ({ onProfessorClick, onAdminClick }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');

        :root {
          --primary: #003F87;
          --primary-light: #EBF2FF;
          --secondary: #FFD700;
          --accent: #58CC02;
          --text-dark: #0F172A;
          --text-muted: #64748B;
          --glass: rgba(255, 255, 255, 0.85);
          --shadow-premium: 0 20px 40px -15px rgba(0, 63, 135, 0.1);
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: 'Tajawal', sans-serif;
          background-color: #FDFBFF;
          color: var(--text-dark);
          overflow-x: hidden;
        }

        .page-wrapper {
          direction: rtl;
        }

        /* --- Navbar --- */
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 80px;
          z-index: 1000;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          padding: 0 5%;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .navbar.scrolled {
          height: 70px;
          background: var(--glass);
          backdrop-filter: blur(15px);
          border-bottom: 1px solid rgba(0, 63, 135, 0.05);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.03);
        }

        .nav-logo {
          height: 45px;
          width: auto;
          transition: transform 0.3s ease;
        }

        .nav-logo:hover {
          transform: scale(1.05);
        }

        .nav-links {
          display: flex;
          gap: 32px;
          align-items: center;
        }

        .nav-link {
          text-decoration: none;
          color: var(--text-dark);
          font-weight: 700;
          font-size: 0.95rem;
          transition: all 0.3s ease;
          position: relative;
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          right: 0;
          width: 0;
          height: 2px;
          background: var(--primary);
          transition: width 0.3s ease;
        }

        .nav-link:hover {
          color: var(--primary);
        }

        .nav-link:hover::after {
          width: 100%;
        }

        .nav-auth {
          display: flex;
          gap: 12px;
        }

        .btn-login {
          padding: 10px 24px;
          border: 1px solid var(--primary);
          color: var(--primary);
          background: transparent;
          border-radius: 12px;
          font-weight: 800;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
        }

        .btn-login:hover {
          background: var(--primary-light);
        }

        .btn-register {
          padding: 10px 24px;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 800;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 8px 20px -6px rgba(0, 63, 135, 0.3);
          transition: all 0.3s ease;
        }

        .btn-register:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 25px -8px rgba(0, 63, 135, 0.4);
        }

        /* --- Hero --- */
        .hero {
          min-height: 100vh;
          padding-top: 120px;
          display: flex;
          align-items: center;
          position: relative;
          background: radial-gradient(circle at 80% 20%, #F0F7FF 0%, transparent 40%),
                      radial-gradient(circle at 10% 80%, #FFF9E6 0%, transparent 40%);
        }

        .hero-container {
          width: 90%;
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 60px;
          align-items: center;
        }

        .hero-content h1 {
          font-size: clamp(2.5rem, 5vw, 4.5rem);
          font-weight: 900;
          line-height: 1.1;
          margin-bottom: 24px;
          color: var(--primary);
        }

        .hero-content p {
          font-size: 1.25rem;
          color: var(--text-muted);
          line-height: 1.8;
          margin-bottom: 40px;
          max-width: 540px;
        }

        .hero-visual {
          perspective: 1000px;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
        }

        .three-d-card {
          width: 400px;
          height: 480px;
          background: white;
          border-radius: 40px;
          box-shadow: var(--shadow-premium);
          transform: rotateY(-15deg) rotateX(10deg);
          transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
          transform-style: preserve-3d;
          padding: 40px;
          display: flex;
          flex-direction: column;
          gap: 24px;
          border: 1px solid rgba(0, 63, 135, 0.05);
        }

        .three-d-card:hover {
          transform: rotateY(0deg) rotateX(0deg) scale(1.02);
        }

        .floating-element {
          position: absolute;
          background: white;
          padding: 16px;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 800;
          animation: float 4s ease-in-out infinite;
          z-index: 10;
        }

        .float-1 { top: 10%; right: -20px; animation-delay: 0s; color: var(--accent); }
        .float-2 { bottom: 20%; left: -40px; animation-delay: 1s; color: #FF6B6B; }
        .float-3 { top: 50%; right: -50px; animation-delay: 2s; color: var(--primary); }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        .hero-btns {
          display: flex;
          gap: 20px;
        }

        /* --- Sections --- */
        .section {
          padding: 100px 5%;
        }

        .section-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .section-header h2 {
          font-size: 2.5rem;
          font-weight: 900;
          color: var(--primary);
          margin-bottom: 16px;
        }

        .feature-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 30px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .feature-card {
          background: white;
          padding: 40px;
          border-radius: 32px;
          border: 1px solid rgba(0, 63, 135, 0.05);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .feature-card:hover {
          transform: translateY(-10px);
          box-shadow: var(--shadow-premium);
          border-color: var(--primary-light);
        }

        .icon-box {
          width: 64px;
          height: 64px;
          background: var(--primary-light);
          color: var(--primary);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
        }

        .feature-card h3 {
          font-size: 1.5rem;
          font-weight: 800;
          margin-bottom: 12px;
        }

        .feature-card p {
          color: var(--text-muted);
          line-height: 1.7;
        }

        /* --- Languages Strip --- */
        .lang-strip {
          background: var(--primary);
          padding: 20px 0;
          overflow: hidden;
        }

        .lang-track {
          display: flex;
          gap: 60px;
          animation: slide 30s linear infinite;
          width: max-content;
        }

        .lang-item {
          color: white;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 1.1rem;
          opacity: 0.8;
        }

        @keyframes slide {
          from { transform: translateX(0); }
          to { transform: translateX(50%); }
        }

        /* --- Footer --- */
        .footer {
          background: #001D3D;
          color: white;
          padding: 80px 5% 40px;
        }

        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1fr;
          gap: 60px;
          margin-bottom: 60px;
        }

        .footer-brand p {
          color: #B8C5D9;
          margin-top: 20px;
          line-height: 1.8;
        }

        .footer-links h4 {
          margin-bottom: 24px;
          font-size: 1.2rem;
        }

        .footer-links a {
          display: block;
          color: #B8C5D9;
          text-decoration: none;
          margin-bottom: 12px;
          transition: color 0.3s ease;
        }

        .footer-links a:hover {
          color: var(--secondary);
        }

        .copyright {
          text-align: center;
          padding-top: 40px;
          border-top: 1px solid rgba(255,255,255,0.1);
          color: #64748B;
          font-size: 0.9rem;
        }

        @media (max-width: 1024px) {
          .hero-container { grid-template-columns: 1fr; text-align: center; }
          .hero-content { display: flex; flex-direction: column; align-items: center; }
          .hero-btns { justify-content: center; }
          .hero-visual { margin-top: 60px; }
          .footer-content { grid-template-columns: 1fr 1fr; }
        }

        @media (max-width: 768px) {
          .nav-links { display: none; }
          .footer-content { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="page-wrapper">
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
          <div className="nav-links">
            <a href="#features" className="nav-link">المميزات</a>
            <a href="#about" className="nav-link">من نحن</a>
            <a onClick={() => onAdminClick()} className="nav-link" style={{ cursor: 'pointer' }}>الإدارة</a>
          </div>

          <div className="nav-center">
            <img src={logo} alt="Logo" className="nav-logo" />
          </div>

          <div className="nav-auth">
            <button className="btn-login" onClick={onProfessorClick}>
              <LogIn size={18} />
              تسجيل الدخول
            </button>
            <button className="btn-register" onClick={onProfessorClick}>
              <UserPlus size={18} />
              انشاء حساب
            </button>
          </div>
        </nav>

        <section className="hero">
          <div className="hero-container">
            <div className="hero-content">
              <h1>تعلّم اللغات بطريقة <span style={{ color: 'var(--secondary)' }}>ذكية</span> وممتعة</h1>
              <p>
                منصة أجي-تقرا (aji-t9ra) هي وجهتك المثالية لإتقان اللغات من خلال تقنيات الذكاء الاصطناعي، القصص التفاعلية، والممارسة المباشرة مع نخبة من الأساتذة.
              </p>
              <div className="hero-btns">
                <button className="btn-register" onClick={onProfessorClick} style={{ padding: '16px 40px', fontSize: '1.1rem' }}>
                  ابدأ رحلتك مجاناً
                  <ArrowLeft size={20} />
                </button>
                <button className="btn-login" onClick={onProfessorClick} style={{ padding: '16px 40px', fontSize: '1.1rem' }}>
                  اكتشف المزيد
                </button>
              </div>
            </div>

            <div className="hero-visual">
              <div className="three-d-card">
                <div className="icon-box" style={{ width: '80px', height: '80px' }}>
                  <Sparkles size={40} />
                </div>
                <h2 style={{ fontSize: '2rem', fontWeight: 900 }}>ذكاء اصطناعي تفاعلي</h2>
                <p>نستخدم أحدث تقنيات الـ AI لمساعدتك على تصحيح النطق وفهم القواعد بشكل تلقائي وفوري.</p>
                <div style={{ marginTop: 'auto', display: 'flex', gap: '8px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#E2E8F0' }}></div>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#E2E8F0' }}></div>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#E2E8F0' }}></div>
                </div>
              </div>

              <div className="floating-element float-1">
                <Globe size={20} />
                <span>+15 لغة متاحة</span>
              </div>
              <div className="floating-element float-2">
                <Headphones size={20} />
                <span>دروس صوتية</span>
              </div>
              <div className="floating-element float-3">
                <Sparkles size={20} />
                <span>تقييم فوري</span>
              </div>
            </div>
          </div>
        </section>

        <div className="lang-strip">
          <div className="lang-track">
            {[1, 2].map((i) => (
              <React.Fragment key={i}>
                <div className="lang-item">Français <img src="https://flagcdn.com/w40/fr.png" width="24" alt="" /></div>
                <div className="lang-item">English <img src="https://flagcdn.com/w40/gb.png" width="24" alt="" /></div>
                <div className="lang-item">Tamazight <span style={{ fontSize: '1.5rem' }}>ⵣ</span></div>
                <div className="lang-item">Español <img src="https://flagcdn.com/w40/es.png" width="24" alt="" /></div>
                <div className="lang-item">Deutsch <img src="https://flagcdn.com/w40/de.png" width="24" alt="" /></div>
                <div className="lang-item">العربية <img src="https://flagcdn.com/w40/ma.png" width="24" alt="" /></div>
              </React.Fragment>
            ))}
          </div>
        </div>

        <section id="features" className="section">
          <div className="section-header">
            <h2>لماذا أجي-تقرا؟</h2>
            <p style={{ color: 'var(--text-muted)' }}>نقدم لك تجربة تعليمية متكاملة تجمع بين المتعة والاحترافية</p>
          </div>

          <div className="feature-grid">
            <div className="feature-card">
              <div className="icon-box"><BookOpen size={30} /></div>
              <h3>قصص تفاعلية</h3>
              <p>تعلم المفردات من خلال سياقات قصصية مشوقة تجعلك تنسى أنك تدرس.</p>
            </div>
            <div className="feature-card">
              <div className="icon-box"><MessageCircle size={30} /></div>
              <h3>صالونات صوتية</h3>
              <p>مارس اللغة مع أشخاص حقيقيين في غرف محادثة مباشرة بإشراف أساتذة.</p>
            </div>
            <div className="feature-card">
              <div className="icon-box"><PlayCircle size={30} /></div>
              <h3>محتوى مرئي</h3>
              <p>مئات الفيديوهات القصيرة والدروس المسجلة بجودة عالية لتطوير مهاراتك.</p>
            </div>
          </div>
        </section>

        <footer className="footer">
          <div className="footer-content">
            <div className="footer-brand">
              <img src={logo} alt="Logo" style={{ height: '50px' }} />
              <p>أجي-تقرا هي منصة تعليمية مغربية رائدة تهدف إلى جعل تعلم اللغات متاحاً للجميع باستخدام أحدث التقنيات.</p>
            </div>
            <div className="footer-links">
              <h4>المنصة</h4>
              <a href="#">الدروس</a>
              <a href="#">الأساتذة</a>
              <a href="#">الأسعار</a>
            </div>
            <div className="footer-links">
              <h4>الدعم</h4>
              <a href="#">مركز المساعدة</a>
              <a href="#">تواصل معنا</a>
              <a href="#">الأسئلة الشائعة</a>
            </div>
            <div className="footer-links">
              <h4>قانوني</h4>
              <a href="#">سياسة الخصوصية</a>
              <a href="#">الشروط والأحكام</a>
            </div>
          </div>
          <div className="copyright">
            © 2026 aji-t9ra - جميع الحقوق محفوظة. صنع بكل حب في المغرب 🇲🇦
          </div>
        </footer>
      </div>
    </>
  );
};

export default LOADINGPAGE;
