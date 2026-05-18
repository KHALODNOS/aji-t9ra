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
import StudentDashboard from "./pages/student/StudentDashboard";
import EducationalJourney from "./pages/student/EducationalJourney";
import SpeakingPractice from "./pages/student/SpeakingPractice";
import AudioSalonsStudent from "./pages/student/AudioSalons";
import Achievements from "./pages/student/Achievements";
import StudentProfile from "./pages/student/StudentProfile";
import GeneralChat from "./pages/student/GeneralChat";
import Leaderboard from "./pages/student/Leaderboard";

function App() {
  
  return (
    <Leaderboard />
    // <GeneralChat />
    // <StudentProfile />
    // <Achievements />
    // <AudioSalonsStudent />
    // <SpeakingPractice />
    // <EducationalJourney />
    // <StudentDashboard />
    // <AddShortVideo/>
    // <AISettings />
    // <TestBank />
    // <AudioSalons />

    // <StudentTracking />
    // <TeacherProfile />
    // <TeacherDashboard/>
    // <StoryAuthor/>
  );
}

export default App;


