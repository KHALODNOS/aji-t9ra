const { RtcTokenBuilder, RtcRole } = require('agora-token');
const VoiceRoom = require('../models/VoiceRoom');
const { getIO } = require('../utils/socket');

// Helper to generate Agora token
const generateAgoraTokenHelper = (channelName, roleType) => {
  const appId = process.env.AGORA_APP_ID || "7ba80d0df3f84759902640237eb08d51"; // Default dev fallback
  const appCertificate = process.env.AGORA_APP_CERTIFICATE || "28bc5f94d9b244db8f2b4c2b29de7c61"; // Default dev fallback
  const uid = 0; // Use 0 to let Agora assign uid automatically
  const role = roleType === 'publisher' ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;
  const privilegeExpiredTs = Math.floor(Date.now() / 1000) + 7200; // 2 hours expiration

  try {
    const token = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, uid, role, privilegeExpiredTs);
    return { token, appId };
  } catch (error) {
    console.error("Error generating Agora token:", error);
    return { token: null, appId };
  }
};

// @desc    Generate Agora token directly for a channel
// @route   GET /api/agora/token
// @access  Public (or protected)
exports.generateToken = (req, res) => {
  const channelName = req.query.channelName;
  if (!channelName) return res.status(400).json({ error: 'Channel name is required' });

  const { token, appId } = generateAgoraTokenHelper(channelName, 'publisher');
  res.json({ token, appId });
};

// @desc    Create a new voice room
// @route   POST /api/voice-rooms
// @access  Private (Teacher only)
exports.createVoiceRoom = async (req, res) => {
  try {
    const { title, subjectOfLearn, rules, level, language, maxUsers } = req.body;

    if (!title || !subjectOfLearn || !level || !language || !maxUsers) {
      return res.status(400).json({ message: "يرجى ملء جميع الحقول المطلوبة" });
    }

    // Check if user is a teacher
    if (req.user.Role !== 'teacher') {
      return res.status(403).json({ message: "غير مصرح: يجب أن تكون معلماً لإنشاء صالون صوتي" });
    }

    // Deactivate any active room by this host first to prevent duplicates
    await VoiceRoom.updateMany({ host: req.user._id, isActive: true }, { isActive: false, members: [] });

    const newRoom = new VoiceRoom({
      title,
      subjectOfLearn,
      rules,
      level,
      language,
      maxUsers: Number(maxUsers),
      host: req.user._id,
      isActive: true,
      members: [],
    });

    const savedRoom = await newRoom.save();

    // Populate host details
    await savedRoom.populate('host', 'username photoProfile avatar');

    // Generate Agora token for the teacher (as publisher)
    const channelName = savedRoom._id.toString();
    const { token, appId } = generateAgoraTokenHelper(channelName, 'publisher');

    // Notify clients about new room via Socket
    try {
      const io = getIO();
      io.emit('voice-room:created', savedRoom);
    } catch (e) {
      console.warn("Socket notification failed:", e.message);
    }

    res.status(201).json({
      success: true,
      room: savedRoom,
      token,
      appId,
    });
  } catch (error) {
    console.error("Error creating voice room:", error);
    res.status(500).json({ message: "حدث خطأ أثناء إنشاء الغرفة", error: error.message });
  }
};

// @desc    Get all active voice rooms
// @route   GET /api/voice-rooms
// @access  Private
exports.getAllActiveRooms = async (req, res) => {
  try {
    const rooms = await VoiceRoom.find({ isActive: true })
      .populate('host', 'username photoProfile avatar fluentLanguages')
      .populate('members.user', 'username photoProfile avatar');

    res.status(200).json({
      success: true,
      rooms,
    });
  } catch (error) {
    console.error("Error fetching voice rooms:", error);
    res.status(500).json({ message: "حدث خطأ أثناء جلب الغرف النشطة", error: error.message });
  }
};

