require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();


// ================= CORS =================
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);


// ================= MIDDLEWARE =================
app.use(express.json());

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);


// ================= ROUTES =================
const authRoutes = require("./routes/authroutes");
const fileRoutes = require("./routes/fileroutes");
const userRoutes = require("./routes/userroutes");

app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/users", userRoutes);


// ================= TEST ROUTE =================
app.get("/", (req, res) => {
  res.send("Server is running");
});


// ================= DATABASE =================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });


// ================= PORT =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});