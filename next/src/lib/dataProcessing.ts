/**
 * Data Processing Utilities for Dataset Treatment
 * Provides functions for normalization, standardization, missing data handling, and data cleaning
 */

export interface DataRow {
  [key: string]: string | number | null;
}

export interface ProcessingResult {
  success: boolean;
  message: string;
  data?: DataRow[];
  affectedRows?: number;
  affectedColumns?: string[];
  newDatasetName?: string;
  operationName?: string;
}

/**
 * Create a new dataset from processed data
 */
export const createProcessedDataset = async (
  originalDatasetId: string,
  processedData: DataRow[],
  operationName: string
): Promise<{ success: boolean; datasetId?: string; message: string }> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { success: false, message: "Authentication required" };
    }

    // Get original dataset info
    const response = await fetch(`/api/dataset/${originalDatasetId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return { success: false, message: "Failed to get original dataset" };
    }

    const originalDataset = await response.json();

    // Convert processed data to CSV
    const csvContent = dataToCSV(processedData);

    // Create new dataset name
    const baseName = originalDataset.name.replace(/\.[^/.]+$/, ""); // Remove extension
    const newDatasetName = `${baseName}_${operationName}`;

    // Create FormData for upload
    const formData = new FormData();
    formData.append(
      "file",
      new Blob([csvContent], { type: "text/csv" }),
      `${newDatasetName}.csv`
    );
    formData.append("name", newDatasetName);
    formData.append("description", `Processed dataset: ${operationName}`);
    if (originalDataset.projectId) {
      formData.append("projectId", originalDataset.projectId);
    }

    // Upload new dataset
    const uploadResponse = await fetch("/api/dataset", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!uploadResponse.ok) {
      const error = await uploadResponse.json();
      return {
        success: false,
        message: error.error || "Failed to create processed dataset",
      };
    }

    const newDataset = await uploadResponse.json();
    return {
      success: true,
      datasetId: newDataset._id,
      message: `New dataset "${newDatasetName}" created successfully`,
    };
  } catch (error) {
    return {
      success: false,
      message: `Error creating processed dataset: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
};

/**
 * Convert data array to CSV string
 */
const dataToCSV = (data: DataRow[]): string => {
  if (!data || data.length === 0) return "";

  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(","),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header];
          // Escape commas and quotes in CSV
          const stringValue =
            value === null || value === undefined ? "" : String(value);
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

  return csvRows.join("\n");
};

/**
 * Get numeric columns from dataset
 */
const getNumericColumns = (data: DataRow[]): string[] => {
  if (!data || data.length === 0) return [];

  return Object.keys(data[0]).filter((key) => {
    // Check if at least 80% of values are numeric
    const numericCount = data.reduce((count, row) => {
      const value = row[key];
      const isNumeric =
        typeof value === "number" ||
        (!isNaN(Number(value)) && value !== null && value !== "");
      return count + (isNumeric ? 1 : 0);
    }, 0);
    return numericCount / data.length >= 0.8;
  });
};

/**
 * Convert string values to numbers where applicable
 */
const normalizeValue = (value: string | number | null): number | null => {
  if (value === null || value === "") return null;
  if (typeof value === "number") return value;
  const num = Number(value);
  return isNaN(num) ? null : num;
};

/**
 * Min-Max Normalization (scales values to [0, 1] range)
 * Formula: (x - min) / (max - min)
 */
