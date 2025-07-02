"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons/faArrowLeft";
import { useRouter } from "next/navigation";

export default function UTBK() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/soal?category_id=3`);
        if (!response.ok) throw new Error("Failed to fetch exams");
        const data = await response.json();
        console.log("UTBK response:", data);
        setExams(data.data || []);
      } catch (error) {
        console.error("Error fetching exams:", error);
        setError("Gagal mengambil data ujian. Cek backend atau koneksi.");
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="mx-40 my-14">
      <div className="flex items-center">
        <button type="button" className="mt-1" onClick={() => router.back()}>
          <FontAwesomeIcon icon={faArrowLeft} className="size-5 opacity-75" />
        </button>
        <h1 className="ml-4 my-2">UTBK</h1>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="h-6 w-2 rounded-lg bg-yellow-300"></div>
          <h1 className="ml-4 my-2">Latihan Ujian UTBK</h1>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 text-xs font-medium text-black mt-4 max-md:flex-wrap">
        {exams.length > 0 ? (
          exams.map((exam: any) => (
            <div
              key={exam.id}
              className="flex flex-col flex-1 px-5 py-3 bg-white rounded-3xl border border-solid border-zinc-500"
              style={{ minHeight: "100px" }}
            >
              <div className="flex gap-2.5 text-base whitespace-normal break-words">
                <div className="flex items-center">
                  <div className="h-6 w-2 rounded-lg bg-yellow-300"></div>
                  <h1 className="ml-2 my-2">{exam.title}</h1>
                </div>
              </div>
              <div className="self-start mt-1.5 ml-3 text-neutral-500 max-md:ml-2.5">
                Kategori: {exam.category?.name || exam.exam_category?.name || "Tidak ada kategori"}
              </div>
              <div className="flex gap-5 justify-between mt-auto">
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
          ))
        ) : (
          <p className="text-center">Tidak ada ujian tersedia.</p>
        )}
      </div>
    </div>
  );
}