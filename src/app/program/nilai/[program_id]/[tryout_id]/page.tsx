"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { jwtDecode } from "jwt-decode";

interface UserAnswer {
  id: string;
  user_id: string;
  tryout_id: string;
  question_id: string;
  chosen_answer: string;
  is_correct: boolean;
  score: number;
  submitted_at: string;
  attempt_id: string;
}

interface Question {
  id: string;
  question: string;
  options: { id: number; label: string; content: string }[];
  correct_answer: string;
}

const supabaseUrl = "https://ieknphduleynhuiaqsuc.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlla25waGR1bGV5bmh1aWFxc3VjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MTY4ODAsImV4cCI6MjA2ODA5Mjg4MH0.iZBnS3uGs68CmqrhQYAJdCZZGRqlKEThrm0B0FqyPVs";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function DetailTryout() {
  const { program_id, tryout_id } = useParams(); // Destructure program_id dan tryout_id
  const router = useRouter();
  const searchParams = useSearchParams();
  const attemptId = searchParams.get("attempt");
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalScore, setTotalScore] = useState(0);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token || !tryout_id || !attemptId) {
          router.push("/login");
          return;
        }

        const decoded: any = jwtDecode(token);
        const userId = decoded.user?.id; // Ambil user_id dari token
        if (!userId) {
          throw new Error("User ID tidak ditemukan di token.");
        }

        console.log("Fetching user answers for tryout_id:", tryout_id, "attempt_id:", attemptId);
        const { data: answerData, error: answerError } = await supabase
          .from("user_answers")
          .select("*")
          .eq("tryout_id", tryout_id)
          .eq("user_id", userId)
          .eq("attempt_id", attemptId)
          .order("submitted_at", { ascending: false });
        if (answerError) throw answerError;
        setUserAnswers(answerData || []);

        console.log("Fetching questions for tryout_id:", tryout_id);
        const { data: questionData, error: questionError } = await supabase
          .from("questions")
          .select("*")
          .eq("tryout_id", tryout_id);
        if (questionError) throw questionError;
        setQuestions(questionData as Question[]);

        const total = answerData?.reduce((sum, answer) => sum + answer.score, 0) || 0;
        setTotalScore(total);
      } catch (err) {
        setError("Gagal memuat hasil: " + (err as Error).message);
        console.error("Error fetching results:", err);
      } finally {
        setLoading(false);
      }
    };

    if (attemptId) fetchResults();
  }, [tryout_id, attemptId, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50">
        <div className="text-2xl text-indigo-600 animate-pulse">Memuat Hasil...</div>
      </div>
    );
  }

  if (error || !userAnswers.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 p-4 sm:p-6 ml-[64px]">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error || "Hasil tidak ditemukan"}</p>
          <button
            onClick={() => router.push(`/program/detail_tryout/${program_id}/${tryout_id}`)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300"
          >
            Kembali ke Detail
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 p-4 sm:p-6 ml-[64px]">
      <div className="flex items-center mb-6">
        <button
          type="button"
          className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-all duration-300"
          onClick={() => router.back()}
        >
          <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5 text-indigo-600" />
        </button>
        <h1 className="ml-4 text-2xl sm:text-3xl font-bold text-indigo-800">Hasil Tryout</h1>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 rounded-xl p-6 text-white shadow-lg mb-6">
          <h2 className="text-2xl font-semibold">Skor Anda</h2>
          <p className="text-4xl font-bold mt-2">{totalScore}</p>
          <p className="text-lg mt-1">Dari total {questions.length * 10} poin</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Detail Jawaban</h3>
          {questions.map((q, index) => {
            const userAnswer = userAnswers.find((a) => a.question_id === q.id);
            const isCorrect = userAnswer?.is_correct || false;
            return (
              <div key={q.id} className="mb-4 p-4 border rounded-lg">
                <p className="text-lg text-gray-700 mb-2">
                  {index + 1}. {q.question}
                </p>
                <p className="text-md text-gray-600 mb-2">
                  Jawaban Anda: <span className={isCorrect ? "text-green-600" : "text-red-600"}>{userAnswer?.chosen_answer || "Tidak dijawab"}</span>
                </p>
                <p className="text-md text-gray-600">
                  Kunci Jawaban: <span className="font-bold">{q.correct_answer}</span>
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}