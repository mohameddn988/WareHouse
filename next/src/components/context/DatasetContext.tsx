"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface DataRow {
  [key: string]: string | number | null;
}

interface DatasetContextType {
  currentData: DataRow[] | null;
  originalData: DataRow[] | null;
  treatedData: DataRow[] | null;
  lastOperationName: string | null;
  datasetId: string | null;
  setCurrentData: (data: DataRow[] | null) => void;
  setOriginalData: (data: DataRow[] | null) => void;
  setTreatedData: (data: DataRow[] | null, operationName?: string | null) => void;
  setDatasetId: (id: string | null) => void;
  updateData: (newData: DataRow[]) => void;
  resetToOriginal: () => void;
  addLog: (
    message: string,
    type: "success" | "error" | "info" | "warning"
  ) => void;
  logs: Array<{ message: string; type: string; timestamp: Date }>;
  clearLogs: () => void;
  onTreatmentApplied: (() => void) | null;
  setOnTreatmentApplied: (callback: (() => void) | null) => void;
}

const DatasetContext = createContext<DatasetContextType | undefined>(undefined);

export const DatasetProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentData, setCurrentData] = useState<DataRow[] | null>(null);
  const [originalData, setOriginalData] = useState<DataRow[] | null>(null);
  const [treatedData, setTreatedDataState] = useState<DataRow[] | null>(null);
  const [lastOperationName, setLastOperationName] = useState<string | null>(null);
  const [datasetId, setDatasetId] = useState<string | null>(null);
  const [onTreatmentApplied, setOnTreatmentApplied] = useState<(() => void) | null>(null);
  const [logs, setLogs] = useState<
    Array<{ message: string; type: string; timestamp: Date }>
  >([]);

  const setTreatedData = useCallback((data: DataRow[] | null, operationName?: string | null) => {
    setTreatedDataState(data);
    if (operationName !== undefined) {
      setLastOperationName(operationName);
    }
  }, []);

  const updateData = useCallback((newData: DataRow[]) => {
    setCurrentData(newData);
  }, []);

  const resetToOriginal = useCallback(() => {
    if (originalData) {
      setCurrentData(JSON.parse(JSON.stringify(originalData)));
      addLog("Data reset to original state", "info");
    }
  }, [originalData]);

  const addLog = useCallback(
    (message: string, type: "success" | "error" | "info" | "warning") => {
      setLogs((prev) => [...prev, { message, type, timestamp: new Date() }]);
    },
    []
  );

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  return (
    <DatasetContext.Provider
      value={{
        currentData,
        originalData,
        treatedData,
        lastOperationName,
        datasetId,
        setCurrentData,
        setOriginalData,
        setTreatedData,
        setDatasetId,
        updateData,
        resetToOriginal,
        addLog,
        logs,
        clearLogs,
        onTreatmentApplied,
        setOnTreatmentApplied,
      }}
    >
      {children}
    </DatasetContext.Provider>
  );
};

export const useDataset = () => {
  const context = useContext(DatasetContext);
  if (context === undefined) {
    throw new Error("useDataset must be used within a DatasetProvider");
  }
  return context;
};
