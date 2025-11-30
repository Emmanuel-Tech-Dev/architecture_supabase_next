"use client";

import Topbar from "@/component/shared/TopBar";
import AppSidebar from "@/component/shared/SideBar";
import { useEffect, useState } from "react";
import Loader from "@/component/loaders/Loader";
import useWindowSize from "@/hooks/useWindowSize";
import ScrollToTop from "@/component/shared/ScrollToTop";
import { ConfirmDialog } from "primereact/confirmdialog";
import Footer from "@/component/shared/Footer";

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
      <ScrollToTop />
      <AppSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <Topbar isCollapsed={isCollapsed} />
      <Loader />

      <main
        className={`transition-all duration-300 pt-20 pb-6 min-h-screen ${
          isCollapsed ? "ml-20" : "ml-58"
        }`}
      >
        <ConfirmDialog className="!w-[30rem]" dismissableMask />
        <div className="px-3 md:px-6">{children}</div>
      </main>

      <Footer isCollapsed={isCollapsed} />
    </div>
  );
}
