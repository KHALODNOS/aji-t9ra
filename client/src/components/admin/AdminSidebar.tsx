import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Globe, 
  HeadphonesIcon, 
  LogOut,
  Bell
} from 'lucide-react';
import NotificationBell from '../common/NotificationBell';

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navItems = [
    { name: 'الإحصائيات', icon: LayoutDashboard, path: '/admin/dashboard' },
    { name: 'إدارة المستخدمين', icon: Users, path: '/admin/users' },
    { name: 'مراجعة المحتوى', icon: FileText, path: '/admin/content-review' },
    { name: 'إعدادات اللغة', icon: Globe, path: '/admin/settings' },
    { name: 'الدعم الفني', icon: HeadphonesIcon, path: '/admin/support' },
  ];

  return (
    <aside className="w-72 bg-white border-l border-slate-100 flex flex-col shadow-sm sticky top-0 h-screen overflow-y-auto">
      <div className="p-8">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#003F87] rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-black text-xl">أ</span>
            </div>
            <span className="text-2xl font-black tracking-tight text-[#003F87] font-heading">أجي تقرا</span>
          </div>
          <NotificationBell />
        </div>

        <div className="mb-10 text-center">
          <div className="relative inline-block">
            <div className="w-20 h-20 rounded-full border-4 border-[#003F87]/10 flex items-center justify-center bg-slate-50 overflow-hidden">
              <Users size={40} className="text-[#003F87]/30" />
            </div>
            <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 border-4 border-white rounded-full"></div>
          </div>
          <h3 className="mt-4 font-black text-slate-900">مدير النظام</h3>
          <p className="text-xs text-slate-400 font-medium">{user.email || 'admin@ajit9ra.com'}</p>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                location.pathname === item.path
                  ? 'bg-[#EBF2FF] text-[#003F87] font-bold shadow-sm'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-[#003F87]'
              }`}
            >
              <item.icon size={22} className={location.pathname === item.path ? 'text-[#003F87]' : 'text-slate-400 group-hover:text-[#003F87]'} />
              <span className="text-sm">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-8 border-t border-slate-50">
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 px-4 py-3.5 w-full text-red-500 font-bold hover:bg-red-50 rounded-xl transition-all"
        >
          <LogOut size={22} />
          <span className="text-sm">تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
