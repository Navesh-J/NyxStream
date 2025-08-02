"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { IKUpload } from "imagekitio-next";
import { useNotification } from "./Notification";

function VideoUploadForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const router = useRouter();
  const { showNotification } = useNotification();

  const handleUploadSuccess = (res: any) => {
    setVideoUrl(res.filePath); // ImageKit path
    setThumbnailUrl(res.filePath); // If you have thumbnail extraction, update accordingly
    showNotification("Upload successful!", "success");
  };

  const handleUploadError = (err: any) => {
    showNotification("Upload failed!", "error");
    console.error(err);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl || !title) {
      return showNotification("Title and video are required", "warning");
    }

    try {
      setUploading(true);
      const res = await fetch("/api/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, videoUrl, thumbnailUrl }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      showNotification("Video uploaded!", "success");
      router.push("/");
    } catch (err) {
      showNotification("Upload failed", "error");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#16172a] via-[#232541] to-[#170925] relative overflow-hidden">
      {/* Cinematic background blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[12%] left-0 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-fuchsia-300/30 rounded-full blur-2xl animate-pulse" />
      </div>
      {/* Upload Card */}
      <form
        onSubmit={handleSubmit}
        className="z-10 max-w-lg w-full px-8 py-10 bg-[#18182a]/90 border border-gray-800 shadow-2xl rounded-2xl flex flex-col space-y-6 backdrop-blur-md"
      >
        <div className="flex flex-col items-center mb-6">
          <h2 className="text-3xl font-extrabold text-pink-500 drop-shadow mb-1">Nyx
            <span className="text-indigo-400">Stream</span>
          </h2>
          <p className="text-lg text-gray-200">Upload a Video</p>
        </div>

        <input
          type="text"
          placeholder="Title"
          className="px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 outline-none border border-transparent focus:border-pink-500 transition"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Description (optional)"
          className="px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 outline-none border border-transparent focus:border-pink-500 transition resize-none"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />

        <div className="border border-gray-700 bg-gray-900/70 p-4 rounded-lg flex flex-col items-start">
          <label className="mb-2 text-sm text-gray-400 font-medium">Upload Your Video:</label>
          <IKUpload
            fileName="video.mp4"
            folder="videos"
            useUniqueFileName={true}
            onSuccess={handleUploadSuccess}
            onError={handleUploadError}
            className="btn bg-gradient-to-r from-orange-900 to-indigo-700 text-white font-bold px-4 py-2 rounded-lg hover:from-amber-800 hover:to-indigo-600 transition cursor-pointer"
          />
          {videoUrl && <span className="text-xs mt-2 text-green-400">Video uploaded!</span>}
        </div>

        <button
          type="submit"
          className="bg-gradient-to-r from-emerald-800 to-indigo-500 hover:from-emrald-400 hover:to-indigo-600 transition-all text-white font-bold py-3 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Submit"}
        </button>
      </form>
    </div>
  );
}

export default VideoUploadForm;
