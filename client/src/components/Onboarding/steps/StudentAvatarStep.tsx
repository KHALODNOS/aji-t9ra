import React from 'react';

interface StepProps {
  formData: any;
  updateFormData: (data: any) => void;
}

const StudentAvatarStep: React.FC<StepProps> = ({ formData, updateFormData }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-right">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-primary mb-2">اللمسات الأخيرة</h2>
        <p className="text-on-surface-variant font-medium">اختر اسماً مستعاراً وصورة رمزية لتميز حسابك.</p>
      </div>

      <div className="flex flex-col items-center gap-8">
        <div className="relative group">
          <div className="w-32 h-32 rounded-full border-4 border-primary/20 overflow-hidden bg-surface-variant">
            {formData.avatar ? (
              <img 
                src={typeof formData.avatar === 'string' ? formData.avatar : URL.createObjectURL(formData.avatar)} 
                alt="Avatar" 
                className="w-full h-full object-cover" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl text-primary/40">👤</div>
            )}
          </div>
          <label className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer shadow-lg hover:scale-110 transition-transform">
            <input
              type="file"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  updateFormData({ avatar: file });
                }
              }}
            />
            📸
          </label>
        </div>

        <div className="w-full space-y-3">
          <label className="block text-sm font-bold text-on-surface">اللقب (Nickname)</label>
          <input
            type="text"
            name="nickname"
            value={formData.nickname || ''}
            onChange={handleChange}
            className="input-stitch"
            placeholder="مثال: البطل الخارق"
          />
        </div>
      </div>
    </div>
  );
};

export default StudentAvatarStep;
