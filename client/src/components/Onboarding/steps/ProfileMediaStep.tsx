import React, { useRef } from 'react';

interface StepProps {
  formData: any;
  updateFormData: (data: any) => void;
}

const ProfileMediaStep: React.FC<StepProps> = ({ formData, updateFormData }) => {
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (file) {
      // Store the actual file object for the API
      updateFormData({ [field]: file });
      
      // We'll also store a preview URL for the UI if needed, 
      // but let's check how the UI renders it. 
      // It currently uses formData[field] as src.
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-right">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-primary mb-2">الوسائط التعريفية</h2>
        <p className="text-on-surface-variant">الصور والفيديوهات تجذب الطلاب وتزيد من فرص اختيارك.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Photo Upload */}
        <div
          onClick={() => photoInputRef.current?.click()}
          className="group space-y-4 flex flex-col items-center p-6 border-2 border-dashed border-outline-variant rounded-2xl bg-white/30 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer relative overflow-hidden"
        >
          <input
            type="file"
            ref={photoInputRef}
            className="hidden"
            accept="image/*"
            onChange={(e) => handleFileChange(e, 'photoProfile')}
          />
          <label className="font-bold text-sm text-on-surface">صورة الملف الشخصي</label>
          <div className="w-32 h-32 rounded-full bg-surface-variant flex items-center justify-center overflow-hidden border-4 border-white shadow-lg group-hover:scale-105 transition-transform">
            {formData.photoProfile ? (
              <img 
                src={typeof formData.photoProfile === 'string' ? formData.photoProfile : URL.createObjectURL(formData.photoProfile)} 
                alt="Profile" 
                className="w-full h-full object-cover" 
              />
            ) : (
              <svg className="w-16 h-16 text-outline" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            )}
          </div>
          <button className="btn-secondary text-xs pointer-events-none">
            {formData.photoProfile ? 'تغيير الصورة' : 'رفع صورة'}
          </button>
        </div>

        {/* Video Upload */}
        <div
          onClick={() => videoInputRef.current?.click()}
          className="group space-y-4 flex flex-col items-center p-6 border-2 border-dashed border-outline-variant rounded-2xl bg-white/30 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer relative overflow-hidden"
        >
          <input
            type="file"
            ref={videoInputRef}
            className="hidden"
            accept="video/*"
            onChange={(e) => handleFileChange(e, 'videoProfile')}
          />
          <label className="font-bold text-sm text-on-surface">فيديو تعريفي (اختياري)</label>
          <div className="w-full aspect-video rounded-xl bg-surface-variant flex items-center justify-center border-4 border-white shadow-lg overflow-hidden group-hover:scale-[1.02] transition-transform">
            {formData.videoProfile ? (
              <video 
                src={typeof formData.videoProfile === 'string' ? formData.videoProfile : URL.createObjectURL(formData.videoProfile)} 
                className="w-full h-full object-cover" 
                controls 
              />
            ) : (
              <svg className="w-12 h-12 text-outline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </div>
          <button className="btn-secondary text-xs pointer-events-none">
            {formData.videoProfile ? 'تغيير الفيديو' : 'رفع فيديو'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileMediaStep;
