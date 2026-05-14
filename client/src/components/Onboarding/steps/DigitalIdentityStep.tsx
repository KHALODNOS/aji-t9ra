import React from 'react';

interface StepProps {
  formData: any;
  updateFormData: (data: any) => void;
}

const DigitalIdentityStep: React.FC<StepProps> = ({ formData, updateFormData }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ [e.target.name]: e.target.value });
  };

  const socialLinks = [
    { id: 'linkedin', label: 'LinkedIn', icon: '🔗', placeholder: 'linkedin.com/in/username' },
    { id: 'facebook', label: 'Facebook', icon: '👥', placeholder: 'facebook.com/username' },
    { id: 'youtube', label: 'YouTube', icon: '🎥', placeholder: 'youtube.com/c/channel' },
    { id: 'website', label: 'الموقع الشخصي', icon: '🌐', placeholder: 'www.example.com' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-right mb-8">
        <h2 className="text-2xl font-bold text-primary mb-2">الهوية الرقمية</h2>
        <p className="text-on-surface-variant">اربط حساباتك المهنية لتعزيز مصداقيتك وتواصلك.</p>
      </div>

      <div className="space-y-4">
        {socialLinks.map((link) => (
          <div key={link.id} className="space-y-2">
            <label className="block text-sm font-semibold text-on-surface text-right">{link.label}</label>
            <div className="relative group">
              <input
                type="text"
                name={link.id}
                value={formData[link.id] || ''}
                onChange={handleChange}
                className="input-stitch pr-12 text-left"
                placeholder={link.placeholder}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl grayscale group-focus-within:grayscale-0 transition-all">
                {link.icon}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DigitalIdentityStep;
