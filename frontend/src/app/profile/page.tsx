"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import axios from "axios";

export default function Profile() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [photoProfile, setPhotoProfile] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        const user = decoded.user;
        setName(user.name);
        setPhotoProfile(user.photo_profile);
        setEmail(user.email);
      } catch (error) {
        console.error("Invalid token:", error);
        setName("");
        setPhotoProfile("");
        setEmail("");
      }
    }
  }, []);

  const handleCheckHistory = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Token not found",
        text: "Please login to check history.",
      });
      return;
    }

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/student/exam-pagination?page=1&per_page=20`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.data.length > 0) {
        Swal.fire({
          icon: "success",
          title: "History found",
          text: "Your exam history is available.",
        });
        router.push(`/profile/riwayat`);
      } else {
        Swal.fire({
          icon: "info",
          title: "No History",
          text: "No exam history available.",
        });
      }
    } catch (error) {
      console.error("Error fetching history:", error);
      Swal.fire({
        icon: "error",
        title: "History not found",
        text: "No history available for this exam.",
      });
    }
  };

  return (
    <div className="mx-40 my-14">
      <div className="flex items-center">
        <button type="button" className="mt-1" onClick={() => router.back()}>
          <FontAwesomeIcon icon={faArrowLeft} className="size-5 opacity-75" />
        </button>
        <h1 className="ml-4 my-2">Profile</h1>
      </div>

      <div className="mx-auto px-20 py-7 bg-blue-700 rounded-3xl border border-solid border-neutral-500 max-w-[683px] max-md:px-5">
        <div className="flex gap-5 max-md:flex-col max-md:gap-0">
          <div className="flex flex-col w-[32%] max-md:ml-0 max-md:w-full">
            <div
              className="shrink-0 mx-auto rounded-full bg-zinc-300 h-[113px] w-[126px] max-md:mt-10"
              style={{
                backgroundImage: `url(${photoProfile})`,
                backgroundSize: "cover",
              }}
            />
          </div>
          <div className="flex flex-col ml-5 w-[68%] max-md:ml-0 max-md:w-full">
            <div className="flex flex-col self-stretch my-auto text-white max-md:mt-10">
              <div className="text-2xl font-bold">{name}</div>
              <div className="mt-3.5 text-xl font-medium">{email}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 flex flex-col px-5 text-lg font-semibold text-black max-w-[619px]">
        <div className="w-full max-md:max-w-full">Menu</div>
        <div className="justify-center py-3.5 mt-1 w-full text-base bg-white border-b border-solid border-stone-300 max-md:max-w-full">
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={handleCheckHistory}
          >
            <span>Soal Ujian Saya</span>
            <FontAwesomeIcon icon={faChevronRight} className="size-5 opacity-75" />
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 flex flex-col px-5 text-lg font-semibold text-black max-w-[619px]">
        <div className="w-full max-md:max-w-full">Profile</div>
        <div className="justify-center py-3.5 mt-1 w-full text-base bg-white border-b border-solid border-stone-300 max-md:max-w-full">
          <Link href="/profile/ubahprofile">
            <div className="flex justify-between items-center">
              <span>Ubah Profile</span>
              <FontAwesomeIcon icon={faChevronRight} className="size-5 opacity-75" />
            </div>
          </Link>
        </div>
        <div className="justify-center py-3.5 mt-1 w-full text-base bg-white border-b border-solid border-stone-300 max-md:max-w-full">
          <Link href="/profile/ubahpassword">
            <div className="flex justify-between items-center">
              <span>Ubah Password</span>
              <FontAwesomeIcon icon={faChevronRight} className="size-5 opacity-75" />
            </div>
          </Link>
        </div>
        <div className="justify-center py-3.5 mt-1 w-full text-base bg-white border-b border-solid border-stone-300 max-md:max-w-full">
          <Link href="">
            <div className="flex justify-between items-center">
              <span>Hapus Akun</span>
              <FontAwesomeIcon icon={faChevronRight} className="size-5 opacity-75" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}