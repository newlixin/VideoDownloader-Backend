"use server";

export async function downloadVideo(url: string | null) {
  if (!url) {
    throw new Error("URL is required");
  }
  
  const uid = Math.random().toString(36).substring(7);
  
  try {
    const response = await fetch(`http://localhost:8000/api/download-file`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "uid": uid,
        "url": url,
        "quality": "high"
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      if (response.status === 429) {
        throw new Error("Daily quota exceeded");
      }
      throw new Error(errorData?.detail || "API request failed");
    }

    const data = await response.json();
    const final_url = "https://majorly-heathy-brenden.ngrok-free.dev" + "/download/" + data.file_name;
    
    return final_url;
  } catch (err) {
    console.log(err);
    throw err;
  } 
}