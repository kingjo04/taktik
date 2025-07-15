"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Swal from "sweetalert2";
import Sidebar from "@/components/Sidebar";

interface JwtPayload {
  user: {
    id: number;
    name: string;
    photo_profile?: string;
  };
}

export default function KerjakanSoal({ params }: { params: { id: string } }) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [dataSoal, setDataSoal] = useState({
    title: "",
    category: "",
    duration: 0,
    total_question: 0,
    is_enrolled: false,
  });
  const [selectedOptions, setSelectedOptions] = useState<{ [key: number]: string }>({});
  const [answerIds, setAnswerIds] = useState<{ [key: number]: number }>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attemptionId, setAttemptionId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessing, setIsProcessing] = useState<{ [key: number]: boolean }>({});
  const router = useRouter();
  const { id } = params;
  const hasSubmitted = useRef(false);
  const timeBeforeSubmit = useRef<number | null>(null);

  useEffect(() => {
    const fetchExamData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const decoded: JwtPayload = jwtDecode(token);
        const userId = decoded.user.id;

        const startResponse = await axios.post(
          `https://api.taktix.co.id/student/exam/${id}/start`,
          { user_id: userId },
          { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
        );
        const soalData = startResponse.data;
        if (soalData.error || !soalData.id) {
          throw new Error(soalData.message || "Gagal memulai ujian");
        }
        setAttemptionId(soalData.id);

        const examResponse = await axios.get(
          `https://api.taktix.co.id/student/exam/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const examData = examResponse.data;
        setDataSoal({
          title: examData.title || "",
          category: examData.category?.name || examData.category_id?.toString() || "N/A",
          duration: examData.duration || 0,
          total_question: examData.total_question || 0,
          is_enrolled: examData.is_enrolled || false,
        });

        if (!examData.is_enrolled) {
          throw new Error("Anda belum mendaftar untuk mengerjakan soal ini. Silakan daftar terlebih dahulu.");
        }

        if (!soalData.exam?.questions || soalData.exam.questions.length === 0) {
          throw new Error("No questions found in the response. Check API data.");
        }
        const transformedQuestions = soalData.exam.questions.map((q: any) => ({
          id: q.id,
          question: q.question,
          image: q.image,
          options: [
            { id: `${q.id}-a`, label: "A", content: q.a },
            { id: `${q.id}-b`, label: "B", content: q.b },
            { id: `${q.id}-c`, label: "C", content: q.c },
            { id: `${q.id}-d`, label: "D", content: q.d },
            { id: `${q.id}-e`, label: "E", content: q.e },
          ],
        }));
        setQuestions(transformedQuestions);

        const initialOptions: { [key: number]: string } = {};
        const initialIds: { [key: number]: number } = {};
        soalData.answers.forEach((answer: any) => {
          initialOptions[answer.question_id] = answer.answer;
          initialIds[answer.question_id] = answer.id;
        });
        setSelectedOptions((prev) => ({ ...prev, ...initialOptions }));
        setAnswerIds((prev) => ({ ...prev, ...initialIds }));

        let initialTime = (soalData.exam.duration || examData.duration || 0) * 60;
        const savedTime = localStorage.getItem(`timeRemaining_${id}`);
        if (savedTime) {
          const parsedTime = parseInt(savedTime, 10);
          initialTime = parsedTime > 0 ? parsedTime : initialTime;
        }
        setTimeRemaining(initialTime);
      } catch (error: any) {
        console.error(`Error fetching exam data for ID ${id}:`, error);
        setError(error.message || "Gagal mengambil data soal. Cek koneksi atau ID soal.");
        Swal.fire({
          title: "Error",
          text: error.message || "Gagal mengambil data soal.",
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: "#dc3545",
          customClass: {
            confirmButton: "bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md",
          },
        }).then(() => {
          router.push(`/soal/detail_soal/${id}`);
        });
      } finally {
        setLoading(false);
      }
    };

    const submitted = localStorage.getItem(`submitted_${id}`);
    if (submitted === "true" && attemptionId) {
      hasSubmitted.current = true;
      router.push(`/soal/nilai/${id}?attemptionId=${attemptionId}`);
      return;
    }
    if (id) fetchExamData();
  }, [id, router, attemptionId]);

  useEffect(() => {
    localStorage.setItem(`selectedOptions_${id}`, JSON.stringify(selectedOptions));
    localStorage.setItem(`answerIds_${id}`, JSON.stringify(answerIds));
    if (timeRemaining !== null) {
      localStorage.setItem(`timeRemaining_${id}`, timeRemaining.toString());
    }
    if (hasSubmitted.current) {
      localStorage.setItem(`submitted_${id}`, "true");
    }
  }, [selectedOptions, answerIds, timeRemaining, id, hasSubmitted.current]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timeRemaining !== null && timeRemaining > 0 && !isSubmitting) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => (prev !== null ? prev - 1 : 0));
      }, 1000);
    } else if (timeRemaining === 0 && !isSubmitting && !hasSubmitted.current) {
      handleSubmit(); // Otomatis submit saat waktu habis
    }
    return () => clearInterval(timer);
  }, [timeRemaining, isSubmitting]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const fetchAnswerId = async (questionId: number, userId: number, token: string) => {
    try {
      const response = await axios.get(
        `https://api.taktix.co.id/student/exam/${id}/answer/${questionId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data?.data?.id || null;
    } catch (error) {
      console.error(`Failed to fetch answer_id for question ${questionId}:`, error);
      return null;
    }
  };

  const syncWithStart = async (token: string) => {
    if (!attemptionId) return;
    try {
      const startResponse = await axios.post(
        `https://api.taktix.co.id/student/exam/${id}/start`,
        { user_id: (jwtDecode(token) as JwtPayload).user.id },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
      const answers = startResponse.data.answers || [];
      const newOptions: { [key: number]: string } = {};
      const newIds: { [key: number]: number } = {};
      answers.forEach((answer: any) => {
        newOptions[answer.question_id] = answer.answer;
        newIds[answer.question_id] = answer.id;
      });
      setSelectedOptions((prev) => ({ ...prev, ...newOptions }));
      setAnswerIds((prev) => ({ ...prev, ...newIds }));
    } catch (error) {
      console.error("Error syncing with /start:", error);
    }
  };

  const handleAnswerChange = async (questionId: number, selectedOption: string) => {
    if (isSubmitting || isProcessing[questionId]) return;
    setIsProcessing((prev) => ({ ...prev, [questionId]: true }));

    const token = localStorage.getItem("token");
    if (!token || !attemptionId) {
      console.error("No token or attemption ID found");
      setIsProcessing((prev) => ({ ...prev, [questionId]: false }));
      return;
    }
    const decoded: JwtPayload = jwtDecode(token);
    const userId = decoded.user.id;

    const previousOption = selectedOptions[questionId];
    const normalizedOption = selectedOption.toLowerCase();
    setSelectedOptions((prev) => ({
      ...prev,
      [questionId]: normalizedOption,
    }));

    try {
      let answerId = answerIds[questionId];

      if (!previousOption && normalizedOption) {
        const response = await axios.post(
          `https://api.taktix.co.id/student/exam/${id}/answer/insert`,
          {
            user_id: userId,
            question_id: questionId,
            answer: normalizedOption,
            attemption_id: attemptionId,
          },
          { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
        );
        if (response.data?.data?.id) {
          setAnswerIds((prev) => ({ ...prev, [questionId]: response.data.data.id }));
        }
        await syncWithStart(token);
      } else if (normalizedOption && (previousOption !== normalizedOption || !answerId)) {
        if (!answerId) answerId = await fetchAnswerId(questionId, userId, token);
        if (answerId) {
          await axios.patch(
            `https://api.taktix.co.id/student/exam/${id}/answer/update`,
            {
              answer_id: answerId,
              user_id: userId,
              question_id: questionId,
              answer: normalizedOption,
              attemption_id: attemptionId,
            },
            { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
          );
        } else {
          throw new Error("No answer_id found for update");
        }
        await syncWithStart(token);
      } else if (previousOption && !normalizedOption) {
        if (!answerId) answerId = await fetchAnswerId(questionId, userId, token);
        if (answerId) {
          await axios.delete(
            `https://api.taktix.co.id/student/exam/${id}/answer/delete`,
            {
              headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
              data: { answer_id: answerId, user_id: userId, question_id: questionId, attemption_id: attemptionId },
            }
          );
          setAnswerIds((prev) => {
            const newState = { ...prev };
            delete newState[questionId];
            return newState;
          });
        } else {
          throw new Error("No answer_id found for delete");
        }
        await syncWithStart(token);
      }
    } catch (error: any) {
      console.error(`Error handling answer for question ${questionId}:`, error);
      setSelectedOptions((prev) => ({
        ...prev,
        [questionId]: previousOption,
      }));
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Gagal menyimpan jawaban. Coba lagi nanti.",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#dc3545",
        customClass: {
          confirmButton: "bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md",
        },
      });
    } finally {
      setIsProcessing((prev) => ({ ...prev, [questionId]: false }));
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting || hasSubmitted.current) return;
    setIsSubmitting(true);
    timeBeforeSubmit.current = timeRemaining;
    setTimeRemaining(0);

    try {
      const token = localStorage.getItem("token");
      if (!token || !attemptionId) throw new Error("No token or attemption ID found");
      const decoded: JwtPayload = jwtDecode(token);
      const userId = decoded.user.id;

      const confirmResult = await Swal.fire({
        title: "Konfirmasi Pengumpulan",
        text: "Apakah Anda yakin ingin mengumpulkan jawaban? Anda tidak akan bisa mengubah setelah ini.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, Kirim",
        cancelButtonText: "Batal",
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#dc3545",
        customClass: {
          confirmButton: "bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md",
          cancelButton: "bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md",
        },
      });

      if (confirmResult.isConfirmed || timeRemaining === 0) {
        await syncWithStart(token); // Sinkronisasi terakhir sebelum submit
        const normalizedOptions = Object.fromEntries(
          Object.entries(selectedOptions).map(([qId, ans]) => [qId, ans.toLowerCase()])
        );
        for (const [questionId, answer] of Object.entries(normalizedOptions)) {
          let answerId = answerIds[Number(questionId)];
          if (!answerId) answerId = await fetchAnswerId(Number(questionId), userId, token);
          if (answer && (!answerId || selectedOptions[Number(questionId)] !== answer)) {
            await axios.patch(
              `https://api.taktix.co.id/student/exam/${id}/answer/update`,
              {
                answer_id: answerId || 0,
                user_id: userId,
                question_id: Number(questionId),
                answer: answer,
                attemption_id: attemptionId,
              },
              { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
            ).then((response) => {
              if (response.data?.data?.id) {
                setAnswerIds((prev) => ({
                  ...prev,
                  [Number(questionId)]: response.data.data.id,
                }));
              }
            });
          }
        }

        await new Promise((resolve) => setTimeout(resolve, 2000)); // Delay buat sinkronisasi

        const finishResponse = await axios.post(
          `https://api.taktix.co.id/student/exam/${id}/finish`,
          {
            user_id: userId,
            attemption_id: attemptionId,
          },
          { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
        );
        console.log("Finish response:", finishResponse.data);

        if (finishResponse.status === 200) {
          hasSubmitted.current = true;
          localStorage.setItem(`submitted_${id}`, "true");
          Swal.fire({
            title: "Jawaban Terkirim!",
            text: "Jawaban telah disubmit, lihat hasil Try-Out kamu.",
            icon: "success",
            confirmButtonText: "Lihat Hasil",
            confirmButtonColor: "#28a745",
            customClass: {
              confirmButton: "bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md",
            },
          }).then(() => {
            router.push(`/soal/nilai/${id}?attemptionId=${attemptionId}`);
          });
        } else {
          throw new Error("Gagal menyelesaikan pengerjaan: " + (finishResponse.data.message || "Unknown error"));
        }
      } else {
        setIsSubmitting(false);
        setTimeRemaining(timeBeforeSubmit.current);
      }
    } catch (error: any) {
      console.error(`Error submitting answers for exam ID ${id}:`, error.response?.data || error.message);
      setIsSubmitting(false);
      setTimeRemaining(timeBeforeSubmit.current || dataSoal.duration * 60); // Kembalikan waktu
      Swal.fire({
        title: "Error",
        text: `Gagal mengirim jawaban: ${error.message}. Coba lagi atau hubungi admin.`,
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#dc3545",
        customClass: {
          confirmButton: "bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md",
        },
      });
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-2xl text-blue-600 animate-pulse">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  const progress = timeRemaining !== null ? (timeRemaining / (dataSoal.duration * 60)) * 100 : 0;

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 min-h-screen bg-white p-4 ml-16 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
            {dataSoal.title || "Ujian"}
          </h1>
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <div className="mb-6 text-center">
              <div className="text-lg text-gray-600">Kategori: {dataSoal.category || "N/A"}</div>
              <div className="text-lg text-gray-600">Total Soal: {dataSoal.total_question}</div>
              <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
                <div
                  className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="text-lg text-gray-700 mt-1">
                Waktu Tersisa: {timeRemaining !== null ? formatTime(timeRemaining) : "00:00"}
              </div>
            </div>
            {currentQuestion ? (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-blue-700 mb-4">
                  Soal {currentQuestionIndex + 1}
                </h2>
                <p className="text-gray-700 mb-4">{currentQuestion.question}</p>
                {currentQuestion.image && (
                  <img
                    src={currentQuestion.image}
                    alt="Question"
                    className="mb-4 max-w-full rounded-lg shadow-md"
                  />
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentQuestion.options.map((option: any) => (
                    <button
                      key={option.id}
                      className={`w-full p-4 border rounded-lg text-left transition-all duration-200 ${
                        selectedOptions[currentQuestion.id] === option.label.toLowerCase()
                          ? "bg-blue-100 border-blue-500 text-blue-700 transform scale-105"
                          : "bg-white border-gray-300 hover:bg-gray-50"
                      } ${isProcessing[currentQuestion.id] ? "opacity-50 cursor-not-allowed" : ""}`}
                      onClick={() =>
                        handleAnswerChange(
                          currentQuestion.id,
                          selectedOptions[currentQuestion.id] === option.label.toLowerCase()
                            ? ""
                            : option.label
                        )
                      }
                      disabled={isSubmitting || isProcessing[currentQuestion.id]}
                    >
                      <span className="font-medium">{option.label}.</span> {option.content}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={() => setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))}
                className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition disabled:opacity-50"
                disabled={currentQuestionIndex === 0 || questions.length === 0 || isSubmitting}
              >
                Previous
              </button>
              <div className="flex space-x-2 overflow-x-auto">
                {questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestionIndex(index)}
                    className={`px-3 py-1 border rounded-full text-sm ${
                      currentQuestionIndex === index
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    } transition`}
                    disabled={questions.length === 0 || isSubmitting}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() =>
                  setCurrentQuestionIndex((prev) => Math.min(prev + 1, questions.length - 1))
                }
                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition disabled:opacity-50"
                disabled={currentQuestionIndex === questions.length - 1 || questions.length === 0 || isSubmitting}
              >
                Next
              </button>
            </div>
            {currentQuestionIndex === questions.length - 1 && questions.length > 0 && (
              <div className="mt-6 text-center">
                <button
                  onClick={handleSubmit}
                  className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition transform hover:scale-105"
                  disabled={isSubmitting}
                >
                  Submit Jawaban
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}