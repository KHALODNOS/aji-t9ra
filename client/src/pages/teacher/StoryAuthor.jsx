import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { 
  BookOpen, 
  Type, 
  Image as ImageIcon, 
  Mic, 
  Languages, 
  Plus, 
  Trash2, 
  ChevronRight, 
  ChevronLeft,
  CheckCircle,
  Loader2,
  AlertCircle
} from "lucide-react";

const StoryAuthor = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    language: "Arabic",
    level: "المستوى الأول",
    content: "",
    vocabulary: []
  });

  const [files, setFiles] = useState({
    coverImage: null,
    audioFile: null
  });

  const [previews, setPreviews] = useState({
    coverImage: null
  });

  const [currentVocab, setCurrentVocab] = useState({ word: "", translation: "" });

  const coverInputRef = useRef(null);
  const audioInputRef = useRef(null);

  const steps = [
    { id: 1, title: "المعلومات الأساسية", icon: <BookOpen className="w-5 h-5" /> },
    { id: 2, title: "نص القصة", icon: <Type className="w-5 h-5" /> },
    { id: 3, title: "الوسائط", icon: <ImageIcon className="w-5 h-5" /> },
    { id: 4, title: "المفردات", icon: <Languages className="w-5 h-5" /> }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    if (selectedFiles[0]) {
      setFiles(prev => ({ ...prev, [name]: selectedFiles[0] }));
      
      if (name === "coverImage") {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviews(prev => ({ ...prev, coverImage: reader.result }));
        };
        reader.readAsDataURL(selectedFiles[0]);
      }
      
      toast.success(`تم اختيار ${name === 'coverImage' ? 'الصورة' : 'الملف الصوتي'} بنجاح`);
    }
  };

  const addVocab = () => {
    if (!currentVocab.word || !currentVocab.translation) {
      toast.error("يرجى إدخال الكلمة وترجمتها");
      return;
    }
    setFormData(prev => ({
      ...prev,
      vocabulary: [...prev.vocabulary, { ...currentVocab }]
    }));
    setCurrentVocab({ word: "", translation: "" });
    toast.success("تمت إضافة الكلمة");
  };

  const removeVocab = (index) => {
    setFormData(prev => ({
      ...prev,
      vocabulary: prev.vocabulary.filter((_, i) => i !== index)
    }));
  };

  const nextStep = () => {
    if (step === 1 && !formData.title) return toast.error("يرجى إدخال عنوان القصة");
    if (step === 2 && !formData.content) return toast.error("يرجى كتابة محتوى القصة");
    if (step === 3 && !files.coverImage) return toast.error("يرجى اختيار صورة الغلاف");
    
    setStep(prev => Math.min(prev + 1, 4));
  };

  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');

    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('language', formData.language);
    submitData.append('level', formData.level);
    submitData.append('content', formData.content);
    submitData.append('vocabulary', JSON.stringify(formData.vocabulary));
    
    if (files.coverImage) submitData.append('coverImage', files.coverImage);
    if (files.audioFile) submitData.append('audioFile', files.audioFile);

    try {
      const response = await axios.post("http://localhost:5000/api/stories", submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      toast.success("تم إرسال القصة بنجاح للمراجعة!");
      // Reset form or redirect
      setStep(1);
      setFormData({
        title: "",
        language: "Arabic",
        level: "المستوى الأول",
        content: "",
        vocabulary: []
      });
      setFiles({ coverImage: null, audioFile: null });
      setPreviews({ coverImage: null });
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "حدث خطأ أثناء حفظ القصة");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="author-container p-4 md:p-8" dir="rtl">
      <Toaster position="top-center" reverseOrder={false} />
      
      {/* Stepper */}
      <div className="max-w-4xl mx-auto mb-12">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 z-0"></div>
          {steps.map((s) => (
            <div key={s.id} className="relative z-10 flex flex-col items-center">
              <div 
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border-4 ${
                  step >= s.id 
                  ? 'bg-[#5DA296] border-[#5DA296] text-white shadow-lg shadow-[#5DA296]/30' 
                  : 'bg-white border-gray-200 text-gray-400'
                }`}
              >
                {step > s.id ? <CheckCircle className="w-6 h-6" /> : s.icon}
              </div>
              <span className={`mt-3 text-sm font-bold ${step >= s.id ? 'text-[#5DA296]' : 'text-gray-400'}`}>
                {s.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100"
              >
                <h3 className="text-2xl font-black text-[#5DA296] mb-6 flex items-center gap-3">
                  <BookOpen className="w-7 h-7" />
                  المعلومات الأساسية
                </h3>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">عنوان القصة</label>
                    <input 
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="أدخل عنواناً جذاباً..."
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 focus:ring-2 focus:ring-[#5DA296]/20 outline-none transition-all font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">اللغة</label>
                      <select 
                        name="language"
                        value={formData.language}
                        onChange={handleInputChange}
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 focus:ring-2 focus:ring-[#5DA296]/20 outline-none font-bold"
                      >
                        <option value="Arabic">العربية</option>
                        <option value="French">الفرنسية</option>
                        <option value="English">الإنجليزية</option>
                        <option value="Tifinagh">الأمازيغية (تيفيناغ)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">المستوى التعليمي</label>
                      <select 
                        name="level"
                        value={formData.level}
                        onChange={handleInputChange}
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 focus:ring-2 focus:ring-[#5DA296]/20 outline-none font-bold"
                      >
                        <option>المستوى الأول</option>
                        <option>المستوى الثاني</option>
                        <option>المستوى الثالث</option>
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100"
              >
                <h3 className="text-2xl font-black text-[#5DA296] mb-6 flex items-center gap-3">
                  <Type className="w-7 h-7" />
                  محتوى القصة
                </h3>
                
                <div className="space-y-4">
                  <div className="bg-amber-50 text-amber-800 p-4 rounded-2xl flex items-start gap-3 text-sm font-bold border border-amber-100">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <p>اكتب القصة بوضوح. يمكنك استخدام حروف التيفيناغ إذا اخترت اللغة الأمازيغية.</p>
                  </div>
                  <textarea 
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    placeholder="ابدأ بكتابة قصتك هنا..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-6 min-h-[400px] focus:ring-2 focus:ring-[#5DA296]/20 outline-none transition-all font-bold leading-relaxed resize-none"
                  />
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100"
              >
                <h3 className="text-2xl font-black text-[#5DA296] mb-6 flex items-center gap-3">
                  <ImageIcon className="w-7 h-7" />
                  الوسائط المتعددة
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Image Upload */}
                  <div className="space-y-4">
                    <label className="text-sm font-bold text-gray-700">صورة الغلاف (إلزامي)</label>
                    <div 
                      onClick={() => coverInputRef.current.click()}
                      className="aspect-[4/3] border-4 border-dashed border-gray-100 rounded-3xl flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-gray-50 transition-all overflow-hidden relative group"
                    >
                      {previews.coverImage ? (
                        <>
                          <img src={previews.coverImage} className="w-full h-full object-cover" alt="Cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold">
                            تغيير الصورة
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-16 h-16 bg-[#5DA296]/10 rounded-2xl flex items-center justify-center text-[#5DA296]">
                            <Plus className="w-8 h-8" />
                          </div>
                          <span className="text-gray-400 font-bold">رفع صورة الغلاف</span>
                        </>
                      )}
                    </div>
                    <input 
                      type="file" 
                      ref={coverInputRef} 
                      className="hidden" 
                      accept="image/*"
                      name="coverImage"
                      onChange={handleFileChange}
                    />
                  </div>

                  {/* Audio Upload */}
                  <div className="space-y-4">
                    <label className="text-sm font-bold text-gray-700">الملف الصوتي (اختياري)</label>
                    <div 
                      onClick={() => audioInputRef.current.click()}
                      className="aspect-[4/3] border-4 border-dashed border-gray-100 rounded-3xl flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-gray-50 transition-all overflow-hidden"
                    >
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${files.audioFile ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                        {files.audioFile ? <CheckCircle className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                      </div>
                      <span className={`${files.audioFile ? 'text-green-600' : 'text-gray-400'} font-bold`}>
                        {files.audioFile ? files.audioFile.name : 'رفع ملف MP3'}
                      </span>
                    </div>
                    <input 
                      type="file" 
                      ref={audioInputRef} 
                      className="hidden" 
                      accept="audio/*"
                      name="audioFile"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100"
              >
                <h3 className="text-2xl font-black text-[#5DA296] mb-6 flex items-center gap-3">
                  <Languages className="w-7 h-7" />
                  الكلمات الصعبة والترجمة
                </h3>
                
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">الكلمة باللغة الأصلية</label>
                      <input 
                        type="text"
                        value={currentVocab.word}
                        onChange={(e) => setCurrentVocab({...currentVocab, word: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 focus:ring-2 focus:ring-[#5DA296]/20 outline-none font-bold"
                        placeholder="مثال: الحضارة"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">الترجمة بالعربية</label>
                      <div className="flex gap-2">
                        <input 
                          type="text"
                          value={currentVocab.translation}
                          onChange={(e) => setCurrentVocab({...currentVocab, translation: e.target.value})}
                          className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 focus:ring-2 focus:ring-[#5DA296]/20 outline-none font-bold"
                          placeholder="الترجمة..."
                        />
                        <button 
                          onClick={addVocab}
                          className="bg-[#5DA296] text-white w-14 rounded-2xl flex items-center justify-center hover:bg-[#4a857b] transition-all shadow-lg shadow-[#5DA296]/20"
                        >
                          <Plus className="w-6 h-6" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-lg font-bold text-gray-700">قائمة الكلمات ({formData.vocabulary.length})</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {formData.vocabulary.map((v, i) => (
                        <div key={i} className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl border border-gray-100 group">
                          <div>
                            <span className="font-black text-[#5DA296] ml-2">{v.word}</span>
                            <span className="text-gray-400">←</span>
                            <span className="font-bold mr-2 text-gray-700">{v.translation}</span>
                          </div>
                          <button 
                            onClick={() => removeVocab(i)}
                            className="text-gray-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                      {formData.vocabulary.length === 0 && (
                        <div className="col-span-full py-12 text-center text-gray-400 font-bold border-2 border-dashed border-gray-100 rounded-3xl">
                          لا توجد كلمات مضافة بعد
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6">
            <button 
              onClick={prevStep}
              disabled={step === 1 || loading}
              className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-bold transition-all ${
                step === 1 
                ? 'opacity-0 pointer-events-none' 
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
              السابق
            </button>

            {step < 4 ? (
              <button 
                onClick={nextStep}
                className="flex items-center gap-2 px-8 py-4 bg-[#5DA296] text-white rounded-2xl font-bold hover:bg-[#4a857b] transition-all shadow-lg shadow-[#5DA296]/20"
              >
                التالي
                <ChevronLeft className="w-5 h-5" />
              </button>
            ) : (
              <button 
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 px-12 py-4 bg-[#5DA296] text-white rounded-2xl font-bold hover:bg-[#4a857b] transition-all shadow-xl shadow-[#5DA296]/30 disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    جاري الإرسال...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    إرسال القصة للمراجعة
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Sidebar Preview */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 sticky top-8">
            <div className="relative aspect-[4/3]">
              <img 
                src={previews.coverImage || "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800"} 
                className="w-full h-full object-cover" 
                alt="Story Preview" 
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-4 py-2 rounded-xl text-xs font-black text-[#5DA296] shadow-sm">
                {formData.level}
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <h4 className="text-xl font-black text-gray-900 mb-1">
                  {formData.title || "عنوان القصة يظهر هنا"}
                </h4>
                <div className="flex items-center gap-2 text-sm text-[#5DA296] font-bold">
                  <Languages className="w-4 h-4" />
                  {formData.language}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-50">
                <p className="text-gray-500 text-sm font-medium line-clamp-3 leading-relaxed">
                  {formData.content || "محتوى القصة سيظهر هنا للمراجعة قبل النشر..."}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#5DA296]/10 flex items-center justify-center text-[#5DA296]">
                    <Languages className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-gray-500">{formData.vocabulary.length} كلمات صعبة</span>
                </div>
                {files.audioFile && (
                  <div className="flex items-center gap-2 text-[#5DA296]">
                    <Mic className="w-4 h-4" />
                    <span className="text-xs font-bold">ملف صوتي مرفق</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-[#5DA296]/5 p-6 rounded-3xl border border-[#5DA296]/10">
            <h5 className="font-bold text-[#5DA296] mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              ملاحظة للأستاذ
            </h5>
            <p className="text-sm text-gray-600 font-medium leading-relaxed">
              سيتم مراجعة القصة من قبل المشرفين للتأكد من جودة المحتوى واللغة قبل أن تظهر لجميع الطلاب في المنصة.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryAuthor;
