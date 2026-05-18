import React, { useState, useEffect, useRef } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import api from "../../services/api";
import { useSocket } from "../../context/SocketContext";
import toast from "react-hot-toast";

const AudioSalons = () => {
  const { socket } = useSocket();
  const [currentUser, setCurrentUser] = useState(null);

  // Lists and state
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joinedRoom, setJoinedRoom] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [speakers, setSpeakers] = useState({}); // UID -> volume level

  // Local device states
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerMuted, setIsSpeakerMuted] = useState(false);

  // Step-by-step Room Creation states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    subjectOfLearn: "",
    rules: "",
    level: "Beginner",
    language: "English",
    maxUsers: 10,
  });

  // Agora Refs
  const agoraClientRef = useRef(null);
  const localAudioTrackRef = useRef(null);

  // Load User and initial Active Rooms
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
    }
    fetchActiveRooms();
  }, []);

  const fetchActiveRooms = async () => {
    setLoading(true);
    try {
      const response = await api.get("/voice-rooms");
      if (response.data?.success) {
        setRooms(response.data.rooms);
      }
    } catch (error) {
      console.error("Error fetching voice rooms:", error);
      toast.error("فشل جلب الصالونات الصوتية النشطة");
    } finally {
      setLoading(false);
    }
  };

  // Socket IO Listeners for real-time state sync
  useEffect(() => {
    if (!socket || !currentUser) return;

    // A user joins our joined voice room
    socket.on("voice-room:user-joined", ({ room, user }) => {
      setJoinedRoom((prev) => {
        if (prev && prev._id === room._id) {
          if (user._id !== currentUser._id) {
            toast.success(`${user.username} انضم إلى الصالون`, { icon: "👋" });
          }
          return room;
        }
        return prev;
      });
    });

    // A user leaves our joined voice room
    socket.on("voice-room:user-left", ({ roomId, userId, room }) => {
      setJoinedRoom((prev) => {
        if (prev && prev._id === roomId) {
          const leavingUser = prev.members.find((m) => m.user._id === userId);
          if (leavingUser && userId !== currentUser._id) {
            toast.success(`${leavingUser.user.username} غادر الصالون`, { icon: "🚶" });
          }
          return room;
        }
        return prev;
      });
    });

    // Room is closed by the host teacher
    socket.on("voice-room:ended", ({ roomId }) => {
      setJoinedRoom((prev) => {
        if (prev && prev._id === roomId) {
          toast.error("تم إنهاء الصالون الصوتي من قبل المعلم المضيف", { duration: 5000, icon: "🛑" });
          cleanupAgora();
          return null;
        }
        return prev;
      });
    });

    // User is kicked from voice room
    socket.on("voice-room:user-kicked", ({ roomId, userId, room }) => {
      setJoinedRoom((prev) => {
        if (prev && prev._id === roomId) {
          if (userId === currentUser._id) {
            toast.error("لقد قام المعلم بطردك من الصالون الصوتي!", { duration: 6000, icon: "🚫" });
            cleanupAgora();
            return null;
          } else {
            const kickedUser = prev.members.find((m) => m.user._id === userId);
            if (kickedUser) {
              toast.error(`تم طرد ${kickedUser.user.username} من الصالون`, { icon: "🥾" });
            }
            return room;
          }
        }
        return prev;
      });
    });

    // User is muted/unmuted by the host teacher
    socket.on("voice-room:user-muted-changed", ({ roomId, userId, isMuted: newMuteState, room }) => {
      setJoinedRoom((prev) => {
        if (prev && prev._id === roomId) {
          if (userId === currentUser._id) {
            if (newMuteState) {
              toast.error("لقد تم كتم صوتك من قبل المعلم المضيف!", { duration: 5000, icon: "🔇" });
              if (localAudioTrackRef.current) {
                localAudioTrackRef.current.setMuted(true);
              }
              setIsMuted(true);
            } else {
              toast.success("تم إلغاء كتم صوتك من قبل المعلم المضيف. يمكنك التحدث الآن.", { icon: "🎙️" });
              if (localAudioTrackRef.current) {
                localAudioTrackRef.current.setMuted(false);
              }
              setIsMuted(false);
            }
          } else {
            const affectedUser = prev.members.find((m) => m.user._id === userId);
            if (affectedUser) {
              toast.success(
                `${affectedUser.user.username} ${newMuteState ? "تم كتم صوته" : "يمكنه التحدث الآن"}`,
                { icon: newMuteState ? "🔇" : "🎙️", duration: 3000 }
              );
            }
          }
          return room;
        }
        return prev;
      });
    });

    // Global room listing updates
    socket.on("voice-room:created", (newRoom) => {
      setRooms((prev) => {
        if (prev.some((r) => r._id === newRoom._id)) return prev;
        return [newRoom, ...prev];
      });
    });

    socket.on("voice-room:updated", (updatedRoom) => {
      setRooms((prev) => prev.map((r) => (r._id === updatedRoom._id ? updatedRoom : r)));
    });

    socket.on("voice-room:removed", (roomId) => {
      setRooms((prev) => prev.filter((r) => r._id !== roomId));
    });

    return () => {
      socket.off("voice-room:user-joined");
      socket.off("voice-room:user-left");
      socket.off("voice-room:ended");
      socket.off("voice-room:user-kicked");
      socket.off("voice-room:user-muted-changed");
      socket.off("voice-room:created");
      socket.off("voice-room:updated");
      socket.off("voice-room:removed");
    };
  }, [socket, currentUser]);

  // Clean up Agora instances on unmount
  useEffect(() => {
    return () => {
      cleanupAgora();
    };
  }, []);

  const cleanupAgora = () => {
    try {
      if (localAudioTrackRef.current) {
        localAudioTrackRef.current.stop();
        localAudioTrackRef.current.close();
        localAudioTrackRef.current = null;
      }
      if (agoraClientRef.current) {
        agoraClientRef.current.leave();
        agoraClientRef.current = null;
      }
    } catch (e) {
      console.error("Agora cleanup error:", e);
    }
  };

  // Helper to join Agora channel
  const joinAgoraChannel = async (roomData, token, appId) => {
    try {
      // 1. Create client
      const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
      agoraClientRef.current = client;

      // 2. Set up event listeners
      client.on("user-published", async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        if (mediaType === "audio" && !isSpeakerMuted) {
          user.audioTrack.play();
        }
      });

      client.on("user-unpublished", (user, mediaType) => {
        if (mediaType === "audio" && user.audioTrack) {
          user.audioTrack.stop();
        }
      });

      // 3. Enable volume indicators
      client.enableAudioVolumeIndicator();
      client.on("volume-indicator", (volumes) => {
        const activeSpeakers = {};
        volumes.forEach((vol) => {
          if (vol.level > 10) {
            // vol.uid maps to user
            activeSpeakers[vol.uid] = true;
          }
        });
        setSpeakers(activeSpeakers);
      });

      // 4. Join channel (using numeric UID or random number)
      const randomUid = Math.floor(Math.random() * 900000) + 100000;
      await client.join(appId, roomData._id.toString(), token, randomUid);

      // 5. Create microphone track if host OR not muted by host
      const isMutedByTeacher = roomData.members?.find(m => m.user._id === currentUser._id)?.isMuted;

      if (roomData.host._id === currentUser._id || !isMutedByTeacher) {
        const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        localAudioTrackRef.current = audioTrack;
        await client.publish([audioTrack]);
      } else {
        setIsMuted(true);
        toast("انضممت إلى البث كـ صامت بطلب من المعلم", { icon: "🔇" });
      }

      // 6. Connect via socket room
      if (socket) {
        socket.emit("voice-room:join", {
          roomId: roomData._id,
          userId: currentUser._id,
          username: currentUser.username,
        });
      }
    } catch (err) {
      console.error("Agora join error:", err);
      toast.error("فشل تفعيل خدمات الصوت المباشر: " + err.message);
    }
  };

  // Join Voice Room Action
  const handleJoinRoom = async (roomId) => {
    if (agoraClientRef.current) {
      toast.error("أنت بالفعل في صالون صوتي نشط. يرجى المغادرة أولاً.");
      return;
    }

    setIsConnecting(true);
    const loadingToast = toast.loading("جاري الانضمام للصالون وتجهيز قنوات الصوت...");

    try {
      const response = await api.post(`/voice-rooms/${roomId}/join`);
      if (response.data?.success) {
        const { room, token, appId } = response.data;
        setJoinedRoom(room);
        setIsMuted(false);

        await joinAgoraChannel(room, token, appId);

        toast.dismiss(loadingToast);
        toast.success(`مرحباً بك في صالون: ${room.title}`, { icon: "🎙️" });
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error(error);
      toast.error(error.response?.data?.message || "فشل الانضمام للصالون الصوتي");
      setJoinedRoom(null);
    } finally {
      setIsConnecting(false);
    }
  };

  // Leave Voice Room Action
  const handleLeaveRoom = async () => {
    if (!joinedRoom) return;

    const loadingToast = toast.loading("جاري مغادرة الصالون...");
    try {
      await api.post(`/voice-rooms/${joinedRoom._id}/leave`);
      cleanupAgora();

      if (socket) {
        socket.emit("voice-room:leave", {
          roomId: joinedRoom._id,
          userId: currentUser._id,
        });
      }

      toast.dismiss(loadingToast);
      toast.success("تم مغادرة الصالون الصوتي بنجاح", { icon: "🚪" });
      setJoinedRoom(null);
      fetchActiveRooms();
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error(error);
      toast.error("حدث خطأ أثناء مغادرة الصالون");
    }
  };

  // End Voice Room Action (Host Only)
  const handleEndRoom = async () => {
    if (!joinedRoom) return;

    const confirmEnd = window.confirm("هل أنت متأكد من رغبتك في إنهاء هذا البث الصوتي بالكامل وإغلاق الصالون لجميع المشاركين؟");
    if (!confirmEnd) return;

    const loadingToast = toast.loading("جاري إنهاء البث وإغلاق الصالون...");
    try {
      await api.delete(`/voice-rooms/${joinedRoom._id}`);
      cleanupAgora();

      if (socket) {
        socket.emit("voice-room:leave", {
          roomId: joinedRoom._id,
          userId: currentUser._id,
        });
      }

      toast.dismiss(loadingToast);
      toast.success("تم إنهاء الصالون الصوتي بنجاح", { icon: "🛑" });
      setJoinedRoom(null);
      fetchActiveRooms();
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error(error);
      toast.error("حدث خطأ أثناء محاولة إنهاء الصالون");
    }
  };

  // Toggle Mute Self Action
  const handleToggleSelfMute = async () => {
    if (!localAudioTrackRef.current) {
      toast.error("الميكروفون غير متصل أو نشط حالياً");
      return;
    }

    const isMutedByTeacher = joinedRoom?.members?.find(m => m.user._id === currentUser._id)?.isMuted;
    if (isMutedByTeacher && !isMuted) {
      toast.error("لا يمكنك تفعيل الميكروفون لأن المعلم المضيف كتم صوتك!");
      return;
    }

    try {
      const targetMute = !isMuted;
      await localAudioTrackRef.current.setMuted(targetMute);
      setIsMuted(targetMute);
      toast.success(targetMute ? "تم كتم الميكروفون" : "الميكروفون نشط الآن ويسجل صوتك", {
        icon: targetMute ? "🔇" : "🎙️",
      });
    } catch (e) {
      console.error(e);
      toast.error("فشل تبديل كتم الصوت");
    }
  };

  // Toggle Speaker (Hear Others) Action
  const handleToggleSpeakerMute = () => {
    const targetMute = !isSpeakerMuted;
    setIsSpeakerMuted(targetMute);

    // Mute/Unmute all remote tracks
    if (agoraClientRef.current) {
      agoraClientRef.current.remoteUsers.forEach(user => {
        if (user.audioTrack) {
          if (targetMute) {
            user.audioTrack.stop();
          } else {
            user.audioTrack.play();
          }
        }
      });
    }
    toast.success(targetMute ? "تم كتم صوت الصوت الخارج" : "تم إلغاء كتم الصوت الخارج", {
      icon: targetMute ? "🔇" : "🔊",
    });
  };

  // Host Teacher: Mute/Unmute a member
  const handleToggleMuteMember = async (userId, currentMuteState) => {
    if (!joinedRoom) return;
    try {
      await api.post(`/voice-rooms/${joinedRoom._id}/mute`, {
        userId,
        isMuted: !currentMuteState,
      });
      // The socket event voice-room:user-muted-changed will handle UI updates
    } catch (error) {
      console.error(error);
      toast.error("فشل تغيير حالة كتم صوت العضو");
    }
  };

  // Host Teacher: Kick a member
  const handleKickMember = async (userId) => {
    if (!joinedRoom) return;
    const confirmKick = window.confirm("هل أنت متأكد من رغبتك في طرد هذا العضو خارج الصالون الصوتي؟");
    if (!confirmKick) return;

    try {
      await api.post(`/voice-rooms/${joinedRoom._id}/kick`, { userId });
      // The socket event voice-room:user-kicked will handle updates
    } catch (error) {
      console.error(error);
      toast.error("فشل طرد العضو");
    }
  };

  // Create Room Multi-step Submit
  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
      return;
    }

    const loadingToast = toast.loading("جاري إنشاء الصالون وبدء بثك المباشر...");
    try {
      const response = await api.post("/voice-rooms", formData);
      if (response.data?.success) {
        const { room, token, appId } = response.data;
        setJoinedRoom(room);
        setCreateModalOpen(false);
        setIsMuted(false);

        // Join as the Host Publisher
        await joinAgoraChannel(room, token, appId);

        toast.dismiss(loadingToast);
        toast.success("تم إنشاء صالونك الصوتي بنجاح! البث نشط الآن.", { icon: "🎉" });

        // Reset Form Data
        setFormData({
          title: "",
          subjectOfLearn: "",
          rules: "",
          level: "Beginner",
          language: "English",
          maxUsers: 10,
        });
        setCurrentStep(1);
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error(error);
      toast.error(error.response?.data?.message || "فشل إنشاء الصالون الصوتي المباشر");
    }
  };

  // Language mapping helper
  const translateLang = (lang) => {
    const langs = {
      Arabic: "العربية",
      French: "الفرنسية",
      English: "الإنجليزية",
      Tifinagh: "الأمازيغية (تيفيناغ)",
    };
    return langs[lang] || lang;
  };

  // Level mapping helper
  const translateLevel = (lvl) => {
    const lvls = {
      Beginner: "مبتدئ",
      Intermediate: "متوسط",
      Advanced: "متقدم",
    };
    return lvls[lvl] || lvl;
  };

  // CSS variables inline fallback helper
  const primaryColor = "#5DA296";
  const primaryHover = "#4a8a7f";
  const dangerColor = "#ef4444";

  return (
    <div className="content-area" style={{ padding: "30px", minHeight: "90vh" }}>
      {/* Self-contained CSS Animations for Visualizer & Glow */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float-animation {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }
        @keyframes pulse-glowing {
          0% { box-shadow: 0 0 0 0 rgba(93, 162, 150, 0.5); }
          70% { box-shadow: 0 0 0 15px rgba(93, 162, 150, 0); }
          100% { box-shadow: 0 0 0 0 rgba(93, 162, 150, 0); }
        }
        @keyframes pulse-red-glowing {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.6); }
          70% { box-shadow: 0 0 0 15px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
        @keyframes voice-bounce {
          0%, 100% { height: 6px; }
          50% { height: 25px; }
        }
        .voice-bar {
          width: 3px;
          background-color: #5DA296;
          border-radius: 3px;
          animation: voice-bounce 1s ease-in-out infinite alternate;
        }
        .voice-bar:nth-child(2) { animation-delay: 0.15s; }
        .voice-bar:nth-child(3) { animation-delay: 0.3s; }
        .voice-bar:nth-child(4) { animation-delay: 0.05s; }
        .voice-bar:nth-child(5) { animation-delay: 0.2s; }
      ` }} />

      {/* -------------------- HEADER AREA -------------------- */}
      <header style={{ marginBottom: "35px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <div
            className="live-dot"
            style={{
              width: "14px",
              height: "14px",
              background: "#10b981",
              borderRadius: "50%",
              boxShadow: "0 0 0 5px rgba(16, 185, 129, 0.25)",
            }}
          ></div>
          <h1 style={{ fontSize: "1.9rem", fontWeight: 900, color: "#1A3E2A", margin: 0, fontFamily: "Cairo" }}>
            الصالونات الصوتية التفاعلية المباشرة
          </h1>
        </div>

        {!joinedRoom && currentUser?.Role === "teacher" && (
          <button
            onClick={() => {
              setCreateModalOpen(true);
              setCurrentStep(1);
            }}
            style={{
              backgroundColor: primaryColor,
              color: "#ffffff",
              padding: "12px 25px",
              borderRadius: "12px",
              fontWeight: 800,
              border: "none",
              fontSize: "0.95rem",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
              boxShadow: "0 4px 15px rgba(93, 162, 150, 0.2)",
              transition: "transform 0.2s ease, background-color 0.2s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = primaryHover;
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = primaryColor;
              e.currentTarget.style.transform = "none";
            }}
          >
            <i className="fa-solid fa-plus-circle" style={{ fontSize: "1.1rem" }}></i>
            أنشئ صالوناً صوتياً
          </button>
        )}
      </header>

      {/* -------------------- ROOM ACTIVE DISPLAY CONSOLE -------------------- */}
      {joinedRoom ? (
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 2fr", gap: "30px" }}>
          
          {/* MEMBERS LIST CONSOLE (LEFT) */}
          <section
            style={{
              background: "#ffffff",
              border: "1px solid #E2E8F0",
              borderRadius: "20px",
              padding: "30px",
              boxShadow: "none",
              minHeight: "500px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid #F1F5F9",
                paddingBottom: "18px",
                marginBottom: "20px",
              }}
            >
              <h2 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#1A3E2A", margin: 0, display: "flex", alignItems: "center", gap: "10px" }}>
                <i className="fa-solid fa-users" style={{ color: primaryColor }}></i>
                المشاركون في الصالون ({1 + joinedRoom.members.length} / {joinedRoom.maxUsers})
              </h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "15px", flexGrow: 1, overflowY: "auto", maxHeight: "400px" }}>
              {/* Host Component */}
              <div
                style={{
                  background: "rgba(93, 162, 150, 0.08)",
                  border: `1.5px solid ${primaryColor}`,
                  borderRadius: "15px",
                  padding: "15px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ position: "relative" }}>
                    <img
                      src={joinedRoom.host.photoProfile || `https://i.pravatar.cc/150?u=${joinedRoom.host.username}`}
                      alt="Host Avatar"
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "50%",
                        border: "3px solid #ffffff",
                        animation: "pulse-glowing 2s infinite",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        bottom: "-2px",
                        right: "-2px",
                        background: primaryColor,
                        color: "#fff",
                        borderRadius: "50%",
                        width: "18px",
                        height: "18px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.6rem",
                        border: "2px solid #ffffff",
                      }}
                      title="المعلم المستضيف"
                    >
                      <i className="fa-solid fa-crown"></i>
                    </div>
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, color: "#1A3E2A", fontSize: "0.95rem" }}>
                      {joinedRoom.host.username}
                    </div>
                    <span style={{ fontSize: "0.75rem", background: primaryColor, color: "#ffffff", padding: "2px 8px", borderRadius: "8px", fontWeight: 700 }}>
                      المعلم المستضيف
                    </span>
                  </div>
                </div>

                {/* Speaker indicator for host */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      background: "#ffffff",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: primaryColor,
                      fontSize: "0.95rem",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                    }}
                  >
                    <i className="fa-solid fa-microphone"></i>
                  </div>
                </div>
              </div>

              {/* Members/Students list */}
              {joinedRoom.members.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 10px", color: "#888", fontSize: "0.85rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", flexGrow: 1, justifyContent: "center" }}>
                  <i className="fa-solid fa-hourglass-start" style={{ fontSize: "1.8rem", color: "#cbd5e1" }}></i>
                  <span>بانتظار انضمام الطلاب للغرفة الصوتية...</span>
                </div>
              ) : (
                joinedRoom.members.map((member) => {
                  const isUserMuted = member.isMuted;
                  const isHostSelf = joinedRoom.host._id === currentUser?._id;
                  
                  return (
                    <div
                      key={member.user._id}
                      style={{
                        background: "#F8FAFC",
                        border: "1px solid #E2E8F0",
                        borderRadius: "15px",
                        padding: "12px 15px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ position: "relative" }}>
                          <img
                            src={member.user.photoProfile || member.user.avatar || `https://i.pravatar.cc/150?u=${member.user.username}`}
                            alt={member.user.username}
                            style={{
                              width: "42px",
                              height: "42px",
                              borderRadius: "50%",
                              border: "2px solid #ffffff",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                            }}
                          />
                          {isUserMuted && (
                            <div
                              style={{
                                position: "absolute",
                                bottom: "-2px",
                                right: "-2px",
                                background: dangerColor,
                                color: "#fff",
                                borderRadius: "50%",
                                width: "16px",
                                height: "16px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "0.6rem",
                                border: "2px solid #ffffff",
                              }}
                              title="صامت"
                            >
                              <i className="fa-solid fa-microphone-slash"></i>
                            </div>
                          )}
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, color: "#334155", fontSize: "0.9rem" }}>
                            {member.user.username}
                          </div>
                          <span style={{ fontSize: "0.7rem", color: "#64748b", fontWeight: 700 }}>
                            طالب / مشارك
                          </span>
                        </div>
                      </div>

                      {/* Interactive Controls */}
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        {isHostSelf ? (
                          <>
                            {/* Mute/Unmute student button */}
                            <button
                              onClick={() => handleToggleMuteMember(member.user._id, isUserMuted)}
                              style={{
                                border: "none",
                                background: isUserMuted ? "rgba(239, 68, 68, 0.1)" : "rgba(93, 162, 150, 0.1)",
                                color: isUserMuted ? dangerColor : primaryColor,
                                width: "32px",
                                height: "32px",
                                borderRadius: "8px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                transition: "all 0.2s",
                              }}
                              title={isUserMuted ? "إلغاء كتم الصوت" : "كتم الصوت"}
                            >
                              <i className={`fa-solid ${isUserMuted ? "fa-microphone-slash" : "fa-microphone"}`}></i>
                            </button>

                            {/* Kick student button */}
                            <button
                              onClick={() => handleKickMember(member.user._id)}
                              style={{
                                border: "none",
                                background: "rgba(239, 68, 68, 0.1)",
                                color: dangerColor,
                                width: "32px",
                                height: "32px",
                                borderRadius: "8px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                transition: "all 0.2s",
                              }}
                              title="طرد الطالب"
                            >
                              <i className="fa-solid fa-user-minus"></i>
                            </button>
                          </>
                        ) : (
                          // Indicators only if not host
                          <div style={{ color: isUserMuted ? dangerColor : primaryColor, fontSize: "0.85rem", padding: "5px" }}>
                            <i className={`fa-solid ${isUserMuted ? "fa-microphone-slash" : "fa-microphone"}`}></i>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          {/* MAIN ROOM CONSOLE (RIGHT) */}
          <section
            style={{
              background: "#ffffff",
              border: "1px solid #E2E8F0",
              borderRadius: "20px",
              padding: "35px",
              boxShadow: "none",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Background design accents */}
            <div
              style={{
                position: "absolute",
                top: "-100px",
                right: "-100px",
                width: "250px",
                height: "250px",
                borderRadius: "50%",
                background: "rgba(93, 162, 150, 0.05)",
                zIndex: 0,
              }}
            ></div>

            <div style={{ width: "100%", zIndex: 1 }}>
              {/* Room details header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "25px", borderBottom: "1px solid #F1F5F9", paddingBottom: "20px" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                    <span style={{ fontSize: "0.75rem", background: primaryColor, color: "#fff", padding: "3px 10px", borderRadius: "20px", fontWeight: 800 }}>
                      {translateLang(joinedRoom.language)}
                    </span>
                    <span style={{ fontSize: "0.75rem", background: "#e2e8f0", color: "#475569", padding: "3px 10px", borderRadius: "20px", fontWeight: 800 }}>
                      مستوى {translateLevel(joinedRoom.level)}
                    </span>
                  </div>
                  <h2 style={{ fontSize: "1.45rem", fontWeight: 900, color: "#1A3E2A", margin: 0 }}>
                    {joinedRoom.title}
                  </h2>
                  <div style={{ fontSize: "0.85rem", color: "#64748b", marginTop: "5px", fontWeight: 700 }}>
                    الموضوع التعليمي: <strong style={{ color: "#334155" }}>{joinedRoom.subjectOfLearn}</strong>
                  </div>
                </div>

                <div
                  style={{
                    background: "rgba(16, 185, 129, 0.1)",
                    color: "#10b981",
                    padding: "6px 15px",
                    borderRadius: "10px",
                    fontWeight: 800,
                    fontSize: "0.8rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      background: "#10b981",
                      borderRadius: "50%",
                      animation: "pulse-glowing 1.5s infinite",
                    }}
                  ></span>
                  بث مباشر صوتي
                </div>
              </div>

              {/* Room rules panel */}
              {joinedRoom.rules && (
                <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "15px 20px", marginBottom: "30px" }}>
                  <h4 style={{ margin: "0 0 8px 0", fontSize: "0.85rem", color: "#475569", fontWeight: 800, display: "flex", alignItems: "center", gap: "8px" }}>
                    <i className="fa-solid fa-circle-info" style={{ color: primaryColor }}></i>
                    شروط وقوانين الصالون:
                  </h4>
                  <p style={{ margin: 0, fontSize: "0.8rem", color: "#64748b", fontWeight: 700, lineHeight: 1.5 }}>
                    {joinedRoom.rules}
                  </p>
                </div>
              )}
            </div>

            {/* Giant micro / Voice Visualizer Display */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "15px", margin: "20px 0", zIndex: 1 }}>
              <div
                style={{
                  width: "130px",
                  height: "130px",
                  borderRadius: "50%",
                  background: isMuted ? "rgba(239, 68, 68, 0.05)" : "rgba(93, 162, 150, 0.08)",
                  border: `4px solid ${isMuted ? dangerColor : primaryColor}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: isMuted ? dangerColor : primaryColor,
                  fontSize: "3.2rem",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  animation: !isMuted ? "pulse-glowing 2s infinite" : "none",
                }}
                onClick={handleToggleSelfMute}
                title={isMuted ? "اضغط لإلغاء كتم الميكروفون" : "اضغط لكتم الميكروفون"}
              >
                <i className={`fa-solid ${isMuted ? "fa-microphone-slash" : "fa-microphone"}`}></i>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "4px", height: "30px", marginTop: "10px" }}>
                {!isMuted ? (
                  <>
                    <div className="voice-bar"></div>
                    <div className="voice-bar"></div>
                    <div className="voice-bar"></div>
                    <div className="voice-bar"></div>
                    <div className="voice-bar"></div>
                  </>
                ) : (
                  <span style={{ fontSize: "0.8rem", color: dangerColor, fontWeight: 800 }}>الميكروفون مكتوم</span>
                )}
              </div>
            </div>

            {/* Live Controller Dashboard Action Buttons */}
            <div
              style={{
                width: "100%",
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "15px",
                padding: "20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "30px",
                zIndex: 1,
              }}
            >
              <div style={{ display: "flex", gap: "10px" }}>
                {/* Micro Button Toggle */}
                <button
                  onClick={handleToggleSelfMute}
                  style={{
                    backgroundColor: isMuted ? "rgba(239, 68, 68, 0.15)" : "#ffffff",
                    border: `1px solid ${isMuted ? dangerColor : "#cbd5e1"}`,
                    color: isMuted ? dangerColor : "#475569",
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.1rem",
                    transition: "all 0.2s",
                  }}
                  title={isMuted ? "تفعيل الميكروفون" : "كتم الميكروفون"}
                >
                  <i className={`fa-solid ${isMuted ? "fa-microphone-slash" : "fa-microphone"}`}></i>
                </button>

                {/* Speaker Output Toggle */}
                <button
                  onClick={handleToggleSpeakerMute}
                  style={{
                    backgroundColor: isSpeakerMuted ? "rgba(239, 68, 68, 0.15)" : "#ffffff",
                    border: `1px solid ${isSpeakerMuted ? dangerColor : "#cbd5e1"}`,
                    color: isSpeakerMuted ? dangerColor : "#475569",
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.1rem",
                    transition: "all 0.2s",
                  }}
                  title={isSpeakerMuted ? "سماع الصوت الخارج" : "كتم الصوت الخارج"}
                >
                  <i className={`fa-solid ${isSpeakerMuted ? "fa-volume-xmark" : "fa-volume-high"}`}></i>
                </button>
              </div>

              {joinedRoom.host._id === currentUser?._id ? (
                <button
                  onClick={handleEndRoom}
                  style={{
                    backgroundColor: dangerColor,
                    color: "#ffffff",
                    border: "none",
                    padding: "12px 25px",
                    borderRadius: "12px",
                    fontWeight: 800,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    boxShadow: "0 4px 12px rgba(239, 68, 68, 0.2)",
                  }}
                >
                  <i className="fa-solid fa-stop"></i>
                  إنهاء البث وإغلاق الصالون
                </button>
              ) : (
                <button
                  onClick={handleLeaveRoom}
                  style={{
                    backgroundColor: "#e2e8f0",
                    color: "#475569",
                    border: "none",
                    padding: "12px 25px",
                    borderRadius: "12px",
                    fontWeight: 800,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <i className="fa-solid fa-door-open"></i>
                  مغادرة الصالون
                </button>
              )}
            </div>
          </section>
        </div>
      ) : (
        /* -------------------- ROOMS DIRECTORY (DEFAULT OVERVIEW) -------------------- */
        <div>
          {/* Active Rooms Grid */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#1A3E2A", margin: 0 }}>
                صالونات النقاش الصوتي النشطة حالياً
              </h3>
              <div
                style={{
                  background: "#F1F5F9",
                  padding: "6px 15px",
                  borderRadius: "10px",
                  fontSize: "0.85rem",
                  color: "#475569",
                  fontWeight: 800,
                }}
              >
                {rooms.length} صالونات نشطة
              </div>
            </div>

            {loading ? (
              <div style={{ textAlign: "center", padding: "80px 10px" }}>
                <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: "2.5rem", color: primaryColor, marginBottom: "15px" }}></i>
                <div style={{ color: "#64748b", fontWeight: 700, fontSize: "0.95rem" }}>جاري تحميل الصالونات الصوتية النشطة...</div>
              </div>
            ) : rooms.length === 0 ? (
              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid #E2E8F0",
                  borderRadius: "20px",
                  padding: "80px 30px",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "15px",
                }}
              >
                <div
                  style={{
                    width: "70px",
                    height: "70px",
                    borderRadius: "50%",
                    background: "rgba(93, 162, 150, 0.08)",
                    color: primaryColor,
                    fontSize: "2.2rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "10px",
                  }}
                >
                  <i className="fa-solid fa-microphone-lines"></i>
                </div>
                <h4 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800, color: "#1A3E2A" }}>
                  لا توجد صالونات صوتية مفتوحة حالياً
                </h4>
                <p style={{ margin: 0, color: "#64748b", fontSize: "0.9rem", maxWidth: "450px", fontWeight: 700 }}>
                  يرجى الانتظار لحين بدء صالون من أحد المعلمين، أو إذا كنت معلماً، يمكنك الضغط على زر "أنشئ صالوناً صوتياً" بالأعلى للبدء فوراً!
                </p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "25px" }}>
                {rooms.map((room) => (
                  <div
                    key={room._id}
                    className="card-3d"
                    style={{
                      background: "#ffffff",
                      border: "1px solid #E2E8F0",
                      borderRadius: "20px",
                      padding: "25px",
                      transition: "transform 0.2s ease, border-color 0.2s ease",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {/* Level/Lang floating badges */}
                    <div style={{ display: "flex", gap: "6px", position: "absolute", top: "25px", left: "25px" }}>
                      <span style={{ fontSize: "0.7rem", background: "rgba(93, 162, 150, 0.1)", color: primaryColor, padding: "3px 10px", borderRadius: "12px", fontWeight: 800 }}>
                        {translateLang(room.language)}
                      </span>
                      <span style={{ fontSize: "0.7rem", background: "#f1f5f9", color: "#475569", padding: "3px 10px", borderRadius: "12px", fontWeight: 800 }}>
                        مستوى {translateLevel(room.level)}
                      </span>
                    </div>

                    {/* Room Info */}
                    <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px" }}>
                      <img
                        src={room.host?.photoProfile || room.host?.avatar || `https://i.pravatar.cc/150?u=${room.host?.username}`}
                        alt="Host Avatar"
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "50%",
                          border: "3px solid #f1f5f9",
                        }}
                      />
                      <div>
                        <div style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 700 }}>صالون المعلم المضيف:</div>
                        <div style={{ fontWeight: 800, color: "#1A3E2A", fontSize: "0.95rem" }}>
                          {room.host?.username || "معلم منصة لغتي"}
                        </div>
                      </div>
                    </div>

                    <h4 style={{ margin: "0 0 10px 0", fontSize: "1.15rem", fontWeight: 800, color: "#1A3E2A" }}>
                      {room.title}
                    </h4>

                    <div style={{ fontSize: "0.85rem", color: "#475569", marginBottom: "18px", fontWeight: 700, display: "flex", gap: "5px" }}>
                      <span>الموضوع:</span>
                      <span style={{ color: "#334155", fontWeight: 800 }}>{room.subjectOfLearn}</span>
                    </div>

                    {/* Attendance status */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderTop: "1px solid #f1f5f9",
                        paddingTop: "15px",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8rem", color: "#64748b", fontWeight: 700 }}>
                        <i className="fa-solid fa-users" style={{ color: "#94a3b8" }}></i>
                        <span>عدد الحضور:</span>
                        <strong style={{ color: "#334155" }}>
                          {room.members?.length || 0} / {room.maxUsers}
                        </strong>
                      </div>

                      <button
                        onClick={() => handleJoinRoom(room._id)}
                        disabled={isConnecting}
                        style={{
                          backgroundColor: primaryColor,
                          color: "#ffffff",
                          border: "none",
                          padding: "8px 22px",
                          borderRadius: "10px",
                          fontWeight: 800,
                          fontSize: "0.85rem",
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = primaryHover;
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = primaryColor;
                        }}
                      >
                        انضمام للصالون
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* -------------------- STEP BY STEP ROOM CREATION MODAL -------------------- */}
      {createModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.45)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#ffffff",
              width: "560px",
              borderRadius: "24px",
              padding: "35px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
              position: "relative",
              direction: "rtl",
              textAlign: "right",
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => {
                setCreateModalOpen(false);
                setCurrentStep(1);
              }}
              style={{
                position: "absolute",
                top: "25px",
                left: "25px",
                background: "#f1f5f9",
                border: "none",
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#64748b",
                fontSize: "0.9rem",
              }}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            <h3 style={{ margin: "0 0 10px 0", fontSize: "1.35rem", fontWeight: 900, color: "#1A3E2A" }}>
              إنشاء صالون صوتي جديد
            </h3>
            <p style={{ margin: "0 0 25px 0", fontSize: "0.85rem", color: "#64748b", fontWeight: 700 }}>
              قم بإعداد الصالون بالكامل خلال خطوات بسيطة ومباشرة لبدء التعلم مع طلابك
            </p>

            {/* Stepper Progress Bar */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", position: "relative" }}>
              <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: "3px", backgroundColor: "#f1f5f9", zIndex: 0 }}></div>
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  right: 0,
                  width: currentStep === 1 ? "0%" : currentStep === 2 ? "50%" : "100%",
                  height: "3px",
                  backgroundColor: primaryColor,
                  transition: "width 0.3s ease",
                  zIndex: 0,
                }}
              ></div>

              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    backgroundColor: currentStep >= step ? primaryColor : "#ffffff",
                    border: `3px solid ${currentStep >= step ? primaryColor : "#cbd5e1"}`,
                    color: currentStep >= step ? "#ffffff" : "#64748b",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: "0.85rem",
                    zIndex: 1,
                    transition: "all 0.3s ease",
                  }}
                >
                  {step}
                </div>
              ))}
            </div>

            <form onSubmit={handleCreateRoom}>
              {/* STEP 1: TITLE & SUBJECT OF LEARN */}
              {currentStep === 1 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                  <div style={{ display: "flex", gap: "8px", color: primaryColor, fontWeight: 800, fontSize: "0.9rem", marginBottom: "-5px" }}>
                    <i className="fa-solid fa-circle-question"></i>
                    <span>الخطوة 1: أدخل عنوان الصالون وموضوع التعليم</span>
                  </div>

                  <div className="form-group">
                    <label style={{ display: "block", fontWeight: 800, fontSize: "0.85rem", marginBottom: "8px", color: "#475569" }}>
                      عنوان الغرفة الصوتية
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="مثال: ممارسة محادثات الفندق وحجز السكن"
                      style={{
                        width: "100%",
                        padding: "12px 15px",
                        borderRadius: "12px",
                        border: "1.5px solid #cbd5e1",
                        outline: "none",
                        fontSize: "0.9rem",
                        fontFamily: "Inter, Cairo",
                      }}
                    />
                  </div>

                  <div className="form-group">
                    <label style={{ display: "block", fontWeight: 800, fontSize: "0.85rem", marginBottom: "8px", color: "#475569" }}>
                      الموضوع التعليمي / محور التعلم
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.subjectOfLearn}
                      onChange={(e) => setFormData({ ...formData, subjectOfLearn: e.target.value })}
                      placeholder="مثال: المصطلحات الطبية أو التحدث الحر اليومي"
                      style={{
                        width: "100%",
                        padding: "12px 15px",
                        borderRadius: "12px",
                        border: "1.5px solid #cbd5e1",
                        outline: "none",
                        fontSize: "0.9rem",
                        fontFamily: "Inter, Cairo",
                      }}
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: LANGUAGE, LEVEL & RULES */}
              {currentStep === 2 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                  <div style={{ display: "flex", gap: "8px", color: primaryColor, fontWeight: 800, fontSize: "0.9rem", marginBottom: "-5px" }}>
                    <i className="fa-solid fa-language"></i>
                    <span>الخطوة 2: المستوى واللغة والشروط والقوانين</span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                    <div className="form-group">
                      <label style={{ display: "block", fontWeight: 800, fontSize: "0.85rem", marginBottom: "8px", color: "#475569" }}>
                        اللغة المعتمدة
                      </label>
                      <select
                        value={formData.language}
                        onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                        style={{
                          width: "100%",
                          padding: "12px 15px",
                          borderRadius: "12px",
                          border: "1.5px solid #cbd5e1",
                          outline: "none",
                          fontSize: "0.9rem",
                          fontFamily: "Cairo",
                        }}
                      >
                        <option value="Arabic">العربية</option>
                        <option value="French">الفرنسية</option>
                        <option value="English">الإنجليزية</option>
                        <option value="Tifinagh">الأمازيغية</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label style={{ display: "block", fontWeight: 800, fontSize: "0.85rem", marginBottom: "8px", color: "#475569" }}>
                        مستوى الصعوبة
                      </label>
                      <select
                        value={formData.level}
                        onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                        style={{
                          width: "100%",
                          padding: "12px 15px",
                          borderRadius: "12px",
                          border: "1.5px solid #cbd5e1",
                          outline: "none",
                          fontSize: "0.9rem",
                          fontFamily: "Cairo",
                        }}
                      >
                        <option value="Beginner">مبتدئ (Beginner)</option>
                        <option value="Intermediate">متوسط (Intermediate)</option>
                        <option value="Advanced">متقدم (Advanced)</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label style={{ display: "block", fontWeight: 800, fontSize: "0.85rem", marginBottom: "8px", color: "#475569" }}>
                      قوانين وشروط الغرفة
                    </label>
                    <textarea
                      value={formData.rules}
                      onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                      placeholder="أدخل أي شروط مخصصة مثل: الاحترام الكامل، ممنوع مقاطعة الآخرين أثناء التحدث..."
                      style={{
                        width: "100%",
                        height: "80px",
                        padding: "12px 15px",
                        borderRadius: "12px",
                        border: "1.5px solid #cbd5e1",
                        outline: "none",
                        fontSize: "0.9rem",
                        fontFamily: "Inter, Cairo",
                        resize: "none",
                      }}
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: NUMBER OF USERS */}
              {currentStep === 3 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div style={{ display: "flex", gap: "8px", color: primaryColor, fontWeight: 800, fontSize: "0.9rem", marginBottom: "-5px" }}>
                    <i className="fa-solid fa-users"></i>
                    <span>الخطوة 3: الحد الأقصى للمشاركين</span>
                  </div>

                  <div className="form-group" style={{ textAlign: "center", padding: "20px 0" }}>
                    <label style={{ display: "block", fontWeight: 800, fontSize: "0.95rem", marginBottom: "15px", color: "#475569" }}>
                      الحد الأقصى لعدد الطلاب المتواجدين معاً
                    </label>

                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "20px", marginBottom: "20px" }}>
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, maxUsers: Math.max(1, prev.maxUsers - 1) }))}
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          border: "1px solid #cbd5e1",
                          background: "#ffffff",
                          fontSize: "1.2rem",
                          fontWeight: 800,
                          cursor: "pointer",
                          color: "#475569",
                        }}
                      >
                        -
                      </button>
                      <span style={{ fontSize: "2.4rem", fontWeight: 900, color: primaryColor, width: "80px", textAlign: "center" }}>
                        {formData.maxUsers}
                      </span>
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, maxUsers: Math.min(25, prev.maxUsers + 1) }))}
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          border: "1px solid #cbd5e1",
                          background: "#ffffff",
                          fontSize: "1.2rem",
                          fontWeight: 800,
                          cursor: "pointer",
                          color: "#475569",
                        }}
                      >
                        +
                      </button>
                    </div>

                    <input
                      type="range"
                      min="1"
                      max="25"
                      value={formData.maxUsers}
                      onChange={(e) => setFormData({ ...formData, maxUsers: Number(e.target.value) })}
                      style={{
                        width: "80%",
                        height: "6px",
                        accentColor: primaryColor,
                        cursor: "pointer",
                      }}
                    />

                    <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "12px", fontWeight: 700 }}>
                      موصى به: من 10 إلى 15 طالباً لضمان أفضل جودة نقاش ومشاركة صوتية.
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Action Buttons */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "35px",
                  borderTop: "1px solid #F1F5F9",
                  paddingTop: "20px",
                }}
              >
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep((prev) => prev - 1)}
                    style={{
                      border: "1px solid #cbd5e1",
                      background: "#ffffff",
                      color: "#475569",
                      padding: "10px 22px",
                      borderRadius: "12px",
                      fontWeight: 800,
                      cursor: "pointer",
                      fontSize: "0.9rem",
                    }}
                  >
                    السابق
                  </button>
                ) : (
                  <div />
                )}

                <button
                  type="submit"
                  style={{
                    backgroundColor: primaryColor,
                    color: "#ffffff",
                    border: "none",
                    padding: "10px 25px",
                    borderRadius: "12px",
                    fontWeight: 800,
                    cursor: "pointer",
                    fontSize: "0.9rem",
                  }}
                >
                  {currentStep === 3 ? "بدء البث الصوتي المباشر" : "التالي"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioSalons;
