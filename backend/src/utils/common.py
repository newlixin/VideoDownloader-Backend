import os
import threading
import time

output_dir = "../frontend/public/download"
time_interval = 300

def ensure_out_dir():
    os.makedirs(output_dir, exist_ok=True)

def clear_files_in_out_dir():
    # 获取当前时间
    current_time = time.time()
    # 计算的时间戳
    time_stamp = current_time - time_interval

    for filename in os.listdir(output_dir):
        file_path = os.path.join(output_dir, filename)
        try:
            # 检查文件是否存在且是文件或符号链接
            if os.path.isfile(file_path) or os.path.islink(file_path):
                # 获取文件的创建时间
                file_creation_time = os.path.getctime(file_path)
                # 如果文件创建时间早于1小时前，则删除
                if file_creation_time < time_stamp:
                    os.unlink(file_path)
        except Exception as e:
            print('Failed to delete %s. Reason: %s' % (file_path, e))

    threading.Timer(time_interval, clear_files_in_out_dir).start()

def begin_clear_timer():
    ensure_out_dir()
    clear_files_in_out_dir()
    threading.Timer(time_interval, clear_files_in_out_dir).start()

