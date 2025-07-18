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
  user: {
    id: number;
    name: string;
    username: string;
    email: string;
  };
  iat: number;
}

interface Tryout {
  id: number;
  name: string;
  total_questions?: number;
  duration_minutes?: number;
  exam_category?: string;
}

interface Question {
  id: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
}

const supabaseUrl = "https://ieknphduleynhuiaqsuc.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlla25waGR1bGV5bmh1aWFxc3VjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MTY4ODAsImV4cCI6MjA2ODA5Mjg4MH0.iZBnS3uGs68CmqrhQYAJdCZZGRqlKEThrm0B0FqyPVs";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function KerjakanTryout() {
  const router = useRouter();
  const { id } = useParams();
  const [tryout, setTryout] = useState<Tryout | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({}); // Gunakan objek untuk melacak jawaban per soal
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

      const durationInSeconds = (tryoutData.duration_minutes || 0) * 60;
      setTimeLeft(durationInSeconds);

      const { data: questionData, error: questionError } = await supabase
        .from("questions")
        .select("id, question_text, option_a, option_b, option_c, option_d, correct_answer")
        .eq("tryout_id", tryoutId)
        .order("id", { ascending: true });
      if (questionError) throw questionError;
      setQuestions(questionData);
    } catch (err) {
      console.error("Error fetching tryout or questions:", err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal memuat tryout atau soal!",
        confirmButtonColor: "#4B5EFC",
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

  const handleAnswerSelect = (questionId: number, answer: string) => {
    setAnswers((prev) => {
      const currentAnswer = prev[questionId];
      if (currentAnswer === answer) {
        // Jika diklik ulang, hapus jawaban
        const newAnswers = { ...prev };
        delete newAnswers[questionId];
        return newAnswers;
      }
      return {
        ...prev,
        [questionId]: answer,
      };
    });
  };

  const handleNext = () => {
    if (currentQuestion < (questions.length - 1)) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };

  const handleGoToQuestion = (index: number) => {
    setCurrentQuestion(index);
  };

  const handleSubmit = async () => {
    const currentAnswersCount = Object.keys(answers).length;
    if (currentAnswersCount === 0) {
      Swal.fire({
        icon: "warning",
        title: "Belum Ada Jawaban!",
        text: "Silakan pilih setidaknya satu jawaban sebelum submit.",
        confirmButtonColor: "#F59E0B",
      });
      return;
    }

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
      const userId = decodedToken.user.id;
      console.log("Decoded Token in Submit:", decodedToken);
      if (!userId || isNaN(userId)) throw new Error("User ID tidak ditemukan atau tidak valid dari token");

      const tryoutId = Number(id);

      const { data: attemptData } = await supabase
        .from("user_tryout_results")
        .select("attempt_number")
        .eq("user_id", userId)
        .eq("tryout_id", tryoutId)
        .order("attempt_number", { ascending: false })
        .limit(1);
      const nextAttempt = attemptData.length > 0 ? attemptData[0].attempt_number + 1 : 1;

      const validAnswers = questions.map((q) => ({
        user_id: userId,
        tryout_id: tryoutId,
        question_id: q.id,
        user_answer: answers[q.id] || null,
        correct_answer: q.correct_answer,
        attempt_number: nextAttempt,
      }));

      const promises = validAnswers.map((data) =>
        supabase.from("user_tryout_results").insert({
          user_id: data.user_id,
          tryout_id: data.tryout_id,
          question_id: data.question_id,
          user_answer: data.user_answer,
          correct_answer: data.correct_answer,
          attempt_number: data.attempt_number,
        })
      );
      await Promise.all(promises);
      console.log("Jawaban disimpan untuk attempt", nextAttempt, ":", validAnswers);

      let correct = 0, wrong = 0, empty = 0;
      questions.forEach((q) => {
        const userAnswer = answers[q.id];
        if (userAnswer === q.correct_answer) correct++;
        else if (userAnswer) wrong++;
        else empty++;
      });
      const score = (correct * 4) + (wrong * -1);

      Swal.fire({
        icon: "success",
        title: "Selesai!",
        html: `Kamu telah menyelesaikan tryout (${nextAttempt}).<br>
               Skor sementara: ${score} / ${questions.length * 4}<br>
               Benar: ${correct}, Salah: ${wrong}, Kosong: ${empty}`,
        confirmButtonText: "OK",
        confirmButtonColor: "#16A34A",
      }).then(() => {
        router.push(`/program/nilai/${id}?attempt=${nextAttempt}`);
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-purple-100 to-indigo-100">
        <div className="flex items-center gap-3 text-indigo-700 animate-pulse">
          <div className="w-10 h-10 border-4 border-t-indigo-700 border-b-transparent rounded-full animate-spin"></div>
          <span className="text-2xl font-semibold">Memuat Tryout...</span>
        </div>
      </div>
    );
  }

  if (!tryout || questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-purple-100 to-indigo-100">
        <div className="text-center">
          <span className="text-xl text-red-600 font-semibold">Tryout atau soal tidak ditemukan</span>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300 transform hover:scale-105"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  const currentQuestionData = questions[currentQuestion];
  const selectedAnswer = answers[currentQuestionData.id];
  const progress = (Object.keys(answers).length / (tryout.total_questions || 1)) * 100;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-purple-100 to-indigo-100 p-2 sm:p-4 md:p-6 lg:p-8 ml-16 lg:ml-64">
      <main className="flex-1 mx-auto max-w-4xl w-full bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-lg"> {/* Latar belakang putih penuh */}
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4 sm:mb-6 animate-fadeIn">
          <button
            onClick={() => router.back()}
            className="p-2 sm:p-3 bg-white rounded-full shadow-md hover:bg-blue-50 hover:shadow-lg transition-all duration-300 transform hover:scale-110 mb-2 sm:mb-0"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="w-5 sm:w-6 h-5 sm:h-6 text-blue-700" />
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-900 text-center sm:text-left flex-1 animate-bounceIn">
            {tryout.name} - {tryout.exam_category}
          </h1>
          <div className="text-lg sm:text-xl font-semibold text-blue-800 animate-slideIn">
            Waktu: {formatTime(timeLeft)}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-4 mb-6 animate-fadeInUp">
          <div
            className="bg-green-500 h-4 rounded-full transition-all duration-500 ease-in-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Motivation Banner */}
        <div className="bg-blue-700 text-white p-3 sm:p-4 rounded-xl mb-4 sm:mb-6 text-center animate-fadeInUp">
          <h2 className="text-xl sm:text-2xl font-bold">Ayo Semangat, Kamu Bisa!</h2>
          <p className="text-base sm:text-lg mt-1 sm:mt-2">Setiap soal adalah langkah menuju kesuksesanmu!</p>
        </div>

        {/* Question Card */}
        <div className="bg-white p-3 sm:p-4 md:p-6 rounded-xl shadow-lg mb-4 sm:mb-6 animate-fadeInUp delay-100">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-2 sm:mb-4">
            <span className="text-base sm:text-lg text-blue-700 font-medium mb-1 sm:mb-0">
              Soal {currentQuestion + 1} dari {tryout.total_questions}
            </span>
            <span className="text-sm sm:text-base text-gray-500">
              Progress: {progress.toFixed(0)}%
            </span>
          </div>
          <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-blue-900 mb-2 sm:mb-4">
            {currentQuestionData.question_text}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            {["A", "B", "C", "D"].map((option) => {
              const optionText = currentQuestionData[`option_${option.toLowerCase()}`];
              return (
                <button
                  key={option}
                  onClick={() => handleAnswerSelect(currentQuestionData.id, selectedAnswer === option ? "" : option)}
                  className={`p-2 sm:p-3 md:p-4 rounded-lg border-2 transition-all duration-300 flex items-center ${
                    selectedAnswer === option ? "bg-blue-600 text-white border-blue-600" : "bg-gray-100 border-gray-300 hover:bg-blue-100"
                  } text-sm sm:text-base md:text-lg`}
                >
                  <span className="mr-2 text-lg sm:text-xl md:text-2xl font-bold">{option})</span> {optionText}
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation and Question List */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 mb-4 sm:mb-6 animate-fadeInUp delay-200">
          <button
            onClick={() => router.back()}
            className="px-3 sm:px-4 py-2 sm:py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-sm sm:text-base md:text-lg"
          >
            Kembali
          </button>
          <div className="flex flex-wrap gap-2 justify-center flex-1">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => handleGoToQuestion(index)}
                className={`w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full text-xs sm:text-sm md:text-base font-medium transition-all ${
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
            className="px-3 sm:px-4 py-2 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all flex items-center gap-1 sm:gap-2 text-sm sm:text-base md:text-lg"
          >
            {currentQuestion < questions.length - 1 ? "Lanjut" : "Selesai"}
            <FontAwesomeIcon icon={faCheckCircle} className="w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6" />
          </button>
        </div>

        {/* Submit Button */}
        <div className="text-center animate-fadeInUp delay-300">
          <button
            onClick={handleSubmit}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all font-semibold text-sm sm:text-base md:text-lg"
          >
            Submit Sekarang
          </button>
        </div>
      </main>
    </div>
  );
}

// CSS Animations
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes bounceIn {
    0% { transform: scale(0.9); opacity: 0; }
    50% { transform: scale(1.05); opacity: 1; }
    100% { transform: scale(1); }
  }
  @keyframes slideIn {
    from { transform: translateX(-20px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  .animate-fadeIn { animation: fadeIn 0.5s ease-in-out; }
  .animate-fadeInUp { animation: fadeInUp 0.5s ease-in-out; }
  .animate-bounceIn { animation: bounceIn 0.8s ease-in-out; }
  .animate-slideIn { animation: slideIn 0.5s ease-in-out; }
`;

const styleSheet = new CSSStyleSheet();
styleSheet.replaceSync(styles);
document.adoptedStyleSheets = [styleSheet];