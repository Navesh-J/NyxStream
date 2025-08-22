"use client";

import React, { useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { v4 as uuidv4 } from "uuid";
import { useNotification } from "../components/Notification";

// Helper Functions
function formatBytes(bytes?: number | null): string {
  if (!bytes && bytes !== 0) return "N/A";
  const b = Number(bytes);
  if (b < 1024) return `${b} B`;
  const units = ["KB", "MB", "GB", "TB"];
  let i = -1;
  let size = b;
  do {
    size /= 1024;
    i++;
  } while (size >= 1024 && i < units.length - 1);
  return `${size.toFixed(2)} ${units[i]}`;
}

function formatDuration(seconds?: number | null): string {
  if (!seconds && seconds !== 0) return "N/A";
  const s = Math.floor(Number(seconds || 0));
  const hrs = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;
  return `${hrs}h ${mins}m ${secs}s`;
}

function formatDate(d?: string | Date | null): string {
  if (!d) return "N/A";
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString();
}

// Main Component
export default function InvoiceButton() {
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();

  // Fetch session and videos
  async function fetchSessionAndVideos() {
    const sessRes = await fetch("/api/auth/session");
    if (!sessRes.ok) throw new Error("You must be signed in.");
    const session = await sessRes.json();

    const res = await fetch("/api/video?mine=true");
    if (!res.ok) {
      const err = await res.text().catch(() => "Failed to fetch videos");
      throw new Error(err);
    }
    const videos = await res.json();
    return { session, videos };
  }

  // Build and return PDF document
  function createInvoicePDF(session: any, videos: any[]) {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const invoiceId = uuidv4();
    const issueDate = new Date().toLocaleDateString();

    // Header
    doc.setFontSize(18).text("Video Upload Invoice", 40, 50);
    doc.setFontSize(10)
      .text(`Invoice #: ${invoiceId}`, 40, 70)
      .text(`Date of Issue: ${issueDate}`, 40, 86);

    // Sender & Receiver Info
    doc.setFontSize(11).text("From:", 40, 110);
    doc.setFontSize(10)
      .text("NyxStream", 40, 126)
      .text("support@nyxstream.example", 40, 142);

    const receiverX = pageWidth - 220;
    const userName = session?.user?.name ?? "N/A";
    const userEmail = session?.user?.email ?? "N/A";
    doc.setFontSize(11).text("To:", receiverX, 110);
    doc.setFontSize(10).text(userName, receiverX, 126).text(userEmail, receiverX, 142);

    // Table
    const head = [[
      "Video ID", "Title", "Upload Date", "Duration",
      "Size", "Resolution", "Views"
    ]];

    const body = videos.map((v: any) => [
      String(v._id ?? v.id ?? "N/A").slice(0, 12),
      v.title ?? "Untitled",
      formatDate(v.createdAt ?? v.uploadedAt ?? null),
      formatDuration(v.duration ?? v.videoDuration ?? null),
      formatBytes(v.size ?? v.fileSize ?? v.file_size ?? null),
      v.resolution ??
        v.quality ??
        (v.transformation
          ? `${v.transformation.width}x${v.transformation.height}`
          : "N/A"),
      String(v.views ?? v.viewCount ?? "N/A"),
    ]);

    autoTable(doc as any, {
      startY: 170,
      head,
      body,
      styles: { fontSize: 9, cellPadding: 4 },
      headStyles: { fillColor: [0, 20, 230] },
      theme: "striped",
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 150 },
        2: { cellWidth: 70 },
        3: { cellWidth: 60 },
        4: { cellWidth: 60 },
        5: { cellWidth: 60 },
        6: { cellWidth: 40 },
      },
    });

    // Summary
    const finalY =
      (doc as any).lastAutoTable?.finalY ??
      doc.internal.pageSize.getHeight() - 100;
    const totalVideos = videos.length;
    const totalStorageBytes = videos.reduce((acc: number, v: any) => {
      const size = Number(v.size ?? v.fileSize ?? v.file_size ?? 0);
      return acc + (isNaN(size) ? 0 : size);
    }, 0);

    doc.setFontSize(11).text("Summary", 40, finalY + 30);
    doc.setFontSize(10)
      .text(`Total number of videos: ${totalVideos}`, 40, finalY + 46)
      .text(`Total storage used: ${formatBytes(totalStorageBytes)}`, 40, finalY + 62);

    // Footer
    const footerY = doc.internal.pageSize.getHeight() - 40;
    doc.setFontSize(10).text("Thank you for using NyxStream!", 40, footerY);

    return { doc, invoiceId };
  }

  // Generate or download invoice
  async function handleInvoice(mode: "preview" | "download") {
    try {
      setLoading(true);

      const { session, videos } = await fetchSessionAndVideos();
      const { doc, invoiceId } = createInvoicePDF(session, videos);

      const blob = doc.output("blob");
      const fileName = `invoice-${invoiceId}.pdf`;
      const blobUrl = URL.createObjectURL(blob);

      if (mode === "preview") {
        window.open(blobUrl, "_blank");
      } else {
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = fileName;
        a.click();
      }

      showNotification("Invoice generated", "success");
    } catch (err: any) {
      console.error("Invoice generation failed", err);
      showNotification(err.message || "Failed to generate invoice", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center gap-4 m-8">
      <button
        onClick={() => handleInvoice("preview")}
        className="btn btn-outline"
        disabled={loading}
      >
        {loading ? "Generating..." : "Preview"}
      </button>
      <button
        onClick={() => handleInvoice("download")}
        className="btn btn-outline"
        disabled={loading}
      >
        {loading ? "Downloading..." : "Download"}
      </button>
    </div>
  );
}
