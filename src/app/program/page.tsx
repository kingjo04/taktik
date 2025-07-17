"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { jwtDecode } from "jwt-decode";

interface Program {
  id: number; // Ubah dari string ke number karena INTEGER
  name: string;
  price: number;
  image_url: string; // Ubah dari image_banner ke image_url sesuai tabel baru
}

const supabaseUrl = "https://ieknphduleynhuiaqsuc.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlla25waGR1bGV5bmh1aWFxc3VjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MTY4ODAsImV4cCI6MjA2ODA5Mjg4MH0.iZBnS3uGs68CmqrhQYAJdCZZGRqlKEThrm0B0FqyPVs";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Program() {
  const router = useRouter();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrograms = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        // Decode token untuk ambil user_id (asumsi ada di sub atau custom claim)
        let decodedToken;
        try {
          decodedToken = jwtDecode(token);
          const userId = decodedToken.sub || decodedToken.user?.id; // Sesuaikan dengan struktur token
          if (!userId) throw new Error("User ID tidak ditemukan di token");
          console.log("Decoded Token - User ID:", userId);
        } catch (decodeError) {
          console.error("Token decode failed:", decodeError);
          throw new Error("Token tidak valid atau bukan JWT standar.");
        }

        // Fetch data programs dengan kolom yang sesuai
        const { data, error } = await supabase
          .from("programs")
          .select("id, name, price, image_url") // Pilih kolom yang ada
          .order("created_at", { ascending: false });
        if (error) {
          console.error("Fetch error:", error.message);
          throw new Error("Gagal mengambil data program: " + error.message);
        }
        setPrograms(data as Program[]);
      } catch (err) {
        setError("Gagal memuat program. Coba lagi nanti: " + (err as Error).message);
        console.error("Error in fetchPrograms:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, [router]);

  const handleProgramClick = async (programId: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.sub || decodedToken.user?.id; // Sesuaikan dengan token

      if (userId) {
        const { error } = await supabase.from("user_activities").insert({
          user_id: Number(userId), // Konversi ke number karena INTEGER
          program_id: programId,
          activity_type: "view",
          created_at: new Date().toISOString(),
        });

        if (error) {
          console.error("Error saving activity:", error.message);
        } else {
          console.log("Activity saved for user:", userId, "program:", programId);
        }
      }

      router.push(`/program/${programId}`); // Arahkan ke detail
    } catch (err) {
      console.error("Error handling program click:", err);
    }
  };

  const educationImages = [
    "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2089&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50">
        <div className="text-2xl text-indigo-600 animate-pulse">Memuat Program...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 p-4 sm:p-6 ml-[64px]">
        <div className="text-red-500 text-center">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 p-4 sm:p-6 ml-[64px]">
      <div className="flex items-center">
        <button
          type="button"
          className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-all duration-300"
          onClick={() => router.back()}
        >
          <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5 text-indigo-600" />
        </button>
        <h1 className="ml-4 text-2xl sm:text-3xl font-bold text-indigo-800">Program</h1>
      </div>

      <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {programs.length > 0 ? (
          programs.map((program, index) => {
            const imageUrl = program.image_url || educationImages[index % educationImages.length];
            return (
              <div
                key={program.id}
                onClick={() => handleProgramClick(program.id)}
                className="block rounded-xl overflow-hidden min-h-[250px] sm:min-h-[300px] cursor-pointer bg-white shadow-md hover:shadow-lg transition-shadow"
              >
                <div
                  className="w-full h-36 sm:h-48 relative"
                  style={{
                    backgroundImage: `url(${imageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white text-center p-2 sm:p-4">
                    <div>
                      <h2 className="text-lg sm:text-2xl font-bold">{program.name}</h2>
                      <p className="text-sm sm:text-lg mt-1">
                        {program.price === 0 ? "Gratis" : `Rp ${program.price.toLocaleString("id-ID")}`}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-2 sm:p-4">
                  <p className="text-gray-600 text-xs sm:text-sm">
                    Klik untuk detail program
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500 mt-10">Tidak ada program tersedia.</p>
        )}
      </div>
    </div>
  );
}
