import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, LogOut, GraduationCap, Calendar, MessageSquare } from 'lucide-react';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex" dir="rtl">
      {/* Simple Sidebar */}
      <div className="w-64 bg-primary text-white p-6 hidden md:block">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center shadow-lg">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-black tracking-tight text-white font-heading">أجي تقرا</span>
        </div>
        <h2 className="text-lg font-bold mb-6 opacity-80">لوحة الطالب</h2>
        <nav className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg"><Search size={20} /> ابحث عن معلم</div>
          <div className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-lg"><GraduationCap size={20} /> دروسي</div>
          <div className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-lg"><Calendar size={20} /> المواعيد</div>
          <div className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-lg"><MessageSquare size={20} /> الرسائل</div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-1">مرحباً، {user.nickname || user.username || user.email}!</h1>
            <p className="text-gray-500">أهلاً بك في رحلة تعلمك.</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-primary font-bold hover:bg-primary/5 px-4 py-2 rounded-lg transition-colors"
          >
            <LogOut size={20} /> خروج
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card-premium p-8 bg-primary text-white">
            <h2 className="text-2xl font-bold mb-4">ابحث عن معلمك المثالي</h2>
            <p className="mb-6 opacity-80">اختر من بين مئات المعلمين المحترفين لبدء تعلم اللغة التي تحبها.</p>
            <button className="bg-white text-primary px-6 py-3 rounded-xl font-bold">ابدأ الآن</button>
          </div>
          
          <div className="space-y-6">
            <div className="card-premium p-6">
              <h3 className="font-bold mb-4">نشاطك الأخير</h3>
              <p className="text-gray-50 text-sm italic">لا يوجد نشاط متاح حالياً.</p>
            </div>
            <div className="card-premium p-6">
              <h3 className="font-bold mb-4">أهداف التعلم</h3>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-primary h-full w-[10%]"></div>
              </div>
              <p className="text-xs mt-2 text-gray-500">10% من هدفك لهذا الأسبوع</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
