import React, { useEffect, useMemo, useRef, useState } from "react";
import api from "../../services/api";
import { publishStudentRewards } from "../../utils/studentRewards";

const getMediaUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/${path.replace(/\\/g, "/")}`;
};

const getCommentAuthor = (comment) => (
  comment.student?.fullName || comment.student?.username || "طالب"
);

const ShowVideo = ({ onClose }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [error, setError] = useState("");
  const [activeVideoId, setActiveVideoId] = useState(null);
  const [likedVideos, setLikedVideos] = useState(() => new Set());
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const videoRefs = useRef({});
  const watchedVideos = useRef(new Set());

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await api.get("/videos/approved");
        setVideos(response.data || []);
        setActiveVideoId(response.data?.[0]?._id || null);
      } catch (err) {
        console.error("Error loading videos:", err);
        setError(err.response?.data?.message || "تعذر تحميل الفيديوهات.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  useEffect(() => {
    if (!videos.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const videoId = entry.target.dataset.videoId;
          const media = videoRefs.current[videoId];
          if (!media) return;

          if (entry.isIntersecting) {
            setActiveVideoId(videoId);
            media.play().catch(() => {});
            recordWatch(videoId);
          } else {
            media.pause();
          }
        });
      },
      { threshold: 0.72 }
    );

    videos.forEach((video) => {
      const media = videoRefs.current[video._id];
      if (media) observer.observe(media);
    });

    return () => observer.disconnect();
  }, [videos]);

  const activeVideo = useMemo(
    () => videos.find((video) => video._id === activeVideoId) || videos[0],
    [activeVideoId, videos]
  );

  const activeComments = activeVideo?.comments || [];

  const recordActivity = async (payload) => {
    try {
      const response = await api.post("/student/journey/activity", payload);
      publishStudentRewards({ earnedBadges: response.data?.earnedBadges || [] });
    } catch (err) {
      console.error("Error recording video activity:", err);
    }
  };

  const recordWatch = (videoId) => {
    if (!videoId || watchedVideos.current.has(videoId)) return;
    watchedVideos.current.add(videoId);
    recordActivity({ type: "video_watch", videoId });
  };

  const toggleReaction = (videoId) => {
    setLikedVideos((current) => {
      const next = new Set(current);
      if (next.has(videoId)) {
        next.delete(videoId);
      } else {
        next.add(videoId);
        recordActivity({ type: "video_reaction", videoId, reaction: "like" });
      }
      return next;
    });
  };

  const submitComment = async (event) => {
    event.preventDefault();
    const text = commentText.trim();
    if (!text || !activeVideo?._id || submittingComment) return;

    setSubmittingComment(true);
    try {
      const response = await api.post(`/videos/${activeVideo._id}/comments`, { text });
      const nextComment = response.data?.comment;

      setVideos((current) => current.map((video) => (
        video._id === activeVideo._id
          ? { ...video, comments: [...(video.comments || []), nextComment] }
          : video
      )));
      setCommentText("");
      setCommentsOpen(true);
    } catch (err) {
      console.error("Error submitting comment:", err);
      setError(err.response?.data?.message || "تعذر إرسال التعليق.");
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="show-video-state" dir="rtl">
        <i className="fa-solid fa-circle-notch fa-spin"></i>
        <span>جاري تحميل الفيديوهات...</span>
      </div>
    );
  }

  if (error && !videos.length) {
    return (
      <div className="show-video-state error" dir="rtl">
        <i className="fa-solid fa-triangle-exclamation"></i>
        <span>{error}</span>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css');

        html, body, #root {
          min-height: 100%;
          background: #000000;
        }

        .show-video-page {
          direction: rtl;
          font-family: 'Tajawal', sans-serif;
          width: 100vw;
          height: 100vh;
          background: #000000;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .show-video-state {
          width: 100vw;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          background: #000000;
          color: #ffffff;
          font-family: 'Tajawal', sans-serif;
          font-weight: 900;
        }

        .show-video-state.error { color: #fca5a5; }

        .video-stage {
          position: relative;
          width: min(420px, calc(100vw - 126px));
          height: min(860px, calc(100vh - 40px));
          background: #000000;
          border-radius: 34px;
          overflow: visible;
        }

        .video-feed {
          width: 100%;
          height: 100%;
          background: #000000;
          border-radius: 34px;
          overflow-y: auto;
          scroll-snap-type: y mandatory;
          scrollbar-width: none;
          box-shadow: 0 28px 90px rgba(0, 0, 0, 0.58);
        }

        .video-feed::-webkit-scrollbar { display: none; }

        .video-slide {
          width: 100%;
          height: 100%;
          min-height: 100%;
          scroll-snap-align: start;
          background: #000000;
          position: relative;
          overflow: hidden;
        }

        .video-media,
        .video-poster {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          cursor: pointer;
        }

        .video-actions {
          position: absolute;
          left: 18px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          gap: 28px;
          z-index: 5;
        }

        .video-close-btn {
          position: fixed;
          top: 22px;
          left: 24px;
          z-index: 20;
          width: 46px;
          height: 46px;
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.12);
          color: #ffffff;
          display: grid;
          place-items: center;
          cursor: pointer;
          backdrop-filter: blur(8px);
        }

        .video-close-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .video-action-group {
          display: grid;
          justify-items: center;
          gap: 9px;
        }

        .video-action {
          width: 56px;
          height: 56px;
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.12);
          color: #ffffff;
          display: grid;
          place-items: center;
          cursor: pointer;
          backdrop-filter: blur(8px);
        }

        .video-action.active {
          background: #5DA296;
          border-color: #5DA296;
        }

        .video-action i {
          font-size: 1.2rem;
        }

        .video-action-label {
          color: #ffffff;
          font-size: 0.75rem;
          font-weight: 900;
          line-height: 1;
        }

        .comments-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.62);
          backdrop-filter: blur(4px);
          z-index: 1500;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding: 24px;
        }

        .comments-sheet {
          width: min(430px, calc(100vw - 32px));
          max-height: min(620px, 82vh);
          background: #ffffff;
          border-radius: 28px 28px 22px 22px;
          box-shadow: 0 26px 70px rgba(0, 0, 0, 0.34);
          padding: 18px;
          direction: rtl;
          display: flex;
          flex-direction: column;
          animation: commentsRise 0.22s ease-out;
        }

        @keyframes commentsRise {
          from { transform: translateY(24px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .comments-handle {
          width: 46px;
          height: 5px;
          border-radius: 999px;
          background: #dbe4ea;
          margin: 0 auto 14px;
        }

        .comments-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding-bottom: 16px;
          border-bottom: 1px solid #eef2f7;
        }

        .comments-header h3 {
          margin: 0;
          color: #315b55;
          font-size: 1.05rem;
          font-weight: 900;
        }

        .comments-close {
          border: 0;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #f2f8f7;
          color: #5DA296;
          cursor: pointer;
          flex-shrink: 0;
        }

        .comments-list {
          display: grid;
          gap: 14px;
          overflow-y: auto;
          padding: 18px 2px;
        }

        .comment-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .comment-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          object-fit: cover;
          background: #f2f8f7;
          flex-shrink: 0;
        }

        .comment-bubble {
          flex: 1;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 11px 13px;
        }

        .comment-bubble strong {
          display: block;
          color: #5DA296;
          font-size: 0.78rem;
          font-weight: 900;
          margin-bottom: 4px;
        }

        .comment-bubble span {
          color: #334155;
          font-size: 0.85rem;
          font-weight: 700;
          line-height: 1.55;
        }

        .empty-comments {
          text-align: center;
          color: #64748b;
          padding: 30px 10px;
          font-weight: 800;
        }

        .empty-comments i {
          display: block;
          color: #5DA296;
          font-size: 1.8rem;
          margin-bottom: 10px;
        }

        .comment-form {
          display: flex;
          gap: 10px;
          padding-top: 16px;
          border-top: 1px solid #eef2f7;
        }

        .comment-form input {
          flex: 1;
          min-width: 0;
          border: 1px solid #dbe4ea;
          background: #f8fafc;
          border-radius: 16px;
          padding: 13px 14px;
          font-family: inherit;
          font-weight: 800;
          outline: none;
        }

        .comment-form input:focus {
          border-color: #5DA296;
          box-shadow: 0 0 0 3px rgba(93, 162, 150, 0.12);
          background: #ffffff;
        }

        .comment-form button {
          border: 0;
          width: 48px;
          border-radius: 16px;
          background: #5DA296;
          color: #ffffff;
          cursor: pointer;
          flex-shrink: 0;
        }

        .comment-form button:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .empty-video-state {
          color: #ffffff;
          font-weight: 900;
          text-align: center;
          display: grid;
          gap: 12px;
        }

        .empty-video-state i {
          color: #5DA296;
          font-size: 2.3rem;
        }

        @media (max-width: 560px) {
          .video-stage {
            width: calc(100vw - 104px);
            height: calc(100vh - 28px);
            border-radius: 28px;
          }

          .video-feed {
            border-radius: 28px;
          }

          .video-actions {
            left: 14px;
            gap: 22px;
          }

          .video-action {
            width: 48px;
            height: 48px;
          }
        }
      `}</style>

      <div className="show-video-page">
        <button className="video-close-btn" type="button" onClick={onClose} title="Close">
          <i className="fa-solid fa-xmark"></i>
        </button>

        {videos.length ? (
          <section className="video-stage" aria-label="فيديوهات قصيرة">
            <div className="video-feed">
              {videos.map((video) => {
                const isLiked = likedVideos.has(video._id);
                const commentsCount = (video.comments || []).length;

                return (
                  <article className="video-slide" key={video._id}>
                    {video.url ? (
                      <video
                        ref={(node) => {
                          if (node) videoRefs.current[video._id] = node;
                        }}
                        data-video-id={video._id}
                        className="video-media"
                        src={getMediaUrl(video.url)}
                        poster={getMediaUrl(video.thumbnail)}
                        playsInline
                        muted
                        loop
                        controls={false}
                        onClick={(event) => {
                          if (event.currentTarget.paused) event.currentTarget.play().catch(() => {});
                          else event.currentTarget.pause();
                        }}
                      />
                    ) : (
                      <img className="video-poster" src={getMediaUrl(video.thumbnail)} alt={video.title} />
                    )}

                    <div className="video-actions">
                      <div className="video-action-group">
                        <button
                          type="button"
                          className={`video-action ${isLiked ? "active" : ""}`}
                          onClick={() => toggleReaction(video._id)}
                          title="Like"
                        >
                          <i className="fa-solid fa-heart"></i>
                        </button>
                        <span className="video-action-label">{isLiked ? "1" : "0"}</span>
                      </div>

                      <div className="video-action-group">
                        <button
                          type="button"
                          className="video-action"
                          onClick={() => {
                            setActiveVideoId(video._id);
                            setCommentsOpen(true);
                          }}
                          title="Comments"
                        >
                          <i className="fa-solid fa-comment-dots"></i>
                        </button>
                        <span className="video-action-label">{commentsCount}</span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ) : (
          <div className="empty-video-state">
            <i className="fa-regular fa-circle-play"></i>
            <span>لا توجد فيديوهات معتمدة حاليا.</span>
          </div>
        )}
      </div>

      {commentsOpen && activeVideo && (
        <div className="comments-backdrop" onClick={() => setCommentsOpen(false)}>
          <section className="comments-sheet" onClick={(event) => event.stopPropagation()}>
            <div className="comments-handle"></div>
            <header className="comments-header">
              <h3>التعليقات</h3>
              <button className="comments-close" type="button" onClick={() => setCommentsOpen(false)} title="إغلاق">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </header>

            <div className="comments-list">
              {activeComments.length ? (
                activeComments.map((comment) => (
                  <div className="comment-item" key={comment._id || comment.id}>
                    <img
                      className="comment-avatar"
                      src={getMediaUrl(comment.student?.avatarUrl) || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80"}
                      alt={getCommentAuthor(comment)}
                    />
                    <div className="comment-bubble">
                      <strong>{getCommentAuthor(comment)}</strong>
                      <span>{comment.text}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-comments">
                  <i className="fa-regular fa-comment-dots"></i>
                  <span>لا توجد تعليقات بعد. اكتب أول تعليق.</span>
                </div>
              )}
            </div>

            <form className="comment-form" onSubmit={submitComment}>
              <input
                value={commentText}
                onChange={(event) => setCommentText(event.target.value)}
                placeholder="اكتب تعليقك..."
              />
              <button type="submit" disabled={submittingComment || !commentText.trim()} title="إرسال">
                <i className={submittingComment ? "fa-solid fa-circle-notch fa-spin" : "fa-solid fa-paper-plane"}></i>
              </button>
            </form>
          </section>
        </div>
      )}
    </>
  );
};

export default ShowVideo;
