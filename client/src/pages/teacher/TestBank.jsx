import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import api from "../../services/api";
import { 
  Plus, 
  Trash2, 
  Eye, 
  BookOpen, 
  Award, 
  CheckCircle, 
  Clock, 
  X, 
  HelpCircle, 
  Layers, 
  ListChecks, 
  Languages, 
  Sparkles, 
  AlertCircle, 
  Search,
  Filter,
  Check,
  BookOpenCheck,
  FileQuestion,
  RefreshCw,
  PlusCircle,
  Info,
  CheckSquare,
  FileEdit,
  GraduationCap,
  ChevronRight,
  Send,
  HelpCircle as QuestionIcon
} from "lucide-react";

const TestBank = () => {
  // --- STATE ---
  const [quizzes, setQuizzes] = useState([]);
  const [dbStories, setDbStories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevelFilter, setSelectedLevelFilter] = useState("all");
  const [selectedStoryFilter, setSelectedStoryFilter] = useState("all");

  // Modals management
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isQuestionsModalOpen, setIsQuestionsModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState(null);

  // New Quiz form state
  const [newQuizData, setNewQuizData] = useState({
    name: "",
    storyId: "",
    level: "مبتدئ",
    xpReward: 150
  });

  // Question Builder state (Inside Questions Modal)
  const [activeQuestionTab, setActiveQuestionTab] = useState("choice"); // choice, translate, fill_blanks, correct_form
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newQuestionOptions, setNewQuestionOptions] = useState(["", "", "", ""]);
  const [newQuestionCorrectIndex, setNewQuestionCorrectIndex] = useState(0);
  const [newQuestionCorrectTranslation, setNewQuestionCorrectTranslation] = useState("");
  const [newQuestionCorrectBlank, setNewQuestionCorrectBlank] = useState("");
  const [newQuestionCorrectFormOptions, setNewQuestionCorrectFormOptions] = useState(["", "", ""]);
  const [newQuestionCorrectFormIndex, setNewQuestionCorrectFormIndex] = useState(0);

  // --- ACTIONS & API INTEGRATION ---

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [quizzesRes, storiesRes] = await Promise.all([
        api.get("/exams"),
        api.get("/exams/stories")
      ]);
      
      const formattedQuizzes = quizzesRes.data.map(q => ({
        id: q._id,
        name: q.title,
        storyId: q.storyId?._id || q.storyId,
        level: q.level || "مبتدئ",
        xpReward: q.xpReward || 150,
        status: q.status || "draft",
        questions: (q.questions || []).map((qu, index) => ({
          id: qu._id || `qu-${index}-${Date.now()}`,
          type: qu.type,
          text: qu.text,
          options: qu.options || [],
          correctAnswer: qu.correctAnswer
        }))
      }));
      
      setQuizzes(formattedQuizzes);
      setDbStories(storiesRes.data || []);
      
      if (storiesRes.data && storiesRes.data.length > 0) {
        setNewQuizData(prev => ({ ...prev, storyId: storiesRes.data[0]._id }));
      }
    } catch (error) {
      console.error("فشل جلب البيانات الأساسية:", error);
      toast.error("حدث خطأ أثناء تحميل الاختبارات أو القصص");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  // Create new empty quiz on server
  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    if (!newQuizData.name.trim()) {
      toast.error("يرجى إدخال اسم الاختبار");
      return;
    }

    try {
      const payload = {
        title: newQuizData.name,
        storyId: newQuizData.storyId || null,
        level: newQuizData.level,
        xpReward: Number(newQuizData.xpReward),
        questions: []
      };
      
      const response = await api.post("/exams", payload);
      const createdExam = response.data.exam;
      
      const formatted = {
        id: createdExam._id,
        name: createdExam.title,
        storyId: createdExam.storyId?._id || createdExam.storyId,
        level: createdExam.level || "مبتدئ",
        xpReward: createdExam.xpReward || 150,
        status: createdExam.status || "draft",
        questions: []
      };

      setQuizzes([formatted, ...quizzes]);
      setIsCreateModalOpen(false);
      setNewQuizData({ name: "", storyId: dbStories[0]?._id || "", level: "مبتدئ", xpReward: 150 });
      toast.success("تم إنشاء مسودة الاختبار! يمكنك الآن إضافة الأسئلة.");
      
      // Automatically open the questions builder for the newly created quiz
      setActiveQuiz(formatted);
      setIsQuestionsModalOpen(true);
    } catch (error) {
      console.error("Error creating quiz:", error);
      toast.error("فشل إنشاء الاختبار في قاعدة البيانات");
    }
  };

  // Add question to active quiz in state
  const handleAddQuestion = () => {
    if (!newQuestionText.trim()) {
      toast.error("يرجى إدخال نص السؤال");
      return;
    }

    let questionData = {
      id: `qu-${Date.now()}`
    };

    if (activeQuestionTab === "choice") {
      // Validate options
      if (newQuestionOptions.some(opt => !opt.trim())) {
        toast.error("يرجى تعبئة كافة خيارات الإجابة");
        return;
      }
      questionData = {
        ...questionData,
        type: "choice",
        text: newQuestionText,
        options: [...newQuestionOptions],
        correctAnswer: newQuestionOptions[newQuestionCorrectIndex]
      };
    } else if (activeQuestionTab === "translate") {
      if (!newQuestionCorrectTranslation.trim()) {
        toast.error("يرجى إدخال الترجمة الصحيحة المقترحة");
        return;
      }
      questionData = {
        ...questionData,
        type: "translate",
        text: newQuestionText,
        correctAnswer: newQuestionCorrectTranslation.trim()
      };
    } else if (activeQuestionTab === "fill_blanks") {
      if (!newQuestionText.includes("[blank]")) {
        toast.error("يرجى كتابة الكلمة [blank] في المكان المراد تعبئته في السؤال");
        return;
      }
      if (!newQuestionCorrectBlank.trim()) {
        toast.error("يرجى إدخال الكلمة الصحيحة لملء الفراغ");
        return;
      }
      questionData = {
        ...questionData,
        type: "fill_blanks",
        text: newQuestionText,
        correctAnswer: newQuestionCorrectBlank.trim()
      };
    } else if (activeQuestionTab === "correct_form") {
      if (!newQuestionText.includes("[blank]")) {
        toast.error("يرجى كتابة الكلمة [blank] في المكان المراد تصحيحه في السؤال");
        return;
      }
      if (newQuestionCorrectFormOptions.some(opt => !opt.trim())) {
        toast.error("يرجى ملء جميع صيغ الكلمات");
        return;
      }
      questionData = {
        ...questionData,
        type: "correct_form",
        text: newQuestionText,
        options: [...newQuestionCorrectFormOptions],
        correctAnswer: newQuestionCorrectFormOptions[newQuestionCorrectFormIndex]
      };
    }

    // Add to active quiz
    const updatedQuizzes = quizzes.map(q => {
      if (q.id === activeQuiz.id) {
        const updatedQs = [...q.questions, questionData];
        // Keep activeQuiz in sync
        setActiveQuiz(prev => ({ ...prev, questions: updatedQs }));
        return { ...q, questions: updatedQs };
      }
      return q;
    });

    setQuizzes(updatedQuizzes);
    toast.success("تمت إضافة السؤال بنجاح!");

    // Reset question inputs
    setNewQuestionText("");
    setNewQuestionOptions(["", "", "", ""]);
    setNewQuestionCorrectIndex(0);
    setNewQuestionCorrectTranslation("");
    setNewQuestionCorrectBlank("");
    setNewQuestionCorrectFormOptions(["", "", ""]);
    setNewQuestionCorrectFormIndex(0);
  };

  // Delete question from active quiz in builder
  const handleDeleteQuestion = (questionId) => {
    const updatedQuizzes = quizzes.map(q => {
      if (q.id === activeQuiz.id) {
        const filteredQs = q.questions.filter(qu => qu.id !== questionId);
        setActiveQuiz(prev => ({ ...prev, questions: filteredQs }));
        return { ...q, questions: filteredQs };
      }
      return q;
    });
    setQuizzes(updatedQuizzes);
    toast.success("تم حذف السؤال.");
  };

  // Submit quiz for Admin Review (Sets status to pending)
  const handleSubmitForReview = async (quizId) => {
    try {
      const quiz = quizzes.find(q => q.id === quizId);
      if (!quiz) return;

      if (quiz.questions.length === 0) {
        toast.error("لا يمكن إرسال اختبار فارغ للمراجعة، يرجى إضافة أسئلة أولاً");
        return;
      }

      // First save all current questions to the DB as draft/updates
      const cleanQuestions = quiz.questions.map(qu => ({
        type: qu.type,
        text: qu.text,
        options: qu.options || [],
        correctAnswer: qu.correctAnswer
      }));

      await api.put(`/exams/${quizId}`, {
        questions: cleanQuestions
      });

      // Then submit for review
      await api.put(`/exams/${quizId}/submit`);

      setQuizzes(prev => prev.map(q => {
        if (q.id === quizId) {
          return { ...q, status: "pending" };
        }
        return q;
      }));

      setIsQuestionsModalOpen(false);
      toast.success("تم إرسال الاختبار بنجاح! هو الآن بانتظار موافقة الإدارة.");
    } catch (error) {
      console.error("Error submitting for review:", error);
      toast.error(error.response?.data?.message || "حدث خطأ أثناء إرسال الاختبار للمراجعة");
    }
  };

  // Save quiz as draft
  const handleSaveAsDraft = async (quizId) => {
    try {
      const quiz = quizzes.find(q => q.id === quizId);
      if (!quiz) return;

      const cleanQuestions = quiz.questions.map(qu => ({
        type: qu.type,
        text: qu.text,
        options: qu.options || [],
        correctAnswer: qu.correctAnswer
      }));

      await api.put(`/exams/${quizId}`, {
        questions: cleanQuestions,
        status: "draft"
      });

      setQuizzes(prev => prev.map(q => {
        if (q.id === quizId) {
          return { ...q, status: "draft" };
        }
        return q;
      }));

      setIsQuestionsModalOpen(false);
      toast.success("تم حفظ التعديلات كمسودة بنجاح.");
    } catch (error) {
      console.error("Error saving draft:", error);
      toast.error("حدث خطأ أثناء حفظ المسودة");
    }
  };

  // Delete entire quiz
  const handleDeleteQuiz = async (quizId) => {
    if (window.confirm("هل أنت متأكد من حذف هذا الاختبار بالكامل؟")) {
      try {
        await api.delete(`/exams/${quizId}`);
        setQuizzes(prev => prev.filter(q => q.id !== quizId));
        toast.success("تم حذف الاختبار بنجاح.");
      } catch (error) {
        console.error("Error deleting quiz:", error);
        toast.error("فشل حذف الاختبار من قاعدة البيانات");
      }
    }
  };

  // --- FILTERED QUIZZES ---
  const filteredQuizzes = quizzes.filter(q => {
    const matchesSearch = q.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = selectedLevelFilter === "all" || q.level === selectedLevelFilter;
    const quizStoryId = q.storyId?._id || q.storyId;
    const matchesStory = selectedStoryFilter === "all" || quizStoryId === selectedStoryFilter;
    return matchesSearch && matchesLevel && matchesStory;
  });

  // Stats calculations
  const totalQuizzes = quizzes.length;
  const pendingQuizzes = quizzes.filter(q => q.status === "pending").length;
  const approvedQuizzes = quizzes.filter(q => q.status === "approved").length;
  const totalXP = quizzes.reduce((sum, q) => sum + (q.status === "approved" ? q.xpReward : 0), 0);

  if (loading) {
    return (
      <div className="content-area min-h-screen bg-[#f8fafc] flex items-center justify-center p-4" dir="rtl">
        <div className="text-center space-y-4">
          <RefreshCw className="w-12 h-12 text-[#003F87] animate-spin mx-auto" />
          <p className="text-slate-500 font-black text-sm">جاري تحميل اختبارات وقصص المنصة من قاعدة البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="content-area min-h-screen bg-[#f8fafc] p-4 md:p-8" dir="rtl">
      <Toaster position="top-center" reverseOrder={false} />

      {/* --- DASHBOARD HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <span className="text-[10px] font-black text-[#003F87] bg-[#003F87]/10 px-4 py-1.5 rounded-full uppercase tracking-wider mb-2.5 inline-block">
            بوابة المعلم المتميزة
          </span>
          <h1 className="text-4xl font-black text-[#003F87] flex items-center gap-3">
            <BookOpenCheck className="w-10 h-10 text-[#003F87]" />
            بنك الاختبارات والتقييمات التفاعلية
          </h1>
          <p className="text-slate-500 font-bold mt-2 text-sm leading-relaxed max-w-3xl">
            أنشئ اختبارات ذكية ومخصصة للقصص باستخدام منشئ الأسئلة المتعدد الأنماط. أرسل أعمالك للمراجعة ليتم اعتمادها ونشرها مباشرة للطلاب.
          </p>
        </div>
        
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="w-full md:w-auto flex items-center justify-center gap-2.5 bg-[#003F87] text-white px-8 py-5 rounded-[2rem] font-black hover:bg-[#002d61] transition-all shadow-xl shadow-[#003F87]/20 transform hover:-translate-y-0.5"
          style={{ border: 'none', cursor: 'pointer' }}
        >
          <Plus className="w-5 h-5 text-white" />
          إنشاء اختبار تفاعلي جديد
        </button>
      </div>

      {/* --- STATISTICS CARDS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center justify-between shadow-sm"
        >
          <div>
            <span className="text-slate-400 font-bold text-xs block mb-1">إجمالي التقييمات</span>
            <span className="text-3xl font-black text-slate-800">{totalQuizzes}</span>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-blue-50/70 flex items-center justify-center text-[#003F87]">
            <Layers className="w-7 h-7" />
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center justify-between shadow-sm relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-2 h-full bg-amber-500"></div>
          <div>
            <span className="text-slate-400 font-bold text-xs block mb-1">بانتظار موافقة الإدارة</span>
            <span className="text-3xl font-black text-amber-600">{pendingQuizzes}</span>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Clock className="w-7 h-7" />
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center justify-between shadow-sm relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-2 h-full bg-emerald-500"></div>
          <div>
            <span className="text-slate-400 font-bold text-xs block mb-1">الاختبارات النشطة</span>
            <span className="text-3xl font-black text-emerald-600">{approvedQuizzes}</span>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle className="w-7 h-7" />
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-[#003F87] p-6 rounded-[2rem] flex items-center justify-between text-white shadow-xl shadow-[#003F87]/10"
        >
          <div>
            <span className="text-blue-200 font-bold text-xs block mb-1">مكافآت XP النشطة</span>
            <span className="text-3xl font-black text-[#f9c851] flex items-center gap-1.5">
              {totalXP}
              <Award className="w-6 h-6" />
            </span>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-[#f9c851]">
            <Sparkles className="w-7 h-7" />
          </div>
        </motion.div>
      </div>

      {/* --- FILTERS & SEARCH BAR --- */}
      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-5 justify-between items-center mb-10">
        <div className="relative w-full md:w-96">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text"
            placeholder="ابحث عن اسم اختبار..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-[1.5rem] py-4 pr-12 pl-4 focus:ring-2 focus:ring-[#003F87]/10 outline-none transition-all font-bold text-slate-700 text-sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          {/* Level Filter */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-3 rounded-[1.5rem] w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400" />
            <select 
              value={selectedLevelFilter} 
              onChange={(e) => setSelectedLevelFilter(e.target.value)}
              className="bg-transparent font-bold text-slate-600 outline-none border-none cursor-pointer text-xs"
            >
              <option value="all">مستوى الصعوبة: الكل</option>
              <option value="مبتدئ">مستوى مبتدئ</option>
              <option value="متوسط">مستوى متوسط</option>
              <option value="متقدم">مستوى متقدم</option>
            </select>
          </div>

          {/* Story Filter */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-3 rounded-[1.5rem] w-full sm:w-auto">
            <BookOpen className="w-4 h-4 text-slate-400" />
            <select 
              value={selectedStoryFilter}
              onChange={(e) => setSelectedStoryFilter(e.target.value)}
              className="bg-transparent font-bold text-slate-600 outline-none border-none cursor-pointer text-xs"
            >
              <option value="all">القصة المرتبطة: الكل</option>
              {dbStories.map(s => (
                <option key={s._id} value={s._id}>{s.title}</option>
              ))}
            </select>
          </div>

          {/* Reset Filters */}
          {(selectedLevelFilter !== "all" || selectedStoryFilter !== "all" || searchQuery) && (
            <button 
              onClick={() => { setSelectedLevelFilter("all"); setSelectedStoryFilter("all"); setSearchQuery(""); }}
              className="text-slate-400 hover:text-red-500 font-black text-xs px-3 py-2 rounded-xl hover:bg-red-50 transition-all flex items-center gap-1.5 border-none cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              إعادة تعيين التصفية
            </button>
          )}
        </div>
      </div>

      {/* --- QUIZZES CARDS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredQuizzes.map((quiz) => {
          const linkedStory = dbStories.find(s => (s._id === quiz.storyId || s.id === quiz.storyId)) || { 
            title: "عام", 
            cover: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=600" 
          };
          const coverUrl = linkedStory.coverImage || linkedStory.cover || "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=600";
          return (
            <motion.div 
              layout
              key={quiz.id} 
              className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Card Image Banner */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <img 
                  src={coverUrl} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  alt={quiz.name} 
                />
                
                {/* Level Badge */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl text-[10px] font-black text-[#003F87] shadow-sm">
                  {quiz.level}
                </div>

                {/* Status Overlay Badge */}
                <div className="absolute top-4 left-4">
                  {quiz.status === "approved" && (
                    <span className="bg-emerald-500 text-white px-3 py-1.5 rounded-xl text-[10px] font-black flex items-center gap-1.5 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                      منشور ونشط
                    </span>
                  )}
                  {quiz.status === "pending" && (
                    <span className="bg-amber-500 text-white px-3 py-1.5 rounded-xl text-[10px] font-black flex items-center gap-1.5 shadow-sm">
                      <Clock className="w-3.5 h-3.5" />
                      قيد مراجعة المشرف
                    </span>
                  )}
                  {quiz.status === "draft" && (
                    <span className="bg-slate-500 text-white px-3 py-1.5 rounded-xl text-[10px] font-black flex items-center gap-1.5 shadow-sm">
                      <FileEdit className="w-3.5 h-3.5" />
                      مسودة محلية
                    </span>
                  )}
                </div>

                {/* Cover Gradient shadow */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                {/* Title inside cover */}
                <div className="absolute bottom-4 right-4 left-4 text-white">
                  <span className="text-[10px] font-bold text-amber-400 block mb-1">القصة: {linkedStory.title}</span>
                  <h3 className="text-md font-black leading-tight line-clamp-1">{quiz.name}</h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div className="space-y-4 mb-6">
                  {/* Stats line */}
                  <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                    <div className="flex items-center gap-2">
                      <FileQuestion className="w-4.5 h-4.5 text-[#003F87]" />
                      <span>{quiz.questions.length} أسئلة مضافة</span>
                    </div>

                    <div className="flex items-center gap-1 text-amber-500">
                      <Award className="w-4.5 h-4.5" />
                      <span>{quiz.xpReward} XP للطلاب</span>
                    </div>
                  </div>

                  {/* Context notice */}
                  {quiz.status === "pending" && (
                    <div className="bg-amber-50/60 text-amber-800 p-4 rounded-2xl flex gap-2.5 items-start text-[11px] font-bold border border-amber-100/50">
                      <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                      <p className="leading-relaxed">سيظهر هذا التقييم للطلاب المسجلين بالمنصة فور مراجعته واعتماده من المشرف.</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                  <button 
                    onClick={() => {
                      setActiveQuiz(quiz);
                      setIsQuestionsModalOpen(true);
                    }}
                    className="flex-1 py-3.5 bg-[#003F87]/5 text-[#003F87] font-black rounded-2xl hover:bg-[#003F87] hover:text-white transition-all text-xs flex items-center justify-center gap-2 border-none cursor-pointer"
                  >
                    <ListChecks className="w-4 h-4" />
                    إدارة الأسئلة
                  </button>

                  <button 
                    disabled={quiz.questions.length === 0}
                    onClick={() => {
                      setActiveQuiz(quiz);
                      setIsPreviewModalOpen(true);
                    }}
                    className="p-3.5 bg-slate-50 text-slate-600 rounded-2xl hover:bg-slate-100 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border-none shrink-0"
                    title="معاينة الاختبار كطالب"
                  >
                    <Eye className="w-4.5 h-4.5" />
                  </button>

                  <button 
                    onClick={() => handleDeleteQuiz(quiz.id)}
                    className="p-3.5 bg-red-50 text-red-500 rounded-2xl hover:bg-red-100 hover:text-red-600 transition-all cursor-pointer border-none shrink-0"
                    title="حذف الاختبار"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}

        {filteredQuizzes.length === 0 && (
          <div className="col-span-full py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 text-center flex flex-col items-center justify-center p-8">
            <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-400 mb-4">
              <FileQuestion className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black text-slate-700 mb-2">لا توجد اختبارات متطابقة</h3>
            <p className="text-slate-400 font-semibold max-w-sm text-sm">
              لم نجد أي اختبار مطابق لمعايير البحث. جرب تغيير فلاتر التصفية أو إنشاء اختبار جديد للبدء.
            </p>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* --- MODAL 1: CREATE QUIZ POPUP --- */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            ></motion.div>

            {/* Modal Body */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden border border-slate-100"
            >
              <div className="bg-[#003F87] text-white p-6 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-[#f9c851]" />
                  <h3 className="text-lg font-black">إنشاء اختبار تفاعلي جديد</h3>
                </div>
                <button 
                  onClick={() => setIsCreateModalOpen(false)}
                  className="bg-white/10 hover:bg-white/20 text-white rounded-xl p-2 transition-all border-none cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateQuiz} className="p-6 space-y-6">
                {/* Title input */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 block">اسم التقييم / العنوان الرئيسي</label>
                  <input 
                    type="text"
                    required
                    placeholder="مثال: مفردات وفهم قصة أسد الأطلس"
                    value={newQuizData.name}
                    onChange={(e) => setNewQuizData({...newQuizData, name: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:ring-2 focus:ring-[#003F87]/15 outline-none font-bold text-slate-700 text-sm"
                  />
                </div>

                {/* Level Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 block">مستوى التحدي والصعوبة للطلاب</label>
                  <div className="grid grid-cols-3 gap-3">
                    {["مبتدئ", "متوسط", "متقدم"].map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setNewQuizData({...newQuizData, level: lvl})}
                        className={`py-3.5 rounded-2xl font-black text-xs transition-all border cursor-pointer ${
                          newQuizData.level === lvl 
                          ? 'bg-[#003F87]/10 border-[#003F87] text-[#003F87]' 
                          : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100 hover:text-slate-500'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Link to Story */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 block">القصة المرتبطة بهذا التقييم</label>
                  <select 
                    value={newQuizData.storyId}
                    onChange={(e) => setNewQuizData({...newQuizData, storyId: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:ring-2 focus:ring-[#003F87]/15 outline-none font-bold text-slate-700 text-sm cursor-pointer"
                  >
                    {dbStories.map(s => (
                      <option key={s._id} value={s._id}>{s.title}</option>
                    ))}
                  </select>
                </div>

                {/* XP Slider */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs font-black text-slate-500">
                    <span>مكافأة النجاح للطالب (XP)</span>
                    <span className="text-[#003F87] bg-[#003F87]/10 px-2.5 py-1 rounded-lg font-black text-xs">{newQuizData.xpReward} نقطة</span>
                  </div>
                  <input 
                    type="range"
                    min="50"
                    max="500"
                    step="50"
                    value={newQuizData.xpReward}
                    onChange={(e) => setNewQuizData({...newQuizData, xpReward: Number(e.target.value)})}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#003F87]"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                    <span>50 XP</span>
                    <span>250 XP</span>
                    <span>500 XP</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-slate-100">
                  <button 
                    type="submit"
                    className="flex-1 py-4 bg-[#003F87] text-white rounded-2xl font-black hover:bg-[#002d61] transition-all shadow-lg shadow-[#003F87]/15 border-none cursor-pointer text-center text-sm"
                  >
                    تأكيد وإنشاء مسودة الاختبار
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-bold transition-all border-none cursor-pointer text-sm"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* --- MODAL 2: QUESTIONS BUILDER WORKSPACE (SPLIT-SCREEN INTERACTIVE UX) --- */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isQuestionsModalOpen && activeQuiz && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsQuestionsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            ></motion.div>

            {/* Modal Body */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-6xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden my-8 max-h-[90vh] flex flex-col border border-slate-100"
            >
              {/* Header */}
              <div className="bg-[#003F87] text-white p-6 flex justify-between items-center shrink-0">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-black">{activeQuiz.name}</h3>
                    <span className="bg-white/10 px-3 py-1 rounded-lg text-xs font-bold text-amber-300">
                      مستوى: {activeQuiz.level}
                    </span>
                  </div>
                  <p className="text-xs text-blue-200 font-bold mt-1">بيئة منشئ الأسئلة التفاعلية وهندسة الاختبار</p>
                </div>
                <button 
                  onClick={() => setIsQuestionsModalOpen(false)}
                  className="bg-white/10 hover:bg-white/20 text-white rounded-xl p-2 transition-all border-none cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body Layout Grid */}
              <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* LEFT SIDE: TIMELINE OF ADDED QUESTIONS (5 Cols) */}
                <div className="lg:col-span-5 flex flex-col gap-4 border-l border-slate-100 lg:pl-6 overflow-y-auto max-h-[60vh] lg:max-h-none">
                  <h4 className="text-sm font-black text-slate-700 flex items-center justify-between">
                    <span>قائمة الأسئلة المضافة ({activeQuiz.questions.length})</span>
                    {activeQuiz.questions.length === 0 && (
                      <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg">قائمة فارغة</span>
                    )}
                  </h4>

                  <div className="space-y-4 overflow-y-auto flex-1 pr-1">
                    {activeQuiz.questions.map((qu, index) => (
                      <div 
                        key={qu.id} 
                        className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 relative group flex gap-3.5 items-start justify-between hover:bg-white hover:border-slate-200 transition-all shadow-sm"
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-[#003F87]/10 text-[#003F87] font-black text-xs shrink-0">
                          {index + 1}
                        </div>

                        <div className="flex-1 space-y-1">
                          <span className="text-[9px] font-black text-[#003F87] uppercase tracking-wider bg-[#003F87]/5 border border-[#003F87]/10 px-2 py-0.5 rounded-md inline-block">
                            {qu.type === "choice" && "اختيار من متعدد"}
                            {qu.type === "translate" && "ترجمة عبارة"}
                            {qu.type === "fill_blanks" && "ملء الفراغ"}
                            {qu.type === "correct_form" && "الصيغة النحوية"}
                          </span>
                          <p className="text-xs font-bold text-slate-700 leading-relaxed mt-1.5">{qu.text}</p>
                          <p className="text-[10px] font-black text-emerald-600 mt-1 flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> الإجابة: {qu.correctAnswer}
                          </p>
                        </div>

                        <button 
                          onClick={() => handleDeleteQuestion(qu.id)}
                          className="text-slate-300 hover:text-red-500 transition-colors p-1 border-none bg-transparent cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}

                    {activeQuiz.questions.length === 0 && (
                      <div className="py-20 text-center text-slate-400 font-bold border border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center p-4">
                        <FileQuestion className="w-12 h-12 text-slate-300 mb-3" />
                        <span className="text-xs">لم يتم إضافة أي سؤال للاختبار بعد.</span>
                        <p className="text-[10px] font-bold text-slate-400 mt-1.5 max-w-[220px] leading-relaxed">استخدم المنشئ الذكي على اليسار لتوليد وهيكلة الأسئلة فوراً.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* RIGHT SIDE: DYNAMIC WORKSPACE QUESTION BUILDER (7 Cols) */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* Type Tabs */}
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 block">اختر نوع وهيكل السؤال الجديد</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                      {[
                        { id: "choice", label: "اختيار من متعدد", icon: <CheckSquare className="w-4 h-4" /> },
                        { id: "translate", label: "ترجم العبارة", icon: <Languages className="w-4 h-4" /> },
                        { id: "fill_blanks", label: "ملء الفراغات", icon: <Info className="w-4 h-4" /> },
                        { id: "correct_form", label: "الصيغة النحوية", icon: <ListChecks className="w-4 h-4" /> }
                      ].map(tab => (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => {
                            setActiveQuestionTab(tab.id);
                            setNewQuestionText("");
                          }}
                          className={`py-3 px-1 rounded-xl font-bold text-[10px] sm:text-xs flex items-center justify-center gap-1.5 transition-all border-none cursor-pointer ${
                            activeQuestionTab === tab.id 
                            ? 'bg-[#003F87] text-white shadow-md font-black scale-105' 
                            : 'bg-transparent text-slate-500 hover:text-slate-700'
                          }`}
                        >
                          {tab.icon}
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Shared Question Text Input */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-black text-slate-500">
                      <span>نص السؤال التعليمي</span>
                      {activeQuestionTab === "fill_blanks" && (
                        <span className="text-[9px] text-amber-700 font-black bg-amber-50 px-2.5 py-1 rounded border border-amber-100 flex items-center gap-1">
                          ⚠️ اكتب [blank] في موضع الفراغ
                        </span>
                      )}
                      {activeQuestionTab === "correct_form" && (
                        <span className="text-[9px] text-amber-700 font-black bg-amber-50 px-2.5 py-1 rounded border border-amber-100 flex items-center gap-1">
                          ⚠️ اكتب [blank] في موضع الكلمة
                        </span>
                      )}
                    </div>
                    <textarea 
                      value={newQuestionText}
                      onChange={(e) => setNewQuestionText(e.target.value)}
                      placeholder={
                        activeQuestionTab === "choice" ? "مثال: ما هي عاصمة المملكة المغربية؟" :
                        activeQuestionTab === "translate" ? "مثال: ترجم الجملة التالية: 'The forest is beautiful'" :
                        activeQuestionTab === "fill_blanks" ? "مثال: ولد الرحالة الشهير في مدينة [blank] التاريخية." :
                        "مثال: الأستاذ [blank] الدرس الآن أمام الطلاب. (يشرح / شرح / سوف شرح)"
                      }
                      rows="3"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:ring-2 focus:ring-[#003F87]/15 outline-none font-bold text-slate-700 text-sm resize-none leading-relaxed"
                    ></textarea>
                  </div>

                  {/* DYNAMIC FORMS ACCORDING TO ACTIVE TYPE */}
                  
                  {/* TYPE A: CHOICE */}
                  {activeQuestionTab === "choice" && (
                    <div className="space-y-4">
                      <label className="text-xs font-black text-slate-500 block">قم بتعبئة الخيارات الأربعة وحدد الإجابة الصحيحة</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {newQuestionOptions.map((opt, i) => (
                          <div 
                            key={i} 
                            className={`flex items-center gap-2 bg-slate-50 border rounded-2xl p-3 transition-all ${
                              newQuestionCorrectIndex === i 
                              ? 'border-emerald-500 bg-emerald-50/20' 
                              : 'border-slate-200'
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => setNewQuestionCorrectIndex(i)}
                              className={`w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer border shrink-0 ${
                                newQuestionCorrectIndex === i 
                                ? 'bg-emerald-500 border-emerald-500 text-white' 
                                : 'bg-white border-slate-300 text-transparent hover:border-emerald-500'
                              }`}
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <input 
                              type="text"
                              placeholder={`خيارات الإجابة ${i + 1}`}
                              value={opt}
                              onChange={(e) => {
                                const newOpts = [...newQuestionOptions];
                                newOpts[i] = e.target.value;
                                setNewQuestionOptions(newOpts);
                              }}
                              className="bg-transparent border-none outline-none font-bold text-slate-700 text-xs w-full focus:ring-0"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TYPE B: TRANSLATE */}
                  {activeQuestionTab === "translate" && (
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-500 block">الترجمة النموذجية الصحيحة</label>
                      <input 
                        type="text"
                        placeholder="مثال: الغابة جميلة جداً"
                        value={newQuestionCorrectTranslation}
                        onChange={(e) => setNewQuestionCorrectTranslation(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:ring-2 focus:ring-[#003F87]/15 outline-none font-bold text-slate-700 text-xs"
                      />
                    </div>
                  )}

                  {/* TYPE C: FILL BLANKS */}
                  {activeQuestionTab === "fill_blanks" && (
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-500 block">الكلمة الصحيحة لملء الفراغ</label>
                      <input 
                        type="text"
                        placeholder="مثال: طنجة"
                        value={newQuestionCorrectBlank}
                        onChange={(e) => setNewQuestionCorrectBlank(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:ring-2 focus:ring-[#003F87]/15 outline-none font-bold text-slate-700 text-xs"
                      />
                    </div>
                  )}

                  {/* TYPE D: CORRECT FORM */}
                  {activeQuestionTab === "correct_form" && (
                    <div className="space-y-4">
                      <label className="text-xs font-black text-slate-500 block">الصيغ المقترحة للكلمة وحدد الإجابة الصحيحة</label>
                      <div className="grid grid-cols-3 gap-3">
                        {newQuestionCorrectFormOptions.map((opt, i) => (
                          <div 
                            key={i} 
                            className={`flex items-center gap-2 bg-slate-50 border rounded-2xl p-3 transition-all ${
                              newQuestionCorrectFormIndex === i 
                              ? 'border-emerald-500 bg-emerald-50/20' 
                              : 'border-slate-200'
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => setNewQuestionCorrectFormIndex(i)}
                              className={`w-5 h-5 rounded-full flex items-center justify-center transition-all cursor-pointer border shrink-0 ${
                                newQuestionCorrectFormIndex === i 
                                ? 'bg-emerald-500 border-emerald-500 text-white' 
                                : 'bg-white border-slate-300 text-transparent hover:border-emerald-500'
                              }`}
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <input 
                              type="text"
                              placeholder={`صيغة ${i + 1}`}
                              value={opt}
                              onChange={(e) => {
                                const newOpts = [...newQuestionCorrectFormOptions];
                                newOpts[i] = e.target.value;
                                setNewQuestionCorrectFormOptions(newOpts);
                              }}
                              className="bg-transparent border-none outline-none font-bold text-slate-700 text-xs w-full focus:ring-0"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* LIVE PREVIEW OF QUESTION (STUDENT UX SIMULATION) */}
                  <div className="bg-slate-50 border border-slate-100 rounded-3xl p-5 space-y-3">
                    <span className="text-[10px] font-black text-[#003F87] block tracking-wider uppercase">معاينة مباشرة (شاشة تفاعل الطالب)</span>
                    
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
                      <p className="text-sm font-bold text-slate-800 leading-relaxed">
                        {activeQuestionTab === "fill_blanks" || activeQuestionTab === "correct_form" ? (
                          newQuestionText ? (
                            newQuestionText.split("[blank]").map((part, i, arr) => (
                              <React.Fragment key={i}>
                                {part}
                                {i < arr.length - 1 && (
                                  <span className="mx-1 px-3 py-1 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded font-black text-xs">
                                    {activeQuestionTab === "fill_blanks" 
                                      ? (newQuestionCorrectBlank || "فراغ") 
                                      : (newQuestionCorrectFormOptions[newQuestionCorrectFormIndex] || "فراغ")}
                                  </span>
                                )}
                              </React.Fragment>
                            ))
                          ) : "يرجى صياغة نص السؤال مع تضمين رمز [blank] لرؤية المعاينة..."
                        ) : (newQuestionText || "يرجى صياغة نص السؤال هنا للبدء في توليد المحاكاة الحية...")}
                      </p>

                      {/* Preview Inputs according to type */}
                      {activeQuestionTab === "choice" && (
                        <div className="grid grid-cols-2 gap-3 mt-4">
                          {newQuestionOptions.map((opt, i) => (
                            <div 
                              key={i} 
                              className={`p-3 rounded-xl border text-xs font-bold transition-all text-right flex items-center justify-between ${
                                newQuestionCorrectIndex === i && opt
                                ? 'border-emerald-500 bg-emerald-50 text-emerald-800' 
                                : 'border-slate-100 bg-slate-50/50 text-slate-400'
                              }`}
                            >
                              <span>{opt || `الخيار ${i + 1}`}</span>
                              {newQuestionCorrectIndex === i && opt && <CheckCircle className="w-4 h-4 text-emerald-600 animate-bounce" />}
                            </div>
                          ))}
                        </div>
                      )}

                      {activeQuestionTab === "translate" && (
                        <div className="mt-3">
                          <input 
                            type="text" 
                            disabled 
                            value={newQuestionCorrectTranslation} 
                            placeholder="ترجمة الطالب المقترحة ستظهر هنا..."
                            className="w-full bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-3 text-xs font-bold"
                          />
                        </div>
                      )}

                      {activeQuestionTab === "correct_form" && (
                        <div className="flex gap-2.5 mt-4">
                          {newQuestionCorrectFormOptions.map((opt, i) => (
                            <div 
                              key={i}
                              className={`px-4 py-2.5 rounded-full border text-xs font-bold transition-all ${
                                newQuestionCorrectFormIndex === i && opt
                                ? 'border-emerald-500 bg-emerald-50 text-emerald-800 font-black'
                                : 'border-slate-100 bg-slate-50/50 text-slate-400'
                              }`}
                            >
                              {opt || `صيغة ${i + 1}`}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Add Question Button */}
                  <button 
                    type="button"
                    onClick={handleAddQuestion}
                    className="w-full py-4 bg-[#003F87] text-white rounded-2xl font-black hover:bg-[#002d61] transition-all shadow-lg shadow-[#003F87]/15 border-none cursor-pointer flex items-center justify-center gap-2"
                  >
                    <PlusCircle className="w-5 h-5 text-white" />
                    حفظ وإضافة السؤال للتقييم
                  </button>

                </div>

              </div>

              {/* Footer Controls */}
              <div className="bg-slate-50 p-6 flex flex-col sm:flex-row justify-between items-center shrink-0 border-t border-slate-100 gap-4">
                <div className="flex items-center gap-2 text-xs text-slate-500 font-bold">
                  <Info className="w-4 h-4 text-amber-500" />
                  <span>تذكر إرسال الاختبار للاعتماد من المشرفين عند إتمام كتابة الأسئلة.</span>
                </div>

                <div className="flex gap-3 w-full sm:w-auto">
                  <button 
                    onClick={() => handleSubmitForReview(activeQuiz.id)}
                    className="flex-1 sm:flex-none py-3.5 px-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black transition-all shadow-lg shadow-emerald-600/15 border-none cursor-pointer text-center text-sm"
                  >
                    إرسال للاعتماد النهائي
                  </button>

                  <button 
                    onClick={() => handleSaveAsDraft(activeQuiz.id)}
                    className="flex-1 sm:flex-none py-3.5 px-6 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-2xl font-bold transition-all border-none cursor-pointer text-center text-sm"
                  >
                    حفظ كمسودة
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* --- MODAL 3: VIEW & PREVIEW QUIZ DETAILS MODAL (STUDENT VIEW SIMULATION) --- */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isPreviewModalOpen && activeQuiz && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPreviewModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            ></motion.div>

            {/* Modal Body - Designed as a beautiful pupil learning dashboard mockup */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#f0f4f9] w-full max-w-4xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden max-h-[85vh] flex flex-col border border-slate-100"
            >
              {/* Device Header simulating student application */}
              <div className="bg-[#003F87] text-white p-6 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center text-[#f9c851]">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black flex items-center gap-2">
                      معاينة التلميذ: {activeQuiz.name}
                    </h3>
                    <p className="text-xs text-blue-200 font-bold mt-0.5">محاكاة تفاعلية للاختبار النهائي في تطبيق الطالب</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => setIsPreviewModalOpen(false)}
                  className="bg-white/10 hover:bg-white/20 text-white rounded-xl p-2 transition-all border-none cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Sidebar Info & Questions Split Section */}
              <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left: Interactive Quiz Meta card */}
                <div className="space-y-4">
                  <div className="bg-white p-5 rounded-[2rem] border border-slate-200/50 shadow-sm space-y-4">
                    <span className="text-[10px] font-black text-[#003F87] bg-[#003F87]/5 px-3 py-1 rounded-full uppercase tracking-wider block text-center">
                      بطاقة التحدي
                    </span>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400 font-bold">مستوى التقييم:</span>
                        <span className="text-[#003F87] font-black">{activeQuiz.level}</span>
                      </div>
                      
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400 font-bold">القصة المرتبطة:</span>
                        <span className="text-slate-800 font-black truncate max-w-[60%]">
                          {dbStories.find(s => (s._id === activeQuiz.storyId || s.id === activeQuiz.storyId))?.title || "عام"}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400 font-bold">إجمالي المكافأة:</span>
                        <span className="text-amber-600 font-black flex items-center gap-1.5">
                          <Award className="w-4 h-4" /> {activeQuiz.xpReward} XP
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-xs pt-3 border-t border-slate-100">
                        <span className="text-slate-400 font-bold">حالة المراجعة:</span>
                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black ${
                          activeQuiz.status === "approved" ? "bg-emerald-50 text-emerald-600" :
                          activeQuiz.status === "pending" ? "bg-amber-50 text-amber-600" :
                          "bg-slate-50 text-slate-500"
                        }`}>
                          {activeQuiz.status === "approved" ? "منشور ونشط" :
                           activeQuiz.status === "pending" ? "بانتظار المشرف" :
                           "مسودة اختبار"}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-[#003F87] p-5 rounded-[2rem] text-white space-y-2">
                    <h5 className="font-black text-xs flex items-center gap-2 text-[#f9c851]">
                      <Sparkles className="w-4 h-4" /> نقاط التقييم الذكي
                    </h5>
                    <p className="text-[10px] text-blue-100 font-medium leading-relaxed">
                      يتم تقييم الإجابات بشكل لحظي عند نقر الطالب، وتُحسب النقاط تلقائياً في حسابه بمجرد إرسال الاختبار بالكامل.
                    </p>
                  </div>
                </div>

                {/* Right: Rendered Questions Mockup */}
                <div className="lg:col-span-2 space-y-6">
                  {activeQuiz.questions.length > 0 ? (
                    activeQuiz.questions.map((qu, index) => (
                      <div key={qu.id} className="bg-white border border-slate-200/60 rounded-[2rem] p-6 shadow-sm space-y-5">
                        <div className="flex items-start gap-3">
                          <span className="w-7 h-7 bg-[#003F87]/15 text-[#003F87] font-black text-xs rounded-xl flex items-center justify-center shrink-0">
                            {index + 1}
                          </span>
                          <h4 className="text-sm font-black text-slate-800 leading-relaxed pt-0.5">
                            {qu.type === "fill_blanks" || qu.type === "correct_form" ? (
                              qu.text.split("[blank]").map((part, i, arr) => (
                                <React.Fragment key={i}>
                                  {part}
                                  {i < arr.length - 1 && (
                                    <span className="mx-1 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 font-black rounded-lg text-xs">
                                      {qu.correctAnswer}
                                    </span>
                                  )}
                                </React.Fragment>
                              ))
                            ) : qu.text}
                          </h4>
                        </div>

                        {/* Answers Structure in UI */}
                        {qu.type === "choice" && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                            {qu.options.map((opt, i) => (
                              <div 
                                key={i} 
                                className={`p-3.5 rounded-2xl border text-xs font-bold transition-all flex items-center justify-between ${
                                  opt === qu.correctAnswer 
                                  ? 'border-emerald-500 bg-emerald-50 text-emerald-800 font-black' 
                                  : 'border-slate-100 bg-slate-50/50 text-slate-400'
                                }`}
                              >
                                <span>{opt}</span>
                                {opt === qu.correctAnswer && <CheckCircle className="w-4.5 h-4.5 text-emerald-600 shrink-0" />}
                              </div>
                            ))}
                          </div>
                        )}

                        {qu.type === "translate" && (
                          <div className="pt-2">
                            <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-2xl text-xs font-bold">
                              <span className="text-[10px] font-black text-emerald-600 block mb-1">الترجمة النموذجية الصحيحة:</span>
                              <p className="font-black">{qu.correctAnswer}</p>
                            </div>
                          </div>
                        )}

                        {qu.type === "correct_form" && (
                          <div className="flex flex-wrap gap-2.5 pt-2">
                            {qu.options.map((opt, i) => (
                              <div 
                                key={i} 
                                className={`px-4 py-2.5 rounded-full border text-xs font-bold transition-all ${
                                  opt === qu.correctAnswer 
                                  ? 'border-emerald-500 bg-emerald-50 text-emerald-800 font-black' 
                                  : 'border-slate-100 bg-slate-50/50 text-slate-400'
                                }`}
                              >
                                {opt}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-20 bg-white border border-slate-200/50 rounded-[2rem] text-slate-400 font-bold">
                      لا توجد أسئلة مضافة في المعاينة بعد.
                    </div>
                  )}
                </div>

              </div>

              {/* Footer */}
              <div className="bg-white p-6 flex justify-end shrink-0 border-t border-slate-100">
                <button 
                  onClick={() => setIsPreviewModalOpen(false)}
                  className="px-8 py-3.5 bg-[#003F87] text-white rounded-2xl font-black hover:bg-[#002d61] transition-all border-none cursor-pointer text-xs"
                >
                  إغلاق نافذة المعاينة
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default TestBank;
