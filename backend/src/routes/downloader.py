from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
import os
from ..utils import ydl_functions

router = APIRouter()

class UrlParseParam(BaseModel):
    url: str


class DownloadParam(BaseModel):
    uid: str
    url: str

@router.post('/parse-url')
async def parse_url(data: UrlParseParam, request: Request):
    try:
        format_arr = ydl_functions.get_formats(data.url)
        results = []
        for item in format_arr:
            results.append({
                "format_id": item["format_id"],
                "format_desc": f"{item['ext']} - {item.get('resolution', '') or item.get('abr', '')}"
            })
        return results
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post('/download-file')
async def download(data: DownloadParam, request: Request):
    try:
        output_dir = "../frontend/public/download"
        os.makedirs(output_dir, exist_ok=True)
        output_path = ydl_functions.download_video(data.uid, data.url, output_dir)
        if output_path is None or not os.path.exists(output_path):
            raise Exception("Download failed!")

        # get file name
        file_name = os.path.relpath(output_path, output_dir)

        return {"file_name": file_name}


    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
