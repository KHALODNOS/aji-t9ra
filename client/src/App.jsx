import { useState } from "react";
import LOADINGPAGE from "./pages/common/LOADINGPAGE";
import TeacherRegisterPage from "./pages/teacher/TeacherRegisterPag";
import AdminDashboard from "./pages/admin/AdminDashboard";

function App() {
  const [page, setPage] = useState("loading");

  if (page === "teacher-register") {
    return <TeacherRegisterPage onBack={() => setPage("loading")} />;
  }

  if (page === "admin") {
    return <AdminDashboard onBack={() => setPage("loading")} />;
  }

  return (
    <LOADINGPAGE
      onProfessorClick={() => setPage("teacher-register")}
      onAdminClick={() => setPage("admin")}
    />
  );
}

export default App;
