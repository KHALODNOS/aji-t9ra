import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const WordBank = () => {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    type: "word",
    word: "",
    translation: "",
    language: "French",
  });
  const [imageFile, setImageFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchWords = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/vocabulary/teacher`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWords(res.data);
    } catch (error) {
      toast.error("فشل في جلب البيانات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWords();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "type" && value === "sentence") {
      setFormData({ ...formData, type: value, language: "Tamazight" });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.word || !formData.translation) {
      return toast.error("يرجى إدخال البيانات المطلوبة");
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const submitData = new FormData();
      submitData.append("type", formData.type);
      submitData.append("word", formData.word);
      submitData.append("translation", formData.translation);
      submitData.append("language", formData.language);
      if (imageFile) submitData.append("image", imageFile);
      if (audioFile && formData.language === "Tamazight") submitData.append("audio", audioFile);

      const res = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/vocabulary`, submitData, {
        headers: { 
          Authorization: `Bearer ${token}`
        },
      });
      setWords([res.data, ...words]);
      setShowModal(false);
      setFormData({ type: "word", word: "", translation: "", language: "French" });
      setImageFile(null);
      setAudioFile(null);
      toast.success(formData.type === "sentence" ? "تم إضافة الجملة بنجاح" : "تم إضافة الكلمة بنجاح");
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.message || "فشل في الإضافة";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذه الكلمة؟")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/vocabulary/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWords(words.filter((w) => w._id !== id));
      toast.success("تم حذف الكلمة");
    } catch (error) {
      toast.error("فشل في حذف الكلمة");
    }
  };

  return (
    <div className="word-bank-page p-6" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          <i className="fa-solid fa-book-open-reader mr-2"></i> بنك الكلمات
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition"
        >
          <i className="fa-solid fa-plus"></i> إضافة كلمة
        </button>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 py-10">جاري التحميل...</div>
      ) : words.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="text-5xl text-gray-300 mb-4"><i className="fa-solid fa-folder-open"></i></div>
          <h2 className="text-xl font-bold text-gray-600 mb-2">لا توجد كلمات بعد</h2>
          <p className="text-gray-400">قم بإضافة كلمات جديدة لإثرائها في قاموس الطلاب</p>
        </div>
      ) : (
        <div className="space-y-12">
          {words.filter(w => w.type !== 'sentence').length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <i className="fa-solid fa-font text-blue-600"></i> الكلمات
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {words.filter(w => w.type !== 'sentence').map((w) => (
                  <div key={w._id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition relative group">
                    <div className="flex justify-between items-start mb-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-bold ${w.language === 'French' ? 'bg-blue-100 text-blue-700' :
                          w.language === 'English' ? 'bg-red-100 text-red-700' :
                            w.language === 'Tamazight' ? 'bg-orange-100 text-orange-700' :
                            'bg-green-100 text-green-700'
                        }`}>
                        {w.language === 'French' ? 'الفرنسية' : w.language === 'English' ? 'الإنجليزية' : w.language === 'Tamazight' ? 'الأمازيغية' : 'العربية'}
                      </span>
                      <button
                        onClick={() => handleDelete(w._id)}
                        className="text-gray-400 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                        title="حذف الكلمة"
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                    {w.image && (
                      <div className="mb-3 h-32 w-full rounded-lg overflow-hidden border border-gray-100">
                        <img src={w.image} alt={w.word} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{w.word}</h3>
                    <p className="text-gray-600 font-medium">{w.translation}</p>
                    {w.audio && (
                      <div className="mt-3">
                        <audio controls src={w.audio} className="w-full h-8" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {words.filter(w => w.type === 'sentence').length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <i className="fa-solid fa-comment-dots text-orange-600"></i> الجمل الأمازيغية
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {words.filter(w => w.type === 'sentence').map((w) => (
                  <div key={w._id} className="bg-orange-50/50 rounded-2xl p-6 shadow-sm border border-orange-200 hover:shadow-md transition relative group flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-xs px-3 py-1 rounded-full font-bold shadow-sm bg-orange-100 text-orange-800 border border-orange-200">
                        جملة أمازيغية
                      </span>
                      <button
                        onClick={() => handleDelete(w._id)}
                        className="text-orange-400 hover:text-red-600 transition opacity-0 group-hover:opacity-100"
                        title="حذف الجملة"
                      >
                        <i className="fa-solid fa-trash text-lg"></i>
                      </button>
                    </div>

                    <div className="my-4">
                      <h3 className="text-2xl font-bold text-gray-800 mb-3" dir="auto">"{w.word}"</h3>
                      <div className="h-1 w-12 bg-orange-300 rounded-full mb-3"></div>
                      <p className="text-lg font-medium text-orange-800">{w.translation}</p>
                    </div>

                    {w.audio && (
                      <div className="mt-4 pt-4 border-t border-orange-200/60">
                        <audio controls src={w.audio} className="w-full h-10 rounded-full bg-orange-100" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden" dir="rtl">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-5 text-white flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <i className="fa-solid fa-plus-circle"></i>
                إضافة كلمة جديدة
              </h2>
              <button onClick={() => setShowModal(false)} className="text-blue-100 hover:text-white transition bg-white/10 hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center">
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              
              <div className="flex gap-4 mb-4">
                <label className={`flex-1 text-center py-2 px-4 rounded-xl cursor-pointer font-bold transition ${formData.type === 'word' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  <input type="radio" name="type" value="word" checked={formData.type === 'word'} onChange={handleChange} className="hidden" />
                  <i className="fa-solid fa-font mr-2"></i> كلمة
                </label>
                <label className={`flex-1 text-center py-2 px-4 rounded-xl cursor-pointer font-bold transition ${formData.type === 'sentence' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  <input type="radio" name="type" value="sentence" checked={formData.type === 'sentence'} onChange={handleChange} className="hidden" />
                  <i className="fa-solid fa-comment-dots mr-2"></i> جملة (أمازيغية)
                </label>
              </div>

              {formData.type === 'word' && (
                <div>
                  <label className="block text-gray-700 font-bold mb-2">
                    <i className="fa-solid fa-globe mr-1 text-blue-500"></i> لغة الكلمة
                  </label>
                  <select
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    className="w-full border border-gray-200 bg-gray-50 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition outline-none"
                  >
                    <option value="French">الفرنسية</option>
                    <option value="English">الإنجليزية</option>
                    <option value="Tamazight">الأمازيغية</option>
                  </select>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-bold mb-2">
                    <i className="fa-solid fa-pen mr-1 text-blue-500"></i> {formData.type === 'sentence' ? 'الجملة' : 'الكلمة'}
                  </label>
                  <input
                    type="text"
                    name="word"
                    value={formData.word}
                    onChange={handleChange}
                    placeholder={formData.type === 'sentence' ? 'اكتب الجملة هنا' : 'الكلمة'}
                    className="w-full border border-gray-200 bg-gray-50 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition outline-none"
                    dir="auto"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-2">
                    <i className="fa-solid fa-language mr-1 text-blue-500"></i> 
                    {formData.language === 'Tamazight' ? 'الشرح (بالعربية)' : 'الترجمة'}
                  </label>
                  <input
                    type="text"
                    name="translation"
                    value={formData.translation}
                    onChange={handleChange}
                    placeholder={formData.language === 'Tamazight' ? 'الشرح أو الترجمة' : 'الترجمة'}
                    className="w-full border border-gray-200 bg-gray-50 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition outline-none"
                    dir="auto"
                  />
                </div>
              </div>

              {formData.type === 'word' && (
                <div>
                  <label className="block text-gray-700 font-bold mb-2">
                    <i className="fa-solid fa-image mr-1 text-blue-500"></i> صورة للكلمة <span className="text-sm font-normal text-gray-400">(اختياري)</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition cursor-pointer"
                  />
                </div>
              )}

              {formData.language === "Tamazight" && (
                <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl">
                  <label className="block text-orange-800 font-bold mb-2">
                    <i className="fa-solid fa-microphone mr-1 text-orange-500"></i> {formData.type === 'sentence' ? 'ملف صوتي للجملة الأمازيغية' : 'ملف صوتي للكلمة الأمازيغية'} <span className="text-sm font-normal text-orange-600/70">(اختياري)</span>
                  </label>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={(e) => setAudioFile(e.target.files[0])}
                    className="w-full text-sm text-orange-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-100 file:text-orange-700 hover:file:bg-orange-200 transition cursor-pointer"
                  />
                </div>
              )}

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className={`flex-1 ${formData.type === 'sentence' ? 'bg-orange-600 hover:bg-orange-700 shadow-orange-200' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'} text-white font-bold py-3 rounded-xl transition shadow-lg flex items-center justify-center gap-2`}
                >
                  {submitting ? (
                    <><i className="fa-solid fa-spinner fa-spin"></i> جاري الحفظ...</>
                  ) : (
                    <><i className="fa-solid fa-check"></i> حفظ {formData.type === 'sentence' ? 'الجملة' : 'الكلمة'}</>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={submitting}
                  className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WordBank;
