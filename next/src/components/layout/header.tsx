"use client";

import React, { useState, useRef } from "react";

const Header: React.FC = () => {
  const [isProcessingOpen, setIsProcessingOpen] = useState(false);
  const [isPreTreatmentOpen, setIsPreTreatmentOpen] = useState(false);
  const processingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const preTreatmentTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Toggle states for View menu
  const [beforeAfterMode, setBeforeAfterMode] = useState<"Split" | "Tabs">(
    "Split"
  );
  const [diffHighlights, setDiffHighlights] = useState<"On" | "Off">("On");
  const [statusBarVisible, setStatusBarVisible] = useState<"On" | "Off">("On");

  const handleProcessingEnter = () => {
    if (processingTimeoutRef.current)
      clearTimeout(processingTimeoutRef.current);
    setIsProcessingOpen(true);
  };

  const handleProcessingLeave = () => {
    processingTimeoutRef.current = setTimeout(() => {
      setIsProcessingOpen(false);
      setIsPreTreatmentOpen(false);
    }, 300);
  };

  const handlePreTreatmentEnter = () => {
    if (preTreatmentTimeoutRef.current)
      clearTimeout(preTreatmentTimeoutRef.current);
    setIsPreTreatmentOpen(true);
  };

  const handlePreTreatmentLeave = () => {
    preTreatmentTimeoutRef.current = setTimeout(() => {
      setIsPreTreatmentOpen(false);
    }, 300);
  };

  return (
    <header className="bg-[var(--color-primary)] text-[var(--color-text)] shadow-md">
      <nav className="container mx-auto px-4 py-2">
        <ul className="flex space-x-6">
          {/* File Menu */}
          <li className="relative group">
            <button className="hover:bg-[var(--color-primary-dark)] px-3 py-2 rounded">
              File
            </button>
            <ul className="absolute left-0 mt-1 w-52 bg-[var(--color-background)] text-[var(--color-text)] shadow-lg rounded-md overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              <li>
                <button className="block w-full text-left px-4 py-2 bg-[var(--color-background-secondary)] hover:bg-[#E281B1] hover:text-[var(--color-text-light)]">
                  New Workspace
                </button>
              </li>
              <li>
                <button className="block w-full text-left px-4 py-2 bg-[var(--color-background-secondary)] hover:bg-[#E281B1] hover:text-[var(--color-text-light)]">
                  Open Dataset
                </button>
              </li>
              <li>
                <button className="block w-full text-left px-4 py-2 bg-[var(--color-background-secondary)] hover:bg-[#E281B1] hover:text-[var(--color-text-light)]">
                  Save Workspace
                </button>
              </li>
              <li>
                <button className="block w-full text-left px-4 py-2 bg-[var(--color-background-secondary)] hover:bg-[#E281B1] hover:text-[var(--color-text-light)]">
                  Export Processed Data
                </button>
              </li>
              <li>
                <button className="block w-full text-left px-4 py-2 bg-[var(--color-background-secondary)] hover:bg-[#E281B1] hover:text-[var(--color-text-light)]">
                  Exit
                </button>
              </li>
            </ul>
          </li>

          {/* Data Menu */}
          <li className="relative group">
            <button className="hover:bg-[var(--color-primary-dark)] px-3 py-2 rounded">
              Data
            </button>
            <ul className="absolute left-0 mt-1 w-48 bg-[var(--color-background)] text-[var(--color-text)] shadow-lg rounded-md overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              <li>
                <button className="block w-full text-left px-4 py-2 bg-[var(--color-background-secondary)] hover:bg-[#E281B1] hover:text-[var(--color-text-light)]">
                  Load Database A
                </button>
              </li>
              <li>
                <button className="block w-full text-left px-4 py-2 bg-[var(--color-background-secondary)] hover:bg-[#E281B1] hover:text-[var(--color-text-light)]">
                  Load Database B
                </button>
              </li>
              <li>
                <button className="block w-full text-left px-4 py-2 bg-[var(--color-background-secondary)] hover:bg-[#E281B1] hover:text-[var(--color-text-light)]">
                  Inspect Schema
                </button>
              </li>
            </ul>
          </li>

          {/* Processing Menu */}
          <li
            className="relative"
            onMouseEnter={handleProcessingEnter}
            onMouseLeave={handleProcessingLeave}
          >
            <button className="hover:bg-[var(--color-primary-dark)] px-3 py-2 rounded">
              Processing
            </button>
            <ul
              className={`absolute left-0 mt-1 w-48 bg-[var(--color-background)] text-[var(--color-text)] shadow-lg rounded-md overflow-visible transition-all duration-150 z-10 ${
                isProcessingOpen
                  ? "opacity-100 visible pointer-events-auto"
                  : "opacity-0 invisible pointer-events-none"
              }`}
            >
              <li
                className="relative"
                onMouseEnter={handlePreTreatmentEnter}
                onMouseLeave={handlePreTreatmentLeave}
              >
                <button className="flex items-center justify-between w-full px-4 py-2 bg-[var(--color-background-secondary)] hover:bg-[#E281B1] hover:text-[var(--color-text-light)] rounded-t-md">
                  Pre-treatment
                  <span>▶</span>
                </button>
                {/* Invisible bridge to prevent gap */}
                <div
                  className={`absolute left-full top-0 w-4 h-full z-10 ${
                    isPreTreatmentOpen
                      ? "opacity-100 visible pointer-events-auto"
                      : "opacity-0 invisible pointer-events-none"
                  }`}
                ></div>
                <ul
                  className={`absolute left-full top-0 ml-1 w-48 bg-[var(--color-background)] text-[var(--color-text)] shadow-lg rounded-md overflow-visible transition-all duration-150 z-20 ${
                    isPreTreatmentOpen
                      ? "opacity-100 visible pointer-events-auto"
                      : "opacity-0 invisible pointer-events-none"
                  }`}
                >
                  <li>
                    <button className="block w-full text-left px-4 py-2 bg-[var(--color-background-secondary)] hover:bg-[#E281B1] hover:text-[var(--color-text-light)] rounded-t-md">
                      Fix Missing Data
                    </button>
                  </li>
                  <li>
                    <button className="block w-full text-left px-4 py-2 bg-[var(--color-background-secondary)] hover:bg-[#E281B1] hover:text-[var(--color-text-light)]">
                      Normalization
                    </button>
                  </li>
                  <li>
                    <button className="block w-full text-left px-4 py-2 bg-[var(--color-background-secondary)] hover:bg-[#E281B1] hover:text-[var(--color-text-light)] rounded-b-md">
                      Standardization
                    </button>
                  </li>
                </ul>
              </li>
              <li>
                <button className="block w-full text-left px-4 py-2 bg-[var(--color-background-secondary)] hover:bg-[#E281B1] hover:text-[var(--color-text-light)] rounded-b-md">
                  Fusion / Merge
                </button>
              </li>
            </ul>
          </li>

          {/* View Menu */}
          <li className="relative group">
            <button className="hover:bg-[var(--color-primary-dark)] px-3 py-2 rounded">
              View
            </button>
            <ul className="absolute left-0 mt-1 w-48 bg-[var(--color-background)] text-[var(--color-text)] shadow-lg rounded-md overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              <li>
                <button
                  onClick={() =>
                    setBeforeAfterMode(
                      beforeAfterMode === "Split" ? "Tabs" : "Split"
                    )
                  }
                  className="block w-full text-left px-4 py-2 bg-[var(--color-background-secondary)] hover:bg-[#E281B1] hover:text-[var(--color-text-light)]"
                >
                  Before/After: {beforeAfterMode}
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    setDiffHighlights(diffHighlights === "On" ? "Off" : "On")
                  }
                  className="block w-full text-left px-4 py-2 bg-[var(--color-background-secondary)] hover:bg-[#E281B1] hover:text-[var(--color-text-light)]"
                >
                  Diff Highlights {diffHighlights}
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    setStatusBarVisible(
                      statusBarVisible === "On" ? "Off" : "On"
                    )
                  }
                  className="block w-full text-left px-4 py-2 bg-[var(--color-background-secondary)] hover:bg-[#E281B1] hover:text-[var(--color-text-light)]"
                >
                  Toggle Status Bar ({statusBarVisible})
                </button>
              </li>
            </ul>
          </li>

          {/* Pipeline Menu */}
          <li className="relative group">
            <button className="hover:bg-[var(--color-primary-dark)] px-3 py-2 rounded">
              Pipeline
            </button>
            <ul className="absolute left-0 mt-1 w-48 bg-[var(--color-background)] text-[var(--color-text)] shadow-lg rounded-md overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              <li>
                <button className="block w-full text-left px-4 py-2 bg-[var(--color-background-secondary)] hover:bg-[#E281B1] hover:text-[var(--color-text-light)]">
                  View Steps
                </button>
              </li>
              <li>
                <button className="block w-full text-left px-4 py-2 bg-[var(--color-background-secondary)] hover:bg-[#E281B1] hover:text-[var(--color-text-light)]">
                  Undo Last Step
                </button>
              </li>
              <li>
                <button className="block w-full text-left px-4 py-2 bg-[var(--color-background-secondary)] hover:bg-[#E281B1] hover:text-[var(--color-text-light)]">
                  Redo
                </button>
              </li>
              <li>
                <button className="block w-full text-left px-4 py-2 bg-[var(--color-background-secondary)] hover:bg-[#E281B1] hover:text-[var(--color-text-light)]">
                  Clear Pipeline
                </button>
              </li>
            </ul>
          </li>

          {/* Help Menu */}
          <li className="relative group">
            <button className="hover:bg-[var(--color-primary-dark)] px-3 py-2 rounded">
              Help
            </button>
            <ul className="absolute left-0 mt-1 w-48 bg-[var(--color-background)] text-[var(--color-text)] shadow-lg rounded-md overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              <li>
                <button className="block w-full text-left px-4 py-2 bg-[var(--color-background-secondary)] hover:bg-[#E281B1] hover:text-[var(--color-text-light)]">
                  Shortcuts
                </button>
              </li>
              <li>
                <button className="block w-full text-left px-4 py-2 bg-[var(--color-background-secondary)] hover:bg-[#E281B1] hover:text-[var(--color-text-light)]">
                  About
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
