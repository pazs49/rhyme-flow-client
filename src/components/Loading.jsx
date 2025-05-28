import React from "react";

const Loading = () => {
  return (
    <div className="fixed inset-0 bg-gray-800/60 flex justify-center items-center z-50">
      <div className="w-16 h-16 border-4 border-t-4 border-white border-opacity-50 border-solid rounded-full animate-spin"></div>
    </div>
  );
};

export default Loading;
