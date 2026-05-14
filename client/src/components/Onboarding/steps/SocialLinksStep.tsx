import React from 'react';

interface StepProps {
  formData: any;
  updateFormData: (data: any) => void;
}

const SocialLinksStep: React.FC<StepProps> = ({ formData, updateFormData }) => {
  const handleSocialChange = (field: string, value: string) => {
    updateFormData({ socialLinks: { ...(formData.socialLinks || {}), [field]: value } });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-right">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-primary mb-2">الروابط الاجتماعية والمهنية</h2>
        <p className="text-on-surface-variant font-medium">أضف روابط حساباتك المهنية لتعزيز ثقة الطلاب بملفك التعريفي.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-3">
          <label className="block text-sm font-bold text-on-surface">رابط LinkedIn</label>
          <div className="relative group">
            <input
              type="text"
              placeholder="https://linkedin.com/in/username"
              value={formData.socialLinks?.linkedin || ''}
              onChange={(e) => handleSocialChange('linkedin', e.target.value)}
              className="input-stitch pr-12"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/60 group-focus-within:text-primary transition-colors">
               <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-bold text-on-surface">رابط YouTube (اختياري)</label>
          <div className="relative group">
            <input
              type="text"
              placeholder="https://youtube.com/@channel"
              value={formData.socialLinks?.youtube || ''}
              onChange={(e) => handleSocialChange('youtube', e.target.value)}
              className="input-stitch pr-12"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-red-600/60 group-focus-within:text-red-600 transition-colors">
               <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-bold text-on-surface">الموقع الشخصي</label>
          <div className="relative group">
            <input
              type="text"
              placeholder="https://yourwebsite.com"
              value={formData.socialLinks?.website || ''}
              onChange={(e) => handleSocialChange('website', e.target.value)}
              className="input-stitch pr-12"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/60 group-focus-within:text-primary transition-colors">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialLinksStep;
