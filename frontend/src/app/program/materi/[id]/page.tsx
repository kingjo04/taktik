
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

interface Content {
  id: number;
  content_name: string;
  video_link: string;
}

interface Section {
  id: number;
  section_title: string;
  contents: Content[];
}

export default function Materi() {
  const router = useRouter();
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const videosPerPage = 1; // 1 video per halaman

  useEffect(() => {
    const fetchMateri = async () => {
      try {
        const response = await fetch("https://api.taktix.co.id/student/matter/4", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        console.log("API Response:", data);
        if (Array.isArray(data)) {
          setSections(data);
        } else {
          setError("Format data tidak sesuai.");
        }
      } catch (error) {
        console.error("Error fetching materi:", error);
        setError("Terjadi kesalahan saat mengambil materi.");
      } finally {
        setLoading(false);
      }
    };

    fetchMateri();
  }, []);

  const getYouTubeEmbedUrl = (url: string) => {
    const videoIdMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/[^\/]+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/);
    const videoId = videoIdMatch ? videoIdMatch[1] : null;
    console.log("Video URL:", url, "Extracted ID:", videoId);
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  // Menggabungkan semua contents dari semua sections
  const allContents = sections.flatMap((section) => section.contents);
  const totalVideos = allContents.length;
  const totalPages = Math.ceil(totalVideos / videosPerPage);
  const currentVideoIndex = (currentPage - 1) * videosPerPage;
  const currentVideo = allContents[currentVideoIndex];

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  if (loading) {
    return <p className="text-center mt-10 text-xl text-indigo-600 animate-pulse">Loading...</p>;
  }

  if (error || !sections.length) {
    return <p className="text-red-500 text-center mt-10">{error || "Tidak ada materi tersedia"}</p>;
  }

  if (!currentVideo) {
    return <p className="text-center mt-10">Tidak ada video untuk halaman ini.</p>;
  }

  return (
    <div>
      <div className="mx-40 my-14">
        <div className="flex items-center">
          <button type="button" className="mt-1" onClick={() => router.back()}>
            <FontAwesomeIcon icon={faArrowLeft} className="size-5 opacity-75" />
          </button>
          <h1 className="ml-4 my-2">Materi</h1>
        </div>
      </div>

      <div className="flex justify-center items-center mt-4 mb-2">
        <div className="flex flex-col text-base rounded-none max-w-[738px] w-full">
          {sections
            .filter((section) => section.contents.some((content) => content.id === currentVideo.id))
            .map((section) => (
              <div key={section.id} className="mb-6">
                <div className="px-5 py-3 w-full font-semibold text-white bg-blue-700 rounded-t-2xl">
                  {section.section_title}
                </div>
                <div className="px-5 py-3 bg-white rounded-b-2xl border border-solid border-neutral-400">
                  <div className="font-semibold">{currentVideo.content_name}</div>
                  {getYouTubeEmbedUrl(currentVideo.video_link) ? (
                    <iframe
                      width="100%"
                      height="315"
                      src={`${getYouTubeEmbedUrl(currentVideo.video_link)}?rel=0`}
                      title={currentVideo.content_name}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="mt-3 rounded-2xl"
                      style={{ maxWidth: "627px" }}
                    ></iframe>
                  ) : (
                    <p className="mt-3 text-red-500">Link YouTube tidak valid</p>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-700 text-white rounded-lg disabled:bg-gray-400"
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <span className="px-4 py-2">
          Halaman {currentPage} dari {totalPages}
        </span>
        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-700 text-white rounded-lg disabled:bg-gray-400"
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
    </div>
  );
}