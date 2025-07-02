"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";

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
        setName("");
        setPhotoProfile("");
      }
    }
  }, []);

  // Daftar gambar tema pendidikan untuk setiap item
  const educationImages = [
    "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Kelas belajar
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Buku dan pena
    "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Graduasi
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2089&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Perpustakaan
  ];

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
        <div className="flex flex-col flex-1 relative overflow-hidden rounded-3xl border border-solid border-zinc-500">
          <div
            className="w-full h-[235px] bg-indigo-600 relative"
            style={{ backgroundImage: `url(${educationImages[0]})`, backgroundSize: "cover", backgroundPosition: "center" }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white text-center p-4">
              <div>
                <h2 className="text-xl font-bold">UTBK</h2>
                <p className="text-sm mt-2">Ujian Tulis Berbasis Komputer</p>
              </div>
            </div>
          </div>
          <Link
            href={"/utbk"}
            className="justify-center self-end px-3.5 py-2 mt-2.5 bg-yellow-400 rounded hover:bg-yellow-500 transition"
          >
            Lihat Soal
          </Link>
        </div>
        <div className="flex flex-col flex-1 relative overflow-hidden rounded-3xl border border-solid border-zinc-500">
          <div
            className="w-full h-[235px] bg-indigo-600 relative"
            style={{ backgroundImage: `url(${educationImages[1]})`, backgroundSize: "cover", backgroundPosition: "center" }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white text-center p-4">
              <div>
                <h2 className="text-xl font-bold">CPNS</h2>
                <p className="text-sm mt-2">Ujian Calon Pegawai Negeri Sipil</p>
              </div>
            </div>
          </div>
          <Link
            href={"/cpns"}
            className="justify-center self-end px-3.5 py-2 mt-2.5 bg-yellow-400 rounded hover:bg-yellow-500 transition"
          >
            Lihat Soal
          </Link>
        </div>
        <div className="flex flex-col flex-1 relative overflow-hidden rounded-3xl border border-solid border-zinc-500">
          <div
            className="w-full h-[235px] bg-indigo-600 relative"
            style={{ backgroundImage: `url(${educationImages[2]})`, backgroundSize: "cover", backgroundPosition: "center" }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white text-center p-4">
              <div>
                <h2 className="text-xl font-bold">Kedinasan</h2>
                <p className="text-sm mt-2">Latihan Ujian Kedinasan</p>
              </div>
            </div>
          </div>
          <Link
            href={"/kedinasan"}
            className="justify-center self-end px-3.5 py-2 mt-2.5 bg-yellow-400 rounded hover:bg-yellow-500 transition"
          >
            Lihat Soal
          </Link>
        </div>
        <div className="flex flex-col flex-1 relative overflow-hidden rounded-3xl border border-solid border-zinc-500">
          <div
            className="w-full h-[235px] bg-indigo-600 relative"
            style={{ backgroundImage: `url(${educationImages[3]})`, backgroundSize: "cover", backgroundPosition: "center" }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white text-center p-4">
              <div>
                <h2 className="text-xl font-bold">Lihat Semua</h2>
                <p className="text-sm mt-2">Semua soal yang tersedia</p>
              </div>
            </div>
          </div>
          <Link
            href={"/semua"}
            className="justify-center self-end px-3.5 py-2 mt-2.5 bg-yellow-400 rounded hover:bg-yellow-500 transition"
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
          <div className="gap-0 mt-5 w-full bg-indigo-600 rounded-3xl min-h-[235px] max-md:flex-wrap max-md:max-w-full cursor-pointer relative overflow-hidden">
            <img
              src="https://app.taktix.co.id/assets/assets/graduation.jpeg"
              alt="Program Pendampingan"
              className="w-full h-full object-cover rounded-3xl filter blur-sm"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white text-center p-4">
              <div>
                <h2 className="text-2xl font-bold">Program Pendampingan</h2>
                <p className="text-sm mt-2">Klik untuk lihat program pendampingan yang anda ikuti</p>
              </div>
            </div>
          </div>
        </Link>
      </div>
      {/* Program pendampingan finish */}
    </div>
  );
}