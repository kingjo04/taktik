"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

export default function CPNS() {
  const [name, setName] = useState("");
  const [photoProfile, setPhotoProfile] = useState("");
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        const user = decoded.user;
        setName(user.name);
        setPhotoProfile(user.photo_profile);

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
      setLoading(true);
      const response = await fetch(
        "https://api.taktix.co.id/exam?page=1&per_page=20&category_id=4002&title=&is_public=true",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch exams");
      }

      const data = await response.json();
      console.log("Fetched exams:", data.data); // Debug data
      setExams(data.data); // Set exams data to state
    } catch (error) {
      console.error("Error fetching exams:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="text-2xl text-blue-600 animate-pulse">Memuat Ujian CPNS...</div>
      </div>
    );
  }

  if (!exams.length) {
    return (
      <div className="mx-40 my-14">
        <div className="flex items-center">
          <button type="button" className="mt-1" onClick={() => router.back()}>
            <FontAwesomeIcon icon={faArrowLeft} className="size-5 opacity-75" />
          </button>
          <h1 className="ml-4 my-2">CPNS</h1>
        </div>
        <p className="text-center text-gray-500 mt-10">Tidak ada ujian tersedia.</p>
      </div>
    );
  }

  return (
    <div className="mx-40 my-14">
      <div className="flex items-center">
        <button
          type="button"
          className="mt-1 p-2 bg-blue-100 rounded-full hover:bg-blue-200 transition"
          onClick={() => router.back()}
        >
          <FontAwesomeIcon icon={faArrowLeft} className="size-5 text-blue-600" />
        </button>
        <h1 className="ml-4 my-2 text-3xl font-bold text-gray-800">CPNS</h1>
      </div>

      <div className="flex items-center justify-between mt-6">
        <div className="flex items-center">
          <div className="h-6 w-2 rounded-lg bg-yellow-300"></div>
          <h2 className="ml-4 text-xl font-semibold text-gray-700">Latihan Ujian CPNS</h2>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {exams.map((exam: any) => (
          <div
            key={exam.id}
            className="flex flex-col p-5 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200"
          >
            <div className="flex gap-2.5 text-base whitespace-normal break-words">
              <div className="flex items-center">
                <div className="h-6 w-2 rounded-lg bg-yellow-300"></div>
                <h3 className="ml-2 text-lg font-semibold text-gray-800">{exam.title}</h3>
              </div>
            </div>
            <p className="mt-2 text-gray-600 text-sm">
              Kategori: {exam.category.name}
            </p>
            <div className="mt-auto flex justify-between items-end">
              <p className="text-gray-500 text-sm">
                {exam.total_question} Soal, {exam.duration} Menit
              </p>
              <Link
                href={`/soal/${exam.id}`}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                Gratis
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
