import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/hooks/useTheme";
import { useNotifications } from "@/contexts/NotificationContext";

import {
  User,
  LogOut,
  Moon,
  Sun,
  Home,
  PlusCircle,
  Shield,
  Bell,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { toast } from "sonner";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, setTheme } = useTheme();
  const { notifications, clearNotification } = useNotifications();

  const hasNotifications = notifications.length > 0;

  return (
    <nav className="w-full border-b bg-background/60 backdrop-blur sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center py-4 px-4">
        {/* LOGO */}
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-tight
          bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600
          bg-clip-text text-transparent hover:scale-[1.05] transition"
        >
          Lost & Found • BMSCE Portal
        </Link>

        {/* CENTER LINKS */}
        <div className="hidden md:flex gap-6 text-sm font-medium">
          <Link to="/">Home</Link>
          <Link to="/post">Post Item</Link>
          <Link to="/about">About</Link>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">
          {/* SIGN IN WHEN LOGGED OUT */}
          {!isAuthenticated && (
            <Button onClick={() => navigate("/auth")}>Sign In</Button>
          )}

          {/* 🔔 NOTIFICATIONS (ONLY WHEN LOGGED IN) */}
          {isAuthenticated && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative p-2 rounded-full hover:bg-muted">
                  <Bell className="h-5 w-5" />
                  {hasNotifications && (
                    <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  )}
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-80 p-3 shadow-xl">
                <p className="text-sm font-semibold mb-2">Notifications</p>

                {!hasNotifications && (
                  <p className="text-sm text-muted-foreground">
                    No new notifications 🎉
                  </p>
                )}

                {notifications.map((n) => (
                  <div
                    key={n._id}
                    className="space-y-3 rounded-lg border p-3 bg-muted/40"
                  >
                    <p className="text-sm font-medium">
                      🔍 Possible match found!
                    </p>

                    {/* FOUND ITEM DETAILS INSTEAD OF n.title / n.location */}
                    <p className="text-xs text-muted-foreground">
                      <b>{n.foundItem?.title || "Item"}</b>
                      {n.foundItem?.category && (
                        <> • {n.foundItem.category}</>
                      )}
                    </p>

                    {n.foundItem?.description && (
                      <p className="text-xs text-muted-foreground">
                        {n.foundItem.description}
                      </p>
                    )}

                    {n.foundItem?.location && (
                      <p className="text-[11px] text-muted-foreground">
                        Location: {n.foundItem.location}
                      </p>
                    )}

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          toast.success(
                            "✅ You’ll receive a mail from lostandfound@bmsce.ac.in"
                          );
                          clearNotification(n._id);
                        }}
                      >
                        ✅ It’s mine
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        onClick={() => clearNotification(n._id)}
                      >
                        ❌ Nope
                      </Button>
                    </div>
                  </div>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* USER MENU */}
          {isAuthenticated && user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex gap-2">
                  <User className="h-4 w-4" />
                  {user.name?.split(" ")[0]}
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => navigate("/")}>
                  <Home className="h-4 w-4 mr-2" /> Home
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => navigate("/post")}>
                  <PlusCircle className="h-4 w-4 mr-2" /> Post Item
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => navigate("/my-posts")}>
                  <Home className="h-4 w-4 mr-2" /> My Posts
                </DropdownMenuItem>

                {user.role === "admin" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/admin")}>
                      <Shield className="h-4 w-4 mr-2" /> Admin Panel
                    </DropdownMenuItem>
                  </>
                )}

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() =>
                    setTheme(theme === "light" ? "dark" : "light")
                  }
                >
                  {theme === "light" ? <Moon /> : <Sun />}
                  <span className="ml-2">Toggle Theme</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  className="text-red-500"
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
