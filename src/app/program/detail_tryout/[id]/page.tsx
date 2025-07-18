"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter, useParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faRotateRight } from "@fortawesome/free-solid-svg-icons";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import Link from "next/link";
import axios from "axios";

interface Tryout {
  id: string;
  title: string;
  name: string;
  created_at: string;
  end_date: string;
  total_question: number;
  duration: number;
  is_corrected: boolean;
}

interface User {
  name: string;
  photo_profile: string;
}

const supabaseUrl = "https://ieknphduleynhuiaqsuc.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlla25waGR1bGV5bmh1aWFxc3VjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MTY4ODAsImV4cCI6MjA2ODA5Mjg4MH0.iZBnS3uGs68CmqrhQYAJdCZZGRqlKEThrm0B0FqyPVs";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function ProgramSoalDetail() {
  const [name, setName] = useState("");
  const [photoProfile, setPhotoProfile] = useState("");
  const [exam, setExam] = useState<Tryout | null>(null);
  const { program_id, tryout_id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = new URLSearchParams(window.location.search);
  const attemptIdFromUrl = searchParams.get("attempt");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !tryout_id) {
      router.push("/login");
      return;
    }
    fetchUserData(token);
    fetchExamDetail(token);

    // Simpan attempt_id dari URL ke localStorage kalau ada
    if (attemptIdFromUrl) {
      localStorage.setItem("lastAttemptId", attemptIdFromUrl);
    }
  }, [tryout_id, router, attemptIdFromUrl]);

  const fetchExamDetail = async (token: string) => {
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching exam with tryout_id:", tryout_id);
      const { data, error } = await supabase
        .from("tryouts")
        .select("*")
        .eq("id", tryout_id)
        .single();
      if (error) throw error;
      setExam(data as Tryout);
      console.log("Exam fetched:", data);
    } catch (err) {
      setError("Gagal memuat detail tryout: " + (err as Error).message);
      console.error("Error fetching exam:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = (token: string) => {
    try {
      const decoded: any = jwtDecode(token);
      const user = decoded.user;
      setName(user.name || "");
      setPhotoProfile(user.photo_profile || "");
      console.log("User data fetched:", user);
    } catch (error) {
      console.error("Invalid token:", error);
      setName("");
      setPhotoProfile("");
    }
  };

  const handleCheckHistory = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Token not found",
        text: "Please login to check history.",
      });
      return;
    }

    try {
      const response = await axios.get(
        `https://taktix.live/programs/historya/${tryout_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data) {
        Swal.fire({
          icon: "success",
          title: "History found",
          text: "Your exam history is available.",
        });
        router.push(`/program/riwayat/${program_id}/${tryout_id}`);
      }
    } catch (error) {
      console.error("Error fetching history:", error);
      Swal.fire({
        icon: "error",
        title: "History not found",
        text: "No history available for this exam.",
      });
    }
  };

  const handleStartExam = () => {
    router.push(`/program/kerjakan_tryout/${program_id}/${tryout_id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50">
        <div className="flex items-center gap-2 text-indigo-600 animate-pulse">
          <div className="w-6 h-6 border-4 border-t-indigo-600 border-b-transparent rounded-full animate-spin"></div>
          <span className="text-xl">Memuat Detail Tryout...</span>
        </div>
      </div>
    );
  }

  if (error || !exam) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 p-4 sm:p-6 ml-[64px]">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error || "Tryout tidak ditemukan"}</p>
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
        <h1 className="ml-4 text-2xl sm:text-3xl font-bold text-indigo-800">Detail Tryout</h1>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 rounded-xl p-6 text-white shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">{exam.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <span className="text-lg font-medium">Durasi</span>
              <span className="text-xl font-bold">{exam.duration || "N/A"} Menit</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-medium">Total Soal</span>
              <span className="text-xl font-bold">{exam.total_question || "N/A"} Soal</span>
            </div>
          </div>
          <div className="flex justify-center mt-6 space-x-4">
            <Link
              href={`/program/kerjakan_tryout/${program_id}/${tryout_id}`}
              className="w-48 h-12 bg-white text-blue-700 text-lg font-semibold rounded-lg flex items-center justify-center hover:bg-gray-100 transition-all duration-300"
            >
              Kerjakan Soal
            </Link>
            <Link
              href={`/program/kunci_jawaban/${program_id}/${tryout_id}?attempt=${attemptIdFromUrl || localStorage.getItem("lastAttemptId")}`}
              className="w-48 h-12 bg-green-700 text-white text-lg font-semibold rounded-lg flex items-center justify-center hover:bg-green-800 transition-all duration-300"
            >
              Lihat Kunci Jawaban
            </Link>
            <button
              onClick={handleCheckHistory}
              className="w-48 h-12 bg-red-700 text-white text-lg font-semibold rounded-lg flex items-center justify-center hover:bg-red-800 transition-all duration-300"
            >
              Cek History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}