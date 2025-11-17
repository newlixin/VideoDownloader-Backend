import FormatDownloadButton from "@/app/components/FormatDownloadButton";
import VideoParseButton from "@/app/components/VideoParseButton";
import { makeRequest } from "@/app/utils/api";

interface VideoFormat {
  format_id: string,
  resolution: string,
  vcodec: string,
}

interface VideoData {
  title: string,
  formats: VideoFormat[],
}

export default async function DownloadPage({ params }: { params: Promise<{ url: string }> }) {
  const { url } = await params;
  // Decode the URL parameter
  const decodedUrl = decodeURIComponent(url);

  let jsonData: VideoData | null = null;
  let videoFormats: VideoFormat[] = [];

  try {
      jsonData = await makeRequest("parse-url", {
        body: JSON.stringify({url: decodedUrl})});
      videoFormats = jsonData?.formats || [];
      
      // Remove duplicates by format_id
      const uniqueFormats = Array.from(
        new Map(videoFormats.map(item => [item.resolution, item])).values()
      );
      videoFormats = uniqueFormats;
      videoFormats = videoFormats.filter(item => item.resolution.includes("x"));
      
  } catch (error) {
    console.log(error);
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl text-center">
          <div className="text-red-500 text-xl font-semibold">
            {String(error)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl min-h-[300px]">
        <div className="mt-6">
          {jsonData && (
            <>
              <p className="text-3xl font-semibold mb-4 text-center text-blue-600">视频标题：{jsonData.title}</p>
              <br></br>
              <div className="mb-6">
                <p className="text-lg font-semibold mb-4 text-center text-blue-600">直接获取视频地址</p>
                <div className="flex justify-center">
                  <div className="inline-flex bg-gray-100 p-10 rounded-lg">
                    <VideoParseButton videoUrl={decodedUrl}/>
                  </div>
                </div>
              </div>
              <p className="text-lg font-semibold mb-4 text-center text-blue-600">从后端下载视频</p>
              {videoFormats && videoFormats.length > 0 ? (
                <div className="flex justify-center">
                  <div className="inline-flex bg-gray-100 p-6 rounded-lg">
                    {videoFormats.map((item: VideoFormat) => (
                      <div key={item.format_id} className="mb-4 sm:mb-0">
                        <FormatDownloadButton 
                          resolution={item.resolution}
                          videoUrl={decodedUrl}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p>No video formats available</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}