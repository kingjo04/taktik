"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

interface Materi {
  id: number;
  title: string;
  youtubeLink: string;
}

export default function Materi() {
  const router = useRouter();
  const [materiList, setMateriList] = useState<Materi[]>([]);
  const { id } = useParams(); // Ganti dengan programId yang sesuai

  useEffect(() => {
    const fetchMateri = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/materi/${id}`
        );
        const data = await response.json();
        console.log(data);
        if (data.success) {
          setMateriList(data.data);
        } else {
          console.error("Gagal mengambil data");
        }
      } catch (error) {
        console.error("Error fetching materi:", error);
      }
    };

    fetchMateri();
  }, []);

  return (
    <div>
      <div className="mx-40 my-14">
        <div className="flex items-center">
          <button type="button" className="mt-1" onClick={() => router.back()}>
            <FontAwesomeIcon icon={faArrowLeft} className="size-5 opacity-75" />
          </button>
          <h1 className="ml-4 my-2">Materi</h1>
        </div>
      </div>

      <div className="flex justify-center items-center mt-4 mb-2">
        <div className="flex flex-col text-base rounded-none max-w-[738px] w-full">
          {materiList.length > 0 ? (
            materiList.map((materi, index) => (
              <div key={materi.id} className="mb-4">
                <div className="px-5 py-3 w-full font-semibold text-white bg-blue-700 rounded-2xl">
                  {index + 1}. {materi.title}
                </div>
                <Link href={materi.youtubeLink || "#"} target="_blank">
                  <div className="self-center px-4 py-3 mt-3.5 max-w-full text-black bg-white rounded-2xl border border-solid border-neutral-400 w-[627px] cursor-pointer hover:bg-gray-200">
                    {/* {materi.deskripsi} */} Link Pembelajaran
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <p className="text-center">Memuat materi...</p>
          )}
        </div>
      </div>
    </div>
  );
}
