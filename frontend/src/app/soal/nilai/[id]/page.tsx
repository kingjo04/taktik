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

export default function Nilai({ params }: { params: { id: string } }) {
  const [attemptionData, setAttemptionData] = useState<AttemptionResponse | null>(null);
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
          `https://api.taktix.co.id/student/exam/${id}`,
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
          `https://api.taktix.co.id/student/exam/${id}/attemption/${latestAttemption.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = attemptionResponse.data as AttemptionResponse;
        setAttemptionData(data);
      } catch (error) {
        console.error("Error fetching attemption data:", error);
        setError(
          "Gagal mengambil hasil ujian. Pastikan Anda sudah menyelesaikan ujian."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAttemptionData();
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-2xl text-blue-600">Loading...</div>
      </div>
    );
  }

  if (error || !attemptionData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-red-500 text-xl">{error || "Data tidak ditemukan"}</div>
      </div>
    );
  }

  const totalQuestions = attemptionData.total_correct + attemptionData.total_incorrect + attemptionData.total_empty;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
          Hasil Ujian Anda
        </h1>
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <div className="flex justify-around mb-6">
            <div className="text-center">
              <p className="text-gray-600">Skor</p>
              <p className="text-4xl font-bold text-green-600">
                {attemptionData.score}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-600">Total Soal</p>
              <p className="text-4xl font-bold text-blue-600">{totalQuestions}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-600">Benar</p>
              <p className="text-4xl font-bold text-green-600">
                {attemptionData.total_correct}
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-600">Salah</p>
              <p className="text-4xl font-bold text-red-600">
                {attemptionData.total_incorrect}
              </p>
            </div>
          </div>
          <div className="mt-6 text-center">
            <p className="text-gray-700">
              Waktu Mulai: {new Date(attemptionData.started_at).toLocaleString()}
            </p>
            <p className="text-gray-700">
              Waktu Selesai: {new Date(attemptionData.finished_at).toLocaleString()}
            </p>
          </div>
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-blue-700 mb-4">
              Detail Jawaban
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                  >
                    <p className="text-sm text-gray-600">
                      Soal {index + 1}: {question.question || "Tidak ada deskripsi"}
                    </p>
                    <p className="text-sm">
                      Jawaban Anda:{" "}
                      <span
                        className={
                          isCorrect === false
                            ? "text-red-600 font-medium"
                            : isCorrect === true
                            ? "text-green-600 font-medium"
                            : "text-gray-600"
                        }
                      >
                        {userAnswer || "Tidak dijawab"}
                      </span>
                    </p>
                    <p className="text-sm">
                      Jawaban Benar:{" "}
                      <span className="text-blue-600 font-medium">
                        {question.answer}
                      </span>
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mt-8 text-center">
            <button
              onClick={() => router.push(`/soal/kunci_jawaban/${id}`)}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
            >
              Lihat Kunci Jawaban Lengkap
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}