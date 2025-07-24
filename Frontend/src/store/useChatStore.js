import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

let messageListener = null; // <-- Keep the listener reference globally

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  unreadMessages: {},

  // ✅ Get all users
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch users.");
    } finally {
      set({ isUsersLoading: false });
    }
    
  },

  // ✅ Get all messages with selected user
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch messages.");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  // ✅ Send a new message
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      const message = error.response?.data?.message || error.message || "Failed to send message.";
      toast.error(message);
      console.error("sendMessage error:", error);
    }
  },

  // ✅ Subscribes to new messages from socket (safe with single listener)
  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;

    // Prevent multiple subscriptions
    if (messageListener) return;

    messageListener = (newMessage) => {
      console.log("📥 New message received:", newMessage);
      const currentSelected = get().selectedUser;

      if (currentSelected && newMessage.senderId === currentSelected._id) {
        set({ messages: [...get().messages, newMessage] });
      } else {
        get().setUnreadMessage(newMessage.senderId);
      }
    };

    socket.on("newMessage", messageListener);
    console.log("✅ Subscribed to socket messages");
  },

  // ✅ Unsubscribe from socket (removes the exact listener)
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (messageListener) {
      socket.off("newMessage", messageListener);
      messageListener = null;
      console.log("🛑 Unsubscribed from socket messages");
    }
  },

  // ✅ Update selected user
  setSelectedUser: (selectedUser) => set({ selectedUser }),

  // ✅ Set a user as having unread messages
  setUnreadMessage: (userId) => {
    set((state) => {
      const updated = { ...state.unreadMessages };
      updated[userId] = true;
      return { unreadMessages: updated };
    });
  },

  // ✅ Clear a user's unread messages
  clearUnreadMessage: (userId) => {
    set((state) => {
      const updated = { ...state.unreadMessages };
      delete updated[userId];
      return { unreadMessages: updated };
    });
  },

  // ✅ Set all messages (for external updates, like delete)
setMessages: (newMessages) => set({ messages: newMessages }),


  // ✅ Bring most recently messaged user to top
  reorderUsers: (userId) => {
    const { users } = get();
    const userToMove = users.find((u) => u._id === userId);
    if (!userToMove) return;
    const otherUsers = users.filter((u) => u._id !== userId);
    set({ users: [userToMove, ...otherUsers] });
  },

  
}));
