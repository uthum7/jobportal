<<<<<<< HEAD
=======
// src/components/sidebar/Sidebar.jsx
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
import { useEffect, useState } from "react";
import { useChatStore } from "../../store/useChatStore";
import { useAuthStore } from "../../store/useAuthStore";
import SidebarSkeleton from "../skeletons/SidebarSkeleton";
import { Users } from "lucide-react";
<<<<<<< HEAD

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();

  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

=======
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
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
  useEffect(() => {
    getUsers();
  }, [getUsers]);

  
  if (isUsersLoading) return <SidebarSkeleton />;

<<<<<<< HEAD
  const filteredUsers = showOnlineOnly
  ? users.filter((user) => onlineUsers.includes(user._id))
  : users;

  if (isUsersLoading) return <SidebarSkeleton />;


  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
=======
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
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
<<<<<<< HEAD
        {/* TODO: Online filter toggle */}
        
=======

        {/* Online toggle */}
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
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
<<<<<<< HEAD
          <span className="text-xs text-zinc-500">({onlineUsers.length - 1} online)</span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.name}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                />
              )}
            </div>

            {/* User info - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.fullName}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        
=======
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
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
      </div>
    </aside>
  );
};
<<<<<<< HEAD
export default Sidebar;
=======

export default Sidebar;
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
