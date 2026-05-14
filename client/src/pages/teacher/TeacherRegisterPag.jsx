import React, { useEffect, useMemo, useRef, useState } from "react";

const OTP_LENGTH = 6;

const TeacherRegisterPage = ({ onBack }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [secondsLeft, setSecondsLeft] = useState(59);
  const otpRefs = useRef([]);

  useEffect(() => {
    if (secondsLeft <= 0) return undefined;
    const id = setInterval(() => setSecondsLeft((prev) => prev - 1), 1000);
    return () => clearInterval(id);
  }, [secondsLeft]);

  const otpComplete = useMemo(() => otp.every((digit) => digit !== ""), [otp]);

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, event) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const resendCode = () => {
    setOtp(Array(OTP_LENGTH).fill(""));
    setSecondsLeft(59);
    otpRefs.current[0]?.focus();
  };

  const timerText = `00:${String(Math.max(secondsLeft, 0)).padStart(2, "0")}`;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css');

        :root {
          --bg: #f8f7ee;
          --glass: rgba(255, 255, 255, 0.68);
          --text: #111827;
          --muted: #6b7280;
          --primary: #0f4a97;
          --primary-dark: #0b3f82;
          --soft-blue: #eef1fa;
          --shadow: 0 28px 50px rgba(24, 39, 75, 0.12);
        }

        * { box-sizing: border-box; }
        html, body, #root { margin: 0; width: 100%; min-height: 100%; }

        .teacher-signup {
          position: relative;
          min-height: 100dvh;
          padding: clamp(20px, 3vw, 36px) 14px 42px;
          overflow: hidden;
          direction: rtl;
          font-family: 'Tajawal', sans-serif;
          background: var(--bg);
          color: var(--text);
        }

        .blur-shape { position: absolute; border-radius: 50%; filter: blur(65px); opacity: 0.42; pointer-events: none; }
        .shape-a { width: 380px; height: 380px; top: -140px; left: -100px; background: #ffefcc; }
        .shape-b { width: 340px; height: 340px; right: -110px; top: 32%; background: #d7e5ff; }
        .shape-c { width: 280px; height: 280px; bottom: -120px; left: 22%; background: #ebe8d7; }

        .header-back {
          border: none; background: transparent; font-family: inherit; width: min(840px, 100%);
          margin: 0 auto 14px; display: flex; justify-content: flex-start; gap: 10px;
          color: var(--primary-dark); font-size: clamp(1.2rem, 1.08rem + 0.55vw, 1.52rem); font-weight: 700; cursor: pointer;
        }

        .signup-modal {
          position: relative; width: min(840px, 100%); margin: 0 auto; background: var(--glass);
          border-radius: 34px; border: 1px solid rgba(255, 255, 255, 0.72); backdrop-filter: blur(16px);
          box-shadow: var(--shadow); padding: clamp(20px, 2.4vw, 38px);
        }

        .row-between { display: flex; justify-content: space-between; align-items: center; gap: 14px; flex-wrap: wrap; }
        .step-label { font-size: clamp(1.55rem, 1.2rem + 0.9vw, 2rem); font-weight: 500; margin: 0; }
        .pill { background: #f4cd47; color: #191919; border-radius: 999px; padding: 6px 14px; font-weight: 800; font-size: 1.15rem; }
        .progress-track { margin-top: 18px; width: 100%; height: 15px; border-radius: 999px; background: #d8dae2; overflow: hidden; }
        .progress-fill { width: 20%; height: 100%; border-radius: inherit; background: linear-gradient(90deg, #0f4a97, #0a4d9f); }
        .steps-text { margin-top: 14px; color: var(--muted); font-size: 1.15rem; font-weight: 500; }
        .section-title { margin: 8px 0 0; color: var(--primary-dark); font-size: clamp(1.7rem, 1.3rem + 1vw, 2.1rem); font-weight: 800; }

        .hero-image {
          margin-top: 20px; width: 100%; border-radius: 24px; min-height: clamp(148px, 24vw, 234px);
          background:
            linear-gradient(120deg, rgba(17, 39, 87, 0.68), rgba(126, 148, 195, 0.4)),
            url('https://images.unsplash.com/photo-1596495577886-d920f1fb7238?auto=format&fit=crop&w=1200&q=80') center/cover;
        }

        .copy-wrap { margin-top: 24px; }
        .copy-wrap h2 { margin: 0; font-size: clamp(1.8rem, 1.3rem + 1vw, 2.3rem); color: var(--primary-dark); font-weight: 700; }
        .copy-wrap p { margin: 10px 0 0; color: #1f2937; font-size: clamp(1.1rem, 0.95rem + 0.5vw, 1.35rem); line-height: 1.55; }
        .field-group { margin-top: 20px; }
        .field-label { display: block; margin-bottom: 11px; font-size: clamp(1.2rem, 1.1rem + 0.4vw, 1.35rem); font-weight: 800; }

        .input-shell {
          height: 72px; border-radius: 18px; border: 1px solid #b3bbcc; background: var(--soft-blue);
          box-shadow: inset 8px 8px 18px rgba(174, 184, 204, 0.32), inset -7px -7px 17px rgba(255, 255, 255, 0.9);
          display: flex; align-items: center; gap: 12px; padding: 0 18px;
        }

        .input-shell input {
          border: none; outline: none; background: transparent; width: 100%; font-family: inherit;
          font-size: 1rem; text-align: right; color: #334155;
        }

        .input-icon-btn {
          border: none; background: transparent; color: #7a8599; cursor: pointer; font-size: 1.1rem;
        }

        .hint { margin: 12px 4px 0 0; color: #7c8596; font-size: 0.95rem; }
        .divider { margin: 22px 0; border-top: 1px solid rgba(188, 195, 208, 0.56); }
        .otp-head { display: flex; justify-content: space-between; align-items: center; font-size: 1.2rem; font-weight: 700; }
        .otp-note { margin: 10px 0 16px; color: #374151; font-size: 0.95rem; }
        .otp-grid { display: grid; grid-template-columns: repeat(6, minmax(48px, 1fr)); gap: 12px; direction: ltr; }

        .otp-input {
          aspect-ratio: 1; border-radius: 15px; border: 2px solid #b5bccd; background: #f6f7fb;
          text-align: center; font-size: 1.25rem; outline: none;
        }

        .otp-input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(15, 74, 151, 0.15); }
        .otp-timer { margin-top: 14px; text-align: center; color: #6f581b; font-size: 1rem; font-weight: 700; }

        .resend-btn {
          border: none; background: transparent; color: var(--primary); font-weight: 700; cursor: pointer;
          text-decoration: underline; font-family: inherit;
        }

        .actions { margin-top: 28px; display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; }
        .btn { border: none; border-radius: 999px; height: 56px; min-width: 170px; padding: 0 30px; font-family: inherit; font-size: 1.2rem; font-weight: 700; cursor: pointer; }
        .btn-next { background: linear-gradient(120deg, var(--primary), #0d4692); color: #fff; opacity: 0.9; }
        .btn-next:disabled { opacity: 0.45; cursor: not-allowed; }
        .btn-cancel { background: rgba(255, 255, 255, 0.82); color: #1f2937; border: 1px solid #b6bfce; }

        @media (max-width: 880px) {
          .actions { flex-direction: column-reverse; align-items: stretch; }
          .btn { width: 100%; }
          .otp-grid { grid-template-columns: repeat(6, minmax(40px, 1fr)); }
        }
      `}</style>

      <section className="teacher-signup" dir="rtl">
        <span className="blur-shape shape-a" aria-hidden="true" />
        <span className="blur-shape shape-b" aria-hidden="true" />
        <span className="blur-shape shape-c" aria-hidden="true" />

        <button className="header-back" type="button" onClick={onBack}>
          <i className="fa-solid fa-arrow-right" /> العودة
        </button>

        <article className="signup-modal" role="form" aria-label="إنشاء حساب مدرس">
          <div className="row-between">
            <h1 className="step-label">الخطوة 1 من 5</h1>
            <span className="pill">20%</span>
          </div>

          <div className="progress-track"><div className="progress-fill" /></div>
          <p className="steps-text">الأمان • المعلومات • التفضيلات • المراجعة</p>
          <h2 className="section-title">الحساب</h2>
          <div className="hero-image" aria-hidden="true" />

          <div className="copy-wrap">
            <h2>الحساب والأمان</h2>
            <p>يرجى إدخال تفاصيل حسابك لتأمين وصولك إلى المنصة التعليمية</p>
          </div>

          <div className="field-group">
            <label className="field-label">البريد الإلكتروني</label>
            <div className="input-shell">
              <input
                type="email"
                placeholder="example@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <i className="fa-regular fa-envelope" aria-hidden="true" />
            </div>
          </div>

          <div className="field-group">
            <label className="field-label">كلمة المرور</label>
            <div className="input-shell">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                className="input-icon-btn"
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
              >
                <i className={`fa-regular ${showPassword ? "fa-eye-slash" : "fa-eye"}`} />
              </button>
            </div>
            <p className="hint">يجب أن تحتوي على 8 أحرف على الأقل، تشمل أرقاماً ورموزاً</p>
          </div>

          <div className="divider" />

          <div className="otp-head">
            <span>(OTP) التحقق من الهوية</span>
            <i className="fa-regular fa-shield" aria-hidden="true" />
          </div>
          <p className="otp-note">لقد أرسلنا رمز التحقق المكون من 6 أرقام إلى هاتفك المسجل</p>

          <div className="otp-grid">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  otpRefs.current[index] = el;
                }}
                className="otp-input"
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
              />
            ))}
          </div>

          <div className="otp-timer">
            {secondsLeft > 0 ? (
              <>إعادة إرسال الرمز خلال {timerText}</>
            ) : (
              <button type="button" className="resend-btn" onClick={resendCode}>
                إعادة إرسال الرمز
              </button>
            )}
          </div>

          <div className="actions">
            <button className="btn btn-cancel" type="button" onClick={onBack}>إلغاء</button>
            <button className="btn btn-next" type="button" disabled={!email || password.length < 8 || !otpComplete}>
              التالي <i className="fa-solid fa-arrow-left" />
            </button>
          </div>
        </article>
      </section>
    </>
  );
};

export default TeacherRegisterPage;
