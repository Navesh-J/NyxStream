"use client";

import VideoUploadForm from "../components/VideoUploadForm";
import Header from "../components/Header";

export default function VideoUploadPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#16172a] via-[#232541] to-[#170925] relative overflow-hidden">
      {/* Cinematic Blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[10%] left-0 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-pink-700/15 rounded-full blur-2xl animate-pulse" />
      </div>

      <main className="relative p-2 max-w-7xl mx-auto z-10">
        <Header />
        <VideoUploadForm />
      </main>
    </div>
  );
}


