"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";

const Header = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [photoProfile, setPhotoProfile] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Anda belum login",
        text: "Silahkan login terlebih dahulu",
        confirmButtonText: "Login",
        confirmButtonColor: "#dc3545",
        allowOutsideClick: false,
      }).then(() => {
        router.push("/login");
      });
      return;
    }

    try {
      const decoded: any = jwtDecode(token);
      const user = decoded.user;
      setName(user.name);
      setEmail(user.email);
      // Assuming photoProfile is part of the user object, adjust if needed
      setPhotoProfile(user.photo_profile || "");
    } catch (error) {
      console.error("Invalid token:", error);
      setName("");
      setEmail("");
      setPhotoProfile("");
      Swal.fire({
        icon: "error",
        title: "Token Tidak Valid",
        text: "Silahkan login kembali",
        confirmButtonText: "Login",
        confirmButtonColor: "#dc3545",
        allowOutsideClick: false,
      }).then(() => {
        router.push("/login");
      });
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-700 to-blue-900 shadow-lg">
      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto text-white font-medium transition-all duration-300">
        {/* Logo and User Info */}
        <div className="flex items-center gap-4">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/e65299e39c2b2a80b59b1c39be7b6eb50ec4951b8157f707c49ddb3037738ec2?apiKey=19816b9fb5bc4b9987983517808491df"
            alt="Logo"
            className="h-12 w-auto object-contain"
          />
          {photoProfile && (
            <img
              src={photoProfile}
              alt="Profile"
              className="h-10 w-10 rounded-full object-cover border-2 border-white"
            />
          )}
          <span className="text-lg font-semibold ml-2">Hi, {name || "Guest"}</span>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-4">
          <button
            className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition transform hover:scale-105 text-sm"
          >
            Download Now
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-500 transition transform hover:scale-105 text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;