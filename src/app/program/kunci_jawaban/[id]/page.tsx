"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

const supabaseUrl = "https://ieknphduleynhuiaqsuc.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlla25waGR1bGV5bmh1aWFxc3VjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MTY4ODAsImV4cCI6MjA2ODA5Mjg4MH0.iZBnS3uGs68CmqrhQYAJdCZZGRqlKEThrm0B0FqyPVs";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function KunciJawaban() {
  const router = useRouter();
  const { id } = useParams();
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKunciJawaban();
  }, [id]);

  const fetchKunciJawaban = async () => {
    setLoading(true);
    try {
      const tryoutId = Number(id);
      if (isNaN(tryoutId)) throw new Error("ID tryout tidak valid");

      const { data, error } = await supabase
        .from("questions")
        .select("id, question_text, option_a, option_b, option_c, option_d, correct_answer")
        .eq("tryout_id", tryoutId)
        .order("id", { ascending: true });
      if (error) throw error;
      setQuestions(data || []);
    } catch (err) {
      console.error("Error fetching kunci jawaban:", err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal memuat kunci jawaban!",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <span className="text-2xl text-blue-600 animate-pulse">Memuat Kunci Jawaban...</span>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <span className="text-xl text-red-600">Tidak ada kunci jawaban yang tersedia</span>
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
            <h1 className="ml-3 text-xl sm:text-2xl font-bold text-blue-800">Kunci Jawaban Tryout</h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-6 text-center">
            Kunci Jawaban - Tryout {id}
          </h2>
          <div className="space-y-6">
            {questions.map((q, index) => (
              <div key={q.id} className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500 hover:bg-blue-50 transition-all duration-200">
                <p className="text-md font-medium text-blue-800 mb-2">
                  Soal {index + 1}: {q.question_text}
                </p>
                <p className="text-sm text-gray-600">
                  Opsi: A) {q.option_a}, B) {q.option_b}, C) {q.option_c}, D) {q.option_d}
                </p>
                <p className="text-lg font-semibold text-green-600 mt-2">
                  Kunci Jawaban: <span className="font-bold">{q.correct_answer}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}