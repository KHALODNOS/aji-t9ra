const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

connectFn();

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
