"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useParams, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faPlay, faVideo, faBook, faChevronRight } from "@fortawesome/free-solid-svg-icons";

interface Material {
  id: number;
  program_id: number;
  section_id: number;
  section_title: string;
  content_id: number;
  content_name: string;
  video_link: string;
  content_text: string | null;
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
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set());
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
        .order("section_id", { ascending: true }) // Urutkan berdasarkan section_id
        .order("content_id", { ascending: true }); // Urutkan berdasarkan content_id di dalam section
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

  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const toggleSection = (sectionId: number) => {
    const newExpandedSections = new Set(expandedSections);
    if (newExpandedSections.has(sectionId)) {
      newExpandedSections.delete(sectionId);
    } else {
      newExpandedSections.add(sectionId);
    }
    setExpandedSections(newExpandedSections);
  };

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

  const groupedMaterials = materials.reduce((acc, material) => {
    if (!acc[material.section_id]) {
      acc[material.section_id] = {
        section_title: material.section_title,
        contents: [],
      };
    }
    acc[material.section_id].contents.push(material);
    return acc;
  }, {} as { [key: number]: { section_title: string; contents: Material[] } });

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
          {Object.entries(groupedMaterials).map(([sectionId, { section_title, contents }]) => (
            <div
              key={sectionId}
              className="bg-white rounded-2xl shadow-lg border border-stone-300 overflow-hidden"
            >
              <div
                className="p-4 sm:p-6 bg-indigo-50 cursor-pointer flex justify-between items-center"
                onClick={() => toggleSection(Number(sectionId))}
              >
                <h2 className="text-xl font-semibold text-indigo-800">{section_title}</h2>
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className={`w-5 h-5 text-indigo-600 transition-transform duration-300 ${
                    expandedSections.has(Number(sectionId)) ? "rotate-90" : ""
                  }`}
                />
              </div>
              {expandedSections.has(Number(sectionId)) && (
                <div className="p-4 sm:p-6 space-y-4">
                  {contents.map((material, index) => (
                    <div
                      key={material.id}
                      className="bg-gray-50 p-4 rounded-lg shadow-inner flex items-start gap-4"
                    >
                      <div className="flex-shrink-0 mt-1">
                        <FontAwesomeIcon
                          icon={faBook}
                          className="w-6 h-6 text-indigo-500"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-800">
                          {index + 1}. {material.content_name}
                        </h3>
                        <div className="text-gray-600 text-sm mt-2">
                          {material.content_text || "Tidak ada teks materi."}
                        </div>
                        {material.video_link && (
                          <div
                            className="mt-3 flex items-center gap-2 text-indigo-600 hover:text-indigo-800 cursor-pointer"
                            onClick={() => setSelectedVideo(selectedVideo === material.video_link ? null : material.video_link)}
                          >
                            <FontAwesomeIcon icon={faVideo} className="w-5 h-5" />
                            <span>Lihat Video</span>
                          </div>
                        )}
                        {selectedVideo === material.video_link && (
                          <div className="mt-4 w-full aspect-video">
                            <iframe
                              src={`https://www.youtube.com/embed/${getYouTubeId(material.video_link)}`}
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="w-full h-full rounded-lg"
                            ></iframe>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
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
