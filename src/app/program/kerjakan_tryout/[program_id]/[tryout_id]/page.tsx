"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter, useParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faRotateRight } from "@fortawesome/free-solid-svg-icons";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import { v4 as uuidv4 } from "uuid";

interface Question {
  id: string;
  tryout_id: string;
  question: string;
  options: { id: number; label: string; content: string }[];
  correct_answer: string;
}

interface Tryout {
  id: string;
  title: string;
  duration: number;
  total_question: number;
}

const supabaseUrl = "https://ieknphduleynhuiaqsuc.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlla25waGR1bGV5bmh1aWFxc3VjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MTY4ODAsImV4cCI6MjA2ODA5Mjg4MH0.iZBnS3uGs68CmqrhQYAJdCZZGRqlKEThrm0B0FqyPVs";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function KerjakanSoal() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [dataSoal, setDataSoal] = useState<Tryout | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const { program_id, tryout_id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExamDetail = async (token: string) => {
    setLoading(true);
    setError(null);
    try {
      if (!token || !tryout_id) {
        throw new Error("Token atau ID tryout tidak valid");
      }
      console.log("Fetching tryout with tryout_id:", tryout_id);
      const { data: tryoutData, error: tryoutError } = await supabase
        .from("tryouts")
        .select("*")
        .eq("id", tryout_id)
        .single();
      if (tryoutError) throw tryoutError;
      setDataSoal(tryoutData as Tryout);

      console.log("Fetching questions for tryout_id:", tryout_id);
      const { data: questionData, error: questionError, count } = await supabase
        .from("questions")
        .select("*", { count: "exact" })
        .eq("tryout_id", tryout_id);
      if (questionError) throw questionError;
      if (count !== tryoutData.total_question) {
        console.warn("Jumlah soal fetched:", count, "seharusnya:", tryoutData.total_question, "Data:", questionData);
      }
      setQuestions(questionData as Question[]);

      const durationInSeconds = tryoutData.duration * 60;
      setTimeRemaining(durationInSeconds);
    } catch (err) {
      setError("Gagal memuat soal: " + (err as Error).message);
      console.error("Error fetching exam:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !tryout_id) {
      router.push("/login");
      return;
    }
    fetchExamDetail(token);
  }, [tryout_id, router]);

  useEffect(() => {
    if (timeRemaining !== null && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => (prev !== null ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeRemaining === 0) {
      Swal.fire({
        title: "Waktu Habis",
        text: "Jawaban Anda akan dikirim secara otomatis.",
        icon: "warning",
        confirmButtonText: "OK",
      }).then(() => handleSubmitAnswers());
    }
  }, [timeRemaining]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleAnswerChange = (questionId: string, selectedOption: string) => {
    setSelectedOptions((prev) => ({ ...prev, [questionId]: selectedOption }));
  };

  const generateAttemptId = () => {
    return uuidv4();
  };

  const handleSubmitAnswers = async () => {
    const token = localStorage.getItem("token");
    if (token && questions.length > 0) {
      try {
        const decoded: any = jwtDecode(token);
        console.log("Decoded Token:", decoded);
        const userId = decoded.user?.id; // Ambil 4269
        if (!userId) {
          throw new Error("User ID tidak ditemukan di token. Periksa struktur token.");
        }

        const { data: answerKeys, error: keyError } = await supabase
          .from("answer_keys")
          .select("question_id, correct_answer");
        if (keyError) throw keyError;

        let totalScore = 0;
        const newAttemptId = generateAttemptId();
        const answersToInsert = questions.map((q) => {
          const chosen = selectedOptions[q.id] || "";
          const correctKey = answerKeys.find((key: any) => key.question_id === q.id);
          const isCorrect = correctKey ? chosen === correctKey.correct_answer : false;
          if (isCorrect) totalScore += 10;
          return {
            id: uuidv4(),
            user_id: userId.toString(), // Gunakan user_id dari token (4269)
            tryout_id: tryout_id,
            question_id: q.id,
            chosen_answer: chosen,
            is_correct: isCorrect,
            score: isCorrect ? 10 : 0,
            attempt_id: newAttemptId,
            submitted_at: new Date().toISOString(),
          };
        });

        console.log("Inserting answers:", answersToInsert);
        const { error: insertError } = await supabase
          .from("user_answers")
          .insert(answersToInsert);
        if (insertError) {
          throw new Error(`Gagal insert: ${insertError.message}`);
        }

        Swal.fire({
          title: "Jawaban Sudah Dikirim",
          text: `Skor Anda: ${totalScore} dari ${questions.length * 10}`,
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => router.push(`/program/nilai/${program_id}/${tryout_id}?attempt=${newAttemptId}`));
      } catch (error) {
        console.error("Error submitting answers:", error);
        Swal.fire({
          title: "Error",
          text: error.message || "Gagal mengirim jawaban. Coba lagi nanti.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50">
        <div className="flex items-center gap-2 text-indigo-600 animate-pulse">
          <div className="w-6 h-6 border-4 border-t-indigo-600 border-b-transparent rounded-full animate-spin"></div>
          <span className="text-xl">Memuat Soal...</span>
        </div>
      </div>
    );
  }

  if (error || !dataSoal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 p-4 sm:p-6 ml-[64px]">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error || "Soal tidak ditemukan"}</p>
          <button
            onClick={() => fetchExamDetail(localStorage.getItem("token") || "")}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300"
          >
            <FontAwesomeIcon icon={faRotateRight} className="w-4 h-4" />
            <span>Coba Lagi</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 p-4 sm:p-6 ml-[64px] animate-fade-in">
      <div className="flex items-center mb-6">
        <button
          type="button"
          className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-all duration-300"
          onClick={() => router.back()}
        >
          <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5 text-indigo-600" />
        </button>
        <h1 className="ml-4 text-2xl sm:text-3xl font-bold text-indigo-800">Kerjakan Tryout</h1>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 rounded-xl p-6 text-white shadow-lg mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold">{dataSoal.title}</h2>
              <p className="text-lg font-normal mt-1">Tes Tryout {dataSoal.title}</p>
            </div>
            <div className="text-2xl font-semibold bg-white text-black px-4 py-2 rounded-lg">
              {timeRemaining !== null ? formatTime(timeRemaining) : "00:00"}
            </div>
          </div>
          <div className="mt-4 text-lg font-medium">Total Soal: {dataSoal.total_question}</div>
        </div>

        {currentQuestion && (
          <div className="bg-white rounded-xl p-6 shadow-md mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Soal {currentQuestionIndex + 1}</h3>
            <p className="text-lg text-gray-700 mb-6">{currentQuestion.question}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.id}
                  className={`border rounded-lg p-4 text-left transition-all duration-200 ${
                    selectedOptions[currentQuestion.id] === option.label
                      ? "border-blue-500 bg-blue-100"
                      : "border-gray-300 bg-white hover:bg-gray-50"
                  }`}
                  onClick={() => handleAnswerChange(currentQuestion.id, option.label)}
                >
                  <span className="font-bold mr-2">{option.label}.</span>
                  {option.content}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))}
            className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition-all duration-200 disabled:opacity-50"
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </button>
          <div className="flex space-x-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`px-3 py-1 border rounded-lg text-sm ${
                  currentQuestionIndex === index
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                } transition-all duration-200`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <button
            onClick={() => setCurrentQuestionIndex((prev) => Math.min(prev + 1, questions.length - 1))}
            className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-all duration-200 disabled:opacity-50"
            disabled={currentQuestionIndex === questions.length - 1}
          >
            Next
          </button>
        </div>

        {currentQuestionIndex === questions.length - 1 && (
          <button
            onClick={handleSubmitAnswers}
            className="w-full max-w-xs mx-auto block px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-all duration-200"
          >
            Submit Answers
          </button>
        )}
      </div>
    </div>
  );
}