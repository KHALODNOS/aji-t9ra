import React from 'react';
import { Clock, LogOut, CheckCircle, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PendingReviewProps {
  username?: string;
}

const PendingReview: React.FC<PendingReviewProps> = ({ username }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6" dir="rtl">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-10 text-center border border-[#003F87]/5 relative overflow-hidden">
        {/* Decorative background circle */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#003F87]/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="w-24 h-24 bg-[#003F87]/5 rounded-[2rem] flex items-center justify-center mx-auto mb-8 animate-pulse shadow-inner">
            <Clock className="w-12 h-12 text-[#003F87]" />
          </div>
          
          <h1 className="text-3xl font-black text-[#003F87] mb-4 font-heading">حسابك قيد المراجعة</h1>
          
          <div className="flex items-center justify-center gap-2 mb-6 text-amber-600 bg-amber-50 py-2 px-4 rounded-full w-fit mx-auto">
            <ShieldCheck size={16} />
            <span className="text-xs font-black uppercase tracking-wider">بانتظار موافقة المسؤول</span>
          </div>

          <p className="text-slate-600 leading-relaxed mb-10 font-medium">
            مرحباً {username || 'بك'}! شكراً لانضمامك إلى <span className="font-bold text-[#003F87]">أجي تقرا</span>. 
            يقوم فريقنا حالياً بمراجعة مؤهلاتك وخبراتك لضمان تقديم أفضل تجربة تعليمية لطلابنا.
            <br /><br />
            ستتلقى إشعاراً عبر البريد الإلكتروني فور تفعيل حسابك.
          </p>
          
          <div className="space-y-4">
            <div className="flex flex-col gap-3">
               <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <CheckCircle className="text-green-500" size={20} />
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-900">اكتمال الملف</p>
                    <p className="text-[10px] text-slate-400">تم استلام جميع بياناتك بنجاح</p>
                  </div>
               </div>
            </div>

            <button 
              onClick={handleLogout}
              className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-200 mt-4"
            >
              <LogOut size={20} /> تسجيل الخروج والانتظار
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingReview;
