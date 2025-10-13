import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Dataset from "@/models/Dataset";
import { verifyToken } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    // Get dataset
    const dataset = await Dataset.findOne({
      _id: id,
      userId: decoded.userId,
    });

    if (!dataset) {
      return NextResponse.json(
        { error: "Dataset non trouvé" },
        { status: 404 }
      );
    }

    // Check if this is a download request
    const url = new URL(request.url);
    const download = url.searchParams.get("download");

    if (download === "true") {
      // Return file data for download
      const mimeTypes: Record<string, string> = {
        csv: "text/csv",
        json: "application/json",
        excel: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        xml: "text/xml",
        yaml: "text/yaml",
        yml: "text/yaml",
        sql: "application/sql",
      };

      return new NextResponse(new Uint8Array(dataset.fileData), {
        headers: {
          "Content-Type": mimeTypes[dataset.fileType] || "application/octet-stream",
          "Content-Disposition": `attachment; filename="${dataset.fileName}"`,
        },
      });
    }

    // Return dataset metadata (without file data for performance)
    const { fileData, ...datasetWithoutData } = dataset.toObject();
    return NextResponse.json(datasetWithoutData);
  } catch (error) {
    console.error("Erreur lors de la récupération du dataset:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    // Delete dataset
    const result = await Dataset.findOneAndDelete({
      _id: id,
      userId: decoded.userId,
    });

    if (!result) {
      return NextResponse.json(
        { error: "Dataset non trouvé ou accès non autorisé" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Dataset supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du dataset:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}