from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from .routes import api
from src.utils.common import begin_clear_timer

# 开始下载目录清理任务
begin_clear_timer()

# 创建FastAPI实例
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# 添加路由
app.include_router(api.router, prefix="/api")
