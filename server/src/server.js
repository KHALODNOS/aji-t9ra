const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const connectDB = require("./config/connectFn");
const { initSocket } = require("./utils/socket");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// routes
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/stories", require("./routes/storyRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/videos", require("./routes/videoRoutes"));
app.use("/api/exams", require("./routes/examRoutes"));
app.use("/api/student/journey", require("./routes/studentJourneyRoutes"));
app.use("/api/teacher", require("./routes/teacherRoutes"));
app.use("/api/user", require("./routes/user"));
app.use("/api/vocabulary", require("./routes/vocabularyRoutes"));
app.use("/api/voice-rooms", require("./routes/angora"));

connectDB();

const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

server.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});