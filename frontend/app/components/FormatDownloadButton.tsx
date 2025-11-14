"use client";

import { useState } from "react";
import { downloadFormat } from "@/app/actions/downloadFormat";


interface FormatDownloadButtonProps {
  resolution: string;
  videoUrl: string;
}

export default function FormatDownloadButton({ 
  resolution, 
  videoUrl,
}: FormatDownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadResult, setDownloadResult] = useState<{
    success: boolean;
    downloadUrl: string | null;
    error: string | null;
  } | null>(null);

  const handleDownload = async () => {
    setIsDownloading(true);
    setDownloadResult(null);
    
    try {
      const result = await downloadFormat({
        url: videoUrl,
        resolution: resolution,
      });
      setDownloadResult({
        success: result.success,
        downloadUrl: result.downloadUrl,
        error: ""
      });
    } catch (error) {
      setDownloadResult({
        success: false,
        downloadUrl: null,
        error: error instanceof Error ? error.message : "An unknown error occurred"
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="mb-4 relative">
      <button
        onClick={handleDownload}
        disabled={isDownloading}
        className={`px-4 py-2 rounded-md mr-2 ${
          isDownloading 
            ? "bg-gray-400 cursor-not-allowed" 
            : "bg-blue-500 hover:bg-blue-600 text-white"
        }`}
      >
        {isDownloading ? "下载中..." : resolution}
      </button>
      
      {downloadResult && (
        <div className="absolute top-full w-full flex justify-center">
          {downloadResult.success ? (
            <a 
              href={downloadResult.downloadUrl || "#"} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700 underline"
            >
              打开视频
            </a>
          ) : (
            <div className="text-red-500">
              Error: {downloadResult.error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}