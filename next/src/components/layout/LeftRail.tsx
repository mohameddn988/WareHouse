'use client';

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  FolderOpen,
  Wrench,
  Link,
  Save,
  ChevronLeft,
  ChevronRight,
  Database,
  Settings,
  GitMerge,
  Download,
  Home,
  Upload,
  BarChart3,
  User,
  LogOut,
  FileText,
  Folder,
  Code,
  Undo,
  Redo,
  Scissors,
  Clipboard,
  Search,
} from "lucide-react";
import { useLayout } from "../context/LayoutContext";
import { useShortcuts } from "../utils/shortcuts";

interface LeftRailProps {
  onActionClick?: (action: string) => void;
}

const LeftRail: React.FC<LeftRailProps> = ({ onActionClick }) => {
  const { isLeftRailCollapsed, toggleLeftRail } = useLayout();
  const router = useRouter();
  const pathname = usePathname();

  useShortcuts({
    "ctrl+b": toggleLeftRail,
  });

  const isNewProjectPage = pathname === "/" || pathname === "/project" || pathname === "/dataset";

  const handleActionClick = (actionId: string) => {
    if (actionId === "project") {
      if (isNewProjectPage) {
        router.push("/create-project");
      } else {
        router.push("/");
      }
    } else if (onActionClick) {
      onActionClick(actionId);
    }
  };

  const navigationLinks = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "import", label: "Import", icon: Upload },
    { id: "processing", label: "Processing", icon: Wrench },
    { id: "analysis", label: "Analysis", icon: BarChart3 },
  ];

  const dataFiles = [
    { name: "clients.csv", rows: 1500 },
    { name: "transactions.xlsx", rows: 25000 },
    { name: "products.json", rows: 500 },
  ];

  const userActions = [
    { id: "profile", label: "Profile", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "logout", label: "Logout", icon: LogOut },
  ];

  const editingActions = [
    { id: "undo", label: "Annuler", icon: Undo, shortcut: "Ctrl+Z" },
    { id: "redo", label: "Rétablir", icon: Redo, shortcut: "Ctrl+Y" },
    { id: "cut", label: "Couper", icon: Scissors, shortcut: "Ctrl+X" },
    { id: "copy", label: "Copier", icon: Clipboard, shortcut: "Ctrl+C" },
    { id: "paste", label: "Coller", icon: Clipboard, shortcut: "Ctrl+V" },
    { id: "search", label: "Rechercher", icon: Search, shortcut: "Ctrl+F" },
  ];

  return (
    <aside
      className={`${
        isLeftRailCollapsed ? "w-18" : "w-64"
      } h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col overflow-hidden shadow-2xl`}
    >
      {/* Content */}
      <div
        className="flex-1 overflow-y-auto"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* Project Explorer */}
        <div className="p-4 border-b border-slate-700/30 hover:border-slate-600/50 transition-colors">
          <div
            className={`flex items-center mb-3 ${
              isLeftRailCollapsed ? "justify-center" : "justify-between"
            }`}
          >
            <h2
              className={`text-sm font-semibold text-slate-200 group-hover:text-white transition-colors ${
                isLeftRailCollapsed ? "hidden" : ""
              }`}
            >
              Project Explorer
            </h2>
            <button
              onClick={toggleLeftRail}
              className={`p-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg text-slate-300 hover:text-white transition-all duration-200 hover:scale-105 shadow-lg ${
                isLeftRailCollapsed
                  ? "w-full flex items-center justify-center"
                  : ""
              }`}
            >
              {isLeftRailCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>
          <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
            <button
              onClick={() => handleActionClick("project")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-700/50 transition-all duration-200 group ${
                isLeftRailCollapsed ? "justify-center px-2" : "text-left"
              }`}
            >
              <Folder className="w-4 h-4 text-blue-400 group-hover:text-blue-300 transition-colors" />
              {!isLeftRailCollapsed && (
                <span className="text-sm text-slate-200 group-hover:text-white transition-colors">
                  {isNewProjectPage ? "New Project" : "Projects"}
                </span>
              )}
            </button>
            <button
              onClick={() => handleActionClick("datasets")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-700/50 transition-all duration-200 group ${
                isLeftRailCollapsed ? "justify-center px-2" : "text-left"
              }`}
            >
              <Database className="w-4 h-4 text-green-400 group-hover:text-green-300 transition-colors" />
              {!isLeftRailCollapsed && (
                <span className="text-sm text-slate-200 group-hover:text-white transition-colors">
                  Datasets
                </span>
              )}
            </button>
            <button
              onClick={() => handleActionClick("modules")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-700/50 transition-all duration-200 group ${
                isLeftRailCollapsed ? "justify-center px-2" : "text-left"
              }`}
            >
              <Code className="w-4 h-4 text-purple-400 group-hover:text-purple-300 transition-colors" />
              {!isLeftRailCollapsed && (
                <span className="text-sm text-slate-200 group-hover:text-white transition-colors">
                  Modules
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Édition Section */}
        <div className="p-4 border-b border-slate-700/30 hover:border-slate-600/50 transition-colors">
          <h2
            className={`text-sm font-semibold text-slate-200 group-hover:text-white transition-colors mb-3 ${
              isLeftRailCollapsed ? "hidden" : ""
            }`}
          >
            Édition
          </h2>
          <div className="space-y-1 animate-in slide-in-from-top-2 duration-200">
            {/* Undo & Redo */}
            <div className="space-y-1">
              <button
                onClick={() => handleActionClick("undo")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-700/50 transition-all duration-200 group ${
                  isLeftRailCollapsed ? "justify-center px-2" : "text-left"
                }`}
              >
                <Undo className="w-4 h-4 text-orange-400 group-hover:text-orange-300 transition-colors" />
                {!isLeftRailCollapsed && (
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-sm text-slate-200 group-hover:text-white transition-colors">
                      Annuler
                    </span>
                    <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
                      Ctrl+Z
                    </span>
                  </div>
                )}
              </button>
              <button
                onClick={() => handleActionClick("redo")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-700/50 transition-all duration-200 group ${
                  isLeftRailCollapsed ? "justify-center px-2" : "text-left"
                }`}
              >
                <Redo className="w-4 h-4 text-orange-400 group-hover:text-orange-300 transition-colors" />
                {!isLeftRailCollapsed && (
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-sm text-slate-200 group-hover:text-white transition-colors">
                      Rétablir
                    </span>
                    <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
                      Ctrl+Y
                    </span>
                  </div>
                )}
              </button>
            </div>

            {/* Separator */}
            <div className="my-2 border-t border-slate-600/30"></div>

            {/* Cut, Copy, Paste */}
            <div className="space-y-1">
              <button
                onClick={() => handleActionClick("cut")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-700/50 transition-all duration-200 group ${
                  isLeftRailCollapsed ? "justify-center px-2" : "text-left"
                }`}
              >
                <Scissors className="w-4 h-4 text-red-400 group-hover:text-red-300 transition-colors" />
                {!isLeftRailCollapsed && (
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-sm text-slate-200 group-hover:text-white transition-colors">
                      Couper
                    </span>
                    <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
                      Ctrl+X
                    </span>
                  </div>
                )}
              </button>
              <button
                onClick={() => handleActionClick("copy")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-700/50 transition-all duration-200 group ${
                  isLeftRailCollapsed ? "justify-center px-2" : "text-left"
                }`}
              >
                <Clipboard className="w-4 h-4 text-blue-400 group-hover:text-blue-300 transition-colors" />
                {!isLeftRailCollapsed && (
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-sm text-slate-200 group-hover:text-white transition-colors">
                      Copier
                    </span>
                    <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
                      Ctrl+C
                    </span>
                  </div>
                )}
              </button>
              <button
                onClick={() => handleActionClick("paste")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-700/50 transition-all duration-200 group ${
                  isLeftRailCollapsed ? "justify-center px-2" : "text-left"
                }`}
              >
                <Clipboard className="w-4 h-4 text-green-400 group-hover:text-green-300 transition-colors" />
                {!isLeftRailCollapsed && (
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-sm text-slate-200 group-hover:text-white transition-colors">
                      Coller
                    </span>
                    <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
                      Ctrl+V
                    </span>
                  </div>
                )}
              </button>
            </div>

            {/* Separator */}
            <div className="my-2 border-t border-slate-600/30"></div>

            {/* Search */}
            <button
              onClick={() => handleActionClick("search")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-700/50 transition-all duration-200 group ${
                isLeftRailCollapsed ? "justify-center px-2" : "text-left"
              }`}
            >
              <Search className="w-4 h-4 text-yellow-400 group-hover:text-yellow-300 transition-colors" />
              {!isLeftRailCollapsed && (
                <div className="flex-1 flex items-center justify-between">
                  <span className="text-sm text-slate-200 group-hover:text-white transition-colors">
                    Rechercher
                  </span>
                  <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
                    Ctrl+F
                  </span>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Data Overview */}
        <div className="p-4 border-b border-slate-700/30 hover:border-slate-600/50 transition-colors">
          <h2
            className={`text-sm font-semibold text-slate-200 group-hover:text-white transition-colors mb-3 ${
              isLeftRailCollapsed ? "hidden" : ""
            }`}
          >
            Data Overview
          </h2>
          <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
            {dataFiles.map((file, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-slate-800/60 to-slate-700/60 hover:bg-slate-700/80 border border-slate-600/30 transition-all duration-200 group ${
                  isLeftRailCollapsed ? "justify-center" : ""
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <FileText className="w-4 h-4 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
                {!isLeftRailCollapsed && (
                  <div className="flex-1">
                    <div className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">
                      {file.name}
                    </div>
                    <div className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
                      {file.rows.toLocaleString()} rows
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default LeftRail;
