
"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import axios from "axios";

interface Agenda {
  id: string;
  program_id: string;
  agenda: string;
  start_date: string;
  end_date: string;
  description: number;
}

export default function Agenda() {
  const router = useRouter();
  const { id } = useParams();
  const [agenda, setAgenda] = useState<Agenda[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgendaDetail = async (token: string) => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://taktix.live/programs/${id}/agenda`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data.data);
        setAgenda(response.data.data);
      } catch (error) {
        console.error("Error fetching program detail:", error);
      } finally {
        setLoading(false);
      }
    };

    const token = localStorage.getItem("token");
    if (token && id) {
      fetchAgendaDetail(token);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="text-2xl text-blue-600 animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!agenda.length) {
    return (
      <div className="mx-40 my-14">
        <div className="flex items-center">
          <button type="button" className="mt-1" onClick={() => router.back()}>
            <FontAwesomeIcon icon={faArrowLeft} className="size-5 opacity-75" />
          </button>
          <h1 className="ml-4 my-2">Agenda</h1>
        </div>
        <p className="text-center text-gray-500 mt-10">Tidak ada agenda tersedia.</p>
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
        <h1 className="ml-4 my-2 text-3xl font-bold text-gray-800">Agenda</h1>
      </div>

      <div className="mt-8 grid gap-6">
        {agenda.map((item) => (
          <div
            key={item.id}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-200 cursor-pointer"
          >
            <h2 className="text-2xl font-semibold text-blue-700 mb-2">{item.agenda}</h2>
            <p className="text-gray-600 mb-4">
              <span className="font-medium">Tanggal:</span>{" "}
              {new Date(item.start_date).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}{" "}
              -{" "}
              {new Date(item.end_date).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <p className="text-gray-700 mb-4">
              <span className="font-medium">Deskripsi:</span>{" "}
              {item.description} sesi latihan
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>
                Mulai:{" "}
                <span className="font-semibold text-blue-600">
                  {new Date(item.start_date).toLocaleDateString("id-ID")}
                </span>{" "}
                (30 soal, 30 menit)
              </li>
              <li>
                Selesai:{" "}
                <span className="font-semibold text-blue-600">
                  {new Date(item.end_date).toLocaleDateString("id-ID")}
                </span>{" "}
                (30 soal, 30 menit)
              </li>
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}