export const applyNormalization = (data: DataRow[]): ProcessingResult => {
  if (!data || data.length === 0) {
    return {
      success: false,
      message: "No dataset loaded for normalization",
    };
  }

  try {
    const dataCopy = JSON.parse(JSON.stringify(data));
    const numericCols = getNumericColumns(dataCopy);

    if (numericCols.length === 0) {
      return {
        success: false,
        message: "No numeric columns found to normalize",
      };
    }

    numericCols.forEach((col) => {
      // Get all numeric values
      const values = dataCopy
        .map((row: DataRow) => normalizeValue(row[col]))
        .filter((v: number | null) => v !== null) as number[];

      if (values.length === 0) return;

      const min = Math.min(...values);
      const max = Math.max(...values);
      const range = max - min;

      // Avoid division by zero
      if (range === 0) {
        dataCopy.forEach((row: DataRow) => {
          if (row[col] !== null && row[col] !== "") {
            row[col] = 0;
          }
        });
        return;
      }

      // Apply normalization
      dataCopy.forEach((row: DataRow) => {
        const value = normalizeValue(row[col]);
        if (value !== null) {
          row[col] = Number(((value - min) / range).toFixed(6));
        }
      });
    });

    return {
      success: true,
      message: `Min-Max normalization applied to ${numericCols.length} numeric column(s)`,
      data: dataCopy,
      affectedColumns: numericCols,
      operationName: "normalized",
    };
  } catch (error) {
    return {
      success: false,
      message: `Error during normalization: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
};

/**
 * Z-Score Standardization (converts to standard normal distribution)
 * Formula: (x - mean) / std
 */
export const applyStandardization = (data: DataRow[]): ProcessingResult => {
  if (!data || data.length === 0) {
    return {
      success: false,
      message: "No dataset loaded for standardization",
    };
  }

  try {
    const dataCopy = JSON.parse(JSON.stringify(data));
    const numericCols = getNumericColumns(dataCopy);

    if (numericCols.length === 0) {
      return {
        success: false,
        message: "No numeric columns found to standardize",
      };
    }

    numericCols.forEach((col) => {
      // Get all numeric values
      const values = dataCopy
        .map((row: DataRow) => normalizeValue(row[col]))
        .filter((v: number | null) => v !== null) as number[];

      if (values.length === 0) return;

      // Calculate mean
      const mean = values.reduce((a, b) => a + b, 0) / values.length;

      // Calculate standard deviation
      const variance =
        values.map((v) => Math.pow(v - mean, 2)).reduce((a, b) => a + b, 0) /
        values.length;
      const std = Math.sqrt(variance);

      // Avoid division by zero
      if (std === 0) {
        dataCopy.forEach((row: DataRow) => {
          if (row[col] !== null && row[col] !== "") {
            row[col] = 0;
          }
        });
        return;
      }

      // Apply standardization
      dataCopy.forEach((row: DataRow) => {
        const value = normalizeValue(row[col]);
        if (value !== null) {
          row[col] = Number(((value - mean) / std).toFixed(6));
        }
      });
    });

    return {
      success: true,
      message: `Z-Score standardization applied to ${numericCols.length} numeric column(s)`,
      data: dataCopy,
      affectedColumns: numericCols,
      operationName: "standardized",
    };
  } catch (error) {
    return {
      success: false,
      message: `Error during standardization: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
};

/**
 * Handle missing data by replacing with median (for numeric) or mode (for text)
 */
export const handleMissingData = (data: DataRow[]): ProcessingResult => {
  if (!data || data.length === 0) {
    return {
      success: false,
      message: "No dataset loaded for missing data handling",
    };
  }

  try {
    const dataCopy = JSON.parse(JSON.stringify(data));
    const columns = Object.keys(dataCopy[0]);
    let totalReplaced = 0;
    const affectedCols: string[] = [];

    columns.forEach((col) => {
      // Count missing values
      const missingCount = dataCopy.filter(
        (row: DataRow) =>
          row[col] === null || row[col] === "" || row[col] === undefined
      ).length;

      if (missingCount === 0) return;

      // Get valid values
      const validValues = dataCopy
        .map((row: DataRow) => row[col])
        .filter((v: any) => v !== null && v !== "" && v !== undefined);

      if (validValues.length === 0) return;

      // Check if column is numeric
      const numericValues = validValues
        .map((v: any) => normalizeValue(v))
        .filter((v: number | null) => v !== null) as number[];

      let replacementValue: any;

      if (numericValues.length / validValues.length >= 0.8) {
        // Numeric column - use median
        const sorted = [...numericValues].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        replacementValue =
          sorted.length % 2 === 0
            ? (sorted[mid - 1] + sorted[mid]) / 2
            : sorted[mid];
      } else {
        // Text column - use mode (most frequent value)
        const frequency: { [key: string]: number } = {};
        validValues.forEach((v: any) => {
          const key = String(v);
          frequency[key] = (frequency[key] || 0) + 1;
        });
        replacementValue = Object.keys(frequency).reduce((a, b) =>
          frequency[a] > frequency[b] ? a : b
        );
      }

      // Replace missing values
      dataCopy.forEach((row: DataRow) => {
        if (row[col] === null || row[col] === "" || row[col] === undefined) {
          row[col] = replacementValue;
          totalReplaced++;
        }
      });

      affectedCols.push(col);
    });

    return {
      success: true,
      message: `Missing values handled: ${totalReplaced} value(s) replaced across ${affectedCols.length} column(s)`,
      data: dataCopy,
      affectedRows: totalReplaced,
      affectedColumns: affectedCols,
      operationName: "missing_values_handled",
    };
  } catch (error) {
    return {
      success: false,
      message: `Error handling missing data: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
};

/**
 * Remove duplicate rows from dataset
 */
export const removeDuplicates = (data: DataRow[]): ProcessingResult => {
  if (!data || data.length === 0) {
    return {
      success: false,
      message: "No dataset loaded for duplicate removal",
    };
  }

  try {
    const originalLength = data.length;

    // Use Set with JSON stringify to identify unique rows
    const uniqueRows = Array.from(
      new Map(data.map((row) => [JSON.stringify(row), row])).values()
    );

    const duplicatesRemoved = originalLength - uniqueRows.length;

    return {
      success: true,
      message: `Duplicates removed: ${duplicatesRemoved} duplicate row(s) deleted`,
      data: uniqueRows,
      affectedRows: duplicatesRemoved,
      operationName: "duplicates_removed",
    };
  } catch (error) {
    return {
      success: false,
      message: `Error removing duplicates: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
};

/**
 * Complete data cleaning (missing data + duplicates + normalization)
 */
export const cleanData = (data: DataRow[]): ProcessingResult => {
  if (!data || data.length === 0) {
    return {
      success: false,
      message: "No dataset loaded for cleaning",
    };
  }

  try {
    let processedData = data;
    const messages: string[] = [];
    const affectedColumns = new Set<string>();

    // Step 1: Handle missing data
    const missingResult = handleMissingData(processedData);
    if (missingResult.success && missingResult.data) {
      processedData = missingResult.data;
      messages.push(missingResult.message);
      missingResult.affectedColumns?.forEach((col) => affectedColumns.add(col));
    }

    // Step 2: Remove duplicates
    const duplicateResult = removeDuplicates(processedData);
    if (duplicateResult.success && duplicateResult.data) {
      processedData = duplicateResult.data;
      messages.push(duplicateResult.message);
    }

    // Step 3: Normalize data
    const normResult = applyNormalization(processedData);
    if (normResult.success && normResult.data) {
      processedData = normResult.data;
      messages.push(normResult.message);
      normResult.affectedColumns?.forEach((col) => affectedColumns.add(col));
    }

    return {
      success: true,
      message: `Complete data cleaning finished:\n• ${messages.join("\n• ")}`,
      data: processedData,
      affectedColumns: Array.from(affectedColumns),
      operationName: "cleaned",
    };
  } catch (error) {
    return {
      success: false,
      message: `Error during data cleaning: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
};
