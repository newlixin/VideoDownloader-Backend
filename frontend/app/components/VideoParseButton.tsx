"use client";

import { useState } from "react";
import { getVideoUrl } from "@/app/actions/getVideoUrl";


interface VideoParseButtonProps {
  videoUrl: string;
}

export default function VideoParseButton({ 
  videoUrl,
}: VideoParseButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadResult, setDownloadResult] = useState<{
    downloadUrl: string | null;
    error: string | null;
  } | null>(null);

  const handleDownload = async () => {
    setIsDownloading(true);
    setDownloadResult(null);
    
    try {
      const result = await getVideoUrl(videoUrl);
      if (!result) {
        throw new Error("获取地址失败");
      }

      setDownloadResult({
        downloadUrl: result,
        error: ""
      });
    } catch (error) {
      setDownloadResult({
        downloadUrl: null,
        error: error instanceof Error ? error.message : "An unknown error occurred"
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleDownload}
        disabled={isDownloading}
        className={`px-4 py-2 rounded-md ${
          isDownloading 
            ? "bg-gray-400 cursor-not-allowed" 
            : "bg-blue-500 hover:bg-blue-600 text-white"
        }`}
      >
        {isDownloading ? "获取地址中..." : "点击获取地址"}
      </button>
      
      {downloadResult && (
        <div className="absolute top-full w-full flex justify-center mt-1">
          {downloadResult.downloadUrl ? (
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