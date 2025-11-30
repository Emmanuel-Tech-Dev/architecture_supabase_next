import { Button } from "primereact/button";

export default function Footer({ isCollapsed }) {
  return (
    <div
      className={` h-16  flex items-center justify-center border-t border-gray-200 px-6 transition-all duration-300 z-40 ${
        isCollapsed ? "left-20" : "left-58"
      }`}
    >
      <div className="text-center">Openrefer © {new Date().getFullYear()}</div>
    </div>
  );
}
