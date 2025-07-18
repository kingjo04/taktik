"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter, useParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faRotateRight } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";

// Definisikan tipe kustom untuk JwtPayload
interface CustomJwtPayload {
  sub: string;
  user?: {
    id?: number;
  };
}

interface ProgramDetail {
  id: number;
  name: string;
  description: string;
  duration: string;
  price: number;
  image_url: string;
}

interface Tryout {
  id: number;
  name: string;
  is_active: boolean;
}

const supabaseUrl = "https://ieknphduleynhuiaqsuc.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlla25waGR1bGV5bmh1aWFxc3VjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MTY4ODAsImV4cCI6MjA2ODA5Mjg4MH0.iZBnS3uGs68CmqrhQYAJdCZZGRqlKEThrm0B0FqyPVs";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function ProgramDetail() {
  const router = useRouter();
  const { id } = useParams();
  const [program, setProgram] = useState<ProgramDetail | null>(null);
  const [tryouts, setTryouts] = useState<Tryout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [ticketInput, setTicketInput] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);

  const fetchProgramDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token || !id) {
        console.log("No token or ID, redirecting to login");
        router.push("/login");
        return;
      }

      const programId = Number(id);
      if (isNaN(programId)) throw new Error("ID program tidak valid");

      const { data: programData, error: programError } = await supabase
        .from("programs")
        .select("id, name, description, duration, price, image_url")
        .eq("id", programId)
        .single();
      if (programError) throw programError;
      setProgram(programData as ProgramDetail);

      const { data: tryoutData, error: tryoutError } = await supabase
        .from("tryouts")
        .select("id, name, is_active")
        .eq("program_id", programId)
        .eq("is_active", true)
        .order("id", { ascending: true });
      if (tryoutError) throw tryoutError;
      setTryouts(tryoutData as Tryout[]);

      const decodedToken = jwtDecode<CustomJwtPayload>(token);
      const userId = Number(decodedToken.sub) || Number(decodedToken.user?.id);
      console.log("Decoded User ID:", userId);
      if (userId) {
        const { data: registration } = await supabase
          .from("user_registrations")
          .select("id")
          .eq("user_id", userId)
          .eq("program_id", programId)
          .limit(1);
        setIsRegistered(!!registration?.length);
        console.log("Is Registered:", !!registration?.length);

        const { error: activityError } = await supabase.from("user_activities").insert({
          user_id: userId,
          program_id: programId,
          activity_type: "view",
          created_at: new Date().toISOString(),
        });
        if (activityError) {
          console.error("Error saving activity:", activityError.message);
        } else {
          console.log("Activity saved for user:", userId, "program:", programId);
        }
      }
    } catch (err) {
      setError("Gagal memuat detail program atau tryout: " + (err as Error).message);
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchProgramDetail();
  }, [id]);

  const handleRegister = () => {
    if (!isRegistered) setShowRegisterModal(true);
  };

  const handleTicketRegister = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    const decodedToken = jwtDecode<CustomJwtPayload>(token);
    const userId = Number(decodedToken.sub) || Number(decodedToken.user?.id);
    if (!userId || !ticketInput) {
      Swal.fire({
        title: "Error",
        text: "Masukkan kode tiket yang valid.",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#DC2626",
      });
      return;
    }

    try {
      const programId = Number(id);
      const { data, error } = await supabase
        .from("tickets_available")
        .select("id, program_id")
        .eq("ticket_code", ticketInput)
        .eq("program_id", programId)
        .single();
      if (error || !data) {
        Swal.fire({
          title: "Error",
          text: "Kode tiket tidak valid atau tidak tersedia.",
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: "#DC2626",
        });
        return;
      }

      const { error: deleteError } = await supabase
        .from("tickets_available")
        .delete()
        .eq("ticket_code", ticketInput)
        .eq("program_id", programId);
      if (deleteError) throw deleteError;

      const { error: insertError } = await supabase
        .from("user_registrations")
        .insert({
          user_id: userId,
          program_id: programId,
          ticket_code: ticketInput,
        });
      if (insertError) throw insertError;

      Swal.fire({
        title: "Sukses",
        text: "Anda telah terdaftar dengan tiket " + ticketInput + "!",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#16A34A",
      });
      setShowRegisterModal(false);
      setIsRegistered(true);
      setTicketInput("");
      fetchProgramDetail();
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: "Gagal mendaftar: " + (err as Error).message,
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#DC2626",
      });
      console.error("Error:", err);
    }
  };

  const handleOnlinePayment = () => {
    Swal.fire({
      title: "Pembayaran Online",
      text: "Fitur pembayaran online belum tersedia.",
      icon: "info",
      confirmButtonText: "OK",
      confirmButtonColor: "#16A34A",
    });
  };

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

  const handleTryoutClick = () => {
    if (tryouts.length === 0) {
      Swal.fire({
        title: "Tidak Ada Tryout",
        text: "Tidak ada tryout aktif untuk program ini.",
        icon: "info",
        confirmButtonText: "OK",
        confirmButtonColor: "#16A34A",
      });
    } else if (!isRegistered) {
      Swal.fire({
        title: "Belum Terdaftar",
        text: "Silakan daftar terlebih dahulu dengan tiket.",
        icon: "warning",
        confirmButtonText: "OK",
        confirmButtonColor: "#DC2626",
      });
    } else if (program) {
      router.push(`/program/tryout/${program.id}`);
    } else {
      Swal.fire({
        title: "Error",
        text: "Data program tidak tersedia.",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#DC2626",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100">
        <div className="flex items-center gap-3 text-indigo-700 animate-pulse">
          <div className="w-8 h-8 border-4 border-t-indigo-700 border-b-transparent rounded-full animate-spin"></div>
          <span className="text-2xl font-semibold">Memuat Detail Program...</span>
        </div>
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100 p-4 sm:p-6 ml-[64px]">
        <div className="text-center">
          <p className="text-red-600 text-xl mb-6">{error || "Program tidak ditemukan"}</p>
          <button
            onClick={fetchProgramDetail}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-300"
          >
            <FontAwesomeIcon icon={faRotateRight} className="w-5 h-5" />
            <span className="font-medium">Coba Lagi</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100 p-4 sm:p-6 ml-[64px]">
      <div className="flex items-center mb-6">
        <button
          type="button"
          className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-110"
          onClick={() => router.back()}
        >
          <FontAwesomeIcon icon={faArrowLeft} className="w-6 h-6 text-indigo-700" />
        </button>
        <h1 className="ml-6 text-3xl sm:text-4xl font-bold text-indigo-900">Detail Program</h1>
      </div>

      <div
        className="relative w-full h-64 sm:h-80 bg-cover bg-center rounded-2xl shadow-2xl mb-8"
        style={{ backgroundImage: `url(${program.image_url})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40 rounded-2xl flex items-center justify-center">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white drop-shadow-lg">
            {program.name}
          </h2>
        </div>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg mb-8">
        <h3 className="text-2xl font-semibold text-indigo-800 mb-4">Deskripsi</h3>
        <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
          {program.description}
          <br />
          <br />
          <span className="font-medium">Durasi Pendampingan:</span> {program.duration}
        </p>
        <div className="mt-6">
          <h3 className="text-2xl font-semibold text-indigo-800 mb-2">Informasi</h3>
          <p className="text-gray-700 text-lg">
            Harga: <span className="font-bold text-indigo-600">Rp {program.price.toLocaleString("id-ID")}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 mb-8">
        <Link href="/universitas" className="menu-card">
          <div className="p-4 bg-white rounded-xl border border-stone-300 shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <img src="/Passing Grade.svg" alt="Passing Grade" className="w-16 h-16 mx-auto mb-4" />
            <p className="text-center text-gray-800 font-medium">Passing Grade</p>
          </div>
        </Link>

        <button onClick={handleTryoutClick} className="menu-card">
          <div className="p-4 bg-white rounded-xl border border-stone-300 shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <img src="/Try Out.svg" alt="Try Out" className="w-16 h-16 mx-auto mb-4" />
            <p className="text-center text-gray-800 font-medium">Try Out</p>
          </div>
        </button>

        <button onClick={handleGroupKonsultasi} className="menu-card">
          <div className="p-4 bg-white rounded-xl border border-stone-300 shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <img src="/Group Konsultasi.svg" alt="Group Konsultasi" className="w-16 h-16 mx-auto mb-4" />
            <p className="text-center text-gray-800 font-medium">Group Konsultasi</p>
          </div>
        </button>

        <Link href={`/program/materi/${program.id}`} className="menu-card">
          <div className="p-4 bg-white rounded-xl border border-stone-300 shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <img src="/Materi.svg" alt="Materi" className="w-16 h-16 mx-auto mb-4" />
            <p className="text-center text-gray-800 font-medium">Materi</p>
          </div>
        </Link>

        <button onClick={handlePartyBelajar} className="menu-card">
          <div className="p-4 bg-white rounded-xl border border-stone-300 shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <img src="/Party Belajar.svg" alt="Party Belajar" className="w-16 h-16 mx-auto mb-4" />
            <p className="text-center text-gray-800 font-medium">Party Belajar</p>
          </div>
        </button>

        <Link href={`/program/agenda/${program.id}`} className="menu-card">
          <div className="p-4 bg-white rounded-xl border border-stone-300 shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <img src="/Jadwal Pendampingan.svg" alt="Jadwal Pendampingan" className="w-16 h-16 mx-auto mb-4" />
            <p className="text-center text-gray-800 font-medium">Jadwal Pendampingan</p>
          </div>
        </Link>
      </div>

      {!isRegistered && tryouts.length > 0 && (
        <button
          onClick={handleRegister}
          className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl shadow-lg hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 transform hover:scale-105 font-bold text-lg mb-6"
        >
          Daftar Sekarang
        </button>
      )}

      {showRegisterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 hover:shadow-3xl">
            <h2 className="text-2xl font-bold text-indigo-800 mb-6">Daftar dengan Tiket</h2>
            <input
              type="text"
              value={ticketInput}
              onChange={(e) => setTicketInput(e.target.value)}
              placeholder="Masukkan kode tiket (contoh: TICKET001)"
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleTicketRegister}
              className="w-full py-3 mb-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              Daftar dengan Tiket
            </button>
            <button
              onClick={handleOnlinePayment}
              className="w-full py-3 bg-gray-300 text-black rounded-lg hover:bg-gray-400 transition-colors font-semibold"
              disabled
            >
              Pembayaran Online (Belum Tersedia)
            </button>
            <button
              onClick={() => setShowRegisterModal(false)}
              className="mt-4 w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {isRegistered && tryouts.length > 0 && (
        <div className="mt-6">
          <button
            onClick={handleTryoutClick}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl shadow-lg hover:from-green-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 font-bold text-lg"
          >
            Mulai Tryout
          </button>
        </div>
      )}
    </div>
  );
}