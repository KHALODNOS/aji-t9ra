import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import api from "../../services/api";

const statusLabels = {
  all: "الكل",
  open: "مفتوحة",
  in_progress: "قيد المعالجة",
  resolved: "محلولة",
};

const priorityLabels = {
  low: "منخفضة",
  normal: "عادية",
  high: "عالية",
  urgent: "عاجلة",
};

const statusClass = {
  open: "open",
  in_progress: "progress",
  resolved: "resolved",
};

const priorityClass = {
  low: "low",
  normal: "normal",
  high: "high",
  urgent: "urgent",
};

const getTeacherName = (request) => (
  request.teacher?.fullName || request.teacher?.username || "أستاذ غير محدد"
);

const TechnicalSupport = () => {
  const [requests, setRequests] = useState([]);
  const [activeStatus, setActiveStatus] = useState("all");
  const [selectedId, setSelectedId] = useState("");
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRequests = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get(`/admin/support-requests?status=${activeStatus}`);
      setRequests(response.data || []);
      setSelectedId((current) => current || response.data?.[0]?._id || "");
    } catch (err) {
      console.error("Error loading support requests:", err);
      setError(err.response?.data?.message || "تعذر تحميل طلبات الدعم الفني.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [activeStatus]);

  const filteredRequests = useMemo(() => {
    const needle = searchText.trim().toLowerCase();
    if (!needle) return requests;

    return requests.filter((request) => (
      request.subject?.toLowerCase().includes(needle) ||
      request.message?.toLowerCase().includes(needle) ||
      getTeacherName(request).toLowerCase().includes(needle) ||
      request.email?.toLowerCase().includes(needle)
    ));
  }, [requests, searchText]);

  const selectedRequest = useMemo(
    () => filteredRequests.find((request) => request._id === selectedId) || filteredRequests[0],
    [filteredRequests, selectedId]
  );

  const stats = useMemo(() => ({
    total: requests.length,
    open: requests.filter((request) => request.status === "open").length,
    inProgress: requests.filter((request) => request.status === "in_progress").length,
    urgent: requests.filter((request) => request.priority === "urgent" || request.priority === "high").length,
  }), [requests]);

  const updateStatus = async (requestId, status) => {
    try {
      const response = await api.put(`/admin/support-requests/${requestId}/status`, { status });
      setRequests((current) => current.map((request) => (
        request._id === requestId ? response.data : request
      )));
    } catch (err) {
      console.error("Error updating support request:", err);
      setError(err.response?.data?.message || "تعذر تحديث حالة الطلب.");
    }
  };

  return (
    <AdminLayout>
      <div className="admin-support-page" dir="rtl">
        <style>{`
          .admin-support-page {
            display: grid;
            gap: 22px;
          }

          .support-hero {
            background: #ffffff;
            border: 1px solid #e5edf5;
            border-radius: 28px;
            padding: 26px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 22px;
            box-shadow: 0 18px 45px rgba(15, 23, 42, 0.05);
          }

          .support-eyebrow {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: #eef6ff;
            color: #003F87;
            padding: 7px 12px;
            border-radius: 999px;
            font-size: 0.78rem;
            font-weight: 900;
            margin-bottom: 12px;
          }

          .support-hero h1 {
            margin: 0;
            color: #0f172a;
            font-size: 2.15rem;
            font-weight: 950;
            letter-spacing: 0;
          }

          .support-hero p {
            margin: 8px 0 0;
            max-width: 680px;
            color: #64748b;
            font-weight: 750;
            line-height: 1.75;
          }

          .support-search {
            width: min(360px, 100%);
            position: relative;
            flex-shrink: 0;
          }

          .support-search input {
            width: 100%;
            border: 1px solid #dbe5ef;
            background: #f8fafc;
            border-radius: 18px;
            padding: 14px 44px 14px 14px;
            outline: none;
            font-weight: 800;
          }

          .support-search input:focus {
            background: #ffffff;
            border-color: #003F87;
            box-shadow: 0 0 0 4px rgba(0, 63, 135, 0.08);
          }

          .support-search i {
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
            color: #94a3b8;
          }

          .support-metrics {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 14px;
          }

          .support-metric {
            background: #ffffff;
            border: 1px solid #e5edf5;
            border-radius: 22px;
            padding: 18px;
            box-shadow: 0 14px 34px rgba(15, 23, 42, 0.04);
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
          }

          .metric-label {
            color: #64748b;
            font-size: 0.82rem;
            font-weight: 900;
          }

          .metric-value {
            display: block;
            color: #0f172a;
            font-size: 1.85rem;
            font-weight: 950;
            margin-top: 3px;
          }

          .metric-icon {
            width: 44px;
            height: 44px;
            border-radius: 16px;
            display: grid;
            place-items: center;
            background: #eef6ff;
            color: #003F87;
            flex-shrink: 0;
          }

          .support-workspace {
            display: grid;
            grid-template-columns: minmax(340px, 440px) minmax(0, 1fr);
            gap: 18px;
            align-items: stretch;
          }

          .support-inbox,
          .support-detail {
            background: #ffffff;
            border: 1px solid #e5edf5;
            border-radius: 26px;
            box-shadow: 0 18px 45px rgba(15, 23, 42, 0.05);
            overflow: hidden;
          }

          .inbox-toolbar {
            padding: 16px;
            border-bottom: 1px solid #eef2f7;
            display: flex;
            gap: 8px;
            overflow-x: auto;
          }

          .status-filter {
            border: 1px solid #dbe5ef;
            background: #ffffff;
            color: #64748b;
            border-radius: 999px;
            padding: 9px 13px;
            font-size: 0.78rem;
            font-weight: 900;
            white-space: nowrap;
            cursor: pointer;
          }

          .status-filter.active {
            background: #003F87;
            color: #ffffff;
            border-color: #003F87;
          }

          .ticket-list {
            max-height: 680px;
            overflow-y: auto;
          }

          .ticket-card {
            width: 100%;
            border: 0;
            background: #ffffff;
            border-bottom: 1px solid #eef2f7;
            padding: 17px;
            text-align: right;
            cursor: pointer;
            display: grid;
            gap: 10px;
          }

          .ticket-card:hover,
          .ticket-card.active {
            background: #f8fbff;
          }

          .ticket-topline {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 12px;
          }

          .ticket-card h3 {
            margin: 0;
            color: #0f172a;
            font-size: 0.98rem;
            font-weight: 950;
            line-height: 1.45;
          }

          .ticket-date {
            color: #94a3b8;
            font-size: 0.72rem;
            font-weight: 850;
            white-space: nowrap;
          }

          .ticket-teacher {
            display: flex;
            align-items: center;
            gap: 9px;
            color: #475569;
            font-size: 0.8rem;
            font-weight: 850;
          }

          .teacher-avatar {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background: #eef6ff;
            color: #003F87;
            display: grid;
            place-items: center;
            font-size: 0.78rem;
            font-weight: 950;
            flex-shrink: 0;
          }

          .ticket-snippet {
            color: #64748b;
            font-size: 0.8rem;
            line-height: 1.65;
            font-weight: 700;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .badge-row {
            display: flex;
            flex-wrap: wrap;
            gap: 7px;
          }

          .status-badge,
          .priority-badge {
            border-radius: 999px;
            padding: 5px 9px;
            font-size: 0.68rem;
            font-weight: 950;
          }

          .status-badge.open { background: #fff7ed; color: #c2410c; }
          .status-badge.progress { background: #eef6ff; color: #003F87; }
          .status-badge.resolved { background: #ecfdf5; color: #047857; }
          .priority-badge.low { background: #f1f5f9; color: #475569; }
          .priority-badge.normal { background: #eef2ff; color: #4338ca; }
          .priority-badge.high { background: #fff1f2; color: #be123c; }
          .priority-badge.urgent { background: #7f1d1d; color: #ffffff; }

          .support-detail {
            padding: 0;
            min-height: 620px;
            display: flex;
            flex-direction: column;
          }

          .detail-header {
            padding: 24px;
            border-bottom: 1px solid #eef2f7;
            display: flex;
            justify-content: space-between;
            gap: 18px;
            align-items: flex-start;
          }

          .detail-header h2 {
            margin: 0;
            color: #0f172a;
            font-size: 1.5rem;
            line-height: 1.45;
            font-weight: 950;
          }

          .detail-meta {
            margin-top: 12px;
            display: flex;
            flex-wrap: wrap;
            gap: 9px;
            color: #64748b;
            font-size: 0.82rem;
            font-weight: 850;
          }

          .detail-body {
            padding: 24px;
            display: grid;
            gap: 18px;
            flex: 1;
          }

          .contact-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 12px;
          }

          .contact-item {
            border: 1px solid #e5edf5;
            background: #f8fafc;
            border-radius: 18px;
            padding: 14px;
          }

          .contact-item span {
            display: block;
            color: #94a3b8;
            font-size: 0.7rem;
            font-weight: 950;
            margin-bottom: 5px;
          }

          .contact-item strong {
            color: #334155;
            font-size: 0.84rem;
            font-weight: 900;
            overflow-wrap: anywhere;
          }

          .message-panel {
            border: 1px solid #e5edf5;
            background: #fbfdff;
            border-radius: 20px;
            padding: 18px;
          }

          .message-panel span {
            display: block;
            color: #003F87;
            font-size: 0.8rem;
            font-weight: 950;
            margin-bottom: 10px;
          }

          .message-panel p {
            margin: 0;
            color: #334155;
            line-height: 1.9;
            font-weight: 750;
            white-space: pre-wrap;
          }

          .timeline-note {
            border: 1px dashed #cbd5e1;
            border-radius: 18px;
            padding: 14px;
            color: #64748b;
            font-size: 0.82rem;
            font-weight: 800;
            line-height: 1.7;
          }

          .detail-actions {
            padding: 18px 24px;
            border-top: 1px solid #eef2f7;
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
          }

          .support-action {
            border: 0;
            border-radius: 14px;
            padding: 11px 15px;
            font-weight: 950;
            cursor: pointer;
            background: #f1f5f9;
            color: #334155;
          }

          .support-action.primary {
            background: #003F87;
            color: #ffffff;
          }

          .support-action.success {
            background: #dcfce7;
            color: #166534;
          }

          .support-state {
            padding: 46px 20px;
            text-align: center;
            color: #64748b;
            font-weight: 900;
          }

          @media (max-width: 1180px) {
            .support-workspace {
              grid-template-columns: 1fr;
            }

            .ticket-list {
              max-height: 420px;
            }
          }

          @media (max-width: 760px) {
            .support-hero,
            .detail-header {
              flex-direction: column;
              align-items: stretch;
            }

            .support-metrics,
            .contact-grid {
              grid-template-columns: 1fr;
            }
          }
        `}</style>

        <section className="support-hero">
          <div>
            <div className="support-eyebrow">
              <i className="fa-solid fa-headset"></i>
              <span>مركز المساعدة</span>
            </div>
            <h1>الدعم الفني</h1>
            <p>لوحة احترافية لاستقبال مشاكل الأساتذة، مراجعة التفاصيل، وتحديث حالة المعالجة بسرعة ووضوح.</p>
          </div>
          <div className="support-search">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="ابحث بالموضوع، الأستاذ، أو البريد..."
            />
          </div>
        </section>

        <section className="support-metrics">
          <div className="support-metric">
            <div><span className="metric-label">إجمالي الطلبات</span><strong className="metric-value">{stats.total}</strong></div>
            <div className="metric-icon"><i className="fa-solid fa-inbox"></i></div>
          </div>
          <div className="support-metric">
            <div><span className="metric-label">مفتوحة</span><strong className="metric-value">{stats.open}</strong></div>
            <div className="metric-icon"><i className="fa-regular fa-circle"></i></div>
          </div>
          <div className="support-metric">
            <div><span className="metric-label">قيد المعالجة</span><strong className="metric-value">{stats.inProgress}</strong></div>
            <div className="metric-icon"><i className="fa-solid fa-spinner"></i></div>
          </div>
          <div className="support-metric">
            <div><span className="metric-label">ذات أولوية</span><strong className="metric-value">{stats.urgent}</strong></div>
            <div className="metric-icon"><i className="fa-solid fa-triangle-exclamation"></i></div>
          </div>
        </section>

        {error && <div className="support-state">{error}</div>}

        <section className="support-workspace">
          <aside className="support-inbox">
            <div className="inbox-toolbar">
              {Object.keys(statusLabels).map((status) => (
                <button
                  key={status}
                  className={`status-filter ${activeStatus === status ? "active" : ""}`}
                  onClick={() => {
                    setActiveStatus(status);
                    setSelectedId("");
                  }}
                >
                  {statusLabels[status]}
                </button>
              ))}
            </div>

            <div className="ticket-list">
              {loading ? (
                <div className="support-state">جاري تحميل طلبات الدعم...</div>
              ) : filteredRequests.length ? filteredRequests.map((request) => (
                <button
                  className={`ticket-card ${selectedRequest?._id === request._id ? "active" : ""}`}
                  key={request._id}
                  onClick={() => setSelectedId(request._id)}
                >
                  <div className="ticket-topline">
                    <h3>{request.subject}</h3>
                    <span className="ticket-date">{new Date(request.createdAt).toLocaleDateString("ar-MA")}</span>
                  </div>
                  <div className="ticket-teacher">
                    <span className="teacher-avatar">{getTeacherName(request).slice(0, 1)}</span>
                    <span>{getTeacherName(request)}</span>
                  </div>
                  <div className="ticket-snippet">{request.message}</div>
                  <div className="badge-row">
                    <span className={`status-badge ${statusClass[request.status]}`}>{statusLabels[request.status]}</span>
                    <span className={`priority-badge ${priorityClass[request.priority]}`}>{priorityLabels[request.priority]}</span>
                  </div>
                </button>
              )) : (
                <div className="support-state">لا توجد طلبات مطابقة.</div>
              )}
            </div>
          </aside>

          <article className="support-detail">
            {selectedRequest ? (
              <>
                <div className="detail-header">
                  <div>
                    <h2>{selectedRequest.subject}</h2>
                    <div className="detail-meta">
                      <span className={`status-badge ${statusClass[selectedRequest.status]}`}>{statusLabels[selectedRequest.status]}</span>
                      <span className={`priority-badge ${priorityClass[selectedRequest.priority]}`}>{priorityLabels[selectedRequest.priority]}</span>
                      <span>أرسل في {new Date(selectedRequest.createdAt).toLocaleString("ar-MA")}</span>
                    </div>
                  </div>
                </div>

                <div className="detail-body">
                  <div className="contact-grid">
                    <div className="contact-item">
                      <span>الأستاذ</span>
                      <strong>{getTeacherName(selectedRequest)}</strong>
                    </div>
                    <div className="contact-item">
                      <span>البريد</span>
                      <strong>{selectedRequest.email || selectedRequest.teacher?.email || "غير متوفر"}</strong>
                    </div>
                    <div className="contact-item">
                      <span>الهاتف</span>
                      <strong>{selectedRequest.phone || selectedRequest.teacher?.PhoneNumber || "غير متوفر"}</strong>
                    </div>
                  </div>

                  <div className="message-panel">
                    <span>وصف المشكلة</span>
                    <p>{selectedRequest.message}</p>
                  </div>

                  <div className="timeline-note">
                    عند تغيير الحالة إلى "قيد المعالجة" يظهر الطلب كقيد المتابعة. بعد حل المشكلة، اجعله "محلول" للحفاظ على صندوق دعم منظم.
                  </div>
                </div>

                <div className="detail-actions">
                  <button className="support-action primary" onClick={() => updateStatus(selectedRequest._id, "in_progress")}>قيد المعالجة</button>
                  <button className="support-action success" onClick={() => updateStatus(selectedRequest._id, "resolved")}>تم الحل</button>
                  <button className="support-action" onClick={() => updateStatus(selectedRequest._id, "open")}>إعادة فتح</button>
                </div>
              </>
            ) : (
              <div className="support-state">اختر طلب دعم من القائمة لعرض التفاصيل.</div>
            )}
          </article>
        </section>
      </div>
    </AdminLayout>
  );
};

export default TechnicalSupport;
