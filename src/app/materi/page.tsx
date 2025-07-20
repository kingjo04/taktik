"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useParams, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faPlay, faVideo } from "@fortawesome/free-solid-svg-icons";

interface Material {
  id: number;
  program_id: number;
  section_id: number;
  section_title: string;
  content_id: number;
  content_name: string;
  video_link: string;
}

const supabaseUrl = "https://ieknphduleynhuiaqsuc.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlla25waGR1bGV5bmh1aWFxc3VjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MTY4ODAsImV4cCI6MjA2ODA5Mjg4MH0.iZBnS3uGs68CmqrhQYAJdCZZGRqlKEThrm0B0FqyPVs";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Materi() {
  const { id } = useParams();
  const router = useRouter();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token || !id) {
        router.push("/login");
        return;
      }

      const programId = Number(id);
      if (isNaN(programId)) throw new Error("ID program tidak valid");

      const { data: materialData, error: materialError } = await supabase
        .from("materials")
        .select("*")
        .eq("program_id", programId)
        .order("section_id", { ascending: true });
      if (materialError) throw materialError;
      setMaterials(materialData as Material[]);

      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const userId = Number(decodedToken.sub) || Number(decodedToken.user?.id);
      if (userId) {
        const { data: registration } = await supabase
          .from("user_registrations")
          .select("id")
          .eq("user_id", userId)
          .eq("program_id", programId)
          .limit(1);
        setIsRegistered(!!registration?.length);
      }
    } catch (err) {
      setError("Gagal memuat materi: " + (err as Error).message);
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100">
        <div className="flex items-center gap-3 text-indigo-700 animate-pulse">
          <div className="w-8 h-8 border-4 border-t-indigo-700 border-b-transparent rounded-full animate-spin"></div>
          <span className="text-2xl font-semibold">Memuat Materi...</span>
        </div>
      </div>
    );
  }

  if (error || !isRegistered) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100 p-4 sm:p-6 ml-[64px]">
        <div className="text-center">
          <p className="text-red-600 text-xl mb-6">{error || "Anda belum terdaftar untuk program ini."}</p>
          <button
            onClick={() => router.push(`/program/${id}`)}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-300"
          >
            <span className="font-medium">Kembali ke Detail Program</span>
          </button>
        </div>
      </div>
    );
  }

  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100 p-4 sm:p-6 ml-[64px]">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => router.back()}
          className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-110 mb-6"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="w-6 h-6 text-indigo-700" />
        </button>

        <h1 className="text-3xl sm:text-4xl font-bold text-indigo-900 mb-8">Materi Pembelajaran</h1>

        <div className="space-y-6">
          {materials.map((material) => (
            <div
              key={material.id}
              className="bg-white p-6 rounded-2xl shadow-lg border border-stone-300"
            >
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setSelectedVideo(selectedVideo === material.video_link ? null : material.video_link)}
              >
                <div>
                  <h3 className="text-xl font-semibold text-indigo-800">{material.section_title}</h3>
                  <p className="text-gray-600 text-sm">{material.content_name}</p>
                  <p className="text-gray-500 text-xs mt-1">Klik untuk melihat video</p>
                </div>
                <FontAwesomeIcon
                  icon={faPlay}
                  className="w-6 h-6 text-indigo-600 transition-transform duration-300"
                />
              </div>
              {selectedVideo === material.video_link && (
                <div className="mt-4">
                  <div className="w-full aspect-video">
                    <iframe
                      src={`https://www.youtube.com/embed/${getYouTubeId(material.video_link)}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full rounded-lg"
                    ></iframe>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {materials.length === 0 && (
          <div className="text-center text-gray-700 mt-10">
            <p className="text-xl">Belum ada materi tersedia.</p>
          </div>
        )}
      </div>
    </div>
  );
}
