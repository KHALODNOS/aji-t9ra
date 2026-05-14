import React from 'react';
import { 
  Settings, 
  Bell,
  Search,
  Users
} from 'lucide-react';
import AdminSidebar from '../components/admin/AdminSidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#FDFBF7] flex" dir="rtl">
      {/* Sidebar Component */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-6">
            <span className="text-xl font-black tracking-tight text-[#003F87] font-heading">أجي تقرا</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center bg-slate-50 border border-slate-100 rounded-full px-4 py-2 w-64">
              <Search size={16} className="text-slate-400" />
              <input 
                type="text" 
                placeholder="بحث..." 
                className="bg-transparent border-none outline-none text-sm w-full mr-2"
              />
            </div>
            <button className="p-2.5 text-slate-400 hover:bg-slate-50 rounded-full transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-200 mx-2"></div>
            <div className="flex items-center gap-3">
              <div className="text-left hidden sm:block">
                <p className="text-sm font-bold text-slate-900 leading-none">أدمن</p>
              </div>
              <div className="w-10 h-10 bg-[#003F87]/10 rounded-full border-2 border-white shadow-sm flex items-center justify-center overflow-hidden">
                <Users className="w-5 h-5 text-[#003F87]" />
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 bg-[#FDFBF7]">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
