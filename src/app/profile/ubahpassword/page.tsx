"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faEye, faEyeSlash, faLock } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Swal from "sweetalert2";

const UbahPassword = () => {
  const router = useRouter();
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    old_password: "",
    new_password: "",
    password_confirmation: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const toggleShowPassword = (field: string) => {
    if (field === "old") setShowOldPassword(!showOldPassword);
    if (field === "new") setShowNewPassword(!showNewPassword);
    if (field === "confirm") setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (formData.new_password !== formData.password_confirmation) {
      Swal.fire({
        title: "Gagal!",
        text: "Password baru dan konfirmasi password tidak cocok.",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#EF4444",
      });
      return;
    }

    try {
      const response = await axios.patch(
        "https://api.taktix.co.id/profile/password",
        {
          old_password: formData.old_password,
          new_password: formData.new_password,
          password_confirmation: formData.password_confirmation,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        Swal.fire({
          title: "Sukses!",
          text: "Password berhasil diperbarui.",
          icon: "success",
          confirmButtonText: "OK",
          timer: 2000,
          timerProgressBar: true,
          confirmButtonColor: "#4F46E5",
        }).then(() => {
          router.push("/profile");
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorResponse = error.response.data;
        let errorMessage = "Terjadi kesalahan saat mengubah password.";

        if (errorResponse.error && errorResponse.errorStacks) {
          errorMessage = errorResponse.errorStacks
            .map((err: { msg: string }) => err.msg)
            .join(", ");
        } else if (errorResponse.message) {
          errorMessage = errorResponse.message;
        }

        Swal.fire({
          title: "Gagal!",
          text: errorMessage,
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: "#EF4444",
        });
      } else {
        console.error("Failed to update password:", error);
        Swal.fire({
          title: "Gagal!",
          text: "Terjadi kesalahan saat mengubah password.",
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: "#EF4444",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 flex items-center justify-center py-4 sm:py-6 md:py-8 px-4 sm:px-6 lg:px-12">
      <div className="max-w-2xl lg:max-w-3xl w-full">
        <button
          onClick={() => router.back()}
          className="mb-4 sm:mb-6 p-2 sm:p-3 bg-white rounded-full shadow-md hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="text-indigo-600 text-lg sm:text-xl" />
        </button>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-blue-600 mb-6 sm:mb-8 text-center animate-fade-in">
          Change Your Password
        </h1>

        <form onSubmit={handleSubmit} className="mx-auto max-w-md lg:max-w-lg w-full bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 border border-indigo-100 hover:shadow-2xl transition-all duration-300">
          {[
            { id: "old_password", label: "Password Lama" },
            { id: "new_password", label: "Password Baru" },
            { id: "password_confirmation", label: "Konfirmasi Password Baru" },
          ].map((field) => (
            <div key={field.id} className="mb-4 sm:mb-6">
              <label htmlFor={field.id} className="block text-sm sm:text-base font-medium text-gray-700">
                {field.label}
              </label>
              <div className="relative mt-1 sm:mt-2">
                <input
                  type={field.id === "old_password" ? (showOldPassword ? "text" : "password") : field.id === "new_password" ? (showNewPassword ? "text" : "password") : showConfirmPassword ? "text" : "password"}
                  id={field.id}
                  name={field.id}
                  value={formData[field.id as keyof typeof formData]}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 p-2 sm:p-3 text-sm sm:text-base transition-all duration-200 placeholder-gray-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => toggleShowPassword(field.id === "old_password" ? "old" : field.id === "new_password" ? "new" : "confirm")}
                  className="absolute inset-y-0 right-0 px-2 sm:px-3 flex items-center text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <FontAwesomeIcon icon={field.id === "old_password" ? (showOldPassword ? faEyeSlash : faEye) : field.id === "new_password" ? (showNewPassword ? faEyeSlash : faEye) : showConfirmPassword ? faEyeSlash : faEye} className="text-lg sm:text-xl" />
                </button>
              </div>
            </div>
          ))}

          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full max-w-xs lg:max-w-sm px-4 sm:px-6 py-2 sm:py-3 text-base sm:text-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 animate-pulse-slow"
            >
              <FontAwesomeIcon icon={faLock} /> Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UbahPassword;
