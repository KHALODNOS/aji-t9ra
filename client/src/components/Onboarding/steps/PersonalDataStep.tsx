import React from 'react';

interface StepProps {
  formData: any;
  updateFormData: (data: any) => void;
}

const PersonalDataStep: React.FC<StepProps> = ({ formData, updateFormData }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ [e.target.name]: e.target.value });
  };

  const handleRoleSelect = (role: 'teacher' | 'student') => {
    updateFormData({ Role: role });
  };

  const selectedRole = formData.Role || 'teacher';

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-right">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-primary mb-2">إنشاء حساب جديد</h2>
        <p className="text-on-surface-variant font-medium">ابدأ رحلتك معنا بإنشاء حسابك الأساسي واختيار دورك.</p>
      </div>

      {/* Role Selection Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <button
          type="button"
          onClick={() => handleRoleSelect('teacher')}
          className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-4 group ${selectedRole === 'teacher'
            ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
            : 'border-outline-variant hover:border-primary/40 bg-white'
            }`}
        >
          <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${selectedRole === 'teacher' ? 'bg-primary text-white' : 'bg-surface-variant text-on-surface-variant group-hover:bg-primary/10 group-hover:text-primary'
            }`}>
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
          </div>
          <div className="text-center">
            <span className={`block font-bold text-lg ${selectedRole === 'teacher' ? 'text-primary' : 'text-on-surface'}`}>أستاذ</span>
            <span className="text-xs text-on-surface-variant">أريد التدريس</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => handleRoleSelect('student')}
          className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-4 group ${selectedRole === 'student'
            ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
            : 'border-outline-variant hover:border-primary/40 bg-white'
            }`}
        >
          <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${selectedRole === 'student' ? 'bg-primary text-white' : 'bg-surface-variant text-on-surface-variant group-hover:bg-primary/10 group-hover:text-primary'
            }`}>
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div className="text-center">
            <span className={`block font-bold text-lg ${selectedRole === 'student' ? 'text-primary' : 'text-on-surface'}`}>طالب</span>
            <span className="text-xs text-on-surface-variant">أريد التعلم</span>
          </div>
        </button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-bold text-on-surface">البريد الإلكتروني</label>
          <input
            type="email"
            name="email"
            value={formData.email || ''}
            onChange={handleChange}
            className="input-stitch"
            placeholder="example@mail.com"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-on-surface">كلمة المرور</label>
          <input
            type="password"
            name="password"
            value={formData.password || ''}
            onChange={handleChange}
            className="input-stitch"
            placeholder="********"
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalDataStep;
