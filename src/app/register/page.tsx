"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import Link from "next/link";
import Swal from "sweetalert2";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone_number: "",
    password: "",
    password_confirmation: "",
    role_id: 1001,
  });

  const [errors, setErrors] = useState({
    username: "",
    emailPhone: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const supabaseUrl = "https://ieknphduleynhuiaqsuc.supabase.co";
  const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlla25waGR1bGV5bmh1aWFxc3VjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MTY4ODAsImV4cCI6MjA2ODA5Mjg4MH0.iZBnS3uGs68CmqrhQYAJdCZZGRqlKEThrm0B0FqyPVs";
  const supabase = createClient(supabaseUrl, supabaseKey);

  const normalizePhoneNumber = (phone: string): string => {
    let cleaned = phone.replace(/\D/g, ""); // Remove non-digits
    if (cleaned.startsWith("08")) {
      return cleaned.substring(1); // Remove leading '0'
    } else if (cleaned.startsWith("62")) {
      return "8" + cleaned.substring(2); // Replace '62' with '8'
    } else if (cleaned.startsWith("+62")) {
      return "8" + cleaned.substring(3); // Replace '+62' with '8'
    }
    return cleaned; // Return as-is if no normalization needed
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedValue = name === "phone_number" ? normalizePhoneNumber(value) : value;
    setFormData({ ...formData, [name]: updatedValue });
    setErrors({ ...errors, [name === "phone_number" ? "emailPhone" : name]: "" });
  };

  const validateUsername = async () => {
    try {
      const response = await axios.post(
        "https://api.taktix.co.id/register/validation/1",
        { name: formData.name, username: formData.username },
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.data.error) {
        setErrors((prev) => ({ ...prev, username: "Username sudah terpakai" }));
        return false;
      }
      return true;
    } catch {
      setErrors((prev) => ({
        ...prev,
        username: "Username tidak bisa tervalidasi",
      }));
      return false;
    }
  };

  const validateEmailPhone = async () => {
    try {
      const response = await axios.post(
        "https://api.taktix.co.id/register/validation/2",
        { email: formData.email, phone_number: normalizePhoneNumber(formData.phone_number) },
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.data.error) {
        setErrors((prev) => ({
          ...prev,
          emailPhone: "Email atau Nomor Telepon sudah terdaftar",
        }));
        return false;
      }
      return true;
    } catch {
      setErrors((prev) => ({
        ...prev,
        emailPhone: "Email/Nomor Telepon tidak bisa tervalidasi",
      }));
      return false;
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validUsername = await validateUsername();
    const validEmailPhone = await validateEmailPhone();
    if (!validUsername || !validEmailPhone) return;

    try {
      // Registrasi ke API asli
      const apiResponse = await axios.post(
        "https://api.taktix.co.id/register",
        { ...formData, phone_number: normalizePhoneNumber(formData.phone_number) },
        { headers: { "Content-Type": "application/json" } }
      );

      // Registrasi ke Supabase Auth
      const { data: supabaseData, error: supabaseError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: { name: formData.name, username: formData.username, phone_number: normalizePhoneNumber(formData.phone_number) },
        },
      });

      if (supabaseError) throw supabaseError;

      // Simpan token Supabase kalau ada
      if (supabaseData.session) {
        localStorage.setItem("token", supabaseData.session.access_token);
      }

      Swal.fire({
        title: "Registrasi Berhasil!",
        text: "Silakan cek email untuk konfirmasi",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#4f46e5",
        customClass: {
          popup: "rounded-xl",
          confirmButton: "px-6 py-2 font-semibold",
        },
      }).then(() => router.push("/login"));
    } catch (error) {
      console.error("Registrasi error:", error);
      Swal.fire({
        title: "Registrasi Gagal",
        text: "Terjadi kesalahan saat registrasi. Coba lagi.",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#4f46e5",
        customClass: {
          popup: "rounded-xl",
          confirmButton: "px-6 py-2 font-semibold",
        },
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-indigo-100 flex flex-col">
      <header className="sticky top-0 z-20 bg-blue-700 shadow-md">
        <div className="flex items-center justify-between px-4 py-4 max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 sm:gap-6">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/e65299e39c2b2a80b59b1c39be7b6eb50ec4951b8157f707c49ddb3037738ec2?apiKey=19816b9fb5bc4b9987983517808491df&width=2000"
              className="w-12 sm:w-[60px] transition-transform duration-300 hover:scale-105"
              alt="Logo"
            />
            <nav className="hidden md:flex gap-6 lg:gap-8 text-sm font-medium text-white">
              <Link href="/" className="hover:text-blue-200 transition-colors duration-200">Home</Link>
              <Link href="/about" className="hover:text-blue-200 transition-colors duration-200">About</Link>
              <Link href="/blog" className="hover:text-blue-200 transition-colors duration-200">Blog</Link>
              <Link href="/support" className="hover:text-blue-200 transition-colors duration-200">Support</Link>
            </nav>
          </div>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold text-sm hover:bg-blue-600 transition-all duration-300 hover:shadow-lg sm:px-5">
            Download Now
          </button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 pt-20 pb-12 sm:px-6 sm:pt-24 lg:px-8 lg:pt-28">
        <div className="w-full max-w-md sm:max-w-lg lg:max-w-4xl bg-white rounded-2xl shadow-2xl flex overflow-hidden transform transition-all duration-500 hover:shadow-3xl">
          <div className="flex-1 hidden md:flex bg-blue-900 relative">
            <img
              src="https://www.tailwindtap.com/assets/common/marketing.svg"
              className="m-8 md:m-12 xl:m-16 w-full h-full object-contain transform transition-transform duration-500 hover:scale-105"
              alt="Marketing Illustration"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>

          <div className="w-full md:w-1/2 p-6 sm:p-8 lg:p-12">
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-900 tracking-tight">Registrasi</h1>
              <p className="mt-2 sm:mt-3 text-sm sm:text-base text-gray-600 font-medium">
                Silakan isi data Anda untuk memulai
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 sm:mt-10 flex flex-col gap-5 sm:gap-6">
              <input
                type="text"
                name="name"
                placeholder="Nama Lengkap"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 sm:px-5 py-3 rounded-lg border border-gray-200 bg-gray-50 placeholder-gray-400 text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
              />
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 sm:px-5 py-3 rounded-lg border border-gray-200 bg-gray-50 placeholder-gray-400 text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
              />
              {errors.username && (
                <p className="text-red-500 text-sm sm:text-base text-center font-medium animate-pulse">{errors.username}</p>
              )}

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 sm:px-5 py-3 rounded-lg border border-gray-200 bg-gray-50 placeholder-gray-400 text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
              />
              <input
                type="text"
                name="phone_number"
                placeholder="Nomor Telepon (contoh: 08123456789)"
                value={formData.phone_number}
                onChange={handleChange}
                className="w-full px-4 sm:px-5 py-3 rounded-lg border border-gray-200 bg-gray-50 placeholder-gray-400 text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
              />
              {errors.emailPhone && (
                <p className="text-red-500 text-sm sm:text-base text-center font-medium animate-pulse">{errors.emailPhone}</p>
              )}

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 sm:px-5 py-3 pr-12 rounded-lg border border-gray-200 bg-gray-50 placeholder-gray-400 text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors duration-200"
                >
                  {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="password_confirmation"
                  placeholder="Konfirmasi Password"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  className="w-full px-4 sm:px-5 py-3 pr-12 rounded-lg border border-gray-200 bg-gray-50 placeholder-gray-400 text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors duration-200"
                >
                  {showConfirmPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-900 text-white py-3 rounded-full font-semibold text-sm sm:text-base hover:bg-blue-800 transition-all duration-300 hover:shadow-md flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2m16-10V5a2 2 0 00-2-2h-3.5a2 2 0 00-2 2v6" />
                </svg>
                Daftar Sekarang
              </button>

              <p className="text-center text-sm sm:text-base text-gray-600 font-medium mt-4 sm:mt-5">
                Sudah punya akun?{" "}
                <Link href="/login" className="text-blue-800 font-semibold hover:text-blue-900 transition-colors duration-200">
                  Login di sini
                </Link>
              </p>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}