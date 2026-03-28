require("dotenv").config();
const express=require("express");
const mongoose=require("mongoose");
const cors=require("cors");
const app=express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
const authRoutes = require("./routes/authroutes");
const fileRoutes=require("./routes/fileroutes.js");
app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);

app.get("/",(req,res)=>{
  res.send("server is running");
})
mongoose.connect(process.env.MONGO_URI)
.then(()=>{
console.log("mongodb is connected")
})
.catch(err=>console.log(err))
console.log("MONGO_URI:", process.env.MONGO_URI);
const PORT= process.env.PORT || 5000;
app.listen(PORT,()=>{
  console.log("server is running in port 3000");
}
);