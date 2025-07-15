"use client";

import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios"; // Tambahin AxiosError buat tipe error
import { useRouter } from "next/navigation";

export default function BeriRating({ params }: { params: { id: string } }) {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [hasRated, setHasRated] = useState(false);
  const [previousRating, setPreviousRating] = useState<number | null>(null);
  const [previousFeedback, setPreviousFeedback] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const { id } = params;
  const router = useRouter();

  useEffect(() => {
    const checkIfRated = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        // Cek apakah sudah pernah rating
        const checkResponse = await axios.get(
          `/api/exam/${id}/check-if-ever-rate`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Check If Rated Response:", checkResponse.data);
        setHasRated(checkResponse.data.message === "Sudah pernah memberikan rating");

        // Ambil data rating sebelumnya dari endpoint /api/exam/{id}
        if (checkResponse.data.message === "Sudah pernah memberikan rating") {
          const examResponse = await axios.get(
            `/api/exam/${id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          console.log("Exam Response:", examResponse.data);
          const userRating = examResponse.data.user_rating;
          if (userRating) {
            setPreviousRating(userRating.rate || null);
            setPreviousFeedback(userRating.feedback || null);
            setRating(userRating.rate || 0); // Tampilkan rating sebelumnya
            setFeedback(userRating.feedback || ""); // Tampilkan feedback sebelumnya
          }
        }
      } catch (error: AxiosError | any) { // Tambahin tipe AxiosError atau any
        console.error("Error checking if rated:", error);
        if (error.response?.status === 400) {
          setHasRated(true); // Anggap sudah pernah kalau 400
          const examResponse = await axios.get(
            `/api/exam/${id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const userRating = examResponse.data.user_rating;
          if (userRating) {
            setPreviousRating(userRating.rate || null);
            setPreviousFeedback(userRating.feedback || null);
            setRating(userRating.rate || 0);
            setFeedback(userRating.feedback || "");
          }
        }
      }
    };

    checkIfRated();
  }, [id]);

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setModalMessage("Anda harus login untuk memberikan rating.");
      setShowModal(true);
      return;
    }

    if (rating === 0) {
      setModalMessage("Silakan pilih rating terlebih dahulu.");
      setShowModal(true);
      return;
    }

    if (hasRated && rating === previousRating && feedback === previousFeedback) {
      setModalMessage("Rating dan feedback sudah sama dengan sebelumnya.");
      setShowModal(true);
      return;
    }

    try {
      const response = await axios.post(
        `/api/exam/${id}/rate`,
        {
          rate: rating,
          feedback,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Rating Response:", response.data);
      setModalMessage("Rating berhasil disimpan!");
      setShowModal(true);
      setHasRated(true);
      setPreviousRating(rating);
      setPreviousFeedback(feedback);
    } catch (error: any) {
      console.error("Error submitting rating:", error);
      if (error.response) {
        setModalMessage(`Terjadi kesalahan: ${error.response.data.message || error.message}`);
      } else if (error.request) {
        setModalMessage("Tidak ada respons dari server. Cek koneksi atau proxy.");
      } else {
        setModalMessage(`Terjadi kesalahan: ${error.message}`);
      }
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    if (modalMessage.includes("berhasil")) {
      router.push(`/soal/detail_soal/${id}`);
    }
  };

  const handleRatingClick = (value: number) => {
    setRating(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4 sm:p-6 md:p-8">
      <div className="max-w-md mx-auto sm:max-w-lg md:max-w-xl lg:max-w-2xl pl-16 sm:pl-20 md:pl-64 ml-auto">
        <button
          onClick={() => router.back()}
          className="mb-6 p-2 bg-blue-100 rounded-full hover:bg-blue-200 transition-transform transform hover:scale-110"
        >
          <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-800 mb-6 text-center animate-fade-in">
          Berikan Penilaian Anda
        </h1>
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200">
          <div className="flex flex-col items-center space-y-6">
            {hasRated && previousRating !== null && (
              <div className="text-center text-gray-600 mb-4">
                <p className="font-semibold">Rating Sebelumnya: {previousRating} ★</p>
                {previousFeedback && <p>Feedback: "{previousFeedback}"</p>}
              </div>
            )}
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRatingClick(star)}
                  className={`text-3xl sm:text-4xl transition-all duration-300 transform hover:scale-125 ${
                    star <= rating ? "text-yellow-500" : "text-gray-300"
                  } ${hasRated ? "cursor-not-allowed opacity-50" : ""}`}
                  disabled={hasRated}
                >
                  ★
                </button>
              ))}
            </div>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full p-3 sm:p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y transition-all duration-200 placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
              rows={3}
              placeholder="Bagaimana pendapat Anda tentang ujian ini? (Opsional)"
              disabled={hasRated}
            />
            <button
              onClick={handleSubmit}
              className="w-full max-w-xs px-5 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg shadow-md hover:from-blue-700 hover:to-blue-800 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={rating === 0 || hasRated}
            >
              Kirim Penilaian
            </button>
            {hasRated && (
              <p className="text-red-500 text-sm mt-2 animate-pulse">Anda sudah memberikan penilaian sebelumnya.</p>
            )}
          </div>
        </div>
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-5 sm:p-6 shadow-2xl transform transition-all duration-300 scale-100 hover:scale-105">
              <p className="text-lg sm:text-xl text-gray-800 mb-4">{modalMessage}</p>
              <button
                onClick={closeModal}
                className="w-full px-5 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}