"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useParams, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faVideo, faClock } from "@fortawesome/free-solid-svg-icons";

interface Schedule {
  id: number;
  program_id: number;
  title: string;
  description: string;
  schedule_date: string;
  duration_minutes: number;
  zoom_link: string;
}

const supabaseUrl = "https://ieknphduleynhuiaqsuc.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlla25waGR1bGV5bmh1aWFxc3VjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MTY4ODAsImV4cCI6MjA2ODA5Mjg4MH0.iZBnS3uGs68CmqrhQYAJdCZZGRqlKEThrm0B0FqyPVs";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Agenda() {
  const { id } = useParams();
  const router = useRouter();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
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

      const { data: scheduleData, error: scheduleError } = await supabase
        .from("schedules")
        .select("*")
        .eq("program_id", programId)
        .order("schedule_date", { ascending: true });
      if (scheduleError) throw scheduleError;
      setSchedules(scheduleData as Schedule[]);

      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const userId = Number(decodedToken.sub) || Number(decodedToken.user?.id);
      if (userId) {
        const { data: registration } = await supabase
          .from("user_registrations")
          .select("id")
          .eq("user_id", userId)
          .eq("program_id", programId)
          .limit(1);
        setIsRegistered(!!registration?.length);
      }
    } catch (err) {
      setError("Gagal memuat jadwal: " + (err as Error).message);
      console.error("Error:", err);
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schedules.map((schedule) => (
            <div
              key={schedule.id}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border border-stone-300"
            >
              <h3 className="text-xl font-semibold text-indigo-800 mb-2">{schedule.title}</h3>
              <p className="text-gray-700 text-sm mb-4 line-clamp-2">{schedule.description}</p>
              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <FontAwesomeIcon icon={faClock} className="w-4 h-4" />
                <span>
                  {new Date(schedule.schedule_date).toLocaleString("id-ID", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                  - {schedule.duration_minutes} menit
                </span>
              </div>
              <button
                onClick={() => window.open(schedule.zoom_link, "_blank")}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105"
              >
                <FontAwesomeIcon icon={faVideo} />
                <span>Join Zoom</span>
              </button>
            </div>
          ))}
        </div>

        {schedules.length === 0 && (
          <div className="text-center text-gray-700 mt-10">
            <p className="text-xl">Belum ada jadwal pendampingan tersedia.</p>
          </div>
        )}
      </div>
    </div>
  );
}
