"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faFilter, faSort } from "@fortawesome/free-solid-svg-icons";
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
  const [sortConfig, setSortConfig] = useState<{ key: keyof Major; direction: string } | null>(null);
  const { id } = params;

  useEffect(() => {
    const fetchUniversityMajors = async (token: string) => {
      setLoading(true);
      setError(null);
      try {
        const proxyUrl = `/api/university/${id}/major`;
        console.log("Attempting request via proxy:", proxyUrl);
        const response = await axios.get(proxyUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Proxy API Response:", response.data);
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

  const handleSort = (key: keyof Major) => {
    setSortConfig((prev) => {
      if (!prev || prev.key !== key) {
        return { key, direction: "descending" };
      }
      return prev.direction === "ascending"
        ? { key, direction: "descending" }
        : { key, direction: "ascending" };
    });
  };

  const sortedMajors = majors
    .sort((a, b) => {
      if (!sortConfig) return 0;
      const valueA = a[sortConfig.key] || 0;
      const valueB = b[sortConfig.key] || 0;
      if (valueA < valueB) return sortConfig.direction === "ascending" ? -1 : 1;
      if (valueA > valueB) return sortConfig.direction === "ascending" ? 1 : -1;
      return 0;
    });

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
      className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 py-6 px-2 sm:px-4"
    >
      <div className="ml-[64px] max-w-5xl mx-auto"> {/* Tambahin ml-[64px] biar nggak overlap sidebar */}
        <div className="flex items-center mb-6">
          <button
            type="button"
            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-all duration-300 transform hover:scale-110"
            onClick={() => router.back()}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-indigo-600 text-xl" />
          </button>
          <h1 className="ml-4 text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-blue-600 animate-fade-in">
            University Major Details
          </h1>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4 flex-col sm:flex-row gap-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-indigo-800">
              Majors Available
            </h2>
            <button
              onClick={() => handleSort("passing_grade")}
              className="flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full hover:bg-indigo-200 transition-all"
            >
              <FontAwesomeIcon icon={faSort} />
              Sort by Grade
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 sm:px-4 py-2 text-left text-sm font-semibold text-gray-700">
                    Major & Level
                  </th>
                  <th className="px-2 sm:px-4 py-2 text-left text-sm font-semibold text-gray-700">
                    Accreditation
                  </th>
                  <th className="px-2 sm:px-4 py-2 text-left text-sm font-semibold text-gray-700 cursor-pointer"
                    onClick={() => handleSort("snbp_quota")}>
                    SNBP Quota <FontAwesomeIcon icon={faSort} className="ml-1 text-gray-400" />
                  </th>
                  <th className="px-2 sm:px-4 py-2 text-left text-sm font-semibold text-gray-700 cursor-pointer"
                    onClick={() => handleSort("snbp_enthusiasts")}>
                    SNBP Enthusiasts <FontAwesomeIcon icon={faSort} className="ml-1 text-gray-400" />
                  </th>
                  <th className="px-2 sm:px-4 py-2 text-left text-sm font-semibold text-gray-700 cursor-pointer"
                    onClick={() => handleSort("snbt_quota")}>
                    SNBT Quota <FontAwesomeIcon icon={faSort} className="ml-1 text-gray-400" />
                  </th>
                  <th className="px-2 sm:px-4 py-2 text-left text-sm font-semibold text-gray-700 cursor-pointer"
                    onClick={() => handleSort("snbt_enthusiasts")}>
                    SNBT Enthusiasts <FontAwesomeIcon icon={faSort} className="ml-1 text-gray-400" />
                  </th>
                  <th className="px-2 sm:px-4 py-2 text-left text-sm font-semibold text-gray-700 cursor-pointer"
                    onClick={() => handleSort("passing_grade")}>
                    Passing Grade <FontAwesomeIcon icon={faSort} className="ml-1 text-gray-400" />
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedMajors.length > 0 ? (
                  sortedMajors.map((major) => (
                    <tr key={major.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-2 sm:px-4 py-2 font-medium text-indigo-800 whitespace-nowrap">
                        {major.major} - {major.educational_level}
                      </td>
                      <td className="px-2 sm:px-4 py-2 text-gray-600 whitespace-nowrap">
                        {major.accreditation}
                      </td>
                      <td className="px-2 sm:px-4 py-2 text-gray-600 whitespace-nowrap">
                        {major.snbp_quota.toLocaleString()}
                      </td>
                      <td className="px-2 sm:px-4 py-2 text-gray-600 whitespace-nowrap">
                        {major.snbp_enthusiasts.toLocaleString()}
                      </td>
                      <td className="px-2 sm:px-4 py-2 text-gray-600 whitespace-nowrap">
                        {major.snbt_quota.toLocaleString()}
                      </td>
                      <td className="px-2 sm:px-4 py-2 text-gray-600 whitespace-nowrap">
                        {major.snbt_enthusiasts.toLocaleString()}
                      </td>
                      <td className="px-2 sm:px-4 py-2 text-gray-600 whitespace-nowrap">
                        {major.passing_grade}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-2 text-center text-gray-500">
                      Tidak ada data jurusan tersedia.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}