// @desc    Get a single voice room details
// @route   GET /api/voice-rooms/:id
// @access  Private
exports.getVoiceRoom = async (req, res) => {
  try {
    const room = await VoiceRoom.findById(req.params.id)
      .populate('host', 'username photoProfile avatar')
      .populate('members.user', 'username photoProfile avatar');

    if (!room || !room.isActive) {
      return res.status(404).json({ message: "الغرفة غير موجودة أو تم إنهاؤها" });
    }

    res.status(200).json({
      success: true,
      room,
    });
  } catch (error) {
    console.error("Error fetching room details:", error);
    res.status(500).json({ message: "حدث خطأ أثناء جلب تفاصيل الغرفة", error: error.message });
  }
};

// @desc    Join an active voice room
// @route   POST /api/voice-rooms/:id/join
// @access  Private
exports.joinVoiceRoom = async (req, res) => {
  try {
    const room = await VoiceRoom.findById(req.params.id);

    if (!room || !room.isActive) {
      return res.status(404).json({ message: "الغرفة غير موجودة أو تم إغلاقها" });
    }

    // Check if room is already full (excluding host and already joined member)
    const isAlreadyMember = room.members.some(m => m.user.toString() === req.user._id.toString());
    const isHost = room.host.toString() === req.user._id.toString();

    if (!isHost && !isAlreadyMember && room.members.length >= room.maxUsers) {
      return res.status(400).json({ message: "عذراً، الغرفة ممتلئة بالكامل" });
    }

    if (!isHost && !isAlreadyMember) {
      room.members.push({
        user: req.user._id,
        isMuted: false,
        joinedAt: new Date()
      });
      await room.save();
    }

    const updatedRoom = await VoiceRoom.findById(req.params.id)
      .populate('host', 'username photoProfile avatar')
      .populate('members.user', 'username photoProfile avatar');

    // Generate Agora token (all participants can speak, so publisher)
    const { token, appId } = generateAgoraTokenHelper(room._id.toString(), 'publisher');

    // Notify other members via socket
    try {
      const io = getIO();
      io.to(`room:${room._id}`).emit('voice-room:user-joined', {
        room: updatedRoom,
        user: {
          _id: req.user._id,
          username: req.user.username,
          avatar: req.user.avatar,
          photoProfile: req.user.photoProfile
        }
      });
      // Emit global update for room counters
      io.emit('voice-room:updated', updatedRoom);
    } catch (e) {
      console.warn("Socket notification failed:", e.message);
    }

    res.status(200).json({
      success: true,
      room: updatedRoom,
      token,
      appId,
    });
  } catch (error) {
    console.error("Error joining voice room:", error);
    res.status(500).json({ message: "حدث خطأ أثناء الانضمام للغرفة", error: error.message });
  }
};

// @desc    Leave a voice room
// @route   POST /api/voice-rooms/:id/leave
// @access  Private
exports.leaveVoiceRoom = async (req, res) => {
  try {
    const room = await VoiceRoom.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: "الغرفة غير موجودة" });
    }

    const isHost = room.host.toString() === req.user._id.toString();

    if (isHost) {
      // If host leaves, we deactivate the room
      room.isActive = false;
      room.members = [];
      await room.save();

      try {
        const io = getIO();
        io.to(`room:${room._id}`).emit('voice-room:ended', { roomId: room._id });
        io.emit('voice-room:removed', room._id);
      } catch (e) {
        console.warn("Socket notification failed:", e.message);
      }
    } else {
      // Remove from members
      room.members = room.members.filter(m => m.user.toString() !== req.user._id.toString());
      await room.save();

      const updatedRoom = await VoiceRoom.findById(room._id)
        .populate('host', 'username photoProfile avatar')
        .populate('members.user', 'username photoProfile avatar');

      try {
        const io = getIO();
        io.to(`room:${room._id}`).emit('voice-room:user-left', {
          roomId: room._id,
          userId: req.user._id,
          room: updatedRoom
        });
        io.emit('voice-room:updated', updatedRoom);
      } catch (e) {
        console.warn("Socket notification failed:", e.message);
      }
    }

    res.status(200).json({
      success: true,
      message: "تم مغادرة الغرفة بنجاح",
    });
  } catch (error) {
    console.error("Error leaving voice room:", error);
    res.status(500).json({ message: "حدث خطأ أثناء مغادرة الغرفة", error: error.message });
  }
};

