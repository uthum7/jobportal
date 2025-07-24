// socket.js
import { io } from "socket.io-client";

let socket;

export const connectSocket = (userId) => {
  socket = io("http://localhost:5001", {
    query: { userId },
  });
};

export const getSocket = () => socket;
