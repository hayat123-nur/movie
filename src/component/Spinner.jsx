import React from "react";

const Spinner = ({
  size = "w-8 h-8",
  color = "border-blue-500",
  borderWidth = "border-4",
}) => {
  return (
    <div
      className={`${size} ${borderWidth} ${color} border-t-transparent rounded-full animate-spin`}
      role="status" 
      aria-label="Loading" 
    >
      <span className="sr-only">Loading...</span>{" "}
      
    </div>
  );
};

export default Spinner;
