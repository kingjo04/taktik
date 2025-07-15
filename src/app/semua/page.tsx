"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

// Define the exam interface based on API response structure
interface Exam {
  id: number;
  title: string;
  category: { name: string };
  total_question: number;
  duration: number;
  is_free: boolean;
}

export default function SemuaSoal() {
  const [name, setName] = useState("");
  const [photoProfile, setPhotoProfile] = useState("");
  const [exams, setExams] = useState<Exam[]>([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        const user = decoded.user;
        setName(user.name);
        setPhotoProfile(user.photo_profile || "");

        // Fetch exams from three category-based endpoints
        fetchExams(token);
      } catch (error) {
        console.error("Invalid token:", error);
        setName("");
        setPhotoProfile("");
      }
    }
  }, []);

  const fetchExams = async (token: string) => {
    try {
      const categoryIds = [4001, 4002, 4003];
      const requests = categoryIds.map((categoryId) =>
        axios.get(`https://api.taktix.co.id/exam?page=1&per_page=20&category_id=${categoryId}&title=&is_public=true`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
      );

      const responses = await Promise.all(requests);

      // Combine data from all category endpoints, avoiding duplicates by id
      const allExams = responses.flatMap((response) => response.data.data || []);
      const uniqueExams = allExams.filter((exam: Exam, index: number, self: Exam[]) =>
        index === self.findIndex((e: Exam) => e.id === exam.id)
      );
      setExams(uniqueExams);
    } catch (error) {
      console.error("Error fetching exams:", error);
      if (axios.isAxiosError(error) && error.response) {
        console.error("API Error:", error.response.status, error.response.data);
      }
    }
  };

  return (
    <div className="flex">
      <main className="flex-1 min-h-screen bg-gradient-to-br from-blue-50 to-white p-4 sm:p-6 lg:p-8 ml-16">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button
              type="button"
              className="mr-4 p-2 bg-blue-100 rounded-full hover:bg-blue-200 transition"
              onClick={() => router.back()}
            >
              <FontAwesomeIcon icon={faArrowLeft} className="text-blue-600 size-5" />
            </button>
            <div className="flex items-center">
              <div className="h-3 w-1.5 bg-yellow-400 rounded-full animate-pulse"></div>
              <h1 className="ml-3 text-xl sm:text-2xl font-bold text-blue-800">Seluruh Latihan Ujian</h1>
            </div>
          </div>
          {name && (
            <div className="flex items-center gap-2">
              {photoProfile && (
                <img
                  src={photoProfile}
                  alt="Profile"
                  className="h-8 w-8 rounded-full object-cover border-2 border-yellow-400"
                />
              )}
            </div>
          )}
        </div>

        {/* Main Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam: Exam) => (
            <div
              key={exam.id}
              className="flex flex-col p-5 bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              style={{ minHeight: "150px" }}
            >
              {/* Heading and Title */}
              <div className="flex items-center gap-2 text-base font-semibold text-gray-800">
                <div className="h-4 w-2 bg-yellow-400 rounded-full"></div>
                <h2 className="ml-2 break-words">{exam.title}</h2>
              </div>

              {/* Category Info */}
              <p className="mt-2 text-sm text-gray-500">Kategori: {exam.category.name}</p>

              {/* Footer (Question Count, Duration, and Link) */}
              <div className="mt-auto flex items-center justify-between text-sm mt-4">
                <span className="text-gray-400">
                  {exam.total_question} Soal • {exam.duration} Menit
                </span>
                <Link
                  href={`/soal/${exam.id}`}
                  className={`px-4 py-2 rounded-full font-medium transition-colors ${
                    exam.is_free
                      ? "bg-green-400 text-white hover:bg-green-500"
                      : "bg-blue-400 text-white hover:bg-blue-500"
                  }`}
                >
                  {exam.is_free ? "Gratis" : "Mulai"}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}