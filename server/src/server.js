const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/connectFn");
const { generateToken } = require("./controllers/voiceRomController.js");


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

app.get('/api/agora/token', generateToken);


connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
