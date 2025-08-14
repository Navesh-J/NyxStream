import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Video from "@/models/Video";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_URL_ENDPOINT!,
});

export async function DELETE(req: NextRequest) {
  try {
    // Extract the [id] from the URL
    const url = new URL(req.url);
    const parts = url.pathname.split("/");
    const id = parts[parts.length - 1];

    if (!id) {
      return NextResponse.json({ error: "Missing video ID" }, { status: 400 });
    }

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    await connectToDatabase();

    const video = await Video.findById(id);
    if (!video) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (String(video.userId) !== String(userId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete from ImageKit if IDs exist
    if (video.videoFileId) {
      try {
        await imagekit.deleteFile(video.videoFileId);
      } catch (err) {
        console.warn(`⚠ Failed to delete video file ${video.videoFileId}`, err);
      }
    }

    if (video.thumbnailFileId) {
      try {
        await imagekit.deleteFile(video.thumbnailFileId);
      } catch (err) {
        console.warn(
          `⚠ Failed to delete thumbnail ${video.thumbnailFileId}`,
          err
        );
      }
    }

    // Remove from DB
    await Video.findByIdAndDelete(id);

    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch (error) {
    console.error("[video] DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete video" },
      { status: 500 }
    );
  }
}
