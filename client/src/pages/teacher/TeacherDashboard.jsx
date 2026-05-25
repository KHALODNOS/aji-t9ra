import React, { useState } from "react";
import TeacherLayout from "../../components/teacher/TeacherLayout";
import StoryAuthor from "./StoryAuthor";
import AddShortVideo from "./AddShortVideo";
import AISettings from "./AISettings";
import TestBank from "./TestBank";
import AudioSalons from "./AudioSalons";
import Leaderboard from "./Leaderboard";
import TeacherProfile from "./TeacherProfile";
import GeneralChat from "../student/GeneralChat";

const TeacherDashboard = ({ onBack }) => {
  const [activePage, setActivePage] = useState("home");

  const stats = [
    { label: "إجمالي القراء", count: "1,240", icon: "fa-eye" },
    { label: "متوسط التقييم", count: "4.8/5", icon: "fa-star" },
    { label: "القصص النشطة", count: "12", icon: "fa-book" },
    { label: "ساعات البث", count: "85", icon: "fa-clock" }
  ];

  const handlePageChange = (pageId) => {
    setActivePage(pageId);
  };

  const renderContent = () => {
    switch (activePage) {
      case "home":
        return (
          <div className="dashboard-content-3d">
            <section className="welcome-section">
              <h1 className="welcome-title">أهلاً بك، أستاذ خالد مؤمن</h1>
              <p className="welcome-subtitle">إليك ملخص أداء محتواك التعليمي اليوم</p>
            </section>

            <div className="stats-container-3d">
              {stats.map((stat, i) => (
                <div className="card-3d stat-card-3d" key={i}>
                  <div className="stat-icon-3d">
                    <i className={`fa-solid ${stat.icon}`}></i>
                  </div>
                  <div className="stat-details-3d">
                    <span className="stat-label-3d">{stat.label}</span>
                    <span className="stat-value-3d">{stat.count}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr 3.5fr', gap: '30px', marginBottom: '40px' }}>
              <div className="side-col">
                <div className="card-3d" style={{ marginBottom: '30px' }}>
                  <h3 className="panel-title" style={{ fontWeight: 800, marginBottom: '20px' }}>إنجازات الأسبوع</h3>
                  <div className="achievement-item" style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                    <div className="stat-icon-3d" style={{ width: '45px', height: '45px', fontSize: '1rem' }}><i className="fa-solid fa-award"></i></div>
                    <div className="ach-text">
                      <span style={{ display: 'block', fontWeight: 800, fontSize: '0.95rem' }}>المعلم المتميز</span>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>تم اختيارك كأفضل مقدم محتوى تفاعلي لهذا الشهر.</span>
                    </div>
                  </div>
                  <div className="achievement-item" style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                    <div className="stat-icon-3d" style={{ width: '45px', height: '45px', fontSize: '1rem', background: '#dbeafe', color: '#1e40af' }}><i className="fa-solid fa-chart-line"></i></div>
                    <div className="ach-text">
                      <span style={{ display: 'block', fontWeight: 800, fontSize: '0.95rem' }}>زيادة التفاعل</span>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>ارتفع معدل إكمال القصص بنسبة 15% مقارنة بالأسبوع الماضي.</span>
                    </div>
                  </div>
                  <div className="goal-box" style={{ background: 'var(--teacher-primary-light)', padding: '20px', borderRadius: '15px' }}>
                    <div className="goal-header" style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '0.9rem', marginBottom: '10px' }}>
                      <span>هدف الأسبوع: 1,500 قارئ</span>
                    </div>
                    <div className="progress-bg" style={{ width: '100%', height: '8px', background: '#fff', borderRadius: '4px', overflow: 'hidden' }}>
                      <div className="progress-bar" style={{ height: '100%', background: 'var(--teacher-primary)', width: '82%' }}></div>
                    </div>
                    <span style={{ display: 'block', textAlign: 'left', fontSize: '0.75rem', marginTop: '5px', fontWeight: 700, color: 'var(--teacher-primary)' }}>تم إنجاز 82%</span>
                  </div>
                </div>

                <div className="card-3d">
                  <h3 className="panel-title" style={{ fontWeight: 800, marginBottom: '20px' }}>آخر تقييمات الطلاب</h3>
                  {[
                    { name: "أحمد العلي", text: "شرح رائع جداً ومبسط، القصة ممتعة جداً وأفادتني في فهم الدرس التاريخي بشكل..." },
                    { name: "سارة منصور", text: "أتمنى إضافة المزيد من التمارين التفاعلية في نهاية كل قصة. المحتوى ممتاز..." }
                  ].map((rev, i) => (
                    <div className="review-item" key={i} style={{ display: 'flex', gap: '15px', padding: '15px 0', borderBottom: '1px solid #f8f8f8' }}>
                      <img className="rev-avatar" src={`https://i.pravatar.cc/150?u=${i + 10}`} alt="User" style={{ width: '45px', height: '45px', borderRadius: '50%' }} />
                      <div className="rev-content">
                        <span style={{ display: 'block', fontWeight: 800, fontSize: '0.95rem' }}>{rev.name}</span>
                        <div style={{ color: '#f9c851', fontSize: '0.8rem', margin: '3px 0' }}><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i></div>
                        <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: '1.5' }}>{rev.text}</p>
                      </div>
                    </div>
                  ))}
                  <button className="btn-3d-secondary" style={{ width: '100%', marginTop: '15px' }}>قراءة جميع الملاحظات</button>
                </div>
              </div>

              <div className="card-3d">
                <div className="panel-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                  <span style={{ fontWeight: 800, fontSize: '1.2rem' }}>نمو عدد القراء</span>
                  <select style={{ border: 'none', background: '#f1f3f8', padding: '5px 15px', borderRadius: '8px', fontWeight: 800 }}><option>آخر 7 أيام</option></select>
                </div>
                <div className="chart-placeholder" style={{ height: '300px', display: 'flex', alignItems: 'flex-end', gap: '15px', justifyContent: 'center', paddingTop: '20px' }}>
                  <div className="bar-group"><div className="bar" style={{ width: '40px', borderRadius: '8px 8px 0 0', background: 'var(--teacher-primary-light)', height: '140px' }}></div><div style={{ fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center', marginTop: '10px' }}>السبت</div></div>
                  <div className="bar-group"><div className="bar" style={{ width: '40px', borderRadius: '8px 8px 0 0', background: 'var(--teacher-primary-light)', height: '220px' }}></div><div style={{ fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center', marginTop: '10px' }}>الأحد</div></div>
                  <div className="bar-group"><div className="bar" style={{ width: '40px', borderRadius: '8px 8px 0 0', background: 'var(--teacher-primary)', height: '180px' }}></div><div style={{ fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center', marginTop: '10px' }}>الاثنين</div></div>
                  <div className="bar-group"><div className="bar" style={{ width: '40px', borderRadius: '8px 8px 0 0', background: 'var(--teacher-primary-light)', height: '120px' }}></div><div style={{ fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center', marginTop: '10px' }}>الثلاثاء</div></div>
                  <div className="bar-group"><div className="bar" style={{ width: '40px', borderRadius: '8px 8px 0 0', background: 'var(--teacher-primary-light)', height: '160px' }}></div><div style={{ fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center', marginTop: '10px' }}>الأربعاء</div></div>
                  <div className="bar-group"><div className="bar" style={{ width: '40px', borderRadius: '8px 8px 0 0', background: '#f9c851', height: '240px' }}></div><div style={{ fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center', marginTop: '10px' }}>الخميس</div></div>
                  <div className="bar-group"><div className="bar" style={{ width: '40px', borderRadius: '8px 8px 0 0', background: 'var(--teacher-primary-light)', height: '150px' }}></div><div style={{ fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center', marginTop: '10px' }}>الجمعة</div></div>
                </div>
              </div>
            </div>

            <section>
              <h3 className="bottom-title" style={{ fontWeight: 800, fontSize: '1.4rem', marginBottom: '25px' }}>أفضل القصص أداءً</h3>
              <div className="stories-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px' }}>
                {[
                  { title: "تاريخ الأندلس: عصر الملوك", img: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600", views: "1.8k", likes: "452", cat: "تاريخ" },
                  { title: "أسرار الفضاء للمبتدئين", img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600", views: "1.2k", likes: "312", cat: "علوم" }
                ].map((story, i) => (
                  <div className="card-3d" key={i} style={{ padding: '0', overflow: 'hidden' }}>
                    <img src={story.img} style={{ width: '100%', height: '180px', objectFit: 'cover' }} alt={story.title} />
                    <div style={{ padding: '20px' }}>
                      <span style={{ display: 'inline-block', padding: '4px 12px', background: '#f1f3f8', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, color: '#555', marginBottom: '10px' }}>{story.cat}</span>
                      <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '10px' }}>{story.title}</h4>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px', color: '#757575', fontSize: '0.85rem', fontWeight: 700 }}>
                        <span><i className="fa-solid fa-heart" style={{ color: '#ef4444' }}></i> {story.likes}</span>
                        <span><i className="fa-solid fa-eye"></i> {story.views}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        );
      case "author":
        return <StoryAuthor onHome={() => setActivePage("home")} />;
      case "video":
        return <AddShortVideo onHome={() => setActivePage("home")} />;
      case "ai":
        return <AISettings onHome={() => setActivePage("home")} />;
      case "tests":
        return <TestBank onHome={() => setActivePage("home")} />;
      case "salons":
        return <AudioSalons onHome={() => setActivePage("home")} />;
      case "students":
        return <Leaderboard onHome={() => setActivePage("home")} />;
      case "chat":
        return <GeneralChat />;
      case "profile":
        return <TeacherProfile onHome={() => setActivePage("home")} />;
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <TeacherLayout 
      activePage={activePage} 
      onPageChange={handlePageChange} 
      onLogout={onBack}
    >
      {renderContent()}
    </TeacherLayout>
  );
};

export default TeacherDashboard;
