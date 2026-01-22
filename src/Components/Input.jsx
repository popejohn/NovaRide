import React from "react";


export default function Input({ label, onBlur,show, type = "text", value, onChange, ...props }) {
  return (
    <label className="relative block mb-4 text-left w-full">
      <span className="block mb-1 font-medium text-gray-700 dark:text-gray-300">{label}</span>
      <input
        type={type}
        value={value}
        onBlur = {onBlur}
        onChange={onChange}
        className= {`w-full px-4 py-2 rounded-lg border border-teal-600 outline-0 shadow-md
              ${type === "date" ? "text-gray-900" : "text-black"}
              focus:ring-1 focus:ring-blue-300`}
        {...props}
      />
    </label>
  );
}