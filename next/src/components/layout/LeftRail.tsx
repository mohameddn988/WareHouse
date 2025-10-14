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
  Minimize2,
  Zap,
  AlertCircle,
  Copy,
  Trash2,
} from "lucide-react";
import { useLayout } from "../context/LayoutContext";
import { useShortcuts } from "../utils/shortcuts";
import { useDataset } from "../context/DatasetContext";
import { useAuth } from "../context/AuthContext";
import {
  applyNormalization,
  applyStandardization,
  handleMissingData as handleMissingDataUtil,
  removeDuplicates as removeDuplicatesUtil,
  cleanData as cleanDataUtil,
} from "../../lib/dataProcessing";

interface LeftRailProps {
  onActionClick?: (action: string) => void;
}

const LeftRail: React.FC<LeftRailProps> = ({ onActionClick }) => {
  const { isLeftRailCollapsed, toggleLeftRail } = useLayout();
  const { currentData, datasetId, addLog, setTreatedData, onTreatmentApplied } =
    useDataset();
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useShortcuts({
    "ctrl+b": toggleLeftRail,
    "ctrl+shift+d": () => handleActionClick("datasets"),
    "ctrl+shift+p": () => handleActionClick("projects"),
    "ctrl+1": () => {
      if (pathname.startsWith("/dataset")) handleActionClick("normalize");
    },
    "ctrl+2": () => {
      if (pathname.startsWith("/dataset")) handleActionClick("standardize");
    },
    "ctrl+3": () => {
      if (pathname.startsWith("/dataset")) handleActionClick("missing-data");
    },
    "ctrl+4": () => {
      if (pathname.startsWith("/dataset")) handleActionClick("duplicates");
    },
    "ctrl+5": () => {
      if (pathname.startsWith("/dataset")) handleActionClick("clean");
    },
  });

  const isNewProjectPage =
    pathname === "/" || pathname === "/project" || pathname === "/dataset";

  const handleActionClick = (actionId: string) => {
    if (actionId === "dashboard") {
      if (isNewProjectPage) {
        router.push("/create-project");
      } else {
        router.push("/");
      }
    } else if (actionId === "datasets") {
      router.push("/dataset");
    } else if (actionId === "projects") {
      router.push("/project");
    } else if (actionId === "normalize") {
      applyNormalizationHandler();
    } else if (actionId === "standardize") {
      applyStandardizationHandler();
    } else if (actionId === "missing-data") {
      handleMissingDataHandler();
    } else if (actionId === "duplicates") {
      removeDuplicatesHandler();
    } else if (actionId === "clean") {
      cleanDataHandler();
    } else if (onActionClick) {
      onActionClick(actionId);
    }
  };

  const applyNormalizationHandler = async () => {
    if (!currentData || currentData.length === 0 || !datasetId) {
      addLog("No dataset loaded for normalization", "error");
      return;
    }

    const result = applyNormalization(currentData);
    if (result.success && result.data && result.operationName) {
      setTreatedData(result.data, result.operationName);
      addLog(`${result.message}`, "success");
      // Switch to treated tab
      if (onTreatmentApplied) {
        onTreatmentApplied();
      }
    } else {
      addLog(result.message, "error");
    }
  };

  const applyStandardizationHandler = async () => {
    if (!currentData || currentData.length === 0 || !datasetId) {
      addLog("No dataset loaded for standardization", "error");
      return;
    }

    const result = applyStandardization(currentData);
    if (result.success && result.data && result.operationName) {
      setTreatedData(result.data, result.operationName);
      addLog(`${result.message}`, "success");
      // Switch to treated tab
      if (onTreatmentApplied) {
        onTreatmentApplied();
      }
    } else {
      addLog(result.message, "error");
    }
  };

  const handleMissingDataHandler = async () => {
    if (!currentData || currentData.length === 0 || !datasetId) {
      addLog("No dataset loaded for missing data handling", "error");
      return;
    }

    const result = handleMissingDataUtil(currentData);
    if (result.success && result.data && result.operationName) {
      setTreatedData(result.data, result.operationName);
      addLog(`${result.message}`, "success");
      // Switch to treated tab
      if (onTreatmentApplied) {
        onTreatmentApplied();
      }
    } else {
      addLog(result.message, "error");
    }
  };

  const removeDuplicatesHandler = async () => {
    if (!currentData || currentData.length === 0 || !datasetId) {
      addLog("No dataset loaded for duplicate removal", "error");
      return;
    }

    const result = removeDuplicatesUtil(currentData);
    if (result.success && result.data && result.operationName) {
      setTreatedData(result.data, result.operationName);
      addLog(`${result.message}`, "success");
      // Switch to treated tab
      if (onTreatmentApplied) {
        onTreatmentApplied();
      }
    } else {
      addLog(result.message, "error");
    }
  };

  const cleanDataHandler = async () => {
    if (!currentData || currentData.length === 0 || !datasetId) {
      addLog("No dataset loaded for cleaning", "error");
      return;
    }

    const result = cleanDataUtil(currentData);
    if (result.success && result.data && result.operationName) {
      setTreatedData(result.data, result.operationName);
      addLog(`${result.message}`, "success");
      // Switch to treated tab
      if (onTreatmentApplied) {
        onTreatmentApplied();
      }
    } else {
      addLog(result.message, "error");
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

  const treatmentActions = [
    {
      id: "normalize",
      label: "Normalisation",
      icon: Minimize2,
      shortcut: "Ctrl+1",
    },
    {
      id: "standardize",
      label: "Standardisation",
      icon: Zap,
      shortcut: "Ctrl+2",
    },
    {
      id: "missing-data",
      label: "Valeurs manquantes",
      icon: AlertCircle,
      shortcut: "Ctrl+3",
    },
    {
      id: "duplicates",
      label: "Supprimer doublons",
      icon: Copy,
      shortcut: "Ctrl+4",
    },
    {
      id: "clean",
      label: "Nettoyer données",
      icon: Trash2,
      shortcut: "Ctrl+5",
    },
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
              onClick={() => handleActionClick("dashboard")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-700/50 transition-all duration-200 group ${
                isLeftRailCollapsed ? "justify-center px-2" : "text-left"
              }`}
            >
              <Home className="w-4 h-4 text-blue-400 group-hover:text-blue-300 transition-colors" />
              {!isLeftRailCollapsed && (
                <span className="text-sm text-slate-200 group-hover:text-white transition-colors">
                  {isNewProjectPage ? "New Project" : "Dashboard"}
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
                <div className="flex-1 flex items-center justify-between">
                  <span className="text-sm text-slate-200 group-hover:text-white transition-colors">
                    Datasets
                  </span>
                  <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
                    Ctrl+Shift+D
                  </span>
                </div>
              )}
            </button>
            <button
              onClick={() => handleActionClick("projects")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-700/50 transition-all duration-200 group ${
                isLeftRailCollapsed ? "justify-center px-2" : "text-left"
              }`}
            >
              <FolderOpen className="w-4 h-4 text-purple-400 group-hover:text-purple-300 transition-colors" />
              {!isLeftRailCollapsed && (
                <div className="flex-1 flex items-center justify-between">
                  <span className="text-sm text-slate-200 group-hover:text-white transition-colors">
                    Projects
                  </span>
                  <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
                    Ctrl+Shift+P
                  </span>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Traitement Section */}
        <div className="p-4 border-b border-slate-700/30 hover:border-slate-600/50 transition-colors">
          <h2
            className={`text-sm font-semibold text-slate-200 group-hover:text-white transition-colors mb-3 ${
              isLeftRailCollapsed ? "hidden" : ""
            }`}
          >
            Traitement
          </h2>
          <div className="space-y-1 animate-in slide-in-from-top-2 duration-200">
            {treatmentActions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleActionClick(action.id)}
                disabled={!pathname.startsWith("/dataset")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-700/50 transition-all duration-200 group ${
                  isLeftRailCollapsed ? "justify-center px-2" : "text-left"
                } ${
                  !pathname.startsWith("/dataset")
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                <action.icon className="w-4 h-4 text-blue-400 group-hover:text-blue-300 transition-colors" />
                {!isLeftRailCollapsed && (
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-sm text-slate-200 group-hover:text-white transition-colors">
                      {action.label}
                    </span>
                    <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
                      {action.shortcut}
                    </span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default LeftRail;
