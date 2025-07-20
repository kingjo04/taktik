"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faChevronDown, faChevronUp, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { jwtDecode } from "jwt-decode";

// Tipe untuk data program
interface Program {
  id: number;
  name: string;
  price: number;
  image_url: string;
}

// Tipe aman untuk JWT Token
interface CustomJwtPayload {
  sub?: string;
  user?: {
    id: number;
    name?: string;
    username?: string;
    email?: string;
  };
  iat?: number;
  exp?: number;
}

const supabaseUrl = "https://ieknphduleynhuiaqsuc.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlla25waGR1bGV5bmh1aWFxc3VjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MTY4ODAsImV4cCI6MjA2ODA5Mjg4MH0.iZBnS3uGs68CmqrhQYAJdCZZGRqlKEThrm0B0FqyPVs";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Program() {
  const router = useRouter();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedProgramId, setExpandedProgramId] = useState<number | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [registeredProgramIds, setRegisteredProgramIds] = useState<number[]>([]);

  useEffect(() => {
    const fetchPrograms = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("No token found, redirecting to login");
          router.push("/login");
          return;
        }

        let decodedToken: CustomJwtPayload;
        try {
          decodedToken = jwtDecode<CustomJwtPayload>(token);
          const userId = Number(decodedToken.sub) || Number(decodedToken.user?.id);
          if (!userId) throw new Error("User ID tidak ditemukan di token");
          setUserId(userId);
          console.log("Decoded Token - User ID:", userId);
        } catch (decodeError) {
          console.error("Token decode failed:", decodeError);
          throw new Error("Token tidak valid atau bukan JWT standar.");
        }

        const { data: programsData, error: fetchError } = await supabase
          .from("programs")
          .select("id, name, price, image_url")
          .order("price", { ascending: true });

        if (fetchError) throw new Error("Gagal mengambil data program: " + fetchError.message);
        console.log("Programs fetched:", programsData);

        const programs = programsData as Program[];
        if (userId) {
          const { data: registrations, error: regError } = await supabase
            .from("user_registrations")
            .select("program_id")
            .eq("user_id", userId);
          if (regError) throw new Error("Gagal mengambil data registrasi: " + regError.message);
          const registeredIds = registrations?.map((r) => r.program_id) || [];
          setRegisteredProgramIds(registeredIds);
          console.log("Registered Program IDs for user", userId, ":", registeredIds);

          const registeredPrograms = programs.filter((p) => registeredIds.includes(p.id));
          const unregisteredPrograms = programs.filter((p) => !registeredIds.includes(p.id));
          setPrograms([...registeredPrograms, ...unregisteredPrograms]);
        } else {
          setPrograms(programs);
        }
      } catch (err) {
        setError("Gagal memuat program: " + (err as Error).message);
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
      console.log("No token found, redirecting to login");
      router.push("/login");
      return;
    }

    try {
      if (userId) {
        const { error } = await supabase.from("user_activities").insert({
          user_id: userId,
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

      router.push(`/program/${programId}`);
    } catch (err) {
      console.error("Error handling program click:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    console.log("Token removed, redirecting to login");
    router.push("/login");
  };

  const toggleExpand = (programId: number) => {
    setExpandedProgramId(expandedProgramId === programId ? null : programId);
  };

  const educationImages = [
    "https://images.unsplash.com/photo-1457369804613-52c61a468e7d",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f",
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b",
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
      <div className="flex items-center justify-between">
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
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300"
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
          Logout
        </button>
      </div>

      <div className="mt-6 sm:mt-8">
        {programs.length > 0 ? (
          <>
            {userId && (
              <div>
                <h2 className="text-xl font-semibold text-indigo-700 mb-4">Program Terdaftar</h2>
                {registeredProgramIds.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {programs
                      .filter((p) => registeredProgramIds.includes(p.id))
                      .map((program, index) => {
                        const imageUrl =
                          program.image_url || educationImages[index % educationImages.length];
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
                                    {program.price === 0
                                      ? "Gratis"
                                      : `Rp ${program.price.toLocaleString("id-ID")}`}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="p-2 sm:p-4">
                              <p className="text-gray-600 text-xs sm:text-sm">Klik untuk detail</p>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <p className="text-gray-500">Belum ada program terdaftar, silahkan daftar di bawah terlebih dahulu.</p>
                )}
              </div>
            )}

            <div className="mt-6">
              <h2 className="text-xl font-semibold text-indigo-700 mb-4">Program Lain</h2>
              {programs
                .filter((p) => !registeredProgramIds.includes(p.id))
                .map((program, index) => {
                  const imageUrl =
                    program.image_url || educationImages[index % educationImages.length];
                  return (
                    <div
                      key={program.id}
                      className="mb-4 bg-white rounded-xl shadow-md transition-all"
                    >
                      <div
                        className="flex items-center justify-between p-4 cursor-pointer"
                        onClick={() => toggleExpand(program.id)}
                      >
                        <div>
                          <h3 className="text-lg font-medium text-indigo-800">{program.name}</h3>
                          <p className="text-sm text-gray-600">
                            {program.price === 0
                              ? "Gratis"
                              : `Rp ${program.price.toLocaleString("id-ID")}`}
                          </p>
                        </div>
                        <FontAwesomeIcon
                          icon={expandedProgramId === program.id ? faChevronUp : faChevronDown}
                          className="text-indigo-600"
                        />
                      </div>
                      {expandedProgramId === program.id && (
                        <div className="p-4 bg-gray-50">
                          <div
                            className="w-full h-40 relative mb-4"
                            style={{
                              backgroundImage: `url(${imageUrl})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }}
                          >
                            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white text-center p-2">
                              <p className="text-sm">Klik untuk daftar atau lihat detail</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleProgramClick(program.id)}
                            className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
                          >
                            Lihat Detail
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500 mt-10">Tidak ada program tersedia.</p>
        )}
      </div>
    </div>
  );
}
