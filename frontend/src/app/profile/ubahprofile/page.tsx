"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Swal from "sweetalert2";

interface Province {
  id: number; // Disesuaikan dengan tipe data ID dari API
  name: string;
}

const UbahProfile = () => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone_number: "",
    gender: 1,
    photo_profile: "",
    school: "",
    province_id: "",
  });

  const router = useRouter();

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "https://api.taktix.co.id/provinces",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProvinces(res.data); // Update provinces state
      } catch (error) {
        console.error("Failed to fetch provinces:", error);
      }
    };

    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(
          "https://api.taktix.co.id/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFormData({
          ...formData,
          ...res.data,
          province_id: res.data.province_id
            ? res.data.province_id.toString()
            : "",
        });
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    fetchProvinces();
    fetchUserProfile();
  }, []);


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.put(
        "https://api.taktix.co.id/profile/edit",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        title: "Sukses!",
        text: "Profil berhasil diperbarui.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        router.back();
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorResponse = error.response.data;
        let errorMessage = "Terjadi kesalahan saat memperbarui profil.";

        if (
          errorResponse.message === "Validation error" &&
          errorResponse.errorStacks
        ) {
          const messages = errorResponse.errorStacks
            .map((err: any) => err.msg)
            .join(", ");
          errorMessage = messages;
        }

        Swal.fire({
          title: "Gagal!",
          text: errorMessage,
          icon: "error",
          confirmButtonText: "OK",
        });
      } else {
        console.error("Failed to update profile:", error);
        Swal.fire({
          title: "Gagal!",
          text: "Terjadi kesalahan saat memperbarui profil.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };

  return (
    <div className="mx-40 my-14">
      <div className="flex items-center">
        <button type="button" className="mt-1" onClick={() => router.back()}>
          <FontAwesomeIcon icon={faArrowLeft} className="size-5 opacity-75" />
        </button>
        <h1 className="ml-4 my-2">Ubah Profil</h1>
      </div>

      <form onSubmit={handleSubmit} className="mx-auto max-w-[500px]">
        {[
          { id: "name", label: "Nama", type: "text" },
          { id: "username", label: "Username", type: "text" },
          { id: "email", label: "Email", type: "email" },
          { id: "phone_number", label: "Nomor HP", type: "tel" },
          { id: "photo_profile", label: "URL Foto Profil", type: "text" },
          { id: "school", label: "Sekolah", type: "text" },
        ].map((field) => (
          <div key={field.id} className="my-6">
            <label
              htmlFor={field.id}
              className="block text-xs font-medium text-gray-700"
            >
              {field.label}
            </label>
            <input
              type={field.type}
              id={field.id}
              name={field.id}
              value={(formData as any)[field.id]}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border shadow-sm sm:text-sm"
              required
            />
          </div>
        ))}

        <div className="my-6">
          <label
            htmlFor="gender"
            className="block text-xs font-medium text-gray-700"
          >
            Jenis Kelamin
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            <option value={1}>Perempuan</option>
            <option value={2}>Laki-Laki</option>
          </select>
        </div>

        <div className="my-6">
          <label
            htmlFor="province_id"
            className="block text-xs font-medium text-gray-700"
          >
            Provinsi
          </label>
          <select
            id="province_id"
            name="province_id"
            value={formData.province_id}
            onChange={handleChange}
            className="bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
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

        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="px-16 py-3 text-lg font-semibold text-white bg-blue-700 rounded-[30px]"
          >
            Simpan
          </button>
        </div>
      </form>
    </div>
  );
};

export default UbahProfile;
