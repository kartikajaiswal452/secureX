require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();


const allowedOrigins = [
  "https://secure-x-gules.vercel.app",
  "https://secure-x-git-main-kartikajaiswal452s-projects.vercel.app",
  "http://localhost:5173"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("Blocked Origin:", origin);
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  })
);


app.use(express.json());

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);


const authRoutes = require("./routes/authroutes");
const fileRoutes = require("./routes/fileroutes");
const userRoutes = require("./routes/userroutes");

app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/users", userRoutes);



app.get("/", (req, res) => {
  res.send("Server is running");
});



mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});