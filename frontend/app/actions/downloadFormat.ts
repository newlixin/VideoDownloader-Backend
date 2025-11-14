"use server";

import { makeRequest } from "@/app/utils/api";

interface DownloadFormatParams {
  url: string;
  resolution: string;
}

export async function downloadFormat({ url, resolution }: DownloadFormatParams) {
  try {
    // Generate a unique ID for this download request
    const uid = Math.random().toString(36).substring(7);
    
    // Prepare the request body for the backend API
    const requestBody = {
      uid: uid,
      url: url,
      resolution: resolution
    };
    
    // Make request to backend API
    const jsonData = await makeRequest("download-file", {
      body: JSON.stringify(requestBody)
    });

    // Construct the download URL - using ngrok URL as in the original code
    const downloadUrl = `http://localhost:3000/download/${jsonData.file_name}`;
    //const downloadUrl = `https://majorly-heathy-brenden.ngrok-free.dev/download/${jsonData.file_name}`;
    
    return {
      success: true,
      downloadUrl
    };
  } catch (error) {
    console.error("Download format error:", error);
    return {
      success: false,
      downloadUrl: null
    };
  }
}