import React from "react";

const AudioSalons = () => {
  return (
    <div className="content-area" style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '30px' }}>
      <header style={{ gridColumn: '1 / -1', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--teacher-primary)', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div className="live-dot" style={{ width: '12px', height: '12px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 0 4px rgba(16, 185, 129, 0.2)' }}></div>
          <h1>الصالونات الصوتية المباشرة</h1>
        </div>
        <div style={{ background: '#fff', padding: '10px 20px', borderRadius: '12px', border: '1px solid #eee', fontWeight: 800, color: '#555', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <i className="fa-regular fa-calendar-check" style={{ color: 'var(--teacher-primary)' }}></i>
          اليوم: 24 مايو 2024
        </div>
      </header>

      {/* Left Column */}
      <div className="controls-col" style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
        <section className="card-3d" style={{ padding: '25px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 800, color: '#1e293b', marginBottom: '20px', fontSize: '1rem' }}>
            <i className="fa-solid fa-wave-square" style={{ color: '#f59e0b' }}></i> إعدادات البث
          </div>
          <div style={{ background: '#f8fafc', border: '2px dashed #e2e8f0', borderRadius: '20px', padding: '35px 20px', textAlign: 'center', marginBottom: '20px' }}>
            <i className="fa-solid fa-microphone-lines" style={{ fontSize: '2.2rem', color: '#cbd5e1', marginBottom: '12px', display: 'block' }}></i>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#334155' }}>الميكروفون نشط</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 800, color: '#64748b', marginBottom: '10px' }}>
            <span>مستوى الصوت</span><span>85%</span>
          </div>
          <input type="range" className="custom-slider" defaultValue="85" style={{ width: '100%' }} />
          <div style={{ height: '35px', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center', marginTop: '20px' }}>
            {[1,2,3,4,5,6,7,8,9,10,11,12].map(i => (
              <div key={i} style={{ width: '3px', background: 'var(--teacher-primary)', borderRadius: '3px', height: '15px', opacity: 0.5 }}></div>
            ))}
          </div>
        </section>

        <section className="card-3d" style={{ padding: '25px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 800, color: '#1e293b', marginBottom: '20px' }}>
            <i className="fa-solid fa-calendar-days" style={{ color: '#f59e0b' }}></i> جدولة غرفة جديدة
          </div>
          <div className="form-group" style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontWeight: 800, fontSize: '0.85rem', marginBottom: '8px', color: '#475569' }}>التاريخ والوقت</label>
            <input type="datetime-local" style={{ width: '100%', padding: '12px 15px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', outline: 'none' }} />
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', fontWeight: 700, color: '#64748b', cursor: 'pointer' }}>
            <input type="checkbox" /> 
            <span>تنبيه جميع الطلاب المشتركين</span>
          </label>
          <button className="btn-3d-secondary" style={{ width: '100%', marginTop: '15px' }}><i className="fa-solid fa-plus-circle"></i> إضافة إلى الجدول</button>

          <div style={{ marginTop: '25px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ fontWeight: '800', color: '#94a3b8', fontSize: '0.8rem', paddingRight: '5px' }}>الغرف القادمة</div>
            {[
              { title: 'تطوير مهارات الاستماع', time: 'غداً 10:00 - المستوى المتوسط' },
              { title: 'ورشة المصطلحات الطبية', time: 'الأحد 14:00 - المستوى المتقدم' }
            ].map((room, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '12px', borderRadius: '15px', background: '#f8fafc' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#fff', border: '1px solid #f1f1f1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>
                  <i className={`fa-solid ${i === 0 ? 'fa-headphones' : 'fa-stethoscope'}`}></i>
                </div>
                <div>
                  <b style={{ display: 'block', fontWeight: 800, color: '#1e293b', fontSize: '0.85rem' }}>{room.title}</b>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>{room.time}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Right Column */}
      <div className="rooms-col" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        <section className="card-3d" style={{ padding: '30px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--teacher-primary)', fontWeight: 800, fontSize: '1.2rem', marginBottom: '25px' }}>
            <i className="fa-solid fa-bolt-lightning"></i> فتح غرفة الآن
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 150px', gap: '20px', alignItems: 'flex-end' }}>
            <div className="form-group">
              <label style={{ display: 'block', fontWeight: 800, fontSize: '0.85rem', marginBottom: '8px' }}>عنوان الغرفة</label>
              <input type="text" style={{ width: '100%', padding: '12px 15px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc' }} placeholder="مثال: ممارسة المحادثة اليومية" />
            </div>
            <div className="form-group">
              <label style={{ display: 'block', fontWeight: 800, fontSize: '0.85rem', marginBottom: '8px' }}>مستوى اللغة</label>
              <select style={{ width: '100%', padding: '12px 15px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc' }}>
                <option>مبتدئ (A1-A2)</option>
                <option>متوسط (B1-B2)</option>
                <option>متقدم (C1-C2)</option>
              </select>
            </div>
            <button className="btn-3d-primary" style={{ padding: '14px' }}>ابدأ البث</button>
          </div>
        </section>

        <section className="card-3d" style={{ padding: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--teacher-primary)' }}>الغرف النشطة حالياً</h3>
            <div style={{ background: '#f1f5f9', padding: '4px 12px', borderRadius: '8px', fontOf: '0.8rem', color: '#475569', fontWeight: 800 }}>12 غرفة جارية</div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
            <thead>
              <tr>
                <th style={{ padding: '15px', fontSize: '0.85rem', color: '#94a3b8', borderBottom: '2px solid #f8fafc', fontWeight: 800 }}>المضيف</th>
                <th style={{ padding: '15px', fontSize: '0.85rem', color: '#94a3b8', borderBottom: '2px solid #f8fafc', fontWeight: 800 }}>الموضوع</th>
                <th style={{ padding: '15px', fontSize: '0.85rem', color: '#94a3b8', borderBottom: '2px solid #f8fafc', fontWeight: 800 }}>الحضور</th>
                <th style={{ padding: '15px', fontSize: '0.85rem', color: '#94a3b8', borderBottom: '2px solid #f8fafc', fontWeight: 800 }}>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'أ. سمير العلوي', subject: 'قواعد اللغة الأمازيغية للمبتدئين', count: '145 طالب', img: 'samir' },
                { name: 'أ. ليلى بناني', subject: 'نادي المحادثة باللغة الفرنسية', count: '82 طالب', img: 'leila' }
              ].map((row, i) => (
                <tr key={i}>
                  <td style={{ padding: '18px 15px', borderBottom: '1px solid #f8fafc' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <img style={{ width: '45px', height: '45px', borderRadius: '50%', border: '3px solid #f8fafc' }} src={`https://i.pravatar.cc/150?u=${row.img}`} alt="Host" />
                      <div style={{ color: 'var(--teacher-primary)', fontWeight: 800 }}>{row.name}</div>
                    </div>
                  </td>
                  <td style={{ padding: '18px 15px', borderBottom: '1px solid #f8fafc', color: '#475569', fontWeight: 700 }}>{row.subject}</td>
                  <td style={{ padding: '18px 15px', borderBottom: '1px solid #f8fafc' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.9rem', fontWeight: 700 }}>
                      <i className="fa-solid fa-users" style={{ color: '#94a3b8' }}></i>
                      {row.count}
                    </div>
                  </td>
                  <td style={{ padding: '18px 15px', borderBottom: '1px solid #f8fafc' }}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button className="btn-3d-secondary" style={{ padding: '8px 20px', background: '#eff6ff', color: '#2563eb', border: 'none' }}>انضمام</button>
                      <button className="btn-3d-secondary" style={{ padding: '8px 20px', background: '#fef2f2', color: '#ef4444', border: 'none' }}>إنهاء</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};

export default AudioSalons;
