import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  ArrowUpRight,
  Clock,
  Loader2,
  ShieldCheck,
  AlertCircle,
  BarChart3,
  Globe2
} from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const [statsData, setStatsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/admin/stats`, {
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
      color: 'bg-blue-100 text-[#003F87]', 
      trend: '+12%',
      description: 'نمو مستمر في قاعدة المستخدمين'
    },
    { 
      label: 'الطلاب النشطون', 
      value: statsData?.activeStudents || '0', 
      icon: TrendingUp, 
      color: 'bg-green-100 text-green-600', 
      trend: '+5%',
      description: 'طلاب يتفاعلون يومياً مع المنصة'
    },
    { 
      label: 'المدرسون المعتمدون', 
      value: statsData?.totalTeachers || '0', 
      icon: ShieldCheck, 
      color: 'bg-purple-100 text-purple-600', 
      trend: 'نشط',
      description: 'نخبة من الأساتذة المتميزين'
    },
    { 
      label: 'قصص معلقة للمراجعة', 
      value: statsData?.pendingStories || '0', 
      icon: Clock, 
      color: 'bg-amber-100 text-amber-600', 
      trend: 'جديد',
      description: 'محتوى جديد ينتظر الموافقة'
    },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <Loader2 className="animate-spin text-[#003F87]" size={48} />
          <p className="text-slate-500 font-bold animate-pulse">جاري تحميل بيانات لوحة التحكم...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-10" dir="rtl">
        {/* Welcome Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-gradient-to-l from-[#003F87] to-[#005bb5] rounded-[3rem] p-10 text-white shadow-2xl shadow-[#003F87]/20"
        >
          <div className="relative z-10">
            <h1 className="text-4xl font-black mb-3 font-heading">مرحباً بك، مدير النظام</h1>
            <p className="text-blue-100 text-lg font-medium max-w-2xl leading-relaxed">
              إليك نظرة شاملة على أداء منصة "أجي تقرا" اليوم. لديك {statsData?.pendingStories || 0} قصص جديدة و {statsData?.pendingTeachers || 0} طلبات انضمام لمدرسين بانتظار مراجعتك.
            </p>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-10 -mb-10 blur-2xl"></div>
          <Globe2 className="absolute left-10 top-1/2 -translate-y-1/2 w-40 h-40 text-white/5" />
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.color} transition-transform group-hover:scale-110 duration-300`}>
                  <stat.icon size={28} />
                </div>
                <div className="flex flex-col items-end">
                   <span className={`text-xs font-black px-2.5 py-1 rounded-full ${stat.trend.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                    {stat.trend}
                  </span>
                </div>
              </div>
              <h3 className="text-slate-400 font-bold text-sm mb-1">{stat.label}</h3>
              <p className="text-3xl font-black text-slate-900 mb-2">{stat.value}</p>
              <p className="text-xs text-slate-400 font-medium">{stat.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Recent Activity & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 bg-white border border-slate-100 rounded-[3rem] p-10 shadow-sm"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#003F87]/10 rounded-xl flex items-center justify-center text-[#003F87]">
                  <BarChart3 size={20} />
                </div>
                <h2 className="text-2xl font-black text-slate-800 font-heading">المهام العاجلة</h2>
              </div>
              <button 
                onClick={() => navigate('/admin/content-review')}
                className="bg-slate-50 text-[#003F87] px-5 py-2 rounded-xl font-bold text-sm hover:bg-slate-100 transition-all flex items-center gap-1"
              >
                عرض كل المحتوى <ArrowUpRight size={16} />
              </button>
            </div>
            
            <div className="space-y-6">
              {statsData?.pendingStories > 0 && (
                <div 
                  className="flex items-center gap-4 p-6 bg-amber-50 rounded-3xl border border-amber-100 hover:bg-amber-100 transition-all cursor-pointer group"
                  onClick={() => navigate('/admin/content-review')}
                >
                  <div className="w-12 h-12 bg-amber-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                    <BookOpen size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="font-black text-slate-900">مراجعة القصص الجديدة</p>
                    <p className="text-sm text-amber-700 font-medium">يوجد {statsData.pendingStories} قصص تحتاج لاعتمادك للنشر</p>
                  </div>
                  <ChevronLeft className="text-amber-400 group-hover:-translate-x-1 transition-transform" />
                </div>
              )}

              {statsData?.pendingTeachers > 0 && (
                <div 
                  className="flex items-center gap-4 p-6 bg-blue-50 rounded-3xl border border-blue-100 hover:bg-blue-100 transition-all cursor-pointer group"
                  onClick={() => navigate('/admin/users')}
                >
                  <div className="w-12 h-12 bg-[#003F87] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-[#003F87]/20">
                    <Users size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="font-black text-slate-900">طلبات انضمام المدرسين</p>
                    <p className="text-sm text-blue-700 font-medium">يوجد {statsData.pendingTeachers} ملفات شخصية تحتاج للتحقق</p>
                  </div>
                  <ChevronLeft className="text-blue-400 group-hover:-translate-x-1 transition-transform" />
                </div>
              )}

              {!statsData?.pendingStories && !statsData?.pendingTeachers && (
                <div className="text-center py-10">
                  <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={40} />
                  </div>
                  <p className="font-black text-slate-900">كل شيء تحت السيطرة!</p>
                  <p className="text-slate-400 font-medium">لا توجد مهام معلقة في الوقت الحالي.</p>
                </div>
              )}
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-6"
          >
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden flex-1 flex flex-col justify-between">
               <div className="relative z-10">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                    <AlertCircle size={24} className="text-blue-300" />
                  </div>
                  <h2 className="text-2xl font-black mb-4 font-heading">تحديثات النظام</h2>
                  <p className="text-slate-400 leading-relaxed font-medium">
                    تم تحسين نظام مراجعة القصص وتحديث واجهة التحكم لتكون أكثر سرعة وسهولة في الاستخدام.
                  </p>
               </div>
               
               {/* Abstract Decorations */}
               <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-[#003F87]/20 rounded-full blur-3xl"></div>
            </div>

            <div className="bg-white border border-slate-100 rounded-[3rem] p-8 shadow-sm flex items-center gap-4">
               <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center">
                  <ShieldCheck size={24} />
               </div>
               <div>
                  <p className="font-black text-slate-900 text-sm">حالة النظام</p>
                  <p className="text-xs text-green-600 font-bold">مستقر ويعمل بكفاءة</p>
               </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
};

const ChevronLeft = ({ className }: { className?: string }) => (
  <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const CheckCircle = ({ size, className }: { size?: number, className?: string }) => (
  <svg className={className} width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default AdminDashboard;
