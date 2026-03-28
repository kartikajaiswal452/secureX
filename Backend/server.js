require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();


const allowedOrigins = [
  "http://localhost:3000",             
  "https://your-frontend.vercel.app"    
];

app.use(cors({
  origin: function(origin, callback){
   
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));


app.use(express.json());


app.use("/uploads", express.static("uploads"));


const authRoutes = require("./routes/authroutes");
const fileRoutes = require("./routes/fileroutes.js");
app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);
app.get("/", (req, res) => {
  res.send("server is running");
});


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("mongodb is connected"))
  .catch(err => console.log(err));

console.log("MONGO_URI:", process.env.MONGO_URI);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});