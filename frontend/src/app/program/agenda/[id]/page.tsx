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

  useEffect(() => {
    const fetchAgendaDetail = async (token: string) => {
      try {
        const response = await axios.get(
          // `https://web-production-d612.up.railway.app/http://api.program.taktix.co.id/program/${id}/agenda`,
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
      }
    };

    const token = localStorage.getItem("token");
    if (token && id) {
      fetchAgendaDetail(token);
    }
  }, [id]);

  if (!agenda.length) return <p>Loading...</p>;

  return (
    <div>
      <div className="mx-40 my-14">
        <div className="flex items-center ">
          <button type="button" className="mt-1" onClick={() => router.back()}>
            <FontAwesomeIcon icon={faArrowLeft} className="size-5 opacity-75" />
          </button>
          <h1 className="ml-4 my-2">Agenda</h1>
        </div>

        <div className="text-left mt-4">
          {agenda.map((agenda) => (
            <div key={agenda.id}>
              <h2 className="text-xl font-semibold">{agenda.agenda}</h2>
              <p className="text-lg">16-17 September 2023</p>
              <p className="font-semibold">
                Latihan soal UTBK dengan full sistem dengan materi meliputi:
              </p>
              <ul className="list-disc ml-5 mt-3 mb-4">
                <li>
                  <span className="font-semibold">
                    {new Date(agenda.start_date).toLocaleDateString("id-ID")}
                  </span>{" "}
                  (30 soal waktu 30 menit)
                </li>
                <li>
                  <span className="font-semibold">
                    {new Date(agenda.end_date).toLocaleDateString("id-ID")}
                  </span>{" "}
                  (30 soal waktu 30 menit)
                </li>
                <li>
                  <span className="font-semibold">{agenda.description}</span>
                </li>
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
