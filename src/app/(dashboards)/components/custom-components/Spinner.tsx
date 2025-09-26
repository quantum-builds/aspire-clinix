import React from "react";

interface SpinnerProps {
  color?: string;
  size?: string;
}

const Spinner = ({ color = "white", size = "6" }: SpinnerProps) => {
  const spinnerColor = `border-${color}`;

  return (
    <div className="flex items-center justify-center">
      <div
        className={`w-${size} h-${size} border-4 border-t-transparent ${spinnerColor} rounded-full animate-spin`}
        role="status"
      />
    </div>
  );
};

export default Spinner;
