'use client';

import React, { useState } from 'react';

interface DatasetInfo {
  id: string;
  name: string;
  size: string;
  rows: number;
  columns: number;
  lastImported: string;
  type: string;
}

interface ColumnStats {
  name: string;
  type: 'numeric' | 'text' | 'date';
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
  // Sample data - Replace with actual API call
  const [datasetInfo] = useState<DatasetInfo>({
    id: datasetId,
    name: "sales_data_2024.csv",
    size: "2.4 MB",
    rows: 15420,
    columns: 8,
    lastImported: "1 hour ago",
    type: "CSV",
  });

  const [columns] = useState<string[]>([
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

  // Original data with missing values and issues
  const [originalData] = useState<DataRow[]>([
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
      customer_name: null,
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
      quantity: null,
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
      total: null,
      date: "2024-01-17",
      region: "North",
    },
    {
      order_id: 6,
      customer_name: null,
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
      quantity: null,
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

  // Statistics for processed data
  const [processedColumnStats] = useState<ColumnStats[]>([
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
      missingValues: 0, // Cleaned
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
      missingValues: 0, // Cleaned
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
      missingValues: 0, // Cleaned
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

  const [viewMode, setViewMode] = useState<"original" | "processed">(
    "original"
  );
  const [selectedVisualization, setSelectedVisualization] = useState<
    "histogram" | "scatter" | "bar"
  >("histogram");
  const [selectedColumn, setSelectedColumn] = useState<string>(columns[3]); // quantity
  const [selectedColumnY, setSelectedColumnY] = useState<string>(columns[4]); // price
  const [activeTab, setActiveTab] = useState<"preview" | "stats" | "visualize">(
    "preview"
  );
  const [selectedColumns, setSelectedColumns] = useState<string[]>(columns);

  // Get current data based on view mode
  const currentData = viewMode === "original" ? originalData : processedData;
  const currentStats =
    viewMode === "original" ? columnStats : processedColumnStats;

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
                    {datasetInfo.rows.toLocaleString()} rows ×{" "}
                    {datasetInfo.columns} columns
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
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm">
                Export
              </button>
              <button className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium">
                Settings
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setActiveTab("preview")}
              className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors ${
                activeTab === "preview"
                  ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              Data Preview
            </button>
            <button
              onClick={() => setActiveTab("stats")}
              className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors ${
                activeTab === "stats"
                  ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              Statistics
            </button>
            <button
              onClick={() => setActiveTab("visualize")}
              className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors ${
                activeTab === "visualize"
                  ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              Visualizations
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Preview Tab */}
            {activeTab === "preview" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-slate-900">
                    First {currentData.length} rows
                    {viewMode === "processed" && (
                      <span className="ml-2 text-sm text-emerald-600 font-normal">
                        (Cleaned & Processed)
                      </span>
                    )}
                  </h3>
                  <div className="flex items-center gap-3">
                    {/* Toggle Buttons */}
                    <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
                      <button
                        onClick={() => setViewMode("original")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium text-sm transition-all ${
                          viewMode === "original"
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
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
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        Original
                      </button>
                      <button
                        onClick={() => setViewMode("processed")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium text-sm transition-all ${
                          viewMode === "processed"
                            ? "bg-emerald-500 text-white shadow-sm"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        {viewMode === "processed" && (
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
                        )}
                        Traité
                      </button>
                    </div>

                    <button className="px-3 py-1.5 text-sm bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">
                      Download Sample
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto border border-slate-200 rounded-lg">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        {columns
                          .filter((col) => selectedColumns.includes(col))
                          .map((column) => (
                            <th
                              key={column}
                              className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider"
                            >
                              {column}
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
                            .map((column) => (
                              <td
                                key={column}
                                className="px-4 py-3 text-sm text-slate-700 whitespace-nowrap"
                              >
                                {row[column] !== null ? (
                                  String(row[column])
                                ) : (
                                  <span className="text-slate-400 italic">
                                    null
                                  </span>
                                )}
                              </td>
                            ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="text-sm text-slate-500 text-center pt-2">
                  Showing {currentData.length} of{" "}
                  {datasetInfo.rows.toLocaleString()} total rows
                </div>
              </div>
            )}

            {/* Statistics Tab */}
            {activeTab === "stats" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Column Statistics
                    {viewMode === "processed" && (
                      <span className="ml-2 text-sm text-emerald-600 font-normal">
                        (Cleaned Data)
                      </span>
                    )}
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentStats.map((stat) => (
                    <div
                      key={stat.name}
                      className="bg-slate-50 border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="text-slate-600">
                            {getTypeIcon(stat.type)}
                          </div>
                          <h4 className="font-semibold text-slate-900">
                            {stat.name}
                          </h4>
                        </div>
                        <span className="text-xs px-2 py-1 bg-white border border-slate-200 rounded-full text-slate-600">
                          {stat.type}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm">
                        {stat.type === "numeric" && (
                          <>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Mean:</span>
                              <span className="font-medium text-slate-900">
                                {stat.mean?.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Min:</span>
                              <span className="font-medium text-slate-900">
                                {stat.min?.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Max:</span>
                              <span className="font-medium text-slate-900">
                                {stat.max?.toFixed(2)}
                              </span>
                            </div>
                          </>
                        )}
                        {stat.uniqueValues !== undefined && (
                          <div className="flex justify-between">
                            <span className="text-slate-600">Unique:</span>
                            <span className="font-medium text-slate-900">
                              {stat.uniqueValues.toLocaleString()}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-slate-600">Missing:</span>
                          <span
                            className={`font-medium ${
                              stat.missingValues > 0
                                ? "text-orange-600"
                                : "text-emerald-600"
                            }`}
                          >
                            {stat.missingValues}{" "}
                            {stat.missingValues > 0 &&
                              `(${(
                                (stat.missingValues / datasetInfo.rows) *
                                100
                              ).toFixed(2)}%)`}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Visualization Tab */}
            {activeTab === "visualize" && (
              <div className="space-y-6">
                {/* Controls */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Visualization Type
                      </label>
                      <select
                        value={selectedVisualization}
                        onChange={(e) =>
                          setSelectedVisualization(e.target.value as any)
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      >
                        <option value="histogram">Histogram</option>
                        <option value="bar">Bar Chart</option>
                        <option value="scatter">Scatter Plot</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        {selectedVisualization === "scatter"
                          ? "X-Axis Column"
                          : "Column"}
                      </label>
                      <select
                        value={selectedColumn}
                        onChange={(e) => setSelectedColumn(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      >
                        {numericColumns.map((col) => (
                          <option key={col} value={col}>
                            {col}
                          </option>
                        ))}
                      </select>
                    </div>
                    {selectedVisualization === "scatter" && (
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Y-Axis Column
                        </label>
                        <select
                          value={selectedColumnY}
                          onChange={(e) => setSelectedColumnY(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        >
                          {numericColumns.map((col) => (
                            <option key={col} value={col}>
                              {col}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                {/* Visualization Display */}
                <div className="bg-white border border-slate-200 rounded-lg p-8">
                  <h4 className="text-lg font-semibold text-slate-900 mb-4">
                    {selectedVisualization === "histogram" &&
                      `Distribution of ${selectedColumn}`}
                    {selectedVisualization === "bar" &&
                      `${selectedColumn} Bar Chart`}
                    {selectedVisualization === "scatter" &&
                      `${selectedColumn} vs ${selectedColumnY}`}
                  </h4>

                  {/* Simple visualization placeholder */}
                  <div className="h-96 flex items-end justify-around gap-2 border-b-2 border-l-2 border-slate-300 p-4">
                    {selectedVisualization === "histogram" && (
                      <>
                        {[65, 45, 80, 55, 70, 90, 60, 75, 85, 50, 95, 70].map(
                          (height, idx) => (
                            <div
                              key={idx}
                              className="flex-1 flex flex-col items-center"
                            >
                              <div
                                className="w-full bg-blue-500 hover:bg-blue-600 transition-colors rounded-t"
                                style={{ height: `${height}%` }}
                              ></div>
                            </div>
                          )
                        )}
                      </>
                    )}
                    {selectedVisualization === "bar" && (
                      <>
                        {[85, 60, 95, 70, 75, 55, 90, 65].map((height, idx) => (
                          <div
                            key={idx}
                            className="flex-1 flex flex-col items-center"
                          >
                            <div
                              className="w-full bg-emerald-500 hover:bg-emerald-600 transition-colors rounded-t"
                              style={{ height: `${height}%` }}
                            ></div>
                          </div>
                        ))}
                      </>
                    )}
                    {selectedVisualization === "scatter" && (
                      <div className="relative w-full h-full">
                        {[
                          { x: 20, y: 30 },
                          { x: 35, y: 45 },
                          { x: 50, y: 60 },
                          { x: 25, y: 70 },
                          { x: 70, y: 40 },
                          { x: 80, y: 80 },
                          { x: 45, y: 50 },
                          { x: 60, y: 35 },
                          { x: 75, y: 65 },
                          { x: 15, y: 55 },
                          { x: 85, y: 25 },
                          { x: 40, y: 75 },
                          { x: 55, y: 45 },
                          { x: 30, y: 85 },
                          { x: 90, y: 50 },
                        ].map((point, idx) => (
                          <div
                            key={idx}
                            className="absolute w-3 h-3 bg-purple-500 rounded-full hover:scale-150 transition-transform"
                            style={{
                              left: `${point.x}%`,
                              bottom: `${point.y}%`,
                            }}
                          ></div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="mt-4 text-center text-sm text-slate-500">
                    Interactive visualization based on selected column(s)
                  </div>
                </div>

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
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatasetViewer;
