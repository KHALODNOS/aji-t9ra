import React, { useState } from "react";

const AISettings = () => {
  const [difficulty, setDifficulty] = useState(60);
  const [xp, setXp] = useState(50);

  return (
    <div className="content-area" style={{ display: 'grid', gridTemplateColumns: '1fr 450px', gap: '40px' }}>
      {/* Left Column: Settings */}
      <div className="form-column">
        <div className="card-3d" style={{ padding: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: 'var(--teacher-primary)', fontWeight: 800, fontSize: '1.3rem' }}>
              <i className="fa-solid fa-gear"></i>
              <span>إعدادات مختبر الذكاء الاصطناعي</span>
            </div>
            <span style={{ background: '#fef3c7', color: '#d97706', padding: '4px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800 }}>إصدار تجريبي v2.0</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '35px' }}>
            <div className="form-group">
              <label style={{ display: 'block', fontWeight: 800, fontSize: '0.95rem', marginBottom: '12px', color: '#374151' }}>اسم الشخصية</label>
              <input type="text" defaultValue="حكيم القرية" style={{ width: '100%', padding: '15px 20px', borderRadius: '15px', border: '1px solid #f3f4f6', background: '#f9fafb', outline: 'none' }} />
            </div>
            <div className="form-group">
              <label style={{ display: 'block', fontWeight: 800, fontSize: '0.95rem', marginBottom: '12px', color: '#374151' }}>نبرة الصوت</label>
              <input type="text" defaultValue="ودود (Friendly)" style={{ width: '100%', padding: '15px 20px', borderRadius: '15px', border: '1px solid #f3f4f6', background: '#f9fafb', outline: 'none' }} />
            </div>
          </div>

          <div className="difficulty-section" style={{ marginBottom: '40px' }}>
            <span style={{ background: 'var(--teacher-primary-light)', color: 'var(--teacher-primary)', padding: '4px 15px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800, display: 'inline-block', marginBottom: '10px' }}>متوسط</span>
            <label style={{ display: 'block', fontWeight: '800', marginBottom: '10px' }}>مستوى الصعوبة</label>
            <div style={{ width: '100%', position: 'relative', padding: '10px 0' }}>
              <input type="range" className="custom-slider" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} style={{ width: '100%', cursor: 'pointer' }} />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '40px' }}>
            <label style={{ display: 'block', fontWeight: 800, fontSize: '0.95rem', marginBottom: '12px', color: '#374151' }}>تعليمات البوت (System Prompt)</label>
            <textarea defaultValue="تحدث كأنك شخصية من القصة. ركز على استخدام الكلمات الصعبة التي حددتها أنا. ولا تعط الإجابة مباشرة." style={{ width: '100%', padding: '15px 20px', borderRadius: '15px', border: '1px solid #f3f4f6', background: '#f9fafb', outline: 'none', height: '150px', resize: 'none' }}></textarea>
          </div>

          <div style={{ background: 'var(--teacher-primary-light)', border: '2px dashed var(--teacher-primary)', borderRadius: '20px', padding: '25px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div className="stat-icon-3d" style={{ width: '50px', height: '50px', background: '#f9c851', color: '#fff' }}><i className="fa-solid fa-medal"></i></div>
              <div className="xp-text">
                <h5 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--teacher-primary)' }}>مكافآت الخبرة (XP)</h5>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>نقاط يكتسبها الطالب عند كل حوار</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <button style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #d1d5db', background: '#fff', cursor: 'pointer' }} onClick={() => setXp(xp - 5)}>-</button>
              <div style={{ background: '#fff', padding: '8px 25px', borderRadius: '12px', fontWeight: 800, border: '1px solid #eee' }}>{xp}</div>
              <button style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #d1d5db', background: '#fff', cursor: 'pointer' }} onClick={() => setXp(xp + 5)}>+</button>
            </div>
          </div>

          <div className="btn-group" style={{ display: 'flex', gap: '20px' }}>
            <button className="btn-3d-primary" style={{ flexGrow: 1, justifyContent: 'center' }}><i className="fa-solid fa-file-shield"></i> حفظ وتفعيل الشخصية</button>
            <button className="btn-3d-secondary" style={{ width: '150px', justifyContent: 'center' }}>إعادة تعيين</button>
          </div>
        </div>

        <div style={{ marginTop: '30px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="card-3d" style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h6 style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>إجمالي المحادثات اليوم</h6>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--teacher-primary)' }}>1,284</span>
            </div>
            <div style={{ fontSize: '1.5rem' }}>💬</div>
          </div>
          <div className="card-3d" style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h6 style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>تقييم رضا الطلاب</h6>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--teacher-primary)' }}>94%</span>
            </div>
            <div style={{ fontSize: '1.5rem' }}>😊</div>
          </div>
        </div>
      </div>

      {/* Right Column: Chat Preview */}
      <div className="preview-column">
        <div className="card-3d chat-preview" style={{ background: '#eef2f3', borderRadius: '40px', display: 'flex', flexDirection: 'column', height: '100%', padding: 0 }}>
          <div style={{ padding: '25px', background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 800, color: '#1f2937' }}>
              <div style={{ width: '10px', height: '10px', background: '#10b981', borderRadius: '5px' }}></div>
              <span>معاينة الشخصية</span>
            </div>
            <i className="fa-solid fa-flask" style={{ color: 'var(--teacher-primary)' }}></i>
          </div>
          
          <div style={{ flexGrow: 1, padding: '25px', display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto' }}>
            <div style={{ maxWidth: '85%', padding: '15px 20px', borderRadius: '20px', background: '#fff', alignSelf: 'flex-start', borderBottomRightRadius: '5px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', fontWeight: 600 }}>
              مرحباً أيها المستكشف! أنا "حكيم القرية". هل أنت مستعد للغوص في أسرار الفضاء؟ أخبرني ماذا تعرف عن الثقوب السوداء؟
            </div>
            <div style={{ maxWidth: '85%', padding: '15px 20px', borderRadius: '20px', background: 'var(--teacher-primary)', color: '#fff', alignSelf: 'flex-end', borderBottomLeftRadius: '5px', fontWeight: 600 }}>
              أريد أن أعرف كيف تتكون النجوم.
            </div>
            <div style={{ maxWidth: '85%', padding: '15px 20px', borderRadius: '20px', background: '#fff', alignSelf: 'flex-start', borderBottomRightRadius: '5px', fontWeight: 600 }}>
              سؤال ذكي! النجوم تولد من سحب غبار هائلة تسمى "السديم". تخيلها كحضانات كونية... هل يمكنك نطق كلمة "سديم"؟
            </div>
          </div>

          <div style={{ padding: '20px', background: '#fff', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <input type="text" placeholder="اكتب رسالتك هنا..." style={{ flexGrow: 1, background: '#f3f4f6', border: 'none', padding: '12px 20px', borderRadius: '15px', outline: 'none' }} />
            <button className="btn-send" style={{ width: '45px', height: '45px', borderRadius: '12px', background: 'var(--teacher-primary)', color: '#fff', border: 'none', cursor: 'pointer' }}><i className="fa-solid fa-paper-plane"></i></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISettings;
