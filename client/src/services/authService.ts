import api from './api';

export const authService = {
  // Public Routes
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  verifyEmail: (data: any) => api.post('/auth/verify-email', data),

  // Step 3: Phone OTP
  sendPhoneOtp: (data: any) => api.post('/auth/send-phone-otp', data),
  verifyPhoneOtp: (data: any) => api.post('/auth/verify-phone-otp', data),

  // Teacher Onboarding Steps
  teacherStep1: (data: any) => {
    const isFormData = data instanceof FormData;
    return api.post('/auth/teacher/step1', data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
    });
  },
  teacherStep2: (data: any) => api.post('/auth/teacher/step2', data),
  teacherStep3: (data: any) => api.post('/auth/teacher/step3', data),
  teacherStep4: (data: any) => api.post('/auth/teacher/step4', data),
  teacherStep5: (data: any) => api.post('/auth/teacher/step5', data),
  teacherStep6: (data: any) => api.post('/auth/teacher/step6', data),

  // Student Onboarding Steps
  studentStep1: (data: any) => api.post('/auth/student/step1', data),
  studentStep2: (data: any) => api.post('/auth/student/step2', data),
  studentStep3: (data: any) => api.post('/auth/student/step3', data),
  studentStep4: (data: any) => {
    const isFormData = data instanceof FormData;
    return api.post('/auth/student/step4', data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
    });
  },
};
