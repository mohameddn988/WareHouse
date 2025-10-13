"use client";

import React, { useState } from "react";
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
} from "lucide-react";

const Header: React.FC = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const navigateToPage = (page: string) => {
    console.log(`Navigate to ${page}`);
    setActiveDropdown(null);
  };

  const logout = () => {
    console.log("Logout");
    setActiveDropdown(null);
  };

  const importDatabase = () => {
    console.log("Import database");
    setActiveDropdown(null);
  };

  const applyStandardization = () => {
    console.log("Apply standardization");
    setActiveDropdown(null);
  };

  const applyNormalization = () => {
    console.log("Apply normalization");
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

  const showMergeSection = () => {
    console.log("Show merge section");
    setActiveDropdown(null);
  };

  const navigateToSubmenu = (submenu: string) => {
    console.log(`Navigate to submenu ${submenu}`);
    setActiveDropdown(null);
  };

  return (
    <div className="bg-white border-b border-gray-300 flex items-center sticky top-0 z-10">
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

        {/* Menu Traitement */}
        <div
          className="relative"
          onMouseEnter={() => setActiveDropdown("traitement")}
          onMouseLeave={() => setActiveDropdown(null)}
        >
          <button
            className="flex items-center gap-2 px-4 py-3 text-sm transition-colors"
            style={{
              color: "var(--color-text-gray)",
              backgroundColor:
                activeDropdown === "traitement"
                  ? "var(--color-bg-light)"
                  : "transparent",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--color-bg-light)")
            }
            onMouseLeave={(e) =>
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
                onClick={applyStandardization}
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
                onClick={applyNormalization}
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
                Normalisation
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
                Missing Data
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
                Supprimer doublons
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

        {/* Menu Analyse */}
        <div
          className="relative"
          onMouseEnter={() => setActiveDropdown("analyse")}
          onMouseLeave={() => setActiveDropdown(null)}
        >
          <button
            className="flex items-center gap-2 px-4 py-3 text-sm transition-colors"
            style={{
              color: "var(--color-text-gray)",
              backgroundColor:
                activeDropdown === "analyse"
                  ? "var(--color-bg-light)"
                  : "transparent",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--color-bg-light)")
            }
            onMouseLeave={(e) =>
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
    </div>
  );
};

export default Header;
