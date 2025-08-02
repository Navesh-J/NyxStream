"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import VideoFeed from "./components/VideoFeed";
import Header from "./components/Header";
import { IVideo } from "@/models/Video";
import { useEffect, useState } from "react";

async function getVideos(): Promise<IVideo[]> {
  const base = process.env.NEXT_PUBLIC_BASE_URL;
  if (!base) throw new Error("Missing NEXT_PUBLIC_BASE_URL");
  const res = await fetch(new URL("/api/video", base).toString(), {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("Failed to fetch videos");
  return ((await res.json()) as IVideo[]).sort(
    (a, b) =>
      new Date(b.createdAt ?? 0).getTime() -
      new Date(a.createdAt ?? 0).getTime()
  );
}

export default function HomePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [videos, setVideos] = useState<IVideo[]>([]);

  useEffect(() => {
    getVideos().then(setVideos).catch(console.error);
  }, []);

  const handleUpload = () => {
    if (session?.user) {
      router.push("/upload");
    } else {
      router.push("/login");
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#16172a] via-[#232541] to-[#170925] relative overflow-hidden">
      {/* Cinematic Blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[10%] left-0 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-pink-700/15 rounded-full blur-2xl animate-pulse" />
      </div>

      <main className="relative p-2 max-w-7xl mx-auto z-10">
        <Header />
        <VideoFeed videos={videos} />
      </main>
    </div>
  );
}
