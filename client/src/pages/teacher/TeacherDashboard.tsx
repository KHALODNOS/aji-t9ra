import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, BookOpen, Clock, Settings } from 'lucide-react';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (user.status === 'pending') {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6" dir="rtl">
        <div className="max-w-md w-full bg-white rounded-[2rem] shadow-2xl p-10 text-center border border-[#003F87]/5">
          <div className="w-20 h-20 bg-[#003F87]/5 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-pulse">
            <Clock className="w-10 h-10 text-[#003F87]" />
          </div>
          <h1 className="text-2xl font-black text-[#003F87] mb-4 font-heading">حسابك قيد المراجعة</h1>
          <p className="text-slate-600 leading-relaxed mb-8 font-medium">
            شكراً لانضمامك إلى "أجي تقرا". فريقنا يقوم حالياً بمراجعة ملفك الشخصي لضمان أفضل جودة تعليمية. سنقوم بإشعارك فور تفعيل حسابك.
          </p>
          <button 
            onClick={handleLogout}
            className="w-full py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
          >
            <LogOut size={20} /> تسجيل الخروج
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex" dir="rtl">
      {/* Simple Sidebar */}
      <div className="w-64 bg-primary text-white p-6 hidden md:block">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center shadow-lg">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-black tracking-tight text-white font-heading">أجي تقرا</span>
        </div>
        <h2 className="text-lg font-bold mb-6 opacity-80">لوحة المدرس</h2>
        <nav className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg"><BookOpen size={20} /> الدروس</div>
          <div className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-lg"><Clock size={20} /> الجدول</div>
          <div className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-lg"><User size={20} /> الملف الشخصي</div>
          <div className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-lg"><Settings size={20} /> الإعدادات</div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-1">مرحباً، {user.username || user.email}!</h1>
            <p className="text-gray-500">أهلاً بك في لوحة تحكم المعلم الخاصة بك.</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-primary font-bold hover:bg-primary/5 px-4 py-2 rounded-lg transition-colors"
          >
            <LogOut size={20} /> خروج
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-premium p-6">
            <h3 className="text-lg font-bold mb-2">إجمالي الطلاب</h3>
            <p className="text-4xl font-black text-primary">0</p>
          </div>
          <div className="card-premium p-6">
            <h3 className="text-lg font-bold mb-2">الدروس القادمة</h3>
            <p className="text-4xl font-black text-primary">0</p>
          </div>
          <div className="card-premium p-6">
            <h3 className="text-lg font-bold mb-2">التقييم العام</h3>
            <p className="text-4xl font-black text-primary">5.0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
