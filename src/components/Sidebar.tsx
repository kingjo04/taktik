import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faGraduationCap, faUser, faPencil } from "@fortawesome/free-solid-svg-icons";

const Sidebar = () => {
  const [isWideScreen, setIsWideScreen] = React.useState(false);

  useEffect(() => {
    const checkScreenWidth = () => {
      setIsWideScreen(window.innerWidth >= 768); // Tampilkan tulisan di >= 768px (tablet ke atas)
    };
    checkScreenWidth();
    window.addEventListener("resize", checkScreenWidth);
    return () => window.removeEventListener("resize", checkScreenWidth);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 h-screen bg-gradient-to-b from-blue-800 to-blue-600 text-white shadow-lg z-40 transition-all duration-300"
      style={{ width: "64px" }} // Default lebar 64px (hanya ikon)
    >
      <div className="flex flex-col h-full justify-between items-center py-6">
        {/* Logo */}
        <div className="mb-10">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/e65299e39c2b2a80b59b1c39be7b6eb50ec4951b8157f707c49ddb3037738ec2?apiKey=19816b9fb5bc4b9987983517808491df"
            alt="Logo"
            className="h-10 w-10 object-contain rounded-lg hover:scale-110 transition-transform"
          />
        </div>

        {/* Menu Items */}
        <div className="flex flex-col space-y-4 w-full px-2">
          <a
            href="/"
            className="group flex items-center rounded-lg p-3 bg-blue-700/30 hover:bg-blue-500/50 transition-all duration-200"
          >
            <FontAwesomeIcon icon={faHome} className="text-xl opacity-80 group-hover:opacity-100" />
            {isWideScreen && <span className="ml-3 text-sm font-medium text-white"></span>}
          </a>

          <a
            href="/universitas"
            className="group flex items-center rounded-lg p-3 hover:bg-blue-500/50 transition-all duration-200"
          >
            <FontAwesomeIcon icon={faGraduationCap} className="text-xl opacity-80 group-hover:opacity-100" />
            {isWideScreen && <span className="ml-3 text-sm font-medium text-white"></span>}
          </a>

          <a
            href="/program"
            className="group flex items-center rounded-lg p-3 hover:bg-blue-500/50 transition-all duration-200"
          >
            <FontAwesomeIcon icon={faPencil} className="text-xl opacity-80 group-hover:opacity-100" />
            {isWideScreen && <span className="ml-3 text-sm font-medium text-white"></span>}
          </a>

          <a
            href="/profile"
            className="group flex items-center rounded-lg p-3 hover:bg-blue-500/50 transition-all duration-200"
          >
            <FontAwesomeIcon icon={faUser} className="text-xl opacity-80 group-hover:opacity-100" />
            {isWideScreen && <span className="ml-3 text-sm font-medium text-white"></span>}
          </a>
        </div>

        {/* Spacer */}
        <div></div>
      </div>
    </div>
  );
};

export default Sidebar;