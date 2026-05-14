import React from 'react';

interface StepProps {
  formData: any;
  updateFormData: (data: any) => void;
}

const ReviewStep: React.FC<StepProps> = ({ formData, updateFormData }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-right">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-primary mb-2">المراجعة والقبول</h2>
        <p className="text-on-surface-variant">الخطوة الأخيرة للانضمام إلى "أجي تقرا".</p>
      </div>

      <div className="bg-white/30 rounded-2xl p-6 border border-outline-variant space-y-4">
        <h3 className="font-bold text-lg">ملخص البيانات</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between border-b border-outline-variant/30 pb-2">
            <span className="text-on-surface-variant">البريد:</span>
            <span className="font-semibold">{formData.email}</span>
          </div>
          <div className="flex justify-between border-b border-outline-variant/30 pb-2">
            <span className="text-on-surface-variant">الهاتف:</span>
            <span className="font-semibold">{formData.PhoneNumber}</span>
          </div>
          <div className="flex justify-between border-b border-outline-variant/30 pb-2">
            <span className="text-on-surface-variant">اسم المستخدم:</span>
            <span className="font-semibold">{formData.username}</span>
          </div>
          <div className="flex justify-between border-b border-outline-variant/30 pb-2">
            <span className="text-on-surface-variant">اللغات:</span>
            <span className="font-semibold">{formData.fluentLanguages?.join('، ')}</span>
          </div>
        </div>
      </div>

      <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl space-y-4">
        <label className="flex items-start gap-3 cursor-pointer group">
          <div className="relative mt-1">
            <input
              type="checkbox"
              checked={formData.acceptanceOfTermsAndConditions}
              onChange={(e) => updateFormData({ acceptanceOfTermsAndConditions: e.target.checked })}
              className="sr-only"
            />
            <div className={`w-6 h-6 rounded border-2 transition-all flex items-center justify-center ${
              formData.acceptanceOfTermsAndConditions ? 'bg-primary border-primary' : 'bg-white border-outline-variant'
            }`}>
              {formData.acceptanceOfTermsAndConditions && (
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </div>
          <span className="text-sm font-medium text-on-surface leading-relaxed group-hover:text-primary transition-colors">
            أوافق على جميع شروط وأحكام المنصة، وأتعهد بصحة البيانات المدخلة أعلاه والالتزام بمعايير الجودة التعليمية.
          </span>
        </label>
      </div>

      <div className="text-xs text-on-surface-variant p-4 bg-surface-variant/20 rounded-lg italic">
        * سيتم مراجعة طلبك من قبل الفريق التقني وسيصلك رد عبر البريد الإلكتروني خلال 24-48 ساعة.
      </div>
    </div>
  );
};

export default ReviewStep;
