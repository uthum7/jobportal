// src/components/sidebar/Sidebar.jsx
import { useEffect, useState } from "react";
import { useChatStore } from "../../store/useChatStore";
import { useAuthStore } from "../../store/useAuthStore";
import SidebarSkeleton from "../skeletons/SidebarSkeleton";
import { Users } from "lucide-react";
import { connectSocket } from "../../socket";

const Sidebar = () => {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    isUsersLoading,
    unreadMessages,
    clearUnreadMessage,
  } = useChatStore();

  const user = useAuthStore((state) => state.user);
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  // 👉 Connect socket after login
  useEffect(() => {
    if (user?._id) {
      connectSocket(user._id);
    }
  }, [user]);

  // 👉 Fetch users on load
  useEffect(() => {
    getUsers();
  }, [getUsers]);

  
  if (isUsersLoading) return <SidebarSkeleton />;

  // 🔀 Sort unread users to top
  const sortedUsers = [...users].sort((a, b) => {
    return (unreadMessages[b._id] ? 1 : 0) - (unreadMessages[a._id] ? 1 : 0);
  });

  // 🔍 Filter by online toggle
  const filteredUsers = showOnlineOnly
    ? sortedUsers.filter((u) => onlineUsers.includes(u._id))
    : sortedUsers;

  const handleUserClick = (user) => {
    if (selectedUser?._id === user._id) return;
    setSelectedUser(user);
    clearUnreadMessage(user._id);
  };

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col">
      {/* Header */}
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>

        {/* Online toggle */}
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({onlineUsers.length - 1} online)
          </span>
        </div>
      </div>

      {/* User List */}
      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => {
          const isSelected = selectedUser?._id === user._id;
          const isOnline = onlineUsers.includes(user._id);
          const hasUnread = !!unreadMessages[user._id];

          return (
            <button
              key={user._id}
              onClick={() => handleUserClick(user)}
              className={`
                w-full p-3 flex items-center gap-3
                hover:bg-base-300 transition-colors
                ${isSelected ? "bg-base-300 ring-1 ring-base-300" : ""}
              `}
            >
              <div className="relative mx-auto lg:mx-0">
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.username}
                  className="size-12 object-cover rounded-full"
                />

                {/* Online dot */}
                {isOnline && (
                  <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
                )}

                {/* Unread dot */}
                {hasUnread && (
                  <span className="absolute -top-1 -right-1 size-3 bg-red-500 rounded-full ring-2 ring-white" />
                )}
              </div>

              {/* User Info */}
              <div className="hidden lg:block text-left min-w-0">
                <div className="font-medium truncate">{user.username}</div>
                <div className="text-xs text-zinc-500">
                  {user.roles?.[0] || "User"}
                </div>
                <div className="text-sm text-zinc-400">
                  {isOnline ? "Online" : "Offline"}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;
