import { create } from "zustand";
import toast from "react-hot-toast";
 import { useAuthStore } from "./useAuthStore";
import Url from "../utils/Url";

export const useGroupStore = create((set, get) => ({
    messages: [],
    selectedGroup: null,
   
    setSelectedGroup: (selectedGroup) => set({ selectedGroup }),
  }));