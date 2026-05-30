import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const WordBank = () => {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    word: "",
    translation: "",
    language: "French",
  });

  const fetchWords = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/vocabulary/teacher", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWords(res.data);
    } catch (error) {
      toast.error("فشل في جلب الكلمات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWords();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.word || !formData.translation) {
      return toast.error("يرجى إدخال الكلمة وترجمتها");
    }
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:5000/api/vocabulary", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWords([res.data, ...words]);
      setShowModal(false);
      setFormData({ word: "", translation: "", language: "French" });
      toast.success("تم إضافة الكلمة بنجاح");
    } catch (error) {
      toast.error("فشل في إضافة الكلمة");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذه الكلمة؟")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/vocabulary/${id}`, {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {words.map((w) => (
            <div key={w._id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition relative group">
              <div className="flex justify-between items-start mb-3">
                <span className={`text-xs px-2 py-1 rounded-full font-bold ${w.language === 'French' ? 'bg-blue-100 text-blue-700' :
                    w.language === 'English' ? 'bg-red-100 text-red-700' :
                      'bg-green-100 text-green-700'
                  }`}>
                  {w.language === 'French' ? 'الفرنسية' : w.language === 'English' ? 'الإنجليزية' : 'الأمازيغية'}
                </span>
                <button
                  onClick={() => handleDelete(w._id)}
                  className="text-gray-400 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                  title="حذف الكلمة"
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-1">{w.word}</h3>
              <p className="text-gray-600 font-medium">{w.translation}</p>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden" dir="rtl">
            <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
              <h2 className="text-xl font-bold">إضافة كلمة جديدة</h2>
              <button onClick={() => setShowModal(false)} className="text-blue-100 hover:text-white transition">
                <i className="fa-solid fa-times text-xl"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-gray-700 font-bold mb-2">اللغة</label>
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="French">الفرنسية</option>
                  <option value="English">الإنجليزية</option>
                  <option value="Tamazight">الأمازيغية</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2">الكلمة</label>
                <input
                  type="text"
                  name="word"
                  value={formData.word}
                  onChange={handleChange}
                  placeholder="مثال: Bonjour"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  dir="auto"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2">الترجمة</label>
                <input
                  type="text"
                  name="translation"
                  value={formData.translation}
                  onChange={handleChange}
                  placeholder="مثال: مرحباً"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  dir="auto"
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition"
                >
                  حفظ الكلمة
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-200 transition"
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
