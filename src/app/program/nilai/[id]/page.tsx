"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faTrophy, faStar, faHistory } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";

// Definisikan tipe kustom untuk JwtPayload
interface CustomJwtPayload {
  user: {
    id: number;
    name: string;
    username: string;
    email: string;
  };
  iat: number;
}

const supabaseUrl = "https://ieknphduleynhuiaqsuc.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlla25waGR1bGV5bmh1aWFxc3VjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MTY4ODAsImV4cCI6MjA2ODA5Mjg4MH0.iZBnS3uGs68CmqrhQYAJdCZZGRqlKEThrm0B0FqyPVs";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function NilaiTryout() {
  const router = useRouter();
  const { id } = useParams();
  const searchParams = useSearchParams();
  const attempt = Number(searchParams.get("attempt")) || 1;
  const [results, setResults] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [summary, setSummary] = useState({ correct: 0, wrong: 0, empty: 0, score: 0 });
  const [loading, setLoading] = useState(true);
  const [attempts, setAttempts] = useState<number[]>([]);

  useEffect(() => {
    fetchResults();
    fetchAttempts();
  }, [id, attempt]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token tidak ditemukan");

      const decodedToken = jwtDecode<CustomJwtPayload>(token);
      const userId = decodedToken.user.id;

      const { data: questionData, error: questionError } = await supabase
        .from("questions")
        .select("id, question_text, option_a, option_b, option_c, option_d, correct_answer")
        .eq("tryout_id", Number(id))
        .order("id", { ascending: true });
      if (questionError) throw questionError;
      setQuestions(questionData);

      const { data, error } = await supabase
        .from("user_tryout_results")
        .select("question_id, user_answer, correct_answer")
        .eq("user_id", userId)
        .eq("tryout_id", Number(id))
        .eq("attempt_number", attempt);
      if (error) throw error;

      setResults(data || []);

      let correct = 0, wrong = 0, empty = 0;
      questionData.forEach((q) => {
        const result = data.find((r) => r.question_id === q.id);
        if (result) {
          if (result.user_answer === result.correct_answer) correct++;
          else if (result.user_answer) wrong++;
        } else {
          empty++;
        }
      });
      const score = (correct * 4) + (wrong * -1);
      setSummary({ correct, wrong, empty, score });
    } catch (err) {
      console.error("Error fetching results:", err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal memuat nilai!",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAttempts = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token tidak ditemukan");

      const decodedToken = jwtDecode<CustomJwtPayload>(token);
      const userId = decodedToken.user.id;

      const { data, error } = await supabase
        .from("user_tryout_results")
        .select("attempt_number")
        .eq("user_id", userId)
        .eq("tryout_id", Number(id))
        .groupBy("attempt_number");
      if (error) throw error;

      const attemptNumbers = data.map((item) => item.attempt_number).sort((a, b) => a - b);
      setAttempts(attemptNumbers);
    } catch (err) {
      console.error("Error fetching attempts:", err);
    }
  };

  const handleChangeAttempt = (newAttempt: number) => {
    router.push(`/program/nilai/${id}?attempt=${newAttempt}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
        <span className="text-2xl text-indigo-600 animate-pulse">Memuat Nilai...</span>
      </div>
    );
  }

  const totalPossibleScore = questions.length * 4;
  const percentage = ((summary.score / totalPossibleScore) * 100).toFixed(2);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-4 sm:p-6">
      <main className="flex-1 mx-auto max-w-4xl">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 bg-white p-4 rounded-xl shadow-md animate-fade-in">
          <button
            onClick={() => router.back()}
            className="p-3 bg-indigo-100 rounded-full hover:bg-indigo-200 transition-all duration-300 hover:scale-110 transform"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="w-6 h-6 text-indigo-700" />
          </button>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-indigo-900 text-center sm:text-left flex-1">
            Hasil Tryout - Attempt {attempt} <FontAwesomeIcon icon={faStar} className="text-yellow-400 ml-2 animate-pulse" />
          </h1>
          <button
            onClick={() => {
              Swal.fire({
                title: "Pilih Attempt",
                input: "select",
                inputOptions: Object.fromEntries(attempts.map((a) => [a, `Attempt ${a}`])),
                inputValue: attempt,
                showCancelButton: true,
                confirmButtonText: "Lihat",
                confirmButtonColor: "#16A34A",
                cancelButtonText: "Batal",
                customClass: {
                  popup: "animate__animated animate__fadeIn",
                },
              }).then((result) => {
                if (result.isConfirmed && result.value) {
                  handleChangeAttempt(Number(result.value));
                }
              });
            }}
            className="p-3 bg-indigo-100 rounded-full hover:bg-indigo-200 transition-all duration-300 hover:scale-110 transform"
          >
            <FontAwesomeIcon icon={faHistory} className="w-6 h-6 text-indigo-700" />
          </button>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg mb-8 transform hover:scale-105 transition-all duration-300">
          <FontAwesomeIcon icon={faTrophy} className="text-6xl text-yellow-500 mb-6 animate-bounce" />
          <h2 className="text-4xl sm:text-5xl font-extrabold text-indigo-900 mb-4">Skor Kamu</h2>
          <p className="text-6xl sm:text-7xl font-extrabold text-green-600 mb-6 animate-pulse">{summary.score} / {totalPossibleScore}</p>
          <div className="w-full bg-gray-200 rounded-full h-6 mb-6">
            <div className="bg-gradient-to-r from-green-400 to-blue-500 h-6 rounded-full" style={{ width: `${percentage}%` }}></div>
          </div>
          <p className="text-xl sm:text-2xl text-gray-700 font-semibold">Progres: {percentage}%</p>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-4 bg-green-50 rounded-lg text-center shadow-md">
              <p className="text-lg font-medium text-green-800">Benar</p>
              <p className="text-2xl font-bold text-green-700">{summary.correct} x 4 = {summary.correct * 4}</p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg text-center shadow-md">
              <p className="text-lg font-medium text-red-800">Salah</p>
              <p className="text-2xl font-bold text-red-700">{summary.wrong} x -1 = {summary.wrong * -1}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg text-center shadow-md">
              <p className="text-lg font-medium text-gray-800">Kosong</p>
              <p className="text-2xl font-bold text-gray-700">{summary.empty} x 0 = 0</p>
            </div>
          </div>
          <p className="text-xl sm:text-2xl text-indigo-800 mt-6 font-medium animate-fade-in">
            Keren! Terus semangat, kamu bisa naik level di tryout berikutnya!
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl sm:text-3xl font-bold text-indigo-900 mb-6">Detail Jawaban</h2>
          <div className="space-y-4">
            {questions.map((q, index) => {
              const result = results.find((r) => r.question_id === q.id);
              const userAnswer = result?.user_answer || "-";
              const isCorrect = userAnswer === q.correct_answer;
              return (
                <div key={q.id} className="p-4 bg-gray-50 rounded-lg border-l-4 border-indigo-500 hover:bg-indigo-50 transition-all duration-200">
                  <p className="text-md font-medium text-indigo-800">Soal {index + 1}: {q.question_text}</p>
                  <p>Jawaban Anda: <span className={isCorrect ? "text-green-600 font-bold" : "text-red-600 font-bold"}>{userAnswer}</span></p>
                  <p>Jawaban Benar: <span className="text-blue-600 font-medium">{q.correct_answer}</span></p>
                  <p className="text-sm text-gray-600">
                    Opsi: A) {q.option_a}, B) {q.option_b}, C) {q.option_c}, D) {q.option_d}
                  </p>
                  <p className="text-sm text-gray-600">
                    Status: {isCorrect ? "Benar" : userAnswer === "-" ? "Kosong" : "Salah"}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => router.push(`/program/kerjakan_tryout/${id}`)}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 text-xl shadow-md hover:shadow-lg transform hover:-translate-y-1"
          >
            Coba Lagi Sekarang!
          </button>
        </div>

        <div className="mt-6 bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-4 sm:p-6 rounded-xl text-center animate-pulse">
          <h2 className="text-2xl sm:text-3xl font-bold">Jangan Menyerah!</h2>
          <p className="text-lg sm:text-xl mt-2">Setiap tryout adalah langkah menuju kesuksesanmu. Ayo lanjutkan perjuanganmu!</p>
        </div>
      </main>
    </div>
  );
}