from yt_dlp import YoutubeDL
import os

# ───────────────────────── formats ──────────────────────────
def get_formats(url: str) -> list[dict]:
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
        return [
            f for f in info["formats"]
            if f.get("format_id")
            and (f.get("vcodec") != "none" or f.get("acodec") != "none")
            and f["ext"] in ("mp4", "webm")
        ]


quality_map = {
    "high": "bestvideo+bestaudio/best",
    "low": "best[height<=480]"
}


def download_video(uid: str, url: str, quality: str, output_dir: str, progress_hook: callable):
    # hook function for downloading progress
    def hook(d):
        if d.get("status") == "downloading":
            downloaded = d.get("downloaded_bytes") or 0
            total = d.get("total_bytes") or d.get("total_bytes_estimate") or 1
            percent = downloaded / total * 100
            progress_hook(percent)

    # init options
    output_path = os.path.join(output_dir, f"{uid}.mp4")
    ydl_opts = {
        "format": quality_map.get(quality),
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
    final_path = None
    with YoutubeDL(ydl_opts) as ydl:
        print("Starting downloads…")
        ydl.download([url])
        progress_hook(100)
        print("Download and merge complete.")

        # info = ydl.extract_info(url, download=False)
        # title = info.get("title", "video")
        # ext = "mp4"
        # final_path = os.path.join(output_dir, f"{title}.{ext}")

        final_path = output_path

    return final_path