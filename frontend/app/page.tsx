import VideoDownloaderForm from "./components/VideoDownloaderForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">视频下载器</h1>
        <p className="text-gray-600 text-center mb-8">输入视频链接开始获取下载地址</p>
        
        <VideoDownloaderForm />
      </div>
    </div>
  );
}
