import React from "react";
import AdminLayout from "../../layouts/AdminLayout";
import GeneralChat from "../student/GeneralChat";

const TechnicalSupport = () => {
  return (
    <AdminLayout>
      <div dir="rtl">
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ margin: 0, color: "#003F87", fontSize: "2rem", fontWeight: 900 }}>
            الدردشة العامة
          </h1>
          <p style={{ margin: "6px 0 0", color: "#64748b", fontWeight: 700 }}>
            تواصل مباشر بين الإدارة، الأساتذة والطلاب عبر Socket.IO.
          </p>
        </div>
        <GeneralChat />
      </div>
    </AdminLayout>
  );
};

export default TechnicalSupport;
