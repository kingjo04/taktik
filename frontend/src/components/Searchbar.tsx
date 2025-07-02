import React, { useState } from "react";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="flex justify-center items-center w-full py-4">
      <div className="relative w-full max-w-md rounded-lg overflow-hidden bg-white shadow-sm">
        <div className="flex items-center px-3 py-2 focus-within:border-blue-500 border rounded-lg">
          <svg
            className="w-5 h-5 text-gray-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
          <input
            className="ml-3 block w-full pl-3 py-2 border-none rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Search"
            value={searchTerm}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
