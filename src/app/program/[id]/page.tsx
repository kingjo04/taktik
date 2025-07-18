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
  sub: string; // Biasanya user_id
  user?: {
    id?: number; // Ubah ke number dari string/number
    // Tambahin properti lain kalau ada di token lu (misal name, email, dll.)
  };
  // Tambahin properti lain kalau ada di token lu
}

interface ProgramDetail {
  id: number; // Ubah ke number dari UUID
  name: string;
  description: string;
  duration: string;
  price: number;
  image_url: string;
}

interface Tryout {
  id: number; // Ubah ke number dari UUID
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
      const userId = Number(decodedToken.sub) || Number(decodedToken.user?.id); // Ubah ke number
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
    console.log("Opening register modal, isRegistered:", isRegistered);
    if (!isRegistered) setShowRegisterModal(true);
  };

  const handleTicketRegister = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    const decodedToken = jwtDecode<CustomJwtPayload>(token);
    const userId = Number(decodedToken.sub) || Number(decodedToken.user?.id); // Ubah ke number
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
      const programId = Number(id); // Tambahin deklarasi programId di sini
      console.log("Checking ticket:", ticketInput, "for program:", programId);
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
      console.log("Ticket found:", data);

      const { error: deleteError } = await supabase
        .from("tickets_available")
        .delete()
        .eq("ticket_code", ticketInput)
        .eq("program_id", programId);
      if (deleteError) throw deleteError;
      console.log("Ticket deleted from available");

      const { error: insertError } = await supabase
        .from("user_registrations")
        .insert({
          user_id: userId,
          program_id: programId,
          ticket_code: ticketInput,
        });
      if (insertError) throw insertError;
      console.log("Registration inserted");

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
      fetchProgramDetail(); // Refresh data
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
      router.push(`/program/detail_tryout/${program.id}`);
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

        <button
          onClick={handleTryoutClick}
          className="flex flex-col px-9 py-3 bg-white rounded-2xl border border-stone-300 shadow-md hover:shadow-lg transition-shadow max-md:px-5"
        >
          <img
            loading="lazy"
            src="/Try Out.svg"
            alt="Try Out"
            className="self-center w-12 aspect-square"
          />
          <div className="mt-4 text-center">Try Out</div>
        </button>

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

        <Link href={`/program/materi/${program.id}`}>
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

        <Link href={`/program/agenda/${program.id}`}>
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

      {!isRegistered && tryouts.length > 0 && (
        <button
          onClick={handleRegister}
          className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 transform hover:scale-105 font-semibold"
        >
          Daftar untuk Program
        </button>
      )}

      {showRegisterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Daftar dengan Tiket</h2>
            <input
              type="text"
              value={ticketInput}
              onChange={(e) => setTicketInput(e.target.value)}
              placeholder="Masukkan kode tiket (contoh: TICKET001)"
              className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleTicketRegister}
              className="w-full py-2 mb-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Daftar dengan Tiket
            </button>
            <button
              onClick={handleOnlinePayment}
              className="w-full py-2 mt-2 bg-gray-300 text-black rounded-lg cursor-not-allowed font-medium"
              disabled
            >
              Pembayaran Online (Belum Tersedia)
            </button>
            <button
              onClick={() => setShowRegisterModal(false)}
              className="mt-4 w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {isRegistered && tryouts.length > 0 && (
        <div className="mt-6 px-5">
          <button
            onClick={handleTryoutClick}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg shadow-md hover:from-green-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 font-semibold"
          >
            Mulai Tryout
          </button>
        </div>
      )}
    </div>
  );
}
