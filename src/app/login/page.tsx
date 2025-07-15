"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faRotateRight } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";

const supabaseUrl = "https://ieknphduleynhuiaqsuc.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlla25waGR1bGV5bmh1aWFxc3VjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MTY4ODAsImV4cCI6MjA2ODA5Mjg4MH0.iZBnS3uGs68CmqrhQYAJdCZZGRqlKEThrm0B0FqyPVs";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.session?.access_token) {
        localStorage.setItem("token", data.session.access_token);

        // Handle name dari user_metadata atau email dengan fallback aman
        const name =
          data.user?.user_metadata?.name ||
          (data.user?.email ? data.user.email.split("@")[0] : "") ||
          "";
        const photoProfile = data.user?.user_metadata?.photo_profile || "";
        const emailValue = data.user?.email || "";

        localStorage.setItem("name", name);
        localStorage.setItem("photo_profile", photoProfile);
        localStorage.setItem("email", emailValue);

        Swal.fire({
          icon: "success",
          title: "Login Berhasil",
          text: "Anda akan diarahkan ke halaman utama.",
        }).then(() => {
          router.push("/"); // Arahkan ke halaman utama atau dashboard
        });
      } else {
        throw new Error("Token tidak ditemukan.");
      }
    } catch (err) {
      setError((err as Error).message || "Gagal login. Cek email atau password.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTryAgain = () => {
    setError(null);
    fetchProgramDetail(); // Asumsi ada fungsi ini, sesuaikan kalau beda
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50">
        <div className="flex items-center gap-2 text-indigo-600 animate-pulse">
          <div className="w-6 h-6 border-4 border-t-indigo-600 border-b-transparent rounded-full animate-spin"></div>
          <span className="text-xl">Memuat...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 p-4 sm:p-6 ml-[64px] animate-fade-in">
      <div className="flex items-center mb-6">
        <button
          type="button"
          className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-all duration-300"
          onClick={() => router.back()}
        >
          <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5 text-indigo-600" />
        </button>
        <h1 className="ml-4 text-2xl sm:text-3xl font-bold text-indigo-800">Login</h1>
      </div>

      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            disabled={loading}
          >
            Login
          </button>
        </form>
        {error && (
          <button
            onClick={handleTryAgain}
            className="mt-4 flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300"
          >
            <FontAwesomeIcon icon={faRotateRight} className="w-4 h-4" />
            <span>Coba Lagi</span>
          </button>
        )}
        <p className="mt-4 text-center text-sm text-gray-600">
          Belum punya akun?{" "}
          <Link href="/register" className="text-indigo-600 hover:underline">
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
