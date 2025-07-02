"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import axios from "axios";

interface Tryout {
  id: string;
  title: string;
  name: string;
  created_at: string;
  end_date: string;
  total_question: number;
  duration: number;
  is_corrected: boolean;
}

export default function TryOut({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = useParams();
  const [tryouts, setTryouts] = useState<Tryout[]>([]);
  // const { id } = params;

  useEffect(() => {
    const fetchProgramDetail = async (token: string) => {
      try {
        const response = await axios.get(
          // `https://web-production-d612.up.railway.app/http://api.program.taktix.co.id/program/${id}/tryout`,
          `https://taktix.live/programs/tryout/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data.data);
        setTryouts(response.data.data);
      } catch (error) {
        console.error("Error fetching program detail:", error);
      }
    };

    const token = localStorage.getItem("token");
    if (token && id) {
      fetchProgramDetail(token);
    }
  }, [id]);

  // if (!tryouts.length) return <p>Loading...</p>;

  return (
    <div className="mx-40 my-14">
      <div className="flex items-center">
        <button type="button" className="mt-1" onClick={() => router.back()}>
          <FontAwesomeIcon icon={faArrowLeft} className="size-5 opacity-75" />
        </button>
        <h1 className="ml-4 my-2">Try Out</h1>
      </div>

      <div className="flex gap-5 my-5 items-end pt-20 pb-6 text-2xl font-semibold text-white bg-blue-700 rounded-3xl max-md:flex-wrap">
        <div className="shrink-0 mt-20 h-[46px] w-[5px] max-md:mt-10" />
        <div className="flex-auto mt-24 max-md:mt-10 max-md:max-w-full">
          <div className="text-3xl font-bold">
            Ujian Tertulis Berbasis Komputer dalam Seleksi Nasional Penerimaan
            Mahasiswa Baru (UTBK-SNPMB)
          </div>
          <div className="mt-2 text-xl font-normal">
            Materi tes dalam Ujian Tertulis Berbasis Komputer dalam Seleksi
            Nasional Penerimaan Mahasiswa Baru (UTBK-SNMPMB) terdiri dari dua
            komponen besar yaitu Tes Potensi Skolastik dan Tes Literasi
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-x-6 gap-y-6 relative z-10">
        {tryouts.map((tryout) => (
          <div key={tryout.id} className="w-96 h-52 relative">
            <div className="w-96 h-52 left-0 top-0 absolute bg-white rounded-2xl border border-stone-300" />
            {/* <img
              className="w-6 h-5 left-[49px] top-[136px] absolute"
              src="/Ok.svg"
              alt="Tryout Status"
            /> */}
            <div className="left-[44px] top-[14px] absolute text-black text-base font-medium">
              {tryout.title}
            </div>
            <div className="left-[80px] top-[43px] absolute text-neutral-400 text-base font-normal">
              Dari {new Date(tryout.created_at).toLocaleDateString("id-ID")}
            </div>
            <div className="left-[80px] top-[66px] absolute text-neutral-400 text-base font-normal">
              Total soal {tryout.total_question}
            </div>
            <div className="left-[80px] top-[89px] absolute text-neutral-400 text-base font-normal">
              Total durasi {tryout.duration} menit
            </div>
            {/* <div className="left-[81px] top-[112px] absolute text-neutral-400 text-base font-normal">
              {tryout.is_corrected ? "Sudah dinilai" : "Belum dinilai"}
            </div> */}
            <div className="w-24 h-7 left-[53px] top-[172px] absolute bg-white rounded-2xl border border-stone-300" />
            <Link
              href={`/program/detail_tryout/${tryout.id}`}
              className="left-[76px] top-[174px] absolute text-black text-base font-normal"
            >
              Masuk
            </Link>
            {/* <div className="w-2.5 h-2.5 left-[56px] top-[118px] absolute bg-zinc-300 rounded-full" /> */}
            <img
              className="w-6 h-6 left-[49px] top-[41px] absolute"
              src="/Calendar Plus.svg"
            />
            <img
              className="w-6 h-6 left-[49px] top-[65px] absolute"
              src="/Calendar Plus.svg"
            />
            <img
              className="w-6 h-6 left-[49px] top-[88px] absolute"
              src="/Calendar Plus.svg"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
