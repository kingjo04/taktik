"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function UniversitiesChart() {
  const [isClient, setIsClient] = useState(false);
  const [data, setData] = useState<number[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    setIsClient(true); // Indikasi bahwa kita berada di sisi klien.

    const fetchData = async (token: string) => {
      try {
        const response = await axios.get(
          "https://web-production-d612.up.railway.app/http://api.program.taktix.co.id/university?page=1&pageSize=1000",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const universities = response.data.data.universities.slice(0, 5); // Ambil 5 universitas pertama
        setCategories(universities.map((uni: { name: string }) => uni.name));
        setData(universities.map(() => 1)); // Ganti logika sesuai data Anda
      } catch (error) {
        console.error("Error fetching university data:", error);
      }
    };

    const token = localStorage.getItem("token");
    if (token) {
      fetchData(token);
    }
  }, []);

  if (!isClient) {
    return null; // Jangan render apapun di sisi server
  }

  const chartOptions: ApexOptions = {
    chart: {
      type: "bar",
    },
    xaxis: {
      categories,
    },
  };

  const chartSeries = [
    {
      name: "Universities",
      data,
    },
  ];

  return (
    <div>
      <h2 className="text-center mb-4">Top 5 Universities</h2>
      <Chart
        options={chartOptions}
        series={chartSeries}
        type="bar"
        height={250}
      />
    </div>
  );
}
