"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons/faArrowLeft";
import { useRouter } from "next/navigation";

interface University {
  id: string;
  name: string;
  for_free: boolean;
  created_at: string;
  updated_at: string;
}

interface UniversityResponse {
  status: number;
  message: string;
  errors: any;
  data: {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
    universities: University[];
  };
}

interface UniversityDetailProps {
  params: {
    id: string;
  };
}

export default function UniversityDetail({ params }: UniversityDetailProps) {
  const router = useRouter();
  const [universities, setUniversities] = useState<University[]>([]);
  const { id } = params;

  useEffect(() => {
    const fetchUniversityData = async (token: string) => {
      try {
        const response = await axios.get(
          "http://api.program.taktix.co.id/university?page=1&pageSize=5",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // Set data universities dari respons
        setUniversities(response.data.data.universities || []);
      } catch (error) {
        console.error("Error fetching university data:", error);
      }
    };

    // Ambil token dari localStorage (atau ganti dengan token dari web asli)
    const token = localStorage.getItem("token");
    if (token) {
      fetchUniversityData(token);
    } else {
      console.warn("No token found, please login or set token manually.");
      // Untuk pengujian, hardcode token dari web asli di sini sementara
      // const manualToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
      // fetchUniversityData(manualToken);
    }
  }, []);

  return (
    <div className="mx-40 my-14">
      <div className="flex items-center">
        <button type="button" className="mt-1" onClick={() => router.back()}>
          <FontAwesomeIcon icon={faArrowLeft} className="size-5 opacity-75" />
        </button>
        <h1 className="ml-4 my-2">Daftar Universitas</h1>
      </div>

      <div className="overflow-x-auto rounded-lg border border-solid black max-w-[682px] mx-auto mt-4">
        <table className="min-w-full divide-y-2 divide-black bg-white text-sm">
          <tbody className="divide-y divide-black">
            {universities.map((university) => (
              <tr key={university.id}>
                <td className="whitespace-nowrap px-4 py-4 font-medium">
                  <div className="text-base text-black">
                    {university.name}
                    {university.for_free ? " (Gratis)" : ""}
                  </div>
                  <div className="mt-1.5 text-base text-neutral-500">
                    ID: {university.id}
                    <br />
                    Dibuat: {new Date(university.created_at).toLocaleDateString()}
                    <br />
                    Diperbarui:{" "}
                    {new Date(university.updated_at).toLocaleDateString()}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}