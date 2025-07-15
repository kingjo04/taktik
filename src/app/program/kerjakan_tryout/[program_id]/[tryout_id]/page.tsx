"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
// Import lainnya...

export default function KerjakanTryoutPage({ params }: { params: { program_id: string, tryout_id: string } }) {
  // State dan logika lainnya...

  const handleSubmit = async () => {
    try {
      // Misal: mengirim jawaban via fetch / supabase
      const response = await fetch("/api/submit", {
        method: "POST",
        body: JSON.stringify({ jawaban }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal mengirim jawaban");
      }

      Swal.fire({
        title: "Berhasil",
        text: "Jawaban berhasil dikirim!",
        icon: "success",
        confirmButtonText: "OK",
      });

    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Gagal mengirim jawaban. Coba lagi nanti.";

      Swal.fire({
        title: "Error",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="p-4">
      {/* UI soal & tombol */}
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Kirim Jawaban
      </button>
    </div>
  );
}
