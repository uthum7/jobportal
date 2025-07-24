import { io } from "socket.io-client";

// Replace the URL if your backend runs on a different host or port
const socket = io("http://localhost:5001", {
  transports: ['websocket'], // optional: helps with stability
  withCredentials: true,     // optional: only if your backend needs cookies
});

export default socket;
