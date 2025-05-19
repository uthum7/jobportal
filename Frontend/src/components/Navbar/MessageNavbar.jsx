import { Link } from "react-router-dom";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  
  return (
    <header
      className="bg-base-100 border-b border-base-300 w-full top-0 z-40 
    backdrop-blur-lg bg-base-100/80 mt-20"
    >
      <div className="flex items-center justify-between h-full">
  {/* Left side - Message link only */}
  <div className="flex items-center">
    <Link to="message/messagehome" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
      <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
        <MessageSquare className="w-5 h-5 text-primary" />
      </div>
      <h1 className="text-lg font-bold">Message</h1>
    </Link>
  </div>

  {/* Right side - Push all buttons to the right edge */}
  <div className="flex items-center gap-2 ml-auto">
    <Link
      to={"message/setting"}
      className="btn btn-sm gap-2 transition-colors"
    >
      <Settings className="w-4 h-4" />
      <span className="hidden sm:inline">Settings</span>
    </Link>
    
    <Link to={"message/profile"} className="btn btn-sm gap-2">
      <User className="size-5" />
      <span className="hidden sm:inline">Profile</span>
    </Link>

    <button className="btn btn-sm gap-2" onClick={logout}>
      <LogOut className="size-5" />
      <span className="hidden sm:inline">Logout</span>
    </button>
  </div>
</div>
     
    </header>
  );
};

export default Navbar;