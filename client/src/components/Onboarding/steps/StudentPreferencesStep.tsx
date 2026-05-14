import React from 'react';

interface StepProps {
  formData: any;
  updateFormData: (data: any) => void;
}

const StudentPreferencesStep: React.FC<StepProps> = ({ formData, updateFormData }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    updateFormData({ [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-right">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-primary mb-2">ماذا تريد أن تتعلم؟</h2>
        <p className="text-on-surface-variant font-medium">اختر المادة واللغة التي ترغب في إتقانها.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <label className="block text-sm font-bold text-on-surface">المادة الدراسية</label>
          <input
            type="text"
            name="subjectOfLearn"
            value={formData.subjectOfLearn || ''}
            onChange={handleChange}
            className="input-stitch"
            placeholder="مثال: الرياضيات، البرمجة..."
          />
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-bold text-on-surface">اللغة المستهدفة</label>
          <select
            name="targetLanguage"
            value={formData.targetLanguage || ''}
            onChange={handleChange}
            className="input-stitch"
          >
            <option value="">اختر اللغة</option>
            <option value="arabic">العربية</option>
            <option value="french">الفرنسية</option>
            <option value="english">الإنجليزية</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default StudentPreferencesStep;
