import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddShortVideo = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    language: "Arabic",
    videoFile: null,
    coverImage: null
  })
  //  

  

  const [previewUrl, setPreviewUrl] = useState(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("حجم الفيديو كبير جداً (الأقصى 5 ميجابايت)");
        return;
      }
      setFormData(prev => ({ ...prev, videoFile: file }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("حجم صورة الغلاف كبير جداً (الأقصى 2 ميجابايت)");
        return;
      }
      setFormData(prev => ({ ...prev, coverImage: file }));
      setCoverPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!formData.videoFile) {
      toast.error("يرجى اختيار ملف فيديو");
      return;
    }
    if (!formData.coverImage) {
      toast.error("يرجى اختيار صورة الغلاف للفيديو");
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("language", formData.language);
    data.append("video", formData.videoFile);
    data.append("coverImage", formData.coverImage);

    try {
      const token = localStorage.getItem("token");
      await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/videos/upload`, data, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        }
      });

      toast.success("تم رفع الفيديو بنجاح! هو الآن بانتظار المراجعة.");
      setTimeout(() => navigate("/teacher/dashboard"), 2000);
    } catch (error) {
      console.error("Error uploading video:", error);
      toast.error(error.response?.data?.message || "فشل رفع الفيديو");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="author-container" dir="rtl">
      <Toaster position="top-center" />

      <div className="page-header" style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#003F87', marginBottom: '10px' }}>إضافة فيديو قصير</h1>
        <p style={{ color: '#64748b', fontWeight: 600 }}>شارك مقطعاً تعليمياً سريعاً مع طلابك لإثراء رحلتهم اللغوية.</p>
      </div>

      {/* Stepper */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '40px' }}>
        {[1, 2, 3].map((s) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '35px',
              height: '35px',
              borderRadius: '50%',
              background: step >= s ? '#003F87' : '#e2e8f0',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              boxShadow: step >= s ? '0 10px 20px rgba(0,63,135,0.2)' : 'none',
              transition: 'all 0.3s'
            }}>{s}</div>
            <span style={{ fontWeight: 800, color: step >= s ? '#003F87' : '#94a3b8' }}>
              {s === 1 ? 'المعلومات' : s === 2 ? 'رفع الفيديو' : 'غلاف الفيديو'}
            </span>
          </div>
        ))}
      </div>

      <div className="video-author-grid" style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '40px', alignItems: 'start' }}>
        {/* Left: Preview Card */}
        <div className="preview-section">
          <div className="phone-mockup" style={{ width: '280px', height: '580px', background: '#000', border: '12px solid #1a1a1a', borderRadius: '45px', margin: '0 auto 20px', position: 'relative', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.15)' }}>
            <div className="phone-screen" style={{ width: '100%', height: '100%', position: 'relative', background: '#111' }}>
              {step === 3 && coverPreviewUrl ? (
                <img src={coverPreviewUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Cover Preview" />
              ) : previewUrl ? (
                <video src={previewUrl} poster={coverPreviewUrl} autoPlay muted loop style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333' }}>
                  <i className="fa-solid fa-video" style={{ fontSize: '3rem' }}></i>
                </div>
              )}
              <div className="phone-overlay" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.8))', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '25px', color: '#fff', textAlign: 'right' }}>
                <div className="p-user-info" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#003F87', border: '2px solid #fff' }}></div>
                  <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>أنت@</span>
                </div>
                <div style={{ fontWeight: 800, marginBottom: '5px' }}>{formData.title || 'عنوان الفيديو يظهر هنا'}</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>{formData.description || 'الوصف سيظهر هنا...'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Steps */}
        <div className="steps-section">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="card-3d"
                style={{ background: '#fff', padding: '40px', borderRadius: '30px' }}
              >
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e293b', marginBottom: '30px' }}>الخطوة الأولى: تفاصيل الفيديو</h3>

                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontWeight: 800, marginBottom: '8px' }}>عنوان الفيديو</label>
                  <input
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    type="text"
                    placeholder="مثال: كيفية استخدام أفعال الحركة"
                    style={{ width: '100%', padding: '15px', borderRadius: '15px', border: '1px solid #eee', background: '#f8fafc', outline: 'none' }}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontWeight: 800, marginBottom: '8px' }}>الوصف</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="اشرح محتوى الفيديو لطلابك..."
                    style={{ width: '100%', padding: '15px', borderRadius: '15px', border: '1px solid #eee', background: '#f8fafc', outline: 'none', height: '120px', resize: 'none' }}
                  ></textarea>
                </div>

                <div className="form-group" style={{ marginBottom: '30px' }}>
                  <label style={{ display: 'block', fontWeight: 800, marginBottom: '8px' }}>اللغة</label>
                  <select
                    name="language"
                    value={formData.language}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '15px', borderRadius: '15px', border: '1px solid #eee', background: '#f8fafc' }}
                  >
                    <option value="Arabic">العربية</option>
                    <option value="French">الفرنسية</option>
                    <option value="English">الإنجليزية</option>
                    <option value="Tifinagh">الأمازيغية</option>
                  </select>
                </div>

                <button
                  onClick={() => formData.title ? setStep(2) : toast.error("يرجى إدخال العنوان")}
                  className="btn-3d-primary"
                  style={{ width: '100%', padding: '18px' }}
                >
                  الخطوة التالية <i className="fa-solid fa-arrow-left" style={{ marginRight: '10px' }}></i>
                </button>
              </motion.div>
            ) : step === 2 ? (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="card-3d"
                style={{ background: '#fff', padding: '40px', borderRadius: '30px', textAlign: 'center' }}
              >
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e293b', marginBottom: '30px' }}>الخطوة الثانية: رفع الملف</h3>

                <div
                  onClick={() => document.getElementById('video-input').click()}
                  style={{
                    border: '3px dashed #e2e8f0',
                    borderRadius: '25px',
                    padding: '60px 40px',
                    cursor: 'pointer',
                    background: formData.videoFile ? '#f0f9ff' : '#fff',
                    transition: 'all 0.3s',
                    marginBottom: '30px'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.borderColor = '#003F87'}
                  onMouseOut={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                >
                  <input
                    id="video-input"
                    type="file"
                    accept="video/*"
                    hidden
                    onChange={handleFileChange}
                  />
                  <div style={{ width: '70px', height: '70px', borderRadius: '20px', background: '#003F87', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 20px' }}>
                    <i className={formData.videoFile ? "fa-solid fa-check" : "fa-solid fa-cloud-arrow-up"}></i>
                  </div>
                  <h4 style={{ fontWeight: 800, marginBottom: '10px' }}>
                    {formData.videoFile ? formData.videoFile.name : 'اسحب الفيديو هنا أو اضغط للاختيار'}
                  </h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: 600 }}>MP4, MOV (الأقصى 5 ميجابايت)</p>
                </div>

                <div style={{ display: 'flex', gap: '15px' }}>
                  <button
                    onClick={() => setStep(1)}
                    className="btn-3d-secondary"
                    style={{ flex: 1, padding: '15px' }}
                  >
                    السابق
                  </button>
                  <button
                    onClick={() => formData.videoFile ? setStep(3) : toast.error("يرجى اختيار ملف فيديو")}
                    disabled={!formData.videoFile}
                    className="btn-3d-primary"
                    style={{ flex: 2, padding: '15px' }}
                  >
                    الخطوة التالية <i className="fa-solid fa-arrow-left" style={{ marginRight: '10px' }}></i>
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="card-3d"
                style={{ background: '#fff', padding: '40px', borderRadius: '30px', textAlign: 'center' }}
              >
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e293b', marginBottom: '30px' }}>الخطوة الثالثة: غلاف الفيديو</h3>
                <p style={{ color: '#64748b', fontWeight: 600, marginBottom: '25px', fontSize: '0.95rem' }}>
                  اختر صورة الغلاف التي ستظهر للطلاب كصورة مصغرة قبل بدء تشغيل الفيديو.
                </p>

                <div
                  onClick={() => document.getElementById('cover-input').click()}
                  style={{
                    border: '3px dashed #e2e8f0',
                    borderRadius: '25px',
                    padding: '60px 40px',
                    cursor: 'pointer',
                    background: formData.coverImage ? '#f0f9ff' : '#fff',
                    transition: 'all 0.3s',
                    marginBottom: '30px'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.borderColor = '#003F87'}
                  onMouseOut={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                >
                  <input
                    id="cover-input"
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleCoverChange}
                  />
                  <div style={{ width: '70px', height: '70px', borderRadius: '20px', background: '#003F87', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 20px' }}>
                    <i className={formData.coverImage ? "fa-solid fa-check" : "fa-solid fa-image"}></i>
                  </div>
                  <h4 style={{ fontWeight: 800, marginBottom: '10px' }}>
                    {formData.coverImage ? formData.coverImage.name : 'اسحب صورة الغلاف هنا أو اضغط للاختيار'}
                  </h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: 600 }}>JPG, JPEG, PNG (الأقصى 2 ميجابايت)</p>
                </div>

                {loading && (
                  <div style={{ marginBottom: '30px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontWeight: 800, fontSize: '0.9rem' }}>
                      <span style={{ color: '#003F87' }}>جاري الرفع...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${uploadProgress}%`, height: '100%', background: '#003F87', transition: 'width 0.3s' }}></div>
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '15px' }}>
                  <button
                    onClick={() => setStep(2)}
                    disabled={loading}
                    className="btn-3d-secondary"
                    style={{ flex: 1, padding: '15px' }}
                  >
                    السابق
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading || !formData.coverImage}
                    className="btn-3d-primary"
                    style={{ flex: 2, padding: '15px' }}
                  >
                    {loading ? 'جاري المعالجة...' : 'نشر الفيديو للمراجعة'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AddShortVideo;
