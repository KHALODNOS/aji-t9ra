import React from 'react';

interface StepProps {
  formData: any;
  updateFormData: (data: any) => void;
}

const StudentLevelStep: React.FC<StepProps> = ({ formData, updateFormData }) => {
  const levels = [
    { id: 'beginner', label: 'مبتدئ', desc: 'أنا جديد تماماً في هذا المجال' },
    { id: 'intermediate', label: 'متوسط', desc: 'لدي بعض المعرفة الأساسية' },
    { id: 'advanced', label: 'متقدم', desc: 'أريد التعمق في مواضيع معقدة' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-right">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-primary mb-2">حدد مستواك الحالي</h2>
        <p className="text-on-surface-variant font-medium">سيساعدنا هذا في ترشيح أفضل المحتويات والأساتذة لك.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {levels.map((level) => (
          <button
            key={level.id}
            onClick={() => updateFormData({ level: level.id })}
            className={`p-6 rounded-2xl text-right transition-all border-2 ${
              formData.level === level.id
                ? 'bg-primary/10 border-primary shadow-lg shadow-primary/20'
                : 'bg-white border-outline-variant hover:border-primary/50'
            }`}
          >
            <h4 className="font-bold text-lg mb-1">{level.label}</h4>
            <p className="text-sm text-on-surface-variant">{level.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StudentLevelStep;
