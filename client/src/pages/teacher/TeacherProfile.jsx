import React from "react";

const TeacherProfile = () => {
  return (
    <div className="content-area">
      <section className="card-3d" style={{ padding: '40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          <div style={{ position: 'relative' }}>
            <img style={{ width: '140px', height: '140px', borderRadius: '50%', border: '5px solid #fff', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', objectFit: 'cover' }} src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400" alt="Ahmed" />
            <div style={{ position: 'absolute', bottom: '10px', right: '10px', width: '28px', height: '28px', background: 'var(--teacher-primary)', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid #fff', fontSize: '0.7rem' }}><i className="fa-solid fa-check"></i></div>
          </div>
          <div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--teacher-primary)', marginBottom: '5px' }}>أستاذ محمد طويل</h1>
            <span style={{ fontSize: '1.1rem', color: '#64748b', fontWeight: 700 }}>متخصص لغة تيفيناغ</span>
            
            <div style={{ display: 'flex', gap: '30px', marginTop: '30px', paddingTop: '25px', borderTop: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="stat-icon-3d" style={{ width: '42px', height: '42px', background: 'var(--teacher-primary-light)', color: 'var(--teacher-primary)' }}><i className="fa-solid fa-users"></i></div>
                <div><b style={{ display: 'block', fontSize: '1.1rem', color: 'var(--teacher-primary)' }}>1,240</b><span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700 }}>إجمالي الطلاب</span></div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="stat-icon-3d" style={{ width: '42px', height: '42px', background: '#fff9eb', color: '#ca8a04' }}><i className="fa-solid fa-book"></i></div>
                <div><b style={{ display: 'block', fontSize: '1.1rem', color: 'var(--teacher-primary)' }}>45</b><span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700 }}>القصص المنشورة</span></div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="stat-icon-3d" style={{ width: '42px', height: '42px', background: '#fef2f2', color: '#dc2626' }}><i className="fa-solid fa-star"></i></div>
                <div><b style={{ display: 'block', fontSize: '1.1rem', color: 'var(--teacher-primary)' }}>4.9</b><span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700 }}>التقييم العام</span></div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <button className="btn-3d-primary" style={{ padding: '12px 30px' }}>تعديل الملف الشخصي</button>
          <button className="btn-3d-secondary" style={{ padding: '11px 30px' }}><i className="fa-solid fa-download"></i> تحميل السيرة الذاتية</button>
        </div>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '30px' }}>
        {/* Left Column */}
        <div>
          <div className="card-3d" style={{ padding: '30px', marginBottom: '30px' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--teacher-primary)', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '12px' }}><i className="fa-solid fa-language"></i> اللغات</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              <span style={{ padding: '8px 15px', borderRadius: '10px', background: 'var(--teacher-primary)', color: '#fff', fontSize: '0.85rem', fontWeight: 800 }}>تيفيناغ (خبير)</span>
              <span style={{ padding: '8px 15px', borderRadius: '10px', background: '#f9c851', color: 'var(--teacher-primary)', fontSize: '0.85rem', fontWeight: 800 }}>العربية (أم)</span>
              <span style={{ padding: '8px 15px', borderRadius: '10px', background: '#f1f5f9', color: '#475569', fontSize: '0.85rem', fontWeight: 800 }}>الإنجليزية (متقدم)</span>
            </div>
          </div>

          <div className="card-3d" style={{ padding: '30px', marginBottom: '30px' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--teacher-primary)', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '12px' }}><i className="fa-solid fa-bolt"></i> المهارات</div>
            {[
              { label: 'التعلم التفاعلي', val: '95%' },
              { label: 'رواية القصص Digital Storytelling', val: '90%' },
              { label: 'إدارة الفصول الافتراضية', val: '85%' }
            ].map((skill, i) => (
              <div key={i} style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 800, color: '#334155', marginBottom: '8px' }}><span>{skill.label}</span><span>{skill.val}</span></div>
                <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' }}><div style={{ height: '100%', background: '#f9c851', width: skill.val }}></div></div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div>
          <div className="card-3d" style={{ padding: '30px', marginBottom: '30px' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--teacher-primary)', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '12px' }}><i className="fa-solid fa-user-tie"></i> النبذة الشخصية</div>
            <p style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.8, fontWeight: 600 }}>
              أنا أستاذ متخصص في تدريس اللغة الأمازيغية وخط التيفيناغ، أسعى دائماً لدمج التكنولوجيا مع التراث الثقافي لخلق تجارب تعليمية فريدة. أؤمن بأن سرد القصص الرقمي هو المفتاح لفتح آفاق الإبداع لدى الطلاب وتحفيزهم على اكتشاف هويتهم اللغوية من خلال أدوات التعلم التفاعلية والذكاء الاصطناعي.
            </p>
          </div>

          <div className="card-3d" style={{ padding: '30px' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--teacher-primary)', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '12px' }}><i className="fa-solid fa-graduation-cap"></i> المؤهلات العلمية</div>
            {[
              { title: 'ماجستير في اللسانيات', sub: 'جامعة محمد الخامس - الرباط', icon: 'fa-medal', yellow: false },
              { title: 'بكالوريوس في الدراسات الأمازيغية', sub: 'كلية الآداب والعلوم الإنسانية', icon: 'fa-award', yellow: true }
            ].map((qual, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px', background: '#f8fafc', borderRadius: '15px', marginBottom: '15px', border: '1px solid #f1f5f9' }}>
                <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: '#fff', border: '1.5px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'center', color: qual.yellow ? '#ca8a04' : 'var(--teacher-primary)', fontSize: '1.1rem' }}>
                  <i className={`fa-solid ${qual.icon}`}></i>
                </div>
                <div><b style={{ display: 'block', fontSize: '1rem', color: 'var(--teacher-primary)', marginBottom: '2px' }}>{qual.title}</b><span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700 }}>{qual.sub}</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;
