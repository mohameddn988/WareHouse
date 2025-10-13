"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/context/AuthContext";

interface Dataset {
  id: string;
  name: string;
  size: string;
  rows: number;
  lastImported: string;
  type: string;
  projectId?: string;
}

// Icon Components
const FileIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
    />
  </svg>
);

const DatabaseIcon = () => (
  <svg
    className="w-5 h-5"
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
);

const ClockIcon = () => (
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
);

export default function DatasetsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchDatasets();
    }
  }, [user]);

  const fetchDatasets = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      const response = await fetch("/api/dataset", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch datasets");
      }

      const data = await response.json();

      // Transform to match the expected format
      const transformedDatasets = data.map((dataset: any) => ({
        id: dataset._id,
        name: dataset.name,
        size: `${(dataset.fileSize / 1024 / 1024).toFixed(2)} MB`,
        rows: dataset.rowCount || 0,
        lastImported: new Date(dataset.createdAt).toLocaleDateString("fr-FR"),
        type: dataset.fileType.toUpperCase(),
        projectId: dataset.projectId,
      }));

      setDatasets(transformedDatasets);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading datasets");
    } finally {
      setLoading(false);
    }
  };

  const handleDatasetClick = (datasetId: string) => {
    router.push(`/dataset/${datasetId}`);
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "csv":
        return "bg-green-50 text-green-700 border-green-200";
      case "json":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "excel":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "xml":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "yaml":
      case "yml":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "sql":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading datasets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Error Loading Datasets
          </h1>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={fetchDatasets}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1 h-12 bg-blue-600 rounded-full"></div>
            <h1 className="text-4xl font-bold text-slate-900">All Datasets</h1>
          </div>
          <p className="text-slate-600 text-lg">
            View and manage all your datasets
          </p>
        </div>

        {/* Datasets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {datasets.map((dataset) => (
            <div
              key={dataset.id}
              onClick={() => handleDatasetClick(dataset.id)}
              className="group bg-white border border-slate-200 hover:border-blue-300 rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {dataset.name}
                  </h3>
                  <span
                    className={`inline-flex items-center text-xs px-3 py-1 rounded-full border font-medium ${getTypeColor(
                      dataset.type
                    )}`}
                  >
                    {dataset.type}
                  </span>
                </div>
                <DatabaseIcon />
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Size:</span>
                  <span className="font-medium text-slate-900">
                    {dataset.size}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Rows:</span>
                  <span className="font-medium text-slate-900">
                    {dataset.rows.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="flex items-center text-xs text-slate-500 pt-3 border-t border-slate-100">
                <ClockIcon />
                <span className="ml-2">Imported {dataset.lastImported}</span>
              </div>
            </div>
          ))}
        </div>

        {datasets.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileIcon />
            </div>
            <p className="text-slate-600 font-medium">No datasets found</p>
            <p className="text-slate-500 text-sm mt-1">
              Upload your first dataset to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
