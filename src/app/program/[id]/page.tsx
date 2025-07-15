"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter, useParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faRotateRight } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Swal from "sweetalert2";

interface ProgramDetail {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: number;
  image_banner: string;
}

const supabaseUrl = "https://ieknphduleynhuiaqsuc.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlla25waGR1bGV5bmh1aWFxc3VjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MTY4ODAsImV4cCI6MjA2ODA5Mjg4MH0.iZBnS3uGs68CmqrhQYAJdCZZGRqlKEThrm0B0FqyPVs";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function ProgramDetail() {
  const router = useRouter();
  const { id } = useParams();
  const [program, setProgram] = useState<ProgramDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProgramDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token || !id) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("programs")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      setProgram(data as ProgramDetail);
    } catch (err) {
      setError("Gagal memuat detail program. Coba lagi nanti.");
      console.error("Error fetching program detail:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchProgramDetail();
  }, [id]);

  const handleGroupKonsultasi = () => {
    Swal.fire({
      title: "Link Group tidak ada",
      icon: "warning",
      confirmButtonText: "OK",
      confirmButtonColor: "#DC2626",
    });
  };

  const handlePartyBelajar = () => {
    Swal.fire({
      title: "Pesta belajar dapat dibuka saat sudah masuk jadwal",
      icon: "info",
      confirmButtonText: "OK",
      confirmButtonColor: "#16A34A",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50">
        <div className="flex items-center gap-2 text-indigo-600 animate-pulse">
          <div className="w-6 h-6 border-4 border-t-indigo-600 border-b-transparent rounded-full animate-spin"></div>
          <span className="text-xl">Memuat Detail Program...</span>
        </div>
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 p-4 sm:p-6 ml-[64px]">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error || "Program tidak ditemukan"}</p>
          <button
            onClick={fetchProgramDetail}
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
      <div className="flex items-center">
        <button
          type="button"
          className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-all duration-300"
          onClick={() => router.back()}
        >
          <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5 text-indigo-600" />
        </button>
        <h1 className="ml-4 text-2xl sm:text-3xl font-bold text-indigo-800">Program Detail</h1>
      </div>

      <div className="flex gap-5 my-5 items-end pt-20 pb-6 text-2xl font-semibold text-white bg-gradient-to-r from-blue-700 to-indigo-700 rounded-3xl max-md:flex-wrap">
        <div className="shrink-0 mt-20 bg-yellow-300 h-[46px] w-[5px] max-md:mt-10" />
        <div className="flex-auto mt-24 max-md:mt-10 max-md:max-w-full">{program.name}</div>
      </div>

      <div className="flex flex-col px-5 text-xl font-medium text-black max-w-[878px]">
        <div className="w-full max-md:max-w-full">Deskripsi</div>
        <div className="mt-2 w-full text-base max-md:max-w-full">
          {program.description}
          <br />
          <br />
          Durasi Pendampingan: {program.duration}
          <br />
        </div>
        <div className="mt-10 w-full max-md:max-w-full">Informasi</div>
        <div className="mt-3.5 w-full text-base max-md:max-w-full">
          Harga Rp. {program.price.toLocaleString("id-ID")}
        </div>
        <div className="mt-10 w-full max-md:mt-10 max-md:max-w-full">Menu</div>
      </div>

      <div className="flex gap-5 justify-between px-5 text-base text-black max-md:flex-wrap mt-6">
        <div className="flex flex-col p-3.5 bg-white rounded-2xl border border-stone-300 shadow-md hover:shadow-lg transition-shadow">
          <img
            loading="lazy"
            src="/Passing Grade.svg"
            alt="Passing Grade"
            className="self-center w-12 aspect-[1.18]"
          />
          <Link href="/universitas">
            <div className="mt-5 text-center">Passing Grade</div>
          </Link>
        </div>

        <Link href={`/program/try_out/${id}`}>
          <div className="flex flex-col px-9 py-3 bg-white rounded-2xl border border-stone-300 shadow-md hover:shadow-lg transition-shadow max-md:px-5">
            <img
              loading="lazy"
              src="/Try Out.svg"
              alt="Try Out"
              className="self-center w-12 aspect-square"
            />
            <div className="mt-4 text-center">Try Out</div>
          </div>
        </Link>

        <button
          onClick={handleGroupKonsultasi}
          className="flex flex-col px-1.5 py-3 bg-white rounded-2xl border border-stone-300 shadow-md hover:shadow-lg transition-shadow"
        >
          <img
            loading="lazy"
            src="/Group Konsultasi.svg"
            alt="Group Konsultasi"
            className="self-center aspect-[1.12] w-[53px]"
          />
          <div className="mt-4 text-center">Group Konsultasi</div>
        </button>

        <Link href={`/program/materi/${id}`}>
          <div className="flex flex-col px-9 pt-px pb-4 bg-white rounded-2xl border border-stone-300 shadow-md hover:shadow-lg transition-shadow max-md:px-5">
            <img
              loading="lazy"
              src="/Materi.svg"
              alt="Materi"
              className="self-center w-12 aspect-[0.76]"
            />
            <div className="mt-2 text-center">Materi</div>
          </div>
        </Link>

        <button
          onClick={handlePartyBelajar}
          className="flex flex-col px-5 py-3 bg-white rounded-2xl border border-stone-300 shadow-md hover:shadow-lg transition-shadow"
        >
          <img
            loading="lazy"
            src="/Party Belajar.svg"
            alt="Party Belajar"
            className="self-center aspect-[1.12] w-[54px]"
          />
          <div className="mt-3.5 text-center">Party Belajar</div>
        </button>

        <Link href={`/program/agenda/${id}`}>
          <div className="flex flex-col px-5 py-3 bg-white rounded-2xl border border-stone-300 shadow-md hover:shadow-lg transition-shadow">
            <img
              loading="lazy"
              src="/Jadwal Pendampingan.svg"
              alt="Jadwal Pendampingan"
              className="self-center aspect-[1.12] w-[54px]"
            />
            <div className="mt-3.5 text-center text-wrap">Jadwal Pendampingan</div>
          </div>
        </Link>
      </div>
    </div>
  );
}