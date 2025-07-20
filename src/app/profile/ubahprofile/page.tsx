"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faUserEdit } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Swal from "sweetalert2";

interface Province {
  id: number;
  name: string;
}

const UbahProfile = () => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone_number: "",
    school: "",
    gender: 2002,
    province_id: "",
    birth_date: "",
  });

  const router = useRouter();

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/provinces", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProvinces(res.data);
      } catch (error) {
        console.error("Failed to fetch provinces:", error);
      }
    };

    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const apiBirthDate = res.data.birth_date
          ? new Date(res.data.birth_date).toISOString().split("T")[0]
          : "";
        setFormData({
          name: res.data.name || "",
          username: res.data.username || "",
          email: res.data.email || "",
          phone_number: res.data.phone_number || "",
          school: res.data.school || "",
          gender: res.data.gender || 2002,
          province_id: res.data.province_id ? res.data.province_id.toString() : "",
          birth_date: apiBirthDate,
        });
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    fetchProvinces();
    fetchUserProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const allowedFields = {
      name: formData.name,
      username: formData.username,
      email: formData.email,
      phone_number: formData.phone_number,
      school: formData.school,
      gender: parseInt(formData.gender.toString()),
      province_id: parseInt(formData.province_id),
      birth_date: formData.birth_date,
    };

    try {
      const response = await axios.patch("/api/profile/edit", allowedFields, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
        }

        Swal.fire({
          title: "Sukses!",
          text: "Profil berhasil diperbarui.",
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
        let errorMessage = "Terjadi kesalahan saat memperbarui profil.";

        if (errorResponse.message === "Validation error" && errorResponse.errorStacks) {
          const messages = errorResponse.errorStacks.map((err: any) => err.msg).join(", ");
          errorMessage = messages || "Validasi gagal.";
        }

        Swal.fire({
          title: "Gagal!",
          text: errorMessage,
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: "#EF4444",
        });
      } else {
        console.error("Failed to update profile:", error);
        Swal.fire({
          title: "Gagal!",
          text: "Terjadi kesalahan saat memperbarui profil.",
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: "#EF4444",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 flex items-center justify-center py-4 sm:py-6 md:py-8 px-4 sm:px-6 lg:px-12">
      <div className="max-w-2xl w-full">
        <button
          onClick={() => router.back()}
          className="mb-4 sm:mb-6 p-2 sm:p-3 bg-white rounded-full shadow-md hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="text-indigo-600 text-lg sm:text-xl" />
        </button>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-blue-600 mb-6 sm:mb-8 text-center animate-fade-in">
          Edit Your Profile
        </h1>

        <form onSubmit={handleSubmit} className="mx-auto max-w-md lg:max-w-lg w-full bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 border border-indigo-100 hover:shadow-2xl transition-all duration-300">
          {[
            { id: "name", label: "Nama", type: "text" },
            { id: "username", label: "Username", type: "text" },
            { id: "email", label: "Email", type: "email" },
            { id: "phone_number", label: "Nomor HP", type: "tel" },
            { id: "school", label: "Sekolah", type: "text" },
            { id: "birth_date", label: "Tanggal Lahir", type: "date" },
          ].map((field) => (
            <div key={field.id} className="mb-5">
              <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
                {field.label}
              </label>
              <input
                type={field.type}
                id={field.id}
                name={field.id}
                value={formData[field.id as keyof typeof formData]}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 p-3 text-sm transition-all duration-200 placeholder-gray-400"
                required
              />
            </div>
          ))}

          <div className="mb-5">
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
              Jenis Kelamin
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 p-3 text-sm bg-white transition-all duration-200"
            >
              <option value={2002}>Perempuan</option>
              <option value={2001}>Laki-Laki</option>
            </select>
          </div>

          <div className="mb-6">
            <label htmlFor="province_id" className="block text-sm font-medium text-gray-700">
              Provinsi
            </label>
            <select
              id="province_id"
              name="province_id"
              value={formData.province_id}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 p-3 text-sm bg-white transition-all duration-200"
              required
            >
              <option value="" disabled>
                Pilih Provinsi
              </option>
              {provinces.map((province) => (
                <option key={province.id} value={province.id}>
                  {province.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full max-w-xs px-6 py-3 text-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 animate-pulse-slow"
            >
              <FontAwesomeIcon icon={faUserEdit} /> Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UbahProfile;
