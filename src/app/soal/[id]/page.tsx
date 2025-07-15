"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export default function SoalDetail({ params }: { params: { id: string } }) {
  const [name, setName] = useState("");
  const [photoProfile, setPhotoProfile] = useState("");
  const [exam, setExam] = useState<any>(null);
  const { id } = params; // Ambil ID dari params

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        const user = decoded.user;
        setName(user.name);
        setPhotoProfile(user.photo_profile || "");

        fetchExamDetail(token);
      } catch (error) {
        console.error("Invalid token:", error);
        setName("");
        setPhotoProfile("");
      }
    }
  }, [id]);

  const fetchExamDetail = async (token: string) => {
    try {
      const response = await axios.get(`https://api.taktix.co.id/student/exam/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setExam(response.data); // Mengatur state exam dengan data yang diterima
    } catch (error) {
      console.error(`Error fetching exam detail for ID ${id}:`, error);
    }
  };

  // Cek apakah exam sudah di-set
  if (!exam) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <span className="text-2xl text-blue-600 animate-pulse">Memuat Detail Ujian...</span>
      </div>
    );
  }

  return (
    <div className="flex">
      <main className="flex-1 min-h-screen bg-gradient-to-br from-blue-50 to-white p-4 sm:p-6 lg:p-8 ml-16 overflow-x-hidden max-w-full">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button
              onClick={() => window.history.back()}
              className="mr-4 p-2 bg-blue-100 rounded-full hover:bg-blue-200 transition-transform transform hover:scale-110"
            >
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            <div className="h-3 w-1.5 bg-yellow-400 rounded-full animate-pulse"></div>
            <h1 className="ml-3 text-xl sm:text-2xl font-bold text-blue-800">Detail Ujian</h1>
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

        {/* Main Content */}
        <div className="flex justify-center my-8">
          <div className="w-full max-w-[1000px] bg-gradient-to-br from-blue-700 to-blue-900 rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300">
            {/* Title Section */}
            <h2 className="text-white text-2xl sm:text-3xl font-bold mb-6 text-center">
              {exam.title}
            </h2>

            {/* Details Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-white">
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-medium">Kategori</span>
                <span className="text-lg sm:text-xl font-semibold mt-1">
                  {exam.category?.name || "N/A"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-medium">Kategori Ujian</span>
                <span className="text-lg sm:text-xl font-semibold mt-1">
                  {exam.exam_category?.name || "N/A"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-medium">Harga</span>
                <span className="text-lg sm:text-xl font-semibold mt-1">
                  {exam.is_free ? "Gratis" : "Berbayar"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-medium">Jumlah Soal</span>
                <span className="text-lg sm:text-xl font-semibold mt-1">
                  {exam.total_question} Soal
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-medium">Durasi</span>
                <span className="text-lg sm:text-xl font-semibold mt-1">
                  {exam.duration} Menit
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-medium">Publikasi</span>
                <span className="text-lg sm:text-xl font-semibold mt-1">
                  {exam.is_public ? "Publik" : "Privat"}
                </span>
              </div>
            </div>

            {/* Button Section */}
            <div className="flex justify-center mt-8">
              <Link href={`/soal/detail_soal/${id}`}>
                <div className="w-[300px] h-14 bg-white text-blue-700 text-xl font-semibold rounded-2xl flex items-center justify-center hover:bg-gray-100 transition-all duration-300 transform hover:scale-105">
                  Dapatkan Soal
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}