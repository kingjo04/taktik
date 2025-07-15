"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter, useParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { jwtDecode } from "jwt-decode";

interface Answer {
  id: number;
  attempt_id: string;
  question_id: string;
  user_id: number;
  answer: string;
  is_correct: boolean;
  created_at: string;
  updated_at: string;
}

interface Question {
  id: string;
  tryout_id: string;
  question: string;
  image?: string;
  answer: string;
  a?: string;
  b?: string;
  c?: string;
  d?: string;
  e?: string;
}

const supabaseUrl = "https://ieknphduleynhuiaqsuc.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlla25waGR1bGV5bmh1aWFxc3VjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MTY4ODAsImV4cCI6MjA2ODA5Mjg4MH0.iZBnS3uGs68CmqrhQYAJdCZZGRqlKEThrm0B0FqyPVs";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function KunciJawaban() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { program_id, tryout_id } = useParams();
  const router = useRouter();

  useEffect(() => {
    const fetchKunciJawaban = async () => {
      const token = localStorage.getItem("token");
      console.log("Token:", token);
      console.log("tryout_id:", tryout_id);

      if (!token) {
        setError("Token tidak ditemukan. Silakan login terlebih dahulu.");
        router.push("/login");
        return;
      }

      if (!tryout_id) {
        setError("ID Tryout tidak valid.");
        return;
      }

      try {
        setLoading(true);
        const decoded: any = jwtDecode(token);
        const userId = decoded.user?.id; // 4269

        // Cek apakah user sudah selesaikan soal berdasarkan user_id dan question_id
        const { data: questionData, error: questionError } = await supabase
          .from("questions")
          .select("id")
          .eq("tryout_id", tryout_id);

        if (questionError || !questionData) {
          throw new Error("Tidak ada soal tersedia untuk tryout ini.");
        }

        const questionIds = questionData.map((q) => q.id);
        const { data: answerCheck, error: checkError } = await supabase
          .from("user_answers")
          .select("id, question_id")
          .eq("user_id", userId)
          .in("question_id", questionIds);

        if (checkError || !answerCheck || answerCheck.length === 0) {
          throw new Error("Anda belum menyelesaikan ujian ini.");
        }

        // Ambil semua questions untuk tryout_id
        const { data: fullQuestionData, error: fullQuestionError } = await supabase
          .from("questions")
          .select("*")
          .eq("tryout_id", tryout_id);

        if (fullQuestionError || !fullQuestionData) {
          throw new Error("Tidak ada soal tersedia untuk tryout ini.");
        }

        setQuestions(fullQuestionData as Question[]);

        // Ambil semua jawaban user berdasarkan user_id
        const { data: userAnswerData, error: userAnswerError } = await supabase
          .from("user_answers")
          .select("*")
          .eq("user_id", userId)
          .in("question_id", questionIds);

        if (userAnswerError) throw userAnswerError;
        setUserAnswers(userAnswerData as Answer[]);
      } catch (err) {
        console.error("Error fetching kunci jawaban:", err);
        setError(err.message || "Gagal mengambil kunci jawaban.");
      } finally {
        setLoading(false);
      }
    };

    fetchKunciJawaban();
  }, [tryout_id, router]);

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
        {!token && (
          <button
            onClick={() => router.push("/login")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Login Sekarang
          </button>
        )}
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="text-gray-600 text-xl">
          Tidak ada kunci jawaban tersedia untuk tryout ini.
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
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-800">Kunci Jawaban Tryout</h1>
          </div>
        </div>

        <div className="my-4 sm:my-8">
          <div className="space-y-6">
            {questions.map((question, index) => {
              const userAnswer = userAnswers.find((a) => a.question_id === question.id);
              return (
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
                  <div className="mt-4 text-sm sm:text-base font-semibold">
                    <span className="text-green-600">Jawaban Benar: {question.answer || "Tidak tersedia"}</span>
                    <span className="ml-4 text-gray-600">Jawaban Anda: {userAnswer?.answer || "Tidak dijawab"}</span>
                    {userAnswer && (
                      <span className={`ml-4 ${userAnswer.is_correct ? "text-green-600" : "text-red-600"}`}>
                        {userAnswer.is_correct ? "Benar" : "Salah"}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-6 text-center">
            <button
              onClick={() => router.push(`/program/detail_tryout/${program_id}/${tryout_id}`)}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition"
            >
              Kembali ke Detail Tryout
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}