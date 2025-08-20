"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { IVideo } from "@/models/Video";
import VideoComponent from "./VideoComponent";
import { useNotification } from "./Notification";
import Header from "./Header";

export default function MyUploadsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { showNotification } = useNotification();

  const [videos, setVideos] = useState<IVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated") {
      fetchMyVideos();
    }
  }, [status]);

  async function fetchMyVideos() {
    setLoading(true);
    try {
      const res = await fetch("/api/video?mine=true");
      if (!res.ok) throw new Error("Failed to fetch videos");

      const vids: IVideo[] = await res.json();
      setVideos(vids);
    } catch (err) {
      console.error("Failed to load uploads", err);
      showNotification("Failed to load your uploads", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(videoId: string) {
    const ok = confirm("Delete this video? This action cannot be undone.");
    if (!ok) return;

    const prev = [...videos];
    setVideos((s) => s.filter((v) => v._id?.toString() !== videoId));
    setDeletingId(videoId);

    try {
      const res = await fetch(`/api/video/${videoId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Delete failed" }));
        throw new Error(err.error || "Delete failed");
      }

      showNotification("Video deleted", "success");
    } catch (err) {
      console.error("Delete failed", err);
      setVideos(prev); // rollback
      showNotification("Failed to delete video", "error");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#16172a] via-[#232541] to-[#170925] relative overflow-hidden">
      {/* Cinematic Blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[10%] left-0 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-pink-700/15 rounded-full blur-2xl animate-pulse" />
      </div>

      <main className="relative p-2 max-w-7xl mx-auto z-10">
        <Header />
        <main className="p-4 max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">My Uploads</h1>
            <button
              className="btn btn-primary"
              onClick={() => router.push("/upload")}
              disabled={status !== "authenticated"}
            >
              Upload new
            </button>
          </div>

          {loading ? (
            <p>Loading your uploads...</p>
          ) : videos.length === 0 ? (
            <p className="text-muted">
              You haven&#39;t uploaded any videos yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {videos.map((v) => (
                <div key={v._id?.toString()} className="relative">
                  <VideoComponent video={v} />
                  <div className="flex gap-2 mt-2">
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() => router.push(`/videos/${v._id}`)}
                    >
                      View
                    </button>
                    <button
                      className="btn btn-sm btn-error"
                      onClick={() => handleDelete(v._id!.toString())}
                      disabled={deletingId === v._id?.toString()}
                    >
                      {deletingId === v._id?.toString()
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </main>
    </div>
  );
}
