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

export default function DetailTryout() {
  const router = useRouter();
  const { id } = useParams();
  const [tryout, setTryout] = useState<any>(null);
  const [name, setName] = useState("");
  const [photoProfile, setPhotoProfile] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: any = JSON.parse(atob(token.split('.')[1]));
        const user = decoded.user || {};
        setName(user.name || "");
        setPhotoProfile(user.photo_profile || "");
      } catch (error) {
        console.error("Invalid token:", error);
        setName("");
        setPhotoProfile("");
      }
    }
    fetchTryoutDetail();
  }, [id]);

  const fetchTryoutDetail = async () => {
    setLoading(true);
    try {
      const tryoutId = Number(id);
      if (isNaN(tryoutId)) throw new Error("ID tryout tidak valid");

      const { data, error } = await supabase
        .from("tryouts")
        .select("id, name, is_active, program_id, created_at, total_questions, duration_minutes, exam_category, is_free, price")

        .eq("id", tryoutId)
        .single();
      if (error) throw error;
      setTryout(data);
    } catch (err) {
      console.error("Error fetching tryout detail:", err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal memuat detail tryout!",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <span className="text-2xl text-blue-600 animate-pulse">Memuat Detail Tryout...</span>
      </div>
    );
  }

  if (!tryout) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <span className="text-xl text-red-600">Tryout tidak ditemukan</span>
      </div>
    );
  }

  return (
    <div className="flex">
      <main className="flex-1 min-h-screen bg-gradient-to-br from-blue-50 to-white p-4 sm:p-6 lg:p-8 ml-16 overflow-x-hidden max-w-full">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button
              onClick={() => window.history.back()}
              className="mr-4 p-2 bg-blue-100 rounded-full hover:bg-blue-200 transition-transform transform hover:scale-110"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5 text-blue-600" />
            </button>
            <div className="h-3 w-1.5 bg-yellow-400 rounded-full animate-pulse"></div>
            <h1 className="ml-3 text-xl sm:text-2xl font-bold text-blue-800">Detail Tryout</h1>
          </div>
          {name && (
            <div className="flex items-center gap-2">
              {photoProfile && (
                <img
                  src={photoProfile}
                  alt="Profile"
                  className="h-8 w-8 rounded-full object-cover border-2 border-yellow-400"
                />
              )}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex justify-center my-8">
          <div className="w-full max-w-[1000px] bg-gradient-to-br from-blue-700 to-blue-900 rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300">
            {/* Title Section */}
            <h2 className="text-white text-2xl sm:text-3xl font-bold mb-6 text-center">
              {tryout.name}
            </h2>

            {/* Details Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-white">
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-medium">Kategori</span>
                <span className="text-lg sm:text-xl font-semibold mt-1">
                  {tryout.exam_category || "N/A"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-medium">Kategori Ujian</span>
                <span className="text-lg sm:text-xl font-semibold mt-1">
                  {tryout.name || "N/A"}
                </span>
              </div>
              <div className="flex flex-col">
  <span className="text-lg sm:text-xl font-medium">Harga</span>
  <span className="text-lg sm:text-xl font-semibold mt-1">
    {tryout.is_free ? "Gratis" : `Rp ${Number(tryout.price).toLocaleString("id-ID")}`}
  </span>
</div>

              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-medium">Jumlah Soal</span>
                <span className="text-lg sm:text-xl font-semibold mt-1">
                  {tryout.total_questions || "N/A"} Soal
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-medium">Durasi</span>
                <span className="text-lg sm:text-xl font-semibold mt-1">
                  {tryout.duration_minutes || "N/A"} Menit
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-medium">Status</span>
                <span className="text-lg sm:text-xl font-semibold mt-1">
                  {tryout.is_active ? "Aktif" : "Tidak Aktif"}
                </span>
              </div>
            </div>

            {/* Button Section */}
            <div className="flex justify-center mt-8">
              <button
                onClick={() => router.push(`/program/detail_soal/${tryout.id}`)}
                className="w-[300px] h-14 bg-white text-blue-700 text-xl font-semibold rounded-2xl flex items-center justify-center hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
              >
                Dapatkan Soal
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}