import React, { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { 
  FileText, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Clock,
  User,
  BookOpen,
  Video,
  FileQuestion,
  MoreVertical
} from 'lucide-react';

const ContentReview = () => {
  const [filter, setFilter] = useState('all');

  const contentItems = [
    {
      id: 1,
      title: 'مقدمة في اللغة الإنجليزية للمبتدئين',
      type: 'lesson',
      submitter: 'أحمد محمود',
      date: '2024-05-14',
      status: 'pending',
      priority: 'high'
    },
    {
      id: 2,
      title: 'شرح قواعد التفاضل والتكامل - الجزء الأول',
      type: 'video',
      submitter: 'سناء العلوي',
      date: '2024-05-13',
      status: 'pending',
      priority: 'medium'
    },
    {
      id: 3,
      title: 'اختبار تجريبي في مادة العلوم',
      type: 'quiz',
      submitter: 'كريم بناني',
      date: '2024-05-12',
      status: 'reviewed',
      priority: 'low'
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'lesson': return <BookOpen size={18} className="text-blue-500" />;
      case 'video': return <Video size={18} className="text-red-500" />;
      case 'quiz': return <FileQuestion size={18} className="text-purple-500" />;
      default: return <FileText size={18} className="text-slate-500" />;
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'lesson': return 'درس';
      case 'video': return 'فيديو';
      case 'quiz': return 'اختبار';
      default: return 'محتوى';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8" dir="rtl">
        {/* Page Header */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-[#003F87] mb-2">مراجعة المحتوى</h1>
            <div className="flex items-center gap-2 text-slate-400 font-medium">
              <FileText size={18} />
              <span>هناك 12 عنصر بانتظار المراجعة</span>
            </div>
          </div>
          <div className="flex bg-white border border-slate-100 p-1 rounded-2xl shadow-sm">
            <button className="px-6 py-2.5 bg-[#003F87] text-white rounded-xl font-bold text-sm shadow-md shadow-[#003F87]/20">الكل</button>
            <button className="px-6 py-2.5 text-slate-500 hover:bg-slate-50 rounded-xl font-bold text-sm transition-all">بانتظار المراجعة</button>
            <button className="px-6 py-2.5 text-slate-500 hover:bg-slate-50 rounded-xl font-bold text-sm transition-all">تمت مراجعته</button>
          </div>
        </div>

        {/* Content List */}
        <div className="grid grid-cols-1 gap-4">
          {contentItems.map((item) => (
            <div key={item.id} className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-all group">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${
                    item.type === 'lesson' ? 'bg-blue-50 border-blue-100' :
                    item.type === 'video' ? 'bg-red-50 border-red-100' :
                    'bg-purple-50 border-purple-100'
                  }`}>
                    {getTypeIcon(item.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        item.priority === 'high' ? 'bg-red-50 text-red-500' :
                        item.priority === 'medium' ? 'bg-orange-50 text-orange-500' :
                        'bg-blue-50 text-blue-500'
                      }`}>
                        {item.priority === 'high' ? 'أولوية عالية' : item.priority === 'medium' ? 'أولوية متوسطة' : 'أولوية عادية'}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-[10px] font-bold text-slate-400">{getTypeName(item.type)}</span>
                    </div>
                    <h3 className="text-lg font-black text-slate-900 group-hover:text-[#003F87] transition-colors">{item.title}</h3>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <User size={14} className="text-slate-400" />
                        <span>بواسطة: <span className="text-slate-900 font-bold">{item.submitter}</span></span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <Clock size={14} className="text-slate-400" />
                        <span>{item.date}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button className="p-3 text-slate-400 hover:text-[#003F87] hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-100">
                    <Eye size={20} />
                  </button>
                  <div className="h-8 w-px bg-slate-100 mx-1"></div>
                  <button className="bg-green-50 text-green-600 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-green-100 transition-all border border-green-100">
                    <CheckCircle size={18} />
                    قبول
                  </button>
                  <button className="bg-red-50 text-red-500 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-red-100 transition-all border border-red-100">
                    <XCircle size={18} />
                    رفض
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ContentReview;