// @desc    End a voice room (host only)
// @route   DELETE /api/voice-rooms/:id
// @access  Private (Teacher/Host only)
exports.endVoiceRoom = async (req, res) => {
  try {
    const room = await VoiceRoom.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: "الغرفة غير موجودة" });
    }

    if (room.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "غير مصرح: أنت لست منشئ هذه الغرفة" });
    }

    room.isActive = false;
    room.members = [];
    await room.save();

    try {
      const io = getIO();
      io.to(`room:${room._id}`).emit('voice-room:ended', { roomId: room._id });
      io.emit('voice-room:removed', room._id);
    } catch (e) {
      console.warn("Socket notification failed:", e.message);
    }

    res.status(200).json({
      success: true,
      message: "تم إنهاء الغرفة بنجاح",
    });
  } catch (error) {
    console.error("Error ending voice room:", error);
    res.status(500).json({ message: "حدث خطأ أثناء إنهاء الغرفة", error: error.message });
  }
};

// @desc    Kick a user from voice room
// @route   POST /api/voice-rooms/:id/kick
// @access  Private (Teacher/Host only)
exports.kickMember = async (req, res) => {
  try {
    const { userId } = req.body;
    const roomId = req.params.id;

    const room = await VoiceRoom.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "الغرفة غير موجودة" });
    }

    if (room.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "غير مصرح: يجب أن تكون المضيف للقيام بهذا الإجراء" });
    }

    room.members = room.members.filter(m => m.user.toString() !== userId.toString());
    await room.save();

    const updatedRoom = await VoiceRoom.findById(roomId)
      .populate('host', 'username photoProfile avatar')
      .populate('members.user', 'username photoProfile avatar');

    // Notify room and notify kicked user specifically via sockets
    try {
      const io = getIO();
      io.to(`room:${roomId}`).emit('voice-room:user-kicked', {
        roomId,
        userId,
        room: updatedRoom
      });
      io.emit('voice-room:updated', updatedRoom);
    } catch (e) {
      console.warn("Socket notification failed:", e.message);
    }

    res.status(200).json({
      success: true,
      message: "تم طرد المستخدم بنجاح",
      room: updatedRoom
    });
  } catch (error) {
    console.error("Error kicking member:", error);
    res.status(500).json({ message: "حدث خطأ أثناء طرد العضو", error: error.message });
  }
};

// @desc    Mute a user in voice room
// @route   POST /api/voice-rooms/:id/mute
// @access  Private (Teacher/Host only)
exports.muteMember = async (req, res) => {
  try {
    const { userId, isMuted } = req.body;
    const roomId = req.params.id;

    const room = await VoiceRoom.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "الغرفة غير موجودة" });
    }

    if (room.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "غير مصرح: يجب أن تكون المضيف للقيام بهذا الإجراء" });
    }

    // Find member and update
    const memberIndex = room.members.findIndex(m => m.user.toString() === userId.toString());
    if (memberIndex !== -1) {
      room.members[memberIndex].isMuted = isMuted;
      await room.save();
    }

    const updatedRoom = await VoiceRoom.findById(roomId)
      .populate('host', 'username photoProfile avatar')
      .populate('members.user', 'username photoProfile avatar');

    // Notify room of mute state change
    try {
      const io = getIO();
      io.to(`room:${roomId}`).emit('voice-room:user-muted-changed', {
        roomId,
        userId,
        isMuted,
        room: updatedRoom
      });
    } catch (e) {
      console.warn("Socket notification failed:", e.message);
    }

    res.status(200).json({
      success: true,
      message: isMuted ? "تم كتم صوت العضو بنجاح" : "تم إلغاء كتم صوت العضو بنجاح",
      room: updatedRoom
    });
  } catch (error) {
    console.error("Error muting member:", error);
    res.status(500).json({ message: "حدث خطأ أثناء كتم صوت العضو", error: error.message });
  }
};