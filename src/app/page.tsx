"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";
import Sidebar from "@/components/Sidebar";

export default function Home() {
  const [name, setName] = useState("");
  const [photoProfile, setPhotoProfile] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        const user = decoded.user;
        setName(user.name);
        setPhotoProfile(user.photo_profile || "");
      } catch (error) {
        console.error("Invalid token:", error);
        setName("");
        setPhotoProfile("");
      }
    }
  }, []);

  const educationImages = [
    "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2089&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 min-h-screen bg-gradient-to-br from-blue-50 to-white p-4 sm:p-6 lg:p-8 ml-16">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="h-3 w-1.5 bg-yellow-400 rounded-full animate-pulse"></div>
            <h1 className="ml-3 text-xl sm:text-2xl font-bold text-blue-800">Latihan Ujian</h1>
          </div>
          {name && (
            <div className="flex items-center gap-2">
              {photoProfile && (
                <img
                  src={photoProfile}
                  alt="Profile"
                  className="h-8 w-8 rounded-full object-cover border-2 border-yellow-400"
                />
              )}
              
            </div>
          )}
        </div>

        {/* Main Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {["UTBK", "CPNS", "Kedinasan", "Lihat Semua"].map((title, index) => (
            <div
              key={title}
              className="relative overflow-hidden rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white"
            >
              <div
                className="w-full h-48 bg-cover bg-center relative"
                style={{ backgroundImage: `url(${educationImages[index]})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-center justify-center text-white text-center p-4">
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold">{title}</h2>
                    <p className="text-xs sm:text-sm mt-1">
                      {title === "UTBK" && "Ujian Tulis Berbasis Komputer"}
                      {title === "CPNS" && "Ujian Calon Pegawai Negeri Sipil"}
                      {title === "Kedinasan" && "Latihan Ujian Kedinasan"}
                      {title === "Lihat Semua" && "Semua soal yang tersedia"}
                    </p>
                  </div>
                </div>
              </div>
              <Link
                href={`/${title.toLowerCase() === "lihat semua" ? "semua" : title.toLowerCase()}`}
                className="block text-center py-2 bg-yellow-400 text-white font-semibold rounded-b-2xl hover:bg-yellow-500 transition-colors"
              >
                Lihat Soal
              </Link>
            </div>
          ))}
        </div>

        {/* Program Pendampingan */}
        <div className="mt-8">
          <div className="flex items-center mb-4">
            <div className="h-3 w-1.5 bg-yellow-400 rounded-full animate-pulse"></div>
            <h1 className="ml-3 text-xl sm:text-2xl font-bold text-blue-800">Program Pendampingan</h1>
          </div>
          <Link href="/program">
            <div className="relative overflow-hidden rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <img
                src="https://app.taktix.co.id/assets/assets/graduation.jpeg"
                alt="Program Pendampingan"
                className="w-full h-56 object-cover rounded-2xl filter blur-sm"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-center justify-center text-white text-center p-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold">Program Pendampingan</h2>
                  <p className="text-xs sm:text-sm mt-1">Klik untuk lihat program pendampingan yang anda ikuti</p>
                </div>
              </div>
              <div className="text-center py-2 bg-yellow-400 text-white font-semibold rounded-b-2xl hover:bg-yellow-500 transition-colors">
                Lihat Program
              </div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}