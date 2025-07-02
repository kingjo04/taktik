"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons/faArrowLeft";
import { useRouter } from "next/navigation";

export default function CPNS() {
  const [name, setName] = useState("");
  const [photoProfile, setPhotoProfile] = useState("");
  const [exams, setExams] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        const user = decoded.user;
        setName(user.name);
        setPhotoProfile(user.photo_profile);

        // Fetch exams after getting the token
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
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/soal?category_id=1`,
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
      setExams(data.data); // Set exams data to state
    } catch (error) {
      console.error("Error fetching exams:", error);
    }
  };

  return (
    <div className="mx-40 my-14">
      <div className="flex items-center">
        <button type="button" className="mt-1" onClick={() => router.back()}>
          <FontAwesomeIcon icon={faArrowLeft} className="size-5 opacity-75" />
        </button>
        <h1 className="ml-4 my-2">CPNS</h1>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center">
          <div className="h-6 w-2 rounded-lg bg-yellow-300"></div>
          <h1 className="ml-4 my-2">Latihan Ujian CPNS</h1>
        </div>
      </div>

      {/* Main item start */}
      <div className="grid grid-cols-4 gap-4 text-xs font-medium text-black mt-4 max-md:flex-wrap">
        {exams.map((exam: any) => (
          <div
            key={exam.id}
            className="flex flex-col flex-1 px-5 py-3 bg-white rounded-3xl border border-solid border-zinc-500"
            style={{ minHeight: "100px" }} // Menyediakan tinggi minimum yang konsisten
          >
            {/* Heading and Title */}
            <div className="flex gap-2.5 text-base whitespace-normal break-words">
              <div className="flex items-center">
                <div className="h-6 w-2 rounded-lg bg-yellow-300"></div>
                <h1 className="ml-2 my-2">{exam.title}</h1>
              </div>
            </div>

            {/* Category Info */}
            <div className="self-start mt-1.5 ml-3 text-neutral-500 max-md:ml-2.5">
              Kategori: {exam.category.name}
            </div>

            {/* Footer (Question Count, Duration, and Link) */}
            <div className="flex gap-5 justify-between mt-auto">
              {" "}
              {/* mt-auto forces the footer to stick at the bottom */}
              <div className="gap-0 my-auto text-neutral-400">
                {exam.total_question} Soal {exam.duration} Menit
              </div>
              <Link
                href={`/soal/${exam.id}`}
                className="justify-center px-3.5 py-2 bg-green-400 text-white rounded"
              >
                Gratis
              </Link>
            </div>
          </div>
        ))}
      </div>
      {/* Main item finish */}
    </div>
  );
}
