"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import VideoFeed from "./components/VideoFeed";
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
    <main className="p-2 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-2">
        <h1 className="mb-8 flex items-center select-none text-4xl font-extrabold text-pink-500 tracking-wide drop-shadow">
          Nyx<span className="text-indigo-400">Stream</span>
        </h1>

        <div className="flex gap-4">
          <button
            onClick={handleUpload}
            type="button"
            className="cursor-pointer rounded-2xl border-2 border-emerald-600 bg-gradient-to-tr from-emerald-700 via-emerald-900 to-emerald-800 px-6 py-2 text-white font-semibold shadow-md transition-transform duration-300 ease-in-out hover:scale-110 hover:brightness-125 hover:shadow-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-400"
          >
            Upload
          </button>

          {session?.user && (
            <button
              onClick={handleLogout}
              type="button"
              className="cursor-pointer rounded-2xl border-2 border-rose-600 bg-gradient-to-tr from-rose-700 via-rose-900 to-rose-800 px-6 py-2 text-white font-semibold shadow-md transition-transform duration-300 ease-in-out hover:scale-110 hover:brightness-125 hover:shadow-rose-500 focus:outline-none focus:ring-4 focus:ring-rose-400"
            >
              Logout
            </button>
          )}
        </div>
      </div>

      <VideoFeed videos={videos} />
    </main>
  );
}
