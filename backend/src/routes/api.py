from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
import os
from ..utils import ydl_functions
from ..utils import snapany_functions
from src.utils.common import output_dir

router = APIRouter()

class UrlParseParam(BaseModel):
    url: str


class DownloadParam(BaseModel):
    uid: str
    url: str
    resolution: str

@router.post('/parse-url')
async def parse_url(data: UrlParseParam, request: Request):
    try:
        title, format_arr = ydl_functions.get_formats(data.url)
        results = {'title': title, 'formats': []}
        for item in format_arr:
            results['formats'].append({
                "format_id": item["format_id"],
                "resolution": f"{item.get('resolution', '') or item.get('abr', '')}",
                "vcodec": item.get("vcodec", "")
            })
        return results
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post('/get-video-url')
async def get_video_url(data: UrlParseParam, request: Request):
    try:
        success, title, video_url = await snapany_functions.extract_url(data.url)
        if not success:
            raise Exception("Failed to extract video URL!")

        return {'title': title, 'video_url': video_url}

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post('/download-file')
async def download(data: DownloadParam, request: Request):
    try:
        output_path = ydl_functions.download_video(data.uid, data.url, data.resolution)
        if output_path is None or not os.path.exists(output_path):
            raise Exception("Download failed!")

        # get file name
        file_name = os.path.relpath(output_path, output_dir)

        return {"file_name": file_name}


    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
