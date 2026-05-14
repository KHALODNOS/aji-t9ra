import React from 'react';

interface StepProps {
  formData: any;
  updateFormData: (data: any) => void;
}

const EmailVerificationStep: React.FC<StepProps> = ({ formData, updateFormData }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ otpCode: e.target.value });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-right">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-primary mb-2">التحقق من البريد الإلكتروني</h2>
        <p className="text-on-surface-variant">أرسلنا رمز التحقق إلى {formData.email}. يرجى إدخاله أدناه للمتابعة.</p>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-semibold">رمز التحقق (OTP)</label>
        <input
          type="text"
          name="otpCode"
          value={formData.otpCode || ''}
          onChange={handleChange}
          className="input-stitch text-center text-2xl tracking-[1em] font-bold"
          placeholder="000000"
          maxLength={6}
        />
      </div>

      <div className="flex items-center justify-center gap-2 p-4 bg-secondary/5 rounded-xl border border-secondary/20 mt-6">
        <p className="text-sm text-on-surface-variant">
          لم تصلك الرسالة؟ <button className="text-primary font-bold hover:underline">إعادة إرسال الرمز</button>
        </p>
      </div>
    </div>
  );
};

export default EmailVerificationStep;
