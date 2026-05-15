import React, { useState, useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { 
  FileText, 
  Video, 
  GraduationCap, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  MoreVertical,
  Globe,
  User,
  Search,
  Trash2,
  Check,
  Loader2,
  AlertCircle
} from "lucide-react";
import axios from "axios";

const ContentReview = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [contentItems, setContentItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchContent = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:5000/api/admin/pending-content`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContentItems(response.data);
    } catch (error) {
      console.error("Error fetching content:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/admin/approve-content/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContentItems(prev => prev.filter(item => item._id !== id));
      setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
    } catch (error) {
      console.error("Error approving content:", error);
    }
  };

  const handleReject = async (id: string) => {
    if (!window.confirm("هل أنت متأكد من رفض وحذف هذا المحتوى؟")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/admin/reject-content/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContentItems(prev => prev.filter(item => item._id !== id));
      setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
    } catch (error) {
      console.error("Error rejecting content:", error);
    }
  };

  const handleBulkApprove = async () => {
    if (selectedIds.length === 0) return;
    try {
      const token = localStorage.getItem("token");
      await axios.post(`http://localhost:5000/api/admin/bulk-approve-content`, { contentIds: selectedIds }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContentItems(prev => prev.filter(item => !selectedIds.includes(item._id)));
      setSelectedIds([]);
    } catch (error) {
      console.error("Error bulk approving content:", error);
    }
  };

  const handleBulkReject = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm("هل أنت متأكد من رفض وحذف المحتوى المحدد؟")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.post(`http://localhost:5000/api/admin/bulk-reject-content`, { contentIds: selectedIds }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContentItems(prev => prev.filter(item => !selectedIds.includes(item._id)));
      setSelectedIds([]);
    } catch (error) {
      console.error("Error bulk rejecting content:", error);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredItems.map(item => item._id));
    }
  };

  const filteredItems = contentItems.filter(item => {
    const matchesTab = activeTab === "all" || 
                      (activeTab === "stories" && item.type === "story") ||
                      (activeTab === "videos" && item.type === "video") ||
                      (activeTab === "exams" && item.type === "exam");
    
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.teacher?.username?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "story": return <FileText size={18} />;
      case "video": return <Video size={18} />;
      case "exam": return <GraduationCap size={18} />;
      default: return <FileText size={18} />;
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case "story": return "قصة";
      case "video": return "فيديو";
      case "exam": return "اختبار";
      default: return type;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8 animate-in fade-in duration-500" dir="rtl">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-[#003F87] font-heading">مراجعة المحتوى</h1>
            <p className="text-slate-400 font-medium mt-1">إدارة واعتماد القصص، الفيديوهات، والاختبارات المرفوعة من قبل المدرسين.</p>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="بحث عن محتوى أو مدرس..."
                  className="bg-white border border-slate-200 rounded-2xl py-3 pr-10 pl-4 w-64 text-sm focus:ring-2 focus:ring-[#003F87]/20 outline-none transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
             </div>
          </div>
        </div>

        {/* Filters & Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex bg-slate-50 p-1.5 rounded-2xl w-fit">
            {[
              { id: "all", label: "الكل", icon: Globe },
              { id: "stories", label: "القصص", icon: FileText },
              { id: "videos", label: "الفيديوهات", icon: Video },
              { id: "exams", label: "الاختبارات", icon: GraduationCap },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  activeTab === tab.id 
                    ? "bg-white text-[#003F87] shadow-sm" 
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {selectedIds.length > 0 && (
              <div className="flex items-center gap-2 animate-in slide-in-from-left-4 duration-300">
                <span className="text-xs font-bold text-slate-400 ml-2">تم تحديد {selectedIds.length}</span>
                <button 
                  onClick={handleBulkApprove}
                  className="bg-green-50 text-green-600 hover:bg-green-100 px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-colors"
                >
                  <Check size={14} /> موافقة
                </button>
                <button 
                  onClick={handleBulkReject}
                  className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-colors"
                >
                  <Trash2 size={14} /> حذف
                </button>
              </div>
            )}
            <div className="h-8 w-px bg-slate-100 mx-1 hidden lg:block"></div>
            <button 
              onClick={toggleSelectAll}
              className="text-xs font-bold text-[#003F87] hover:bg-blue-50 px-4 py-2.5 rounded-xl transition-colors"
            >
              {selectedIds.length === filteredItems.length && filteredItems.length > 0 ? "إلغاء التحديد" : "تحديد الكل"}
            </button>
          </div>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="animate-spin text-[#003F87]" size={48} />
            <p className="text-slate-400 font-bold">جاري تحميل المحتوى...</p>
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <div 
                key={item._id} 
                className={`group bg-white border rounded-[2.5rem] overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                  selectedIds.includes(item._id) ? "border-[#003F87] ring-4 ring-[#003F87]/5" : "border-slate-100"
                }`}
              >
                {/* Image Container */}
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={item.thumbnail || "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=500"} 
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                  
                  {/* Checkbox overlay */}
                  <div className="absolute top-5 right-5">
                    <button 
                      onClick={() => toggleSelect(item._id)}
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedIds.includes(item._id) 
                          ? "bg-[#003F87] border-[#003F87] text-white" 
                          : "bg-white/20 backdrop-blur-md border-white/40 text-transparent hover:border-white"
                      }`}
                    >
                      <Check size={16} strokeWidth={3} />
                    </button>
                  </div>

                  {/* Badge */}
                  <div className="absolute bottom-5 right-5 flex items-center gap-2">
                    <span className="bg-white/90 backdrop-blur-md text-[#003F87] text-[10px] font-black px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                      {getTypeIcon(item.type)}
                      {getTypeName(item.type)}
                    </span>
                    <span className="bg-white/90 backdrop-blur-md text-slate-600 text-[10px] font-black px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                      <Globe size={12} />
                      {item.language}
                    </span>
                  </div>
                </div>

                {/* Info Container */}
                <div className="p-8 space-y-6">
                  <div>
                    <h3 className="text-xl font-black text-slate-800 line-clamp-1 mb-2">{item.title}</h3>
                    <div className="flex items-center gap-2 text-slate-400 group/teacher cursor-pointer">
                      <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center">
                        <User size={12} className="text-slate-400" />
                      </div>
                      <span className="text-xs font-bold group-hover/teacher:text-[#003F87] transition-colors">
                        الأستاذ: {item.teacher?.username || "غير معروف"}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-50 flex items-center gap-3">
                    <button className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 transition-all">
                      <Eye size={16} /> معاينة
                    </button>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleApprove(item._id)}
                        className="w-12 h-12 bg-green-50 text-green-600 hover:bg-green-600 hover:text-white rounded-2xl flex items-center justify-center transition-all shadow-sm hover:shadow-green-200"
                        title="موافقة"
                      >
                        <Check size={20} strokeWidth={3} />
                      </button>
                      <button 
                        onClick={() => handleReject(item._id)}
                        className="w-12 h-12 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-2xl flex items-center justify-center transition-all shadow-sm hover:shadow-red-200"
                        title="رفض وحذف"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-dashed border-slate-200 rounded-[3rem] py-32 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
              <AlertCircle size={40} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800">لا يوجد محتوى للمراجعة</h3>
              <p className="text-slate-400 font-medium">كل شيء محدث، لا توجد طلبات معلقة حالياً.</p>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ContentReview;