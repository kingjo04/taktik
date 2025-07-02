"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

// Definisikan tipe untuk data attemption
interface Answer {
  id: number;
  attemption_id: number;
  question_id: number;
  user_id: number;
  answer: string;
  is_correct: boolean;
  created_at: string;
  updated_at: string;
}

interface Question {
  id: number;
  exam_id: number;
  question: string;
  image?: string;
  answer: string;
}

interface AttemptionResponse {
  id: number;
  user_id: number;
  exam_id: number;
  started_at: string;
  finished_at: string;
  total_correct: number;
  total_incorrect: number;
  total_empty: number;
  score: number;
  answers: Answer[];
  exam: {
    questions: Question[];
  };
}

export default function KunciJawaban({ params }: { params: { id: string } }) {
  const [answers, setAnswers] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = params;
  const router = useRouter();

  useEffect(() => {
    const fetchAttemptionData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        setLoading(true);
        const examResponse = await axios.get(
          `/api/exam/${id}`, // Pakai proxy
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const latestAttemption =
          examResponse.data.finished_attemption?.[
            examResponse.data.finished_attemption.length - 1
          ];
        if (!latestAttemption || !latestAttemption.id) {
          throw new Error("Anda belum menyelesaikan ujian ini.");
        }

        const attemptionResponse = await axios.get(
          `/api/exam/${id}/attemption/${latestAttemption.id}`, // Pakai proxy
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const attemptionData = attemptionResponse.data as AttemptionResponse;
        setAnswers(attemptionData.exam.questions);
      } catch (error) {
        console.error("Error fetching attemption data:", error);
        setError(
          "Gagal mengambil kunci jawaban. Pastikan Anda sudah menyelesaikan ujian."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAttemptionData();
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="text-2xl text-blue-600 animate-pulse">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  if (!answers.length) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="text-gray-600 text-xl">
          Tidak ada kunci jawaban tersedia untuk ujian ini.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-700 mb-8 text-center">
          Kunci Jawaban Ujian
        </h1>
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <table className="min-w-full bg-gray-50 border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-blue-700 text-white">
                <th className="p-4 text-left">Nomor</th>
                <th className="p-4 text-left">Soal</th>
                <th className="p-4 text-left">Jawaban Benar</th>
              </tr>
            </thead>
            <tbody>
              {answers.map((question, index) => (
                <tr
                  key={question.id}
                  className="border-b hover:bg-gray-100 transition-colors"
                >
                  <td className="p-4 font-medium">{index + 1}</td>
                  <td className="p-4 text-gray-700">
                    {question.image ? (
                      <img
                        src={question.image}
                        alt={`Soal ${index + 1}`}
                        className="mt-2 max-w-full h-auto rounded-lg"
                      />
                    ) : (
                      question.question || "Tidak ada deskripsi soal"
                    )}
                  </td>
                  <td className="p-4 text-blue-600 font-semibold">
                    {question.answer || "Tidak tersedia"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-8 text-center">
            <button
              onClick={() => router.push(`/soal/nilai/${id}`)}
              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition"
            >
              Kembali ke Hasil Ujian
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}