from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
import os
from ..utils import ydl_functions

router = APIRouter()

class UrlData(BaseModel):
    url: str
    class Config:
        json_schema_extra = {"example": {"url": "https://www.youtube.com/watch?v=pOvTbn0BzuY"}}

class UrlFormatData(BaseModel):
    uid: str
    url: str
    quality: str

    class Config:
        json_schema_extra = {"example":
             {
                "url": "https://www.youtube.com/watch?v=pOvTbn0BzuY",
                "quality": "high"
              }
        }

@router.post('/parse-url')
async def parse_url(data: UrlData, request: Request):
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
async def download(data: UrlFormatData, request: Request):
    def progress_callback(s):
        print(s)

    try:
        quality_set = {"high", "low"}
        if data.quality not in quality_set:
            raise HTTPException(status_code=401, detail="Invalid quality")

        output_dir = "../frontend/public/download"
        os.makedirs(output_dir, exist_ok=True)
        output_path = ydl_functions.download_video(data.uid, data.url, data.quality, output_dir, progress_callback)
        if output_path is None or not os.path.exists(output_path):
            raise HTTPException(status_code=403, detail="Download failed")

        # Convert server path to URL accessible by client
        file_name = os.path.relpath(output_path, output_dir)

        return {"file_name": file_name}


    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
