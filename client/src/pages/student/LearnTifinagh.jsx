import React, { useState } from "react";

const tifinaghLetters = [
  { char: 'ⴰ', name: 'Ya', arabic: 'ا' },
  { char: 'ⴱ', name: 'Yab', arabic: 'ب' },
  { char: 'ⵛ', name: 'Yash', arabic: 'ش' },
  { char: 'ⴷ', name: 'Yad', arabic: 'د' },
  { char: 'ⴹ', name: 'Yadd', arabic: 'ض' },
  { char: 'ⴻ', name: 'Yey', arabic: 'هـ' },
  { char: 'ⴼ', name: 'Yaf', arabic: 'ف' },
  { char: 'ⴳ', name: 'Yag', arabic: 'ݣ' },
  { char: 'ⵀ', name: 'Yah', arabic: 'ه' },
  { char: 'ⵃ', name: 'Yahh', arabic: 'ح' },
  { char: 'ⵉ', name: 'Yi', arabic: 'ي' },
  { char: 'ⵊ', name: 'Yaj', arabic: 'ج' },
  { char: 'ⴽ', name: 'Yak', arabic: 'ك' },
  { char: 'ⵍ', name: 'Yal', arabic: 'ل' },
  { char: 'ⵎ', name: 'Yam', arabic: 'م' },
  { char: 'ⵏ', name: 'Yan', arabic: 'ن' },
  { char: 'ⵓ', name: 'Yu', arabic: 'و' },
  { char: 'ⵇ', name: 'Yaq', arabic: 'ق' },
  { char: 'ⵔ', name: 'Yar', arabic: 'ر' },
  { char: 'ⵕ', name: 'Yarr', arabic: 'ڕ' },
  { char: 'ⵖ', name: 'Yagh', arabic: 'غ' },
  { char: 'ⵙ', name: 'Yas', arabic: 'س' },
  { char: 'ⵚ', name: 'Yass', arabic: 'ص' },
  { char: 'ⵜ', name: 'Yat', arabic: 'ت' },
  { char: 'ⵟ', name: 'Yatt', arabic: 'ط' },
  { char: 'ⵡ', name: 'Yaw', arabic: 'و' },
  { char: 'ⵅ', name: 'Yakh', arabic: 'خ' },
  { char: 'ⵢ', name: 'Yay', arabic: 'ي' },
  { char: 'ⵣ', name: 'Yaz', arabic: 'ز' },
  { char: 'ⵥ', name: 'Yazz', arabic: 'ژ' }
];

const LearnTifinagh = ({ onBack }) => {
  const [showLetters, setShowLetters] = useState(false);

  return (
    <>
      <style>{`
        .tifinagh-page {
          direction: rtl;
          font-family: 'Tajawal', 'Cairo', sans-serif;
          min-height: calc(100vh - 120px);
          background: #f8fafc;
          padding: 2rem;
          border-radius: 24px;
        }

        .tifinagh-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 30px;
        }

        .back-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: white;
          border: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #64748b;
          transition: all 0.2s ease;
        }

        .back-btn:hover {
          background: #f1f5f9;
          color: #0f172a;
          transform: scale(1.05);
        }

        .tifinagh-title {
          font-size: 1.8rem;
          font-weight: 900;
          color: #1e293b;
          margin: 0;
        }

        .marketing-section {
          background: linear-gradient(135deg, #00458b, #002d5c);
          border-radius: 24px;
          padding: 4rem 2rem;
          text-align: center;
          color: white;
          margin-bottom: 2rem;
          box-shadow: 0 10px 30px rgba(0, 69, 139, 0.2);
          position: relative;
          overflow: hidden;
        }

        .marketing-section::before {
          content: 'ⵣ';
          position: absolute;
          font-size: 15rem;
          opacity: 0.05;
          top: -20%;
          right: -5%;
          transform: rotate(15deg);
        }

        .marketing-section::after {
          content: 'ⴰ';
          position: absolute;
          font-size: 10rem;
          opacity: 0.05;
          bottom: -10%;
          left: 5%;
          transform: rotate(-15deg);
        }

        .marketing-text {
          font-size: 2rem;
          font-weight: 900;
          margin-bottom: 1rem;
          position: relative;
          z-index: 2;
          line-height: 1.4;
        }

        .marketing-subtext {
          font-size: 1.1rem;
          color: #e2e8f0;
          margin-bottom: 2.5rem;
          position: relative;
          z-index: 2;
        }

        .start-btn {
          background: #f9c851;
          color: #4b3805;
          border: none;
          padding: 1rem 2.5rem;
          font-size: 1.2rem;
          font-weight: 800;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          z-index: 2;
          box-shadow: 0 8px 20px rgba(249, 200, 81, 0.3);
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }

        .start-btn:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 25px rgba(249, 200, 81, 0.4);
          background: #fbd671;
        }

        .start-btn i {
          transition: transform 0.3s ease;
        }

        .start-btn:hover i {
          transform: translateX(-5px);
        }

        .letters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 20px;
          margin-top: 2rem;
          opacity: 0;
          animation: fadeIn 0.5s ease forwards;
        }

        @keyframes fadeIn {
          to { opacity: 1; }
        }

        .letter-card {
          background: white;
          border-radius: 20px;
          padding: 1.5rem;
          text-align: center;
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
          border: 2px solid transparent;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          opacity: 0;
          transform: translateY(20px);
          animation: slideUp 0.5s ease forwards;
        }

        @keyframes slideUp {
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }

        .letter-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 25px rgba(0, 69, 139, 0.15);
          border-color: rgba(0, 69, 139, 0.3);
        }

        .letter-char {
          font-size: 3.5rem;
          font-weight: bold;
          color: #00458b;
          margin-bottom: 0.5rem;
          line-height: 1;
        }

        .letter-name {
          font-size: 1rem;
          font-weight: 700;
          color: #64748b;
          margin-bottom: 0.25rem;
        }

        .letter-arabic {
          font-size: 1.2rem;
          font-weight: 800;
          color: #d17b2b;
        }
      `}</style>

      <div className="tifinagh-page">
        <div className="tifinagh-header">
          <button className="back-btn" onClick={onBack}>
            <i className="fa-solid fa-arrow-right"></i>
          </button>
          <h2 className="tifinagh-title">تعلم حروف التيفيناغ</h2>
        </div>

        <div className="marketing-section">
          <h1 className="marketing-text">اكتشف جمال اللغة الأمازيغية</h1>
          <p className="marketing-subtext">تعلم حروف التيفيناغ بطريقة ممتعة، تفاعلية وسهلة! خطوتك الأولى نحو لغة عريقة.</p>
          
          {!showLetters && (
            <button className="start-btn" onClick={() => setShowLetters(true)}>
              <span>ابدأ تعلم الحروف</span>
              <i className="fa-solid fa-rocket"></i>
            </button>
          )}
        </div>

        {showLetters && (
          <div className="letters-grid">
            {tifinaghLetters.map((letter, index) => (
              <div 
                className="letter-card" 
                key={index}
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => {
                  const utterance = new SpeechSynthesisUtterance(letter.name);
                  utterance.lang = 'ar-SA';
                  window.speechSynthesis.speak(utterance);
                }}
              >
                <div className="letter-char">{letter.char}</div>
                <div className="letter-name">{letter.name}</div>
                <div className="letter-arabic">{letter.arabic}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default LearnTifinagh;
