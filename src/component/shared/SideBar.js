"use client";
import { Sidebar } from "primereact/sidebar";
import { Menu } from "primereact/menu";
import { useState } from "react";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { useRouter } from "next/navigation";
import getMenuItems from "../../../menuItems";

export default function AppSidebar({
  currentPage,
  setCurrentPage,
  isCollapsed,
  setIsCollapsed,
}) {
  const router = useRouter();
  const defaultRoute = "/dashboard";

  const menuItems = getMenuItems(router, defaultRoute);

  return (
    <div
      className={`fixed left-0 top-0 h-full bg-slate-900 text-white transition-all duration-300 z-50 flex flex-col ${
        isCollapsed ? "w-20" : "w-58"
      }`}
    >
      {/* HEADER — FIXED */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700 shrink-0">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <i className="pi pi-chart-bar text-white"></i>
            </div>
            <span className="font-bold text-lg">OpenRef</span>
          </div>
        )}
        <Button
          icon={isCollapsed ? "pi pi-angle-right" : "pi pi-angle-left"}
          onClick={() => setIsCollapsed(!isCollapsed)}
          size="small"
          text
          aria-label="Collapsible"
        />
      </div>

      {/* MIDDLE MENU — SCROLLABLE */}
      <div className="overflow-y-auto flex-1 px-3 py-4 scrollbar-custom">
        <style jsx>{`
          .scrollbar-custom {
            scroll-behavior: smooth;
            scrollbar-width: thin;
            scrollbar-color: rgba(59, 130, 246, 0.5) rgba(51, 65, 85, 0.3);
          }
          .scrollbar-custom::-webkit-scrollbar {
            width: 6px;
          }
          .scrollbar-custom::-webkit-scrollbar-track {
            background: rgba(51, 65, 85, 0.3);
            border-radius: 10px;
          }
          .scrollbar-custom::-webkit-scrollbar-thumb {
            background: rgba(59, 130, 246, 0.5);
            border-radius: 10px;
            transition: background 0.3s ease;
          }
          .scrollbar-custom::-webkit-scrollbar-thumb:hover {
            background: rgba(59, 130, 246, 0.8);
          }
        `}</style>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => item.command()}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg mb-1 transition-all ${
              currentPage === item.id
                ? "bg-blue-600 text-white"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            } ${isCollapsed ? "justify-center" : ""}`}
          >
            <i className={`${item.icon} text-lg`}></i>
            {!isCollapsed && <span className="font-medium">{item.label}</span>}
          </button>
        ))}
      </div>

      {/* FOOTER — FIXED */}
      <div className="p-4 border-t border-slate-700 shrink-0">
        <div
          className={`flex items-center gap-3 ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <Avatar
            icon="pi pi-user"
            size="large"
            shape="circle"
            className="bg-blue-600"
          />
          {!isCollapsed && (
            <div className="flex-1">
              <p className="font-semibold text-sm">John Doe</p>
              <p className="text-xs text-slate-400">Admin</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
