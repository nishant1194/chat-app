import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import groupRoutes from "./routes/group.route.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT || 5001;
 app.use(express.json({ limit: "10mb" })); // Adjust size limit as needed
app.use(express.urlencoded({ limit: "10mb", extended: true }));
  app.use(cookieParser());
  
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/group", groupRoutes);

app.get('*',(req,res,next)=>{
  res.status(200).json({
    message:'received request'
  })
})

server.listen(PORT, () => {
  console.log("server is running on PORT:" + PORT);
  connectDB();
});
