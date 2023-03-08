from sqlalchemy import create_engine, Column, String, Numeric, DateTime
from sqlalchemy.orm import declarative_base, Session
import requests as r
import datetime
import time 
Base = declarative_base()

def temp_hum_sensor(number):
    URL = "https://dt.miet.ru/ppo_it/api/temp_hum/"
    response = r.get(url = (URL + str(number)))
    return response.json()

def hum_soil_sensor(number):
    URL = "https://dt.miet.ru/ppo_it/api/hum/"
    response = r.get(url = (URL + str(number)))
    return response.json()

class Data(Base):
    __tablename__ = "Data"
    id = Column(String, primary_key=True)
    temperature = Column(Numeric(4, 2))
    humidity = Column(Numeric(4, 2))
    type = Column(String)
    time = Column(DateTime)
    ts = Column(String)

class Environment_Variables(Base):
    __tablename__ = "environment variables"
    id = Column(String, primary_key=True)
    value = Column(Numeric)

def setup():
    print("setup")
    engine = create_engine("postgresql+psycopg2://postgres:123@db:5432/", echo=True)
    engine.connect()
    Base.metadata.create_all(engine)
    with Session(engine, future=True) as s:
        to_add = []
        for i in range(1,5):
            parse = temp_hum_sensor(i)
            to_add.append(Data(id=str(hash(datetime.datetime.now())),temperature = parse["temperature"], humidity = parse["humidity"], type = ("temp_hum_sensor_"+str(i)), time = datetime.datetime.now()))
        for i in range(1,7):
            parse = hum_soil_sensor(i)
            to_add.append(Data(id=str(hash(datetime.datetime.now())),temperature = 0, humidity = parse["humidity"], type = ("hum_soil_sensor_"+str(i)), time = datetime.datetime.now()))
        s.add_all(to_add)
        s.add(Environment_Variables(id="T", value=27))
        s.add(Environment_Variables(id="H%", value=50))
        for i in range(1,7):
            s.add(Environment_Variables(id=("Hb%"+str(i)), value=50))
        s.commit()
