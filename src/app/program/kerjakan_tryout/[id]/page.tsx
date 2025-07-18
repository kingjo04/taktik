"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";

// Definisikan tipe kustom untuk JwtPayload
interface CustomJwtPayload {
  sub: string;
  user?: {
    id?: number;
  };
}

const supabaseUrl = "https://ieknphduleynhuiaqsuc.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlla25waGR1bGV5bmh1aWFxc3VjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MTY4ODAsImV4cCI6MjA2ODA5Mjg4MH0.iZBnS3uGs68CmqrhQYAJdCZZGRqlKEThrm0B0FqyPVs";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function KerjakanTryout() {
  const router = useRouter();
  const { id } = useParams();
  const [tryout, setTryout] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<string[]>(new Array(10).fill("")); // Array jawaban
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTryoutDetail();
  }, [id]);

  const fetchTryoutDetail = async () => {
    setLoading(true);
    try {
      const tryoutId = Number(id);
      if (isNaN(tryoutId)) throw new Error("ID tryout tidak valid");

      const { data: tryoutData, error: tryoutError } = await supabase
        .from("tryouts")
        .select("id, name, total_questions, duration_minutes, exam_category")
        .eq("id", tryoutId)
        .single();
      if (tryoutError) throw tryoutError;
      setTryout(tryoutData);

      const durationInSeconds = tryoutData.duration_minutes * 60;
      setTimeLeft(durationInSeconds);

      const { data: questionData, error: questionError } = await supabase
        .from("questions")
        .select("id, question_text, option_a, option_b, option_c, option_d, correct_answer")
        .eq("tryout_id", tryoutId)
        .order("id", { ascending: true });
      if (questionError) throw questionError;
      setQuestions(questionData);
      setAnswers(new Array(questionData.length).fill("")); // Sesuaikan panjang array jawaban
    } catch (err) {
      console.error("Error fetching tryout or questions:", err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal memuat tryout atau soal!",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (timeLeft > 0 && !loading) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, loading]);

  const handleAnswerSelect = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };

  const handleGoToQuestion = (index: number) => {
    setCurrentQuestion(index);
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        Swal.fire({
          icon: "warning",
          title: "Silakan Login!",
          text: "Kamu perlu login untuk menyimpan hasil.",
          confirmButtonText: "OK",
          confirmButtonColor: "#16A34A",
        }).then(() => {
          router.push("/login");
        });
        return;
      }

      const decodedToken = jwtDecode<CustomJwtPayload>(token);
      const userId = Number(decodedToken.sub) || Number(decodedToken.user?.id);
      if (!userId) throw new Error("User ID tidak ditemukan dari token");

      const tryoutId = Number(id);
      const validAnswers = answers.map((answer, index) => ({
        user_answer: answer || null,
        question_id: questions[index].id,
        correct_answer: questions[index].correct_answer,
      }));

      const promises = validAnswers.map((data) =>
        supabase.from("user_tryout_results").insert({
          user_id: userId,
          tryout_id: tryoutId,
          question_id: data.question_id,
          user_answer: data.user_answer,
          correct_answer: data.correct_answer,
        })
      );

      await Promise.all(promises);
      console.log("Jawaban disimpan:", answers);

      Swal.fire({
        icon: "success",
        title: "Selesai!",
        text: "Kamu telah menyelesaikan tryout. Lihat nilai sekarang!",
        confirmButtonText: "OK",
        confirmButtonColor: "#16A34A",
      }).then(() => {
        router.push(`/program/nilai/${id}`);
      });
    } catch (err) {
      console.error("Error submitting answers:", err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal menyimpan jawaban! Periksa console untuk detail.",
      });
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <span className="text-2xl text-blue-600 animate-pulse">Memuat Tryout...</span>
      </div>
    );
  }

  if (!tryout || questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <span className="text-xl text-red-600">Tryout atau soal tidak ditemukan</span>
      </div>
    );
  }

  const currentQuestionData = questions[currentQuestion];
  const selectedAnswer = answers[currentQuestion];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-white p-2 sm:p-4 md:p-6">
      <main className="flex-1 mx-auto max-w-4xl w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4 sm:mb-6">
          <button
            onClick={() => router.back()}
            className="p-2 sm:p-3 bg-blue-100 rounded-full hover:bg-blue-200 transition-transform transform hover:scale-110 mb-2 sm:mb-0"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="w-5 sm:w-6 h-5 sm:h-6 text-blue-700" />
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-900 text-center sm:text-left flex-1 animate-pulse">
            {tryout.name} - {tryout.exam_category}
          </h1>
          <div className="text-lg sm:text-xl font-semibold text-blue-800">
            Waktu: {formatTime(timeLeft)}
          </div>
        </div>

        {/* Motivation Banner */}
        <div className="bg-blue-700 text-white p-3 sm:p-4 rounded-xl mb-4 sm:mb-6 text-center animate-fade-in">
          <h2 className="text-xl sm:text-2xl font-bold">Ayo Semangat, Kamu Bisa!</h2>
          <p className="text-base sm:text-lg mt-1 sm:mt-2">Setiap soal adalah langkah menuju kesuksesanmu!</p>
        </div>

        {/* Question Card */}
        <div className="bg-white p-3 sm:p-4 md:p-6 rounded-xl shadow-lg mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-2 sm:mb-4">
            <span className="text-base sm:text-lg text-blue-700 font-medium mb-1 sm:mb-0">
              Soal {currentQuestion + 1} dari {tryout.total_questions}
            </span>
            <span className="text-sm sm:text-base text-gray-500">
              Sisa: {Math.floor((currentQuestion + 1) / tryout.total_questions * 100)}%
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-blue-900 mb-2 sm:mb-4">
            {currentQuestionData.question_text}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            {["option_a", "option_b", "option_c", "option_d"].map((optionKey) => (
              <button
                key={optionKey}
                onClick={() => handleAnswerSelect(currentQuestionData[optionKey])}
                className={`p-2 sm:p-3 rounded-lg border-2 transition-all duration-300 ${
                  selectedAnswer === currentQuestionData[optionKey]
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-gray-100 border-gray-300 hover:bg-blue-100"
                } text-sm sm:text-base`}
              >
                {currentQuestionData[optionKey]}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation and Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 mb-4 sm:mb-6">
          <button
            onClick={() => router.back()}
            className="px-3 sm:px-4 py-2 sm:py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-sm sm:text-base"
          >
            Kembali
          </button>
          <div className="flex flex-wrap gap-2 justify-center flex-1">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => handleGoToQuestion(index)}
                className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  index === currentQuestion
                    ? "bg-blue-600 text-white"
                    : answers[index]
                    ? "bg-green-500 text-white"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <button
            onClick={handleNext}
            className="px-3 sm:px-4 py-2 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
          >
            {currentQuestion < questions.length - 1 ? "Lanjut" : "Selesai"}
            <FontAwesomeIcon icon={faCheckCircle} className="w-4 sm:w-5 h-4 sm:h-5" />
          </button>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            onClick={handleSubmit}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all font-semibold text-sm sm:text-base"
          >
            Submit Sekarang
          </button>
        </div>
      </main>
    </div>
  );
}