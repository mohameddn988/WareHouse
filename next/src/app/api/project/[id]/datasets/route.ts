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

    // Get datasets for the project
    const datasets = await Dataset.find({
      projectId: id,
      userId: decoded.userId,
    })
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