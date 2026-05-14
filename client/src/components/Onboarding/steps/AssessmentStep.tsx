import React from 'react';

interface StepProps {
  formData: any;
  updateFormData: (data: any) => void;
}

const AssessmentStep: React.FC<StepProps> = ({ formData, updateFormData }) => {
  const questions = [
    {
      id: 'tech_skill',
      question: 'كيف تقيم مهاراتك التقنية في التدريس عن بعد؟',
      options: ['مبتدئ', 'متوسط', 'خبير']
    },
    {
      id: 'availability',
      question: 'ما هو الوقت المفضل لديك لتقديم الدروس؟',
      options: ['الصباح', 'المساء', 'نهاية الأسبوع']
    },
    {
      id: 'student_level',
      question: 'ما هي المستويات التي تفضل تدريسها؟',
      options: ['ابتدائي', 'إعدادي', 'ثانوي', 'جامعي']
    }
  ];

  const handleSelect = (questionId: string, option: string) => {
    updateFormData({ [questionId]: option });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-right mb-8">
        <h2 className="text-2xl font-bold text-primary mb-2">تقييم المستوى</h2>
        <p className="text-on-surface-variant">ساعدنا في فهم أسلوبك وتفضيلاتك لنوفر لك أفضل الفرص.</p>
      </div>

      <div className="space-y-8">
        {questions.map((q) => (
          <div key={q.id} className="space-y-4">
            <p className="font-bold text-on-surface text-right">{q.question}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {q.options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleSelect(q.id, option)}
                  className={`p-3 rounded-lg border-2 text-sm font-semibold transition-all ${
                    formData[q.id] === option
                      ? 'border-primary bg-primary text-white shadow-lg'
                      : 'border-outline-variant hover:border-primary/50'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssessmentStep;
