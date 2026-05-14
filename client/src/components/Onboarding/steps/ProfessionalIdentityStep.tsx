import React from 'react';

interface StepProps {
  formData: any;
  updateFormData: (data: any) => void;
}

const ProfessionalIdentityStep: React.FC<StepProps> = ({ formData, updateFormData }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-right mb-8">
        <h2 className="text-2xl font-bold text-primary mb-2">الهوية المهنية</h2>
        <p className="text-on-surface-variant">اجعل ملفك الشخصي جذاباً للطلاب بصورة مهنية ووصف دقيق.</p>
      </div>

      <div className="flex flex-col items-center gap-6">
        {/* Profile Picture Upload Placeholder */}
        <div className="relative group">
          <div className="w-32 h-32 rounded-full bg-surface-variant border-4 border-white shadow-lg overflow-hidden flex items-center justify-center">
            {formData.profileImage ? (
              <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <svg className="w-16 h-16 text-outline" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            )}
          </div>
          <button className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-md hover:bg-primary-container transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>

        <div className="w-full space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-on-surface text-right">المسمى الوظيفي المهني</label>
            <input
              type="text"
              name="professionalTitle"
              value={formData.professionalTitle || ''}
              onChange={handleChange}
              className="input-stitch text-right"
              placeholder="مثال: مدرس خبير في اللغة العربية - 10 سنوات خبرة"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-on-surface text-right">شعارك الشخصي (اختياري)</label>
            <input
              type="text"
              name="tagline"
              value={formData.tagline || ''}
              onChange={handleChange}
              className="input-stitch text-right"
              placeholder="مثال: لنتعلم بذكاء ومتعة"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalIdentityStep;
