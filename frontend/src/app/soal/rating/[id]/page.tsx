"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function BeriRating({ params }: { params: { id: string } }) {
  const [rating, setRating] = useState(0); // Nilai rating (1-5)
  const [feedback, setFeedback] = useState(""); // Feedback pengguna
  const [hasRated, setHasRated] = useState(false); // Status apakah udah rate
  const [showModal, setShowModal] = useState(false); // Kontrol modal
  const [modalMessage, setModalMessage] = useState(""); // Pesan modal
  const { id } = params; // ID soal
  const router = useRouter();

  useEffect(() => {
    const checkIfRated = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await axios.get(
          `/api/exam/${id}/check-if-ever-rate`, // Pakai proxy
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Check If Rated Response:", response.data);
        setHasRated(response.data.hasRated || false); // Asumsi API kembalikan { hasRated: boolean }
      } catch (error) {
        console.error("Error checking if rated:", error);
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

    if (hasRated) {
      setModalMessage("Anda sudah memberikan rating untuk ujian ini.");
      setShowModal(true);
      return;
    }

    try {
      const response = await axios.post(
        `/api/exam/${id}/rate`, // Pakai proxy
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
      console.log("Request Config:", {
        url: response.config.url,
        method: response.config.method,
        headers: response.config.headers,
        data: response.config.data,
      });
      setModalMessage("Rating berhasil disimpan!");
      setShowModal(true);
      // Tidak redirect langsung, biar user lihat popup dulu
    } catch (error: any) {
      console.error("Error submitting rating:", error);
      if (error.response) {
        console.error("Response Data:", error.response.data);
        console.error("Response Status:", error.response.status);
        console.error("Response Headers:", error.response.headers);
        setModalMessage(`Terjadi kesalahan: ${error.response.data.message || error.message}`);
      } else if (error.request) {
        console.error("No response received:", error.request);
        setModalMessage("Tidak ada respons dari server. Cek koneksi atau proxy.");
      } else {
        console.error("Error setting up request:", error.message);
        setModalMessage(`Terjadi kesalahan: ${error.message}`);
      }
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    if (modalMessage.includes("berhasil")) {
      router.push(`/soal/detail_soal/${id}`); // Redirect hanya kalau sukses
    }
  };

  const handleRatingClick = (value: number) => {
    setRating(value);
  };

  return (
    <div className="mx-40 my-14">
      <h1 className="text-2xl font-semibold mb-6">Beri Rating</h1>
      <div className="flex flex-col items-center">
        <div className="flex space-x-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleRatingClick(star)}
              className={`w-10 h-10 text-2xl ${
                star <= rating ? "text-yellow-500" : "text-gray-400"
              }`}
              disabled={hasRated}
            >
              ★
            </button>
          ))}
        </div>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="w-full max-w-lg p-4 border rounded-lg"
          rows={5}
          placeholder="Berikan feedback Anda di sini..."
          disabled={hasRated}
        ></textarea>
        <button
          onClick={handleSubmit}
          className="mt-4 px-6 py-2 bg-blue-700 text-white text-lg font-semibold rounded-lg"
          disabled={rating === 0 || hasRated}
        >
          Kirim Rating
        </button>
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p className="text-lg">{modalMessage}</p>
              <button
                onClick={closeModal}
                className="mt-4 px-4 py-2 bg-blue-700 text-white rounded-lg"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
        {hasRated && (
          <p className="mt-2 text-red-500">Anda sudah memberikan rating sebelumnya.</p>
        )}
      </div>
    </div>
  );
}