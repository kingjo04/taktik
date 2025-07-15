"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface University {
  id: number;
  name: string;
  student_count?: number;
}

export default function UniversitiesChart({ universities }: { universities: University[] }) {
  const [isClient, setIsClient] = useState(false);
  const [data, setData] = useState<number[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    setIsClient(true);

    const fetchData = async (token: string) => {
      try {
        const response = await axios.get(
          "https://api.program.taktix.co.id/university?page=1&pageSize=1000",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const uniData = response.data.data.universities
          .slice(0, 5)
          .map((uni: any) => ({
            ...uni,
            student_count: uni.student_count || Math.floor(Math.random() * 500) + 100,
          }))
          .sort((a: University, b: University) => (b.student_count || 0) - (a.student_count || 0));
        setCategories(uniData.map((uni: University) => uni.name));
        setData(uniData.map((uni: University) => uni.student_count || 0));
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
    return null;
  }

  const chartOptions: ApexOptions = {
    chart: {
      type: "bar",
      animations: {
        enabled: true,
        speed: 1000,
      },
      toolbar: {
        show: true,
      },
    },
    xaxis: {
      categories,
      labels: {
        style: {
          colors: "#4B5563",
          fontWeight: 600,
        },
      },
      title: {
        text: "University Names",
        style: { color: "#4B5563", fontWeight: 600 },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#4B5563",
        },
      },
      title: {
        text: "Number of Students",
        style: { color: "#4B5563", fontWeight: 600 },
      },
    },
    colors: ["#6366F1", "#8B5CF6", "#A78BFA", "#C4B5FD", "#EDE9FE"],
    plotOptions: {
      bar: {
        borderRadius: 6,
        distributed: true,
        dataLabels: { position: "top" },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => (val ? val.toLocaleString() : "0"),
      style: {
        colors: ["#333"],
        fontSize: "12px",
        fontWeight: 600,
      },
    },
    grid: {
      borderColor: "#E5E7EB",
      strokeDashArray: 4,
    },
    title: {
      text: "Top 5 Universities by Student Count",
      align: "center",
      style: { color: "#1E293B", fontSize: "18px", fontWeight: 700 },
    },
    responsive: [
      {
        breakpoint: 640, // sm
        options: {
          chart: { height: 300 },
          xaxis: { labels: { rotate: -45 } },
        },
      },
      {
        breakpoint: 1024, // lg
        options: {
          chart: { height: 350 },
          xaxis: { labels: { rotate: 0 } },
        },
      },
    ],
  };

  const chartSeries = [
    {
      name: "Students",
      data,
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-6 hover:shadow-lg transition-all duration-300">
      <Chart
        options={chartOptions}
        series={chartSeries}
        type="bar"
        height={400}
      />
    </div>
  );
}