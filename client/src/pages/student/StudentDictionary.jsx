import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const StudentDictionary = () => {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const fetchWords = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/vocabulary/student", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWords(res.data);
    } catch (error) {
      toast.error("فشل في جلب القاموس");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWords();
  }, []);

  const handleVocabClick = (w) => {
    if (!w.word) return;
    
    if (w.language === "Tamazight" && w.audio) {
      const audio = new Audio(w.audio);
      audio.play();
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(w.word);

    if (w.language === "French") utterance.lang = 'fr-FR';
    else if (w.language === "English") utterance.lang = 'en-US';
    else if (w.language === "Tamazight") utterance.lang = 'ar-SA'; // fallback if no audio

    window.speechSynthesis.speak(utterance);
  };

  const filteredWords = words.filter((w) => {
    if (filter !== "All" && w.language !== filter) return false;
    if (search && !w.word.toLowerCase().includes(search.toLowerCase()) && !w.translation.includes(search)) return false;
    return true;
  });

  return (
    <div className="student-dictionary-page p-6 min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            <i className="fa-solid fa-book-journal-whills text-blue-600 ml-3"></i>قاموسي الذكي
          </h1>
          <p className="text-gray-600 text-lg">اكتشف وتعلم الكلمات الجديدة التي أضافها أساتذتك</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="w-full md:w-1/2 relative">
            <i className="fa-solid fa-search absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              type="text"
              placeholder="ابحث عن كلمة أو ترجمة..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pr-12 pl-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {["All", "French", "English", "Tamazight"].map((lang) => (
              <button
                key={lang}
                onClick={() => setFilter(lang)}
                className={`px-6 py-2.5 rounded-xl font-bold whitespace-nowrap transition ${filter === lang
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
              >
                {lang === "All" ? "الكل" : lang === "French" ? "الفرنسية" : lang === "English" ? "الإنجليزية" : "الأمازيغية"}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          </div>
        ) : filteredWords.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="text-6xl text-gray-200 mb-6"><i className="fa-solid fa-face-frown-open"></i></div>
            <h2 className="text-2xl font-bold text-gray-600 mb-2">لا توجد كلمات مطابقة</h2>
            <p className="text-gray-400">جرب البحث بكلمة أخرى أو تغيير فلتر اللغة</p>
          </div>
        ) : (
          <div className="space-y-12">
            {filteredWords.filter(w => w.type !== 'sentence').length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <i className="fa-solid fa-font text-blue-600"></i> الكلمات
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredWords.filter(w => w.type !== 'sentence').map((w) => (
                    <div
                      key={w._id}
                      onClick={() => handleVocabClick(w)}
                      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group relative overflow-hidden"
                    >
                      <div className={`absolute top-0 right-0 w-16 h-16 transform translate-x-8 -translate-y-8 rounded-full ${w.language === 'French' ? 'bg-blue-100' :
                          w.language === 'English' ? 'bg-red-100' :
                          w.language === 'Tamazight' ? 'bg-orange-100' :
                            'bg-green-100'
                        } group-hover:scale-150 transition-transform duration-500`}></div>

                      <div className="relative z-10 flex flex-col h-full">
                        <div className="flex justify-between items-start mb-4">
                          <span className={`text-xs px-3 py-1 rounded-full font-bold shadow-sm ${w.language === 'French' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                              w.language === 'English' ? 'bg-red-50 text-red-700 border border-red-200' :
                              w.language === 'Tamazight' ? 'bg-orange-50 text-orange-700 border border-orange-200' :
                                'bg-green-50 text-green-700 border border-green-200'
                            }`}>
                            {w.language === 'French' ? 'الفرنسية' : w.language === 'English' ? 'الإنجليزية' : 'الأمازيغية'}
                          </span>
                          <button className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-sm">
                            <i className="fa-solid fa-volume-high"></i>
                          </button>
                        </div>

                        {w.image && (
                          <div className="mb-4 h-32 w-full rounded-xl overflow-hidden border border-gray-100">
                            <img src={w.image} alt={w.word} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          </div>
                        )}

                        <h3 className="text-2xl font-bold text-gray-800 mb-2 mt-auto" dir="auto">{w.word}</h3>
                        <div className="h-px w-full bg-gray-100 my-3 group-hover:bg-blue-100 transition-colors"></div>
                        <p className="text-lg font-medium text-blue-700">{w.translation}</p>

                        {w.teacherId && w.teacherId.name && (
                          <p className="text-xs text-gray-400 mt-4 flex items-center gap-1">
                            <i className="fa-solid fa-chalkboard-user"></i>
                            إضافة: الأستاذ {w.teacherId.name}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {filteredWords.filter(w => w.type === 'sentence').length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <i className="fa-solid fa-comment-dots text-orange-600"></i> الجمل الأمازيغية
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredWords.filter(w => w.type === 'sentence').map((w) => (
                    <div
                      key={w._id}
                      onClick={() => handleVocabClick(w)}
                      className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-2xl p-6 shadow-sm border border-orange-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group relative overflow-hidden flex flex-col justify-between"
                    >
                      <div className="absolute top-0 left-0 w-32 h-32 bg-orange-200/50 rounded-full blur-3xl -translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-700"></div>
                      
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                          <span className="text-xs px-3 py-1 rounded-full font-bold shadow-sm bg-orange-100 text-orange-800 border border-orange-300">
                            جملة أمازيغية
                          </span>
                          <button className="w-12 h-12 rounded-full bg-orange-200 text-orange-700 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors shadow-sm">
                            <i className="fa-solid fa-volume-high text-lg"></i>
                          </button>
                        </div>

                        <div className="my-6">
                          <h3 className="text-3xl font-bold text-gray-800 mb-4 leading-snug" dir="auto">"{w.word}"</h3>
                          <div className="h-1 w-16 bg-orange-300 rounded-full mb-4"></div>
                          <p className="text-xl font-medium text-orange-800 leading-relaxed">{w.translation}</p>
                        </div>
                      </div>

                      {w.teacherId && w.teacherId.name && (
                        <div className="relative z-10 pt-4 border-t border-orange-200/60 mt-4">
                          <p className="text-sm text-orange-700/70 flex items-center gap-2 font-medium">
                            <i className="fa-solid fa-chalkboard-user"></i>
                            إضافة الأستاذ: {w.teacherId.name}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDictionary;
