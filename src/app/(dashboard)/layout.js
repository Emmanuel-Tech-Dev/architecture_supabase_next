"use client";

import Topbar from "@/component/TopBar";
import AppSidebar from "@/component/SideBar";
import { useEffect, useState } from "react";
import Loader from "@/component/Loader";
import useWindowSize from "@/hooks/useWindowSize";

export default function AppLayout({ children }) {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [isCollapsed, setIsCollapsed] = useState(false);

  const { width } = useWindowSize();

  useEffect(() => {
    if (width !== undefined && width < 768) {
      setIsCollapsed(true);
    } else if (width !== undefined && width >= 768) {
      setIsCollapsed(false);
    }
  }, [width]);

  return (
    <div
      className={`min-h-screen bg-gray-50 ${
        isCollapsed ? "sidebar-collapsed" : ""
      }`}
    >
      <AppSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <Topbar isCollapsed={isCollapsed} />
      <Loader />

      <main
        className={`transition-all duration-300 pt-20 pb-6 min-h-screen ${
          isCollapsed ? "ml-20" : "ml-58"
        }`}
      >
        <div className="px-6">{children}</div>
      </main>
    </div>
  );
}
