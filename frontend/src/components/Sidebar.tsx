import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faGraduationCap,
  faUser,
  faPencil
} from "@fortawesome/free-solid-svg-icons";

const Sidebar = () => {
  return (
    <div className="sticky top-0 left-0 h-screen w-16 flex-col justify-between border-e bg-white">
      <div>
        <div className="inline-flex size-16 items-center justify-center">
          <img
            loading="lazy"
            className="grid size-10 place-content-center rounded-lg"
            srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/e65299e39c2b2a80b59b1c39be7b6eb50ec4951b8157f707c49ddb3037738ec2?apiKey=19816b9fb5bc4b9987983517808491df&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/e65299e39c2b2a80b59b1c39be7b6eb50ec4951b8157f707c49ddb3037738ec2?apiKey=19816b9fb5bc4b9987983517808491df&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/e65299e39c2b2a80b59b1c39be7b6eb50ec4951b8157f707c49ddb3037738ec2?apiKey=19816b9fb5bc4b9987983517808491df&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/e65299e39c2b2a80b59b1c39be7b6eb50ec4951b8157f707c49ddb3037738ec2?apiKey=19816b9fb5bc4b9987983517808491df&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/e65299e39c2b2a80b59b1c39be7b6eb50ec4951b8157f707c49ddb3037738ec2?apiKey=19816b9fb5bc4b9987983517808491df&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/e65299e39c2b2a80b59b1c39be7b6eb50ec4951b8157f707c49ddb3037738ec2?apiKey=19816b9fb5bc4b9987983517808491df&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/e65299e39c2b2a80b59b1c39be7b6eb50ec4951b8157f707c49ddb3037738ec2?apiKey=19816b9fb5bc4b9987983517808491df&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/e65299e39c2b2a80b59b1c39be7b6eb50ec4951b8157f707c49ddb3037738ec2?apiKey=19816b9fb5bc4b9987983517808491df&"
          ></img>
        </div>
      </div>

      <div className="border-t border-gray-100">
        <div className="px-2">
          <div className="py-4">
            <a
              href="/"
              className="t group relative flex justify-center rounded bg-blue-50 px-2 py-1.5 text-blue-700"
            >
              <FontAwesomeIcon icon={faHome} className="size-5 opacity-75" />
              <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible">
                Dashboard
              </span>
            </a>
          </div>

          <ul className="space-y-1 border-t border-gray-100 pt-4">
            <li>
              <a
                href={"/universitas"}
                className="group relative flex justify-center rounded px-2 py-1.5 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              >
                <FontAwesomeIcon
                  icon={faGraduationCap}
                  className="size-5 opacity-75"
                />
                <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible">
                  Universitas
                </span>
              </a>
            </li>

            <li>
              <a
                href={"/program"}
                className="group relative flex justify-center rounded px-2 py-1.5 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              >
                <FontAwesomeIcon
                  icon={faPencil}
                  className="size-5 opacity-75"
                />
                <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible">
                  Program
                </span>
              </a>
            </li>

            <li>
              <a
                href={"/profile"}
                className="group relative flex justify-center rounded px-2 py-1.5 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              >
                <FontAwesomeIcon icon={faUser} className="size-5 opacity-75" />
                <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible">
                  Profile
                </span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
