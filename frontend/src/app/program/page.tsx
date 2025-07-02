"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

interface Program {
  id: string;
  name: string;
  price: number;
  image_banner: string;
}

export default function Program() {
  const router = useRouter();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrograms = async (token: string) => {
      try {
        setLoading(true);
        const response = await axios.get(`https://taktix.live/programs`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response);
        setPrograms(response.data.data.programs);
      } catch (error) {
        console.error("Error fetching programs:", error);
      } finally {
        setLoading(false);
      }
    };

    const token = localStorage.getItem("token");
    if (token) {
      fetchPrograms(token);
    }
  }, []);

  // Daftar gambar tema pendidikan untuk setiap item (diulang jika kurang)
  const educationImages = [
    "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Kelas belajar
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Buku dan pena
    "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Graduasi
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2089&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Perpustakaan
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="text-2xl text-blue-600 animate-pulse">Memuat Program...</div>
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
        <h1 className="ml-4 my-2 text-3xl font-bold text-gray-800">Program</h1>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.length > 0 ? (
          programs.map((program, index) => {
            const imageUrl = educationImages[index % educationImages.length];
            return (
              <a
                key={program.id}
                href={`/program/programDetail/${program.id}`}
                className="block rounded-xl overflow-hidden min-h-[300px] cursor-pointer bg-white shadow-md hover:shadow-lg transition-shadow"
              >
                <div
                  className="w-full h-48 relative"
                  style={{
                    backgroundImage: `url(${imageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white text-center p-4">
                    <div>
                      <h2 className="text-2xl font-bold">{program.name}</h2>
                      <p className="text-lg mt-2">
                        {program.price === 0 ? "Gratis" : `Rp ${program.price.toLocaleString("id-ID")}`}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-gray-600 text-sm">
                    Klik untuk detail program
                  </p>
                </div>
              </a>
            );
          })
        ) : (
          <p className="text-center text-gray-500 mt-10">Tidak ada program tersedia.</p>
        )}
      </div>
    </div>
  );
}