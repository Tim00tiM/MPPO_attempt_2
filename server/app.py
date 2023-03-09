from flask import Flask, Response, request, jsonify
from flask_cors import CORS, cross_origin
from sqlalchemy import create_engine, Column, String, Numeric, DateTime, select, and_
from sqlalchemy.orm import declarative_base, Session
import server
import datetime
import requests as r
import time
import threading
app = Flask(__name__)
CORS_ALLOW_ORIGIN="*,*"
CORS_EXPOSE_HEADERS="*,*"
CORS_ALLOW_HEADERS="content-type,*"
cors = CORS(app, origins=CORS_ALLOW_ORIGIN.split(","), allow_headers=CORS_ALLOW_HEADERS.split(",") , expose_headers= CORS_EXPOSE_HEADERS.split(","),   supports_credentials = True) 
time.sleep(5)
def temp_hum_sensor(number):
    URL = "https://dt.miet.ru/ppo_it/api/temp_hum/"
    response = r.get(url = (URL + str(number)))
    return response.json()

def hum_soil_sensor(number):
    URL = "https://dt.miet.ru/ppo_it/api/hum/"
    response = r.get(url = (URL + str(number)))
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
    global timestamp
    timestamp = request.headers.get("ts")
    print(timestamp)
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

@app.route("/temp_hum_sensor_<id>/", methods=["GET"])
def thsenget(id):
    ts = request.headers.get("ts")
    ret = {}
    with Session(engine, future=True) as s:
        for i in s.execute(select(server.Data).filter(and_(server.Data.type == ("temp_hum_sensor_"+str(id)), server.Data.ts == str(ts)))):
            ret[str(i[0].time)] = {"hum": i[0].humidity, "tem": i[0].temperature}
        return jsonify(ret)

def update():
    global timestamp
    while flag == 1:
        time.sleep(5)
        with Session(engine, future=True) as s:
                to_add = []
                for i in range(1,5):
                    parse = temp_hum_sensor(i)
                    to_add.append(server.Data(id=str(hash(datetime.datetime.now())),temperature = parse["temperature"], humidity = parse["humidity"], type = ("temp_hum_sensor_"+str(i)), time = datetime.datetime.now(), ts = str(timestamp)))
                for i in range(1,7):
                    parse = hum_soil_sensor(i)
                    to_add.append(server.Data(id=str(hash(datetime.datetime.now())),temperature = 0, humidity = parse["humidity"], type = ("hum_soil_sensor_"+str(i)), time = datetime.datetime.now(), ts = str(timestamp)))
                s.add_all(to_add)
                s.commit()
            
        
def manual_run():
    t = threading.Thread(target = update)
    t.start()
    return "Processing"

timestamp = 0
flag = 0
engine = create_engine("postgresql+psycopg2://postgres:123@db:5432/")

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)

    

    