const Content = require("../models/Content");
const Story = require("../models/Story");
const StudentProgress = require("../models/StudentProgress");
const User = require("../models/User");

const STORY_COMPLETION_XP = 50;
const AI_MESSAGE_MILESTONE = 10;
const AI_MESSAGE_XP = 5;
const QUIZ_PASSING_SCORE = 80;

const badgeCatalog = [
  {
    id: "first_story",
    title: "قارئ البداية",
    icon: "fa-book-open",
    type: "blue",
    desc: "يمنح عند إكمال أول قصة.",
    target: 1,
    getProgress: ({ completedStoriesCount }) => completedStoriesCount,
    isActive: ({ completedStoriesCount }) => completedStoriesCount >= 1,
  },
  {
    id: "great_reader",
    title: "قارئ متميز",
    icon: "fa-award",
    type: "gold",
    desc: "يمنح عند إكمال 10 قصص.",
    target: 10,
    getProgress: ({ completedStoriesCount }) => completedStoriesCount,
    isActive: ({ completedStoriesCount }) => completedStoriesCount >= 10,
  },
  {
    id: "word_expert",
    title: "خبير الكلمات",
    icon: "fa-trophy",
    type: "brown",
    desc: "يمنح عند تعلم 100 كلمة.",
    target: 100,
    getProgress: ({ learnedWordsCount }) => learnedWordsCount,
    isActive: ({ learnedWordsCount }) => learnedWordsCount >= 100,
  },
  {
    id: "quiz_champion",
    title: "بطل الاختبارات",
    icon: "fa-circle-check",
    type: "gold",
    desc: "يمنح عند النجاح في 3 اختبارات بدرجة 80% أو أكثر.",
    target: 3,
    getProgress: ({ passedQuizzesCount }) => passedQuizzesCount,
    isActive: ({ passedQuizzesCount }) => passedQuizzesCount >= 3,
  },
  {
    id: "ai_speaker",
    title: "محاور الذكاء",
    icon: "fa-robot",
    type: "blue",
    desc: "يفتح عند إكمال 10 رسائل مع شخصيات القصص.",
    target: AI_MESSAGE_MILESTONE,
    getProgress: ({ aiMessagesCount }) => aiMessagesCount,
    isActive: ({ aiMessagesCount }) => aiMessagesCount >= AI_MESSAGE_MILESTONE,
  },
  {
    id: "xp_collector",
    title: "جامع النقاط",
    icon: "fa-star",
    type: "gold",
    desc: "يفتح عند جمع 500 XP.",
    target: 500,
    getProgress: ({ totalXp }) => totalXp,
    isActive: ({ totalXp }) => totalXp >= 500,
  },
  {
    id: "tifinagh_hero",
    title: "بطل تيفيناغ",
    icon: "fa-language",
    type: "blue",
    desc: "يمنح عند إكمال 5 قصص بلغة تيفيناغ.",
    target: 5,
    getProgress: ({ completedTifinaghStoriesCount }) => completedTifinaghStoriesCount,
    isActive: ({ completedTifinaghStoriesCount }) => completedTifinaghStoriesCount >= 5,
  },
  {
    id: "video_watcher",
    title: "مشاهد نشيط",
    icon: "fa-circle-play",
    type: "blue",
    desc: "يفتح عند مشاهدة أول فيديو تعليمي.",
    target: 1,
    getProgress: ({ watchedVideosCount }) => watchedVideosCount,
    isActive: ({ watchedVideosCount }) => watchedVideosCount >= 1,
  },
  {
    id: "video_fan",
    title: "متفاعل الفيديوهات",
    icon: "fa-heart",
    type: "gold",
    desc: "يفتح عند التفاعل مع أول فيديو.",
    target: 1,
    getProgress: ({ videoReactionsCount }) => videoReactionsCount,
    isActive: ({ videoReactionsCount }) => videoReactionsCount >= 1,
  },
  {
    id: "chat_voice",
    title: "صوت المجتمع",
    icon: "fa-comments",
    type: "blue",
    desc: "يفتح عند إرسال 5 رسائل في الدردشة العامة.",
    target: 5,
    getProgress: ({ generalChatMessagesCount }) => generalChatMessagesCount,
    isActive: ({ generalChatMessagesCount }) => generalChatMessagesCount >= 5,
  },
  {
    id: "story_master",
    title: "بطل القصص",
    icon: "fa-book-open-reader",
    type: "gold",
    desc: "يفتح عند إكمال 3 قصص.",
    target: 3,
    getProgress: ({ completedStoriesCount }) => completedStoriesCount,
    isActive: ({ completedStoriesCount }) => completedStoriesCount >= 3,
  },
  {
    id: "voice_salon_speaker",
    title: "متحدث الصالونات",
    icon: "fa-microphone",
    type: "blue",
    desc: "يفتح عند المشاركة في صالون صوتي والحصول على مكافأة التدريب.",
    target: 1,
    getProgress: ({ voiceSalonSessionsCount }) => voiceSalonSessionsCount,
    isActive: ({ voiceSalonSessionsCount }) => voiceSalonSessionsCount >= 1,
  },
];

