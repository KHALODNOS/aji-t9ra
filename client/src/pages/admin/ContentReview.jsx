import React, { useState } from "react";

const ContentReview = () => {
  const [activeTab, setActiveTab] = useState("stories");

  const contentItems = [
    { title: "حكايات من الأطلس", teacher: "الأستاذة: فاطمة الزهراء", lang: "Tifinagh", img: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=500" },
    { title: "أساسيات الرياضيات الممتعة", teacher: "الأستاذ: كريم بنجلون", lang: "French", img: "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=500" },
    { title: "مغامرات في الغابة السحرية", teacher: "الأستاذة: مريم العلوي", lang: "English", img: "https://images.unsplash.com/photo-1474933148746-54628c5cd529?w=500" }
  ];

  return (
    <div className="content-area">
      <h1 className="page-title">مراجعة المحتوى</h1>

      <div className="tabs-toolbar-row">
        <div className="tabs-box">
          <div className={`tab-btn ${activeTab === "stories" ? "active" : ""}`} onClick={() => setActiveTab("stories")}>القصص</div>
          <div className={`tab-btn ${activeTab === "videos" ? "active" : ""}`} onClick={() => setActiveTab("videos")}>الفيديوهات</div>
          <div className={`tab-btn ${activeTab === "tests" ? "active" : ""}`} onClick={() => setActiveTab("tests")}>الاختبارات</div>
        </div>

        <div className="toolbar">
          <div className="check-all"><input type="checkbox" /> تحديد الكل</div>
          <button className="action-btn-bulk btn-approve-bulk"><i className="fa-solid fa-check"></i> موافقة على المحدد</button>
          <button className="action-btn-bulk btn-delete-bulk"><i className="fa-solid fa-trash-can"></i> حذف المحدد</button>
        </div>
      </div>

      <div className="cards-grid">
        {contentItems.map((item, i) => (
          <div className="card" key={i}>
            <input type="checkbox" className="card-check" />
            <div className="card-img-container">
              <img src={item.img} className="card-img" alt={item.title} />
              <div className="card-lang"><i className="fa-solid fa-globe"></i> {item.lang}</div>
            </div>
            <div className="card-content">
              <h3 className="card-title">{item.title}</h3>
              <div className="card-teacher"><i className="fa-regular fa-user"></i> {item.teacher}</div>
              <div className="card-btns">
                <button className="btn-view"><i className="fa-regular fa-eye"></i> معاينة سريعة</button>
                <div className="row-btns">
                  <button className="btn-ok">موافقة ونشر</button>
                  <button className="btn-no">رفض</button>
                  <button className="btn-more"><i className="fa-solid fa-file-lines"></i></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .content-area { padding: 30px; }
        .page-title { font-size: 2.2rem; font-weight: 800; color: #00458b; margin: 0 0 30px; text-align: center; }

        .tabs-toolbar-row {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          margin-bottom: 35px;
        }

        .tabs-box {
          background: #e9ecef;
          padding: 5px;
          border-radius: 12px;
          display: flex;
          gap: 5px;
        }
        .tab-btn {
          padding: 10px 40px;
          border-radius: 10px;
          font-weight: 800;
          cursor: pointer;
          transition: 0.2s;
          color: #555;
        }
        .tab-btn.active { background: #fff; color: #00458b; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }

        .toolbar {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .check-all { display: flex; align-items: center; gap: 10px; font-weight: 700; color: #757575; cursor: pointer; }
        
        .action-btn-bulk {
          border: none; border-radius: 10px; padding: 12px 22px; font-family: inherit; font-weight: 800; cursor: pointer;
          display: flex; align-items: center; gap: 10px;
        }
        .btn-approve-bulk { background: #eef2ff; color: #00458b; border: 1px solid #e0e7ff; }
        .btn-delete-bulk { background: #ffeaea; color: #d32f2f; border: 1px solid #fecaca; }

        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 30px;
        }

        .card {
          background: #fff;
          border-radius: 24px;
          overflow: hidden;
          border: 1px solid #f1f1f1;
          box-shadow: 0 6px 20px rgba(0,0,0,0.03);
          position: relative;
          transition: transform 0.3s ease;
        }
        .card:hover { transform: translateY(-5px); }

        .card-img-container { position: relative; height: 200px; }
        .card-img { width: 100%; height: 100%; object-fit: cover; }
        .card-check { position: absolute; top: 15px; left: 15px; width: 20px; height: 20px; z-index: 2; }
        .card-lang {
          position: absolute; bottom: 15px; right: 15px;
          background: #fff; padding: 6px 14px; border-radius: 25px;
          font-size: 0.85rem; font-weight: 800; color: #00458b;
          display: flex; align-items: center; gap: 8px; border: 1px solid #eee;
        }

        .card-content { padding: 20px; }
        .card-title { font-size: 1.4rem; font-weight: 800; margin: 0 0 8px; color: #1a1a1a; }
        .card-teacher { color: #757575; font-size: 0.9rem; margin-bottom: 20px; display: flex; align-items: center; gap: 8px; }

        .card-btns { display: flex; flex-direction: column; gap: 12px; }
        .btn-view {
          width: 100%; padding: 12px; border-radius: 12px; border: 1px solid #e9ecef;
          background: #fff; font-family: inherit; font-weight: 800; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 10px;
        }
        
        .row-btns { display: flex; gap: 10px; }
        .btn-ok { flex: 1; background: #00458b; color: #fff; border: none; border-radius: 12px; padding: 12px; font-weight: 800; cursor: pointer; }
        .btn-no { flex: 1; background: #ffeaea; color: #d32f2f; border: none; border-radius: 12px; padding: 12px; font-weight: 800; cursor: pointer; }
        .btn-more { width: 50px; background: #f8f9fa; border: 1px solid #eee; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #757575; cursor: pointer; }
      `}</style>
    </div>
  );
};

export default ContentReview;
