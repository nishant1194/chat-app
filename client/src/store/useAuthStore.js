import { create } from "zustand";
 import toast from "react-hot-toast";
import { io } from "socket.io-client";
 import axios from "axios"
import Url from "../utils/Url";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  onlineUsers: [],
  socket: null,
   checkAuth: async () => {
    try {
      const res = await axios.get(Url+"/api/auth/check" , { withCredentials: true });
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    }  
  },

  signup: async (data) => {
     try {
      const res = await axios.post(Url +"/api/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    }  
  },

  login: async (data) => {
   
     try {
      const res = await axios.post(Url+"/api/auth/login", data,{withCredentials:true});
      set({ authUser: res.data });
      toast.success("Logged in successfully");
       get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    }  
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  updateProfile: async (data) => {
     try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response.data.message);
    }  
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(Url, {
      query: {
        userId: authUser._id,
        userName: authUser.fullName
      },
    });
    socket.connect();

    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },
  
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
