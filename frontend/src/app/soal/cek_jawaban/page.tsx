"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { jwtDecode } from "jwt-decode"; // Import the correct jwt-decode package
import InfoSection from "../InfoSection";
import ActionButton from "../ActionButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

export default function CekJawaban() {
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
              <div className="w-[872px] h-[75px] left-0 top-0 absolute bg-indigo-300 rounded-[20px]" />
              {/* <div className="w-[558px] h-[75px] left-0 top-0 absolute bg-blue-700 rounded-[20px]" /> */}
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

        <div className="my-8">
          <div className="w-full h-20 relative">
            <div className="left-0 top-0 absolute text-black text-xl font-medium">
              Riwayat Pengerjaan
            </div>
            <div className="w-full left-0 top-[36px] absolute text-black text-lg font-normal">
              Cek kembali jawaban Anda sebelum menyelesaikkan pengerjaan. Klik
              pada “Nomor Soal” untuk mengubah jawaban yang Anda Inginkan.
            </div>
          </div>
        </div>

        <div className="flex justify-center my-8">
          <table className="table-auto border-collapse border border-zinc-500 w-96">
            <thead>
              <tr className="bg-white">
                <th className="border border-zinc-500 text-black text-xl font-medium px-4 py-2">
                  No
                </th>
                <th className="border border-zinc-500 text-black text-xl font-medium px-4 py-2">
                  Jawaban
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white">
                <td className="border border-stone-300 px-4 py-2 text-black text-lg">
                  1
                </td>
                <td className="border border-stone-300 px-4 py-2 text-black text-lg">
                  A
                </td>
              </tr>
              <tr className="bg-white">
                <td className="border border-stone-300 px-4 py-2 text-black text-lg">
                  2
                </td>
                <td className="border border-stone-300 px-4 py-2 text-black text-lg">
                  B
                </td>
              </tr>
              <tr className="bg-white">
                <td className="border border-stone-300 px-4 py-2 text-black text-lg">
                  3
                </td>
                <td className="border border-stone-300 px-4 py-2 text-black text-lg">
                  C
                </td>
              </tr>
              {/* Add more rows as needed */}
            </tbody>
          </table>
        </div>

        <div className="fixed bottom-4 right-4">
          <button className="flex items-center bg-blue-500 text-white py-3 px-6 rounded-full shadow-lg hover:bg-blue-600 transition duration-300 ease-in-out">
            <span className="mr-2 text-xl font-semibold">Selesaikan Ujian</span>
            <FontAwesomeIcon
              icon={faPaperPlane}
              className="text-white text-lg"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
