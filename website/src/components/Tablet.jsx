import './Tablet.css'
import { useEffect, useState } from 'react'
import Table from 'react-bootstrap/Table';
import moment from 'moment'
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"

function Tablet(props){
    const [data, setData] = useState([])
    const [count, setCount] = useState(0)
    const [time, setTime] = useState(1);

    useEffect(() => {
      const interval = setInterval(() =>{
        console.log(time)
        setTime(time+1)
      }, 5000)
    
    fetch('http://127.0.0.1:5000/' + props.type + "/", {headers: {"ts": props.ts}}).then(
      response => response.json()
    ).then(date => {
          console.log(Object.values(date).sort(compare))
          setData(Object.values(date).sort(compare))}
          )

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

    const sendData = () => {
      let type = props.type
      fetch(`http://127.0.0.1:5000/insert_var/${type}`, {headers: {"time": document.getElementById("time").value, "hum": document.getElementById("hum").value}})
        .then(response => response.status)
        .then(ere => alert(ere))
    }

    return(
        <div>
            { 
            data.length !== 0 ?
            <div style={{"flexDirection":"row", "display":"flex"}}>
            <div className='tabletop'>
                <Table striped bordered hover variant="dark" className='tableitself'>
                  <thead>
                    <tr>
                      <th>Humidity</th>
                      {
                        props.type.charAt(0) == "t"
                        ?
                      <th>Temperature</th>
                      :
                      null
                      }
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item) => {
                        return <tr>
                          <td>
                            {item.hum}
                          </td>
                          {
                        props.type.charAt(0) == "t"
                        ?
                        <td>
                        {item.tem}
                      </td>
                      :
                      null
                      }
                        <td>
                          {moment(item.time).format("HH:mm:ss DD.MM.YYYY")}
                        </td>
                        </tr>
                    })}
                  </tbody>
                </Table>
                
            </div>
            {props.type.charAt(0)!="t"?
            <div className='adder'>
            <Form style={{"display":"flex", "alignItems":"center", "flexDirection": "column"}}>
            <Form.Group controlId="hum">
            <Form.Control placeholder="Enter humidity value" type="number"/>
            </Form.Group>
            <Form.Group controlId="time" style={{"marginTop": "4%"}}>
            <Form.Control placeholder="Enter time" type="datetime-local" step="1"/>
            </Form.Group>
            <Button onClick={sendData} style={{"marginTop":"5%"}}>Отправить</Button>
            </Form>
            </div>:
            null
            }
            </div>
            : "table xD"
            }
            </div>
    )
}

export default Tablet