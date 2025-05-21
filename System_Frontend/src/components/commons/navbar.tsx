import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import API_ENDPOINTS from "../../constants/api";

interface UserProfile {
  names: string;
  profilePicture?: string;
}

const Navbar: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const location = useLocation();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get(API_ENDPOINTS.user.me, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setUser(response.data.data.user);
        }
      } catch (error) {
        console.error("Failed to fetch user profile", error);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <nav className="w-full bg-white text-black px-6 py-4 flex justify-between items-center shadow-sm">
      <span className="text-xl font-bold text-blue-800">ParkIt</span>

      {!user ? (
        <div className="flex space-x-4">
          <Link to="/auth/login">
            <Button
              variant={location.pathname === "/auth/login" ? "default" : "ghost"}
              className={`${
                location.pathname === "/auth/login"
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "text-blue-600 hover:text-blue-800"
              }`}
            >
              Login
            </Button>
          </Link>
          <Link to="/auth/register">
            <Button
              className={`${
                location.pathname === "/auth/register"
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "text-blue-600 hover:text-blue-800"
              }`}
              variant={location.pathname === "/auth/register" ? "default" : "ghost"}
            >
              Sign Up
            </Button>
          </Link>
        </div>
      ) : (
        <div className="flex items-center space-x-4">
          <Avatar>
            {user.profilePicture ? (
              <AvatarImage src={user.profilePicture} alt={user.names} />
            ) : (
              <AvatarFallback>
                {user.names?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            )}
          </Avatar>
          <h1>{user.names}</h1>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
