"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

interface Program {
  id: string;
  name: string;
  price: number;
  image_banner: string;
}

export default function Program() {
  const router = useRouter();
  const [programs, setPrograms] = useState<Program[]>([]);

  useEffect(() => {
    const fetchPrograms = async (token: string) => {
      try {
        const response = await axios.get(`https://taktix.live/programs`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response);
        setPrograms(response.data.data.programs);
      } catch (error) {
        console.error("Error fetching programs:", error);
      }
    };

    const token = localStorage.getItem("token");
    if (token) {
      fetchPrograms(token);
    }
  }, []);

  return (
    <div className="mx-40 my-14">
      <div className="flex items-center">
        <button type="button" className="mt-1" onClick={() => router.back()}>
          <FontAwesomeIcon icon={faArrowLeft} className="size-5 opacity-75" />
        </button>
        <h1 className="ml-4 my-2">Program</h1>
      </div>

      <div className="px-5 grid grid-cols-3 gap-5">
        {programs.length > 0 ? (
          programs.map((program) => (
            <a
              key={program.id}
              href={`/program/programDetail/${program.id}`}
              className="block rounded-lg p-4 shadow-sm shadow-indigo-100 mt-5 mr-5"
            >
              <div className="h-48 rounded-md bg-indigo-600 flex justify-center items-center">
                <img
                  src={program.image_banner}
                  alt={program.name}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>

              <div className="mt-2">
                <dl>
                  <div>
                    <p className="font-medium">{program.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">
                      {program.price === 0
                        ? "Gratis"
                        : `Rp ${program.price.toLocaleString("id-ID")}`}
                    </p>
                  </div>
                </dl>
              </div>
            </a>
          ))
        ) : (
          <p className="text-center font-medium mt-10">
            Loading...
          </p>
        )}
      </div>
    </div>
  );
}
