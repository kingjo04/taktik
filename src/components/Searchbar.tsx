
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faGraduationCap,
  faUser,
  faPencil,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isWideScreen, setIsWideScreen] = useState(false);

  useEffect(() => {
    const checkScreenWidth = () => {
      setIsWideScreen(window.innerWidth >= 768);
    };
    checkScreenWidth();
    window.addEventListener("resize", checkScreenWidth);
    return () => window.removeEventListener("resize", checkScreenWidth);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`fixed top-0 left-0 h-screen bg-gradient-to-b from-blue-800 to-blue-600 text-white shadow-lg z-40 transition-all duration-300 ${
        isOpen ? "w-64" : "w-16"
      }`}
    >
      <div className="flex flex-col h-full justify-between items-center py-6">
        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
        >
          <FontAwesomeIcon icon={isOpen ? faTimes : faBars} size="lg" />
        </button>

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
        <div className="flex flex-col space-y-6 w-full px-2">
          <a
            href="/"
            className={`group relative flex items-center rounded-lg p-3 ${
              isOpen ? "bg-blue-700/30 hover:bg-blue-500/50" : "hover:bg-blue-500/50"
            } transition-all duration-200`}
          >
            <FontAwesomeIcon icon={faHome} className="text-xl opacity-80 group-hover:opacity-100 mr-3" />
            {isOpen && isWideScreen && (
              <span className="text-sm font-medium text-white">Dashboard</span>
            )}
            {!isOpen && isWideScreen && (
              <span className="invisible absolute left-14 top-1/2 -translate-y-1/2 rounded-md bg-gray-900 px-3 py-1.5 text-xs font-medium text-white group-hover:visible">
                Dashboard
              </span>
            )}
          </a>

          <a
            href="/universitas"
            className={`group relative flex items-center rounded-lg p-3 ${
              isOpen ? "bg-blue-700/30 hover:bg-blue-500/50" : "hover:bg-blue-500/50"
            } transition-all duration-200`}
          >
            <FontAwesomeIcon icon={faGraduationCap} className="text-xl opacity-80 group-hover:opacity-100 mr-3" />
            {isOpen && isWideScreen && (
              <span className="text-sm font-medium text-white">Universitas</span>
            )}
            {!isOpen && isWideScreen && (
              <span className="invisible absolute left-14 top-1/2 -translate-y-1/2 rounded-md bg-gray-900 px-3 py-1.5 text-xs font-medium text-white group-hover:visible">
                Universitas
              </span>
            )}
          </a>

          <a
            href="/program"
            className={`group relative flex items-center rounded-lg p-3 ${
              isOpen ? "bg-blue-700/30 hover:bg-blue-500/50" : "hover:bg-blue-500/50"
            } transition-all duration-200`}
          >
            <FontAwesomeIcon icon={faPencil} className="text-xl opacity-80 group-hover:opacity-100 mr-3" />
            {isOpen && isWideScreen && (
              <span className="text-sm font-medium text-white">Program</span>
            )}
            {!isOpen && isWideScreen && (
              <span className="invisible absolute left-14 top-1/2 -translate-y-1/2 rounded-md bg-gray-900 px-3 py-1.5 text-xs font-medium text-white group-hover:visible">
                Program
              </span>
            )}
          </a>

          <a
            href="/profile"
            className={`group relative flex items-center rounded-lg p-3 ${
              isOpen ? "bg-blue-700/30 hover:bg-blue-500/50" : "hover:bg-blue-500/50"
            } transition-all duration-200`}
          >
            <FontAwesomeIcon icon={faUser} className="text-xl opacity-80 group-hover:opacity-100 mr-3" />
            {isOpen && isWideScreen && (
              <span className="text-sm font-medium text-white">Profile</span>
            )}
            {!isOpen && isWideScreen && (
              <span className="invisible absolute left-14 top-1/2 -translate-y-1/2 rounded-md bg-gray-900 px-3 py-1.5 text-xs font-medium text-white group-hover:visible">
                Profile
              </span>
            )}
          </a>
        </div>

        {/* Spacer */}
        <div></div>
      </div>
    </div>
  );
};

export default Sidebar;