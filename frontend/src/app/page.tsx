"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { jwtDecode } from "jwt-decode"; // Import the correct jwt-decode package

export default function Home() {
  const [name, setName] = useState("");
  const [photoProfile, setPhotoProfile] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        console.log(token);
        const decoded: any = jwtDecode(token);
        const user = decoded.user;
        setName(user.name);
        setPhotoProfile(user.photo_profile);
      } catch (error) {
        console.error("Invalid token:", error);
        setName(""); // Clear name and photoProfile in case of token error
        setPhotoProfile("");
      }
    }
  }, []);

  return (
    <div className="mx-40 my-14">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="h-6 w-2 rounded-lg bg-yellow-300"></div>
          <h1 className="ml-4 my-2">Latihan Ujian</h1>
        </div>
        <div className="flex items-center"></div>
      </div>

      {/* Main item start */}
      <div className="flex gap-5 items-start text-xs font-medium text-black max-md:flex-wrap mt-4">
        <div className="flex flex-col flex-1 px-5 py-3 bg-white rounded-3xl border border-solid border-zinc-500">
          <div className="flex gap-2.5 text-base whitespace-nowrap">
            <div className="flex items-center">
              <div className="h-6 w-2 rounded-lg bg-yellow-300"></div>
              <h1 className="ml-2 my-2">UTBK</h1>
            </div>
          </div>
          <div className="self-start mt-1.5 ml-3 text-neutral-500 max-md:ml-2.5">
            Ujian Tulis Berbasis Komputer
          </div>
          <Link
            href={"/utbk"}
            className="justify-center self-end px-3.5 py-2 mt-2.5 bg-yellow-400 rounded"
          >
            Lihat Soal
          </Link>
        </div>
        <div className="flex flex-col flex-1 px-5 py-3 bg-white rounded-3xl border border-solid border-zinc-500">
          <div className="flex gap-2.5 text-base whitespace-nowrap">
            <div className="flex items-center">
              <div className="h-6 w-2 rounded-lg bg-yellow-300"></div>
              <h1 className="ml-2 my-2">CPNS</h1>
            </div>
          </div>
          <div className="mx-3 mt-1.5 text-neutral-500 max-md:mx-2.5">
            Ujian Calon Pegawai Negeri Sipil
          </div>
          <Link
            href={"/cpns"}
            className="justify-center self-end px-3.5 py-2 mt-2.5 bg-yellow-400 rounded"
          >
            Lihat Soal
          </Link>
        </div>
        <div className="flex flex-col flex-1 px-5 py-3 bg-white rounded-3xl border border-solid border-zinc-500">
          <div className="flex gap-2.5 text-base whitespace-nowrap">
            <div className="flex items-center">
              <div className="h-6 w-2 rounded-lg bg-yellow-300"></div>
              <h1 className="ml-2 my-2">Kedinasan</h1>
            </div>
          </div>
          <div className="self-start mt-1.5 ml-3 text-neutral-500 max-md:ml-2.5">
            Latihan Ujian Kedinasan
          </div>
          <Link
            href={"/kedinasan"}
            className="justify-center self-end px-3.5 py-2 mt-2.5 bg-yellow-400 rounded"
          >
            Lihat Soal
          </Link>
        </div>
        <div className="flex flex-col flex-1 px-5 py-3 bg-white rounded-3xl border border-solid border-zinc-500">
          <div className="flex gap-2.5 text-base whitespace-nowrap">
            <div className="flex items-center">
              <div className="h-6 w-2 rounded-lg bg-yellow-300"></div>
              <h1 className="ml-2 my-2">Lihat Semua</h1>
            </div>
          </div>
          <div className="self-start mt-1.5 ml-3 text-neutral-500 max-md:ml-2.5">
            Semua soal yang tersedia
          </div>
          <Link
            href={"/semua"}
            className="justify-center self-end px-3.5 py-2 mt-2.5 bg-yellow-400 rounded"
          >
            Lihat Soal
          </Link>
        </div>
      </div>
      {/* Main item finish */}

      {/* Program pendampingan start */}
      <div className="mt-7">
        <div className="flex items-center">
          <div className="h-6 w-2 rounded-lg bg-yellow-300"></div>
          <h1 className="ml-4 my-2">Program Pendampingan</h1>
        </div>
        <Link href="/program">
          <div className="gap-0 mt-5 w-full bg-indigo-600 rounded-3xl min-h-[235px] max-md:flex-wrap max-md:max-w-full cursor-pointer">
            {/* Add content for Program Pendampingan here */}
          </div>
        </Link>
      </div>
      {/* Program pendampingan finish */}
    </div>
  );
}
