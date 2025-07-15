"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

export default function SoalDetail({ params }: { params: { id: string } }) {
  const [name, setName] = useState("");
  const [photoProfile, setPhotoProfile] = useState("");
  const [exam, setExam] = useState<any>(null);
  const { id } = params;
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);
  const [pollCount, setPollCount] = useState(0);
  const maxPolls = 10; // Maksimal 10 cek (total ~50 detik)

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        const user = decoded.user;
        console.log("User ID:", user.id);
        setName(user.name);
        setPhotoProfile(user.photo_profile || "");
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

      if (response.data) {
        setExam(response.data);
      }
    } catch (error) {
      console.error(`Error fetching exam detail for ID ${id}:`, error);
      setExam({ ...exam, is_enrolled: false }); // Asumsikan belum terdaftar jika error
    }
  };

  const handleRegisterAndPoll = async () => {
    if (isRegistering) return; // Prevent multiple clicks
    setIsRegistering(true);
    setPollCount(0); // Reset poll counter

    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Token not found",
        text: "Please login to start the exam.",
      });
      setIsRegistering(false);
      return;
    }

    // Tampilkan popup proses
    Swal.fire({
      icon: "info",
      title: "Pendaftaran Diproses",
      text: "Kami sedang memproses pendaftaran Anda. Mohon tunggu sebentar...",
      timerProgressBar: true,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const pollCheckout = async () => {
      try {
        const response = await axios.post(
          "https://payment.taktix.co.id/api/v1/checkout",
          {
            payment_method: "xendit",
            product_type_code: "exam",
            product_reference_id: id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        // Cek respons untuk kasus "user is already enrolled"
        if (response.data.message === "user is already enrolled" && response.status === 500 && !response.data.success) {
          Swal.close();
          Swal.fire({
            icon: "success",
            title: "Pendaftaran Berhasil",
            text: "Anda sudah terdaftar untuk ujian ini.",
            confirmButtonText: "Lanjut",
            confirmButtonColor: "#28a745",
            customClass: {
              confirmButton: "bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md",
            },
          }).then(() => {
            router.push(`/soal/kerjakan_soal/${id}`);
            setIsRegistering(false);
          });
        } else if (pollCount >= maxPolls) {
          Swal.close();
          Swal.fire({
            icon: "warning",
            title: "Proses Tertunda",
            text: "Pendaftaran memakan waktu lebih lama. Silakan coba lagi nanti.",
            confirmButtonText: "Coba Lagi",
            confirmButtonColor: "#ffc107",
            customClass: {
              confirmButton: "bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md",
            },
          }).then(() => {
            setIsRegistering(false);
          });
        } else {
          setPollCount((prev) => prev + 1);
          setTimeout(pollCheckout, 5000); // Polling setiap 5 detik
        }
      } catch (error: any) {
        console.error("Registration error:", error.response?.data || error.message);
        if (error.response?.data?.message === "user is already enrolled" && error.response?.status === 500 && !error.response?.data.success) {
          Swal.close();
          Swal.fire({
            icon: "success",
            title: "Pendaftaran Berhasil",
            text: "Anda sudah terdaftar untuk ujian ini.",
            confirmButtonText: "Lanjut",
            confirmButtonColor: "#28a745",
            customClass: {
              confirmButton: "bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md",
            },
          }).then(() => {
            router.push(`/soal/kerjakan_soal/${id}`);
            setIsRegistering(false);
          });
        } else if (pollCount >= maxPolls) {
          Swal.close();
          Swal.fire({
            icon: "warning",
            title: "Proses Tertunda",
            text: "Pendaftaran memakan waktu lebih lama. Silakan coba lagi nanti.",
            confirmButtonText: "Coba Lagi",
            confirmButtonColor: "#ffc107",
            customClass: {
              confirmButton: "bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md",
            },
          }).then(() => {
            setIsRegistering(false);
          });
        } else {
          setPollCount((prev) => prev + 1);
          setTimeout(pollCheckout, 5000); // Polling setiap 5 detik
        }
      }
    };

    pollCheckout();
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
    handleRegisterAndPoll(); // Langsung panggil proses pendaftaran dan polling
  };

  if (!exam) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <span className="text-2xl text-blue-600 animate-pulse">Memuat Detail Ujian...</span>
      </div>
    );
  }

  return (
    <div className="flex">
      <main className="flex-1 min-h-screen bg-white p-4 sm:p-6 lg:p-8 ml-16">
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
          <div className="w-full max-w-full md:max-w-3xl bg-gradient-to-br from-blue-700 to-blue-900 rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300">
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
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <button
                className="w-full sm:w-[240px] h-14 bg-white text-blue-700 text-xl font-semibold rounded-2xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleStartExam}
                disabled={isRegistering}
              >
                {isRegistering ? "Memproses..." : "Kerjakan Soal"}
              </button>
              <button
                className="w-full sm:w-[240px] h-14 bg-green-700 text-white text-xl font-semibold rounded-2xl hover:bg-green-600 transition-all duration-300 transform hover:scale-105"
                onClick={() => router.push(`/soal/kunci_jawaban/${id}`)}
              >
                Lihat Kunci Jawaban
              </button>
              <button
                className="w-full sm:w-[240px] h-14 bg-red-700 text-white text-xl font-semibold rounded-2xl hover:bg-red-600 transition-all duration-300 transform hover:scale-105"
                onClick={handleCheckHistory}
              >
                Cek History
              </button>
              <button
                className="w-full sm:w-[240px] h-14 bg-yellow-400 text-white text-xl font-semibold rounded-2xl hover:bg-yellow-500 transition-all duration-300 transform hover:scale-105"
                onClick={handleBeriRating}
              >
                Beri Rating
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}