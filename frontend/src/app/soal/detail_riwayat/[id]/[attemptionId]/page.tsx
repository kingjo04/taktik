"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";

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

interface AttemptionDetail {
  id: number;
  score: number;
  total_correct: number;
  total_incorrect: number;
  total_empty: number;
  answers: Answer[];
  exam: {
    questions: Question[];
  };
}

// Data Dummy kalau API gagal (sesuai total_question = 5 dari exam 72)
const dummyData: AttemptionDetail = {
  id: 0,
  score: 0,
  total_correct: 0,
  total_incorrect: 0,
  total_empty: 5,
  answers: [],
  exam: {
    questions: [
      { id: 1, question: "Soal 1", image: null, a: "A1", b: "B1", c: "C1", d: "D1", e: "E1", answer: "A" },
      { id: 2, question: "Soal 2", image: null, a: "A2", b: "B2", c: "C2", d: "D2", e: "E2", answer: "B" },
      { id: 3, question: "Soal 3", image: null, a: "A3", b: "B3", c: "C3", d: "D3", e: "E3", answer: "C" },
      { id: 4, question: "Soal 4", image: null, a: "A4", b: "B4", c: "C4", d: "D4", e: "E4", answer: "D" },
      { id: 5, question: "Soal 5", image: null, a: "A5", b: "B5", c: "C5", d: "D5", e: "E5", answer: "E" },
    ],
  },
};

export default function DetailRiwayat() {
  const { id, attemptionId } = useParams(); // String dari URL
  const [detailData, setDetailData] = useState<AttemptionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const response = await axios.get(
          `https://api.taktix.co.id/student/exam/${id}/attemption/${attemptionId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = response.data;
        console.log("API Response:", data); // Debug struktur data
        if (!data || !data.answers || !data.exam || !data.exam.questions) {
          throw new Error("Data respons API tidak lengkap atau tidak valid");
        }
        setDetailData(data);
      } catch (error: any) {
        console.error("Failed to fetch detail data:", error);
        setError(error.message || "Gagal mengambil data detail. Menggunakan data dummy.");
        setDetailData(dummyData); // Fallback ke data dummy
      } finally {
        setLoading(false);
      }
    };

    if (id && attemptionId) fetchDetail();
  }, [id, attemptionId]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error || !detailData) {
    return <div className="text-red-500 text-center mt-10">{error || "Data tidak ditemukan"}</div>;
  }

  return (
    <div className="mx-40 my-14">
      <h1 className="text-2xl font-bold mb-6">Detail Pengerjaan</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">
          Skor: {detailData.score}% | Benar: {detailData.total_correct} | Salah: {detailData.total_incorrect} | Kosong: {detailData.total_empty}
        </h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2 text-left">No. Soal</th>
              <th className="border p-2 text-left">Pertanyaan</th>
              <th className="border p-2 text-left">Opsi</th>
              <th className="border p-2 text-left">Jawaban Anda</th>
              <th className="border p-2 text-left">Kunci Jawaban</th>
              <th className="border p-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {detailData.answers.length > 0 ? (
              detailData.answers.map((answer, index) => {
                const question = detailData.exam.questions.find((q) => q.id === answer.question_id);
                if (!question) {
                  console.warn(`Question not found for answer ID ${answer.id}`);
                  return (
                    <tr key={index} className="border-t">
                      <td colSpan={6} className="border p-2 text-center text-red-500">
                        Soal tidak ditemukan
                      </td>
                    </tr>
                  );
                }
                const userAnswer = answer.answer ? answer.answer.toUpperCase() : "Tidak dijawab";
                const correctAnswer = question.answer.toUpperCase();
                const isCorrect = answer.is_correct;

                return (
                  <tr key={index} className="border-t">
                    <td className="border p-2">{question.id}</td>
                    <td className="border p-2">
                      {question.question || (question.image && `Gambar: ${question.image}`) || "Tanpa deskripsi"}
                    </td>
                    <td className="border p-2">
                      <ul className="list-disc pl-5">
                        {["a", "b", "c", "d", "e"].map((opt) => (
                          <li key={opt} className="text-gray-700">
                            {opt.toUpperCase()}: {question[opt]}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="border p-2">
                      <span className={isCorrect ? "text-green-600" : "text-red-600"}>
                        {userAnswer}
                      </span>
                    </td>
                    <td className="border p-2">
                      <span className="font-semibold">{correctAnswer}</span>
                    </td>
                    <td className="border p-2 flex items-center">
                      <FontAwesomeIcon
                        icon={isCorrect ? faCheck : faTimes}
                        className={isCorrect ? "text-green-600" : "text-red-600"}
                      />
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="border p-2 text-center text-gray-500">
                  Tidak ada jawaban yang tersedia
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}