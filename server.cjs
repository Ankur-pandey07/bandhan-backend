const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const swipeRoutes = require("./routes/swipe.cjs");

dotenv.config();

const app = express();

/* ✅ CORS FIRST */
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://bandhan.vercel.app",
    ],
    credentials: true,
  })
);

/* ✅ BODY PARSER */
app.use(express.json());
app.use(cookieParser());

/* ✅ ROUTES */
app.use("/api/swipe", swipeRoutes);
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/profile", require("./routes/profileRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
//app.use("/api/payment", require("./routes/paymentRoutes"));
app.use("/api/newsletter", require("./routes/newsletterRoutes"));

/* TEST */
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

/* DB */
connectDB();

/* SERVER */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
