"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Swal from "sweetalert2";

export default function SoalDetail({ params }: { params: { id: string } }) {
  const [name, setName] = useState("");
  const [photoProfile, setPhotoProfile] = useState("");
  const [exam, setExam] = useState<any>(null);
  const { id } = params;
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        const user = decoded.user;
        console.log("User ID:", user.id);
        setName(user.name);
        setPhotoProfile(user.photo_profile);
        console.log("Token:", token);

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

      setExam(response.data);
    } catch (error) {
      console.error(`Error fetching exam detail for ID ${id}:`, error);
      Swal.fire({
        icon: "error",
        title: "Failed to fetch exam",
        text: "Unable to load exam details. Please try again.",
      });
    }
  };

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
        `https://api.taktix.co.id/student/exam/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        Swal.fire({
          icon: "success",
          title: "History found",
          text: "Your exam history is available.",
        });
        router.push(`/soal/riwayat/${id}`);
        console.log("History response:", response.data);
      }
    } catch (error) {
      console.error(`Error fetching history for exam ID ${id}:`, error);
      Swal.fire({
        icon: "error",
        title: "History not found",
        text: "No history available for this exam.",
      });
    }
  };

  const handleBeriRating = () => {
    router.push(`/soal/rating/${id}`);
  };

  const handleStartExam = () => {
    router.push(`/soal/kerjakan_soal/${id}`);
  };

  if (!exam) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mx-40 my-14">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="h-6 w-2 rounded-lg bg-yellow-300"></div>
          <h1 className="ml-4 my-2">Detail Ujian</h1>
        </div>
      </div>

      {/* Details Section */}
      <div className="flex flex-col items-center my-8">
        <div className="w-full max-w-[1000px] bg-blue-700 rounded-[20px] p-8">
          {/* Title Section */}
          <h2 className="text-white text-[24px] font-semibold mb-6">
            {exam.title}
          </h2>

          {/* Details Section */}
          <div className="grid grid-cols-3 gap-4 text-white">
            <div className="flex flex-col">
              <span className="text-[18px] font-normal">Kategori</span>
              <span className="text-[18px] font-semibold">
                {exam.category?.name || "N/A"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[18px] font-normal">Kategori Ujian</span>
              <span className="text-[18px] font-semibold">
                {exam.exam_category?.name || "N/A"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[18px] font-normal">Harga</span>
              <span className="text-[18px] font-semibold">
                {exam.is_free ? "Gratis" : "Berbayar"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[18px] font-normal">Jumlah Soal</span>
              <span className="text-[18px] font-semibold">
                {exam.total_question} Soal
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[18px] font-normal">Durasi</span>
              <span className="text-[18px] font-semibold">
                {exam.duration} Menit
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[18px] font-normal">Publikasi</span>
              <span className="text-[18px] font-semibold">
                {exam.is_public ? "Publik" : "Privat"}
              </span>
            </div>
          </div>

          {/* Button Section */}
          <div className="flex justify-center mt-10 space-x-6">
            <button
              className="w-[240px] h-[52px] bg-white text-blue-700 text-xl font-semibold rounded-[20px]"
              onClick={handleStartExam}
            >
              Kerjakan Soal
            </button>
            <button
              className="w-[240px] h-[52px] bg-green-700 text-white text-xl font-semibold rounded-[20px]"
              onClick={() => router.push(`/soal/kunci_jawaban/${id}`)}
            >
              Lihat Kunci Jawaban
            </button>
            <button
              className="w-[240px] h-[52px] bg-red-700 text-white text-xl font-semibold rounded-[20px]"
              onClick={handleCheckHistory}
            >
              Cek History
            </button>
            <button
              className="w-[240px] h-[52px] bg-yellow-400 text-white text-xl font-semibold rounded-[20px]"
              onClick={handleBeriRating}
            >
              Beri Rating
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}