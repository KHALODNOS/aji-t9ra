import { useState } from "react";
import LOADINGPAGE from "./pages/common/LOADINGPAGE";
import TeacherRegisterPage from "./pages/teacher/TeacherRegisterPag";

function App() {
  const [page, setPage] = useState("loading");

  if (page === "teacher-register") {
    return <TeacherRegisterPage onBack={() => setPage("loading")} />;
  }

  return <LOADINGPAGE onProfessorClick={() => setPage("teacher-register")} />;
}

export default App;
