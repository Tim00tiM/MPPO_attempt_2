from flask import Flask, Response, request, jsonify
from flask_cors import CORS, cross_origin
from sqlalchemy import create_engine, Column, String, Numeric, DateTime, select, and_, or_, update, insert
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
        with Session(engine, future=True) as s:
            s.query(server.Environment_Variables)\
            .filter(server.Environment_Variables.id == "Forkstate")\
                .update({server.Environment_Variables.value: mode_int}, synchronize_session="auto")
            s.commit()
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
        with Session(engine, future=True) as s:
            s.query(server.Environment_Variables)\
            .filter(server.Environment_Variables.id == "Hbstate"+str(device_id))\
                .update({server.Environment_Variables.value: mode_int}, synchronize_session="auto")
            s.commit()
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
        with Session(engine, future=True) as s:
            s.query(server.Environment_Variables)\
            .filter(server.Environment_Variables.id == "Hstate")\
                .update({server.Environment_Variables.value: mode_int}, synchronize_session="auto")
            s.commit()
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
            ret[hash(str(i[0].time))] = {"hum": i[0].humidity, "tem": i[0].temperature, "time": i[0].time}
        return ret

@app.route("/hum_sensor_<id>/", methods=["GET"])
def hsenget(id):
    ret = {}
    with Session(engine, future=True) as s:
        for i in s.execute(select(server.Data).filter(and_(server.Data.type == ("hum_soil_sensor_"+str(id))))):
            ret[hash(str(i[0].time))] = {"hum": i[0].humidity, "tem": i[0].temperature, "time": i[0].time}
        return ret

@app.route("/gh/", methods=["GET"])
def gh():
    ret = {}
    with Session(engine, future=True) as s:
        for i in s.execute(select(server.Data).filter(or_(server.Data.type == ("temp_hum_sensor_1"), server.Data.type == ("temp_hum_sensor_2"), server.Data.type == ("temp_hum_sensor_3"), server.Data.type == ("temp_hum_sensor_4")))):
            ret[hash(str(i[0].id))] = {"hum": i[0].humidity, "tem": i[0].temperature, "time": i[0].time}
        return ret
    
@app.route("/getstates/", methods=["GET"])
def getstates():
    with Session(engine, future=True) as s:
        ret = {}
        for i in range(1,7):
            ret[hash(s.execute(select(server.Environment_Variables).filter(server.Environment_Variables.id == ("Hbstate" + str(i)))).first()[0].id)] = {"id": s.execute(select(server.Environment_Variables).filter(server.Environment_Variables.id == ("Hbstate" + str(i)))).first()[0].id, "state": s.execute(select(server.Environment_Variables).filter(server.Environment_Variables.id == ("Hbstate" + str(i)))).first()[0].value}
        ret[hash(s.execute(select(server.Environment_Variables).filter(server.Environment_Variables.id == "Hstate")).first()[0].id)] = {"id": s.execute(select(server.Environment_Variables).filter(server.Environment_Variables.id == "Hstate")).first()[0].id, "state": s.execute(select(server.Environment_Variables).filter(server.Environment_Variables.id == "Hstate")).first()[0].value}
        ret[hash(s.execute(select(server.Environment_Variables).filter(server.Environment_Variables.id == "Forkstate")).first()[0].id)] = {"id": s.execute(select(server.Environment_Variables).filter(server.Environment_Variables.id == "Forkstate")).first()[0].id, "state": s.execute(select(server.Environment_Variables).filter(server.Environment_Variables.id == "Forkstate")).first()[0].value}
        return ret

@app.route("/gethums/", methods=["GET"])
def gethums():
    with Session(engine, future=True) as s:
        ret = {}
        for i in range(1, 7):
            ret[s.execute(select(server.Data).filter(server.Data.type.startswith("hum_soil_sensor_" + str(i))).order_by(server.Data.time.desc())).first()[0].type] = {"hum": s.execute(select(server.Data).filter(server.Data.type.startswith("hum_soil_sensor_" + str(i))).order_by(server.Data.time.desc())).first()[0].humidity}
        return ret
    
@app.route("/getghavg/", methods=["GET"])
def getghavg():
    with Session(engine, future=True) as s:
        ret = {}
        for i in s.execute(select(server.Data).filter(server.Data.type.startswith("temp_hum")).order_by(server.Data.time.desc()).limit(4)).all():
            ret[hash(datetime.datetime.now())] = {"tem": i[0].temperature, "hum": i[0].humidity}
        return ret

@app.route("/getvars/", methods=["GET"])
def getvars():
    with Session(engine, future=True) as s:
        ret = {}
        T = s.execute(select(server.Environment_Variables).filter(server.Environment_Variables.id.contains("\%"))).all()
        for i in T:
            ret[i[0].id] = i[0].value
        T = s.execute(select(server.Environment_Variables).filter(server.Environment_Variables.id == "T")).first()
        ret[T[0].id] = T[0].value
        return ret

@app.route("/update_var/<var>/<value>", methods=["GET"])
def updatevar(var, value):
    try:
         q3123 = int(value)
    except:
        return "ti chmo"
    with Session(engine, future=True) as s:
        s.query(server.Environment_Variables)\
        .filter(server.Environment_Variables.id == var)\
        .update({server.Environment_Variables.value: int(value)}, synchronize_session="auto")
        s.commit()
        return "success"

@app.route("/password/<passq>", methods=["GET"])
def password(passq):
    if passq=="НЧМЧ":
        return Response({"state": "no"}, status=403)
    if passq=="Karl":
        return Response({"state": "no"}, status=402)
    if passq=="Ar3n":
        return {"state": "yes"}
    return Response({"state": "no"}, status=401)

@app.route("/insert_var/<typeq>", methods=["GET"])
def insert_var(typeq):
    if typeq[0]=="h":
        timeq = request.headers.get("time")
        hum = request.headers.get("hum")
        with Session(engine, future=True) as s:
            s.add(server.Data(id=hash(datetime.datetime.now()), temperature=0, humidity=hum, type=("hum_soil_sensor_"+typeq[-1]), time = timeq, ts = 1))
            s.commit()
            return Response(status=200)
    if typeq[0]=="t":
        tsq = request.headers.get("ts")
        timeq = request.headers.get("time")
        hum = request.headers.get("hum")
        tem = request.headers.get("tem")
        with Session(engine, future=True) as s:
            for i in range(4):
                s.add(server.Data(id=hash(datetime.datetime.now()), temperature=tem, humidity=hum, type=("temp_hum_sensor_"+str(i+1)), time = timeq, ts = tsq))
            s.commit()
            return Response(status=200)

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

    

    