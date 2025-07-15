"use client";
import React, { useState, useEffect } from "react";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes, faQuestion } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

interface CustomJwtPayload extends JwtPayload {
  user: {
    id: string;
    name: string;
    photo_profile: string;
  };
}

interface AttemptionItem {
  id: number;
  started_at: string;
  finished_at: string;
  total_correct: number;
  total_incorrect: number;
  total_empty: number;
  score: number;
}

interface ExamItem {
  id: number;
  title: string;
  exam_category: {
    name: string;
  };
  category: {
    name: string;
  };
  finished_attemption?: AttemptionItem[];
}

interface PaginationResponse {
  data: ExamItem[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export default function Riwayat({ params }: { params: { id?: string } }) {
  const [name, setName] = useState("");
  const [photoProfile, setPhotoProfile] = useState("");
  const [examData, setExamData] = useState<ExamItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<CustomJwtPayload>(token);
        const user = decoded.user;
        setName(user.name);
        setPhotoProfile(user.photo_profile);
        fetchRiwayat();
      } catch (error) {
        console.error("Invalid token:", error);
        setName("");
        setPhotoProfile("");
      }
    }
  }, []);

  const fetchRiwayat = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await fetch(
        `https://api.taktix.co.id/student/exam-pagination?page=1&per_page=20`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error("Gagal mengambil data ujian.");
      const data: PaginationResponse = await response.json();
      console.log("Fetched exam data:", data.data); // Debug data
      setExamData(data.data); // Ambil array exam
    } catch (error: any) {
      console.error("Failed to fetch exam data:", error);
      setError(error.message || "Gagal mengambil data ujian.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="text-2xl text-blue-600 animate-pulse">Loading...</div>
      </div>
    );
  }

  if (error || !examData.length) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="text-red-500 text-xl">{error || "Tidak ada data ujian."}</div>
      </div>
    );
  }

  return (
    <div className="ml-[64px] max-w-6xl mx-auto my-14"> {/* Tambahin ml-[64px] biar nggak overlap sidebar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800">Riwayat Pengerjaan</h1>
        {name && photoProfile && (
          <div className="flex items-center space-x-4">
            <img
              src={photoProfile}
              alt="Profile"
              className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
            />
            <span className="text-lg font-medium text-gray-700">{name}</span>
          </div>
        )}
      </div>

      <div className="my-8">
        {examData.length === 0 ? (
          <div className="text-center text-gray-500 bg-white p-6 rounded-lg shadow-md">
            Belum ada riwayat pengerjaan yang tersedia.
          </div>
        ) : (
          examData.map((exam, examIndex) => (
            <div key={examIndex} className="mb-6">
              <div className="bg-gradient-to-r from-blue-100 to-white p-4 rounded-t-lg shadow-md">
                <h2 className="text-xl font-bold text-blue-800">Judul: {exam.title}</h2>
                <div className="flex space-x-4 text-gray-600 mt-2">
                  <span>Kategori: {exam.category.name}</span>
                  <span>Mata Pelajaran: {exam.exam_category.name}</span>
                </div>
              </div>
              {exam.finished_attemption && exam.finished_attemption.length === 0 ? (
                <div className="text-center text-gray-500 bg-white p-4 rounded-b-lg shadow-md">
                  Belum ada riwayat pengerjaan untuk ujian ini.
                </div>
              ) : (
                <div className="space-y-4">
                  {(exam.finished_attemption || []).map((attemption, attIndex) => (
                    <Link
                      key={attIndex}
                      href={`/soal/${exam.id}`} // Redirect ke /soal/[exam.id]
                      className="block cursor-pointer hover:bg-gray-50 transition"
                      onClick={(e) => {
                        if (!exam.id) {
                          e.preventDefault();
                          console.error("Exam ID is undefined for exam:", exam);
                        }
                      }}
                    >
                      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-gray-700">
                              Tanggal Pengerjaan:{" "}
                              <span className="font-semibold text-blue-600">
                                {new Date(attemption.started_at).toLocaleDateString()}
                              </span>
                            </p>
                            <p className="text-gray-700">
                              Waktu:{" "}
                              <span className="font-semibold text-blue-600">
                                {new Date(attemption.started_at).toLocaleTimeString()} -{" "}
                                {new Date(attemption.finished_at).toLocaleTimeString()}
                              </span>
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-gray-700">
                              Skor:{" "}
                              <span className="font-semibold text-green-600">
                                {attemption.score}%
                              </span>
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mt-4">
                          <div className="flex items-center space-x-2 bg-green-50 p-2 rounded-lg">
                            <FontAwesomeIcon icon={faCheck} className="text-green-600" />
                            <span className="text-gray-800 font-medium">
                              Benar: {attemption.total_correct}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 bg-red-50 p-2 rounded-lg">
                            <FontAwesomeIcon icon={faTimes} className="text-red-600" />
                            <span className="text-gray-800 font-medium">
                              Salah: {attemption.total_incorrect}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 bg-yellow-50 p-2 rounded-lg">
                            <FontAwesomeIcon icon={faQuestion} className="text-yellow-600" />
                            <span className="text-gray-800 font-medium">
                              Kosong: {attemption.total_empty}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}