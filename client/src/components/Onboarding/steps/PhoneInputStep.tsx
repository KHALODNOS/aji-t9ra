import React from 'react';

interface StepProps {
  formData: any;
  updateFormData: (data: any) => void;
}

const PhoneInputStep: React.FC<StepProps> = ({ formData, updateFormData }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ PhoneNumber: e.target.value });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-right">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-primary mb-2">رقم الهاتف</h2>
        <p className="text-on-surface-variant">أدخل رقم هاتفك لتلقي رمز التحقق وتأمين حسابك.</p>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-semibold">رقم الهاتف</label>
        <div className="relative text-left">
          <input
            type="tel"
            name="PhoneNumber"
            value={formData.PhoneNumber || ''}
            onChange={handleChange}
            className="input-stitch pl-14 text-right"
            placeholder="06 00 00 00 00"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1 border-r border-outline-variant pr-2">
            <span className="text-sm font-bold">+212</span>
            <span className="text-lg">🇲🇦</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneInputStep;
