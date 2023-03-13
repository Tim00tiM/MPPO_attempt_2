
import { Container, Row, Col, Stack, Button, Image } from 'react-bootstrap'
import { useState, useEffect } from 'react'
import './Ghv.css'
import moment from 'moment'
import Form from 'react-bootstrap/Form';
import offimg from "../assets/off1.png"
import onimg from "../assets/on1.png"


function Ghv(props){

    const [data, setData] = useState({})
    const [time, setTime] = useState(1);

    let qq = [1, 2, 3, 4, 5, 6]
    useEffect(() => {
        const interval = setInterval(() =>{
          setTime(time+1)
          console.log(data)
        }, 1000)

        fetch('http://127.0.0.1:5000/getstates/', {headers: {"ts": props.ts}})
        .then(response => response.json())
        .then(date => {
        let ret = data
        for (let i in Object.values(date)){
            ret[Object.values(date)[i].id] = Number(Object.values(date)[i].state)
        }
        setData(ret)
    })

    fetch('http://127.0.0.1:5000/getghavg/', {headers: {"ts": props.ts}}).then(
      response => response.json()
    ).then(date => {
        let ut = 0
        let uh = 0
        for (let i in Object.values(date)){
            ut += Number(Object.values(date)[i].tem)
            uh += Number(Object.values(date)[i].hum)
        }
          let ret = data
          ret["avgHum"] = uh/4
          // ret["avgT"] = ut/4
          ret["avgT"] = 1
        setData(ret)
        })

        fetch('http://127.0.0.1:5000/gethums/', {headers: {"ts": props.ts}}).then(
      response => response.json()
    ).then(date => {    
        let ret = data
        ret["hum1"] = Number(date.hum_soil_sensor_1.hum)
        ret["hum2"] = Number(date.hum_soil_sensor_2.hum)
        ret["hum3"] = Number(date.hum_soil_sensor_3.hum)
        ret["hum4"] = Number(date.hum_soil_sensor_4.hum)
        ret["hum5"] = Number(date.hum_soil_sensor_5.hum)
        ret["hum6"] = Number(date.hum_soil_sensor_6.hum)
        setData(ret)
        })

        fetch('http://127.0.0.1:5000/getvars/', {headers: {"ts": props.ts}}).then(
      response => response.json()
    ).then(date => {
        let ret = data
        for(let i in date){
          ret[i] = Number(date[i])
        }
        setData(ret)
        })
          return () => clearInterval(interval)
        }, [time])


        function compare( a, b ) {
            if ( moment(a.time).isBefore(moment(b.time)) ){
              return -1;
            }
            if ( moment(a.time).isAfter(moment(b.time)) ){
              return 1;
            }
            return 0;
          }

        const clickHandler = (type, value) => {
          fetch(`http://127.0.0.1:5000/${type}/${value}`, {headers: {"ts": props.ts}})
          .then(response => response.status)
          .then(ere => alert(ere))
  
        }

        const changeValue = (type, value) =>{
          fetch(`http://127.0.0.1:5000/update_var/${type}/${value}`, {headers: {"ts": props.ts}})
          .then(response => response.status)
          .then(ere => alert(ere))
        }


    return(
        <div style={{"width": "100%", "height": "100%"}}>
        {data.length !== 0 ?
        <div className='items'>
            <div className='ghvcontainerfork'>
                <div style={{"display":"flex", "flexDirection": "column", "justifyContent": "start"}}>
                <div className='text'>
                    Состояние форточек
                </div>
                {data.Forkstate == 0 || data.Forkstate == undefined?
                <div className='close'>Закрыто</div>
                :
                <div className='open'>Открыто</div>
                }
                </div>
                {
                  props.admin=="yes" || data["T"]<data["avgT"]?
                  data.Forkstate == 0 || data.Forkstate == undefined?
                <Button variant="secondary" className='ghvbtn' onClick={() => clickHandler("fork_drive", "open")}>Открыть</Button>
                :
                <Button variant="secondary" className='ghvbtn' onClick={() => clickHandler("fork_drive", "close")}>Закрыть</Button>
                :
                data.Forkstate == 0 || data.Forkstate == undefined?
                <Button variant="secondary disabled" className='ghvbtn'>Открыть</Button>
                :
                <Button variant="secondary" className='ghvbtn' onClick={() => clickHandler("fork_drive", "close")}>Закрыть</Button>


              }
              <Form>
              {props.admin=="yes"?
              <Form.Group controlId="Tvalue" style={{"display":"flex", "alignItems":"center", "flexDirection": "column"}}>
              <Form.Label className='text'>Условие открытия</Form.Label>
              <Form.Control type="number" defaultValue={data["T"]} className="formcontrol"/>
              <Button variant="secondary" onClick={() => changeValue("T", document.getElementById('Tvalue').value)} style={{"marginTop": "3%", "width": "90%"}} >Изменить значение</Button>
              </Form.Group>
              :  
              <Form.Group controlId="Tvalue" style={{"display":"flex", "alignItems":"center", "flexDirection": "column"}}>
              <Form.Label className='text'>Условие открытия</Form.Label>
              <Form.Control type="number" disabled className="formcontrol" defaultValue={data["T"]}/>
              <Button variant="secondary disabled" style={{"marginTop": "3%", "width": "90%"}}>Изменить значение</Button>
              </Form.Group>
              }
              </Form>
          </div>
          <div className='ghvcontainertotalwatering'>
          <div style={{"display":"flex", "flexDirection": "column", "justifyContent": "start"}}>
                <div className='text'>
                    Состояние общего увлажнения
                </div>
                {data.Hstate == 0 || data.Hstate == undefined?
                <div className='close'>Закрыто</div>
                :
                <div className='open'>Открыто</div>
                }
                </div>
                {
                  props.admin=="yes" || data["avgHum"]<data["H%"]?
                  data.Hstate == 0 || data.Hstate == undefined?
                <Button variant="secondary" className='ghvbtn' onClick={() => clickHandler("total_watering", "open")}>Открыть</Button>
                :
                <Button variant="secondary" className='ghvbtn' onClick={() => clickHandler("total_watering", "close")}>Закрыть</Button>
                :
                data.Hstate == 0 || data.Hstate == undefined?
                <Button variant="secondary disabled" className='ghvbtn'>Открыть</Button>
                :
                <Button variant="secondary" className='ghvbtn' onClick={() => clickHandler("total_watering", "close")}>Закрыть</Button>


              }
              <Form>
              {props.admin=="yes"?
              <Form.Group controlId="Hvalue" style={{"display":"flex", "alignItems":"center", "flexDirection": "column"}}>
              <Form.Label className='text'>Условие открытия</Form.Label>
              <Form.Control type="number" defaultValue={data["H%"]} className="formcontrol"/>
              <Button variant="secondary" onClick={() => changeValue("H%", document.getElementById('Hvalue').value)} style={{"marginTop": "3%", "width": "90%"}} >Изменить значение</Button>
              </Form.Group>
              :  
              <Form.Group controlId="Hvalue" style={{"display":"flex", "alignItems":"center", "flexDirection": "column"}}>
              <Form.Label className='text'>Условие открытия</Form.Label>
              <Form.Control type="number" disabled className="formcontrol" defaultValue={data["H%"]}/>
              <Button variant="secondary disabled" style={{"marginTop": "3%", "width": "90%"}}>Изменить значение</Button>
              </Form.Group>
              }
              </Form>
            </div>
            <div className='ghvcontainerwatering'>
                <div className='text'>
                  Состояние бороздок
                </div>
                {qq.map((item) => (
                  <Stack direction="horizontal" className='grooveCont'>
                    {data["Hbstate"+item]=="0"?
                      <Image src={offimg} className="indicator"/>
                      :
                      <Image src={onimg} className="indicator"/>
                    }
                    {
                    props.admin=="yes" || data["Hb%"+item]>data["hum"+item]?  
                    data["Hbstate"+item] == 0 || data["Hbstate"+item] == undefined?
                    <Button variant="secondary" className='textBg' onClick={() => clickHandler("watering/"+item, "open")}>Бороздка #{item}</Button>
                    :
                    <Button variant="secondary" className='textBg' onClick={() => clickHandler("watering/"+item, "close")}>Бороздка #{item}</Button>
                    :
                    data["Hbstate"+item] == 0 || data["Hbstate"+item] == undefined?
                    <Button variant="secondary disabled" className='textBg'>Бороздка #{item}</Button>
                    :
                    <Button variant="secondary" className='textBg' onClick={() => clickHandler("watering/"+item, "close")}>Бороздка #{item}</Button>
                    }
                    <Form>
                    {props.admin=="yes"?
                    <Form.Group controlId={"Hvalue"+item} style={{"display":"flex", "alignItems":"center", "flexDirection": "row"}}>
                    <div style={{"display":"flex", "alignItems":"center", "flexDirection": "column"}}>
                    <Form.Label className='text'>Условие открытия</Form.Label>
                    <Form.Control type="number" defaultValue={data["Hb%"+item]} className="formcontrol"/>
                    </div>
                    <Button variant="secondary" onClick={() => changeValue("Hb%"+item, document.getElementById('Hvalue'+item).value)} style={{"marginTop": "3%", "width": "90%"}} >Изменить значение</Button>
                    </Form.Group>
                    :  
                    <Form.Group controlId={"Hvalue"+item} style={{"display":"flex", "alignItems":"center", "flexDirection": "row"}}>
                    <div style={{"display":"flex", "alignItems":"center", "flexDirection": "column"}}>
                    <Form.Label className='text'>Условие открытия</Form.Label>
                    <Form.Control type="number" disabled className="formcontrol" defaultValue={data["Hb%"+item]}/>
                    </div>
                    <Button variant="secondary disabled" style={{"marginTop": "3%", "width": "90%"}}>Изменить значение</Button>
                    </Form.Group>
                    }
                    </Form>
                  </Stack>
                  ))}
            </div>
            
        </div>:
        "loading"
    }
    </div>)
}


export default Ghv