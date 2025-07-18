"use client";

import React, { useState, useEffect, useContext } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faTrophy, faLock, faPlay } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

const UserContext = React.createContext<{ id: string | null }>({ id: null });

// Inisialisasi Supabase
const supabaseUrl = "https://ieknphduleynhuiaqsuc.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlla25waGR1bGV5bmh1aWFxc3VjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MTY4ODAsImV4cCI6MjA2ODA5Mjg4MH0.iZBnS3uGs68CmqrhQYAJdCZZGRqlKEThrm0B0FqyPVs";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function NilaiTryout() {
  const router = useRouter();
  const { id } = useParams();
  const user = useContext(UserContext); // Ambil user_id dari context
  const [tryout, setTryout] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [score, setScore] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [showAnswers, setShowAnswers] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const tryoutId = Number(id);
      if (isNaN(tryoutId)) throw new Error("ID tryout tidak valid");

      // Fetch tryout details
      const { data: tryoutData, error: tryoutError } = await supabase
        .from("tryouts")
        .select("id, name, total_questions, exam_category")
        .eq("id", tryoutId)
        .single();
      if (tryoutError) throw tryoutError;
      setTryout(tryoutData);

      // Fetch questions
      const { data: questionData, error: questionError } = await supabase
        .from("questions")
        .select("id, question_text, option_a, option_b, option_c, option_d, correct_answer")
        .eq("tryout_id", tryoutId)
        .order("id", { ascending: true });
      if (questionError) throw questionError;
      setQuestions(questionData);

      // Fetch user answers
      if (!user.id) {
        throw new Error("User ID tidak ditemukan!");
      }
      const { data: resultData, error: resultError } = await supabase
        .from("user_tryout_results")
        .select("question_id, user_answer, correct_answer")
        .eq("tryout_id", tryoutId)
        .eq("user_id", user.id);
      if (resultError) throw resultError;
      setResults(resultData);

      // Hitung skor
      let correctCount = 0;
      resultData.forEach((r) => {
        if (r.user_answer === r.correct_answer) correctCount++;
      });
      setScore(correctCount);
    } catch (err) {
      console.error("Error fetching data:", err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal memuat nilai!",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push(`/program/kerjakan_tryout/${id}`);
  };

  const handleShowAnswers = () => {
    setShowAnswers(true);
    Swal.fire({
      icon: "info",
      title: "Kunci Jawaban",
      text: "Lihat jawaban benar untuk setiap soal di bawah!",
      confirmButtonText: "OK",
      confirmButtonColor: "#16A34A",
    });
  };

  const handleTryAgain = () => {
    router.push(`/program/kerjakan_tryout/${id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <span className="text-2xl text-blue-600 animate-pulse">Memuat Nilai...</span>
      </div>
    );
  }

  if (!tryout || questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <span className="text-xl text-red-600">Data tryout tidak ditemukan</span>
      </div>
    );
  }

  const percentage = ((score / tryout.total_questions) * 100).toFixed(2);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-white p-2 sm:p-4 md:p-6">
      <main className="flex-1 mx-auto max-w-4xl w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4 sm:mb-6">
          <button
            onClick={handleBack}
            className="p-2 sm:p-3 bg-blue-100 rounded-full hover:bg-blue-200 transition-transform transform hover:scale-110 mb-2 sm:mb-0"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="w-5 sm:w-6 h-5 sm:h-6 text-blue-700" />
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-900 text-center sm:text-left flex-1 animate-pulse">
            Nilai Tryout - {tryout.name}
          </h1>
        </div>

        {/* Score Card */}
        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-lg mb-4 sm:mb-6 text-center">
          <FontAwesomeIcon icon={faTrophy} className="text-5xl text-yellow-500 mb-4" />
          <h2 className="text-3xl sm:text-4xl font-bold text-blue-900 mb-2">Skor Kamu</h2>
          <p className="text-5xl sm:text-6xl font-extrabold text-green-600 mb-4">{score} / {tryout.total_questions}</p>
          <p className="text-xl sm:text-2xl text-gray-700">({percentage}%)</p>
          <p className="text-lg sm:text-xl text-blue-800 mt-4">
            Selamat! Kamu udah selesai tryout {tryout.exam_category}. Lanjutkan belajar untuk hasil yang lebih baik!
          </p>
        </div>

        {/* Answer Breakdown */}
        {showAnswers && (
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg mb-4 sm:mb-6">
            <h3 className="text-2xl font-bold text-blue-900 mb-4">Detail Jawaban</h3>
            {questions.map((q, index) => {
              const result = results.find(r => r.question_id === q.id);
              const userAnswer = result?.user_answer || "-";
              const isCorrect = userAnswer === q.correct_answer;
              return (
                <div key={q.id} className="mb-4 p-3 border rounded-lg bg-gray-50">
                  <p className="font-medium text-blue-800">{index + 1}. {q.question_text}</p>
                  <p className="ml-4">Jawabanmu: <span className={isCorrect ? "text-green-600" : "text-red-600"}>{userAnswer}</span></p>
                  <p className="ml-4">Jawaban Benar: <span className="text-blue-600">{q.correct_answer}</span></p>
                  <p className="ml-4 text-sm text-gray-600">Opsi: A) {q.option_a}, B) {q.option_b}, C) {q.option_c}, D) {q.option_d}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
          <button
            onClick={handleShowAnswers}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all text-lg sm:text-xl flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faLock} /> Kunci Jawaban
          </button>
          <button
            onClick={handleTryAgain}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all text-lg sm:text-xl flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faPlay} /> Kerjakan Lagi
          </button>
        </div>

        {/* Back Button */}
        <div className="text-center">
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-lg sm:text-xl"
          >
            Kembali ke Tryout
          </button>
        </div>
      </main>
    </div>
  );
}