export const runtime = "nodejs";

import { authOptions } from "@/lib/authOptions";
import { connectToDatabase } from "@/lib/db";
import Video, { IVideo } from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// GET videos (optionally filter by current user if ?mine=true)
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const mine = searchParams.get("mine") === "true";

    let filter = {};
    if (mine) {
      const session = await getServerSession(authOptions);
      if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      filter = { userId: session.user.id };
    }

    const videos = await Video.find(filter).sort({ createdAt: -1 }).lean();
    return NextResponse.json(videos);
  } catch (error) {
    console.error("[video] GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}

// POST create new video
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const body: IVideo = await request.json();
    if (!body.title || !body.videoUrl || !body.videoFileId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const videoData: Partial<IVideo> = {
      title: body.title,
      description: body.description || "", // optional
      videoUrl: body.videoUrl,
      videoFileId: body.videoFileId,
      userId: session.user.id,
      controls: body.controls ?? true,
      transformation: {
        height: 1920,
        width: 1080,
        quality: body.transformation?.quality ?? 100,
      },
    };

    // Only include thumbnail fields if present
    if (body.thumbnailUrl) {
      videoData.thumbnailUrl = body.thumbnailUrl;
    }
    if (body.thumbnailFileId) {
      videoData.thumbnailFileId = body.thumbnailFileId;
    } 

    const newVideo = await Video.create(videoData);
    return NextResponse.json(newVideo);
  } catch (error) {
    console.error("[video] POST error:", error);
    return NextResponse.json(
      { error: "Failed to create video" },
      { status: 500 }
    );
  }
}
