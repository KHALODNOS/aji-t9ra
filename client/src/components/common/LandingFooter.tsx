import React from 'react';
import logo from "../../assets/logo.png";
import "../../styles/landing.css";

const LandingFooter = () => {
  return (
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
  );
};

export default LandingFooter;
