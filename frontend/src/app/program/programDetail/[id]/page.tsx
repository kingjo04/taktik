"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Swal from "sweetalert2";

interface ProgramDetail {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: number;
  image_banner: string;
}

export default function ProgramDetail() {
  const router = useRouter();
  const { id } = useParams();
  const [program, setProgram] = useState<ProgramDetail | null>(null);

  useEffect(() => {
    const fetchProgramDetail = async (token: string) => {
      try {
        const response = await axios.get(
          // `https://web-production-d612.up.railway.app/http://api.program.taktix.co.id/program/${id}`,
          `https://taktix.live/programs/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data.data);
        setProgram(response.data.data);
      } catch (error) {
        console.error("Error fetching program detail:", error);
      }
    };

    const token = localStorage.getItem("token");
    if (token && id) {
      fetchProgramDetail(token);
    }
  }, [id]);

  const handleGroupKonsultasi = () => {
    Swal.fire({
      title: "Link Group tidak ada",
      icon: "warning",
      confirmButtonText: "OK",
      confirmButtonColor: "#DC2626", // Warna merah
    });
  };

  // Fungsi menampilkan SweetAlert untuk "Party Belajar"
  const handlePartyBelajar = () => {
    Swal.fire({
      title: "Fitur akan tersedia",
      icon: "info",
      confirmButtonText: "OK",
      confirmButtonColor: "#16A34A", // Warna hijau
    });
  };

  if (!program) return <p>Loading...</p>;

  return (
    <div className="mx-40 my-14">
      <div className="flex items-center">
        <button type="button" className="mt-1" onClick={() => router.back()}>
          <FontAwesomeIcon icon={faArrowLeft} className="size-5 opacity-75" />
        </button>
        <h1 className="ml-4 my-2">Program Detail</h1>
      </div>

      <div className="flex gap-5 my-5 items-end pt-20 pb-6 text-2xl font-semibold text-white bg-blue-700 rounded-3xl max-md:flex-wrap">
        <div className="shrink-0 mt-20 bg-yellow-300 h-[46px] w-[5px] max-md:mt-10" />
        <div className="flex-auto mt-24 max-md:mt-10 max-md:max-w-full">
          {program.name}
        </div>
      </div>

      <div className="flex flex-col px-5 text-xl font-medium text-black max-w-[878px]">
        <div className="w-full max-md:max-w-full">Deskripsi</div>
        <div className="mt-2 w-full text-base max-md:max-w-full">
          {program.description}
          <br />
          <br />
          Durasi Pendampingan: {program.duration}
          <br />
        </div>
        <div className="mt-10 w-full max-md:max-w-full">Informasi</div>
        <div className="mt-3.5 w-full text-base max-md:max-w-full">
          Harga Rp. {program.price.toLocaleString("id-ID")}
        </div>
        <div className="mt-10 w-full max-md:mt-10 max-md:max-w-full">Menu</div>
      </div>

      {/* Add your SVG components as needed here */}
      <div className="flex gap-5 justify-between px-5 text-base text-black max-md:flex-wrap">
        {/* SVG untuk Passing Grade */}
        <div className="flex flex-col p-3.5 bg-white rounded-2xl border border-solid border-stone-300">
          <img
            loading="lazy"
            src="/Passing Grade.svg"
            alt="Passing Grade"
            className="self-center w-12 aspect-[1.18]"
          />
          <a href="/universitas">
            <div className="mt-5">Passing Grade</div>
          </a>
        </div>

        {/* SVG untuk Try Out */}
        <Link href={`/program/try_out/${id}`}>
          <div className="flex flex-col px-9 py-3 bg-white rounded-2xl border border-solid border-stone-300 max-md:px-5 cursor-pointer">
            <img
              loading="lazy"
              src="/Try Out.svg"
              alt="Try Out"
              className="self-center w-12 aspect-square"
            />
            <div className="mt-4">Try Out</div>
          </div>
        </Link>

        {/* SVG untuk Group Konsultasi */}
        <button
          onClick={handleGroupKonsultasi}
          className="flex flex-col px-1.5 py-3 bg-white rounded-2xl border border-solid border-stone-300 cursor-pointer"
        >
          <img
            loading="lazy"
            src="/Group Konsultasi.svg"
            alt="Group Konsultasi"
            className="self-center aspect-[1.12] w-[53px]"
          />
          <div className="mt-4">Group Konsultasi</div>
        </button>

        {/* SVG untuk Materi */}
        <Link href={`/program/materi/${id}`}>
          <div className="flex flex-col px-9 pt-px pb-4 whitespace-nowrap bg-white rounded-2xl border border-solid border-stone-300 max-md:px-5">
            <img
              loading="lazy"
              src="/Materi.svg"
              alt="Materi"
              className="self-center w-12 aspect-[0.76]"
            />
            <div className="mt-2">Materi</div>
          </div>
        </Link>

        {/* SVG untuk Party Belajar */}
        <button
          onClick={handlePartyBelajar}
          className="flex flex-col px-5 py-3 bg-white rounded-2xl border border-solid border-stone-300 cursor-pointer"
        >
          <img
            loading="lazy"
            src="/Party Belajar.svg"
            alt="Party Belajar"
            className="self-center aspect-[1.12] w-[54px]"
          />
          <div className="mt-3.5">Party Belajar</div>
        </button>

        {/* SVG untuk Jadwal Pendampingan */}
        <Link href={`/program/agenda/${id}`}>
          <div className="flex flex-col px-5 py-3 bg-white rounded-2xl border border-solid border-stone-300">
            <img
              loading="lazy"
              src="/Jadwal Pendampingan.svg"
              alt="Jadwal Pendampingan"
              className="self-center aspect-[1.12] w-[54px]"
            />
            <div className="mt-3.5 text-wrap">Jadwal Pendampingan</div>
          </div>
        </Link>
      </div>
    </div>
  );
}
