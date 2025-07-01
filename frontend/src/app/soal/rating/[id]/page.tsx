"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function BeriRating({ params }: { params: { id: string } }) {
  const [rating, setRating] = useState(0); // Nilai rating (1-5)
  const [feedback, setFeedback] = useState(""); // Feedback pengguna
  const { id } = params; // ID soal
  const router = useRouter();

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Anda harus login untuk memberikan rating.");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/soal/rating/${id}`,
        {
          rating,
          feedback,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Rating berhasil disimpan!");
      router.push(`/soal/detail_soal/${id}`); // Redirect ke halaman detail soal
    } catch (error) {
      console.error("Error submitting rating:", error);
      alert("Terjadi kesalahan saat menyimpan rating.");
    }
  };

  const handleRatingClick = (value: number) => {
    setRating(value); // Mengatur nilai rating berdasarkan klik
  };

  return (
    <div className="mx-40 my-14">
      <h1 className="text-2xl font-semibold mb-6">Beri Rating</h1>
      <div className="flex flex-col items-center">
        {/* Rating Bintang */}
        <div className="flex space-x-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleRatingClick(star)}
              className={`w-10 h-10 text-2xl ${
                star <= rating ? "text-yellow-500" : "text-gray-400"
              }`}
            >
              ★
            </button>
          ))}
        </div>

        {/* Form Feedback */}
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="w-full max-w-lg p-4 border rounded-lg"
          rows={5}
          placeholder="Berikan feedback Anda di sini..."
        ></textarea>

        {/* Tombol Submit */}
        <button
          onClick={handleSubmit}
          className="mt-4 px-6 py-2 bg-blue-700 text-white text-lg font-semibold rounded-lg"
        >
          Kirim Rating
        </button>
      </div>
    </div>
  );
}
