"use client"
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons/faArrowLeft";
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
  const { id } = params;

  useEffect(() => {
    const fetchUniversityMajors = async (token: string) => {
      try {
        const response = await axios.get(`/api/university/${id}/major`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMajors(response.data.data.majors);
      } catch (error) {
        console.error("Error fetching university majors:", error);
      }
    };

    const token = localStorage.getItem("token");
    if (token && id) {
      fetchUniversityMajors(token);
    }
  }, [id]);

  return (
    <div className="mx-40 my-14">
      <div className="flex items-center ">
        <button type="button" className="mt-1" onClick={() => router.back()}>
          <FontAwesomeIcon icon={faArrowLeft} className="size-5 opacity-75" />
        </button>
        <h1 className="ml-4 my-2">Universitas</h1>
      </div>

      <div className="overflow-x-auto rounded-lg border border-solid black max-w-[682px] mx-auto mt-4">
        <table className="min-w-full divide-y-2 divide-black bg-white text-sm">
          <tbody className="divide-y divide-black">
            {majors.map((major) => (
              <tr key={major.id}>
                <td className="whitespace-nowrap px-4 py-4 font-medium">
                  <div className="text-base text-black">
                    {major.major} - {major.educational_level}
                  </div>
                  <div className="mt-1.5 text-base text-neutral-500">
                    Akreditasi: {major.accreditation}
                    <br />
                    SNBT: Kuota {major.snbt_quota}, Peminat{" "}
                    {major.snbt_enthusiasts}
                    <br />
                    SNBP: Kuota {major.snbp_quota}, Peminat{" "}
                    {major.snbp_enthusiasts}
                    <br />
                    Passing Grade {major.passing_grade}
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
