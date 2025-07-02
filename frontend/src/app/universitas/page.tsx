"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import UniversitiesChart from "./UniversitiesCharts";

interface University {
  id: number;
  name: string;
}

export default function Universitas() {
  const router = useRouter();
  const [universities, setUniversities] = useState<University[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

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
        setUniversities(response.data.data.universities);
        // console.log(response.data);
      } catch (error) {
        console.error("Error fetching universities:", error);
      }
    };

    const token = localStorage.getItem("token");
    if (token) {
      fetchUniversities(token);
    }
  }, []);

  const filteredUniversities = universities.filter((university) =>
    university.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mx-40 my-14">
      <div className="flex items-center">
        <button type="button" className="mt-1" onClick={() => router.back()}>
          <FontAwesomeIcon icon={faArrowLeft} className="size-5 opacity-75" />
        </button>
        <h1 className="ml-4 my-2">Universitas</h1>
      </div>

      <form className="max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="default-search" className="sr-only">
          Search
        </label>
        <div className="relative">
          <input
            type="search"
            id="default-search"
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Cari Universitas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setSearchTerm(searchTerm)}
            className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 rounded-lg text-sm px-4 py-2"
          >
            Search
          </button>
        </div>
      </form>

      <div>
        <UniversitiesChart />
      </div>

      <div className="overflow-x-auto rounded-lg border max-w-[682px] mx-auto mt-4">
        <table className="min-w-full divide-y divide-black bg-white text-sm">
          <tbody className="divide-y divide-black">
            {filteredUniversities.length > 0 ? (
              filteredUniversities.map((university) => (
                <tr key={university.id}>
                  <td className="whitespace-nowrap px-4 py-4 font-medium">
                    <Link
                      href={`/universitas/detail_universitas/${university.id}`}
                    >
                      {university.name}
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-4 text-center font-medium">
                  Tidak ada universitas yang ditemukan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}