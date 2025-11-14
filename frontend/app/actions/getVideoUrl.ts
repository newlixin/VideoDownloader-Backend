"use server";

import { makeRequest } from "@/app/utils/api";

export async function getVideoUrl(url: string | null) {
  if (!url) {
    throw new Error("URL is required");
  }
 
  try {
    // Prepare the request body for the backend API
    const requestBody = {
      url: url,
    };
    
    // Make request to backend API
    const jsonData = await makeRequest("get-video-url", {
      body: JSON.stringify(requestBody)
    });
  
    return jsonData.video_url;
  } catch (err) {
    console.error(err);
    return null
  } 
}