const normalizeWordId = (word) => String(word || "").trim().toLowerCase();

const awardXp = (progress, { amount, source, sourceId, reason }) => {
  const safeAmount = Math.max(0, Number(amount) || 0);
  const safeSourceId = String(sourceId || "");

  if (!safeAmount || !source || !safeSourceId) {
    return 0;
  }

  const alreadyAwarded = (progress.xpEvents || []).some((event) => (
    event.source === source && event.sourceId === safeSourceId
  ));

  if (alreadyAwarded) {
    return 0;
  }

  progress.totalXp = (progress.totalXp || 0) + safeAmount;
  progress.xpEvents.push({
    source,
    sourceId: safeSourceId,
    amount: safeAmount,
    reason,
    createdAt: new Date(),
  });

  return safeAmount;
};

const buildWordBank = (stories, progress) => {
  const favorites = new Set((progress.favoriteWords || []).map(normalizeWordId));
  const learned = new Set((progress.learnedWords || []).map(normalizeWordId));
  const seen = new Set();

  return stories.flatMap((story) => (
    (story.vocabulary || []).map((entry) => {
      const word = entry.word || "";
      const id = `${story._id}-${normalizeWordId(word)}`;

      if (!word || seen.has(normalizeWordId(word))) return null;
      seen.add(normalizeWordId(word));

      return {
        id,
        word,
        tifinagh: entry.tifinagh || "",
        arabic: entry.translation || "",
        translation: entry.translation || "",
        storyTitle: story.title,
        storyId: story._id,
        isFavorite: favorites.has(normalizeWordId(word)),
        learned: learned.has(normalizeWordId(word)),
      };
    }).filter(Boolean)
  ));
};

const getProgressStats = (progress, stories, quizzes = []) => {
  const completedStoryIds = new Set(
    (progress.completedStories || []).map((entry) => String(entry.story?._id || entry.story))
  );
  const completedTifinaghStoriesCount = stories.filter((story) => (
    completedStoryIds.has(String(story._id)) && story.language === "Tifinagh"
  )).length;

  return {
    learningHours: Math.round((progress.learningMinutes || 0) / 60),
    learnedWordsCount: new Set((progress.learnedWords || []).map(normalizeWordId)).size,
    completedStoriesCount: completedStoryIds.size,
    totalStoriesCount: stories.length,
    availableQuizzesCount: quizzes.length,
    passedQuizzesCount: (progress.quizAttempts || []).filter((attempt) => attempt.score >= QUIZ_PASSING_SCORE).length,
    completedTifinaghStoriesCount,
    totalXp: progress.totalXp || 0,
    aiMessagesCount: progress.aiMessagesCount || 0,
    generalChatMessagesCount: progress.generalChatMessagesCount || 0,
    watchedVideosCount: new Set((progress.watchedVideos || []).map((entry) => String(entry.video))).size,
    videoReactionsCount: new Set((progress.videoReactions || []).map((entry) => String(entry.video))).size,
    voiceSalonSessionsCount: (progress.xpEvents || []).filter((event) => event.source === "voice_salon").length,
  };
};

const buildBadges = (stats) => badgeCatalog.map((badge) => {
  const { isActive, getProgress, ...publicBadge } = badge;
  const progress = getProgress ? getProgress(stats) : null;
  const target = badge.target || null;
  return {
    ...publicBadge,
    active: isActive(stats),
    progress,
    target,
    percent: target ? Math.min(100, Math.round(((progress || 0) / target) * 100)) : null,
  };
});

