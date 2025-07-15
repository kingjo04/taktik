"use client";
import React, { useState, useEffect } from "react";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { useRouter } from "next/navigation";

interface CustomJwtPayload extends JwtPayload {
  user: {
    name: string;
    photo_profile: string;
  };
}

interface RiwayatItem {
  soal: {
    id: number;
    title: string;
  };
  created_at: Date;
  score: number;
  answers: string;
}

export default function ProgramRiwayat({ params }: { params: { id: string } }) {
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
        const response = await fetch(
          `https://taktix.live/programs/historya/${id}`
        );
        const data = await response.json();
        setRiwayat(data);
      } catch (error) {
        console.error("Failed to fetch riwayat:", error);
      }
    };

    fetchRiwayat();
  }, []);

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
              {/* Ambil Judul dari Soal */}
              <h2 className="text-xl font-bold mb-4">
                Judul: {riwayat[0]?.soal.title || "Tidak Ada Judul"}
              </h2>

              {riwayat.map((item, index) => (
                <div key={index} className="border-b py-4">
                  <p>Tanggal: {new Date(item.created_at).toLocaleDateString()}</p>
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
