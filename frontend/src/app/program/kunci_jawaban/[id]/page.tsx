"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProgramKunciJawaban({
  params,
}: {
  params: { id: string };
}) {
  const [title, setTitle] = useState("");
  const [answers, setAnswers] = useState<any[]>([]);
  const { id } = params;
  const router = useRouter();

  useEffect(() => {
    const fetchAnswers = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch(
          `https://taktix.live/programs/soal/kunci_jawaban/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch answer keys");
        }

        const data = await response.json();
        console.log(data);
        setTitle(data.title);
        setAnswers(data.answers);
      } catch (error) {
        console.error("Error fetching answer keys:", error);
      }
    };

    fetchAnswers();
  }, [id, router]);

  if (!answers.length) {
    return <div className="text-center mt-10 text-xl">Loading...</div>;
  }

  return (
    <div className="mx-40 my-14">
      <h1 className="text-2xl font-bold mb-4 text-center">{title}</h1>
      <h2 className="text-xl font-semibold mb-6 text-center">Kunci Jawaban</h2>

      <table className="min-w-full bg-white border border-gray-300 rounded-lg">
        <thead>
          <tr className="bg-blue-700 text-white">
            <th className="p-3 text-left">Nomor</th>
            <th className="p-3 text-left">Soal</th>
            <th className="p-3 text-left">Jawaban Benar</th>
            <th className="p-3 text-left">Pilihan Jawaban</th>
          </tr>
        </thead>
        <tbody>
          {answers.map((answer, index) => (
            <tr key={answer.id} className="border-b">
              <td className="p-3">{index + 1}</td>
              <td className="p-3">{answer.question}</td>
              <td className="p-3 font-bold text-green-600">{answer.correct}</td>
              <td className="p-3">
                <ul>
                  {answer.options.map((option: any) => (
                    <li key={option.label} className="text-gray-600">
                      <strong>{option.label}.</strong> {option.content}
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
