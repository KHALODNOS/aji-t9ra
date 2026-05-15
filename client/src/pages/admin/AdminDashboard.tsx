import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  ArrowUpRight,
  Clock,
  Loader2
} from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [statsData, setStatsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/admin/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStatsData(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const stats = [
    { 
      label: 'إجمالي المستخدمين', 
      value: statsData?.totalUsers || '0', 
      icon: Users, 
      color: 'bg-blue-50 text-blue-500', 
      trend: '+12%' 
    },
    { 
      label: 'الطلاب النشطون', 
      value: statsData?.activeStudents || '0', 
      icon: TrendingUp, 
      color: 'bg-green-50 text-green-500', 
      trend: '+5%' 
    },
    { 
      label: 'المدرسون', 
      value: statsData?.totalTeachers || '0', 
      icon: BookOpen, 
      color: 'bg-purple-50 text-purple-500', 
      trend: '+2' 
    },
    { 
      label: 'طلبات معلقة', 
      value: statsData?.pendingTeachers || '0', 
      icon: Clock, 
      color: 'bg-amber-50 text-amber-600', 
      trend: 'جديد' 
    },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="animate-spin text-[#003F87]" size={48} />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-10" dir="rtl">
        {/* Welcome Section */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-4xl font-black text-[#003F87] mb-2 font-heading">لوحة التحكم</h1>
          <p className="text-slate-400 font-medium text-lg">مرحباً بك مجدداً، إليك نظرة سريعة على أداء المنصة اليوم.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.color}`}>
                  <stat.icon size={28} />
                </div>
                <span className={`text-xs font-black px-2.5 py-1 rounded-full ${stat.trend.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                  {stat.trend}
                </span>
              </div>
              <h3 className="text-slate-400 font-bold text-sm mb-1">{stat.label}</h3>
              <p className="text-3xl font-black text-slate-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Recent Activity & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-12 duration-1000">
          <div className="lg:col-span-2 bg-white border border-slate-100 rounded-[3rem] p-10 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-slate-800 font-heading">النشاط الأخير</h2>
              <button 
                onClick={() => navigate('/admin/users')}
                className="text-[#003F87] font-bold text-sm hover:underline flex items-center gap-1"
              >
                عرض الكل <ArrowUpRight size={16} />
              </button>
            </div>
            <div className="space-y-6">
              {statsData?.pendingTeachers > 0 ? (
                <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-2xl border border-amber-100 transition-all cursor-pointer" onClick={() => navigate('/admin/users')}>
                  <div className="w-12 h-12 bg-amber-500 text-white rounded-xl flex items-center justify-center">
                    <Clock size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-sm">يوجد {statsData.pendingTeachers} طلبات انضمام جديدة لمدرسين</p>
                    <p className="text-xs text-amber-600 mt-0.5">تحتاج للمراجعة فوراً</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-all">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                    <Users size={20} className="text-slate-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-sm">لا توجد طلبات معلقة حالياً</p>
                    <p className="text-xs text-slate-400 mt-0.5">النظام يعمل بشكل ممتاز</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-[#003F87] rounded-[3rem] p-10 text-white shadow-xl shadow-[#003F87]/20 relative overflow-hidden flex flex-col justify-between min-h-[400px]">
             <div className="relative z-10">
                <h2 className="text-2xl font-black mb-4 font-heading">نصيحة اليوم</h2>
                <p className="text-blue-100 leading-relaxed font-medium">
                  المتابعة المستمرة لطلبات المدرسين تساهم في نمو المنصة بنسبة 20% أسرع. تأكد من مراجعة الطلبات المعلقة بشكل يومي.
                </p>
             </div>
             <button 
                onClick={() => navigate('/admin/users')}
                className="relative z-10 bg-white text-[#003F87] font-black py-4 rounded-2xl shadow-lg hover:bg-blue-50 transition-all text-center"
             >
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
