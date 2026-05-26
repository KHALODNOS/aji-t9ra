import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import {
  User,
  Briefcase,
  Settings,
  LifeBuoy,
  Save,
  Lock,
  PlusCircle,
  Trash2,
  Globe,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Sparkles,
  Loader2,
  Check,
  AlertCircle,
  Plus,
  X
} from "lucide-react";
import api from "../../services/api";

const TeacherProfile = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Profile data state
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    PhoneNumber: "",
    location: "",
    photoProfile: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400",
    fluentLanguages: [],
    education: [],
    experience: []
  });

  // Local inputs for professional entries
  const [newEdu, setNewEdu] = useState({ degree: "", institution: "", fieldOfStudy: "", startDate: "", endDate: "" });
  const [newExp, setNewExp] = useState({ jobTitle: "", company: "", startDate: "", endDate: "" });
  const [newLang, setNewLang] = useState({ language: "", level: "Intermediate" });

  // Settings states
  const [passwordForm, setPasswordForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [prefs, setPrefs] = useState({ dashboardLanguage: "ar", emailNotifications: true, smsNotifications: false });

  // Support state
  const [supportForm, setSupportForm] = useState({ subject: "", message: "", priority: "normal" });

  // Modals for professional additions
  const [showEduModal, setShowEduModal] = useState(false);
  const [showExpModal, setShowExpModal] = useState(false);
  const [showLangModal, setShowLangModal] = useState(false);

  // Load profile data on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get("/user/profile");
      if (response.data) {
        setProfile({
          username: response.data.username || "",
          email: response.data.email || "",
          PhoneNumber: response.data.PhoneNumber || "",
          location: response.data.location || "",
          photoProfile: response.data.photoProfile || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400",
          fluentLanguages: response.data.fluentLanguages || [],
          education: response.data.education || [],
          experience: response.data.experience || []
        });
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      toast.error("فشل في تحميل بيانات الملف الشخصي، يرجى المحاولة لاحقاً");
    } finally {
      setLoading(false);
    }
  };

  // Save personal details
  const handleSavePersonalInfo = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const response = await api.put("/user/profile", {
        username: profile.username,
        PhoneNumber: profile.PhoneNumber,
        location: profile.location,
        photoProfile: profile.photoProfile
      });
      toast.success("تم حفظ البيانات الشخصية بنجاح! ✨");
      if (response.data?.user) {
        setProfile(prev => ({ ...prev, ...response.data.user }));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "حدث خطأ أثناء حفظ التغييرات");
    } finally {
      setSaving(false);
    }
  };

  // Save professional details
  const handleSaveProfessionalInfo = async () => {
    try {
      setSaving(true);
      const response = await api.put("/user/profile", {
        fluentLanguages: profile.fluentLanguages,
        education: profile.education,
        experience: profile.experience
      });
      toast.success("تم تحديث البيانات المهنية وقاعدة البيانات بنجاح! 💼");
      if (response.data?.user) {
        setProfile(prev => ({ ...prev, ...response.data.user }));
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء تحديث البيانات المهنية");
    } finally {
      setSaving(false);
    }
  };

  // Change Password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("كلمتا المرور الجديدتان غير متطابقتين!");
      return;
    }
    try {
      setSaving(true);
      await api.put("/user/change-password", {
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword
      });
      toast.success("تم تحديث كلمة المرور بنجاح! 🔒");
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "فشلت عملية تغيير كلمة المرور");
    } finally {
      setSaving(false);
    }
  };

  // Submit Support Request
  const handleSendSupport = async (e) => {
    e.preventDefault();
    if (!supportForm.subject.trim() || !supportForm.message.trim()) {
      toast.error("يرجى ملء جميع الحقول المطلوبة للدعم");
      return;
    }
    try {
      setSaving(true);
      await api.post("/user/support", {
        ...supportForm,
        email: profile.email,
        phone: profile.PhoneNumber,
      });
      toast.success("تم إرسال طلبك للإدارة الفنية بنجاح، سيتم الرد قريباً! 💬");
      setSupportForm({ subject: "", message: "", priority: "normal" });
    } catch (error) {
      toast.error("فشل في إرسال طلب الدعم الفني");
    } finally {
      setSaving(false);
    }
  };

  // Dynamic lists handlers (local state changes, requires clicking Save to commit)
  const addEducation = () => {
    if (!newEdu.degree || !newEdu.institution) {
      toast.error("يرجى ملء حقل الشهادة والجامعة");
      return false;
    }
    setProfile(prev => ({
      ...prev,
      education: [...prev.education, newEdu]
    }));
    setNewEdu({ degree: "", institution: "", fieldOfStudy: "", startDate: "", endDate: "" });
    toast.success("تمت إضافة المؤهل إلى القائمة (انقر على حفظ لتأكيد التغييرات)");
    return true;
  };

  const removeEducation = (index) => {
    setProfile(prev => ({
      ...prev,
      education: prev.education.filter((_, idx) => idx !== index)
    }));
  };

  const addExperience = () => {
    if (!newExp.jobTitle || !newExp.company) {
      toast.error("يرجى تحديد المسمى الوظيفي وجهة العمل");
      return false;
    }
    setProfile(prev => ({
      ...prev,
      experience: [...prev.experience, newExp]
    }));
    setNewExp({ jobTitle: "", company: "", startDate: "", endDate: "" });
    toast.success("تمت إضافة الخبرة إلى القائمة (انقر على حفظ لتأكيد التغييرات)");
    return true;
  };

  const removeExperience = (index) => {
    setProfile(prev => ({
      ...prev,
      experience: prev.experience.filter((_, idx) => idx !== index)
    }));
  };

  const addLanguage = () => {
    if (!newLang.language) {
      toast.error("يرجى إدخال اسم اللغة");
      return false;
    }
    // Prevent duplicates
    if (profile.fluentLanguages.some(l => l.language.toLowerCase() === newLang.language.toLowerCase())) {
      toast.error("هذه اللغة مضافة بالفعل");
      return false;
    }
    setProfile(prev => ({
      ...prev,
      fluentLanguages: [...prev.fluentLanguages, newLang]
    }));
    setNewLang({ language: "", level: "Intermediate" });
    toast.success("تمت إضافة اللغة (انقر على حفظ لتأكيد التغييرات)");
    return true;
  };

  const removeLanguage = (index) => {
    setProfile(prev => ({
      ...prev,
      fluentLanguages: prev.fluentLanguages.filter((_, idx) => idx !== index)
    }));
  };

  // Convert raw ISO string to YYYY-MM-DD
  const formatDateForInput = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toISOString().substring(0, 10);
  };

  if (loading) {
    return (
      <div className="content-area" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', flexDirection: 'column', gap: '20px' }}>
        <Loader2 size={60} className="animate-spin" style={{ color: 'var(--teacher-primary)' }} />
        <span style={{ fontSize: '1.2rem', color: '#64748b', fontWeight: 700 }}>جاري جلب وتجهيز ملفك الشخصي...</span>
      </div>
    );
  }

  const tabs = [
    { id: "personal", label: "المعلومات الشخصية", icon: User },
    { id: "professional", label: "المعلومات المهنية", icon: Briefcase },
    { id: "settings", label: "الإعدادات الأمنية", icon: Settings },
    { id: "support", label: "الدعم والاتصال", icon: LifeBuoy }
  ];

  return (
    <div className="content-area" dir="rtl" style={{ padding: "30px", minHeight: "100vh" }}>
      <Toaster position="top-center" reverseOrder={false} />

      {/* Header section with profile overview */}
      <section className="card-3d" style={{ padding: '35px', display: 'flex', flexWrap: 'wrap', gap: '30px', alignItems: 'center', justifyContent: 'space-between', marginBottom: '35px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <img
              style={{ width: '130px', height: '130px', borderRadius: '50%', border: '5px solid #fff', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', objectFit: 'cover' }}
              src={profile.photoProfile || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400"}
              alt="Avatar"
            />
            <div style={{ position: 'absolute', bottom: '5px', right: '5px', width: '32px', height: '32px', background: '#22c55e', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3.5px solid #fff', fontSize: '0.8rem' }}>
              <Check size={14} strokeWidth={3} />
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <h1 style={{ fontSize: '2.1rem', fontWeight: 850, color: 'var(--teacher-primary)' }}>{profile.username || "أستاذ اللغة"}</h1>
              <span style={{ background: 'var(--teacher-primary-light)', color: 'var(--teacher-primary)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800 }}>حساب معلم نشط</span>
            </div>
            <span style={{ fontSize: '1rem', color: '#64748b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Mail size={16} /> {profile.email}
            </span>

            <div style={{ display: 'flex', gap: '25px', marginTop: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--teacher-primary)' }}>{profile.education.length}</span>
                <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700 }}>المؤهلات</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ca8a04' }}>{profile.experience.length}</span>
                <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700 }}>الخبرات</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#10b981' }}>{profile.fluentLanguages.length}</span>
                <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700 }}>اللغات المتقنة</span>
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button className="btn-3d-secondary" onClick={fetchProfile} style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            تحديث البيانات
          </button>
        </div>
      </section>

      {/* Main layout: Grid structure with responsive sidebar and container */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '35px' }} className="profile-grid">
        {/* Left tabs menu */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  borderRadius: '16px',
                  border: 'none',
                  background: isActive ? 'var(--teacher-primary)' : 'rgba(255, 255, 255, 0.7)',
                  color: isActive ? '#fff' : 'var(--teacher-primary)',
                  boxShadow: isActive ? '0 10px 20px rgba(79, 70, 229, 0.15)' : '0 4px 6px rgba(0,0,0,0.02)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  fontSize: '1rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  textAlign: 'right',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: isActive ? 'translateY(-2px)' : 'none'
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: isActive ? 'rgba(255, 255, 255, 0.2)' : 'var(--teacher-primary-light)',
                    color: isActive ? '#fff' : 'var(--teacher-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s'
                  }}
                >
                  <Icon size={18} />
                </div>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Right details dynamic area */}
        <main>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="card-3d"
              style={{ padding: '35px', background: '#fff', minHeight: '500px' }}
            >
              {/* TAB 1: Personal Information */}
              {activeTab === "personal" && (
                <form onSubmit={handleSavePersonalInfo}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 850, color: 'var(--teacher-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <User size={24} /> المعلومات الشخصية والتواصل
                    </h2>
                    <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 700 }}>المعرف: {profile.email}</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '30px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 800, color: '#475569', marginBottom: '8px' }}>الاسم الكامل للأستاذ</label>
                      <input
                        type="text"
                        required
                        className="input-3d"
                        style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1.5px solid #e2e8f0', fontSize: '0.95rem' }}
                        value={profile.username}
                        onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                        placeholder="أدخل اسمك الكامل"
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 800, color: '#475569', marginBottom: '8px' }}>رقم الهاتف المحمول</label>
                      <input
                        type="tel"
                        className="input-3d"
                        style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1.5px solid #e2e8f0', fontSize: '0.95rem' }}
                        value={profile.PhoneNumber}
                        onChange={(e) => setProfile({ ...profile, PhoneNumber: e.target.value })}
                        placeholder="مثال: 0612345678"
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 800, color: '#475569', marginBottom: '8px' }}>العنوان أو مكان الإقامة</label>
                      <input
                        type="text"
                        className="input-3d"
                        style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1.5px solid #e2e8f0', fontSize: '0.95rem' }}
                        value={profile.location}
                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                        placeholder="مثال: الدار البيضاء، المغرب"
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 800, color: '#475569', marginBottom: '8px' }}>رابط الصورة الشخصية</label>
                      <input
                        type="url"
                        className="input-3d"
                        style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1.5px solid #e2e8f0', fontSize: '0.95rem' }}
                        value={profile.photoProfile}
                        onChange={(e) => setProfile({ ...profile, photoProfile: e.target.value })}
                        placeholder="https://example.com/avatar.jpg"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '20px', borderTop: '1.5px solid #f1f5f9' }}>
                    <button
                      type="submit"
                      disabled={saving}
                      className="btn-3d-primary"
                      style={{ padding: '12px 35px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem' }}
                    >
                      {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                      حفظ البيانات الشخصية
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 2: Professional Information */}
              {activeTab === "professional" && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 850, color: 'var(--teacher-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Briefcase size={24} /> الملف الأكاديمي والخبرات المهنية
                    </h2>
                    <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 700 }}>سجل سيرتك الذاتية ومؤهلاتك العلمية</span>
                  </div>

                  {/* 1. Education Section */}
                  <div style={{ marginBottom: '45px', paddingBottom: '35px', borderBottom: '2.5px dashed rgba(93, 162, 150, 0.15)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#334155', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                        <GraduationCap size={20} style={{ color: 'var(--teacher-primary)' }} /> المؤهلات العلمية والدراسة
                      </h3>
                      {profile.education.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setShowEduModal(true)}
                          className="btn-3d-secondary"
                          style={{ padding: '6px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px' }}
                        >
                          <Plus size={14} /> إضافة مؤهل
                        </button>
                      )}
                    </div>

                    {/* Education Items List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                      {profile.education.length === 0 ? (
                        <div
                          onClick={() => setShowEduModal(true)}
                          style={{
                            padding: '40px 20px',
                            background: 'rgba(93, 162, 150, 0.01)',
                            border: '2px dashed rgba(93, 162, 150, 0.25)',
                            borderRadius: '20px',
                            textAlign: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '12px'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(93, 162, 150, 0.04)';
                            e.currentTarget.style.borderColor = 'var(--teacher-primary)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(93, 162, 150, 0.01)';
                            e.currentTarget.style.borderColor = 'rgba(93, 162, 150, 0.25)';
                          }}
                        >
                          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(93, 162, 150, 0.08)', color: 'var(--teacher-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '4px' }}>
                            <GraduationCap size={28} />
                          </div>
                          <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#334155' }}>لا توجد مؤهلات علمية مضافة</span>
                          <span style={{ fontSize: '0.8rem', color: '#94a3b8', maxWidth: '350px', lineHeight: 1.5 }}>
                            أضف شهاداتك الأكاديمية والدرجات العلمية التي حصلت عليها لتظهر بشكل احترافي للطلاب والإدارة.
                          </span>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setShowEduModal(true); }}
                            className="btn-3d-primary"
                            style={{ padding: '8px 20px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}
                          >
                            <Plus size={14} /> أضف مؤهلاً علمياً جديداً
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '15px' }}>
                          {profile.education.map((edu, index) => (
                            <div
                              key={index}
                              style={{
                                padding: '20px',
                                background: '#ffffff',
                                borderRight: '4px solid var(--teacher-primary)',
                                borderTop: '1px solid #f1f5f9',
                                borderBottom: '1px solid #f1f5f9',
                                borderLeft: '1px solid #f1f5f9',
                                borderRadius: '16px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                boxShadow: '0 4px 15px -3px rgba(0, 0, 0, 0.03)',
                                transition: 'all 0.25s ease'
                              }}
                            >
                              <div style={{ display: 'flex', gap: '12px' }}>
                                <div style={{ minWidth: '36px', height: '36px', borderRadius: '10px', background: 'rgba(93, 162, 150, 0.08)', color: 'var(--teacher-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <GraduationCap size={18} />
                                </div>
                                <div>
                                  <b style={{ fontSize: '0.95rem', color: '#1e293b', display: 'block', marginBottom: '4px', fontWeight: 850 }}>
                                    {edu.degree}
                                  </b>
                                  <span style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                                    {edu.institution} {edu.fieldOfStudy ? `• ${edu.fieldOfStudy}` : ""}
                                  </span>
                                  {(edu.startDate || edu.endDate) && (
                                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
                                      <Calendar size={12} />
                                      {edu.startDate ? new Date(edu.startDate).getFullYear() : "غير محدد"} - {edu.endDate ? new Date(edu.endDate).getFullYear() : "الآن"}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeEducation(index)}
                                style={{ width: '32px', height: '32px', borderRadius: '8px', border: 'none', background: '#fee2e2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s', alignSelf: 'flex-start' }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = '#fca5a5'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = '#fee2e2'; }}
                                title="حذف"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 2. Experience Section */}
                  <div style={{ marginBottom: '45px', paddingBottom: '35px', borderBottom: '2.5px dashed rgba(93, 162, 150, 0.15)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#334155', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                        <Briefcase size={20} style={{ color: 'var(--teacher-primary)' }} /> الخبرة العملية والمهنية
                      </h3>
                      {profile.experience.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setShowExpModal(true)}
                          className="btn-3d-secondary"
                          style={{ padding: '6px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px' }}
                        >
                          <Plus size={14} /> إضافة خبرة
                        </button>
                      )}
                    </div>

                    {/* Experience Items List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                      {profile.experience.length === 0 ? (
                        <div
                          onClick={() => setShowExpModal(true)}
                          style={{
                            padding: '40px 20px',
                            background: 'rgba(93, 162, 150, 0.01)',
                            border: '2px dashed rgba(93, 162, 150, 0.25)',
                            borderRadius: '20px',
                            textAlign: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '12px'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(93, 162, 150, 0.04)';
                            e.currentTarget.style.borderColor = 'var(--teacher-primary)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(93, 162, 150, 0.01)';
                            e.currentTarget.style.borderColor = 'rgba(93, 162, 150, 0.25)';
                          }}
                        >
                          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(93, 162, 150, 0.08)', color: 'var(--teacher-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '4px' }}>
                            <Briefcase size={26} />
                          </div>
                          <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#334155' }}>لا توجد خبرات مهنية مضافة</span>
                          <span style={{ fontSize: '0.8rem', color: '#94a3b8', maxWidth: '350px', lineHeight: 1.5 }}>
                            أضف خبراتك الوظيفية السابقة والمدارس التي قمت بالتدريس فيها لإثراء ملفك التعريفي.
                          </span>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setShowExpModal(true); }}
                            className="btn-3d-primary"
                            style={{ padding: '8px 20px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}
                          >
                            <Plus size={14} /> أضف خبرة مهنية جديدة
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '15px' }}>
                          {profile.experience.map((exp, index) => (
                            <div
                              key={index}
                              style={{
                                padding: '20px',
                                background: '#ffffff',
                                borderRight: '4px solid #10b981',
                                borderTop: '1px solid #f1f5f9',
                                borderBottom: '1px solid #f1f5f9',
                                borderLeft: '1px solid #f1f5f9',
                                borderRadius: '16px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                boxShadow: '0 4px 15px -3px rgba(0, 0, 0, 0.03)',
                                transition: 'all 0.25s ease'
                              }}
                            >
                              <div style={{ display: 'flex', gap: '12px' }}>
                                <div style={{ minWidth: '36px', height: '36px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.08)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <Briefcase size={18} />
                                </div>
                                <div>
                                  <b style={{ fontSize: '0.95rem', color: '#1e293b', display: 'block', marginBottom: '4px', fontWeight: 850 }}>
                                    {exp.jobTitle}
                                  </b>
                                  <span style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                                    {exp.company}
                                  </span>
                                  {(exp.startDate || exp.endDate) && (
                                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
                                      <Calendar size={12} />
                                      {exp.startDate ? new Date(exp.startDate).getFullYear() : "غير محدد"} - {exp.endDate ? new Date(exp.endDate).getFullYear() : "الآن"}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeExperience(index)}
                                style={{ width: '32px', height: '32px', borderRadius: '8px', border: 'none', background: '#fee2e2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s', alignSelf: 'flex-start' }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = '#fca5a5'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = '#fee2e2'; }}
                                title="حذف"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 3. Languages Section */}
                  <div style={{ marginBottom: '35px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#334155', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                        <Globe size={20} style={{ color: 'var(--teacher-primary)' }} /> اللغات المتقنة ومستواها
                      </h3>
                      <button
                        type="button"
                        onClick={() => setShowLangModal(true)}
                        className="btn-3d-secondary"
                        style={{ padding: '6px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px' }}
                      >
                        <Plus size={14} /> إضافة لغة
                      </button>
                    </div>

                    {/* Fluent languages pills */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                      {profile.fluentLanguages.length === 0 ? (
                        <div
                          onClick={() => setShowLangModal(true)}
                          style={{
                            padding: '30px 20px',
                            background: 'rgba(93, 162, 150, 0.01)',
                            border: '2px dashed rgba(93, 162, 150, 0.25)',
                            borderRadius: '16px',
                            textAlign: 'center',
                            cursor: 'pointer',
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(93, 162, 150, 0.04)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(93, 162, 150, 0.01)';
                          }}
                        >
                          <Globe size={24} style={{ color: '#94a3b8' }} />
                          <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 700 }}>لم تضف لغات بعد</span>
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>حدد اللغات التي تتقنها للتواصل مع فئات مختلفة من الطلاب.</span>
                        </div>
                      ) : (
                        profile.fluentLanguages.map((lang, index) => (
                          <div
                            key={index}
                            style={{
                              background: 'var(--teacher-primary-light)',
                              color: 'var(--teacher-primary)',
                              padding: '8px 16px',
                              borderRadius: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              border: '1px solid rgba(93, 162, 150, 0.15)',
                              fontWeight: 800,
                              boxShadow: '0 2px 8px rgba(93, 162, 150, 0.05)',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <span>{lang.language} ({lang.level === 'native' ? 'اللغة الأم' : lang.level === 'Advanced' ? 'متقدم' : lang.level === 'Intermediate' ? 'متوسط' : 'مبتدئ'})</span>
                            <button
                              type="button"
                              onClick={() => removeLanguage(index)}
                              style={{ border: 'none', background: 'none', color: '#ef4444', display: 'inline-flex', alignItems: 'center', cursor: 'pointer', padding: '0 2px' }}
                            >
                              <X size={14} style={{ pointerEvents: 'none' }} />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Save everything to database */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '25px', borderTop: '1.5px solid #f1f5f9', marginTop: '20px' }}>
                    <button
                      onClick={handleSaveProfessionalInfo}
                      disabled={saving}
                      className="btn-3d-primary"
                      style={{ padding: '12px 35px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem' }}
                    >
                      {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                      حفظ السيرة والخبرات مهنياً
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: Account & Security Settings */}
              {activeTab === "settings" && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                  {/* Password Change Form */}
                  <form onSubmit={handleChangePassword}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                      <h2 style={{ fontSize: '1.4rem', fontWeight: 850, color: 'var(--teacher-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Lock size={24} /> تغيير كلمة المرور وتأمين الحساب
                      </h2>
                      <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 700 }}>يُنصح بتحديثها بشكل دوري</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', maxWidth: '600px', marginBottom: '25px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 800, color: '#475569', marginBottom: '8px' }}>كلمة المرور الحالية</label>
                        <input
                          type="password"
                          required
                          className="input-3d"
                          style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1.5px solid #e2e8f0', fontSize: '0.95rem' }}
                          value={passwordForm.oldPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                          placeholder="••••••••"
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 800, color: '#475569', marginBottom: '8px' }}>كلمة المرور الجديدة</label>
                        <input
                          type="password"
                          required
                          className="input-3d"
                          style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1.5px solid #e2e8f0', fontSize: '0.95rem' }}
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                          placeholder="••••••••"
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 800, color: '#475569', marginBottom: '8px' }}>تأكيد كلمة المرور الجديدة</label>
                        <input
                          type="password"
                          required
                          className="input-3d"
                          style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1.5px solid #e2e8f0', fontSize: '0.95rem' }}
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={saving}
                      className="btn-3d-primary"
                      style={{ padding: '12px 35px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem' }}
                    >
                      {saving ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />}
                      تحديث كلمة المرور الآمنة
                    </button>
                  </form>

                  {/* General Preferences */}
                  <div style={{ borderTop: '2px dashed #f1f5f9', paddingTop: '30px' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#334155', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Settings size={20} style={{ color: 'var(--teacher-primary)' }} /> تفضيلات واجهة التحكم والإشعارات
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '600px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', background: '#f8fafc', borderRadius: '12px' }}>
                        <div>
                          <b style={{ fontSize: '0.95rem', color: '#1e293b', display: 'block', marginBottom: '2px' }}>لغة لوحة التحكم الافتراضية</b>
                          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>حدد اللغة المفضلة لواجهات التفاعل للمعلم</span>
                        </div>
                        <select
                          className="input-3d"
                          style={{ width: '150px', height: '40px', padding: '0 10px' }}
                          value={prefs.dashboardLanguage}
                          onChange={(e) => {
                            setPrefs({ ...prefs, dashboardLanguage: e.target.value });
                            toast.success("تم تحديث لغة الواجهة المفضلة!");
                          }}
                        >
                          <option value="ar">العربية</option>
                          <option value="fr">French</option>
                          <option value="en">English</option>
                        </select>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', background: '#f8fafc', borderRadius: '12px' }}>
                        <div>
                          <b style={{ fontSize: '0.95rem', color: '#1e293b', display: 'block', marginBottom: '2px' }}>تلقي الإشعارات عبر البريد الإلكتروني</b>
                          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>إرسال تنبيهات بريدية عند موافقة الإدارة على محتواك</span>
                        </div>
                        <button
                          onClick={() => {
                            setPrefs({ ...prefs, emailNotifications: !prefs.emailNotifications });
                            toast.success(prefs.emailNotifications ? "تم إيقاف الإشعارات البريدية" : "تم تفعيل الإشعارات البريدية 🔔");
                          }}
                          style={{
                            width: '50px',
                            height: '26px',
                            borderRadius: '15px',
                            background: prefs.emailNotifications ? 'var(--teacher-primary)' : '#cbd5e1',
                            border: 'none',
                            position: 'relative',
                            cursor: 'pointer',
                            transition: 'all 0.3s'
                          }}
                        >
                          <div style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            background: '#fff',
                            position: 'absolute',
                            top: '3px',
                            left: prefs.emailNotifications ? '27px' : '3px',
                            transition: 'all 0.3s'
                          }}></div>
                        </button>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', background: '#f8fafc', borderRadius: '12px' }}>
                        <div>
                          <b style={{ fontSize: '0.95rem', color: '#1e293b', display: 'block', marginBottom: '2px' }}>تلقي الإشعارات عبر الرسائل النصية القصيرة (SMS)</b>
                          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>تلقي أكواد الدخول والتنبيهات المباشرة على هاتفك</span>
                        </div>
                        <button
                          onClick={() => {
                            setPrefs({ ...prefs, smsNotifications: !prefs.smsNotifications });
                            toast.success(prefs.smsNotifications ? "تم إيقاف إشعارات الهاتف" : "تم تفعيل إشعارات الهاتف 📱");
                          }}
                          style={{
                            width: '50px',
                            height: '26px',
                            borderRadius: '15px',
                            background: prefs.smsNotifications ? 'var(--teacher-primary)' : '#cbd5e1',
                            border: 'none',
                            position: 'relative',
                            cursor: 'pointer',
                            transition: 'all 0.3s'
                          }}
                        >
                          <div style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            background: '#fff',
                            position: 'absolute',
                            top: '3px',
                            left: prefs.smsNotifications ? '27px' : '3px',
                            transition: 'all 0.3s'
                          }}></div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: Support Ticket & Direct Contact */}
              {activeTab === "support" && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '30px' }} className="support-grid">
                  {/* Support Form */}
                  <form onSubmit={handleSendSupport}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                      <h2 style={{ fontSize: '1.4rem', fontWeight: 850, color: 'var(--teacher-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <LifeBuoy size={24} /> تقديم طلب دعم فني للإدارة
                      </h2>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '25px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 800, color: '#475569', marginBottom: '8px' }}>موضوع الطلب / المشكلة</label>
                        <input
                          type="text"
                          required
                          className="input-3d"
                          style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1.5px solid #e2e8f0', fontSize: '0.95rem' }}
                          value={supportForm.subject}
                          onChange={(e) => setSupportForm({ ...supportForm, subject: e.target.value })}
                          placeholder="أدخل عنواناً للمشكلة باختصار"
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 800, color: '#475569', marginBottom: '8px' }}>مستوى الأهمية والاستعجال</label>
                        <select
                          className="input-3d"
                          style={{ width: '100%', height: '48px', padding: '0 12px' }}
                          value={supportForm.priority}
                          onChange={(e) => setSupportForm({ ...supportForm, priority: e.target.value })}
                        >
                          <option value="normal">عادي (Normal)</option>
                          <option value="high">مستعجل (High)</option>
                          <option value="urgent">حرِج جداً وطارئ (Urgent)</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 800, color: '#475569', marginBottom: '8px' }}>تفاصيل المشكلة والوصف</label>
                        <textarea
                          required
                          rows={6}
                          className="input-3d"
                          style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1.5px solid #e2e8f0', fontSize: '0.95rem', resize: 'vertical' }}
                          value={supportForm.message}
                          onChange={(e) => setSupportForm({ ...supportForm, message: e.target.value })}
                          placeholder="اشرح المشكلة التقنية بالتفصيل لكي يتمكن المشرف من مساعدتك بأفضل شكل..."
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={saving}
                      className="btn-3d-primary"
                      style={{ padding: '12px 35px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem' }}
                    >
                      {saving ? <Loader2 size={18} className="animate-spin" /> : <LifeBuoy size={18} />}
                      إرسال تذكرة الدعم للإدارة
                    </button>
                  </form>

                  {/* Sidebar quick support coordinates */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ background: '#f8fafc', border: '1.5px solid #f1f5f9', padding: '25px', borderRadius: '18px' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--teacher-primary)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Sparkles size={16} /> اتصالات سريعة ومباشرة
                      </h3>
                      <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.6, marginBottom: '20px', fontWeight: 600 }}>
                        فريق الدعم الفني متواجد لمساعدتك طوال أيام الأسبوع لتجاوز أي مشاكل في رفع الفيديوهات أو القصص التفاعلية.
                      </p>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--teacher-primary-light)', color: 'var(--teacher-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Mail size={16} />
                          </div>
                          <div>
                            <span style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700 }}>البريد المباشر</span>
                            <span style={{ fontSize: '0.85rem', color: '#334155', fontWeight: 800 }}>support@ajit9ra.ma</span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Phone size={16} />
                          </div>
                          <div>
                            <span style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700 }}>خط الاتصال الفوري</span>
                            <span style={{ fontSize: '0.85rem', color: '#334155', fontWeight: 800 }}>+212 5 22 45 45 45</span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#fffbeb', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Calendar size={16} />
                          </div>
                          <div>
                            <span style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700 }}>ساعات الدوام الرسمية</span>
                            <span style={{ fontSize: '0.85rem', color: '#334155', fontWeight: 800 }}>الاثنين - الجمعة: 9:00 - 18:00</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div style={{ background: 'linear-gradient(135deg, var(--teacher-primary) 0%, #312e81 100%)', color: '#fff', padding: '25px', borderRadius: '18px', boxShadow: '0 10px 20px rgba(0,0,0,0.05)', position: 'relative', overflow: 'hidden' }}>
                      <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.1, transform: 'rotate(25deg)' }}>
                        <LifeBuoy size={120} />
                      </div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '8px', color: '#fff' }}>هل تحتاج لمكالمة فيديو سريعة؟</h4>
                      <p style={{ fontSize: '0.75rem', color: '#c7d2fe', lineHeight: 1.5, marginBottom: '15px' }}>
                        تواصل معنا مباشرة لنقدم لك حلاً وشرحاً مباشراً للمشكلة خطوة بخطوة بالصوت والصورة.
                      </p>
                      <button
                        type="button"
                        onClick={() => toast.success("جاري تجهيز طلب مكالمة الدعم الفوري... 📞")}
                        style={{ border: 'none', background: '#fff', color: 'var(--teacher-primary)', padding: '8px 15px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s' }}
                      >
                        طلب اتصال مباشر
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Modern High-Fidelity Glassmorphic Modals */}
      {/* 1. Education Modal */}
      {showEduModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 9999,
          background: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          animation: 'fadeIn 0.25s ease'
        }} dir="rtl">
          <div style={{
            background: '#ffffff',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '550px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(93, 162, 150, 0.1)',
            overflow: 'hidden',
            animation: 'scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}>
            {/* Header */}
            <div style={{
              background: 'linear-gradient(135deg, var(--teacher-primary-light) 0%, rgba(255, 255, 255, 0.9) 100%)',
              padding: '25px 30px',
              borderBottom: '1px solid rgba(93, 162, 150, 0.15)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--teacher-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <GraduationCap size={22} /> إضافة مؤهل علمي جديد
                </h3>
                <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700, marginTop: '4px', display: 'block' }}>سجل شهاداتك ومؤهلاتك الأكاديمية بدقة</span>
              </div>
              <button
                type="button"
                onClick={() => setShowEduModal(false)}
                style={{ width: '36px', height: '36px', borderRadius: '12px', border: 'none', background: 'rgba(93, 162, 150, 0.1)', color: 'var(--teacher-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#475569', marginBottom: '8px' }}>الدرجة العلمية *</label>
                <input
                  type="text"
                  className="input-3d"
                  style={{ width: '100%' }}
                  placeholder="مثال: ماجستير، إجازة مهنية، دكتوراه"
                  value={newEdu.degree}
                  onChange={(e) => setNewEdu({ ...newEdu, degree: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#475569', marginBottom: '8px' }}>الجامعة / المؤسسة التعليمية *</label>
                <input
                  type="text"
                  className="input-3d"
                  style={{ width: '100%' }}
                  placeholder="مثال: جامعة محمد الخامس، كلية علوم التربية"
                  value={newEdu.institution}
                  onChange={(e) => setNewEdu({ ...newEdu, institution: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#475569', marginBottom: '8px' }}>التخصص ومجال الدراسة</label>
                <input
                  type="text"
                  className="input-3d"
                  style={{ width: '100%' }}
                  placeholder="مثال: لسانيات أمازيغية، ديدكتيك المواد"
                  value={newEdu.fieldOfStudy}
                  onChange={(e) => setNewEdu({ ...newEdu, fieldOfStudy: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#475569', marginBottom: '8px' }}>تاريخ البدء</label>
                  <input
                    type="date"
                    className="input-3d"
                    style={{ width: '100%' }}
                    value={newEdu.startDate}
                    onChange={(e) => setNewEdu({ ...newEdu, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#475569', marginBottom: '8px' }}>تاريخ التخرج (أو المتوقع)</label>
                  <input
                    type="date"
                    className="input-3d"
                    style={{ width: '100%' }}
                    value={newEdu.endDate}
                    onChange={(e) => setNewEdu({ ...newEdu, endDate: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{
              background: '#f8fafc',
              padding: '20px 30px',
              borderTop: '1px solid #f1f5f9',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px'
            }}>
              <button
                type="button"
                onClick={() => setShowEduModal(false)}
                className="btn-3d-secondary"
                style={{ padding: '10px 22px', fontSize: '0.85rem' }}
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={() => {
                  if (addEducation()) {
                    setShowEduModal(false);
                  }
                }}
                className="btn-3d-primary"
                style={{ padding: '10px 25px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Plus size={16} /> إضافة المؤهل
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Experience Modal */}
      {showExpModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 9999,
          background: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          animation: 'fadeIn 0.25s ease'
        }} dir="rtl">
          <div style={{
            background: '#ffffff',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '550px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(93, 162, 150, 0.1)',
            overflow: 'hidden',
            animation: 'scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}>
            {/* Header */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(255, 255, 255, 0.9) 100%)',
              padding: '25px 30px',
              borderBottom: '1px solid rgba(16, 185, 129, 0.15)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#10b981', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Briefcase size={22} /> إضافة خبرة مهنية جديدة
                </h3>
                <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700, marginTop: '4px', display: 'block' }}>وثّق تاريخك الوظيفي وخبراتك التدريسية</span>
              </div>
              <button
                type="button"
                onClick={() => setShowExpModal(false)}
                style={{ width: '36px', height: '36px', borderRadius: '12px', border: 'none', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#475569', marginBottom: '8px' }}>المسمى الوظيفي *</label>
                <input
                  type="text"
                  className="input-3d"
                  style={{ width: '100%' }}
                  placeholder="مثال: أستاذ لغة تيفيناغ، منسق تربوي"
                  value={newExp.jobTitle}
                  onChange={(e) => setNewExp({ ...newExp, jobTitle: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#475569', marginBottom: '8px' }}>جهة العمل / المدرسة *</label>
                <input
                  type="text"
                  className="input-3d"
                  style={{ width: '100%' }}
                  placeholder="مثال: مدرسة النهضة، مؤسسة تعليمية خصوصية"
                  value={newExp.company}
                  onChange={(e) => setNewExp({ ...newExp, company: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#475569', marginBottom: '8px' }}>تاريخ بدء العمل</label>
                  <input
                    type="date"
                    className="input-3d"
                    style={{ width: '100%' }}
                    value={newExp.startDate}
                    onChange={(e) => setNewExp({ ...newExp, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#475569', marginBottom: '8px' }}>تاريخ انتهاء العمل (أو اتركه فارغاً للآن)</label>
                  <input
                    type="date"
                    className="input-3d"
                    style={{ width: '100%' }}
                    value={newExp.endDate}
                    onChange={(e) => setNewExp({ ...newExp, endDate: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{
              background: '#f8fafc',
              padding: '20px 30px',
              borderTop: '1px solid #f1f5f9',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px'
            }}>
              <button
                type="button"
                onClick={() => setShowExpModal(false)}
                className="btn-3d-secondary"
                style={{ padding: '10px 22px', fontSize: '0.85rem' }}
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={() => {
                  if (addExperience()) {
                    setShowExpModal(false);
                  }
                }}
                className="btn-3d-primary"
                style={{ padding: '10px 25px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Plus size={16} /> إضافة الخبرة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Language Modal */}
      {showLangModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 9999,
          background: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          animation: 'fadeIn 0.25s ease'
        }} dir="rtl">
          <div style={{
            background: '#ffffff',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '500px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(93, 162, 150, 0.1)',
            overflow: 'hidden',
            animation: 'scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}>
            {/* Header */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(93, 162, 150, 0.08) 0%, rgba(255, 255, 255, 0.9) 100%)',
              padding: '25px 30px',
              borderBottom: '1px solid rgba(93, 162, 150, 0.15)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--teacher-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Globe size={22} /> إضافة لغة متقنة جديدة
                </h3>
                <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700, marginTop: '4px', display: 'block' }}>اختر اللغة ومستوى إتقانك لها</span>
              </div>
              <button
                type="button"
                onClick={() => setShowLangModal(false)}
                style={{ width: '36px', height: '36px', borderRadius: '12px', border: 'none', background: 'rgba(93, 162, 150, 0.1)', color: 'var(--teacher-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#475569', marginBottom: '8px' }}>اسم اللغة *</label>
                <input
                  type="text"
                  className="input-3d"
                  style={{ width: '100%' }}
                  placeholder="مثال: الأمازيغية، الفرنسية، الإنجليزية"
                  value={newLang.language}
                  onChange={(e) => setNewLang({ ...newLang, language: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#475569', marginBottom: '8px' }}>مستوى الإتقان *</label>
                <select
                  className="input-3d"
                  style={{ width: '100%', height: '48px', padding: '0 12px' }}
                  value={newLang.level}
                  onChange={(e) => setNewLang({ ...newLang, level: e.target.value })}
                >
                  <option value="native">اللغة الأم (Native)</option>
                  <option value="Advanced">متقدم (Advanced)</option>
                  <option value="Intermediate">متوسط (Intermediate)</option>
                  <option value="Beginner">مبتدئ (Beginner)</option>
                </select>
              </div>
            </div>

            {/* Footer */}
            <div style={{
              background: '#f8fafc',
              padding: '20px 30px',
              borderTop: '1px solid #f1f5f9',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px'
            }}>
              <button
                type="button"
                onClick={() => setShowLangModal(false)}
                className="btn-3d-secondary"
                style={{ padding: '10px 22px', fontSize: '0.85rem' }}
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={() => {
                  if (addLanguage()) {
                    setShowLangModal(false);
                  }
                }}
                className="btn-3d-primary"
                style={{ padding: '10px 25px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Plus size={16} /> إضافة اللغة
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleUp {
          from { transform: scale(0.94); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .input-3d {
          width: 100%;
          padding: 14px 16px;
          border-radius: 12px;
          border: 1.5px solid #cbd5e1 !important;
          background-color: #ffffff;
          font-size: 0.95rem;
          color: #1e293b;
          font-weight: 600;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.03), 0 2px 0 rgba(0, 0, 0, 0.02);
          outline: none;
        }
        .input-3d:focus {
          border-color: var(--teacher-primary) !important;
          box-shadow: 0 0 0 4px rgba(93, 162, 150, 0.15), inset 0 2px 4px rgba(0, 0, 0, 0.01) !important;
          transform: translateY(-1px);
        }
        .input-3d::placeholder {
          color: #94a3b8;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};

export default TeacherProfile;
