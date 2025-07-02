"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function KunciJawaban({ params }: { params: { id: string } }) {
  const [answers, setAnswers] = useState<any[]>([]);
  const { id } = params;
  const router = useRouter();

  useEffect(() => {
    const fetchAnswers = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/soal/kunci_jawaban/${id}`,
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
        setAnswers(data);
      } catch (error) {
        console.error("Error fetching answer keys:", error);
      }
    };

    fetchAnswers();
  }, [id, router]);

  if (!answers.length) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mx-40 my-14">
      <h1 className="text-2xl font-semibold mb-6">Kunci Jawaban</h1>
      <table className="min-w-full bg-white border border-gray-300 rounded-lg">
        <thead>
          <tr className="bg-blue-700 text-white">
            <th className="p-3 text-left">Nomor</th>
            <th className="p-3 text-left">Soal</th>
            <th className="p-3 text-left">Jawaban Benar</th>
          </tr>
        </thead>
        <tbody>
          {answers.map((answer, index) => (
            <tr key={answer.id} className="border-b">
              <td className="p-3">{index + 1}</td>
              <td className="p-3">{answer.question}</td>
              <td className="p-3">{answer.correct}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
