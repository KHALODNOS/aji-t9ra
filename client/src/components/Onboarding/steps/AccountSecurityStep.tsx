import React from 'react';

interface StepProps {
  formData: any;
  updateFormData: (data: any) => void;
}

const AccountSecurityStep: React.FC<StepProps> = ({ formData, updateFormData }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-right mb-8">
        <h2 className="text-2xl font-bold text-primary mb-2">الحساب والأمان</h2>
        <p className="text-on-surface-variant">قم بحماية حسابك واختيار كلمة مرور قوية.</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-on-surface">اسم المستخدم</label>
          <div className="relative">
            <input
              type="text"
              name="username"
              value={formData.username || ''}
              onChange={handleChange}
              className="input-stitch pr-10"
              placeholder="khalid_pro"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-on-surface">كلمة المرور</label>
          <div className="relative">
            <input
              type="password"
              name="password"
              value={formData.password || ''}
              onChange={handleChange}
              className="input-stitch pr-10"
              placeholder="••••••••"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-on-surface">تأكيد كلمة المرور</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword || ''}
            onChange={handleChange}
            className="input-stitch"
            placeholder="••••••••"
          />
        </div>

        <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-lg border border-primary/20 mt-6">
          <div className="flex-shrink-0 text-primary">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل، وتتضمن أرقاماً ورموزاً لزيادة الأمان.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccountSecurityStep;
