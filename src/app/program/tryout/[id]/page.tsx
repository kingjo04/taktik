"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter, useParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faClock, faList, faCheckCircle, faLock } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

interface Tryout {
  id: number;
  name: string;
  is_active: boolean;
  program_id: number;
  total_questions?: number;
  duration_minutes?: number;
  exam_category?: string;
  is_free?: boolean;
  created_at?: string;
}

const supabaseUrl = "https://ieknphduleynhuiaqsuc.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlla25waGR1bGV5bmh1aWFxc3VjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MTY4ODAsImV4cCI6MjA2ODA5Mjg4MH0.iZBnS3uGs68CmqrhQYAJdCZZGRqlKEThrm0B0FqyPVs";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function DetailTryout() {
  const router = useRouter();
  const { id } = useParams();
  const [tryouts, setTryouts] = useState<Tryout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTryouts = async () => {
    setLoading(true);
    setError(null);
    try {
      const programId = Number(id);
      if (isNaN(programId)) throw new Error("ID program tidak valid");

      const { data, error: fetchError } = await supabase
        .from("tryouts")
        .select("id, name, is_active, program_id, total_questions, duration_minutes, exam_category, is_free, created_at")
        .eq("program_id", programId)
        .eq("is_active", true)
        .order("id", { ascending: true });
      if (fetchError) throw fetchError;
      setTryouts(data || []);
    } catch (err) {
      setError("Gagal memuat tryout: " + (err as Error).message);
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchTryouts();
  }, [id]);

  const handleTryoutClick = (tryoutId: number) => {
    router.push(`/program/detail_tryout/${tryoutId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100">
        <div className="flex items-center gap-3 text-indigo-700 animate-pulse">
          <div className="w-8 h-8 border-4 border-t-indigo-700 border-b-transparent rounded-full animate-spin"></div>
          <span className="text-2xl font-semibold">Memuat Tryout...</span>
        </div>
      </div>
    );
  }

  if (error || tryouts.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100 p-4 sm:p-6 ml-[64px]">
        <div className="text-center">
          <p className="text-red-600 text-xl mb-6">{error || "Tidak ada tryout aktif untuk program ini"}</p>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5" />
            <span className="font-medium">Kembali</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100 p-4 sm:p-6 lg:p-8 ml-[64px]">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <button
            type="button"
            className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-110"
            onClick={() => router.back()}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="w-6 h-6 text-indigo-700" />
          </button>
          <h1 className="ml-6 text-3xl sm:text-4xl font-bold text-indigo-900">Daftar Tryout</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tryouts.map((tryout) => (
          <div
            key={tryout.id}
            onClick={() => handleTryoutClick(tryout.id)}
            className="cursor-pointer p-6 bg-white rounded-xl border border-stone-300 shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden group"
          >
            <div className="flex flex-col h-full">
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-indigo-800 mb-2 line-clamp-2">{tryout.name}</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faList} className="text-indigo-500" />
                    <span>Jumlah Soal: {tryout.total_questions || "N/A"}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faClock} className="text-indigo-500" />
                    <span>Durasi: {tryout.duration_minutes || "N/A"} Menit</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
                    <span>Kategori: {tryout.exam_category || "N/A"}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <FontAwesomeIcon icon={tryout.is_free ? faCheckCircle : faLock} className={tryout.is_free ? "text-green-500" : "text-red-500"} />
                    <span>Harga: {tryout.is_free ? "Gratis" : "Berbayar"}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span>Dibuat: {tryout.created_at ? new Date(tryout.created_at).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" }) : "N/A"}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span>Status: {tryout.is_active ? "Aktif" : "Tidak Aktif"}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleTryoutClick(tryout.id);
                }}
                className="mt-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300 text-sm font-medium group-hover:scale-105"
              >
                Lihat Detail
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}