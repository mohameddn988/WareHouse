"use client";

import React from "react";
import { Clock, HardDrive } from "lucide-react";

interface StatusBarProps {
  currentDataset?: "A" | "B";
  rows?: number;
  columns?: number;
  lastOperation?: string;
  processingTime?: string;
  memoryUsage?: string;
}

const StatusBar: React.FC<StatusBarProps> = ({
  currentDataset = "A",
  rows = 1234,
  columns = 12,
  lastOperation = "Remove Duplicates",
  processingTime = "0.45s",
  memoryUsage = "24.5 MB",
}) => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-[var(--color-primary)] text-[var(--color-text)]  px-4 py-2 z-10">
      <div className="flex items-center justify-between text-xs">
        {/* Left Section */}
        <div className="flex items-center gap-6">
          {/* Current Dataset */}
          <div className="flex items-center gap-2">
            <span className="text-[var(--color-text-secondary)]">Dataset:</span>
            <span className="font-semibold bg-[var(--color-accent)] text-[var(--color-text-light)] px-2 py-1 rounded">
              {currentDataset}
            </span>
          </div>

          {/* Dimensions */}
          <div className="flex items-center gap-2">
            <span className="text-[var(--color-text-secondary)]">Size:</span>
            <span className="font-medium">
              {rows.toLocaleString()} × {columns}
            </span>
          </div>

          {/* Last Operation */}
          <div className="flex items-center gap-2">
            <span className="text-[var(--color-text-secondary)]">
              Last Operation:
            </span>
            <span className="font-medium">{lastOperation}</span>
          </div>

          {/* Processing Time */}
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span className="text-[var(--color-text-secondary)]">Time:</span>
            <span className="font-medium">{processingTime}</span>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-6">
          {/* Memory Usage */}
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4" />
            <span className="text-[var(--color-text-secondary)]">
              Memory:
            </span>
            <span className="font-medium">{memoryUsage}</span>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-medium text-green-400">Ready</span>
          </div>

          {/* Timestamp */}
          <div className="text-[var(--color-text-dark)]">
            {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default StatusBar;
