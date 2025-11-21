const severityClasses = {
  success: "bg-green-100 text-green-700",
  warning: "bg-yellow-100 text-yellow-700",
  danger: "bg-red-100 text-red-700",
  info: "bg-blue-100 text-blue-700",
  default: "bg-slate-100 text-slate-700",
  Platinum: "bg-purple-100 text-purple-600",
  Gold: "bg-yellow-50 text-yellow-700",
  Silver: "bg-blue-50 text-blue-600",
  Bronze: "bg-gray-100 text-gray-600",
};

const CustomTag = ({ value, severity = "info", className = "" }) => {
  const sevClass = severityClasses[severity] || "";

  return (
    <span
      className={`px-2 py-1 rounded-md text-sm font-medium ${sevClass} ${className}`}
    >
      {value}
    </span>
  );
};

export default CustomTag;
