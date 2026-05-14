import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import CustomAlert from '../components/common/CustomAlert';
import { LogIn, Mail, Lock, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import background from '../assets/background.png';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setAlert(null);

        try {
            const response = await authService.login(formData);
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            setAlert({ message: 'تم تسجيل الدخول بنجاح! جاري تحويلك...', type: 'success' });

            setTimeout(() => {
                if (!user.onboardingCompleted) {
                    navigate('/register');
                } else if (user.Role === 'teacher') {
                    navigate('/teacher/dashboard');
                } else if (user.Role === 'student') {
                    navigate('/student/dashboard');
                } else {
                    navigate('/');
                }
            }, 1500);

        } catch (err: any) {
            setAlert({
                message: err.response?.data?.message || 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-transparent flex items-center justify-center p-6 relative overflow-hidden bg-cover bg-center" dir="rtl" style={{ backgroundImage: `url(${background})` }}>
            {/* Soft decorative elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#5DA296]/10 rounded-full blur-[120px] opacity-60"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#5DA296]/10 rounded-full blur-[120px] opacity-60"></div>

            {alert && (
                <CustomAlert
                    message={alert.message}
                    type={alert.type}
                    onClose={() => setAlert(null)}
                />
            )}

            <div className="w-full max-w-[1000px] grid md:grid-cols-2 gap-0 bg-white rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 animate-in fade-in zoom-in duration-700">

                {/* Left Side: Branding */}
                <div className="hidden md:flex flex-col justify-center p-16 bg-slate-50 relative overflow-hidden">
                    <div className="relative z-10 space-y-6">
                        <div className="flex items-center gap-3 mb-10">
                            <div className="w-10 h-10 bg-[#5DA296] rounded-lg flex items-center justify-center shadow-lg">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-black tracking-tight text-[#5DA296] font-heading">أجي تقرا</span>
                        </div>

                        <h2 className="text-4xl font-black leading-tight text-slate-900 font-heading">
                            مرحباً بك في <br />
                            <span className="text-[#5DA296]">عالم اللغات</span>
                        </h2>
                        <p className="text-slate-600 text-lg leading-relaxed max-w-xs">
                            اكتشف طرقاً جديدة للتعلم والتواصل مع أفضل الخبراء في المجال.
                        </p>

                        <div className="pt-10">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#5DA296]/10 text-[#5DA296] rounded-full text-sm font-bold">
                                <LogIn className="w-4 h-4" />
                                <span>أكثر من 10,000 طالب مفعل</span>
                            </div>
                        </div>
                    </div>

                    {/* Abstract background elements for branding side */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#5DA296]/10 rounded-full -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#5DA296]/5 rounded-full -ml-24 -mb-24"></div>
                </div>

                {/* Right Side: Form */}
                <div className="p-8 md:p-16 flex items-center">
                    <div className="w-full max-w-sm mx-auto space-y-8">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-black text-[#5DA296] font-heading">تسجيل الدخول</h1>
                            <p className="text-slate-500 font-medium">أدخل بياناتك للوصول إلى لوحة التحكم.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-700 mr-1">البريد الإلكتروني</label>
                                <div className="relative">
                                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pr-12 pl-4 focus:ring-2 focus:ring-[#5DA296]/20 focus:border-[#5DA296] outline-none transition-all"
                                        placeholder="name@example.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center px-1">
                                    <label className="block text-sm font-bold text-slate-700">كلمة المرور</label>
                                    <a href="#" className="text-xs text-[#5DA296] font-bold hover:underline">نسيت كلمة المرور؟</a>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="password"
                                        name="password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pr-12 pl-4 focus:ring-2 focus:ring-[#5DA296]/20 focus:border-[#5DA296] outline-none transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#5DA296] hover:bg-[#4a857b] text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#5DA296]/20 transition-all flex items-center justify-center gap-2 group"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <span>تسجيل الدخول</span>
                                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="text-center pt-4">
                            <p className="text-slate-500 text-sm font-medium">
                                ليس لديك حساب؟{' '}
                                <Link to="/register" className="text-[#5DA296] font-bold hover:underline">
                                    أنشئ حساباً الآن
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;