exports.recordAiMessageReward = async (studentId) => {
  const progress = await StudentProgress.findOneAndUpdate(
    { student: studentId },
    { $setOnInsert: { student: studentId } },
    { new: true, upsert: true }
  );

  const [stories, quizzes] = await Promise.all([
    Story.find({ status: "approved" }).select("language"),
    Content.find({ type: "exam", status: "approved", questions: { $exists: true, $ne: [] } }).select("_id"),
  ]);
  const beforeBadges = buildBadges(getProgressStats(progress, stories, quizzes));

  progress.aiMessagesCount = (progress.aiMessagesCount || 0) + 1;
  const xpAwarded = awardXp(progress, {
    amount: AI_MESSAGE_XP,
    source: "ai_chat",
    sourceId: `message-${progress.aiMessagesCount}`,
    reason: "AI chat message",
  });

  await progress.save();

  const afterBadges = buildBadges(getProgressStats(progress, stories, quizzes));
  const earnedBadges = afterBadges.filter((badge) => (
    badge.active && !beforeBadges.some((before) => before.id === badge.id && before.active)
  ));

  const remainder = progress.aiMessagesCount % AI_MESSAGE_MILESTONE;

  return {
    xpAwarded,
    totalXp: progress.totalXp || 0,
    aiMessagesCount: progress.aiMessagesCount || 0,
    nextAiRewardIn: remainder === 0 ? AI_MESSAGE_MILESTONE : AI_MESSAGE_MILESTONE - remainder,
    earnedBadges,
  };
};

exports.getJourney = async (req, res) => {
  try {
    const progress = await StudentProgress.findOneAndUpdate(
      { student: req.user._id },
      { $setOnInsert: { student: req.user._id } },
      { new: true, upsert: true }
    )
      .populate("completedStories.story", "title coverImage level language personality")
      .populate("storyProgress.story", "title coverImage level language")
      .populate("quizAttempts.exam", "title xpReward level storyId");

    const [stories, quizzes] = await Promise.all([
      Story.find({ status: "approved" })
        .select("title coverImage level language vocabulary personality createdAt")
        .sort({ createdAt: -1 }),
      Content.find({
        type: "exam",
        status: "approved",
        questions: { $exists: true, $ne: [] },
      })
        .populate("storyId", "title coverImage level language")
        .select("title level language thumbnail storyId xpReward questions createdAt")
        .sort({ createdAt: -1 }),
    ]);

    const wordBank = buildWordBank(stories, progress);
    const completedStoryIds = new Set(
      (progress.completedStories || [])
        .map((entry) => String(entry.story?._id || entry.story))
    );

    const completedStories = (progress.completedStories || [])
      .filter((entry) => entry.story)
      .map((entry) => ({
        id: entry.story._id,
        title: entry.story.title,
        coverImage: entry.story.coverImage,
        level: entry.story.level,
        language: entry.story.language,
        completedAt: entry.completedAt,
        xp: entry.xpAwarded || STORY_COMPLETION_XP,
      }));

    const continueStories = [
      ...(progress.storyProgress || [])
        .filter((entry) => entry.story && entry.percent > 0 && entry.percent < 100)
        .map((entry) => ({
          id: entry.story._id,
          title: entry.story.title,
          coverImage: entry.story.coverImage,
          level: entry.story.level,
          language: entry.story.language,
          progress: entry.percent,
        })),
      ...stories
        .filter((story) => !completedStoryIds.has(String(story._id)))
        .slice(0, 2)
        .map((story) => ({
          id: story._id,
          title: story.title,
          coverImage: story.coverImage,
          level: story.level,
          language: story.language,
          progress: 0,
        })),
    ].slice(0, 4);

    const stats = {
      ...getProgressStats(progress, stories, quizzes),
      wordBankCount: wordBank.length,
    };
    const badges = buildBadges(stats);

    return res.status(200).json({
      stats,
      wordBank: wordBank.slice(0, 20),
      badges,
      continueStories,
      completedStories,
      quizzes: quizzes.map((quiz) => ({
        id: quiz._id,
        title: quiz.title,
        level: quiz.level,
        language: quiz.language,
        xpReward: quiz.xpReward,
        thumbnail: quiz.thumbnail || quiz.storyId?.coverImage,
        story: quiz.storyId
          ? {
              id: quiz.storyId._id,
              title: quiz.storyId.title,
              coverImage: quiz.storyId.coverImage,
              level: quiz.storyId.level,
              language: quiz.storyId.language,
            }
          : null,
        questionsCount: quiz.questions.length,
        questions: quiz.questions.map((question, index) => ({
          id: `${quiz._id}-${index}`,
          type: question.type,
          text: question.text,
          options: question.options || [],
        })),
      })),
    });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching educational journey", error: error.message });
  }
};

