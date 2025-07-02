"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

interface Major {
  id: string;
  major: string;
  educational_level: string;
  snbp_quota: number;
  snbp_enthusiasts: number;
  snbt_quota: number;
  snbt_enthusiasts: number;
  accreditation: string;
  passing_grade: number;
}

interface UniversityDetailProps {
  params: {
    id: string;
  };
}

export default function UniversityDetail({ params }: UniversityDetailProps) {
  const router = useRouter();
  const [majors, setMajors] = useState<Major[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = params;

  useEffect(() => {
    const fetchUniversityMajors = async (token: string) => {
      setLoading(true);
      setError(null);
      try {
        const proxyUrl = `/api/university/${id}/major`;
        console.log("Attempting request via proxy:", proxyUrl); // Log URL proxy
        const response = await axios.get(proxyUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Proxy API Response:", response.data); // Log respons via proxy
        setMajors(response.data.data.majors || []);
      } catch (error) {
        console.error("Error with proxy request:", error);
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          setError("Universitas atau jurusan tidak ditemukan. Periksa ID atau status API.");
        } else {
          setError("Gagal memuat data jurusan universitas.");
        }
      } finally {
        setLoading(false);
      }
    };

    const token = localStorage.getItem("token");
    if (token && id) {
      fetchUniversityMajors(token);
    } else {
      setError("Token atau ID universitas tidak valid.");
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-2xl text-indigo-600 animate-pulse">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10 px-4 sm:px-6 lg:px-8"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <button
            type="button"
            className="text-gray-600 hover:text-gray-800 transition-colors"
            onClick={() => router.back()}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-xl" />
          </button>
          <h1 className="ml-4 text-3xl font-bold text-gray-800">Detail Universitas</h1>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-300 max-w-3xl mx-auto mt-6 shadow-lg">
          <table className="min-w-full divide-y divide-gray-300 bg-white text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Jurusan
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Detail
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {majors.length > 0 ? (
                majors.map((major) => (
                  <tr key={major.id} className="hover:bg-gray-50 transition-colors">
                    <td className="whitespace-nowrap px-4 py-4 font-medium text-base text-black">
                      {major.major} - {major.educational_level}
                    </td>
                    <td className="px-4 py-4 text-base text-neutral-600">
                      <div>Akreditasi: {major.accreditation}</div>
                      <div>
                        SNBT: Kuota {major.snbt_quota}, Peminat {major.snbt_enthusiasts}
                      </div>
                      <div>
                        SNBP: Kuota {major.snbp_quota}, Peminat {major.snbp_enthusiasts}
                      </div>
                      <div>Passing Grade: {major.passing_grade}</div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="px-4 py-4 text-center text-gray-500">
                    Tidak ada data jurusan tersedia.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}