"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { useShortcuts } from "../../utils/shortcuts";

interface LeftRailProps {
  onActionClick?: (action: string) => void;
}

const LeftRail: React.FC<LeftRailProps> = ({ onActionClick }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useShortcuts({
    "ctrl+b": () => setIsCollapsed(!isCollapsed),
  });
  const quickActions = [
    { id: "open", label: "Open", icon: FolderOpen },
    { id: "pre-treatment", label: "Pre-treatment", icon: Wrench },
    { id: "fusion", label: "Fusion", icon: Link },
    { id: "export", label: "Export", icon: Save },
  ];

  const pipelineSteps = [
    {
      label: "1. Data Load",
      icon: Database,
      status: "Complete",
      statusIcon: "✓",
      details: "Dataset A: 1,234 rows",
      statusColor: "bg-green-600",
    },
    {
      label: "2. Pre-treatment",
      icon: Settings,
      status: "Active",
      statusIcon: "⟳",
      details: "Removing duplicates...",
      statusColor: "bg-blue-600",
    },
    {
      label: "3. Fusion",
      icon: GitMerge,
      status: "Pending",
      statusIcon: "○",
      details: "Waiting...",
      statusColor: "bg-gray-600",
    },
    {
      label: "4. Export",
      icon: Download,
      status: "Pending",
      statusIcon: "○",
      details: "Waiting...",
      statusColor: "bg-gray-600",
    },
  ];

  const handleActionClick = (actionId: string) => {
    if (onActionClick) {
      onActionClick(actionId);
    }
  };

  return (
    <aside
      className={`${
        isCollapsed ? "w-20" : "w-64"
      } h-screen bg-[var(--color-primary)] text-[var(--color-text)] flex flex-col overflow-hidden`}
    >
      {/* Quick Actions Section */}
      <div className="p-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h2
            className={`text-lg font-semibold text-[var(--color-accent)] transition-opacity duration-300 ${
              isCollapsed ? "opacity-0 hidden" : "opacity-100 delay-150"
            }`}
          >
            Quick Actions
          </h2>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="py-1 px-[14px] bg-[var(--color-primary-light)] hover:bg-[var(--color-hover)] rounded text-[var(--color-text)] hover:text-[var(--color-text-light)] transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>
        <div className="space-y-2">
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={() => handleActionClick(action.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 bg-[var(--color-primary-light)] hover:bg-[var(--color-hover)] hover:text-[var(--color-text-light)] rounded transition-colors duration-200 ${
                isCollapsed ? "justify-center px-2" : "text-left"
              }`}
            >
              <action.icon className="w-5 h-5" />
              <span
                className={`font-medium transition-opacity duration-300 ${
                  isCollapsed ? "opacity-0 hidden" : "opacity-100 delay-150"
                }`}
              >
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Pipeline Summary Section */}
      <div className="p-4 flex-1 overflow-hidden flex flex-col">
        <h2
          className={`text-lg font-semibold mb-4 text-[var(--color-accent)] flex-shrink-0 transition-opacity duration-300 ${
            isCollapsed ? "opacity-0 hidden" : "opacity-100 delay-150"
          }`}
        >
          Pipeline
        </h2>
        <div
          className="flex-1 overflow-y-auto space-y-3 scrollbar-hide"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {/* Pipeline Steps */}
          {pipelineSteps.map((step, index) => (
            <div
              key={index}
              className={`bg-[var(--color-primary-light)] rounded p-3 ${
                step.status === "Pending" ? "opacity-50" : ""
              }`}
            >
              <div
                className={`flex items-center justify-between ${
                  isCollapsed ? "justify-center" : "mb-2"
                } ${isCollapsed ? "flex-col items-center" : ""}`}
              >
                <span
                  className={`text-sm font-medium transition-opacity duration-300 ${
                    isCollapsed ? "opacity-0 hidden" : "opacity-100 delay-150"
                  }`}
                >
                  {step.label}
                </span>
                {isCollapsed ? (
                  <step.icon
                    className={`w-4 h-4 ${
                      step.status === "Complete"
                        ? "text-green-500"
                        : step.status === "Active"
                        ? "text-blue-500"
                        : "text-white"
                    }`}
                  />
                ) : (
                  <span
                    className={`text-xs ${
                      step.statusColor
                    } text-white px-2 py-1 rounded transition-opacity duration-300 ${
                      isCollapsed ? "opacity-0" : "opacity-100 delay-150"
                    }`}
                  >
                    {step.statusIcon} {step.status}
                  </span>
                )}
              </div>
              <div
                className={`text-xs text-[var(--color-text)] transition-opacity duration-300 ${
                  isCollapsed ? "opacity-0 hidden" : "opacity-100 delay-150"
                }`}
              >
                {step.details}
              </div>
            </div>
          ))}
        </div>

        
      </div>
    </aside>
  );
};

export default LeftRail;
