"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes, faStar, faArrowLeft, faClock } from "@fortawesome/free-solid-svg-icons";

interface Answer {
  id: number;
  question_id: number;
  answer: string;
  is_correct: boolean;
}

interface Question {
  id: number;
  question: string;
  image: string | null;
  a: string;
  b: string;
  c: string;
  d: string;
  e: string;
  answer: string;
}

interface ExamMeta {
  id: number;
  title: string;
  category: {
    name: string;
  };
  exam_category: {
    name: string;
  };
}

interface AttemptionDetail {
  id: number;
  total_correct: number;
  total_incorrect: number;
  total_empty: number;
  started_at: string;
  finished_at: string;
  answers: Answer[];
  exam: {
    questions: Question[];
    exam_meta: ExamMeta;
  };
}

// Data Dummy kalau API gagal
const dummyData: AttemptionDetail = {
  id: 0,
  total_correct: 0,
  total_incorrect: 0,
  total_empty: 5,
  started_at: "2025-07-14T10:00:00Z",
  finished_at: "2025-07-14T10:30:00Z",
  answers: [],
  exam: {
    questions: [
      { id: 1, question: "Soal 1", image: null, a: "A1", b: "B1", c: "C1", d: "D1", e: "E1", answer: "A" },
      { id: 2, question: "Soal 2", image: null, a: "A2", b: "B2", c: "C2", d: "D2", e: "E2", answer: "B" },
      { id: 3, question: "Soal 3", image: null, a: "A3", b: "B3", c: "C3", d: "D3", e: "E3", answer: "C" },
      { id: 4, question: "Soal 4", image: null, a: "A4", b: "B4", c: "C4", d: "D4", e: "E4", answer: "D" },
      { id: 5, question: "Soal 5", image: null, a: "A5", b: "B5", c: "C5", d: "D5", e: "E5", answer: "E" },
    ],
    exam_meta: {
      id: 76,
      title: "Latihan Soal Matematika Wajib XI (001)",
      category: { name: "Kedinasan" },
      exam_category: { name: "Matematika" },
    },
  },
};

