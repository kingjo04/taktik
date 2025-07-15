"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

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
  a?: string;
  b?: string;
  c?: string;
  d?: string;
  e?: string;
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
          `/api/exam/${id}`,
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
          `/api/exam/${id}/attemption/${latestAttemption.id}`,
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
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-800">Kunci Jawaban Ujian</h1>
          </div>
        </div>

        <div className="my-4 sm:my-8">
          <div className="space-y-6">
            {answers.map((question, index) => (
              <div
                key={question.id}
                className="border border-gray-200 rounded-lg p-2 sm:p-4 mb-2 sm:mb-4 shadow-md bg-white hover:bg-gray-50 transition-all duration-200"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start mb-2">
                  <h3 className="text-sm sm:text-base font-medium text-gray-800 mb-2 sm:mb-0">
                    Soal {index + 1}: {question.question || "Tidak ada deskripsi soal"}
                  </h3>
                  {question.image && (
                    <img
                      src={question.image}
                      alt={`Soal ${index + 1}`}
                      className="mt-2 sm:mt-0 mx-auto max-w-xs sm:max-w-sm md:max-w-md h-auto rounded-lg object-contain"
                    />
                  )}
                </div>
                <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-gray-600 mt-2">
                  {["a", "b", "c", "d", "e"].map((opt) => (
                    <li key={opt}>
                      {opt.toUpperCase()}: {question[opt as keyof Question] || "Tidak tersedia"}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 text-sm sm:text-base font-semibold text-green-600">
                  Jawaban Benar: {question.answer || "Tidak tersedia"}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <button
              onClick={() => router.push(`/soal/nilai/${id}`)}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition"
            >
              Kembali ke Hasil Ujian
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
