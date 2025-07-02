"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
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
        });
      } else {
        console.error("Failed to update password:", error);
        Swal.fire({
          title: "Gagal!",
          text: "Terjadi kesalahan saat mengubah password.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10 px-4 sm:px-6 lg:px-8"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <button
            type="button"
            className="text-gray-600 hover:text-gray-800 transition-colors"
            onClick={() => router.back()}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-xl" />
          </button>
          <h1 className="ml-4 text-3xl font-bold text-gray-800">Ubah Password</h1>
        </div>

        <form onSubmit={handleSubmit} className="mx-auto max-w-md bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300">
          <div className="mb-5">
            <label htmlFor="old_password" className="block text-sm font-medium text-gray-700">
              Password Lama
            </label>
            <div className="relative">
              <input
                type={showOldPassword ? "text" : "password"}
                id="old_password"
                name="old_password"
                value={formData.old_password}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 p-2.5 text-sm transition-all"
                required
              />
              <button
                type="button"
                onClick={() => toggleShowPassword("old")}
                className="absolute inset-y-0 right-0 px-3 flex items-center mt-1"
              >
                <FontAwesomeIcon
                  icon={showOldPassword ? faEyeSlash : faEye}
                  className="text-lg text-gray-500"
                />
              </button>
            </div>
          </div>

          <div className="mb-5">
            <label htmlFor="new_password" className="block text-sm font-medium text-gray-700">
              Password Baru
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                id="new_password"
                name="new_password"
                value={formData.new_password}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 p-2.5 text-sm transition-all"
                required
              />
              <button
                type="button"
                onClick={() => toggleShowPassword("new")}
                className="absolute inset-y-0 right-0 px-3 flex items-center mt-1"
              >
                <FontAwesomeIcon
                  icon={showNewPassword ? faEyeSlash : faEye}
                  className="text-lg text-gray-500"
                />
              </button>
            </div>
          </div>

          <div className="mb-5">
            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
              Konfirmasi Password Baru
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="password_confirmation"
                name="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 p-2.5 text-sm transition-all"
                required
              />
              <button
                type="button"
                onClick={() => toggleShowPassword("confirm")}
                className="absolute inset-y-0 right-0 px-3 flex items-center mt-1"
              >
                <FontAwesomeIcon
                  icon={showConfirmPassword ? faEyeSlash : faEye}
                  className="text-lg text-gray-500"
                />
              </button>
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="w-full max-w-xs px-6 py-3 text-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UbahPassword;