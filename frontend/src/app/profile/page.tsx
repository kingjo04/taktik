"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import axios from "axios";

export default function Profile() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [photoProfile, setPhotoProfile] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        const user = decoded.user;
        setName(user.name || "User");
        setPhotoProfile(user.photo_profile || "https://i.pravatar.cc/150");
        setEmail(user.email || "user@example.com");
      } catch (error) {
        console.error("Invalid token:", error);
        setName("User");
        setPhotoProfile("https://i.pravatar.cc/150");
        setEmail("user@example.com");
      }
    } else {
      setName("User");
      setPhotoProfile("https://via.placeholder.com/150?text=User+Avatar");
      setEmail("user@example.com");
    }
  }, []);

  const handleCheckHistory = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Token not found",
        text: "Please login to check history.",
      });
      return;
    }

    try {
      const response = await axios.get(
        `/api/exam-pagination?page=1&per_page=20`, // Pakai proxy
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.data.length > 0) {
        Swal.fire({
          icon: "success",
          title: "History found",
          text: "Your exam history is available.",
        });
        router.push(`/profile/riwayat`);
      } else {
        Swal.fire({
          icon: "info",
          title: "No History",
          text: "No exam history available.",
        });
      }
    } catch (error) {
      console.error("Error fetching history:", error);
      Swal.fire({
        icon: "error",
        title: "History not found",
        text: "No history available for this exam.",
      });
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 py-10 px-6 sm:px-10"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <button
            type="button"
            className="text-gray-600 hover:text-gray-800 transition-colors"
            onClick={() => router.back()}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-xl" />
          </button>
          <h1 className="ml-4 text-3xl font-bold text-gray-800">Profile</h1>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-32 h-32">
              <img
                src={photoProfile}
                alt="Profile"
                className="w-full h-full rounded-full object-cover border-4 border-indigo-200"
              />
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-semibold text-gray-900">{name}</h2>
              <p className="text-gray-600 mt-2">{email}</p>
            </div>
          </div>
        </div>

        {/* Menu Section */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Menu</h3>
          <div className="space-y-2">
            <div
              className="bg-white rounded-lg shadow-md p-4 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={handleCheckHistory}
            >
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Soal Ujian Saya</span>
                <FontAwesomeIcon icon={faChevronRight} className="text-gray-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Profile Settings Section */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Profile</h3>
          <div className="space-y-2">
            <Link href="/profile/ubahprofile">
              <div className="bg-white rounded-lg shadow-md p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Ubah Profile</span>
                  <FontAwesomeIcon icon={faChevronRight} className="text-gray-500" />
                </div>
              </div>
            </Link>
            <Link href="/profile/ubahpassword">
              <div className="bg-white rounded-lg shadow-md p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Ubah Password</span>
                  <FontAwesomeIcon icon={faChevronRight} className="text-gray-500" />
                </div>
              </div>
            </Link>
            <Link href="">
              <div className="bg-white rounded-lg shadow-md p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Hapus Akun</span>
                  <FontAwesomeIcon icon={faChevronRight} className="text-gray-500" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}