import { Button } from "primereact/button";

export default function Topbar({ isCollapsed }) {
  return (
    <div
      className={`fixed top-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 transition-all duration-300 z-40 ${
        isCollapsed ? "left-20" : "left-54"
      }`}
    >
      <h1 className="text-xl font-semibold text-gray-800">
        PrimeReact Admin Dashboard
      </h1>

      <div className="flex items-center gap-3">
        <Button
          icon="pi pi-search"
          className="p-button-rounded p-button-text p-button-plain"
        />
        <Button
          icon="pi pi-bell"
          className="p-button-rounded p-button-text p-button-plain"
          badge="3"
          badgeseverity="danger"
        />
        <Button
          icon="pi pi-cog"
          className="p-button-rounded p-button-text p-button-plain"
        />
      </div>
    </div>
  );
}
