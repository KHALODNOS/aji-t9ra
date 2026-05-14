import React from 'react';
import { moroccoCities } from '../../../utils/moroccoCities';

interface StepProps {
  formData: any;
  updateFormData: (data: any) => void;
}

const StudentBasicInfoStep: React.FC<StepProps> = ({ formData, updateFormData }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    updateFormData({ [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-right">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-primary mb-2">معلوماتك الشخصية</h2>
        <p className="text-on-surface-variant font-medium">أخبرنا قليلاً عن نفسك لنخصص لك أفضل تجربة تعليمية.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <label className="block text-sm font-bold text-on-surface">اسم المستخدم</label>
          <input
            type="text"
            name="username"
            value={formData.username || ''}
            onChange={handleChange}
            className="input-stitch"
            placeholder="مثال: khalod_nos"
          />
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-bold text-on-surface">تاريخ الميلاد</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth || ''}
            onChange={handleChange}
            className="input-stitch text-right"
          />
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-bold text-on-surface">الجنس</label>
          <select
            name="sexe"
            value={formData.sexe || ''}
            onChange={handleChange}
            className="input-stitch"
          >
            <option value="">اختر الجنس</option>
            <option value="male">ذكر</option>
            <option value="female">أنثى</option>
          </select>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-bold text-on-surface">المدينة</label>
          <div className="relative">
            <select
              name="location"
              value={formData.location || ''}
              onChange={handleChange}
              className="input-stitch appearance-none"
            >
              <option value="">اختر مدينتك</option>
              {moroccoCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-primary/40">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentBasicInfoStep;
