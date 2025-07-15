"use client";
import React, { useState, useEffect } from "react";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes, faQuestion, faArrowLeft, faTrophy, faEye } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

interface CustomJwtPayload extends JwtPayload {
  user: {
    name: string;
    photo_profile: string;
  };
}

interface AttemptionItem {
  id: number;
  started_at: string;
  finished_at: string;
  total_correct: number;
  total_incorrect: number;
  total_empty: number;
  score: number;
}

interface ExamData {
  id: number;
  title: string;
  exam_category: {
    name: string;
  };
  category: {
    name: string;
  };
  finished_attemption: AttemptionItem[];
}

export default function Riwayat({ params }: { params: { id: string } }) {
  const [name, setName] = useState("");
  const [photoProfile, setPhotoProfile] = useState("");
  const [examData, setExamData] = useState<ExamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const { id } = params;
  const router = useRouter();
  const [showProgressPopup, setShowProgressPopup] = useState(false);

  // Hitung total soal
  const getTotalQuestions = (attemption: AttemptionItem) => {
    return attemption.total_correct + attemption.total_incorrect + attemption.total_empty;
  };

  // Hitung skor berdasarkan poin (benar 4, salah/kosong 0)
  const calculateScore = (attemption: AttemptionItem) => {
    const totalPossible = getTotalQuestions(attemption) * 4;
    const actualScore = attemption.total_correct * 4;
    return `${actualScore}/${totalPossible}`;
  };

  // Hitung durasi pengerjaan
  const getDuration = (start: string, end: string) => {
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    const durationMs = endTime - startTime;
    const minutes = Math.floor(durationMs / (1000 * 60));
    const seconds = Math.floor((durationMs % (1000 * 60)) / 1000);
    return `${minutes} menit ${seconds} detik`;
  };

  // Evaluasi performa
  const evaluatePerformance = (totalCorrect: number, totalQuestions: number) => {
    const percentage = (totalCorrect / totalQuestions) * 100;
    if (percentage >= 80) return "Luar Biasa! Kamu sudah sangat siap!";
    if (percentage >= 60) return "Bagus! Terus tingkatkan!";
    return "Cukup baik, ayo belajar lebih giat!";
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<CustomJwtPayload>(token);
        const user = decoded.user;
        setName(user.name);
        setPhotoProfile(user.photo_profile);
      } catch (error) {
        console.error("Invalid token:", error);
        setName("");
        setPhotoProfile("");
      }
    }
  }, []);

  useEffect(() => {
    const fetchRiwayat = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const response = await fetch(`/api/exam/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        if (!response.ok) throw new Error("Gagal mengambil data ujian.");
        const data = await response.json();
        setExamData(data);
      } catch (error: any) {
        console.error("Failed to fetch exam data:", error);
        setError(error.message || "Gagal mengambil data ujian.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchRiwayat();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="text-2xl text-blue-600 animate-pulse">Loading...</div>
      </div>
    );
  }

  if (error || !examData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="text-red-500 text-xl">{error || "Data ujian tidak ditemukan."}</div>
      </div>
    );
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const sortedItems = [...examData.finished_attemption].sort((a, b) => new Date(b.finished_at).getTime() - new Date(a.finished_at).getTime());
  const currentItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(examData.finished_attemption.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  // Hitung rata-rata progres
  const totalAttempts = examData.finished_attemption.length;
  const totalCorrect = examData.finished_attemption.reduce((sum, att) => sum + att.total_correct, 0);
  const totalQuestions = examData.finished_attemption.reduce((sum, att) => sum + getTotalQuestions(att), 0);
  const averageScore = totalAttempts > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const overallPerformance = averageScore >= 80 ? "Keren! Kamu sangat siap!" : averageScore >= 60 ? "Bagus, tingkatkan lagi!" : "Cukup baik, terus belajar ya!";

  return (
    <div className="flex">
      <main className="flex-1 min-h-screen bg-gradient-to-br from-blue-50 to-white p-2 sm:p-4 md:p-6 lg:p-8 ml-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center mb-4 sm:mb-0">
            <button
              type="button"
              className="mr-2 sm:mr-4 p-1 sm:p-2 bg-blue-100 rounded-full hover:bg-blue-200 transition"
              onClick={() => router.back()}
            >
              <FontAwesomeIcon icon={faArrowLeft} className="text-blue-600 text-sm sm:text-base" />
            </button>
            <div className="flex items-center">
              <div className="h-2 sm:h-3 w-1 sm:w-1.5 bg-yellow-400 rounded-full animate-pulse"></div>
              <h1 className="ml-2 sm:ml-3 text-lg sm:text-xl md:text-2xl font-bold text-blue-800">Riwayat Belajarmu</h1>
            </div>
          </div>
          {name && photoProfile && (
            <div className="flex items-center space-x-2 sm:space-x-4">
              <img src={photoProfile} alt="Profile" className="w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 rounded-full object-cover" />
              <span className="text-sm sm:text-base md:text-lg font-medium text-blue-600">Halo, {name}!</span>
            </div>
          )}
        </div>

        <div className="my-4 sm:my-8">
          {examData.finished_attemption.length === 0 ? (
            <div className="text-center">
              <p className="text-gray-600 text-base sm:text-lg">Belum ada riwayat belajar. Yuk mulai ujian sekarang!</p>
              <button
                onClick={() => router.push(`/kedinasan`)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Mulai Belajar
              </button>
            </div>
          ) : (
            <div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-4 text-blue-800">
                {examData.title} - Pantau Progresmu!
              </h2>
              <p className="text-gray-600 text-sm sm:text-base mb-1">Kategori: {examData.category.name}</p>
              <p className="text-gray-600 text-sm sm:text-base">Mata Pelajaran: {examData.exam_category.name}</p>

              {currentItems.map((attemption, index) => {
                const totalQuestions = getTotalQuestions(attemption);
                const isTopScore = attemption.total_correct / totalQuestions >= 0.8;

                return (
                  <div key={attemption.id} className="border border-gray-200 rounded-lg p-2 sm:p-4 mb-2 sm:mb-4 shadow-md bg-white hover:bg-gray-50 transition-all duration-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                      <div>
                        <p className="text-gray-700 text-sm sm:text-base">
                          Tanggal:{" "}
                          <span className="font-semibold">{new Date(attemption.started_at).toLocaleDateString()}</span>
                        </p>
                        <p className="text-gray-700 text-sm sm:text-base">
                          Waktu:{" "}
                          <span className="font-semibold">
                            {new Date(attemption.started_at).toLocaleTimeString()} - {new Date(attemption.finished_at).toLocaleTimeString()}
                          </span>
                        </p>
                        <p className="text-gray-700 text-sm sm:text-base">
                          Waktu Pengerjaan:{" "}
                          <span className="font-semibold">{getDuration(attemption.started_at, attemption.finished_at)}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-700 text-sm sm:text-base">
                          Skor:{" "}
                          <span className={`font-semibold ${isTopScore ? "text-yellow-500" : "text-blue-600"}`}>
                            {calculateScore(attemption)}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 mt-2 sm:mt-4">
                      <div className="flex items-center space-x-1 sm:space-x-2 bg-green-100 p-1 sm:p-2 rounded-lg">
                        <FontAwesomeIcon icon={faCheck} className="text-green-600 text-xs sm:text-base" />
                        <span className="text-gray-800 font-medium text-xs sm:text-base">Benar: {attemption.total_correct}</span>
                      </div>
                      <div className="flex items-center space-x-1 sm:space-x-2 bg-red-100 p-1 sm:p-2 rounded-lg">
                        <FontAwesomeIcon icon={faTimes} className="text-red-600 text-xs sm:text-base" />
                        <span className="text-gray-800 font-medium text-xs sm:text-base">Salah: {attemption.total_incorrect}</span>
                      </div>
                      <div className="flex items-center space-x-1 sm:space-x-2 bg-yellow-100 p-1 sm:p-2 rounded-lg">
                        <FontAwesomeIcon icon={faQuestion} className="text-yellow-600 text-xs sm:text-base" />
                        <span className="text-gray-800 font-medium text-xs sm:text-base">Kosong: {attemption.total_empty}</span>
                      </div>
                    </div>
                    {isTopScore && (
                      <div className="mt-2 flex items-center text-yellow-500 animate-pulse">
                        <FontAwesomeIcon icon={faTrophy} className="mr-1" />
                        <span className="text-sm sm:text-base">Hebat! Dekati skor sempurna!</span>
                      </div>
                    )}
                    <p className="mt-2 text-sm text-gray-600">
                      Performa: {evaluatePerformance(attemption.total_correct, totalQuestions)}
                    </p>
                    <div className="mt-2 text-right">
                      <Link href={`/soal/detail_riwayat/${id}/${attemption.id}`}>
                        <button className="px-2 sm:px-3 py-1 bg-blue-600 text-white text-xs sm:text-sm rounded-lg hover:bg-blue-700 transition">
                          <FontAwesomeIcon icon={faEye} className="mr-1" /> Lihat Detail
                        </button>
                      </Link>
                    </div>
                  </div>
                );
              })}

              <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4 mt-2 sm:mt-4">
                <button
                  onClick={prevPage}
                  className="px-2 sm:px-4 py-1 sm:py-2 bg-gray-300 rounded-lg text-sm sm:text-base disabled:bg-gray-200"
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <div className="flex space-x-1 sm:space-x-2">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => paginate(i + 1)}
                      className={`px-2 sm:px-4 py-1 sm:py-2 rounded-lg text-sm sm:text-base ${
                        currentPage === i + 1 ? "bg-blue-700 text-white" : "bg-gray-300"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={nextPage}
                  className="px-2 sm:px-4 py-1 sm:py-2 bg-gray-300 rounded-lg text-sm sm:text-base disabled:bg-gray-200"
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="mt-6 p-4 bg-white rounded-lg shadow-md border border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-blue-800 mb-2">Pantau Progres Keseluruhan</h3>
            <button
              onClick={() => setShowProgressPopup(true)}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
            >
              Lihat Progres
            </button>
          </div>
          {showProgressPopup && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-4 rounded-lg shadow-lg w-11/12 max-w-md">
                <h3 className="text-lg font-bold text-blue-800 mb-2">Progres Keseluruhan</h3>
                <p className="text-gray-600 text-sm">
                  Total Percobaan: {totalAttempts} | Rata-rata Skor: {averageScore}% | Performa: {overallPerformance}
                </p>
                <button
                  onClick={() => setShowProgressPopup(false)}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Tutup
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
