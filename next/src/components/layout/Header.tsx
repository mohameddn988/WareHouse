"use client";

import React, { useState } from "react";
import { useAuth } from "@/components/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useShortcuts } from "@/components/utils/shortcuts";
import {
  FileText,
  Upload,
  Edit3,
  BarChart2,
  HelpCircle,
  Database,
  FilePlus,
  Lock,
  LogOut,
  FileDown,
  Zap,
  Minimize2,
  AlertCircle,
  Copy,
  GitMerge,
  Activity,
  CheckCircle,
  Percent,
  Save,
  Trash2,
  CheckSquare,
  RefreshCw,
  Type,
  ZoomIn,
  ZoomOut,
  Maximize,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const Header: React.FC = () => {
  const { user, logout: authLogout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [selectedBase1, setSelectedBase1] = useState(false);
  const [selectedBase2, setSelectedBase2] = useState(false);

  const isAnalyseDisabled = true;

  // Check if we're on a dataset page
  const isOnDatasetPage = pathname?.includes("/dataset") ?? false;

  const navigateToPage = (page: string) => {
    router.push(`/${page}`);
    setActiveDropdown(null);
  };

  const logout = async () => {
    await authLogout();
    setActiveDropdown(null);
  };

  const saveProject = () => {
    console.log("Save project");
    setActiveDropdown(null);
  };

  const importDatabase = () => {
    console.log("Import database");
    setActiveDropdown(null);
  };

  const handleMissingData = () => {
    console.log("Handle missing data");
    setActiveDropdown(null);
  };

  const removeDuplicates = () => {
    console.log("Remove duplicates");
    setActiveDropdown(null);
  };

  const cleanData = () => {
    console.log("Clean data");
    setActiveDropdown(null);
  };

  const showMergeSection = () => {
    console.log("Show merge section");
    setActiveDropdown(null);
  };

  const navigateToSubmenu = (submenu: string) => {
    console.log(`Navigate to submenu ${submenu}`);
    setActiveDropdown(null);
  };

  const selectBase1 = () => {
    setSelectedBase1(!selectedBase1);
  };

  const selectBase2 = () => {
    setSelectedBase2(!selectedBase2);
  };

  const mergeBases = () => {
    console.log("Merge bases");
    setActiveDropdown(null);
  };

  const reloadWindow = () => {
    window.location.reload();
    setActiveDropdown(null);
  };

  const resetZoom = () => {
    // Reset zoom to 100% - note: zoom property is not standard
    document.body.style.zoom = "100%";
    setActiveDropdown(null);
  };

  const zoomIn = () => {
    // Increase zoom by 10%
    const currentZoom = parseFloat(document.body.style.zoom || "1");
    document.body.style.zoom = (currentZoom + 0.1).toString();
    setActiveDropdown(null);
  };

  const zoomOut = () => {
    // Decrease zoom by 10%
    const currentZoom = parseFloat(document.body.style.zoom || "1");
    document.body.style.zoom = Math.max(0.1, currentZoom - 0.1).toString();
    setActiveDropdown(null);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(
          `Error attempting to enable full-screen mode: ${err.message}`
        );
      });
    } else {
      document.exitFullscreen();
    }
    setActiveDropdown(null);
  };

  // Keyboard shortcuts for Affichage menu
  useShortcuts({
    "ctrl+r": reloadWindow,
    "ctrl+0": resetZoom,
    "ctrl+=": zoomIn,
    "ctrl+-": zoomOut,
    f11: toggleFullscreen,
  });

  const navigateBack = () => {
    if (window.history.length > 1) {
      router.back();
    }
  };

  const navigateForward = () => {
    // Note: Next.js router doesn't have a forward method, so we'll use browser history
    window.history.forward();
  };

  return (
    <div className="bg-white border-b border-gray-300 flex items-center sticky top-0 z-10">
      {/* Navigation buttons */}
      <div className="flex items-center gap-1 px-2 border-r border-gray-300">
        <button
          onClick={navigateBack}
          className="flex items-center justify-center w-8 h-8 text-gray-600 hover:bg-gray-100 rounded transition-colors"
          title="Retour"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={navigateForward}
          className="flex items-center justify-center w-8 h-8 text-gray-600 hover:bg-gray-100 rounded transition-colors"
          title="Avant"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Menu items */}
      <div className="flex items-center">
        {/* Menu Fichier */}
        <div
          className="relative"
          onMouseEnter={() => setActiveDropdown("fichier")}
          onMouseLeave={() => setActiveDropdown(null)}
        >
          <button
            className="flex items-center gap-2 px-4 py-3 text-sm transition-colors"
            style={{
              color: "var(--color-text-gray)",
              backgroundColor:
                activeDropdown === "fichier"
                  ? "var(--color-bg-light)"
                  : "transparent",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--color-bg-light)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor =
                activeDropdown === "fichier"
                  ? "var(--color-bg-light)"
                  : "transparent")
            }
          >
            <FileText size={16} />
            <span>Fichier</span>
          </button>
          {activeDropdown === "fichier" && (
            <div
              className="absolute left-0 top-full mt-0 w-56 rounded-lg shadow-lg py-1 z-50"
              style={{
                backgroundColor: "var(--color-bg)",
                border: "1px solid var(--color-border)",
              }}
            >
              <button
                onClick={() => navigateToPage("create-project")}
                className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors"
                style={{ color: "var(--color-text-dark)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "var(--color-bg-light)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <FilePlus size={16} />
                Nouveau projet
              </button>
              <button
                onClick={saveProject}
                className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors"
                style={{ color: "var(--color-text-dark)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "var(--color-bg-light)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <Save size={16} />
                Enregistrer
              </button>
              <button
                onClick={() => navigateToPage("close-project")}
                className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors"
                style={{ color: "var(--color-text-dark)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "var(--color-bg-light)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <Lock size={16} />
                Fermer projet
              </button>
              <div
                className="my-1"
                style={{ borderTop: "1px solid var(--color-border)" }}
              ></div>
              <button
                onClick={logout}
                className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors"
                style={{ color: "var(--color-error)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#fef2f2")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <LogOut size={16} />
                Déconnexion
              </button>
            </div>
          )}
        </div>

        {/* Menu Import */}
        <div
          className="relative"
          onMouseEnter={() => setActiveDropdown("import")}
          onMouseLeave={() => setActiveDropdown(null)}
        >
          <button
            className="flex items-center gap-2 px-4 py-3 text-sm transition-colors"
            style={{
              color: "var(--color-text-gray)",
              backgroundColor:
                activeDropdown === "import"
                  ? "var(--color-bg-light)"
                  : "transparent",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--color-bg-light)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor =
                activeDropdown === "import"
                  ? "var(--color-bg-light)"
                  : "transparent")
            }
          >
            <Upload size={16} />
            <span>Import</span>
          </button>
          {activeDropdown === "import" && (
            <div
              className="absolute left-0 top-full mt-0 w-64 rounded-lg shadow-lg py-1 z-50"
              style={{
                backgroundColor: "var(--color-bg)",
                border: "1px solid var(--color-border)",
              }}
            >
              <button
                onClick={importDatabase}
                className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors"
                style={{ color: "var(--color-text-dark)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "var(--color-bg-light)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <Database size={16} />
                Importer une base
              </button>
              <button
                onClick={() => document.getElementById("file-input")?.click()}
                className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors"
                style={{ color: "var(--color-text-dark)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "var(--color-bg-light)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <FileDown size={16} />
                Importer fichier Excel/CSV
              </button>
            </div>
          )}
        </div>

        {/* Menu Base de données */}
        <div
          className="relative"
          onMouseEnter={() => setActiveDropdown("base-donnees")}
          onMouseLeave={() => setActiveDropdown(null)}
        >
          <button
            className="flex items-center gap-2 px-4 py-3 text-sm transition-colors"
            style={{
              color: "var(--color-text-gray)",
              backgroundColor:
                activeDropdown === "base-donnees"
                  ? "var(--color-bg-light)"
                  : "transparent",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--color-bg-light)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor =
                activeDropdown === "base-donnees"
                  ? "var(--color-bg-light)"
                  : "transparent")
            }
          >
            <Database size={16} />
            <span>Base de données</span>
          </button>
          {activeDropdown === "base-donnees" && (
            <div
              className="absolute left-0 top-full mt-0 w-64 rounded-lg shadow-lg py-1 z-50"
              style={{
                backgroundColor: "var(--color-bg)",
                border: "1px solid var(--color-border)",
              }}
            >
              <button
                onClick={selectBase1}
                className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors"
                style={{ color: "var(--color-text-dark)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "var(--color-bg-light)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <CheckSquare
                  size={16}
                  className={selectedBase1 ? "text-green-500" : "text-gray-400"}
                />
                Sélection Base 1
              </button>
              <button
                onClick={selectBase2}
                className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors"
                style={{ color: "var(--color-text-dark)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "var(--color-bg-light)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <CheckSquare
                  size={16}
                  className={selectedBase2 ? "text-green-500" : "text-gray-400"}
                />
                Sélection Base 2
              </button>
              <div
                className="my-1"
                style={{ borderTop: "1px solid var(--color-border)" }}
              ></div>
              <div
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider"
                style={{ color: "var(--color-text-gray)" }}
              >
                Fusion
              </div>
              <button
                onClick={showMergeSection}
                className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors"
                style={{ color: "var(--color-text-dark)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "var(--color-bg-light)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <GitMerge size={16} />
                Fusionner des bases
              </button>
            </div>
          )}
        </div>

        {/* Menu Traitement */}
        <div
          className="relative"
          onMouseEnter={() =>
            isOnDatasetPage && setActiveDropdown("traitement")
          }
          onMouseLeave={() => isOnDatasetPage && setActiveDropdown(null)}
        >
          <button
            disabled={!isOnDatasetPage}
            className="flex items-center gap-2 px-4 py-3 text-sm transition-colors"
            style={{
              color: "var(--color-text-gray)",
              backgroundColor:
                activeDropdown === "traitement"
                  ? "var(--color-bg-light)"
                  : "transparent",
              opacity: !isOnDatasetPage ? 0.5 : 1,
              cursor: !isOnDatasetPage ? "not-allowed" : "pointer",
            }}
            onMouseEnter={(e) =>
              isOnDatasetPage &&
              (e.currentTarget.style.backgroundColor = "var(--color-bg-light)")
            }
            onMouseLeave={(e) =>
              isOnDatasetPage &&
              (e.currentTarget.style.backgroundColor =
                activeDropdown === "traitement"
                  ? "var(--color-bg-light)"
                  : "transparent")
            }
          >
            <Edit3 size={16} />
            <span>Traitement</span>
          </button>
          {activeDropdown === "traitement" && (
            <div
              className="absolute left-0 top-full mt-0 w-64 rounded-lg shadow-lg py-1 z-50"
              style={{
                backgroundColor: "var(--color-bg)",
                border: "1px solid var(--color-border)",
              }}
            >
              <div
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider"
                style={{ color: "var(--color-text-gray)" }}
              >
                Prétraitement
              </div>
              <button
                className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors"
                style={{ color: "var(--color-text-dark)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "var(--color-bg-light)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <Minimize2 size={16} />
                Normalisation des données
              </button>
              <button
                className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors"
                style={{ color: "var(--color-text-dark)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "var(--color-bg-light)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <Zap size={16} />
                Standardisation
              </button>
              <button
                onClick={handleMissingData}
                className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors"
                style={{ color: "var(--color-text-dark)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "var(--color-bg-light)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <AlertCircle size={16} />
                Gestion des valeurs manquantes
              </button>
              <button
                onClick={removeDuplicates}
                className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors"
                style={{ color: "var(--color-text-dark)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "var(--color-bg-light)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <Copy size={16} />
                Suppression des doublons
              </button>
              <div
                className="my-1"
                style={{ borderTop: "1px solid var(--color-border)" }}
              ></div>
              <button
                onClick={cleanData}
                className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors"
                style={{ color: "var(--color-text-dark)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "var(--color-bg-light)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <Trash2 size={16} />
                Nettoyage des données
              </button>
            </div>
          )}
        </div>

        {/* Menu Analyse */}
        <div
          className="relative"
          onMouseEnter={() =>
            !isAnalyseDisabled && setActiveDropdown("analyse")
          }
          onMouseLeave={() => !isAnalyseDisabled && setActiveDropdown(null)}
        >
          <button
            disabled={isAnalyseDisabled}
            className="flex items-center gap-2 px-4 py-3 text-sm transition-colors"
            style={{
              color: "var(--color-text-gray)",
              backgroundColor:
                activeDropdown === "analyse"
                  ? "var(--color-bg-light)"
                  : "transparent",
              opacity: isAnalyseDisabled ? 0.5 : 1,
              cursor: isAnalyseDisabled ? "not-allowed" : "pointer",
            }}
            onMouseEnter={(e) =>
              !isAnalyseDisabled &&
              (e.currentTarget.style.backgroundColor = "var(--color-bg-light)")
            }
            onMouseLeave={(e) =>
              !isAnalyseDisabled &&
              (e.currentTarget.style.backgroundColor =
                activeDropdown === "analyse"
                  ? "var(--color-bg-light)"
                  : "transparent")
            }
          >
            <BarChart2 size={16} />
            <span>Analyse</span>
          </button>
          {activeDropdown === "analyse" && (
            <div
              className="absolute left-0 top-full mt-0 w-56 rounded-lg shadow-lg py-1 z-50"
              style={{
                backgroundColor: "var(--color-bg)",
                border: "1px solid var(--color-border)",
              }}
            >
              <button
                onClick={() => navigateToSubmenu("profile-analysis")}
                className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors"
                style={{ color: "var(--color-text-dark)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "var(--color-bg-light)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <Activity size={16} />
                Analyse de profil
              </button>
              <button
                onClick={() => navigateToSubmenu("data-quality")}
                className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors"
                style={{ color: "var(--color-text-dark)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "var(--color-bg-light)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <CheckCircle size={16} />
                Qualité des données
              </button>
              <button
                onClick={() => navigateToSubmenu("statistics")}
                className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors"
                style={{ color: "var(--color-text-dark)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "var(--color-bg-light)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <Percent size={16} />
                Statistiques
              </button>
            </div>
          )}
        </div>

        {/* Menu Affichage */}
        <div
          className="relative"
          onMouseEnter={() => setActiveDropdown("affichage")}
          onMouseLeave={() => setActiveDropdown(null)}
        >
          <button
            className="flex items-center gap-2 px-4 py-3 text-sm transition-colors"
            style={{
              color: "var(--color-text-gray)",
              backgroundColor:
                activeDropdown === "affichage"
                  ? "var(--color-bg-light)"
                  : "transparent",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--color-bg-light)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor =
                activeDropdown === "affichage"
                  ? "var(--color-bg-light)"
                  : "transparent")
            }
          >
            <Maximize size={16} />
            <span>Affichage</span>
          </button>
          {activeDropdown === "affichage" && (
            <div
              className="absolute left-0 top-full mt-0 w-64 rounded-lg shadow-lg py-1 z-50"
              style={{
                backgroundColor: "var(--color-bg)",
                border: "1px solid var(--color-border)",
              }}
            >
              <button
                onClick={reloadWindow}
                className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors"
                style={{ color: "var(--color-text-dark)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "var(--color-bg-light)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <RefreshCw size={16} />
                Actualise
              </button>
              <div
                className="my-1"
                style={{ borderTop: "1px solid var(--color-border)" }}
              ></div>
              <button
                onClick={resetZoom}
                className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors"
                style={{ color: "var(--color-text-dark)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "var(--color-bg-light)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <Type size={16} />
                Reset
              </button>
              <button
                onClick={zoomIn}
                className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors"
                style={{ color: "var(--color-text-dark)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "var(--color-bg-light)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <ZoomIn size={16} />
                Zoom avant
              </button>
              <button
                onClick={zoomOut}
                className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors"
                style={{ color: "var(--color-text-dark)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "var(--color-bg-light)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <ZoomOut size={16} />
                Zoom arrière
              </button>
              <div
                className="my-1"
                style={{ borderTop: "1px solid var(--color-border)" }}
              ></div>
              <button
                onClick={toggleFullscreen}
                className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors"
                style={{ color: "var(--color-text-dark)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "var(--color-bg-light)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <Maximize size={16} />
                Plein écran
              </button>
            </div>
          )}
        </div>

        {/* Menu Aide */}
        <button
          className="flex items-center gap-2 px-4 py-3 text-sm transition-colors"
          style={{ color: "var(--color-text-gray)" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "var(--color-bg-light)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
        >
          <HelpCircle size={16} />
          <span>Aide</span>
        </button>
      </div>

      {/* User Profile Section */}
      <div className="ml-auto flex items-center gap-4 px-4">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
          <User size={16} className="text-gray-600" />
          <span className="text-sm font-medium text-gray-700">
            {user?.username || "User"}
          </span>
          <span className="text-xs text-gray-500 bg-white px-2 py-0.5 rounded">
            {user?.role || "user"}
          </span>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Déconnexion"
        >
          <LogOut size={16} />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );
};

export default Header;
