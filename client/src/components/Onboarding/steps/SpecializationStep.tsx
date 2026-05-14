import React from 'react';

interface StepProps {
  formData: any;
  updateFormData: (data: any) => void;
}

const SpecializationStep: React.FC<StepProps> = ({ formData, updateFormData }) => {
  const languages = [
    { id: 'arabic', name: 'العربية', flag: '🇲🇦' },
    { id: 'tamazight', name: 'الامازيغية', flag: '♓' },
    { id: 'french', name: 'الفرنسية', flag: '🇫🇷' },
    { id: 'english', name: 'الإنجليزية', flag: '🇬🇧' },
    { id: 'spanish', name: 'الإسبانية', flag: '🇪🇸' },
    { id: 'german', name: 'الألمانية', flag: '🇩🇪' },
  ];

  const toggleLanguage = (lang: string) => {
    const current = formData.fluentLanguages || [];
    if (current.includes(lang)) {
      updateFormData({ fluentLanguages: current.filter((l: string) => l !== lang) });
    } else {
      updateFormData({ fluentLanguages: [...current, lang] });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-right">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-primary mb-2">اللغات المتقنة</h2>
        <p className="text-on-surface-variant">اختر اللغات التي تجيدها وتستطيع التدريس بها.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {languages.map((lang) => (
          <button
            key={lang.id}
            onClick={() => toggleLanguage(lang.id)}
            className={`p-4 rounded-xl border-2 transition-all flex items-center justify-between gap-3 ${
              formData.fluentLanguages?.includes(lang.id)
                ? 'border-primary bg-primary/5 scale-105 shadow-md'
                : 'border-outline-variant hover:border-primary/50 bg-white'
            }`}
          >
            <span className="text-2xl">{lang.flag}</span>
            <span className="font-bold">{lang.name}</span>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              formData.fluentLanguages?.includes(lang.id) ? 'bg-primary border-primary' : 'border-outline-variant'
            }`}>
              {formData.fluentLanguages?.includes(lang.id) && (
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SpecializationStep;
