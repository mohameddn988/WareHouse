import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Dataset from "@/models/Dataset";
import { verifyToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json(
        { error: "Token d'authentification manquant" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { error: "Token invalide" },
        { status: 401 }
      );
    }

    // Connect to database
    await connectDB();

    // Parse form data
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const projectId = formData.get("projectId") as string;

    if (!file || !name || !projectId) {
      return NextResponse.json(
        { error: "Fichier, nom et ID du projet requis" },
        { status: 400 }
      );
    }

    // Get file data as buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Determine file type for database
    let fileType:
      | "csv"
      | "json"
      | "excel"
      | "xml"
      | "yaml"
      | "yml"
      | "sql"
      | null = null;
    const fileName = file.name.toLowerCase();

    if (file.type === "text/csv" || fileName.endsWith(".csv")) {
      fileType = "csv";
    } else if (file.type === "application/json" || fileName.endsWith(".json")) {
      fileType = "json";
    } else if (
      file.type.includes("excel") ||
      file.type.includes("spreadsheet") ||
      fileName.endsWith(".xlsx") ||
      fileName.endsWith(".xls")
    ) {
      fileType = "excel";
    } else if (
      file.type === "text/xml" ||
      file.type === "application/xml" ||
      fileName.endsWith(".xml")
    ) {
      fileType = "xml";
    } else if (
      file.type === "text/yaml" ||
      file.type === "application/yaml" ||
      fileName.endsWith(".yaml") ||
      fileName.endsWith(".yml")
    ) {
      fileType = fileName.endsWith(".yml") ? "yml" : "yaml";
    } else if (file.type === "application/sql" || fileName.endsWith(".sql")) {
      fileType = "sql";
    }

    // Reject unsupported file types
    if (!fileType) {
      return NextResponse.json(
        {
          error: "Unsupported file type",
          message:
            "Please upload a CSV, JSON, Excel (.xlsx/.xls), XML, YAML/YML, or SQL file.",
          supportedTypes: ["csv", "json", "excel", "xml", "yaml", "yml", "sql"],
        },
        { status: 400 }
      );
    }

    // Process CSV files to extract metadata
    let rowCount = 0;
    let columnCount = 0;
    let status: "uploaded" | "processing" | "ready" | "error" = "uploaded";

    if (fileType === "csv") {
      try {
        const csvText = buffer.toString('utf-8');
        const lines = csvText.split('\n').filter(line => line.trim());
        
        if (lines.length > 0) {
          rowCount = lines.length - 1; // Subtract header row
          // Count columns from first line (header)
          const firstLine = lines[0];
          columnCount = firstLine.split(',').length;
          status = "ready"; // Mark as ready since we processed it
        }
      } catch (error) {
        console.error("Error processing CSV:", error);
        status = "error";
      }
    } else {
      // For non-CSV files, mark as ready (they can still be downloaded)
      status = "ready";
    }

    // Create dataset record with file data stored in database
    const dataset = new Dataset({
      userId: decoded.userId,
      projectId: projectId || null,
      name: name.trim(),
      description: description?.trim() || "",
      fileName: file.name,
      fileSize: file.size,
      fileType,
      fileData: buffer,
      rowCount,
      columnCount,
      status,
    });

    const savedDataset = await dataset.save();

    return NextResponse.json(savedDataset, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de l'upload du dataset:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json(
        { error: "Token d'authentification manquant" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { error: "Token invalide" },
        { status: 401 }
      );
    }

    // Connect to database
    await connectDB();

    // Get user's datasets
    const datasets = await Dataset.find({ userId: decoded.userId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(datasets);
  } catch (error) {
    console.error("Erreur lors de la récupération des datasets:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}