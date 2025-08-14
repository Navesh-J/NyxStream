"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IKUpload } from "imagekitio-next";
import { useNotification } from "./Notification";
import {
  UploadError,
  IKUploadResponse,
} from "imagekitio-next/dist/types/components/IKUpload/props";

function VideoUploadForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoFileId, setVideoFileId] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [thumbnailFileId, setThumbnailFileId] = useState("");

  const [uploading, setUploading] = useState(false);

  const router = useRouter();
  const { showNotification } = useNotification();

  const handleUploadSuccess = (res: IKUploadResponse) => {
    setVideoUrl(res.filePath);
    setVideoFileId(res.fileId);
    showNotification("Video uploaded successfully!", "success");
  };

  const handleUploadError = (err: UploadError) => {
    showNotification("Upload failed!", "error");
    console.error(err);
  };

  const handleThumbnailSuccess = (res: IKUploadResponse) => {
    setThumbnailUrl(res.url);
    setThumbnailFileId(res.fileId);
    showNotification("Thumbnail uploaded successfully!", "success");
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
        body: JSON.stringify({
          title,
          description,
          videoUrl,
          videoFileId,
          thumbnailUrl,
          thumbnailFileId,
        }),
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
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto bg-gray-900 p-6 rounded-lg space-y-6"
    >
      <h2 className="text-xl font-bold text-white">Upload a Video</h2>

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="w-full px-4 py-2 rounded bg-gray-800 text-white"
      />

      <textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full px-4 py-2 rounded bg-gray-800 text-white"
        rows={3}
      />

      <div className="border border-gray-700 bg-gray-900/70 p-4 rounded-lg flex flex-col items-start">
        <label className="mb-2 text-sm text-gray-400 font-medium">
          Upload Your Video:
        </label>
        <IKUpload
          fileName="video.mp4"
          folder="videos"
          useUniqueFileName={true}
          onSuccess={handleUploadSuccess}
          onError={handleUploadError}
          className="btn bg-gradient-to-r from-orange-900 to-indigo-700 text-white font-bold px-4 py-2 rounded-lg hover:from-amber-800 hover:to-indigo-600 transition cursor-pointer"
        />
      </div>

      {/* Thumbnail Upload */}
      <div>
        <label className="block text-gray-400 mb-2">Upload Thumbnail:</label>
        <IKUpload
          fileName={`thumbnail_${Date.now()}.jpg`}
          folder="thumbnails"
          useUniqueFileName={true}
          accept="image/*" // ✅ Valid way to restrict file type
          overrideParameters={(file) => {
            const isImage = file.type.startsWith("image/");
            if (!isImage) {
              alert("Please upload a valid image file.");
              throw new Error("Invalid file type"); // cancels upload
            }

            return {}; // No extra params needed
          }}
          onSuccess={handleThumbnailSuccess}
          onError={handleUploadError}
          className="btn bg-gradient-to-r from-green-800 to-blue-600 text-white font-bold px-4 py-2 rounded-lg"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Submit"}
      </button>
    </form>
  );
}

export default VideoUploadForm;
