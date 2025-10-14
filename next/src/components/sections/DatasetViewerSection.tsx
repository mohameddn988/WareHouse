'use client';

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/components/context/AuthContext";
import { useDataset } from "@/components/context/DatasetContext";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import { parseString as parseXML } from "xml2js";
import * as yaml from "yaml";

interface DatasetInfo {
  id: string;
  name: string;
  size: string;
  rows: number;
  columns: number;
  lastImported: string;
  type: string;
  projectId?: string;
}

interface ColumnStats {
  name: string;
  type: "numeric" | "text" | "date";
  mean?: number;
  min?: number;
  max?: number;
  missingValues: number;
  uniqueValues?: number;
}

interface DataRow {
  [key: string]: string | number | null;
}

interface DatasetViewerProps {
  datasetId: string;
}

const DatasetViewer: React.FC<DatasetViewerProps> = ({ datasetId }) => {
  const { user } = useAuth();
  const {
    currentData: contextCurrentData,
    setCurrentData: setContextCurrentData,
    setOriginalData: setContextOriginalData,
    setDatasetId: setContextDatasetId,
    treatedData,
    lastOperationName,
    logs,
    clearLogs,
    setOnTreatmentApplied,
  } = useDataset();
  const [datasetInfo, setDatasetInfo] = useState<DatasetInfo | null>(null);
  const [originalData, setOriginalData] = useState<DataRow[]>([]);
  const [allParsedData, setAllParsedData] = useState<DataRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(100);
  const [maxRows] = useState(10000);
  const [treatedDataPage, setTreatedDataPage] = useState(0);
  const [treatedDataCurrentPage, setTreatedDataCurrentPage] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (datasetId && user) {
      fetchDatasetInfo();
    }
  }, [datasetId, user]);

  const lastSyncedDataRef = useRef<string | null>(null);
  const lastSyncedDatasetIdRef = useRef<string | null>(null);

  // Sync local data with context when allParsedData changes
  useEffect(() => {
    if (allParsedData.length > 0) {
      const currentDataString = JSON.stringify(allParsedData);
      const datasetIdChanged = lastSyncedDatasetIdRef.current !== datasetId;
      const dataChanged = lastSyncedDataRef.current !== currentDataString;

      if (datasetIdChanged || dataChanged) {
        setContextDatasetId(datasetId);
        setContextOriginalData(JSON.parse(JSON.stringify(allParsedData)));
        setContextCurrentData(JSON.parse(JSON.stringify(allParsedData)));
        lastSyncedDataRef.current = currentDataString;
        lastSyncedDatasetIdRef.current = datasetId;
      }
    }
  }, [allParsedData, datasetId]);

  // Reset treated data pagination when treated data changes
  useEffect(() => {
    setTreatedDataCurrentPage(0);
  }, [treatedData]);

  // Update displayed data when context data changes (from treatment operations)
  // Note: Since we now create new datasets instead of modifying current data,
  // we don't need to sync the displayed data with context changes
  useEffect(() => {
    // This effect is now disabled since we create new datasets
    // The current dataset remains unchanged
  }, [contextCurrentData]);

  const loadMoreData = async () => {
    if (loadingMore || !hasMoreData) return;

    setLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const startIndex = nextPage * pageSize;
      const endIndex = Math.min(
        startIndex + pageSize,
        Math.min(allParsedData.length, maxRows)
      );

      const newRows = allParsedData.slice(startIndex, endIndex);
      setOriginalData((prev) => [...prev, ...newRows]);
      setCurrentPage(nextPage);
      setHasMoreData(endIndex < allParsedData.length && endIndex < maxRows);
    } catch (error) {
      console.error("Error loading more data:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  const loadMoreTreatedData = async () => {
    if (
      loadingMore ||
      !treatedData ||
      treatedDataCurrentPage * pageSize >= treatedData.length
    )
      return;

    setLoadingMore(true);
    try {
      const nextPage = treatedDataCurrentPage + 1;
      const startIndex = nextPage * pageSize;
      const endIndex = Math.min(startIndex + pageSize, treatedData.length);

      // For treated data, we just increment the page counter since we already have all data
      setTreatedDataCurrentPage(nextPage);
    } catch (error) {
      console.error("Error loading more treated data:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  const fetchDatasetInfo = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      const response = await fetch(`/api/dataset/${datasetId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Dataset non trouvé");
      }

      const data = await response.json();

      // Transform the data to match the expected format
      const transformedData: DatasetInfo = {
        id: data._id,
        name: data.name,
        size: `${(data.fileSize / 1024 / 1024).toFixed(2)} MB`,
        rows: data.rowCount || 0,
        columns: data.columnCount || 0,
        lastImported: new Date(data.createdAt).toLocaleDateString("fr-FR"),
        type: data.fileType.toUpperCase(),
        projectId: data.projectId,
      };

      setDatasetInfo(transformedData);

      // Load actual dataset content based on file type
      await fetchDatasetContent(data._id, data.fileType);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement du dataset"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDataset = async () => {
    if (!datasetInfo) return;

    try {
      setDeleting(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/dataset/${datasetInfo.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression du dataset");
      }

      // Redirect to project page or dashboard
      const redirectUrl = datasetInfo.projectId
        ? `/project/${datasetInfo.projectId}`
        : "/project";
      window.location.href = redirectUrl;
    } catch (error) {
      console.error("Error deleting dataset:", error);
      alert("Erreur lors de la suppression du dataset");
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleExportTreatedData = () => {
    if (!treatedData || treatedData.length === 0) {
      alert("No treated data available to export");
      return;
    }

    // Convert treated data to CSV
    const headers = Object.keys(treatedData[0]);
    const csvRows = [
      headers.join(","),
      ...treatedData.map((row) =>
        headers
          .map((header) => {
            const value = row[header];
            const stringValue =
              value === null || value === undefined ? "" : String(value);
            // Escape commas and quotes in CSV
            if (
              stringValue.includes(",") ||
              stringValue.includes('"') ||
              stringValue.includes("\n")
            ) {
              return `"${stringValue.replace(/"/g, '""')}"`;
            }
            return stringValue;
          })
          .join(",")
      ),
    ];

    const csvContent = csvRows.join("\n");

    // Create filename with operation name
    const baseName = datasetInfo?.name?.replace(/\.[^/.]+$/, "") || "dataset"; // Remove extension
    const operationSuffix = lastOperationName
      ? `_${lastOperationName.replace(/\s+/g, "_")}`
      : "";
    const fileName = `${baseName}${operationSuffix}_treated.csv`;

    // Create and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const fetchDatasetContent = async (id: string, fileType: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/dataset/${id}?download=true`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Impossible de charger le contenu du dataset");
      }

      if (fileType === "csv") {
        const content = await response.text();
        await parseCSVContent(content);
      } else if (fileType === "json") {
        const content = await response.text();
        await parseJSONContent(content);
      } else if (fileType === "excel") {
        // Parse Excel files using xlsx library
        const arrayBuffer = await response.arrayBuffer();
        await parseExcelContent(arrayBuffer);
      } else if (fileType === "xml") {
        const content = await response.text();
        await parseXMLContent(content);
      } else if (fileType === "yaml" || fileType === "yml") {
        const content = await response.text();
        await parseYAMLContent(content);
      } else if (fileType === "sql") {
        const content = await response.text();
        await parseSQLContent(content);
      } else {
        // Fallback for unexpected file types
        throw new Error(`Unsupported file type: ${fileType}`);
      }
    } catch (err) {
      console.error("Error fetching dataset content:", err);
      // Fallback to sample data
      const sampleData = [
        {
          order_id: "1",
          customer_name: "John Doe",
          product: "Widget A",
          quantity: "5",
          price: "10.99",
          total: "54.95",
          date: "2024-01-01",
          region: "North",
        },
        {
          order_id: "2",
          customer_name: "Jane Smith",
          product: "Widget B",
          quantity: "3",
          price: "15.50",
          total: "46.50",
          date: "2024-01-02",
          region: "South",
        },
        {
          order_id: "3",
          customer_name: "Bob Johnson",
          product: "Widget C",
          quantity: "2",
          price: "25.00",
          total: "50.00",
          date: "2024-01-03",
          region: "East",
        },
      ];
      setAllParsedData(sampleData);
      setColumns([
        "order_id",
        "customer_name",
        "product",
        "quantity",
        "price",
        "total",
        "date",
        "region",
      ]);

      // Load first page of sample data
      const initialRows = sampleData.slice(0, pageSize);
      setOriginalData(initialRows);
      setHasMoreData(sampleData.length > pageSize);
      setCurrentPage(0);
    }
  };

  const parseCSVContent = async (csvText: string) => {
    const lines = csvText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (lines.length === 0) {
      setOriginalData([]);
      setColumns([]);
      setHasMoreData(false);
      return;
    }

    // Simple CSV parser that handles quoted fields
    const parseCSVLine = (line: string): string[] => {
      const result: string[] = [];
      let current = "";
      let inQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
          if (inQuotes && line[i + 1] === '"') {
            // Escaped quote
            current += '"';
            i++; // Skip next quote
          } else {
            // Toggle quote state
            inQuotes = !inQuotes;
          }
        } else if (char === "," && !inQuotes) {
          // Field separator
          result.push(current);
          current = "";
        } else {
          current += char;
        }
      }

      // Add the last field
      result.push(current);
      return result;
    };

    // Parse CSV
    const headers = parseCSVLine(lines[0]);
    const allRows: DataRow[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      if (values.length >= headers.length) {
        const row: DataRow = {};
        headers.forEach((header, index) => {
          const value = values[index]?.trim();
          row[header] = value === "" ? null : value;
        });
        allRows.push(row);
      }
    }

    // Store all parsed data for pagination
    setAllParsedData(allRows);
    setColumns([...new Set(headers)]); // Ensure unique column names

    // Load first page
    const initialRows = allRows.slice(0, pageSize);
    setOriginalData(initialRows);
    setHasMoreData(allRows.length > pageSize);
    setCurrentPage(0);
  };

  const parseJSONContent = async (jsonText: string) => {
    try {
      const data = JSON.parse(jsonText);
      let allRows: DataRow[] = [];
      let headers: string[] = [];

      // Handle different JSON structures
      if (Array.isArray(data)) {
        // Array of objects
        if (
          data.length > 0 &&
          typeof data[0] === "object" &&
          !Array.isArray(data[0])
        ) {
          // Get all unique keys from all objects (in case objects have different keys)
          const allKeys = new Set<string>();
          data.forEach((item) => {
            if (typeof item === "object" && item !== null) {
              Object.keys(item).forEach((key) => allKeys.add(key));
            }
          });
          headers = Array.from(allKeys);

          allRows = data.map((item) => {
            const row: DataRow = {};
            headers.forEach((header) => {
              const value = item[header];
              // Handle nested objects/arrays by stringifying them
              if (value !== undefined && value !== null) {
                if (typeof value === "object") {
                  row[header] = JSON.stringify(value);
                } else {
                  row[header] = String(value);
                }
              } else {
                row[header] = null;
              }
            });
            return row;
          });
        } else {
          // Simple array or array of arrays
          headers = ["index", "value"];
          allRows = data.map((item, index) => ({
            index: String(index + 1),
            value:
              typeof item === "object" ? JSON.stringify(item) : String(item),
          }));
        }
      } else if (typeof data === "object" && data !== null) {
        // Single object - convert to key-value pairs for better display
        headers = ["key", "value"];
        allRows = Object.entries(data).map(([key, value]) => ({
          key: key,
          value:
            typeof value === "object" ? JSON.stringify(value) : String(value),
        }));
      } else {
        // Primitive value
        headers = ["value"];
        allRows = [{ value: String(data) }];
      }

      // Store all parsed data for pagination
      setAllParsedData(allRows);
      setColumns(headers);

      // Load first page
      const initialRows = allRows.slice(0, pageSize);
      setOriginalData(initialRows);
      setHasMoreData(allRows.length > pageSize);
      setCurrentPage(0);
    } catch (error) {
      // If JSON parsing fails, treat as text
      await parseTextContent(jsonText, "json");
    }
  };

  const parseExcelContent = async (arrayBuffer: ArrayBuffer) => {
    try {
      // Read the Excel file
      const workbook = XLSX.read(arrayBuffer, { type: "array" });

      // Get the first worksheet
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      // Convert to JSON
      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: null,
        raw: false, // Convert dates and numbers to strings for display
      });

      if (jsonData.length === 0) {
        setOriginalData([]);
        setColumns([]);
        setHasMoreData(false);
        return;
      }

      // First row is headers
      const headers: string[] = jsonData[0].map((h: any, i: number) =>
        h ? String(h) : `Column_${i + 1}`
      );

      // Convert remaining rows to objects
      const allRows: DataRow[] = [];
      for (let i = 1; i < jsonData.length; i++) {
        const row: DataRow = {};
        headers.forEach((header: string, index: number) => {
          const value = jsonData[i][index];
          row[header] =
            value !== undefined && value !== null ? String(value) : null;
        });
        allRows.push(row);
      }

      // Store all parsed data for pagination
      setAllParsedData(allRows);
      setColumns([...new Set(headers)]);

      // Load first page
      const initialRows = allRows.slice(0, pageSize);
      setOriginalData(initialRows);
      setHasMoreData(allRows.length > pageSize);
      setCurrentPage(0);
    } catch (error) {
      console.error("Error parsing Excel file:", error);
      // Fallback to showing an error message
      const rows: DataRow[] = [
        {
          error: "Unable to parse Excel file",
          message: String(error),
        },
      ];
      setOriginalData(rows);
      setColumns(["error", "message"]);
      setHasMoreData(false);
    }
  };

  const parseTextContent = async (textContent: string, fileType: string) => {
    // For text-based files that aren't structured, parse all lines
    const allLines = textContent.split("\n");
    const allRows: DataRow[] = allLines
      .filter((line) => line.trim().length > 0) // Remove empty lines
      .map((line, index) => ({
        line_number: String(index + 1),
        content: line.trim(),
      }));

    // Store all parsed data for pagination
    setAllParsedData(allRows);
    setColumns(["line_number", "content"]);

    // Load first page
    const initialRows = allRows.slice(0, pageSize);
    setOriginalData(initialRows);
    setHasMoreData(allRows.length > pageSize);
    setCurrentPage(0);
  };

  const parseXMLContent = async (xmlText: string) => {
    try {
      parseXML(xmlText, { explicitArray: false }, (err, result) => {
        if (err) {
          console.error("Error parsing XML:", err);
          parseTextContent(xmlText, "xml");
          return;
        }

        // Convert XML object to flat table structure
        const flattenXML = (obj: any, prefix = ""): DataRow[] => {
          const rows: DataRow[] = [];

          if (typeof obj !== "object" || obj === null) {
            return [{ key: prefix, value: String(obj) }];
          }

          Object.entries(obj).forEach(([key, value]) => {
            const fullKey = prefix ? `${prefix}.${key}` : key;

            if (Array.isArray(value)) {
              value.forEach((item, index) => {
                if (typeof item === "object" && item !== null) {
                  rows.push(...flattenXML(item, `${fullKey}[${index}]`));
                } else {
                  rows.push({
                    key: `${fullKey}[${index}]`,
                    value: String(item),
                  });
                }
              });
            } else if (typeof value === "object" && value !== null) {
              rows.push(...flattenXML(value, fullKey));
            } else {
              rows.push({ key: fullKey, value: String(value) });
            }
          });

          return rows;
        };

        const allRows = flattenXML(result);

        // Store all parsed data for pagination
        setAllParsedData(allRows);
        setColumns(["key", "value"]);

        // Load first page
        const initialRows = allRows.slice(0, pageSize);
        setOriginalData(initialRows);
        setHasMoreData(allRows.length > pageSize);
        setCurrentPage(0);
      });
    } catch (error) {
      console.error("Error parsing XML:", error);
      await parseTextContent(xmlText, "xml");
    }
  };

  const parseYAMLContent = async (yamlText: string) => {
    try {
      const data = yaml.parse(yamlText);

      // Flatten YAML structure similar to XML
      const flattenYAML = (obj: any, prefix = ""): DataRow[] => {
        const rows: DataRow[] = [];

        if (typeof obj !== "object" || obj === null) {
          return [{ key: prefix, value: String(obj) }];
        }

        if (Array.isArray(obj)) {
          obj.forEach((item, index) => {
            const fullKey = `${prefix}[${index}]`;
            if (typeof item === "object" && item !== null) {
              rows.push(...flattenYAML(item, fullKey));
            } else {
              rows.push({ key: fullKey, value: String(item) });
            }
          });
        } else {
          Object.entries(obj).forEach(([key, value]) => {
            const fullKey = prefix ? `${prefix}.${key}` : key;

            if (typeof value === "object" && value !== null) {
              rows.push(...flattenYAML(value, fullKey));
            } else {
              rows.push({ key: fullKey, value: String(value) });
            }
          });
        }

        return rows;
      };

      const allRows = flattenYAML(data);

      // Store all parsed data for pagination
      setAllParsedData(allRows);
      setColumns(["key", "value"]);

      // Load first page
      const initialRows = allRows.slice(0, pageSize);
      setOriginalData(initialRows);
      setHasMoreData(allRows.length > pageSize);
      setCurrentPage(0);
    } catch (error) {
      console.error("Error parsing YAML:", error);
      await parseTextContent(yamlText, "yaml");
    }
  };

  const parseSQLContent = async (sqlText: string) => {
    // For SQL files, we'll show the statements in a structured way
    const statements = sqlText
      .split(";")
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0);

    const allRows: DataRow[] = statements.map((statement, index) => {
      // Try to identify statement type
      const type =
        statement
          .match(
            /^\s*(SELECT|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER|TRUNCATE)/i
          )?.[1]
          ?.toUpperCase() || "OTHER";

      return {
        statement_number: String(index + 1),
        type: type,
        statement: statement.substring(0, 500), // Limit statement length for display
      };
    });

    // Store all parsed data for pagination
    setAllParsedData(allRows);
    setColumns(["statement_number", "type", "statement"]);

    // Load first page
    const initialRows = allRows.slice(0, pageSize);
    setOriginalData(initialRows);
    setHasMoreData(allRows.length > pageSize);
    setCurrentPage(0);
  };

  const [columns, setColumns] = useState<string[]>([
    "order_id",
    "customer_name",
    "product",
    "quantity",
    "price",
    "total",
    "date",
    "region",
  ]);

  const [columnStats] = useState<ColumnStats[]>([
    {
      name: "order_id",
      type: "numeric",
      mean: 7710,
      min: 1,
      max: 15420,
      missingValues: 0,
      uniqueValues: 15420,
    },
    {
      name: "customer_name",
      type: "text",
      missingValues: 23,
      uniqueValues: 1847,
    },
    {
      name: "product",
      type: "text",
      missingValues: 0,
      uniqueValues: 156,
    },
    {
      name: "quantity",
      type: "numeric",
      mean: 24.5,
      min: 1,
      max: 100,
      missingValues: 5,
    },
    {
      name: "price",
      type: "numeric",
      mean: 45.67,
      min: 5.99,
      max: 999.99,
      missingValues: 0,
    },
    {
      name: "total",
      type: "numeric",
      mean: 1118.92,
      min: 5.99,
      max: 99999.0,
      missingValues: 5,
    },
    {
      name: "date",
      type: "date",
      missingValues: 0,
      uniqueValues: 365,
    },
    {
      name: "region",
      type: "text",
      missingValues: 0,
      uniqueValues: 4,
    },
  ]);

  // Processed data - cleaned and normalized
  const [processedData] = useState<DataRow[]>([
    {
      order_id: 1,
      customer_name: "John Doe",
      product: "Laptop",
      quantity: 1,
      price: 899.99,
      total: 899.99,
      date: "2024-01-15",
      region: "North",
    },
    {
      order_id: 2,
      customer_name: "Jane Smith",
      product: "Mouse",
      quantity: 2,
      price: 25.5,
      total: 51.0,
      date: "2024-01-15",
      region: "South",
    },
    {
      order_id: 3,
      customer_name: "Unknown Customer",
      product: "Keyboard",
      quantity: 1,
      price: 75.0,
      total: 75.0,
      date: "2024-01-16",
      region: "East",
    },
    {
      order_id: 4,
      customer_name: "Alice Brown",
      product: "Monitor",
      quantity: 2,
      price: 299.99,
      total: 599.98,
      date: "2024-01-16",
      region: "West",
    },
    {
      order_id: 5,
      customer_name: "Charlie Wilson",
      product: "Desk Chair",
      quantity: 1,
      price: 199.99,
      total: 199.99,
      date: "2024-01-17",
      region: "North",
    },
    {
      order_id: 6,
      customer_name: "Unknown Customer",
      product: "USB Cable",
      quantity: 5,
      price: 9.99,
      total: 49.95,
      date: "2024-01-17",
      region: "South",
    },
    {
      order_id: 7,
      customer_name: "Frank Miller",
      product: "Laptop Stand",
      quantity: 1,
      price: 45.0,
      total: 45.0,
      date: "2024-01-18",
      region: "East",
    },
    {
      order_id: 8,
      customer_name: "Grace Lee",
      product: "Webcam",
      quantity: 1,
      price: 89.99,
      total: 89.99,
      date: "2024-01-18",
      region: "West",
    },
  ]);

  const [selectedVisualization, setSelectedVisualization] = useState<
    "histogram" | "scatter" | "bar"
  >("histogram");
  const [selectedColumn, setSelectedColumn] = useState<string>("");
  const [selectedColumnY, setSelectedColumnY] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"original" | "treated" | "logs">(
    "original"
  );
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);

  // Register callback to switch to treated tab when treatment is applied
  useEffect(() => {
    setOnTreatmentApplied(() => () => {
      setActiveTab("treated");
    });

    return () => {
      setOnTreatmentApplied(null);
    };
  }, [setOnTreatmentApplied]);

  // Update selected columns when columns change
  useEffect(() => {
    if (columns.length > 0) {
      setSelectedColumns(columns);
      if (columns.length > 3) setSelectedColumn(columns[3]);
      if (columns.length > 4) setSelectedColumnY(columns[4]);
    }
  }, [columns]);

  // Get current data based on view mode
  const currentData = originalData;

  const numericColumns = columnStats
    .filter((col) => col.type === "numeric")
    .map((col) => col.name);

  const toggleColumnSelection = (column: string) => {
    if (selectedColumns.includes(column)) {
      setSelectedColumns(selectedColumns.filter((col) => col !== column));
    } else {
      setSelectedColumns([...selectedColumns, column]);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "numeric":
        return (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
            />
          </svg>
        );
      case "text":
        return (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        );
      case "date":
        return (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du dataset...</p>
        </div>
      </div>
    );
  }

  if (error || !datasetInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || "Dataset non trouvé"}
          </h1>
          <p className="text-gray-600">
            Impossible de charger les informations du dataset.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto p-8 space-y-6">
        {/* Header Section */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                <svg
                  className="w-7 h-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  {datasetInfo.name}
                </h1>
                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                      />
                    </svg>
                    {datasetInfo.size}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    {allParsedData.length > 0
                      ? allParsedData.length.toLocaleString()
                      : datasetInfo.rows.toLocaleString()}{" "}
                    rows × {datasetInfo.columns} columns
                  </span>
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Imported {datasetInfo.lastImported}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleExportTreatedData}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
              >
                Export
              </button>

              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium shadow-sm"
              >
                Delete Dataset
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setActiveTab("original")}
              className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors ${
                activeTab === "original"
                  ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              Original
            </button>
            <button
              onClick={() => setActiveTab("treated")}
              className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors ${
                activeTab === "treated"
                  ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              Treated
            </button>
            <button
              onClick={() => setActiveTab("logs")}
              className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors ${
                activeTab === "logs"
                  ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              Logs
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Original Tab */}
            {activeTab === "original" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-slate-900">
                      Original Data ({originalData.length} of{" "}
                      {Math.min(allParsedData.length, maxRows)} rows loaded)
                    </h3>
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        datasetInfo.type === "CSV"
                          ? "bg-green-100 text-green-700"
                          : datasetInfo.type === "EXCEL"
                          ? "bg-blue-100 text-blue-700"
                          : datasetInfo.type === "JSON"
                          ? "bg-purple-100 text-purple-700"
                          : datasetInfo.type === "XML"
                          ? "bg-orange-100 text-orange-700"
                          : datasetInfo.type === "YAML" ||
                            datasetInfo.type === "YML"
                          ? "bg-pink-100 text-pink-700"
                          : datasetInfo.type === "SQL"
                          ? "bg-cyan-100 text-cyan-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {datasetInfo.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-700">
                      Raw Data
                    </span>
                    <button className="px-3 py-1.5 text-sm bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">
                      Download Sample
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto border border-slate-200 rounded-lg shadow-sm">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
                      <tr>
                        {columns
                          .filter((col) => selectedColumns.includes(col))
                          .map((column, index) => (
                            <th
                              key={`${column}-${index}`}
                              className={`px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider ${
                                index === 0
                                  ? "sticky left-0 bg-slate-50 z-10"
                                  : ""
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span>{column}</span>
                                {column === "line_number" && (
                                  <span className="text-slate-400">#</span>
                                )}
                              </div>
                            </th>
                          ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                      {currentData.map((row, idx) => (
                        <tr
                          key={idx}
                          className="hover:bg-slate-50 transition-colors"
                        >
                          {columns
                            .filter((col) => selectedColumns.includes(col))
                            .map((column, colIndex) => {
                              const value = row[column];
                              const isLineContent = column === "content";
                              const isLongText =
                                value && String(value).length > 100;

                              return (
                                <td
                                  key={`${column}-${colIndex}`}
                                  className={`px-4 py-3 text-sm text-slate-700 ${
                                    isLineContent || isLongText
                                      ? "max-w-2xl"
                                      : "whitespace-nowrap"
                                  }`}
                                  title={
                                    value !== null ? String(value) : "null"
                                  }
                                >
                                  {value !== null ? (
                                    isLongText ? (
                                      <div
                                        className="truncate"
                                        title={String(value)}
                                      >
                                        {String(value)}
                                      </div>
                                    ) : (
                                      String(value)
                                    )
                                  ) : (
                                    <span className="text-slate-400 italic">
                                      null
                                    </span>
                                  )}
                                </td>
                              );
                            })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex flex-col items-center gap-3 pt-4">
                  <div className="text-sm text-slate-500 text-center">
                    Showing {currentData.length} of{" "}
                    {Math.min(allParsedData.length, maxRows).toLocaleString()}{" "}
                    loaded rows
                    {allParsedData.length > maxRows && (
                      <span className="text-amber-600">
                        {" "}
                        ({allParsedData.length.toLocaleString()} total
                        available, limited to {maxRows.toLocaleString()})
                      </span>
                    )}
                  </div>

                  {hasMoreData && currentData.length < maxRows && (
                    <button
                      onClick={loadMoreData}
                      disabled={loadingMore}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors font-medium shadow-sm flex items-center gap-2"
                    >
                      {loadingMore ? (
                        <>
                          <svg
                            className="animate-spin h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Loading...
                        </>
                      ) : (
                        <>
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 14l-7 7m0 0l-7-7m7 7V3"
                            />
                          </svg>
                          Load{" "}
                          {Math.min(
                            pageSize,
                            allParsedData.length - currentData.length,
                            maxRows - currentData.length
                          )}{" "}
                          More Rows
                        </>
                      )}
                    </button>
                  )}

                  {!hasMoreData && currentData.length >= pageSize && (
                    <div className="text-sm text-emerald-600 font-medium">
                      All available rows loaded
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Treated Tab */}
            {activeTab === "treated" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        Treated Data (
                        {Math.min(
                          (treatedDataCurrentPage + 1) * pageSize,
                          treatedData ? treatedData.length : 0
                        )}
                        /{treatedData ? treatedData.length : 0})
                      </h3>
                      {lastOperationName && (
                        <p className="text-sm text-slate-600 mt-1">
                          Operation:{" "}
                          <span className="font-medium text-emerald-600">
                            {lastOperationName}
                          </span>
                        </p>
                      )}
                    </div>
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700">
                      Processed
                    </span>
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        datasetInfo.type === "CSV"
                          ? "bg-green-100 text-green-700"
                          : datasetInfo.type === "EXCEL"
                          ? "bg-blue-100 text-blue-700"
                          : datasetInfo.type === "JSON"
                          ? "bg-purple-100 text-purple-700"
                          : datasetInfo.type === "XML"
                          ? "bg-orange-100 text-orange-700"
                          : datasetInfo.type === "YAML" ||
                            datasetInfo.type === "YML"
                          ? "bg-pink-100 text-pink-700"
                          : datasetInfo.type === "SQL"
                          ? "bg-cyan-100 text-cyan-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {datasetInfo.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700">
                      Processed Data
                    </span>
                  </div>
                </div>

                {/* Data Table */}
                <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          {columns
                            .filter((col) => selectedColumns.includes(col))
                            .map((column) => (
                              <th
                                key={column}
                                className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
                              >
                                {column}
                              </th>
                            ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {treatedData ? (
                          treatedData
                            .slice(0, (treatedDataCurrentPage + 1) * pageSize)
                            .map((row, idx) => (
                              <tr
                                key={idx}
                                className="hover:bg-slate-50 transition-colors"
                              >
                                {columns
                                  .filter((col) =>
                                    selectedColumns.includes(col)
                                  )
                                  .map((column) => (
                                    <td
                                      key={column}
                                      className="px-4 py-3 text-sm text-slate-700 font-mono max-w-xs truncate"
                                      title={String(row[column] ?? "")}
                                    >
                                      {row[column] !== null &&
                                      row[column] !== undefined
                                        ? String(row[column])
                                        : ""}
                                    </td>
                                  ))}
                              </tr>
                            ))
                        ) : (
                          <tr>
                            <td
                              colSpan={
                                columns.filter((col) =>
                                  selectedColumns.includes(col)
                                ).length + 1
                              }
                              className="px-4 py-8 text-center text-slate-500"
                            >
                              No processed data available. Apply a treatment
                              operation to see results here.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Load More Treated Data Button */}
                {treatedData &&
                  (treatedDataCurrentPage + 1) * pageSize <
                    treatedData.length && (
                    <div className="text-center">
                      <button
                        onClick={loadMoreTreatedData}
                        disabled={loadingMore}
                        className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                      >
                        {loadingMore ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Loading...
                          </div>
                        ) : (
                          `Load ${Math.min(
                            pageSize,
                            treatedData.length -
                              (treatedDataCurrentPage + 1) * pageSize
                          )} More Rows`
                        )}
                      </button>
                    </div>
                  )}

                {/* End of Treated Data Message */}
                {treatedData &&
                  (treatedDataCurrentPage + 1) * pageSize >=
                    treatedData.length &&
                  treatedData.length > 0 && (
                    <div className="text-center py-4">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-600 rounded-lg text-sm">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        All treated data loaded
                      </div>
                    </div>
                  )}

                {/* Column Filter */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-slate-900 mb-3">
                    Select Columns to Display
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {columns.map((column) => (
                      <button
                        key={column}
                        onClick={() => toggleColumnSelection(column)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          selectedColumns.includes(column)
                            ? "bg-blue-600 text-white shadow-sm"
                            : "bg-white text-slate-700 border border-slate-300 hover:border-blue-400"
                        }`}
                      >
                        {column}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Logs Tab */}
            {activeTab === "logs" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Processing Logs
                  </h3>
                  {logs.length > 0 && (
                    <button
                      onClick={clearLogs}
                      className="px-3 py-1.5 text-sm text-slate-600 hover:text-slate-800 border border-slate-300 rounded-lg hover:border-slate-400 transition-colors"
                    >
                      Clear Logs
                    </button>
                  )}
                </div>

                {logs.length === 0 ? (
                  <div className="text-center py-12">
                    <svg
                      className="w-12 h-12 text-slate-400 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <h4 className="text-lg font-medium text-slate-600 mb-2">
                      No Processing Logs Yet
                    </h4>
                    <p className="text-slate-500 mb-4">
                      Use the Treatment menu to apply data processing
                      operations.
                    </p>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                      <h5 className="text-sm font-semibold text-blue-800 mb-2">
                        How it works:
                      </h5>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>
                          • Treatments apply operations and show results in
                          Treated tab
                        </li>
                        <li>• Original data remains unchanged</li>
                        <li>
                          • Export button downloads treated data with operation
                          name
                        </li>
                        <li>
                          • Processing logs show operation results and status
                        </li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                    <div className="max-h-96 overflow-y-auto">
                      <div className="divide-y divide-slate-100">
                        {logs.map((log, index) => (
                          <div
                            key={index}
                            className={`p-4 ${
                              log.type === "success"
                                ? "bg-green-50 border-l-4 border-green-400"
                                : log.type === "error"
                                ? "bg-red-50 border-l-4 border-red-400"
                                : log.type === "warning"
                                ? "bg-yellow-50 border-l-4 border-yellow-400"
                                : "bg-blue-50 border-l-4 border-blue-400"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                                  log.type === "success"
                                    ? "bg-green-100 text-green-600"
                                    : log.type === "error"
                                    ? "bg-red-100 text-red-600"
                                    : log.type === "warning"
                                    ? "bg-yellow-100 text-yellow-600"
                                    : "bg-blue-100 text-blue-600"
                                }`}
                              >
                                {log.type === "success" && (
                                  <svg
                                    className="w-4 h-4"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                )}
                                {log.type === "error" && (
                                  <svg
                                    className="w-4 h-4"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                )}
                                {log.type === "warning" && (
                                  <svg
                                    className="w-4 h-4"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                )}
                                {log.type === "info" && (
                                  <svg
                                    className="w-4 h-4"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span
                                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                      log.type === "success"
                                        ? "bg-green-100 text-green-700"
                                        : log.type === "error"
                                        ? "bg-red-100 text-red-700"
                                        : log.type === "warning"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : "bg-blue-100 text-blue-700"
                                    }`}
                                  >
                                    {log.type.toUpperCase()}
                                  </span>
                                  <span className="text-xs text-slate-500">
                                    {log.timestamp.toLocaleString()}
                                  </span>
                                </div>
                                <p className="text-sm text-slate-700 whitespace-pre-line">
                                  {log.message}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Confirmer la suppression
            </h3>
            <p className="text-slate-600 mb-6">
              Êtes-vous sûr de vouloir supprimer le dataset "{datasetInfo?.name}
              " ? Cette action est irréversible.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
                disabled={deleting}
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteDataset}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                disabled={deleting}
              >
                {deleting ? "Suppression..." : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatasetViewer;
