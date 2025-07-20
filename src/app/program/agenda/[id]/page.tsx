"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useParams, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faMapMarkerAlt, faClock } from "@fortawesome/free-solid-svg-icons";
import { jwtDecode } from "jwt-decode";

// Definisikan tipe kustom untuk JwtPayload
interface CustomJwtPayload {
  sub?: string;
  user?: {
    id?: number;
  };
}

interface Tryout {
  id: number;
  program_id: number;
  name: string;
  total_questions: number;
  is_active: boolean;
  created_at: string;
  metadata: string;
  exam_category: string;
  price: number;
  duration_minutes: number;
  is_free: boolean;
  location: string;
  schedule_date: string;
}

const supabaseUrl = "https://ieknphduleynhuiaqsuc.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlla25waGR1bGV5bmh1aWFxc3VjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MTY4ODAsImV4cCI6MjA2ODA5Mjg4MH0.iZBnS3uGs68CmqrhQYAJdCZZGRqlKEThrm0B0FqyPVs";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Jadwal() {
  const { id } = useParams();
  const router = useRouter();
  const [tryouts, setTryouts] = useState<Tryout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token || !id) {
        router.push("/login");
        return;
      }

      const programId = Number(id);
      if (isNaN(programId)) throw new Error("ID program tidak valid");

      // Decode token dengan validasi
      let decodedToken;
      try {
        decodedToken = jwtDecode<CustomJwtPayload>(token);
        console.log("Decoded Token Payload:", decodedToken);
      } catch (decodeError) {
        throw new Error("Token tidak valid: " + (decodeError as Error).message);
      }
      const userId = Number(decodedToken.user?.id) || Number(decodedToken.sub);
      if (!userId) throw new Error("User ID tidak ditemukan di token");

      console.log("Extracted User ID:", userId, "Program ID from URL:", programId);

      // Cek status terdaftar
      const { data: registration, error: regError } = await supabase
        .from("user_registrations")
        .select("id")
        .eq("user_id", userId)
        .eq("program_id", programId)
        .limit(1);
      if (regError) throw new Error("Gagal cek registrasi: " + regError.message);
      const isUserRegistered = !!registration?.length;
      setIsRegistered(isUserRegistered);
      console.log("Registration Data:", registration, "Is Registered:", isUserRegistered);

      if (!isUserRegistered) {
        throw new Error("Anda belum terdaftar untuk program ini.");
      }

      // Fetch tryouts
      const { data, error: tryoutError } = await supabase
        .from("tryouts")
        .select("*")
        .eq("program_id", programId)
        .eq("is_active", true)
        .order("schedule_date", { ascending: true });
      if (tryoutError) throw tryoutError;
      setTryouts(data as Tryout[]);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100">
        <div className="flex items-center gap-3 text-indigo-700 animate-pulse">
          <div className="w-8 h-8 border-4 border-t-indigo-700 border-b-transparent rounded-full animate-spin"></div>
          <span className="text-2xl font-semibold">Memuat Jadwal...</span>
        </div>
      </div>
    );
  }

  if (error || !isRegistered) {
    console.log("Render Error or Not Registered:", error, "isRegistered:", isRegistered); // Debug render
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100 p-4 sm:p-6 ml-[64px]">
        <div className="text-center">
          <p className="text-red-600 text-xl mb-6">{error || "Anda belum terdaftar untuk program ini."}</p>
          <button
            onClick={() => router.push(`/program/${id}`)}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-300"
          >
            <span className="font-medium">Kembali ke Detail Program</span>
          </button>
        </div>
      </div>
    );
  }

  console.log("Rendering Tryouts:", tryouts); // Debug render sukses
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100 p-4 sm:p-6 ml-[64px]">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => router.back()}
          className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-110 mb-6"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="w-6 h-6 text-indigo-700" />
        </button>

        <h1 className="text-3xl sm:text-4xl font-bold text-indigo-900 mb-8">Jadwal Pendampingan</h1>

        <div className="space-y-6">
          {tryouts.map((tryout) => (
            <div
              key={tryout.id}
              className="bg-white p-6 rounded-2xl shadow-lg border border-stone-300 hover:shadow-xl transition-all duration-300"
            >
              <h3 className="text-xl font-semibold text-indigo-800 mb-2">{tryout.name}</h3>
              <p className="text-gray-600 text-sm mb-2">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                Lokasi: {tryout.location}
              </p>
              <p className="text-gray-600 text-sm mb-2">
                <FontAwesomeIcon icon={faClock} className="mr-2" />
                Tanggal: {new Date(tryout.schedule_date).toLocaleString("id-ID", {
                  dateStyle: "full",
                  timeStyle: "short",
                })}
              </p>
              <p className="text-gray-600 text-sm mb-2">Jumlah Soal: {tryout.total_questions}</p>
              <p className="text-gray-600 text-sm mb-2">Durasi: {tryout.duration_minutes} menit</p>
              <p className="text-gray-600 text-sm">
                Harga: {tryout.is_free ? "Gratis" : `Rp ${tryout.price.toLocaleString("id-ID")}`}
              </p>
            </div>
          ))}
        </div>

        {tryouts.length === 0 && (
          <div className="text-center text-gray-700 mt-10">
            <p className="text-xl">Tidak ada jadwal pendampingan tersedia.</p>
          </div>
        )}
      </div>
    </div>
  );
}
