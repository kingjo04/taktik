"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Link from "next/link";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors("");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://api.taktix.co.id/login",
        { email: formData.email, password: formData.password },
        { headers: { "Content-Type": "application/json" } }
      );

      const data = response.data;

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("name", data.user.name || "");
        localStorage.setItem("photo_profile", data.user.photo_profile || "");
        localStorage.setItem("email", data.user.email || "");

        Swal.fire({
          title: "Login Berhasil!",
          text: "Mengalihkan ke halaman utama...",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#4f46e5",
          customClass: {
            popup: "rounded-xl",
            confirmButton: "px-6 py-2 font-semibold",
          },
        }).then(() => router.push("/program"));
      } else {
        throw new Error("Token tidak ditemukan dalam respons.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setErrors("Token Tidak Valid. Silahkan login kembali.");
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
              <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-900 tracking-tight">Selamat Datang</h1>
              <p className="mt-2 sm:mt-3 text-sm sm:text-base text-gray-600 font-medium">
                Masuk untuk menjelajahi pengalaman belajar bersama Taktix
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 sm:mt-10 flex flex-col gap-5 sm:gap-6">
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 sm:px-5 py-3 rounded-lg border border-gray-200 bg-gray-50 placeholder-gray-400 text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                />
              </div>

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
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>

              {errors && (
                <p className="text-red-500 text-sm sm:text-base text-center font-medium animate-pulse">{errors}</p>
              )}

              <button
                type="submit"
                className="bg-blue-900 text-white py-3 rounded-full font-semibold text-sm sm:text-base hover:bg-blue-800 transition-all duration-300 hover:shadow-md"
              >
                Masuk Sekarangas
              </button>

              <p className="text-center text-sm sm:text-base text-gray-600 font-medium mt-4 sm:mt-5">
                Belum punya akun?{" "}
                <Link href="/register" className="text-blue-800 font-semibold hover:text-blue-900 transition-colors duration-200">
                  Daftar Sekarang
                </Link>
              </p>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
