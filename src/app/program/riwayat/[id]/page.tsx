"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faEye } from "@fortawesome/free-solid-svg-icons";
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

export default function Riwayat() {
  const router = useRouter();
  const { id } = useParams();
  const [attempts, setAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRiwayat();
  }, [id]);

  const fetchRiwayat = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token tidak ditemukan");

      const decodedToken = jwtDecode<CustomJwtPayload>(token);
      const userId = decodedToken.user.id;

      const tryoutId = Number(id);
      if (isNaN(tryoutId)) throw new Error("ID tryout tidak valid");

      const { data, error } = await supabase
        .from("user_tryout_results")
        .select("attempt_number, question_id, user_answer, correct_answer")
        .eq("user_id", userId)
        .eq("tryout_id", tryoutId)
        .groupBy("attempt_number");
      if (error) throw error;

      // Hitung skor untuk setiap attempt
      const attemptSummaries = data.reduce((acc: any[], item) => {
        const existingAttempt = acc.find((a) => a.attempt_number === item.attempt_number);
        if (existingAttempt) {
          existingAttempt.results.push(item);
        } else {
          acc.push({
            attempt_number: item.attempt_number,
            results: [item],
            correct: 0,
            wrong: 0,
            empty: 0,
            score: 0,
          });
        }
        return acc;
      }, []);

      // Ambil total soal dari questions untuk menghitung empty
      const { data: questionData } = await supabase
        .from("questions")
        .select("id")
        .eq("tryout_id", tryoutId);
      const totalQuestions = questionData.length;

      attemptSummaries.forEach((attempt) => {
        const results = attempt.results;
        let correct = 0, wrong = 0, empty = 0;
        questionData.forEach((q) => {
          const result = results.find((r: any) => r.question_id === q.id);
          if (result) {
            if (result.user_answer === result.correct_answer) correct++;
            else if (result.user_answer) wrong++;
          } else {
            empty++;
          }
        });
        attempt.correct = correct;
        attempt.wrong = wrong;
        attempt.empty = empty;
        attempt.score = (correct * 4) + (wrong * -1);
      });

      setAttempts(attemptSummaries);
    } catch (err) {
      console.error("Error fetching riwayat:", err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal memuat riwayat!",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewAttempt = (attemptNumber: number) => {
    router.push(`/program/nilai/${id}?attempt=${attemptNumber}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <span className="text-2xl text-blue-600 animate-pulse">Memuat Riwayat...</span>
      </div>
    );
  }

  if (attempts.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <span className="text-xl text-red-600">Tidak ada riwayat attempt yang tersedia</span>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-white p-4 sm:p-6 lg:p-8">
      <main className="flex-1 mx-auto max-w-4xl">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button
              onClick={() => router.back()}
              className="mr-4 p-2 bg-blue-100 rounded-full hover:bg-blue-200 transition-transform transform hover:scale-110"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5 text-blue-600" />
            </button>
            <div className="h-3 w-1.5 bg-yellow-400 rounded-full animate-pulse"></div>
            <h1 className="ml-3 text-xl sm:text-2xl font-bold text-blue-800">Riwayat Tryout</h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-6 text-center">
            Riwayat Attempt - Tryout {id}
          </h2>
          <div className="space-y-4">
            {attempts.map((attempt) => (
              <div
                key={attempt.attempt_number}
                className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500 hover:bg-blue-50 transition-all duration-200 cursor-pointer"
                onClick={() => handleViewAttempt(attempt.attempt_number)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-md font-medium text-blue-800">
                      Attempt {attempt.attempt_number}
                    </p>
                    <p className="text-sm text-gray-600">
                      Skor: {attempt.score} / {attempt.correct * 4 + attempt.wrong * -1 + attempt.empty * 0} (Benar: {attempt.correct}, Salah: {attempt.wrong}, Kosong: {attempt.empty})
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewAttempt(attempt.attempt_number);
                    }}
                    className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300"
                  >
                    <FontAwesomeIcon icon={faEye} className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}