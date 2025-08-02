"use client";

import { IKVideo } from "imagekitio-next";
import Link from "next/link";
import { IVideo } from "@/models/Video";

export default function VideoComponent({ video }: { video: IVideo }) {
  return (
    <div className="group/card relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#18182a]/80 via-[#232541]/90 to-[#170925]/80 shadow-xl hover:shadow-2xl transition-all duration-400 border border-gray-800 backdrop-blur-md">
      <figure className="relative w-full aspect-[16/9] overflow-hidden">
        <div className="rounded-xl overflow-hidden relative w-full h-full">
          <IKVideo
            path={video.videoUrl}
            transformation={[
              {
                height: "1080",
                width: "1920",
              },
            ]}
            controls
            className="w-full h-full object-cover transition duration-300 group-hover:brightness-90"
            preload="metadata"
            poster={video.thumbnailUrl}
            playsInline
          />
          {/* Subtle glow effect on hover */}
          <span className="pointer-events-none absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-all duration-400 rounded-xl shadow-[0_0_40px_8px_rgba(139,92,246,0.18)]" />
        </div>
      </figure>

      <div className="p-5 space-y-1">
        <Link
          href={`/videos/${video._id}`}
          className="hover:opacity-90 transition-opacity"
        >
          <h2 className="text-xl font-bold text-pink-400 group-hover/card:text-indigo-400 mb-1 truncate">
            {video.title}
          </h2>
        </Link>
        {video.description && (
          <p className="text-sm text-gray-400/90 line-clamp-2">
            {video.description}
          </p>
        )}
      </div>
    </div>
  );
}
