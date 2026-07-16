import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Button } from "./ui/button";

export function Appbar() {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string | null>(null);

  const checkAuth = () => {
    setUsername(localStorage.getItem("username"));
  };

  useEffect(() => {
    checkAuth();
    // Listen for custom signin/signup events
    window.addEventListener("auth-change", checkAuth);
    return () => {
      window.removeEventListener("auth-change", checkAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("username");
    setUsername(null);
    navigate("/");
  };

  return (
    <div>
      <div className="bg-black text-white flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <div
          className="text-xl font-bold cursor-pointer tracking-wider"
          onClick={() => navigate("/")}
        >
          Higgsfield
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-4">
          {username ? (
            <>
              <span className="text-gray-400 font-mono text-sm hidden sm:inline">
                hi, {username}
              </span>
              <Button
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white/10 hover:text-white text-sm"
                onClick={() => navigate("/dashboard")}
              >
                Dashboard
              </Button>
              <Button
                variant="outline"
                className="bg-transparent border-red-500 text-red-500 hover:bg-red-500/10 hover:text-red-400 text-sm"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white/10 hover:text-white text-sm"
                onClick={() => navigate("/signup")}
              >
                Signup
              </Button>
              <Button
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white/10 hover:text-white text-sm"
                onClick={() => navigate("/signin")}
              >
                Signin
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
