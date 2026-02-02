const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const swipeRoutes = require("./routes/swipe.cjs");

dotenv.config();

// ✅ In-memory stores (MongoDB bypass)
// 🔔 IN-MEMORY NOTIFICATIONS (DEMO)
global.pendingChatRequests = [];
global.activeChats = [];
global.userNotifications = {}; // { userId: [ { text, createdAt } ] }


const app = express();

/* CORS */
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

/* ROUTES */
app.use("/api/swipe", swipeRoutes);
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/profile", require("./routes/profileRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/relationship-chat", require("./routes/relationshipChatRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));

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
