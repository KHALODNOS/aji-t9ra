import React from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { 
  Users, 
  BookOpen, 
  Video, 
  TrendingUp, 
  ArrowUpRight,
  Clock
} from 'lucide-react';

const AdminDashboard = () => {
  const stats = [
    { label: 'إجمالي المستخدمين', value: '1,250', icon: Users, color: 'bg-blue-50 text-blue-500', trend: '+12%' },
    { label: 'الطلاب النشطون', value: '850', icon: TrendingUp, color: 'bg-green-50 text-green-500', trend: '+5%' },
    { label: 'المدرسون', value: '45', icon: BookOpen, color: 'bg-purple-50 text-purple-500', trend: '+2' },
    { label: 'محتوى معلق', value: '12', icon: Clock, color: 'bg-yellow-50 text-yellow-600', trend: '-3' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-10" dir="rtl">
        {/* Welcome Section */}
        <div>
          <h1 className="text-4xl font-black text-[#003F87] mb-2">لوحة التحكم</h1>
          <p className="text-slate-400 font-medium text-lg">مرحباً بك مجدداً، إليك نظرة سريعة على أداء المنصة اليوم.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.icon === Users ? 'bg-[#EBF2FF] text-[#003F87]' : stat.color}`}>
                  <stat.icon size={28} />
                </div>
                <span className={`text-xs font-black px-2.5 py-1 rounded-full ${stat.trend.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                  {stat.trend}
                </span>
              </div>
              <h3 className="text-slate-400 font-bold text-sm mb-1">{stat.label}</h3>
              <p className="text-3xl font-black text-slate-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Recent Activity Placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white border border-slate-100 rounded-[3rem] p-10 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-slate-800">النشاط الأخير</h2>
              <button className="text-[#003F87] font-bold text-sm hover:underline flex items-center gap-1">
                عرض الكل <ArrowUpRight size={16} />
              </button>
            </div>
            <div className="space-y-6">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-all cursor-pointer">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                    <Clock size={20} className="text-slate-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-sm">تم تسجيل مستخدم جديد: <span className="text-[#003F87]">سارة علي</span></p>
                    <p className="text-xs text-slate-400 mt-0.5">منذ 5 دقائق</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-[#003F87] rounded-[3rem] p-10 text-white shadow-xl shadow-[#003F87]/20 relative overflow-hidden flex flex-col justify-between min-h-[400px]">
             <div className="relative z-10">
                <h2 className="text-2xl font-black mb-4">نصيحة اليوم</h2>
                <p className="text-blue-100 leading-relaxed font-medium">
                  المتابعة المستمرة لطلبات المدرسين تساهم في نمو المنصة بنسبة 20% أسرع.
                </p>
             </div>
             <button className="relative z-10 bg-white text-[#003F87] font-black py-4 rounded-2xl shadow-lg hover:bg-blue-50 transition-all text-center">
                مراجعة الطلبات الآن
             </button>
             
             {/* Abstract Decorations */}
             <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
             <div className="absolute bottom-[-10%] left-[-10%] w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
