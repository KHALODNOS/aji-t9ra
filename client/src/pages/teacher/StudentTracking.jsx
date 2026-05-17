import React from "react";

const StudentTracking = () => {
  const students = [
    { name: "ياسين المنصوري", level: "المستوى الرابع", activity: "قراءة قصة: رحلة ابن بطوطة", score: "9/10", xp: "450 XP", avatar: "https://i.pravatar.cc/150?u=yassin" },
    { name: "ليلى الفاسي", level: "المستوى الثالث", activity: "اختبار: قواعد اللغة الأساسية", score: "7/10", xp: "320 XP", avatar: "https://i.pravatar.cc/150?u=leila" },
    { name: "عمر بناني", level: "المستوى الخامس", activity: "قراءة قصة: الأسد والفأر", score: "10/10", xp: "580 XP", avatar: "https://i.pravatar.cc/150?u=omar" }
  ];

  return (
    <div className="content-area">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div className="page-title">
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--teacher-primary)' }}>متابعة الطلاب</h1>
          <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700, marginTop: '5px' }}>آخر تحديث: منذ دقيقتين</div>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span style={{ fontWeight: 800, color: 'var(--teacher-primary)', marginLeft: '10px' }}>فلترة اللغة:</span>
          <button className="btn-3d-secondary" style={{ padding: '8px 18px', background: 'var(--teacher-primary)', color: '#fff' }}>الكل</button>
          <button className="btn-3d-secondary" style={{ padding: '8px 18px' }}>الأمازيغية</button>
          <button className="btn-3d-secondary" style={{ padding: '8px 18px' }}>الإنجليزية</button>
          <button className="btn-3d-secondary" style={{ padding: '8px 18px' }}>الفرنسية</button>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px', marginBottom: '40px' }}>
        <div className="card-3d" style={{ padding: '25px', textAlign: 'center' }}>
          <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#64748b', marginBottom: '15px', display: 'block' }}>معدل إكمال المحتوى</span>
          <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--teacher-primary)', marginBottom: '5px', display: 'block' }}>72%</span>
          <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '10px', marginTop: '15px', overflow: 'hidden' }}>
            <div style={{ height: '100%', background: '#f9c851', width: '72%' }}></div>
          </div>
        </div>
        <div className="card-3d" style={{ padding: '25px', textAlign: 'center' }}>
          <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#64748b', marginBottom: '15px', display: 'block' }}>أكثر القصص قراءة</span>
          <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--teacher-primary)', marginBottom: '5px', display: 'block' }}>أسرار الغابة</span>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#64748b' }}><i className="fa-solid fa-users"></i> 432 طالب هذا الأسبوع</span>
        </div>
        <div className="card-3d" style={{ padding: '25px', textAlign: 'center' }}>
          <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#64748b', marginBottom: '15px', display: 'block' }}>متوسط درجات الاختبارات</span>
          <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--teacher-primary)', marginBottom: '5px', display: 'block' }}>85%</span>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#10b981' }}><i className="fa-solid fa-arrow-up"></i> +2%</span>
        </div>
      </div>

      <section className="card-3d" style={{ padding: '35px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--teacher-primary)' }}>جدول متابعة الطلاب</h3>
          <button style={{ color: 'var(--teacher-primary)', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none' }}>
            <i className="fa-solid fa-file-export"></i> تصدير التقرير
          </button>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
          <thead>
            <tr>
              <th style={{ padding: '15px', fontSize: '0.85rem', color: '#94a3b8', borderBottom: '2px solid #f8fafc', fontWeight: 800 }}>الطالب</th>
              <th style={{ padding: '15px', fontSize: '0.85rem', color: '#94a3b8', borderBottom: '2px solid #f8fafc', fontWeight: 800 }}>آخر نشاط</th>
              <th style={{ padding: '15px', fontSize: '0.85rem', color: '#94a3b8', borderBottom: '2px solid #f8fafc', fontWeight: 800 }}>نتائج الاختبارات</th>
              <th style={{ padding: '15px', fontSize: '0.85rem', color: '#94a3b8', borderBottom: '2px solid #f8fafc', fontWeight: 800 }}>نقاط XP</th>
              <th style={{ padding: '15px', fontSize: '0.85rem', color: '#94a3b8', borderBottom: '2px solid #f8fafc', fontWeight: 800 }}>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, i) => (
              <tr key={i}>
                <td style={{ padding: '20px 15px', borderBottom: '1px solid #f8fafc' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <img style={{ width: '48px', height: '48px', borderRadius: '50%' }} src={student.avatar} alt={student.name} />
                    <div>
                      <span style={{ display: 'block', fontWeight: 800, color: 'var(--teacher-primary)' }}>{student.name}</span>
                      <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>{student.level}</span>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '20px 15px', borderBottom: '1px solid #f8fafc', color: '#475569', fontSize: '0.9rem', fontWeight: 700 }}>{student.activity}</td>
                <td style={{ padding: '20px 15px', borderBottom: '1px solid #f8fafc' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <span style={{ fontWeight: 800, color: 'var(--teacher-primary)' }}>{student.score}</span>
                    <div style={{ width: '80px', height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: '#f9c851', width: (parseInt(student.score) * 10) + '%' }}></div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '20px 15px', borderBottom: '1px solid #f8fafc' }}>
                  <span style={{ display: 'inline-block', padding: '5px 12px', background: '#fff9eb', color: '#d97706', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 800 }}>{student.xp}</span>
                </td>
                <td style={{ padding: '20px 15px', borderBottom: '1px solid #f8fafc' }}>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn-3d-secondary" style={{ padding: '8px 15px', background: '#eef2ff', color: 'var(--teacher-primary)', border: 'none' }}>عرض الملف</button>
                    <button className="btn-3d-secondary" style={{ width: '35px', height: '35px', padding: 0, justifyContent: 'center' }}><i className="fa-solid fa-star" style={{ color: '#f59e0b' }}></i></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ textAlign: 'center', marginTop: '25px', color: 'var(--teacher-primary)', fontWeight: 800, cursor: 'pointer', fontSize: '0.95rem' }}>عرض جميع الطلاب (42)</div>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '30px', marginTop: '30px' }}>
        <div className="card-3d" style={{ padding: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--teacher-primary)' }}>تحليل التفاعل</h3>
            <div style={{ display: 'flex', gap: '15px', fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--teacher-primary)' }}></div>إجابات</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f9c851' }}></div>تعليقات</div>
            </div>
          </div>
          <div style={{ height: '180px', display: 'flex', alignItems: 'flex-end', gap: '40px', justifyContent: 'center' }}>
            {[
              { label: 'ابن بطوطة', h1: 100, h2: 60 },
              { label: 'أسرار الغابة', h1: 140, h2: 80 },
              { label: 'الأسد والفأر', h1: 110, h2: 40 },
              { label: 'سندباد', h1: 90, h2: 30 },
              { label: 'كليلة ودمنة', h1: 120, h2: 50 }
            ].map((item, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', gap: '5px', alignItems: 'flex-end' }}>
                  <div style={{ width: '12px', height: `${item.h1}px`, background: 'var(--teacher-primary)', borderRadius: '4px' }}></div>
                  <div style={{ width: '12px', height: `${item.h2}px`, background: '#f9c851', borderRadius: '4px' }}></div>
                </div>
                <div style={{ marginTop: '10px', fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8' }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card-3d" style={{ background: 'var(--teacher-primary)', padding: '30px', color: '#fff', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px', opacity: 0.9 }}><i className="fa-solid fa-trophy"></i></div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '10px' }}>إنجاز جديد!</h3>
          <p style={{ fontSize: '0.9rem', lineHeight: 1.6, opacity: 0.9, marginBottom: '25px' }}>
            وصل 15 طالباً جديداً إلى المستوى الذهبي في اللغة الأمازيغية هذا الأسبوع. هل ترغب في إرسال رسالة تهنئة جماعية؟
          </p>
          <button className="btn-3d-secondary" style={{ width: '100%', background: '#f9c851', color: 'var(--teacher-primary)', border: 'none' }}>إرسال تهنئة</button>
        </div>
      </div>
    </div>
  );
};

export default StudentTracking;
