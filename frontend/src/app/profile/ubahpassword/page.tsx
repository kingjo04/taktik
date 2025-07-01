"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function Profile() {
	const router = useRouter();
	const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

	return (
    <div className="mx-40 my-14">
      <div className="flex items-center ">
        <button type="button" className="mt-1" onClick={() => router.back()}>
          <FontAwesomeIcon icon={faArrowLeft} className="size-5 opacity-75" />
        </button>
        <h1 className="ml-4 my-2">Ubah Profile</h1>
      </div>

      <div className="mx-auto max-w-[500px] my-6">
        <label
          htmlFor="passwordlama"
          className="block text-xs font-medium text-gray-700"
        >
          Password Lama
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="passwordlama"
            className="mt-1 w-full rounded-md border shadow-sm sm:text-sm pr-10"
          />
          <button
            type="button"
            onClick={toggleShowPassword}
            className="absolute inset-y-0 right-0 px-3 flex items-center mt-1"
          >
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              className="text-lg"
            />
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-[500px] my-6">
        <label
          htmlFor="passwordlama"
          className="block text-xs font-medium text-gray-700"
        >
          Password Lama
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="passwordlama"
            className="mt-1 w-full rounded-md border shadow-sm sm:text-sm pr-10"
          />
          <button
            type="button"
            onClick={toggleShowPassword}
            className="absolute inset-y-0 right-0 px-3 flex items-center mt-1"
          >
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              className="text-lg"
            />
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-[500px] my-6">
        <label
          htmlFor="passwordlama"
          className="block text-xs font-medium text-gray-700"
        >
          Password Lama
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="passwordlama"
            className="mt-1 w-full rounded-md border shadow-sm sm:text-sm pr-10"
          />
          <button
            type="button"
            onClick={toggleShowPassword}
            className="absolute inset-y-0 right-0 px-3 flex items-center mt-1"
          >
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              className="text-lg"
            />
          </button>
        </div>

        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="px-16 py-3 text-lg font-semibold text-white bg-blue-700 rounded-[30px]"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
