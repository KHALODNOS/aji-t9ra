import React, { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import { LogIn, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../../styles/landing.css";

const LandingNavbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-links">
        <a href="/#features" className="nav-link">المميزات</a>
        <a href="/#about" className="nav-link">من نحن</a>
        <a onClick={() => navigate('/login')} className="nav-link" style={{ cursor: 'pointer' }}>الإدارة</a>
      </div>

      <div className="nav-center cursor-pointer" onClick={() => navigate('/')}>
        <img src={logo} alt="Logo" className="nav-logo" />
      </div>

      <div className="nav-auth">
        <button className="btn-login" onClick={() => navigate('/login')}>
          <LogIn size={18} />
          تسجيل الدخول
        </button>
        <button className="btn-register" onClick={() => navigate('/register')}>
          <UserPlus size={18} />
          انشاء حساب
        </button>
      </div>
    </nav>
  );
};

export default LandingNavbar;
