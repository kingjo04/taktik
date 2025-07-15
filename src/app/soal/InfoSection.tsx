import React from "react";

interface InfoSectionProps {
  label: string;
  value: string;
}

const InfoSection: React.FC<InfoSectionProps> = ({ label, value }) => {
  return (
    <div className="flex flex-col mt-4 text-2xl text-white">
      <div>{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  );
};

export default InfoSection;
