import { processUserInput } from "./actions/processUserInput";

export default async function Home() {

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">输入视频链接</h1>     
        <div className="w-full">
          <form action={processUserInput} className="space-y-6">
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
              视频链接
            </label>
            <input type="url" name="userInput" placeholder="https://example.com/video"  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-indigo-500 transition text-gray-800 outline-none" required/>
            <button type="submit" name="fetch" className="w-full bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transform disabled:opacity-50">
              获取下载地址
            </button>         
          </form>
        </div>
      </div>
    </div>
  );
}
