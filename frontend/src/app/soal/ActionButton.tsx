import React from "react";

interface ActionButtonProps {
  label: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({ label }) => {
  return (
    <button className="self-center px-16 py-3 mt-12 w-full text-xl font-semibold text-blue-700 bg-white rounded-3xl max-w-[721px] max-md:px-5 max-md:mt-10 max-md:max-w-full">
      {label}
    </button>
  );
};

export default ActionButton;
