import React, { useState } from 'react';
import { authService } from '../../services/authService';
import PersonalDataStep from './steps/PersonalDataStep';
import EmailVerificationStep from './steps/EmailVerificationStep';
import PhoneInputStep from './steps/PhoneInputStep';
import PhoneVerificationStep from './steps/PhoneVerificationStep';
import ProfileMediaStep from './steps/ProfileMediaStep';
import TeacherBasicInfoStep from './steps/TeacherBasicInfoStep';
import SpecializationStep from './steps/SpecializationStep';
import EducationExperienceStep from './steps/EducationExperienceStep';
import SocialLinksStep from './steps/SocialLinksStep';
import ReviewStep from './steps/ReviewStep';
import CustomAlert from '../common/CustomAlert';

// Student Steps
import StudentBasicInfoStep from './steps/StudentBasicInfoStep';
import StudentPreferencesStep from './steps/StudentPreferencesStep';
import StudentLevelStep from './steps/StudentLevelStep';
import StudentAvatarStep from './steps/StudentAvatarStep';

const OnboardingFlow = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [formData, setFormData] = useState({
    // Step 1: Registration
    email: '',
    password: '',
    Role: 'teacher',
    // Step 2 & 4: OTP Codes
    otpCode: '',
    phoneOtp: '',
    // Step 3: Phone
    PhoneNumber: '',
    // Teacher Specific
    photoProfile: '',
    videoProfile: '',
    username: '',
    sexe: '',
    location: '',
    fluentLanguages: [],
    education: [],
    experience: [],
    socialLinks: { linkedin: '', website: '', youtube: '' },
    // Student Specific
    dateOfBirth: '',
    subjectOfLearn: '',
    targetLanguage: '',
    level: '',
    avatar: '',
    nickname: '',
    // Common
    acceptanceOfTermsAndConditions: false,
  });

  const sharedSteps = [
    { label: 'التسجيل', component: PersonalDataStep },
    { label: 'الإيميل', component: EmailVerificationStep },
    { label: 'الهاتف', component: PhoneInputStep },
    { label: 'التفعيل', component: PhoneVerificationStep },
  ];

  const teacherSpecificSteps = [
    { label: 'الوسائط', component: ProfileMediaStep },
    { label: 'المعلومات', component: TeacherBasicInfoStep },
    { label: 'اللغات', component: SpecializationStep },
    { label: 'المسار', component: EducationExperienceStep },
    { label: 'الروابط', component: SocialLinksStep },
    { label: 'الإنهاء', component: ReviewStep },
  ];

  const studentSpecificSteps = [
    { label: 'المعلومات', component: StudentBasicInfoStep },
    { label: 'التفضيلات', component: StudentPreferencesStep },
    { label: 'المستوى', component: StudentLevelStep },
    { label: 'الهوية', component: StudentAvatarStep },
  ];

  const currentSteps = formData.Role === 'teacher'
    ? [...sharedSteps, ...teacherSpecificSteps]
    : [...sharedSteps, ...studentSpecificSteps];

  const totalSteps = currentSteps.length;

  const updateFormData = (newData: any) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleNext = async () => {
    setAlert(null);
    setLoading(true);
    try {
      let response;
      const { Role } = formData;

      if (step === 1) {
        // Registration
        await authService.register({
          email: formData.email,
          password: formData.password,
          Role: formData.Role
        });
      } else if (step === 2) {
        // Verify Email
        response = await authService.verifyEmail({
          email: formData.email,
          otpCode: formData.otpCode
        });
        // Save token for subsequent protected steps
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
      } else if (step === 3) {
        // Send Phone OTP
        await authService.sendPhoneOtp({
          PhoneNumber: formData.PhoneNumber
        });
      } else if (step === 4) {
        // Verify Phone OTP
        await authService.verifyPhoneOtp({
          phoneOtp: formData.phoneOtp
        });
      } else if (Role === 'teacher') {
        // Teacher Steps
        if (step === 5) {
          const teacherData = new FormData();
          if (formData.photoProfile) teacherData.append('photoProfile', formData.photoProfile);
          if (formData.videoProfile) teacherData.append('videoProfile', formData.videoProfile);

          await authService.teacherStep1(teacherData);
        } else if (step === 6) {
          await authService.teacherStep2({
            username: formData.username,
            sexe: formData.sexe,
            location: formData.location
          });
        } else if (step === 7) {
          // Transform fluentLanguages to [{ language, level }]
          const formattedLanguages = (formData.fluentLanguages || []).map((lang: string) => ({
            language: lang,
            level: 'Advanced' // Default level
          }));
          await authService.teacherStep3({
            fluentLanguages: formattedLanguages
          });
        } else if (step === 8) {
          // Transform education and experience
          const formattedEducation = (formData.education || []).map((edu: any) => ({
            degree: edu.degree,
            institution: edu.university,
            year: edu.year // Note: Schema expects startDate/endDate, but we'll send what we have
          }));
          const formattedExperience = (formData.experience || []).map((exp: any) => ({
            jobTitle: exp.title,
            company: exp.company,
            years: exp.years
          }));
          await authService.teacherStep4({
            education: formattedEducation,
            experience: formattedExperience
          });
        } else if (step === 9) {
          // Transform socialLinks to [{ platform, url }]
          const formattedSocialLinks = Object.entries(formData.socialLinks || {})
            .filter(([_, url]) => url)
            .map(([platform, url]) => ({ platform, url }));

          await authService.teacherStep5({
            socialLinks: formattedSocialLinks
          });
        } else if (step === 10) {
          await authService.teacherStep6({
            acceptanceOfTermsAndConditions: formData.acceptanceOfTermsAndConditions
          });
          setAlert({ message: 'تم إكمال عملية التسجيل بنجاح!', type: 'success' });
          // Redirect or handle completion
          return;
        }
      }
      else if (Role === 'student') {
        // Student Steps
        if (step === 5) {
          await authService.studentStep1({
            username: formData.username,
            dateOfBirth: formData.dateOfBirth,
            sexe: formData.sexe
          });
        } else if (step === 6) {
          // Transform subjectOfLearn to array [String]
          await authService.studentStep2({
            subjectOfLearn: [formData.subjectOfLearn],
            targetLanguage: formData.targetLanguage
          });
        } else if (step === 7) {
          // Capitalize level (beginner -> Beginner)
          const capitalizedLevel = formData.level.charAt(0).toUpperCase() + formData.level.slice(1);
          await authService.studentStep3({
            level: capitalizedLevel
          });
        } else if (step === 8) {
          const studentData = new FormData();
          if (formData.avatar) studentData.append('avatar', formData.avatar);
          if (formData.nickname) studentData.append('nickname', formData.nickname);

          await authService.studentStep4(studentData);
          setAlert({ message: 'تم إكمال عملية التسجيل بنجاح!', type: 'success' });
          // Redirect or handle completion
          return;
        }
      }

      nextStep();
    } catch (err: any) {
      console.error('Onboarding Error:', err);
      setAlert({
        message: err.response?.data?.message || 'حدث خطأ ما، يرجى المحاولة مرة أخرى.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const ActiveStepComponent = currentSteps[step - 1].component;

  return (
    <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-4 md:p-8 dir-rtl perspective-1000 overflow-hidden" dir="rtl">
      {/* Soft decorative elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#5DA296]/10 rounded-full blur-[120px] opacity-60"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#5DA296]/10 rounded-full blur-[120px] opacity-60"></div>

      <div className="w-full max-w-5xl z-10">
        {/* Progress Tracker */}
        <div className="mb-12 overflow-x-auto pb-4 hide-scrollbar">
          <div className="flex justify-between items-start min-w-[800px] px-2">
            {currentSteps.map((info, i) => {
              const isCompleted = step > i + 1;
              const isActive = step === i + 1;
              return (
                <div key={i} className="flex flex-col items-center gap-3 flex-1 relative">
                  {i < currentSteps.length - 1 && (
                    <div className="absolute top-5 left-1/2 w-full h-[2px] bg-surface-variant -z-10">
                      <div
                        className="h-full bg-primary transition-all duration-500"
                        style={{ width: isCompleted ? '100%' : '0%' }}
                      ></div>
                    </div>
                  )}

                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${isCompleted
                      ? 'bg-primary border-primary text-white scale-90 shadow-lg'
                      : isActive
                        ? 'bg-white border-primary text-primary scale-110 shadow-xl shadow-primary/20'
                        : 'bg-white/80 border-outline-variant text-on-surface-variant'
                      }`}
                  >
                    {isCompleted ? (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className="text-sm font-bold">{i + 1}</span>
                    )}
                  </div>
                  <div className="flex flex-col items-center">
                    <span className={`text-[10px] font-black whitespace-nowrap ${isActive ? 'text-primary' : 'text-on-surface-variant/70'}`}>
                      {info.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white min-h-[550px] flex flex-col transition-all duration-500 transform-gpu preserve-3d rounded-[2rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-8 md:p-12 relative overflow-hidden">
          <div className="flex-grow">
            {alert && (
              <CustomAlert
                message={alert.message}
                type={alert.type}
                onClose={() => setAlert(null)}
              />
            )}
            <ActiveStepComponent formData={formData} updateFormData={updateFormData} />
          </div>

          <div className="flex justify-between mt-12 pt-8 border-t border-primary/10">
            <button
              onClick={prevStep}
              disabled={step === 1 || loading}
              className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-bold transition-all ${step === 1
                ? 'opacity-0 cursor-default'
                : 'text-on-surface-variant hover:bg-white/50 hover:text-primary disabled:opacity-50'
                }`}
            >
              <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              السابق
            </button>

            <button
              onClick={handleNext}
              disabled={loading}
              className="group flex items-center gap-2 bg-primary text-white px-12 py-3 rounded-2xl font-bold shadow-xl shadow-primary/30 hover:bg-primary-container hover:scale-[1.05] transition-all active:scale-[0.95] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>جاري التحميل...</span>
                </div>
              ) : (
                <>
                  {step === totalSteps ? 'تأكيد الحساب' : 'الخطوة التالية'}
                  {step !== totalSteps && (
                    <svg className="w-5 h-5 group-hover:translate-x-[-4px] transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                    </svg>
                  )}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;