export default function DetailRiwayat() {
  const { id, attemptionId } = useParams();
  const router = useRouter();
  const [detailData, setDetailData] = useState<AttemptionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hitung total soal
  const getTotalQuestions = (): number => {
    if (!detailData) return 0;
    return detailData.total_correct + detailData.total_incorrect + detailData.total_empty;
  };

  // Hitung skor berdasarkan poin (benar 4, salah/kosong 0)
  const calculateScore = (): string => {
    if (!detailData) return "0/0";
    const totalPossible = getTotalQuestions() * 4;
    const actualScore = detailData.total_correct * 4;
    return `${actualScore}/${totalPossible}`;
  };

  // Hitung durasi pengerjaan
  const getDuration = (start: string, end: string): string => {
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    const durationMs = endTime - startTime;
    const minutes = Math.floor(durationMs / (1000 * 60));
    const seconds = Math.floor((durationMs % (1000 * 60)) / 1000);
    return `${minutes} menit ${seconds} detik`;
  };

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const examResponse = await axios.get(`https://api.taktix.co.id/student/exam/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const examMeta = examResponse.data;

        const attemptionResponse = await axios.get(
          `/api/exam/${id}/attemption/${attemptionId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const attemptionData = attemptionResponse.data;

        setDetailData({
          ...attemptionData,
          exam: {
            ...attemptionData.exam,
            exam_meta: {
              id: examMeta.id,
              title: examMeta.title,
              category: { name: examMeta.category.name },
              exam_category: { name: examMeta.exam_category.name },
            },
          },
        });
      } catch (error: any) {
        console.error("Failed to fetch detail data:", error);
        setError(error.message || "Gagal mengambil data detail. Menggunakan data dummy.");
        setDetailData(dummyData);
      } finally {
        setLoading(false);
      }
    };

    if (id && attemptionId) fetchDetail();
  }, [id, attemptionId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="text-2xl text-blue-600 animate-pulse">Loading...</div>
      </div>
    );
  }

  if (error || !detailData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="text-red-500 text-xl">{error || "Data tidak ditemukan"}</div>
      </div>
    );
  }

  const userAnswers = detailData.answers.reduce((acc, answer) => {
    acc[answer.question_id] = { answer: answer.answer.toUpperCase(), is_correct: answer.is_correct };
    return acc;
  }, {} as Record<number, { answer: string; is_correct: boolean }>);

  const isTopScore = detailData.total_correct / getTotalQuestions() >= 0.8;

  return (
    <div className="flex">
      <main className="flex-1 min-h-screen bg-gradient-to-br from-blue-50 to-white p-2 sm:p-4 md:p-6 lg:p-8 ml-16">
        <div className="flex items-center mb-4 sm:mb-6">
          <button
            type="button"
            className="mr-2 sm:mr-4 p-1 sm:p-2 bg-blue-100 rounded-full hover:bg-blue-200 transition"
            onClick={() => router.back()}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-blue-600 text-sm sm:text-base" />
          </button>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-800">Detail Progres Belajarmu</h1>
        </div>
        <div className="bg-white p-2 sm:p-4 rounded-lg shadow-md">
          <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faClock} className="text-blue-600 mr-2" />
              <span className="text-sm sm:text-base font-medium text-gray-700">
                Waktu: {new Date(detailData.started_at).toLocaleTimeString()} - {new Date(detailData.finished_at).toLocaleTimeString()}
              </span>
            </div>
            <div className="flex items-center">
              <FontAwesomeIcon icon={faClock} className="text-blue-600 mr-2" />
              <span className="text-sm sm:text-base font-medium text-gray-700">
                Durasi: {getDuration(detailData.started_at, detailData.finished_at)}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-sm sm:text-base font-medium text-gray-700">
                Course: {detailData.exam.exam_meta.title}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-sm sm:text-base font-medium text-gray-700">
                Kategori: {detailData.exam.exam_meta.category.name}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-sm sm:text-base font-medium text-gray-700">
                Mata Pelajaran: {detailData.exam.exam_meta.exam_category.name}
              </span>
            </div>
          </div>
          <div className="mb-4 flex justify-between items-center">
            <div className="flex space-x-4">
              <span className="text-blue-600 font-semibold">Skor: {calculateScore()}</span>
              <span className="text-green-600 font-semibold">Benar: {detailData.total_correct}</span>
              <span className="text-red-600 font-semibold">Salah: {detailData.total_incorrect}</span>
              <span className="text-yellow-600 font-semibold">Kosong: {detailData.total_empty}</span>
            </div>
            {isTopScore && (
              <div className="flex items-center text-yellow-500 animate-pulse">
                <FontAwesomeIcon icon={faStar} className="mr-1" />
                <span className="text-sm sm:text-base">Luar Biasa! Terus Semangat!</span>
              </div>
            )}
          </div>
          <div className="space-y-4">
            {detailData.exam.questions.map((question, index) => {
              const userAnswerData = userAnswers[question.id] || { answer: "Tidak dijawab", is_correct: false };
              const correctAnswer = question.answer.toUpperCase();
              const isCorrect = userAnswerData.is_correct;

              return (
                <div
                  key={question.id}
                  className="border border-gray-200 rounded-lg p-2 sm:p-4 bg-white hover:bg-gray-50 transition-all duration-200"
                >
                  <div className="flex flex-col items-center sm:flex-row sm:items-center justify-center mb-2">
                    <h3 className="text-sm sm:text-base font-medium text-gray-800 text-center sm:text-left">
                      Soal {index + 1}: {question.question}
                    </h3>
                    {question.image && (
                      <img
                        src={question.image}
                        alt={`Soal ${index + 1}`}
                        className="mt-2 sm:mt-0 mx-auto sm:mx-auto max-w-xs sm:max-w-sm md:max-w-md h-auto rounded-lg object-contain"
                      />
                    )}
                  </div>
                  <ul className="list-disc pl-2 sm:pl-5 space-y-1 text-xs sm:text-sm text-gray-700">
                    {["a", "b", "c", "d", "e"].map((opt) => (
                      <li key={opt}>
                        {opt.toUpperCase()}: {question[opt as keyof Question]}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-2 sm:mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm sm:text-base">
                    <div>
                      <span className="font-medium">Jawabanmu:</span>
                      <span className={isCorrect ? "text-green-600 ml-2" : "text-gray-600 ml-2"}>
                        {userAnswerData.answer}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Kunci Jawaban:</span>
                      <span className="font-semibold ml-2">{correctAnswer}</span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center">
                    <FontAwesomeIcon
                      icon={isCorrect ? faCheck : faTimes}
                      className={`mr-2 ${isCorrect ? "text-green-600" : "text-red-600"}`}
                    />
                    <span className={`font-medium ${isCorrect ? "text-green-600" : "text-red-600"}`}>
                      {isCorrect ? "Benar - Hebat!" : "Salah - Coba Lagi!"}
                    </span>
                    {!isCorrect && (
                      <span className="ml-2 text-sm text-gray-500">(Kunci: {correctAnswer})</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-6 text-center">
            <button
              onClick={() => router.push(`/`)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Lanjut Belajar Sekarang!
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
