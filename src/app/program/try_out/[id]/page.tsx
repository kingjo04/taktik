"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter, useParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faRotateRight } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

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

const supabaseUrl = "https://ieknphduleynhuiaqsuc.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlla25waGR1bGV5bmh1aWFxc3VjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MTY4ODAsImV4cCI6MjA2ODA5Mjg4MH0.iZBnS3uGs68CmqrhQYAJdCZZGRqlKEThrm0B0FqyPVs";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function TryOut() {
  const router = useRouter();
  const { id } = useParams(); // id ini adalah program_id
  const [tryouts, setTryouts] = useState<Tryout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTryouts = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token || !id) {
        router.push("/login");
        return;
      }
      console.log("Fetching tryouts for program_id:", id);
      const { data, error } = await supabase
        .from("tryouts")
        .select("*")
        .eq("program_id", id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      setTryouts(data as Tryout[]);
      console.log("Tryouts fetched:", data);
    } catch (err) {
      setError("Gagal memuat tryout. Coba lagi nanti: " + (err as Error).message);
      console.error("Error fetching tryouts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchTryouts();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50">
        <div className="flex items-center gap-2 text-indigo-600 animate-pulse">
          <div className="w-6 h-6 border-4 border-t-indigo-600 border-b-transparent rounded-full animate-spin"></div>
          <span className="text-xl">Memuat Tryout...</span>
        </div>
      </div>
    );
  }

  if (error || !tryouts.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 p-4 sm:p-6 ml-[64px]">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error || "Tidak ada tryout tersedia"}</p>
          <button
            onClick={fetchTryouts}
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
        <h1 className="ml-4 text-2xl sm:text-3xl font-bold text-indigo-800">Try Out</h1>
      </div>

      <div className="flex gap-5 mb-8 items-end pt-10 pb-6 text-2xl font-semibold text-white bg-gradient-to-r from-blue-700 to-indigo-700 rounded-xl max-md:flex-wrap max-md:pt-6">
        <div className="shrink-0 h-[46px] w-[5px] bg-yellow-300" />
        <div className="flex-auto">
          <div className="text-3xl font-bold">
            Ujian Tertulis Berbasis Komputer dalam Seleksi Nasional Penerimaan Mahasiswa Baru (UTBK-SNPMB)
          </div>
          <div className="mt-2 text-lg font-normal text-white/90">
            Materi tes dalam Ujian Tertulis Berbasis Komputer dalam Seleksi Nasional Penerimaan Mahasiswa Baru (UTBK-SNPMB) terdiri dari dua komponen besar yaitu Tes Potensi Skolastik dan Tes Literasi
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tryouts.map((tryout) => (
          <div
            key={tryout.id}
            className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
          >
            <h3 className="text-base font-medium text-black mb-2">{tryout.title}</h3>
            <div className="space-y-2 text-sm text-neutral-500">
              <p>Dari: {new Date(tryout.created_at).toLocaleDateString("id-ID")}</p>
              <p>Total Soal: {tryout.total_question}</p>
              <p>Durasi: {tryout.duration} menit</p>
              <p>Status: {tryout.is_corrected ? "Sudah dinilai" : "Belum dinilai"}</p>
            </div>
            <Link
              href={`/program/detail_tryout/${id}/${tryout.id}`} // Ubah ke /program/detail_tryout/[program_id]/[tryout_id]
              className="mt-4 inline-block text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
            >
              Masuk
            </Link>
            <div className="mt-2 flex space-x-2">
              <div className="w-3 h-3 bg-zinc-300 rounded-full" />
              <div className="w-3 h-3 bg-zinc-300 rounded-full" />
              <div className="w-3 h-3 bg-zinc-300 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}