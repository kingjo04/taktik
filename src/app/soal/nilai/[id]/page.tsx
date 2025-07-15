
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

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
  question_type_id: number;
  a: string;
  b: string;
  c: string;
  d: string;
  e: string;
  answer: string;
  correct_statement_label?: string;
  incorrect_statement_label?: string;
  created_at: string;
  updated_at: string;
}

interface ExamResponse {
  id: number;
  title: string;
  category: { name: string };
  finished_attemption: Array<{
    id: number;
    total_correct: number;
    total_incorrect: number;
    total_empty: number;
    score: number;
    started_at: string;
    finished_at: string;
  }>;
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
    title: string;
    category: { name: string };
  };
}

export default function Nilai({ params }: { params: { id: string } }) {
  const [attemptionData, setAttemptionData] = useState<AttemptionResponse | null>(null);
  const [examData, setExamData] = useState<ExamResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = params;
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        setLoading(true);
        const examResponse = await axios.get(
          `https://api.taktix.co.id/student/exam/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setExamData(examResponse.data);

        const latestAttemption = examResponse.data.finished_attemption?.[
          examResponse.data.finished_attemption.length - 1
        ];
        if (!latestAttemption || !latestAttemption.id) {
          throw new Error("Anda belum menyelesaikan ujian ini.");
        }

        const attemptionResponse = await axios.get(
          `https://api.taktix.co.id/student/exam/${id}/attemption/${latestAttemption.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = attemptionResponse.data as AttemptionResponse;
        setAttemptionData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(
          "Gagal mengambil hasil ujian. Pastikan Anda sudah menyelesaikan ujian."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <span className="text-2xl text-blue-600 animate-pulse">Memuat Hasil...</span>
      </div>
    );
  }

  if (error || !attemptionData || !examData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-red-500 text-xl">{error || "Data tidak ditemukan"}</div>
      </div>
    );
  }

  const calculatedScore = attemptionData.total_correct * 4;
  const totalQuestions = attemptionData.total_correct + attemptionData.total_incorrect + attemptionData.total_empty;
  const maxScore = totalQuestions * 4;
  const correctPercentage = ((attemptionData.total_correct / totalQuestions) * 100).toFixed(1);
  const incorrectCount = attemptionData.total_incorrect;
  const emptyCount = attemptionData.total_empty;
  const courseName = attemptionData.exam.title || "Ujian Tidak Diketahui";
  const categoryName = examData.category?.name || "Kategori Tidak Diketahui";
  const startDate = new Date(attemptionData.started_at);
  const finishDate = new Date(attemptionData.finished_at);
  const totalTimeMs = finishDate.getTime() - startDate.getTime();
  const totalTimeMinutes = Math.floor(totalTimeMs / (1000 * 60));
  const totalTimeSeconds = Math.floor((totalTimeMs % (1000 * 60)) / 1000);

  const getStudySuggestion = () => {
    const thresholdLow = totalQuestions * 0.4;
    const thresholdMedium = totalQuestions * 0.6;
    const thresholdHigh = totalQuestions * 0.8;
    if (attemptionData.total_correct >= thresholdHigh) return "Selamat! Anda luar biasa. Coba tantangan baru!";
    if (attemptionData.total_correct >= thresholdMedium) return "Bagus! Perbaiki soal yang salah.";
    if (attemptionData.total_correct >= thresholdLow) return "Cukup baik. Pelajari ulang yang sulit.";
    return "Ayo semangat! Mulai dari dasar dan coba lagi!";
  };

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8 ml-16">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-center">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/e65299e39c2b2a80b59b1c39be7b6eb50ec4951b8157f707c49ddb3037738ec2?apiKey=19816b9fb5bc4b9987983517808491df"
            alt="Logo"
            className="h-12 w-12 object-contain rounded-lg hover:scale-110 transition-transform"
          />
          <h1 className="text-4xl font-extrabold text-blue-700 ml-3">
            Hasil Ujian - {courseName} 🌟
          </h1>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-green-50 p-6 rounded-xl text-center hover:bg-green-100 transition">
              <p className="text-gray-600 font-semibold">Skor Anda</p>
              <p className="text-4xl font-bold text-green-700">{calculatedScore}/{maxScore}</p>
              <p className="text-sm text-gray-500">
                (4 poin x {attemptionData.total_correct} benar)
              </p>
            </div>
            <div className="bg-blue-50 p-6 rounded-xl text-center hover:bg-blue-100 transition">
              <p className="text-gray-600 font-semibold">Total Soal</p>
              <p className="text-4xl font-bold text-blue-700">{totalQuestions}</p>
            </div>
            <div className="bg-green-50 p-6 rounded-xl text-center hover:bg-green-100 transition">
              <p className="text-gray-600 font-semibold">Benar</p>
              <p className="text-4xl font-bold text-green-700">{attemptionData.total_correct}</p>
              <p className="text-sm text-gray-500">({correctPercentage}%)</p>
            </div>
            <div className="bg-red-50 p-6 rounded-xl text-center hover:bg-red-100 transition">
              <p className="text-gray-600 font-semibold">Salah</p>
              <p className="text-4xl font-bold text-red-700">{incorrectCount}</p>
            </div>
            <div className="bg-yellow-50 p-6 rounded-xl text-center hover:bg-yellow-100 transition">
              <p className="text-gray-600 font-semibold">Kosong</p>
              <p className="text-4xl font-bold text-yellow-700">{emptyCount}</p>
            </div>
          </div>
          <div className="mt-6 text-center text-gray-700">
            <p>Kategori: {categoryName}</p>
            <p>Waktu Mulai: {new Date(attemptionData.started_at).toLocaleString("id-ID", {
              dateStyle: "full",
              timeStyle: "short",
            })}</p>
            <p>Waktu Selesai: {new Date(attemptionData.finished_at).toLocaleString("id-ID", {
              dateStyle: "full",
              timeStyle: "short",
            })}</p>
            <p>Total Waktu: {totalTimeMinutes} menit {totalTimeSeconds} detik</p>
          </div>
          <div className="mt-8 text-center">
            <p className="text-lg text-blue-700 font-semibold">Saran Belajar:</p>
            <p className="text-gray-600 mt-2">{getStudySuggestion()}</p>
          </div>
          <div className="mt-10">
            <h2 className="text-2xl font-semibold text-blue-700 mb-6 text-center">
              Detail Jawaban Anda 🎓
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {attemptionData.exam.questions.map((question, index) => {
                const userAnswer = attemptionData.answers.find(
                  (a) => a.question_id === question.id
                )?.answer;
                const isCorrect = attemptionData.answers.find(
                  (a) => a.question_id === question.id
                )?.is_correct;

                return (
                  <div
                    key={question.id}
                    className="bg-gray-50 p-5 rounded-xl border border-gray-200 hover:bg-gray-100 transition"
                  >
                    <p className="text-md text-gray-700 mb-2">
                      Soal {index + 1}:{" "}
                      {question.image ? (
                        <img
                          src={question.image}
                          alt={`Soal ${index + 1}`}
                          className="mt-2 max-w-full h-auto rounded-lg shadow-md"
                        />
                      ) : (
                        question.question || "Tidak ada deskripsi"
                      )}
                    </p>
                    <p className="text-md">
                      Jawaban Anda:{" "}
                      <span
                        className={
                          isCorrect === false
                            ? "text-red-600 font-medium"
                            : isCorrect === true
                            ? "text-green-600 font-medium"
                            : "text-yellow-600 font-medium"
                        }
                      >
                        {userAnswer || "Kosong"}
                      </span>
                    </p>
                    <p className="text-md">
                      Jawaban Benar:{" "}
                      <span className="text-blue-600 font-medium">{question.answer}</span>
                    </p>
                    {isCorrect === false && (
                      <p className="text-sm text-red-500 mt-1">
                        (Salah: -0 poin, coba lagi ya!)
                      </p>
                    )}
                    {!userAnswer && (
                      <p className="text-sm text-yellow-500 mt-1">
                        (Kosong: 0 poin, semangat untuk berikutnya!)
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mt-10 text-center">
            <button
              onClick={() => router.push(`/soal/kunci_jawaban/${id}`)}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold rounded-full shadow-lg hover:from-blue-600 hover:to-blue-800 transition transform hover:scale-105"
            >
              Lihat Kunci Jawaban Lengkap 📚
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