exports.getAchievements = async (req, res) => {
  try {
    const progress = await StudentProgress.findOneAndUpdate(
      { student: req.user._id },
      { $setOnInsert: { student: req.user._id } },
      { new: true, upsert: true }
    );
    const [stories, quizzes] = await Promise.all([
      Story.find({ status: "approved" }).select("language"),
      Content.find({ type: "exam", status: "approved", questions: { $exists: true, $ne: [] } }).select("_id"),
    ]);
    const stats = getProgressStats(progress, stories, quizzes);
    const badges = buildBadges(stats);

    return res.status(200).json({
      stats,
      badges,
      unlockedCount: badges.filter((badge) => badge.active).length,
      totalCount: badges.length,
      recent: badges.filter((badge) => badge.active).slice(-5).reverse(),
    });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching achievements", error: error.message });
  }
};

exports.recordActivity = async (req, res) => {
  try {
    const { type, videoId, reaction = "like" } = req.body;
    const progress = await StudentProgress.findOneAndUpdate(
      { student: req.user._id },
      { $setOnInsert: { student: req.user._id } },
      { new: true, upsert: true }
    );

    const [stories, quizzes] = await Promise.all([
      Story.find({ status: "approved" }).select("language"),
      Content.find({ type: "exam", status: "approved", questions: { $exists: true, $ne: [] } }).select("_id"),
    ]);
    const beforeBadges = buildBadges(getProgressStats(progress, stories, quizzes));

    if (type === "video_watch") {
      const video = await Content.findOne({ _id: videoId, type: "video", status: "approved" }).select("_id");
      if (!video) return res.status(404).json({ message: "Approved video not found" });
      const exists = (progress.watchedVideos || []).some((entry) => String(entry.video) === String(videoId));
      if (!exists) progress.watchedVideos.push({ video: videoId, watchedAt: new Date() });
    } else if (type === "video_reaction") {
      const video = await Content.findOne({ _id: videoId, type: "video", status: "approved" }).select("_id");
      if (!video) return res.status(404).json({ message: "Approved video not found" });
      const exists = (progress.videoReactions || []).some((entry) => String(entry.video) === String(videoId));
      if (!exists) progress.videoReactions.push({ video: videoId, reaction, reactedAt: new Date() });
    } else if (type === "general_chat_message") {
      progress.generalChatMessagesCount = (progress.generalChatMessagesCount || 0) + 1;
    } else {
      return res.status(400).json({ message: "Unsupported activity type" });
    }

    await progress.save();
    const afterBadges = buildBadges(getProgressStats(progress, stories, quizzes));
    const earnedBadges = afterBadges.filter((badge) => (
      badge.active && !beforeBadges.some((before) => before.id === badge.id && before.active)
    ));

    return res.status(200).json({
      message: "Activity recorded",
      earnedBadges,
      stats: getProgressStats(progress, stories, quizzes),
    });
  } catch (error) {
    return res.status(500).json({ message: "Error recording activity", error: error.message });
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    const [students, progressRows] = await Promise.all([
      User.find({ Role: { $regex: /^student$/i } })
        .select("username nickname avatar photoProfile Level TargetLanguage")
        .lean(),
      StudentProgress.find({})
        .select("student totalXp completedStories quizAttempts aiMessagesCount updatedAt")
        .lean(),
    ]);

    const progressByStudent = new Map(progressRows.map((progress) => [
      String(progress.student),
      progress,
    ]));

    const ranked = students
      .map((student) => {
        const progress = progressByStudent.get(String(student._id)) || {};
        return {
          id: student._id,
          name: student.nickname || student.username || "طالب",
          avatar: student.avatar || student.photoProfile || "",
          level: student.Level || "Beginner",
          targetLanguage: student.TargetLanguage || "عام",
          xp: Number(progress.totalXp) || 0,
          completedStoriesCount: (progress.completedStories || []).length,
          passedQuizzesCount: (progress.quizAttempts || []).filter((attempt) => attempt.score >= QUIZ_PASSING_SCORE).length,
          aiMessagesCount: progress.aiMessagesCount || 0,
          lastActiveAt: progress.updatedAt || null,
        };
      })
      .sort((a, b) => b.xp - a.xp || a.name.localeCompare(b.name, "ar"));

    const entries = ranked.map((entry, index) => ({
      ...entry,
      rank: index + 1,
      isCurrentUser: String(entry.id) === String(req.user._id),
    }));
    const currentUserEntry = entries.find((entry) => entry.isCurrentUser) || {
      id: req.user._id,
      name: req.user.nickname || req.user.username || "طالب",
      avatar: req.user.avatar || req.user.photoProfile || "",
      level: req.user.Level || "Beginner",
      targetLanguage: req.user.TargetLanguage || "عام",
      xp: 0,
      completedStoriesCount: 0,
      passedQuizzesCount: 0,
      aiMessagesCount: 0,
      rank: entries.length + 1,
      isCurrentUser: true,
    };

    return res.status(200).json({
      topThree: entries.slice(0, 3),
      entries: entries.slice(3, 30),
      currentUser: currentUserEntry,
      totalStudents: entries.length,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching leaderboard", error: error.message });
  }
};

exports.getTeacherLeaderboard = async (req, res) => {
  try {
    const [students, progressRows] = await Promise.all([
      User.find({ Role: { $regex: /^student$/i } })
        .select("username nickname avatar photoProfile Level TargetLanguage status")
        .lean(),
      StudentProgress.find({})
        .select("student totalXp completedStories quizAttempts aiMessagesCount updatedAt")
        .lean(),
    ]);

    const progressByStudent = new Map(progressRows.map((progress) => [
      String(progress.student),
      progress,
    ]));

    const rows = students
      .map((student) => {
        const progress = progressByStudent.get(String(student._id)) || {};
        const quizAttempts = progress.quizAttempts || [];
        const passedQuizzesCount = quizAttempts.filter((attempt) => attempt.score >= QUIZ_PASSING_SCORE).length;
        const averageQuizScore = quizAttempts.length
          ? Math.round(quizAttempts.reduce((sum, attempt) => sum + (attempt.score || 0), 0) / quizAttempts.length)
          : 0;

        return {
          id: student._id,
          name: student.nickname || student.username || "طالب",
          avatar: student.avatar || student.photoProfile || "",
          level: student.Level || "Beginner",
          targetLanguage: student.TargetLanguage || "عام",
          status: student.status || "active",
          xp: Number(progress.totalXp) || 0,
          completedStoriesCount: (progress.completedStories || []).length,
          passedQuizzesCount,
          quizAttemptsCount: quizAttempts.length,
          averageQuizScore,
          aiMessagesCount: progress.aiMessagesCount || 0,
          lastActiveAt: progress.updatedAt || null,
        };
      })
      .sort((a, b) => b.xp - a.xp || a.name.localeCompare(b.name, "ar"))
      .map((entry, index) => ({ ...entry, rank: index + 1 }));

    const activeStudents = rows.filter((student) => student.xp > 0 || student.completedStoriesCount > 0 || student.quizAttemptsCount > 0);
    const totalXp = rows.reduce((sum, student) => sum + student.xp, 0);
    const totalCompletedStories = rows.reduce((sum, student) => sum + student.completedStoriesCount, 0);
    const averageQuizScore = rows.length
      ? Math.round(rows.reduce((sum, student) => sum + student.averageQuizScore, 0) / rows.length)
      : 0;

    return res.status(200).json({
      topThree: rows.slice(0, 3),
      students: rows,
      stats: {
        totalStudents: rows.length,
        activeStudents: activeStudents.length,
        totalXp,
        totalCompletedStories,
        averageQuizScore,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching teacher leaderboard", error: error.message });
  }
};

exports.updateStoryProgress = async (req, res) => {
  try {
    const { storyId } = req.params;
    const percent = Math.max(0, Math.min(100, Number(req.body.percent) || 0));
    const stories = await Story.find({ status: "approved" }).select("language vocabulary");
    const progress = await StudentProgress.findOneAndUpdate(
      { student: req.user._id },
      {
        $setOnInsert: { student: req.user._id },
        $pull: { storyProgress: { story: storyId } },
      },
      { new: true, upsert: true }
    );
    const beforeBadges = buildBadges(getProgressStats(progress, stories));
    let xpAwarded = 0;

    progress.storyProgress.push({ story: storyId, percent, updatedAt: new Date() });

    const wasCompleted = progress.completedStories.some((entry) => String(entry.story) === storyId);
    if (percent >= 100 && !wasCompleted) {
      xpAwarded = awardXp(progress, {
        amount: STORY_COMPLETION_XP,
        source: "story_complete",
        sourceId: storyId,
        reason: "Story completed",
      });
      progress.completedStories.push({ story: storyId, completedAt: new Date(), xpAwarded });
    }

    if (percent >= 100) {
      const story = await Story.findById(storyId).select("vocabulary");
      const storyWords = (story?.vocabulary || []).map((entry) => entry.word).filter(Boolean);
      const knownWords = new Set((progress.learnedWords || []).map(normalizeWordId));

      storyWords.forEach((word) => {
        if (!knownWords.has(normalizeWordId(word))) {
          progress.learnedWords.push(word);
          knownWords.add(normalizeWordId(word));
        }
      });
    }

    await progress.save();
    const afterBadges = buildBadges(getProgressStats(progress, stories));
    const earnedBadges = afterBadges.filter((badge) => (
      badge.active && !beforeBadges.some((before) => before.id === badge.id && before.active)
    ));

    return res.status(200).json({
      message: "Story progress saved",
      progress: percent,
      earnedBadges,
      xpAwarded,
      totalXp: progress.totalXp || 0,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error saving story progress", error: error.message });
  }
};

exports.getStories = async (req, res) => {
  try {
    const [stories, progress] = await Promise.all([
      Story.find({ status: "approved" })
        .populate("teacher", "username fullName avatar photoProfile")
        .sort({ createdAt: -1 }),
      StudentProgress.findOneAndUpdate(
        { student: req.user._id },
        { $setOnInsert: { student: req.user._id } },
        { new: true, upsert: true }
      ),
    ]);

    const progressByStory = new Map(
      (progress.storyProgress || []).map((entry) => [String(entry.story), entry.percent])
    );
    const completedAtByStory = new Map(
      (progress.completedStories || []).map((entry) => [String(entry.story), entry.completedAt])
    );

    return res.status(200).json(stories.map((story) => ({
      id: story._id,
      title: story.title,
      language: story.language,
      level: story.level,
      content: story.content,
      coverImage: story.coverImage,
      audioUrl: story.audioUrl,
      vocabulary: story.vocabulary || [],
      personality: story.personality || {
        name: "حكيم القرية",
        tone: "ودود (Friendly)",
        difficulty: 60,
        xp: 50,
      },
      xp: story.personality?.xp || 50,
      teacher: story.teacher
        ? {
            id: story.teacher._id,
            name: story.teacher.fullName || story.teacher.username || "أستاذ",
            avatar: story.teacher.photoProfile || story.teacher.avatar,
          }
        : null,
      progress: progressByStory.get(String(story._id)) || (completedAtByStory.has(String(story._id)) ? 100 : 0),
      completedAt: completedAtByStory.get(String(story._id)) || null,
      createdAt: story.createdAt,
    })));
  } catch (error) {
    return res.status(500).json({ message: "Error fetching student stories", error: error.message });
  }
};

exports.submitQuizAttempt = async (req, res) => {
  try {
    const { examId } = req.params;
    const { answers = [] } = req.body;
    const exam = await Content.findOne({ _id: examId, type: "exam", status: "approved" });

    if (!exam) {
      return res.status(404).json({ message: "Approved quiz not found" });
    }

    const progress = await StudentProgress.findOneAndUpdate(
      { student: req.user._id },
      { $setOnInsert: { student: req.user._id } },
      { new: true, upsert: true }
    );
    const [stories, quizzes] = await Promise.all([
      Story.find({ status: "approved" }).select("language"),
      Content.find({ type: "exam", status: "approved", questions: { $exists: true, $ne: [] } }).select("_id"),
    ]);
    const beforeBadges = buildBadges(getProgressStats(progress, stories, quizzes));

    const answerMap = new Map((Array.isArray(answers) ? answers : []).map((answer) => [
      Number(answer.questionIndex),
      String(answer.answer || "").trim(),
    ]));
    const results = (exam.questions || []).map((question, index) => {
      const givenAnswer = answerMap.get(index) || "";
      const correctAnswer = String(question.correctAnswer || "").trim();
      const isCorrect = givenAnswer.toLowerCase() === correctAnswer.toLowerCase();

      return {
        questionIndex: index,
        isCorrect,
        correctAnswer,
      };
    });
    const correctCount = results.filter((result) => result.isCorrect).length;
    const totalQuestions = results.length;
    const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const passed = score >= QUIZ_PASSING_SCORE;
    const xpAwarded = passed
      ? awardXp(progress, {
          amount: exam.xpReward || 0,
          source: "quiz_pass",
          sourceId: examId,
          reason: "Quiz passed",
        })
      : 0;

    progress.quizAttempts.push({ exam: examId, score, completedAt: new Date(), xpAwarded });
    await progress.save();

    const afterBadges = buildBadges(getProgressStats(progress, stories, quizzes));
    const earnedBadges = afterBadges.filter((badge) => (
      badge.active && !beforeBadges.some((before) => before.id === badge.id && before.active)
    ));

    return res.status(200).json({
      message: "Quiz attempt saved",
      score,
      correctCount,
      totalQuestions,
      results,
      earnedBadges,
      passed,
      xpAwarded,
      totalXp: progress.totalXp || 0,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error saving quiz attempt", error: error.message });
  }
};

exports.getQuizzes = async (req, res) => {
  try {
    const [quizzes, progress] = await Promise.all([
      Content.find({
        type: "exam",
        status: "approved",
        questions: { $exists: true, $ne: [] },
      })
        .populate("storyId", "title coverImage level language")
        .select("title level language thumbnail storyId xpReward questions createdAt")
        .sort({ createdAt: -1 }),
      StudentProgress.findOneAndUpdate(
        { student: req.user._id },
        { $setOnInsert: { student: req.user._id } },
        { new: true, upsert: true }
      ),
    ]);

    return res.status(200).json(quizzes.map((quiz) => {
      const attempts = (progress.quizAttempts || []).filter((attempt) => String(attempt.exam) === String(quiz._id));
      const bestScore = attempts.length ? Math.max(...attempts.map((attempt) => attempt.score || 0)) : null;
      const lastAttempt = attempts.length ? attempts[attempts.length - 1] : null;

      return {
        id: quiz._id,
        title: quiz.title,
        level: quiz.level,
        language: quiz.language,
        xpReward: quiz.xpReward,
        thumbnail: quiz.thumbnail || quiz.storyId?.coverImage,
        story: quiz.storyId
          ? {
              id: quiz.storyId._id,
              title: quiz.storyId.title,
              coverImage: quiz.storyId.coverImage,
              level: quiz.storyId.level,
              language: quiz.storyId.language,
            }
          : null,
        questionsCount: quiz.questions.length,
        bestScore,
        lastScore: lastAttempt?.score ?? null,
        lastAttemptAt: lastAttempt?.completedAt || null,
        attemptsCount: attempts.length,
        questions: quiz.questions.map((question, index) => ({
          id: `${quiz._id}-${index}`,
          index,
          type: question.type,
          text: question.text,
          options: question.options || [],
        })),
      };
    }));
  } catch (error) {
    return res.status(500).json({ message: "Error fetching student quizzes", error: error.message });
  }
};

exports.toggleFavoriteWord = async (req, res) => {
  try {
    const word = String(req.body.word || "").trim();
    if (!word) {
      return res.status(400).json({ message: "Word is required" });
    }

    const progress = await StudentProgress.findOneAndUpdate(
      { student: req.user._id },
      { $setOnInsert: { student: req.user._id } },
      { new: true, upsert: true }
    );

    const exists = progress.favoriteWords.some((item) => normalizeWordId(item) === normalizeWordId(word));
    progress.favoriteWords = exists
      ? progress.favoriteWords.filter((item) => normalizeWordId(item) !== normalizeWordId(word))
      : [...progress.favoriteWords, word];

    await progress.save();
    return res.status(200).json({ word, isFavorite: !exists });
  } catch (error) {
    return res.status(500).json({ message: "Error toggling favorite word", error: error.message });
  }
};
