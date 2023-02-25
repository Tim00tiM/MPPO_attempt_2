from flask import Flask, Response
import requests as r
import time
import threading
app = Flask(__name__)

def temp_hum_sensor(number):
    URL = "https://dt.miet.ru/ppo_it/api/temp_hum/"
    response = r.get(url = (URL + number))
    return response.json()

def hum_soil_sensor(number):
    URL = "https://dt.miet.ru/ppo_it/api/hum/"
    response = r.get(url = (URL + number))
    return response.json()

@app.route("/fork_drive/<mode>", methods=['GET'])
def fork_drive(mode):
    if mode == "close":
        mode_int = 0
    if mode == "open":
        mode_int = 1
    URL = "https://dt.miet.ru/ppo_it/api/fork_drive?"
    URL += "state=" + str(mode_int)
    response = r.patch(url = URL)
    print(response.json())
    if response.status_code == 200:
        return "success"
    else:
        return str(response.status_code)

@app.route("/watering/<device_id>/<mode>", methods=['GET'])
def watering(device_id, mode):
    if mode == "close":
        mode_int = 0
    if mode == "open":
        mode_int = 1
    URL = "https://dt.miet.ru/ppo_it/api/watering?"
    URL += "id="+str(device_id)
    URL += "&state=" + str(mode_int)
    response = r.patch( url = URL)
    print(response.json())
    if response.status_code == 200:
        return "success"
    else:
        return str(response.status_code)

@app.route("/total_watering/<mode>", methods=['GET'])
def total_watering(mode):
    if mode == "close":
        mode_int = 0
    if mode == "open":
        mode_int = 1
    URL = "https://dt.miet.ru/ppo_it/api/total_hum?"
    URL += "state=" + str(mode_int)
    response = r.patch( url = URL)
    print(response.json())
    if response.status_code == 200:
        return "success"
    else:
        return str(response.status_code)
    
@app.route("/start/", methods=['GET'])
def start():
    global flag
    if flag == 1:
        return "db already started to fill"
    else:
        flag = 1
        return Response(manual_run(), "db started to fill")

@app.route("/stop/", methods=['GET'])
def stop():
    global flag
    flag = 0
    return "db stopped to fill"

def update():
    while flag:
        time.sleep(5)
        print(flag)

def manual_run():
    t = threading.Thread(target = update)
    t.start()
    return "Processing"

flag = 0

if __name__ == "__main__":
    app.run(debug=True)

    

    