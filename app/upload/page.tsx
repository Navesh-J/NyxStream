"use client";

import VideoUploadForm from "../components/VideoUploadForm";
import Header from "../components/Header";

export default function VideoUploadPage() {
  return (
        <div className="relative p-2 max-w-7xl mx-auto z-10">
        <Header />
        <VideoUploadForm />
        </div>
  );
} 