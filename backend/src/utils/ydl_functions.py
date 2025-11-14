from yt_dlp import YoutubeDL
import os
from src.utils.common import output_dir

# ───────────────────────── formats ──────────────────────────
def get_formats(url: str) -> (str, list[dict]):
    """
    Return the available formats quickly.

    We use `forcejson + simulate` so yt‑dlp prints the JSON it already has
    after the initial watch‑page request instead of firing extra manifest
    requests for DASH/HLS etc.  The result lists every format id, but it may
    lack *filesize* for some streams – that’s the speed trade‑off.
    """
    ydl_opts = {
        "quiet": True,
        "skip_download": True,
        "simulate": True,          # don’t touch the streams
        "forcejson": True,         # dump raw JSON once and stop
        "no_warnings": True,
    }
    with YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=False)
        title = info.get('title')
        return title, [
            f for f in info["formats"]
            if f.get("format_id")
            and (f.get("vcodec") != "none" or f.get("acodec") != "none")
            and f["ext"] in ("mp4", "webm")
        ]

def download_video(uid: str, url: str, resolution: str):
    # hook function for downloading progress
    def hook(d):
        if d.get("status") == "downloading":
            downloaded = d.get("downloaded_bytes") or 0
            total = d.get("total_bytes") or d.get("total_bytes_estimate") or 1
            percent = downloaded / total * 100
            print(f"{percent:.1f}%")

    # init options
    output_path = os.path.join(output_dir, f"{uid}.mp4")
    height = resolution.split("x")[1]
    ydl_opts = {
        "format": f"bestvideo[height={height}]+bestaudio",
        "outtmpl": output_path,
        "progress_hooks": [hook],
        "quiet": True,
        "merge_output_format": "mp4",
        "postprocessors": [
            {
                "key": "FFmpegVideoConvertor",
                "preferedformat": "mp4",
            }
        ],
        # stream‑copy when compatible – faster, lossless
        "postprocessor_args": ["-c:v", "copy", "-c:a", "aac", "-movflags", "faststart"],
    }

    # downloads video file
    with YoutubeDL(ydl_opts) as ydl:
        print("Starting downloads…")
        ydl.download([url])
        print("Download and merge complete.")

    return output_path