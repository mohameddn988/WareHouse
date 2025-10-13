'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface Project {
  id: string;
  name: string;
  lastModified: string;
  description: string;
  status: "active" | "completed" | "draft";
  progress?: number;
}

interface Dataset {
  id: string;
  name: string;
  size: string;
  rows: number;
  lastImported: string;
  type: string;
}

interface QuickAction {
  id: string;
  label: string;
  description: string;
  iconType: "folder" | "upload" | "document" | "clock";
}

// Icon Components
const FolderIcon = () => (
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
      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
    />
  </svg>
);

const UploadIcon = () => (
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
      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
    />
  </svg>
);

const DocumentIcon = () => (
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
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

const ClockIcon = () => (
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
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const ChartIcon = () => (
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
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  </svg>
);

const FileIcon = () => (
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
      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
    />
  </svg>
);

export default function DashboardSection() {
  // Sample data - Replace with actual data from your API/state management
  const recentProjects: Project[] = [
    {
      id: "1",
      name: "Sales Analysis Q4",
      lastModified: "2 hours ago",
      description: "Quarterly sales performance analysis",
      status: "active",
      progress: 75,
    },
    {
      id: "2",
      name: "Customer Segmentation",
      lastModified: "1 day ago",
      description: "Market segmentation study",
      status: "active",
      progress: 45,
    },
    {
      id: "3",
      name: "Inventory Forecast",
      lastModified: "3 days ago",
      description: "Predictive inventory management",
      status: "completed",
      progress: 100,
    },
  ];

  const recentDatasets: Dataset[] = [
    {
      id: "1",
      name: "sales_data_2024.csv",
      size: "2.4 MB",
      rows: 15420,
      lastImported: "1 hour ago",
      type: "CSV",
    },
    {
      id: "2",
      name: "customer_demographics.xlsx",
      size: "1.8 MB",
      rows: 8750,
      lastImported: "5 hours ago",
      type: "Excel",
    },
    {
      id: "3",
      name: "inventory_records.json",
      size: "3.1 MB",
      rows: 22100,
      lastImported: "2 days ago",
      type: "JSON",
    },
  ];

  const quickActions: QuickAction[] = [
    {
      id: "1",
      label: "New Project",
      description: "Start a new analysis project",
      iconType: "folder",
    },
    {
      id: "2",
      label: "Import Dataset",
      description: "Upload and import new data",
      iconType: "upload",
    },
    {
      id: "3",
      label: "Create Report",
      description: "Generate a new report",
      iconType: "document",
    },
    {
      id: "4",
      label: "Schedule Analysis",
      description: "Set up automated analysis",
      iconType: "clock",
    },
  ];

  const router = useRouter();

  const handleProjectClick = (projectId: string) => {
    console.log("Opening project:", projectId);
    // Add navigation logic here
  };

  const handleDatasetClick = (datasetId: string) => {
    router.push(`/dataset/${datasetId}`);
  };

  const handleQuickAction = (actionId: string) => {
    console.log("Performing action:", actionId);
    // Add action logic here
  };

  const getStatusColor = (status: Project["status"]) => {
    switch (status) {
      case "active":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "completed":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "draft":
        return "bg-slate-50 text-slate-700 border-slate-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const getIcon = (iconType: QuickAction["iconType"]) => {
    switch (iconType) {
      case "folder":
        return <FolderIcon />;
      case "upload":
        return <UploadIcon />;
      case "document":
        return <DocumentIcon />;
      case "clock":
        return <ClockIcon />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto p-8 space-y-8">
        {/* Welcome Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            Dashboard Overview
          </h1>
          <p className="text-slate-600 text-lg">
            Monitor your recent activity and manage your warehouse operations
          </p>
        </div>

        {/* Quick Actions Section */}
        <section className="mb-10">
          <div className="flex items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
              <h2 className="text-2xl font-bold text-slate-900">
                Quick Actions
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleQuickAction(action.id)}
                className="group bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-blue-400 transition-all duration-300 rounded-xl p-6 text-left shadow-sm hover:shadow-lg"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-blue-50 group-hover:bg-blue-100 rounded-lg text-blue-600 transition-colors duration-300">
                    {getIcon(action.iconType)}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {action.label}
                </h3>
                <p className="text-sm text-slate-600">{action.description}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Recent Projects Section */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
              <h2 className="text-2xl font-bold text-slate-900">
                Recent Projects
              </h2>
            </div>
            <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors group">
              View All
              <svg
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {recentProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => handleProjectClick(project.id)}
                className="group bg-white border border-slate-200 hover:border-blue-300 rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                      {project.name}
                    </h3>
                    <span
                      className={`inline-flex items-center text-xs px-3 py-1 rounded-full border font-medium ${getStatusColor(
                        project.status
                      )}`}
                    >
                      {project.status.charAt(0).toUpperCase() +
                        project.status.slice(1)}
                    </span>
                  </div>
                  <ChartIcon />
                </div>
                <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                  {project.description}
                </p>
                {project.progress !== undefined && (
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-slate-500">
                        Progress
                      </span>
                      <span className="text-xs font-semibold text-slate-700">
                        {project.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                <div className="flex items-center text-xs text-slate-500 pt-3 border-t border-slate-100">
                  <ClockIcon />
                  <span className="ml-2">Modified {project.lastModified}</span>
                </div>
              </div>
            ))}
          </div>
          {recentProjects.length === 0 && (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-sm">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FolderIcon />
              </div>
              <p className="text-slate-600 font-medium">No recent projects</p>
              <p className="text-slate-500 text-sm mt-1">
                Start a new project to get started
              </p>
            </div>
          )}
        </section>

        {/* Recent Datasets Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
              <h2 className="text-2xl font-bold text-slate-900">
                Recent Datasets
              </h2>
            </div>
            <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors group">
              View All
              <svg
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Dataset Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Size
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Records
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Last Import
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  {recentDatasets.map((dataset, index) => (
                    <tr
                      key={dataset.id}
                      className={`hover:bg-slate-50 transition-colors cursor-pointer ${
                        index % 2 === 0 ? "bg-white" : "bg-slate-25"
                      }`}
                      onClick={() => handleDatasetClick(dataset.id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                            <FileIcon />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-slate-900">
                              {dataset.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                          {dataset.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-700">
                        {dataset.size}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-700">
                        {dataset.rows.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {dataset.lastImported}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-800 font-semibold mr-4 transition-colors">
                          View
                        </button>
                        <button className="text-slate-600 hover:text-slate-800 font-semibold transition-colors">
                          Export
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {recentDatasets.length === 0 && (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ChartIcon />
                </div>
                <p className="text-slate-600 font-medium">
                  No datasets imported yet
                </p>
                <p className="text-slate-500 text-sm mt-1">
                  Import your first dataset to get started
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
