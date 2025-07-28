import { useChatStore } from "../../store/useChatStore";
import { useEffect, useRef, useState } from "react";

import ChatHeader from "../skeletons/ChatHeader";
import MessageInput from "../skeletons/MessageInput";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import { useAuthStore } from "../../store/useAuthStore";
import { formatMessageTime } from "../../lib/utils.js";
import { Trash2 } from "lucide-react";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";
import DeleteConfirmationModal from "./DeleteConfirmationModal"; // ✅ Adjust this path as needed

const ChatContainer = () => {
  const { 
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    setMessages,
  } = useChatStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);

  // Fetch messages and subscribe to socket updates
  useEffect(() => {
    if (!selectedUser?._id) return;

    getMessages(selectedUser._id);
    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser?._id]);

  // Scroll to the latest message
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Trigger the delete modal
  const handleDeleteMessage = (messageId) => {
    setMessageToDelete(messageId);
    setShowDeleteModal(true);
  };

  // Confirm and delete the message
  const confirmDeleteMessage = async () => {
    try {
      await axiosInstance.delete(`/messages/delete/${messageToDelete}`);
      setMessages(messages.filter((msg) => msg._id !== messageToDelete));
      toast.success("Message deleted");
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete message");
    } finally {
      setShowDeleteModal(false);
      setMessageToDelete(null);
    }
  };

  if (isMessagesLoading || !selectedUser?._id) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <p className="text-center text-gray-500">No messages yet</p>
        ) : (
          messages.map((message, index) => {
            const isSender = message.senderId === authUser._id;
            const isLastMessage = index === messages.length - 1;

            return (
              <div
                key={message._id}
                className={`chat ${isSender ? "chat-end" : "chat-start"}`}
                ref={isLastMessage ? messageEndRef : null}
              >
                <div className="chat-image avatar">
                  <div className="size-10 rounded-full border">
                    <img
                      src={
                        isSender
                          ? authUser.profilePic || "/avatar.png"
                          : selectedUser.profilePic || "/avatar.png"
                      }
                      alt="profile pic"
                    />
                  </div>
                </div>

                <div className="chat-header mb-1 flex items-center justify-between gap-2">
                  <time className="text-xs opacity-50 ml-1">
                    {formatMessageTime(message.createdAt)}
                  </time>
                  {isSender && (
                    <button
                      onClick={() => handleDeleteMessage(message._id)}
                      className="text-red-400 hover:text-red-600 transition-colors"
                      title="Delete message"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>

                <div className="chat-bubble flex flex-col">
                  {message.image && (
                    <img
                      src={message.image}
                      alt="Attachment"
                      className="sm:max-w-[200px] rounded-md mb-2"
                    />
                  )}
                  {message.text && <p>{message.text}</p>}
                </div>
              </div>
            );
          })
        )}
      </div>

      <MessageInput />

      {/* ✅ Delete Confirmation Modal */}
      <DeleteConfirmationModal
        visible={showDeleteModal}
        onCancel={() => {
          setShowDeleteModal(false);
          setMessageToDelete(null);
        }}
        onConfirm={confirmDeleteMessage}
      />
    </div>
  );
};

export default ChatContainer;
