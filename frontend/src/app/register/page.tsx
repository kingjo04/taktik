"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import Link from "next/link";
import Swal from "sweetalert2";

export default function LoginPage() {
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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const validateUsername = async () => {
    try {
      const response = await axios.post(
        "https://api.taktix.co.id/register/validation/1",
        {
          name: formData.name,
          username: formData.username,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.error) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          username: "Username sudah terpakai",
        }));
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error validating username:", error);
      setErrors((prevErrors) => ({
        ...prevErrors,
        username: "Username tidak bisa tervalidasi",
      }));
      return false;
    }
  };

  const validateEmailPhone = async () => {
    try {
      const response = await axios.post(
        "https://api.taktix.co.id/register/validation/2",
        {
          email: formData.email,
          phone_number: formData.phone_number,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.error) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          emailPhone: "Email atau Nomor Telepon sudah terdaftar",
        }));
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error validating email/phone:", error);
      setErrors((prevErrors) => ({
        ...prevErrors,
        emailPhone: "Email/Nomor Telepon tidak bisa tervalidasi",
      }));
      return false;
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isUsernameValid = await validateUsername();
    const isEmailPhoneValid = await validateEmailPhone();

    if (!isUsernameValid || !isEmailPhoneValid) {
      return;
    }

    try {
      const response = await axios.post(
        "https://api.taktix.co.id/register",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);

      // Menggunakan SweetAlert untuk sukses registrasi
      Swal.fire({
        title: "Registrasi berhasil",
        text: "Silahkan cek email untuk konfirmasi",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#81f542",
      });
    } catch (error) {
      console.error("Error registering:", error);

      // Jika gagal, menampilkan pesan error dengan SweetAlert
      Swal.fire({
        title: "Registrasi gagal",
        text: "Terjadi kesalahan saat registrasi. Silahkan coba lagi.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div style={{ backgroundColor: "#8aa8f4", minHeight: "100vh" }}>
      <header className="sticky top-0">
        <div
          className="flex gap-5 justify-between px-11 py-3.5 font-medium text-white max-md:flex-wrap max-md:px-5"
          style={{ backgroundColor: "#8AA8F4" }}
        >
          <div className="flex gap-5 items-center text-2xl">
            <img
              loading="lazy"
              srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/e65299e39c2b2a80b59b1c39be7b6eb50ec4951b8157f707c49ddb3037738ec2?apiKey=19816b9fb5bc4b9987983517808491df&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/e65299e39c2b2a80b59b1c39be7b6eb50ec4951b8157f707c49ddb3037738ec2?apiKey=19816b9fb5bc4b9987983517808491df&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/e65299e39c2b2a80b59b1c39be7b6eb50ec4951b8157f707c49ddb3037738ec2?apiKey=19816b9fb5bc4b9987983517808491df&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/e65299e39c2b2a80b59b1c39be7b6eb50ec4951b8157f707c49ddb3037738ec2?apiKey=19816b9fb5bc4b9987983517808491df&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/e65299e39c2b2a80b59b1c39be7b6eb50ec4951b8157f707c49ddb3037738ec2?apiKey=19816b9fb5bc4b9987983517808491df&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/e65299e39c2b2a80b59b1c39be7b6eb50ec4951b8157f707c49ddb3037738ec2?apiKey=19816b9fb5bc4b9987983517808491df&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/e65299e39c2b2a80b59b1c39be7b6eb50ec4951b8157f707c49ddb3037738ec2?apiKey=19816b9fb5bc4b9987983517808491df&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/e65299e39c2b2a80b59b1c39be7b6eb50ec4951b8157f707c49ddb3037738ec2?apiKey=19816b9fb5bc4b9987983517808491df&"
              className="shrink-0 self-stretch aspect-[1.11] w-[61px]"
            />
            <Link
              href={""}
              className="flex-auto self-stretch my-auto mx-4 text-lg"
            >
              Home
            </Link>
            <Link
              href={""}
              className="flex-auto self-stretch my-auto mx-4 text-lg"
            >
              About
            </Link>
            <Link
              href={""}
              className="flex-auto self-stretch my-auto mx-4 text-lg"
            >
              Blog
            </Link>
            <Link
              href={""}
              className="flex-auto self-stretch my-auto mx-4 text-lg"
            >
              Support
            </Link>
          </div>
          <div className="flex gap-5 justify-between my-auto text-base">
            <button className="justify-center px-6 py-3.5 bg-blue-500 rounded-lg max-md:px-5">
              Download Now
            </button>
          </div>
        </div>
      </header>

      <div className="h-[100vh] items-center flex justify-center px-5 lg:px-0">
        <div className="max-w-screen-xl bg-white border shadow sm:rounded-lg flex justify-center flex-1">
          <div className="flex-1 bg-blue-900 text-center hidden md:flex">
            <div
              className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(https://www.tailwindtap.com/assets/common/marketing.svg)`,
              }}
            ></div>
          </div>
          <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
            <div className=" flex flex-col items-center">
              <div className="text-center">
                <h1 className="text-2xl xl:text-4xl font-extrabold text-blue-900">
                  Registrasi
                </h1>
                <p className="text-[12px] mt-4 text-gray-500">
                  Silahkan registrasi akun anda
                </p>
              </div>
              <form onSubmit={handleSubmit} className="w-full flex-1 mt-8">
                <div className="mx-auto max-w-xs">
                  <input
                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm"
                    type="text"
                    name="name"
                    placeholder="Nama Lengkap"
                    onChange={handleChange}
                    value={formData.name}
                  />
                  <input
                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm mt-4"
                    type="text"
                    name="username"
                    placeholder="Username"
                    onChange={handleChange}
                    value={formData.username}
                  />
                  {errors.username && (
                    <p className="text-red-500 text-sm">{errors.username}</p>
                  )}
                  <input
                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm mt-4"
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                    value={formData.email}
                  />
                  <input
                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm mt-4"
                    type="text"
                    name="phone_number"
                    placeholder="Nomor Telepon"
                    onChange={handleChange}
                    value={formData.phone_number}
                  />
                  {errors.emailPhone && (
                    <p className="text-red-500 text-sm">{errors.emailPhone}</p>
                  )}
                  <input
                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm mt-4"
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                    value={formData.password}
                  />
                  <input
                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm mt-4"
                    type="password"
                    name="password_confirmation"
                    placeholder="Konfirmasi Password"
                    onChange={handleChange}
                    value={formData.password_confirmation}
                  />
                  <button
                    type="submit"
                    className="mt-4 w-full tracking-wide font-semibold bg-blue-500 text-gray-100 w-full py-4 rounded-lg hover:bg-blue-600 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                  >
                    <svg
                      className="w-6 h-6 -ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2m16-10V5a2 2 0 00-2-2h-3.5a2 2 0 00-2 2v6m4 10h-4"
                      ></path>
                    </svg>
                    <span className="ml-3">Daftar</span>
                  </button>
                  <p className="mt-8 text-sm text-gray-500 text-center">
                    Sudah memiliki akun?{" "}
                    <Link href="/login" className="border-b border-gray-500">
                      Login disini
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
