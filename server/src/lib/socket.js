import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://chat-app-azure-eight.vercel.app"],
    credentials: true
  },
});

// Store online users and their socket IDs
const userSocketMap = {}; // {userId: socketId}

// Store which users are in which groups (rooms)
const groupUserMap = {}; // {roomId: [userIds]}

// Get the socket ID of a specific user
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  const userName = socket.handshake.query.userName;

  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log(`User connected: ${userName} (ID: ${userId})`);
  }

  // Emit the updated list of online users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Handle joining a group (room)
  socket.on("joinGroup", ({ roomId }) => {
    socket.join(roomId);

    if (!groupUserMap[roomId]) {
      groupUserMap[roomId] = [];
    }

    if (!groupUserMap[roomId].includes(userId)) {
      groupUserMap[roomId].push(userId);
    }

    io.to(roomId).emit("groupMessage", {
      sender: "System",
      text: `${userName} has joined the group.`,
      roomId,
    });

    console.log(`${userName} joined room: ${roomId}`);
  });

  socket.on("sendMessage", async ({ roomId, message }) => {
    if (!userName || !roomId) return;
    const messageData = {
      sender: userName,
      text: message,
      roomId,
    };
  
    // Broadcast message to all members in the room
    io.to(roomId).emit("groupMessage", messageData);
  
    console.log(`Message in ${roomId} from ${userName}: ${message}`);
  });
  
  // Handle typing event
  socket.on("typing", ({ roomId, isTyping }) => {
    socket.to(roomId).emit("typing", { userName, isTyping });
  });

  // Handle disconnect event
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${userName} (ID: ${userId})`);
    delete userSocketMap[userId];

    // Remove user from all groups
    Object.keys(groupUserMap).forEach((roomId) => {
      groupUserMap[roomId] = groupUserMap[roomId].filter((id) => id !== userId);
      io.to(roomId).emit("groupMessage", {
        sender: "System",
        text: `${userName} has left the group.`,
        roomId,
      });
    });

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
