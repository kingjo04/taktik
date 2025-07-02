// "use client";
// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import {jwtDecode} from "jwt-decode";
// import axios from "axios";
// import Swal from "sweetalert2";

// export default function KerjakanSoal({ params }: { params: { id: string } }) {
//   const [questions, setQuestions] = useState<any[]>([]);
//   const [dataSoal, setDataSoal] = useState({
//     title: "",
//     category_id: "",
//     duration: 0, // Duration in minutes
//     total_question: 0,
//   });
//   const [selectedOptions, setSelectedOptions] = useState<{
//     [key: number]: string;
//   }>({});
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [timeRemaining, setTimeRemaining] = useState<number | null>(null); // Timer state in seconds
//   const [isTimeOver, setIsTimeOver] = useState(false); // To track when time is over
//   const router = useRouter();
//   const { id } = params;

//   // Fetch soal data and initialize timer
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (id) {
//       axios
//         .get(`http://localhost:3500/api/soali/${id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         .then((response) => {
//           const soalData = response.data;
//           setDataSoal(soalData);
//           setQuestions(soalData.questions);

//           // Initialize timer in seconds
//           const durationInSeconds = soalData.duration * 60;
//           setTimeRemaining(durationInSeconds);
//         })
//         .catch((error) => {
//           console.error("Error fetching soal data:", error);
//         });
//     }
//   }, [id]);

//   // Timer countdown effect
//   useEffect(() => {
//     if (timeRemaining !== null && timeRemaining > 0) {
//       const timer = setInterval(() => {
//         setTimeRemaining((prev) => (prev !== null ? prev - 1 : 0));
//       }, 1000);

//       return () => clearInterval(timer);
//     } else if (timeRemaining === 0 && !isTimeOver) {
//       setIsTimeOver(true); // Trigger automatic submission only once
//     }
//   }, [timeRemaining, isTimeOver]);

//   // Handle automatic submission when time is over
//   useEffect(() => {
//     if (isTimeOver) {
//       Swal.fire({
//         title: "Waktu Habis",
//         text: "Jawaban Anda akan dikirim secara otomatis.",
//         icon: "warning",
//         confirmButtonText: "OK",
//       }).then(() => handleSubmitAnswers());
//     }
//   }, [isTimeOver]);

//   // Format time for display (MM:SS)
//   const formatTime = (seconds: number) => {
//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = seconds % 60;
//     return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
//       .toString()
//       .padStart(2, "0")}`;
//   };

//   const handleAnswerChange = (questionId: number, selectedOption: string) => {
//     setSelectedOptions((prevSelectedOptions) => ({
//       ...prevSelectedOptions,
//       [questionId]: selectedOption,
//     }));
//   };

//   const handleSubmitAnswers = () => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       try {
//         const decoded: any = jwtDecode(token);
//         const userId = decoded.user.id;

//         const answers = Object.entries(selectedOptions).map(([key, value]) => ({
//           question_id: parseInt(key),
//           chosen: value,
//         }));

//         axios
//           .post("http://localhost:3500/api/answers", {
//             user_id: userId,
//             soal_id: id,
//             answers,
//           })
//           .then(() => {
//             Swal.fire({
//               title: "Jawaban Sudah Dikirim",
//               text: "Terima kasih telah mengerjakan soal.",
//               icon: "success",
//               confirmButtonText: "OK",
//             }).then(() => {
//               router.push(`/soal/detail_soal/${id}`);
//             });
//           })
//           .catch((error) => {
//             console.error("Error submitting answers:", error);
//           });
//       } catch (error) {
//         console.error("Invalid token:", error);
//       }
//     }
//   };

//   const currentQuestion = questions[currentQuestionIndex];

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
//       <div className="flex flex-col items-center my-8">
//         <h1 className="text-2xl font-bold">{dataSoal.title}</h1>
//         <p>Total Soal: {dataSoal.total_question}</p>
//         <div className="text-red-500 font-bold text-xl">
//           Waktu Tersisa:{" "}
//           {timeRemaining !== null ? formatTime(timeRemaining) : "Loading..."}
//         </div>
//       </div>

//       {currentQuestion && (
//         <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-6">
//           <h2 className="text-xl font-bold">Soal {currentQuestionIndex + 1}</h2>
//           <p className="text-lg">{currentQuestion.question}</p>
//           <div className="grid grid-cols-2 gap-4">
//             {currentQuestion.options.map((option: any) => (
//               <button
//                 key={option.id}
//                 className={`border rounded-lg p-4 ${
//                   selectedOptions[currentQuestion.id] === option.label
//                     ? "bg-blue-200"
//                     : ""
//                 }`}
//                 onClick={() =>
//                   handleAnswerChange(currentQuestion.id, option.label)
//                 }
//               >
//                 {option.label}. {option.content}
//               </button>
//             ))}
//           </div>
//         </div>
//       )}

//       <div className="flex mt-4">
//         <button
//           className="px-4 py-2 bg-gray-500 text-white rounded-lg"
//           disabled={currentQuestionIndex === 0}
//           onClick={() =>
//             setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))
//           }
//         >
//           Previous
//         </button>
//         <button
//           className="px-4 py-2 bg-blue-500 text-white rounded-lg"
//           disabled={currentQuestionIndex === questions.length - 1}
//           onClick={() =>
//             setCurrentQuestionIndex((prev) =>
//               Math.min(prev + 1, questions.length - 1)
//             )
//           }
//         >
//           Next
//         </button>
//       </div>

//       {currentQuestionIndex === questions.length - 1 && (
//         <button
//           className="mt-6 px-6 py-3 bg-green-500 text-white rounded-lg"
//           onClick={handleSubmitAnswers}
//         >
//           Submit Answers
//         </button>
//       )}
//     </div>
//   );
// }

"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Swal from "sweetalert2";

export default function KerjakanSoal({ params }: { params: { id: string } }) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [dataSoal, setDataSoal] = useState({
    title: "",
    category_id: "",
    duration: 0, // Duration in minutes
    total_question: 0,
  });
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: number]: string;
  }>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (id) {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/soali/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const soalData = response.data;
          setDataSoal(soalData);
          setQuestions(soalData.questions);

          const durationInSeconds = soalData.duration * 60;
          setTimeRemaining(durationInSeconds);
        })
        .catch((error) => {
          console.error("Error fetching soal data:", error);
        });
    }
  }, [id]);

  useEffect(() => {
    if (timeRemaining !== null && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => (prev !== null ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeRemaining === 0) {
      Swal.fire({
        title: "Waktu Habis",
        text: "Jawaban Anda akan dikirim secara otomatis.",
        icon: "warning",
        confirmButtonText: "OK",
      }).then(() => handleSubmitAnswers());
    }
  }, [timeRemaining]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleAnswerChange = (questionId: number, selectedOption: string) => {
    setSelectedOptions((prevSelectedOptions) => ({
      ...prevSelectedOptions,
      [questionId]: selectedOption,
    }));
  };

  const handleSubmitAnswers = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        const userId = decoded.user.id;

        const answers = Object.entries(selectedOptions).map(([key, value]) => ({
          question_id: parseInt(key),
          chosen: value,
        }));

        axios
          .post(`${process.env.NEXT_PUBLIC_API_URL}/answers`, {
            user_id: userId,
            soal_id: id,
            answers,
          })
          .then(() => {
            Swal.fire({
              title: "Jawaban Sudah Dikirim",
              text: "Terima kasih telah mengerjakan soal.",
              icon: "success",
              confirmButtonText: "OK",
            }).then(() => {
              router.push(`/soal/detail_soal/${id}`);
            });
          })
          .catch((error) => {
            console.error("Error submitting answers:", error);
          });
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      {/* Header */}
      <div className="flex flex-col items-center my-8">
        <div className="w-full max-w-[1000px] rounded-[20px] p-8">
          <div className="w-[872px] h-[75px] relative">
            <div className="w-[872px] h-[75px] absolute bg-indigo-300 rounded-[20px]" />
            <div className="w-[558px] h-[75px] absolute bg-blue-700 rounded-[20px]" />
            <div className="absolute left-[28px] top-[11px] text-white text-xl font-semibold">
              {dataSoal.title}
            </div>
            <div className="absolute left-[568px] top-[24px] text-black text-xl font-semibold">
              {dataSoal.total_question} Soal
            </div>
            <div className="absolute left-[28px] top-[42px] text-white text-base font-normal">
              Kategori: {dataSoal.category_id}
            </div>
            {/* Timer */}
            <div className="absolute left-[766px] top-[23px] text-black text-xl font-semibold">
              {timeRemaining !== null ? formatTime(timeRemaining) : "00:00"}
            </div>
          </div>
        </div>
      </div>

      {/* Question */}
      {currentQuestion && (
        <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Soal {currentQuestionIndex + 1}
          </h2>
          <p className="text-lg font-medium text-gray-700 mb-3">
            {currentQuestion.question}
          </p>
          <div className="grid grid-cols-2 gap-4">
            {currentQuestion.options.map((option: any) => (
              <button
                key={option.id}
                className={`border rounded-lg p-4 text-left transition ${
                  selectedOptions[currentQuestion.id] === option.label
                    ? "border-blue-500 bg-blue-100"
                    : "border-gray-300 bg-white"
                }`}
                onClick={() =>
                  handleAnswerChange(currentQuestion.id, option.label)
                }
              >
                <span className="font-bold">{option.label}.</span>{" "}
                {option.content}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center w-full max-w-3xl mt-6">
        <button
          onClick={() =>
            setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))
          }
          className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition"
        >
          Previous
        </button>
        <div className="flex space-x-2">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`px-4 py-2 border rounded-lg ${
                currentQuestionIndex === index
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-700 border-gray-300"
              } transition`}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <button
          onClick={() =>
            setCurrentQuestionIndex((prev) =>
              Math.min(prev + 1, questions.length - 1)
            )
          }
          className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          Next
        </button>
      </div>

      {/* Submit Button */}
      {currentQuestionIndex === questions.length - 1 && (
        <button
          onClick={handleSubmitAnswers}
          className="mt-6 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          Submit Answers
        </button>
      )}
    </div>
  );
}
