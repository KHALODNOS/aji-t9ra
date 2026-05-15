import { useState } from "react";
import LOADINGPAGE from "./pages/common/LOADINGPAGE";
import AdminDashboard from "./pages/admin/AdminDashboard";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import StoryAuthor from "./pages/teacher/StoryAuthor";
import AddShortVideo from "./pages/teacher/AddShortVideo";
import AISettings from "./pages/teacher/AISettings";
import TestBank from "./pages/teacher/TestBank";
import AudioSalons from "./pages/teacher/AudioSalons";
import StudentTracking from "./pages/teacher/StudentTracking";
import TeacherProfile from "./pages/teacher/TeacherProfile";

function App() {
  
  return (
    // <AddShortVideo/>
    // <AISettings />
    // <TestBank />
    // <AudioSalons />
    // <StudentTracking />
    <TeacherProfile />
  );
}

export default App;


