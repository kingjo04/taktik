"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { jwtDecode } from "jwt-decode"; // Import the correct jwt-decode package
import InfoSection from "../InfoSection";
import ActionButton from "../ActionButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey, faStar } from "@fortawesome/free-solid-svg-icons";

export default function Nilai() {
  const [name, setName] = useState("");
  const [photoProfile, setPhotoProfile] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
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
    <div>
      {/* Main content with margin */}
      <div className="mx-40 my-14">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-6 w-2 rounded-lg bg-yellow-300"></div>
            <h1 className="ml-4 my-2">Cek Jawaban</h1>
          </div>
          <div className="flex items-center"></div>
        </div>

        {/* Main item start */}
        <div className="flex flex-col items-center my-8">
          <div className="w-full max-w-[1000px] rounded-[20px] p-8">
            {/* Title Section */}
            <div className="w-[872px] h-[75px] relative">
              <div className="w-[872px] h-[75px] left-0 top-0 absolute bg-blue-700 rounded-[20px]" />
              <div className="left-[28px] top-[11px] absolute text-white text-xl font-semibold">
                Soal Latihan November{" "}
              </div>
              <div className="left-[568px] top-[24px] absolute text-white text-xl font-semibold">
                30 Soal
              </div>
              <div className="left-[28px] top-[42px] absolute text-white text-base font-normal">
                UTBK - Bahasa Indonesia
              </div>
              <div className="left-[766px] top-[23px] absolute text-white text-xl font-semibold">
                00:00:00
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center my-8 ml-8 pl-8">
          <div className="w-[800px] h-52 relative">
            {/* Container utama */}
            <div className="w-[650px] h-52 left-0 top-0 absolute bg-white rounded-2xl border border-zinc-300" />

            {/* Box Nilai */}
            <div className="left-[254px] top-[16px] absolute text-black text-xl font-normal">
              Nilai Kamu
            </div>
            <div className="left-[289px] top-[55px] absolute text-black text-5xl font-semibold">
              0
            </div>

            {/* Box 1 - Kiri */}
            <div className="w-64 h-14 left-[36px] top-[124px] absolute bg-white rounded-3xl border border-zinc-300 flex items-center justify-center space-x-2">
              <img src="/cancel.svg" alt="Cancel" className="w-9 h-8" />
              <div className="text-black text-xl font-semibold">30</div>
            </div>

            {/* Box 2 - Kanan */}
            <div className="w-64 h-14 left-[320px] top-[124px] absolute bg-white rounded-3xl border border-zinc-300 flex items-center justify-center space-x-2">
              <img src="/ok.svg" alt="Ok" className="w-11 h-8" />
              <div className="text-black text-xl font-semibold">30</div>
            </div>
          </div>
        </div>

        <div className="flex space-x-4 my-8 ml-8 pl-8">
          {/* Tombol Kunci Jawaban */}
          <button className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2 hover:bg-blue-600">
            <FontAwesomeIcon icon={faKey} className="text-white" />
            <span>Kunci Jawaban</span>
          </button>

          {/* Tombol Beri Rating */}
          <button className="bg-yellow-300 text-black font-semibold py-2 px-4 rounded-lg flex items-center space-x-2 hover:bg-yellow-600">
            <FontAwesomeIcon icon={faStar} className="text-black" />
            <span>Beri Rating</span>
          </button>
        </div>
      </div>
    </div>
  );
}
