"use client";
import React, { useState, useEffect } from "react";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { useRouter } from "next/navigation";

interface CustomJwtPayload extends JwtPayload {
  user: {
    id: string; // Pastikan ada user_id di dalam token
    name: string;
    photo_profile: string;
  };
}

interface RiwayatItem {
  user_id: string; // Tambahkan user_id agar bisa dicocokkan
  soal: {
    id: number;
    title: string;
  };
  created_at: Date;
  score: number;
  answers: string;
}

export default function Riwayat({ params }: { params: { id: string } }) {
  const [name, setName] = useState("");
  const [photoProfile, setPhotoProfile] = useState("");
  const [riwayat, setRiwayat] = useState<RiwayatItem[]>([]);
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

        // Panggil API setelah mendapatkan user_id
        fetchRiwayat(user.id);
      } catch (error) {
        console.error("Invalid token:", error);
        setName("");
        setPhotoProfile("");
      }
    }
  }, []);

  const fetchRiwayat = async (userId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/historyall`);
      const data: RiwayatItem[] = await response.json();

      // Filter data sesuai dengan user_id dari token
      const filteredData = data.filter((item) => item.user_id === userId);
      setRiwayat(filteredData);
    } catch (error) {
      console.error("Failed to fetch riwayat:", error);
    }
  };

  return (
    <div>
      <div className="mx-40 my-14">
        <div className="flex items-center justify-between">
          <h1>Riwayat</h1>
        </div>

        <div className="my-8">
          {riwayat.length === 0 ? (
            <p>Belum ada riwayat yang tersedia.</p>
          ) : (
            <div>
              {riwayat.map((item, index) => (
                <div key={index} className="border-b py-4">
                  {/* Judul untuk setiap item */}
                  <h2 className="text-xl font-bold mb-2">
                    Judul: {item.soal.title || "Tidak Ada Judul"}
                  </h2>

                  <p>
                    Tanggal: {new Date(item.created_at).toLocaleDateString()}
                  </p>
                  <p>Nilai: {item.score}</p>

                  {/* Format Jawaban */}
                  <div className="mt-2">
                    <h3 className="font-semibold">Jawaban:</h3>
                    <ul className="list-disc pl-6">
                      {JSON.parse(item.answers).map(
                        (
                          answer: { question_id: number; chosen: string },
                          i: number
                        ) => (
                          <li key={i}>
                            <span>Pertanyaan {answer.question_id}: </span>
                            <span className="font-medium">{answer.chosen}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
