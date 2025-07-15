"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faChevronRight, faTrophy, faClock, faUserEdit } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import axios from "axios";

export default function Profile() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [photoProfile, setPhotoProfile] = useState("");
  const [email, setEmail] = useState("");
  const [examCount, setExamCount] = useState(0);

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

    const fetchExamCount = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await axios.get(
            `/api/exam-pagination?page=1&per_page=100`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setExamCount(response.data.data.length || 0);
        } catch (error) {
          console.error("Error fetching exam count:", error);
        }
      }
    };
    fetchExamCount();
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
        `/api/exam-pagination?page=1&per_page=20`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data && response.data.data.length > 0) {
        Swal.fire({
          icon: "success",
          title: "History found",
          text: "Your exam history is available!",
          confirmButtonColor: "#3085d6",
        });
        router.push(`/profile/riwayat`);
      } else {
        Swal.fire({
          icon: "info",
          title: "No History",
          text: "No exam history available yet. Start learning now!",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Start Now",
          showCancelButton: true,
          cancelButtonText: "Cancel",
        }).then((result) => {
          if (result.isConfirmed) {
            router.push("/kedinasan");
          }
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
      className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100 py-6 sm:py-10 px-4 sm:px-6 lg:px-8"
    >
      <div className="ml-[64px] max-w-4xl mx-auto"> {/* Tambahin ml-[64px] biar nggak overlap sidebar */}
        <button
          onClick={() => router.back()}
          className="mb-6 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-all duration-300 transform hover:scale-110"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="text-indigo-600 text-lg" />
        </button>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-blue-600 mb-8 text-center animate-fade-in">
          My Profile
        </h1>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 transform hover:shadow-2xl transition-all duration-300">
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
            <div className="w-28 sm:w-36 h-28 sm:h-36 relative">
              <img
                src={photoProfile}
                alt="Profile"
                className="w-full h-full rounded-full object-cover border-4 border-gradient-to-r from-indigo-200 to-blue-200 animate-pulse-slow"
              />
              <div className="absolute -bottom-2 -right-2 bg-green-400 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold">
                {examCount}
              </div>
            </div>
            <div className="text-center sm:text-left mt-4 sm:mt-0">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900">{name}</h2>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">{email}</p>
              <Link href="/profile/ubahprofile">
                <button className="mt-4 px-4 py-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-lg hover:from-indigo-600 hover:to-blue-600 transition-all duration-300 flex items-center gap-2">
                  <FontAwesomeIcon icon={faUserEdit} /> Edit Profile
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-indigo-100 to-blue-100 rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faTrophy} className="text-yellow-500 text-xl" />
              <h3 className="text-lg font-semibold text-gray-800">Achievements</h3>
            </div>
            <p className="text-gray-600 mt-2">0 Unlocked</p>
          </div>
          <div className="bg-gradient-to-br from-indigo-100 to-blue-100 rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faClock} className="text-blue-500 text-xl" />
              <h3 className="text-lg font-semibold text-gray-800">Time Spent</h3>
            </div>
            <p className="text-gray-600 mt-2">10h 30m</p>
          </div>
          <div className="bg-gradient-to-br from-indigo-100 to-blue-100 rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faTrophy} className="text-green-500 text-xl" />
              <h3 className="text-lg font-semibold text-gray-800">Rank</h3>
            </div>
            <p className="text-gray-600 mt-2">Top 10%</p>
          </div>
        </div>

        {/* Menu Section */}
        <div className="mt-8">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">Explore More</h3>
          <div className="space-y-4">
            <div
              className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-4 shadow-md hover:bg-indigo-100 transition-all duration-300 cursor-pointer"
              onClick={handleCheckHistory}
            >
              <div className="flex justify-between items-center">
                <span className="text-gray-700 text-lg font-medium">My Exam History</span>
                <FontAwesomeIcon icon={faChevronRight} className="text-indigo-500 text-xl" />
              </div>
            </div>
            <Link href="/profile/ubahpassword">
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-4 shadow-md hover:bg-indigo-100 transition-all duration-300">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 text-lg font-medium">Change Password</span>
                  <FontAwesomeIcon icon={faChevronRight} className="text-indigo-500 text-xl" />
                </div>
              </div>
            </Link>
            <Link href="">
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-4 shadow-md hover:bg-indigo-100 transition-all duration-300">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 text-lg font-medium">Delete Account</span>
                  <FontAwesomeIcon icon={faChevronRight} className="text-indigo-500 text-xl" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}