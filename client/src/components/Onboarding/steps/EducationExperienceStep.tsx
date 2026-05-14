import React, { useState } from 'react';

interface StepProps {
  formData: any;
  updateFormData: (data: any) => void;
}

const EducationExperienceStep: React.FC<StepProps> = ({ formData, updateFormData }) => {
  const [showModal, setShowModal] = useState<'education' | 'experience' | null>(null);
  const [modalData, setModalData] = useState<any>({});
  const [eduPage, setEduPage] = useState(1);
  const [expPage, setExpPage] = useState(1);
  const itemsPerPage = 3;

  const handleAdd = () => {
    if (showModal === 'education') {
      const current = formData.education || [];
      updateFormData({ education: [...current, modalData] });
    } else if (showModal === 'experience') {
      const current = formData.experience || [];
      updateFormData({ experience: [...current, modalData] });
    }
    setShowModal(null);
    setModalData({});
  };

  const handleSocialChange = (field: string, value: string) => {
    updateFormData({ socialLinks: { ...(formData.socialLinks || {}), [field]: value } });
  };

  const renderPagination = (total: number, currentPage: number, setPage: (p: number) => void) => {
    const pages = Math.ceil(total / itemsPerPage);
    if (pages <= 1) return null;
    return (
      <div className="flex justify-center gap-2 mt-4">
        {Array.from({ length: pages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${
              currentPage === i + 1 
                ? 'bg-primary text-white shadow-lg scale-110' 
                : 'bg-white/50 text-on-surface hover:bg-white border border-outline-variant'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    );
  };

  const paginate = (items: any[], page: number) => {
    const start = (page - 1) * itemsPerPage;
    return (items || []).slice(start, start + itemsPerPage);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-right">
      {/* Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-300 border border-white/20">
            <h3 className="text-2xl font-bold text-primary mb-6 text-center">
              {showModal === 'education' ? '🎓 إضافة مؤهل علمي' : '💼 إضافة خبرة عملية'}
            </h3>
            <div className="space-y-4">
              {showModal === 'education' ? (
                <>
                  <input
                    type="text"
                    placeholder="الجامعة / المؤسسة"
                    className="input-stitch text-right"
                    onChange={(e) => setModalData({ ...modalData, university: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="الشهادة (مثال: إجازة في الرياضيات)"
                    className="input-stitch text-right"
                    onChange={(e) => setModalData({ ...modalData, degree: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="سنة التخرج"
                    className="input-stitch text-right"
                    onChange={(e) => setModalData({ ...modalData, year: e.target.value })}
                  />
                </>
              ) : (
                <>
                  <input
                    type="text"
                    placeholder="المؤسسة / الشركة"
                    className="input-stitch text-right"
                    onChange={(e) => setModalData({ ...modalData, company: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="المسمى الوظيفي"
                    className="input-stitch text-right"
                    onChange={(e) => setModalData({ ...modalData, title: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="مدة الخبرة (بالسنوات)"
                    className="input-stitch text-right"
                    onChange={(e) => setModalData({ ...modalData, years: e.target.value })}
                  />
                </>
              )}
            </div>
            <div className="flex gap-4 mt-8">
              <button onClick={handleAdd} className="btn-primary flex-1 py-3 rounded-2xl shadow-lg">حفظ البيانات</button>
              <button onClick={() => setShowModal(null)} className="btn-secondary flex-1 py-3 rounded-2xl">إلغاء</button>
            </div>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold text-primary mb-2">المسار المهني والأكاديمي</h2>
        <p className="text-on-surface-variant">شاركنا مؤهلاتك العلمية وخبراتك العملية لتعزيز ملفك الشخصي.</p>
      </div>

      {/* Education Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-2">
          <button 
            onClick={() => setShowModal('education')} 
            className="group flex items-center gap-2 bg-primary/10 text-primary hover:bg-primary hover:text-white px-4 py-2 rounded-xl text-sm font-bold transition-all"
          >
            <span className="text-lg">+</span> إضافة شهادة
          </button>
          <h3 className="font-bold text-lg border-r-4 border-primary pr-3">التعليم والمؤهلات</h3>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {paginate(formData.education, eduPage).map((edu: any, index: number) => (
            <div key={index} className="bg-white/40 backdrop-blur-sm p-4 rounded-2xl border border-white/50 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all group">
              <div className="flex justify-between items-center">
                <span className="text-primary font-black bg-primary/10 px-3 py-1 rounded-lg text-xs">{edu.year}</span>
                <div className="text-right">
                  <h4 className="font-bold text-on-surface group-hover:text-primary transition-colors">{edu.degree}</h4>
                  <p className="text-xs text-on-surface-variant">{edu.university}</p>
                </div>
              </div>
            </div>
          ))}
          {(!formData.education || formData.education.length === 0) && (
            <div className="text-center py-10 border-2 border-dashed border-primary/20 rounded-2xl bg-white/10">
              <p className="text-sm text-on-surface-variant italic">لم تقم بإضافة أي مؤهلات تعليمية بعد</p>
            </div>
          )}
        </div>
        {renderPagination(formData.education?.length || 0, eduPage, setEduPage)}
      </div>

      {/* Experience Section */}
      <div className="space-y-4 mt-10">
        <div className="flex justify-between items-center mb-2">
          <button 
            onClick={() => setShowModal('experience')} 
            className="group flex items-center gap-2 bg-secondary/10 text-secondary hover:bg-secondary hover:text-white px-4 py-2 rounded-xl text-sm font-bold transition-all"
          >
            <span className="text-lg">+</span> إضافة خبرة
          </button>
          <h3 className="font-bold text-lg border-r-4 border-secondary pr-3 text-secondary">الخبرة العملية</h3>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {paginate(formData.experience, expPage).map((exp: any, index: number) => (
            <div key={index} className="bg-white/40 backdrop-blur-sm p-4 rounded-2xl border border-white/50 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all group">
              <div className="flex justify-between items-center">
                <span className="text-secondary font-black bg-secondary/10 px-3 py-1 rounded-lg text-xs">{exp.years} سنوات</span>
                <div className="text-right">
                  <h4 className="font-bold text-on-surface group-hover:text-secondary transition-colors">{exp.title}</h4>
                  <p className="text-xs text-on-surface-variant">{exp.company}</p>
                </div>
              </div>
            </div>
          ))}
          {(!formData.experience || formData.experience.length === 0) && (
            <div className="text-center py-10 border-2 border-dashed border-secondary/20 rounded-2xl bg-white/10">
              <p className="text-sm text-on-surface-variant italic">لم تقم بإضافة أي خبرات عملية بعد</p>
            </div>
          )}
        </div>
        {renderPagination(formData.experience?.length || 0, expPage, setExpPage)}
      </div>

      {/* Social Links section removed - moved to separate step */}
    </div>
  );
};

export default EducationExperienceStep;
