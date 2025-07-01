"use client";
import React, { useState, useEffect } from "react";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes, faQuestion } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

interface CustomJwtPayload extends JwtPayload {
  user: {
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

interface ExamData {
  id: number;
  title: string;
  exam_category: {
    name: string;
  };
  category: {
    name: string;
  };
  finished_attemption: AttemptionItem[];
}

export default function Riwayat({ params }: { params: { id: string } }) {
  const [name, setName] = useState("");
  const [photoProfile, setPhotoProfile] = useState("");
  const [examData, setExamData] = useState<ExamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = params;
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<CustomJwtPayload>(token);
        const user = decoded.user;
        setName(user.name);
        setPhotoProfile(user.photo_profile);
      } catch (error) {
        console.error("Invalid token:", error);
        setName("");
        setPhotoProfile("");
      }
    }
  }, []);

  useEffect(() => {
    const fetchRiwayat = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const response = await fetch(
          `https://api.taktix.co.id/student/exam/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) throw new Error("Gagal mengambil data ujian.");
        const data = await response.json();

        setExamData(data);
      } catch (error: any) {
        console.error("Failed to fetch exam data:", error);
        setError(error.message || "Gagal mengambil data ujian.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchRiwayat();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="text-2xl text-blue-600 animate-pulse">Loading...</div>
      </div>
    );
  }

  if (error || !examData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="text-red-500 text-xl">{error || "Data ujian tidak ditemukan."}</div>
      </div>
    );
  }

  return (
    <div className="mx-40 my-14">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Riwayat Pengerjaan</h1>
        {name && photoProfile && (
          <div className="flex items-center space-x-4">
            <img
              src={photoProfile}
              alt="Profile"
              className="w-12 h-12 rounded-full object-cover"
            />
            <span className="text-lg font-medium">{name}</span>
          </div>
        )}
      </div>

      <div className="my-8">
        {examData.finished_attemption.length === 0 ? (
          <p className="text-center text-gray-600">Belum ada riwayat pengerjaan yang tersedia.</p>
        ) : (
          <div>
            <h2 className="text-xl font-bold mb-4">
              Judul: {examData.title}
            </h2>
            <p className="text-gray-600">Kategori: {examData.category.name}</p>
            <p className="text-gray-600">Mata Pelajaran: {examData.exam_category.name}</p>

            {examData.finished_attemption.map((attemption, index) => (
              <Link
                key={index}
                href={`/soal/detail_riwayat/${id}/${attemption.id}`}
                className="block"
              >
                <div
                  className="border border-gray-200 rounded-lg p-4 mb-4 shadow-md bg-white hover:bg-gray-50 transition"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-700">
                        Tanggal Pengerjaan:{" "}
                        <span className="font-semibold">
                          {new Date(attemption.started_at).toLocaleDateString()}
                        </span>
                      </p>
                      <p className="text-gray-700">
                        Waktu:{" "}
                        <span className="font-semibold">
                          {new Date(attemption.started_at).toLocaleTimeString()} -{" "}
                          {new Date(attemption.finished_at).toLocaleTimeString()}
                        </span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-700">
                        Skor:{" "}
                        <span className="font-semibold">{attemption.score}%</span>
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="flex items-center space-x-2 bg-green-100 p-2 rounded-lg">
                      <FontAwesomeIcon icon={faCheck} className="text-green-600" />
                      <span className="text-gray-800 font-medium">
                        Benar: {attemption.total_correct}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 bg-red-100 p-2 rounded-lg">
                      <FontAwesomeIcon icon={faTimes} className="text-red-600" />
                      <span className="text-gray-800 font-medium">
                        Salah: {attemption.total_incorrect}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 bg-yellow-100 p-2 rounded-lg">
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
    </div>
  );
}