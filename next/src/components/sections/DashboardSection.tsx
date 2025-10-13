'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/context/AuthContext';

interface Project {
  id: string;
  name: string;
  lastModified: string;
  description: string;
  status: "active" | "completed" | "draft";
}

interface Dataset {
  id: string;
  name: string;
  size: string;
  rows: number;
  lastImported: string;
  type: string;
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
  const { user } = useAuth();
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [recentDatasets, setRecentDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProjects();
      fetchDatasets();
    }
  }, [user]);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/project', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const projects = await response.json();
        // Transform to match the expected format
        const transformedProjects = projects.slice(0, 3).map((project: any) => ({
          id: project._id,
          name: project.name,
          lastModified: new Date(project.updatedAt).toLocaleDateString('fr-FR'),
          description: project.description || '',
          status: project.status,
        }));
        setRecentProjects(transformedProjects);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDatasets = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/dataset', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const datasets = await response.json();
        // Transform to match the expected format and take only the 3 most recent
        const transformedDatasets = datasets.slice(0, 3).map((dataset: any) => ({
          id: dataset._id,
          name: dataset.name,
          size: `${(dataset.fileSize / 1024 / 1024).toFixed(2)} MB`,
          rows: dataset.rowCount || 0,
          lastImported: new Date(dataset.createdAt).toLocaleDateString('fr-FR'),
          type: dataset.fileType.toUpperCase(),
        }));
        setRecentDatasets(transformedDatasets);
      }
    } catch (error) {
      console.error('Error fetching datasets:', error);
    }
  };

  const router = useRouter();

  const handleProjectClick = (projectId: string) => {
    router.push(`/project/${projectId}`);
  };

  const handleDatasetClick = (datasetId: string) => {
    router.push(`/dataset/${datasetId}`);
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

        {/* Recent Projects Section */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
              <h2 className="text-2xl font-bold text-slate-900">
                Recent Projects
              </h2>
            </div>
            <button
              onClick={() => router.push('/project')}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors group"
            >
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
            <button
              onClick={() => router.push('/dataset')}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors group"
            >
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
