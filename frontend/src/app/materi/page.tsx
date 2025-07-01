"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function Materi() {
  const router = useRouter();

  return (
    <div>
      <div className="mx-40 my-14">
        <div className="flex items-center ">
          <button type="button" className="mt-1" onClick={() => router.back()}>
            <FontAwesomeIcon icon={faArrowLeft} className="size-5 opacity-75" />
          </button>
          <h1 className="ml-4 my-2">Materi</h1>
        </div>
      </div>

      <div className="flex justify-center items-center mt-4 mb-2">
        <div className="flex flex-col text-base rounded-none max-w-[738px] w-full">
          <div className="px-5 py-3 w-full font-semibold text-white bg-blue-700 rounded-2xl max-md:pr-5">
            1. Materi Pengantar
          </div>
          <div className="self-center px-4 py-3 mt-3.5 max-w-full text-black bg-white rounded-2xl border border-solid border-neutral-400 w-[627px] max-md:pr-5">
            1. Pengantar 1
          </div>
          <div className="self-center px-4 py-3 mt-3.5 max-w-full text-black bg-white rounded-2xl border border-solid border-neutral-400 w-[627px] max-md:pr-5">
            1. Pengantar 1
          </div>
          <div className="self-center px-4 py-3 mt-3.5 max-w-full text-black bg-white rounded-2xl border border-solid border-neutral-400 w-[627px] max-md:pr-5">
            1. Pengantar 1
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center mt-4 mb-2">
        <div className="flex flex-col text-base rounded-none max-w-[738px] w-full">
          <div className="px-5 py-3 w-full font-semibold text-white bg-blue-700 rounded-2xl max-md:pr-5">
            1. Materi Pengantar
          </div>
          <div className="self-center px-4 py-3 mt-3.5 max-w-full text-black bg-white rounded-2xl border border-solid border-neutral-400 w-[627px] max-md:pr-5">
            1. Pengantar 1
          </div>
          <div className="self-center px-4 py-3 mt-3.5 max-w-full text-black bg-white rounded-2xl border border-solid border-neutral-400 w-[627px] max-md:pr-5">
            1. Pengantar 1
          </div>
          <div className="self-center px-4 py-3 mt-3.5 max-w-full text-black bg-white rounded-2xl border border-solid border-neutral-400 w-[627px] max-md:pr-5">
            1. Pengantar 1
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center mt-4 mb-2">
        <div className="flex flex-col text-base rounded-none max-w-[738px] w-full">
          <div className="px-5 py-3 w-full font-semibold text-white bg-blue-700 rounded-2xl max-md:pr-5">
            1. Materi Pengantar
          </div>
          <div className="self-center px-4 py-3 mt-3.5 max-w-full text-black bg-white rounded-2xl border border-solid border-neutral-400 w-[627px] max-md:pr-5">
            1. Pengantar 1
          </div>
          <div className="self-center px-4 py-3 mt-3.5 max-w-full text-black bg-white rounded-2xl border border-solid border-neutral-400 w-[627px] max-md:pr-5">
            1. Pengantar 1
          </div>
          <div className="self-center px-4 py-3 mt-3.5 max-w-full text-black bg-white rounded-2xl border border-solid border-neutral-400 w-[627px] max-md:pr-5">
            1. Pengantar 1
          </div>
        </div>
      </div>
    </div>
  );
}
