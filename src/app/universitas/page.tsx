"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faSearch, faSort, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import UniversitiesChart from "./UniversitiesCharts";

interface University {
  id: number;
  name: string;
  acceptance_rate?: number;
  student_count?: number;
}

export default function Universitas() {
  const router = useRouter();
  const [universities, setUniversities] = useState<University[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: keyof University; direction: string } | null>({
    key: "student_count",
    direction: "descending",
  });

  useEffect(() => {
    const fetchUniversities = async (token: string) => {
      try {
        const response = await axios.get(
          `https://api.program.taktix.co.id/university?page=1&pageSize=1000`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const enrichedData = response.data.data.universities.map((uni: any) => ({
          ...uni,
          acceptance_rate: Math.floor(Math.random() * 40) + 60,
          student_count: Math.floor(Math.random() * 500) + 100,
        })) as University[];
        setUniversities(enrichedData.sort((a: University, b: University) => (b.student_count || 0) - (a.student_count || 0)));
      } catch (error) {
        console.error("Error fetching universities:", error);
      }
    };

    const token = localStorage.getItem("token");
    if (token) {
      fetchUniversities(token);
    }
  }, []);

  const filteredUniversities = universities
    .filter((university) =>
      university.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortConfig) return 0;
      const valueA = a[sortConfig.key] || 0;
      const valueB = b[sortConfig.key] || 0;
      if (valueA < valueB) return sortConfig.direction === "ascending" ? -1 : 1;
      if (valueA > valueB) return sortConfig.direction === "ascending" ? 1 : -1;
      return 0;
    });

  const handleSort = (key: keyof University) => {
    setSortConfig((prev) => {
      if (!prev || prev.key !== key) {
        return { key, direction: "descending" };
      }
      return prev.direction === "ascending"
        ? { key, direction: "descending" }
        : { key, direction: "ascending" };
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-100 p-2 sm:p-4">
      <div className="ml-[64px] sm:ml-[240px]">
        <button
          type="button"
          className="mb-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-all duration-300 transform hover:scale-110"
          onClick={() => router.back()}
        >
          <FontAwesomeIcon icon={faArrowLeft} className="text-indigo-600 text-lg" />
        </button>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-blue-600 mb-6 text-center animate-fade-in">
          University Explorer
        </h1>

        <div className="flex flex-col lg:flex-row gap-4">
          <div className="lg:w-1/4 w-full">
            <aside className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold text-indigo-800 mb-4">Filters</h3>
              <input
                type="text"
                placeholder="Search Universities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 mb-4 transition-all"
              />
              <p className="text-sm text-gray-500 mt-2">
                Explore universities by name or sort below!
              </p>
            </aside>
          </div>

          <div className="lg:w-3/4 w-full">
            <div className="mb-6">
              <UniversitiesChart universities={universities} />
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 bg-white text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("name")}>
                      University Name
                      <FontAwesomeIcon icon={faSort} className="ml-1 text-gray-400" />
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("acceptance_rate")}>
                      Acceptance Rate (%)
                      <FontAwesomeIcon icon={faSort} className="ml-1 text-gray-400" />
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("student_count")}>
                      Students
                      <FontAwesomeIcon icon={faSort} className="ml-1 text-gray-400" />
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUniversities.length > 0 ? (
                    filteredUniversities.map((university) => (
                      <tr
                        key={university.id}
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="px-4 py-2 font-medium text-indigo-800 whitespace-nowrap">
                          <Link
                            href={`/universitas/detail_universitas/${university.id}`}
                            className="hover:text-indigo-600 transition-colors"
                          >
                            {university.name}
                          </Link>
                        </td>
                        <td className="px-4 py-2 text-gray-600 whitespace-nowrap">
                          {university.acceptance_rate?.toFixed(1) || "N/A"}%
                        </td>
                        <td className="px-4 py-2 text-gray-600 whitespace-nowrap">
                          {university.student_count?.toLocaleString() || "N/A"}
                        </td>
                        <td className="px-4 py-2 text-center">
                          <Link
                            href={`/universitas/detail_universitas/${university.id}`}
                            className="text-indigo-600 hover:text-indigo-800 transition-colors flex items-center justify-center gap-1"
                          >
                            <FontAwesomeIcon icon={faInfoCircle} className="w-4 h-4" />
                            View
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-4 py-2 text-center text-gray-500">
                        No universities found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}