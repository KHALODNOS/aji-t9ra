import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  MoreVertical,
  GraduationCap,
  Globe,
  Lock,
  Unlock,
  Loader2,
  Eye,
  Ban,
  Mail,
  XCircle as XIcon
} from 'lucide-react';
import axios from 'axios';

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState('requests');
  const [searchTerm, setSearchTerm] = useState('');
  const [pendingTeachers, setPendingTeachers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pendingRes, allUsersRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/admin/pending-teachers`, config),
        axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/admin/users`, config)
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
      await axios.put(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/admin/approve-teacher/${userId}`, {}, config);
      setSelectedTeacher(null);
      fetchData();
    } catch (error) {
      console.error('Error approving teacher:', error);
    }
  };

  const handleReject = async (userId: string) => {
    try {
      if (window.confirm('هل أنت متأكد من رفض وحذف هذا الطلب؟')) {
        await axios.delete(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/admin/reject-teacher/${userId}`, config);
        setSelectedTeacher(null);
        fetchData();
      }
    } catch (error) {
      console.error('Error rejecting teacher:', error);
    }
  };

  const handleToggleStatus = async (userId: string) => {
    try {
      await axios.put(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/admin/toggle-status/${userId}`, {}, config);
      fetchData();
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  const filteredUsers = allUsers.filter(user => {
    const userRole = (user.Role || user.role || '').toLowerCase();
    const userStatus = (user.status || '').toLowerCase();
    const matchesTab = activeTab === 'teachers' ? (userRole === 'teacher' && userStatus !== 'pending') : 
                      activeTab === 'students' ? userRole === 'student' : false;
    
    const matchesSearch = user.username?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const filteredRequests = pendingTeachers.filter(user => {
    return user.username?.toLowerCase().includes(searchTerm.toLowerCase()) || 
           user.email?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const displayData = activeTab === 'requests' ? filteredRequests : filteredUsers;

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

        {/* Details Modal */}
        {selectedTeacher && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="h-32 bg-[#003F87] relative">
                <button
                  onClick={() => setSelectedTeacher(null)}
                  className="absolute top-6 left-6 w-10 h-10 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-all"
                >
                  <XIcon size={20} />
                </button>
              </div>

              <div className="px-10 pb-10 -mt-16">
                <div className="flex items-end gap-6 mb-8">
                  <div className="w-32 h-32 bg-white rounded-[2.5rem] p-1.5 shadow-xl">
                    <div className="w-full h-full bg-slate-100 rounded-[2rem] overflow-hidden flex items-center justify-center border border-slate-50">
                      {selectedTeacher.photoProfile ? (
                        <img src={selectedTeacher.photoProfile} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Users className="text-slate-300" size={40} />
                      )}
                    </div>
                  </div>
                  <div className="pb-4">
                    <h2 className="text-2xl font-black text-slate-900">{selectedTeacher.username}</h2>
                    <p className="text-slate-400 font-medium">{selectedTeacher.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-10">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xs font-black text-[#003F87] uppercase tracking-widest mb-3">التعليم</h4>
                      <div className="space-y-3">
                        {selectedTeacher.education?.length > 0 ? (
                          selectedTeacher.education.map((edu: any, i: number) => (
                            <div key={i} className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                              <p className="text-sm font-bold text-slate-800">{edu.degree}</p>
                              <p className="text-[11px] text-slate-400">{edu.institution} • {edu.year}</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-slate-400">لا توجد معلومات تعليمية</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-[#003F87] uppercase tracking-widest mb-3">اللغات</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedTeacher.fluentLanguages?.length > 0 ? (
                          selectedTeacher.fluentLanguages.map((l: any, i: number) => (
                            <span key={i} className="px-3 py-1 bg-[#003F87]/5 text-[#003F87] text-xs font-bold rounded-lg">
                              {l.language} ({l.level})
                            </span>
                          ))
                        ) : (
                          <p className="text-xs text-slate-400">غير محدد</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xs font-black text-[#003F87] uppercase tracking-widest mb-3">الخبرة</h4>
                      <div className="space-y-3">
                        {selectedTeacher.experience?.length > 0 ? (
                          selectedTeacher.experience.map((exp: any, i: number) => (
                            <div key={i} className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                              <p className="text-sm font-bold text-slate-800">{exp.jobTitle}</p>
                              <p className="text-[11px] text-slate-400">{exp.company} • {exp.years} سنوات</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-slate-400">لا توجد خبرات سابقة</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-[#003F87] uppercase tracking-widest mb-3">التواصل</h4>
                      <div className="flex gap-3">
                        {selectedTeacher.socialLinks?.length > 0 ? (
                          selectedTeacher.socialLinks.map((link: any, i: number) => (
                            <a key={i} href={link.url} target="_blank" rel="noreferrer" className="w-10 h-10 bg-slate-100 text-slate-400 rounded-xl flex items-center justify-center hover:bg-[#003F87] hover:text-white transition-all">
                              <Globe size={18} />
                            </a>
                          ))
                        ) : (
                          <p className="text-xs text-slate-400">لا توجد روابط</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-6 border-t border-slate-100">
                  {selectedTeacher.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => handleApprove(selectedTeacher._id)}
                        className="flex-1 py-4 bg-[#003F87] text-white rounded-[1.5rem] font-black shadow-lg shadow-[#003F87]/20 hover:bg-[#002B5C] transition-all"
                      >
                        قبول المدرس وتفعيل الحساب
                      </button>
                      <button
                        onClick={() => handleReject(selectedTeacher._id)}
                        className="px-8 py-4 bg-red-50 text-red-500 rounded-[1.5rem] font-black hover:bg-red-100 transition-all"
                      >
                        رفض الطلب
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setSelectedTeacher(null)}
                      className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-[1.5rem] font-black hover:bg-slate-200 transition-all"
                    >
                      إغلاق النافذة
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Users Management */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-50 overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl">
              <button
                onClick={() => setActiveTab('requests')}
                className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'requests' ? 'bg-white text-[#003F87] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                طلبات الانضمام ({pendingTeachers.length})
              </button>
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
                ) : displayData.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-bold">
                      لا يوجد {activeTab === 'requests' ? 'طلبات انضمام معلقة' : 'مستخدمين متاحين'} حالياً.
                    </td>
                  </tr>
                ) : (
                  displayData.map((user: any) => (
                    <tr key={user._id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center overflow-hidden">
                            {user.photoProfile ? (
                              <img src={user.photoProfile} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <Users className="text-slate-400" size={20} />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 leading-tight mb-0.5">{user.username || 'بدون اسم'}</p>
                            <p className="text-[11px] text-slate-400 font-medium">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                          {activeTab === 'students' ? (
                            <div className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[11px] font-black rounded-lg">طالب</div>
                          ) : (
                            <>
                              <GraduationCap size={16} className="text-slate-400" />
                              <span>{user.education?.[0]?.degree || user.specialization || 'مدرس لغة'}</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-sm font-medium text-slate-400">
                          {new Date(user.createdAt || Date.now()).toLocaleDateString('ar-EG')}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${user.status === 'active' ? 'bg-emerald-500' : user.status === 'pending' ? 'bg-amber-500' : 'bg-red-500'}`}></span>
                          <span className={`text-[11px] font-black uppercase tracking-wider ${user.status === 'active' ? 'text-emerald-600' : user.status === 'pending' ? 'text-amber-600' : 'text-red-600'}`}>
                            {user.status === 'active' ? 'نشط' : user.status === 'pending' ? 'معلق' : 'محظور'}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          {activeTab === 'requests' ? (
                            <>
                              <button
                                onClick={() => setSelectedTeacher(user)}
                                title="عرض التفاصيل"
                                className="w-9 h-9 bg-slate-100 text-slate-500 rounded-xl flex items-center justify-center hover:bg-[#003F87] hover:text-white transition-all shadow-sm"
                              >
                                <Eye size={18} />
                              </button>
                              <button
                                onClick={() => handleApprove(user._id)}
                                title="قبول الطلب"
                                className="w-9 h-9 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                              >
                                <CheckCircle2 size={18} />
                              </button>
                              <button
                                onClick={() => handleReject(user._id)}
                                title="رفض الطلب"
                                className="w-9 h-9 bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"
                              >
                                <XCircle size={18} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => setSelectedTeacher(user)}
                                className="w-9 h-9 bg-slate-100 text-slate-500 rounded-xl flex items-center justify-center hover:bg-[#003F87] hover:text-white transition-all shadow-sm"
                              >
                                <Eye size={18} />
                              </button>
                              <button
                                onClick={() => handleToggleStatus(user._id)}
                                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shadow-sm ${user.status === 'active' ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-emerald-50 text-emerald-500 hover:bg-emerald-100'}`}
                              >
                                {user.status === 'active' ? <Ban size={18} /> : <CheckCircle2 size={18} />}
                              </button>
                              <button className="w-9 h-9 bg-slate-100 text-slate-500 rounded-xl flex items-center justify-center hover:bg-[#003F87] hover:text-white transition-all shadow-sm">
                                <Mail size={18} />
                              </button>
                            </>
                          )}
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
