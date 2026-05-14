import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { 
  Users, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  MoreVertical,
  ShieldAlert,
  GraduationCap,
  Globe,
  Trash2,
  Lock,
  Unlock,
  Loader2
} from 'lucide-react';
import axios from 'axios';

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState('teachers');
  const [searchTerm, setSearchTerm] = useState('');
  const [pendingTeachers, setPendingTeachers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pendingRes, allUsersRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/pending-teachers', config),
        axios.get('http://localhost:5000/api/admin/users', config)
      ]);
      setPendingTeachers(pendingRes.data);
      setAllUsers(allUsersRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (userId: string) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/approve-teacher/${userId}`, {}, config);
      fetchData();
    } catch (error) {
      console.error('Error approving teacher:', error);
    }
  };

  const handleReject = async (userId: string) => {
    try {
      if (window.confirm('هل أنت متأكد من رفض وحذف هذا الطلب؟')) {
        await axios.delete(`http://localhost:5000/api/admin/reject-teacher/${userId}`, config);
        fetchData();
      }
    } catch (error) {
      console.error('Error rejecting teacher:', error);
    }
  };

  const handleToggleStatus = async (userId: string) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/toggle-status/${userId}`, {}, config);
      fetchData();
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  const filteredUsers = allUsers.filter(user => {
    const matchesTab = activeTab === 'teachers' ? user.Role === 'teacher' : user.Role === 'student';
    const matchesSearch = user.username?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-500">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-[#003F87] mb-2 font-heading">إدارة المستخدمين</h1>
            <p className="text-slate-500 font-medium">إدارة المدرسين، الطلاب وطلبات الانضمام الجديدة.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text"
                placeholder="البحث عن مستخدم..."
                className="w-full md:w-80 pr-12 pl-4 py-3.5 bg-white border border-slate-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-[#003F87]/10 focus:border-[#003F87] outline-none transition-all font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Pending Requests Section */}
        {pendingTeachers.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                <ShieldAlert className="text-amber-500" size={22} />
              </div>
              <h2 className="text-xl font-black text-slate-800 font-heading">طلبات الانضمام المعلقة ({pendingTeachers.length})</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingTeachers.map((request: any) => (
                <div key={request._id} className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-50 hover:shadow-md transition-all group">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center overflow-hidden border border-slate-100">
                        <Users className="text-slate-300" size={28} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{request.username || 'بدون اسم'}</h4>
                        <p className="text-xs text-slate-400">{request.email}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black rounded-full uppercase tracking-wider">قيد الانتظار</span>
                  </div>
                  
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3 text-sm text-slate-500">
                      <GraduationCap size={16} />
                      <span>{request.education?.[0]?.degree || 'غير محدد'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-500">
                      <Globe size={16} />
                      <span>{request.fluentLanguages?.map((l: any) => l.language).join('، ') || 'غير محدد'}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => handleApprove(request._id)}
                      className="py-3 bg-[#003F87] text-white rounded-xl font-bold text-sm hover:bg-[#002B5C] transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 size={16} /> قبول
                    </button>
                    <button 
                      onClick={() => handleReject(request._id)}
                      className="py-3 bg-red-50 text-red-500 rounded-xl font-bold text-sm hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                    >
                      <XCircle size={16} /> رفض
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Main Users Management */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-50 overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl">
              <button 
                onClick={() => setActiveTab('teachers')}
                className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'teachers' ? 'bg-white text-[#003F87] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                المدرسين
              </button>
              <button 
                onClick={() => setActiveTab('students')}
                className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'students' ? 'bg-white text-[#003F87] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                الطلاب
              </button>
            </div>
            <button className="flex items-center gap-2 text-slate-400 font-bold text-sm hover:text-slate-600">
              <Filter size={18} /> تصفية
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">المستخدم</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">التخصص/المستوى</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">تاريخ الانضمام</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">الحالة</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="animate-spin text-[#003F87]" size={40} />
                        <p className="text-slate-400 font-bold">جاري تحميل البيانات...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-bold">
                      لا يوجد مستخدمين متاحين حالياً.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user: any) => (
                    <tr key={user._id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center overflow-hidden">
                             <Users className="text-slate-400" size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{user.username || 'بدون اسم'}</p>
                            <p className="text-xs text-slate-400">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-sm font-medium text-slate-600">
                          {activeTab === 'teachers' 
                            ? (user.fluentLanguages?.[0]?.language || 'غير محدد')
                            : (user.SubjectOfLearn?.[0] || 'غير محدد')}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-sm font-medium text-slate-400">
                          {new Date(user.createdAt || Date.now()).toLocaleDateString('ar-EG')}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          user.status === 'active' 
                            ? 'bg-green-50 text-green-600' 
                            : 'bg-red-50 text-red-600'
                        }`}>
                          {user.status === 'active' ? 'نشط' : 'محظور'}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleToggleStatus(user._id)}
                            className={`p-2 rounded-xl transition-all ${
                              user.status === 'active' 
                                ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' 
                                : 'bg-green-50 text-green-600 hover:bg-green-100'
                            }`}
                            title={user.status === 'active' ? 'حظر الحساب' : 'تفعيل الحساب'}
                          >
                            {user.status === 'active' ? <Lock size={18} /> : <Unlock size={18} />}
                          </button>
                          <button className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 hover:text-slate-600 transition-all">
                            <MoreVertical size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UserManagement;
