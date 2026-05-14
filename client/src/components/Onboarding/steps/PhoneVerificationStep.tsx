import React from 'react';

interface StepProps {
  formData: any;
  updateFormData: (data: any) => void;
}

const PhoneVerificationStep: React.FC<StepProps> = ({ formData, updateFormData }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ phoneOtp: e.target.value });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-right">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-primary mb-2">التحقق من الهاتف</h2>
        <p className="text-on-surface-variant">أدخل رمز التحقق الذي أرسلناه إلى هاتفك {formData.PhoneNumber}.</p>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-semibold">رمز التحقق (Phone OTP)</label>
        <input
          type="text"
          name="phoneOtp"
          value={formData.phoneOtp || ''}
          onChange={handleChange}
          className="input-stitch text-center text-2xl tracking-[1em] font-bold"
          placeholder="000000"
          maxLength={6}
        />
      </div>

      <p className="text-center text-sm text-on-surface-variant">
        لم تستلم الرمز؟ <button className="text-primary font-bold hover:underline">إعادة الإرسال</button>
      </p>
    </div>
  );
};

export default PhoneVerificationStep;
