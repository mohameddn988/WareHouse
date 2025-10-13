"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/context/AuthContext";

interface Dataset {
  _id: string;
  name: string;
  description?: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  rowCount?: number;
  status: string;
  createdAt: string;
}

interface Project {
  _id: string;
  name: string;
  description?: string;
  status: string;
  createdAt: string;
}

const ProjectPage: React.FC = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showImportModal, setShowImportModal] = useState(false);
  const [importForm, setImportForm] = useState({
    name: "",
    description: "",
    file: null as File | null,
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (id && user) {
      fetchProjectAndDatasets();
    }
  }, [id, user]);

  const fetchProjectAndDatasets = async () => {
    try {
      const token = localStorage.getItem("token");
      const [projectRes, datasetsRes] = await Promise.all([
        fetch(`/api/project/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`/api/project/${id}/datasets`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!projectRes.ok) {
        throw new Error("Projet non trouvé");
      }

      const projectData = await projectRes.json();
      const datasetsData = await datasetsRes.json();

      setProject(projectData);
      setDatasets(datasetsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const handleDatasetClick = (datasetId: string) => {
    router.push(`/dataset/${datasetId}`);
  };

  const handleImportDataset = () => {
    setShowImportModal(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImportForm(prev => ({
        ...prev,
        file,
        name: prev.name || file.name.replace(/\.[^/.]+$/, ""), // Remove extension for name
      }));
    }
  };

  const handleDownloadDataset = async (datasetId: string, fileName: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/dataset/${datasetId}?download=true`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors du téléchargement");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    }
  };

  const handleImportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importForm.file || !importForm.name.trim()) {
      setError("Veuillez sélectionner un fichier et saisir un nom");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", importForm.file);
      formData.append("name", importForm.name.trim());
      formData.append("description", importForm.description.trim());
      formData.append("projectId", id as string);

      const response = await fetch("/api/dataset", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'importation du dataset");
      }

      const newDataset = await response.json();
      setDatasets((prev) => [newDataset, ...prev]);
      setShowImportModal(false);
      setImportForm({ name: "", description: "", file: null });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || "Projet non trouvé"}
          </h1>
          <button
            onClick={() => router.push("/")}
            className="text-indigo-600 hover:text-indigo-500"
          >
            Retour au tableau de bord
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Project Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {project.name}
              </h1>
              {project.description && (
                <p className="mt-2 text-gray-600">{project.description}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Créé le{" "}
                {new Date(project.createdAt).toLocaleDateString("fr-FR")}
              </p>
            </div>
            <button
              onClick={handleImportDataset}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Importer un dataset
            </button>
          </div>
        </div>

        {/* Datasets Section */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Datasets du projet ({datasets.length})
            </h2>
          </div>

          {datasets.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="text-gray-400 mb-4">
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun dataset
              </h3>
              <p className="text-gray-500 mb-6">
                Commencez par importer votre premier dataset dans ce projet.
              </p>
              <button
                onClick={handleImportDataset}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200"
              >
                Importer un dataset
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {datasets.map((dataset) => (
                <div
                  key={dataset._id}
                  className="px-6 py-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleDatasetClick(dataset._id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">
                        {dataset.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {dataset.fileName} • {dataset.fileType.toUpperCase()} •{" "}
                        {(dataset.fileSize / 1024 / 1024).toFixed(2)} MB
                        {dataset.rowCount && ` • ${dataset.rowCount} lignes`}
                      </p>
                      {dataset.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {dataset.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadDataset(dataset._id, dataset.fileName);
                        }}
                        className="inline-flex items-center px-3 py-1 text-xs font-medium text-indigo-600 bg-indigo-100 hover:bg-indigo-200 rounded-md transition-colors"
                        title="Télécharger le fichier"
                      >
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        Télécharger
                      </button>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          dataset.status === "ready" ||
                          dataset.status === "uploaded"
                            ? "bg-green-100 text-green-800"
                            : dataset.status === "processing"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {dataset.status === "ready" ||
                        dataset.status === "uploaded"
                          ? "Prêt"
                          : dataset.status === "processing"
                          ? "Traitement"
                          : "Erreur"}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(dataset.createdAt).toLocaleDateString(
                          "fr-FR"
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Import Dataset Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                Importer un dataset
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Sélectionnez un fichier et donnez-lui un nom
              </p>
            </div>
            <form onSubmit={handleImportSubmit} className="px-6 py-6 space-y-6">
              <div>
                <label
                  htmlFor="file"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Fichier à importer
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                      >
                        <span>Télécharger un fichier</span>
                        <input
                          id="file"
                          name="file"
                          type="file"
                          accept=".csv,.xlsx,.xls,.json"
                          onChange={handleFileChange}
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">ou glisser-déposer</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      CSV, Excel, JSON jusqu'à 10MB
                    </p>
                    {importForm.file && (
                      <p className="text-sm text-green-600 font-medium">
                        Fichier sélectionné: {importForm.file.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Nom du dataset
                </label>
                <input
                  type="text"
                  id="name"
                  value={importForm.name}
                  onChange={(e) =>
                    setImportForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
                  placeholder="Entrez le nom du dataset"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Description (optionnel)
                </label>
                <textarea
                  id="description"
                  value={importForm.description}
                  onChange={(e) =>
                    setImportForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={3}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
                  placeholder="Ajoutez une description pour ce dataset"
                />
              </div>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <div className="text-red-800 text-sm">{error}</div>
                </div>
              )}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={uploading || !importForm.file}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading
                    ? "Importation en cours..."
                    : "Importer le dataset"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectPage;