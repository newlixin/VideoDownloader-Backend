"use client";

import { useState } from "react";
import Link from "next/link";
import { downloadVideo } from "../actions/downloadVideo";

export default function VideoDownloaderForm() {
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const final_url = await downloadVideo(url);
      setDownloadUrl(final_url);
    } catch (err) {
      console.log(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
            视频链接
          </label>
          <input
            type="url"
            id="url"
            name="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/video"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-gray-800"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 ease-in-out disabled:opacity-50"
        >
          {loading ? "处理中..." : "开始获取下载地址"}
        </button>
        
        {loading && (
          <div className="flex items-center justify-center mt-4 text-indigo-600">
            <div className="h-3 w-3 rounded-full bg-indigo-600 mr-2 animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="h-3 w-3 rounded-full bg-indigo-600 mr-2 animate-bounce" style={{ animationDelay: '300ms' }}></div>
            <div className="h-3 w-3 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '600ms' }}></div>
            <span className="ml-2">正在处理中...</span>
          </div>
        )}
      </form>
      
      {downloadUrl && (
        <div className="mt-6">
          <Link href={downloadUrl} target="_blank">
            <button className="w-full bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 ease-in-out">
              跳转到视频下载页
            </button>
          </Link>
        </div>
      )}
      
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
          错误: {error}
        </div>
      )}
    </div>
  );
}