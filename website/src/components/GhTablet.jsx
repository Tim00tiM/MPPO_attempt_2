import './GhTablet.css'
import { useEffect, useState } from 'react'
import Table from 'react-bootstrap/Table';
import moment from 'moment'
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"

function GhTablet(props){
    const [data, setData] = useState([])
    const [count, setCount] = useState(0)
    const [time, setTime] = useState(1);

    useEffect(() => {
      const interval = setInterval(() =>{
        console.log(time)
        setTime(time+1)
      }, 5000)
    
    fetch('http://127.0.0.1:5000/gh/', {headers: {"ts": props.ts}}).then(
      response => response.json()
    ).then(date => {
        let av = []
          console.log(Object.values(date).sort(compare))
        let  dd = Object.values(date).sort(compare)
          for (let i=0; i<dd.length/4; i++){
            av.push({
                tem: ((Number(dd[i*4].tem)+ Number(dd[i*4+3].tem) + Number(dd[i*4+2].tem) + Number(dd[i*4+1].tem))/4).toFixed(2), 
                hum: ((Number(dd[i*4].hum) + Number(dd[i*4+3].hum) + Number(dd[i*4+2].hum) + Number(dd[i*4+1].hum))/4).toFixed(2),
                time: dd[i*4].time
        })
          }
          console.log(av)
        setData(av)}
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
      let type = "tem"
      fetch(`http://127.0.0.1:5000/insert_var/${type}`, {headers: {"ts": props.ts, "time": document.getElementById("time").value, "hum": document.getElementById("hum").value, "tem": document.getElementById("tem").value}})
        .then(response => response.status)
        .then(ere => alert(ere))
    }

    return(
        <div>
            { 
            data.length !== 0 ?
            <div style={{"flexDirection":"row", "display":"flex"}}>
            <div className='ghtabletop'>
                <Table striped bordered hover variant="dark" className='ghtableitself'>
                  <thead>
                    <tr>
                      <th>avg. Humidity</th>
                      <th>avg. Temperature</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item) => {
                        return <tr>
                          <td>
                            {item.hum}
                          </td>
                        <td>
                        {item.tem}
                      </td>
                        <td>
                          {moment(item.time).format("HH:mm:ss DD.MM.YYYY")}
                        </td>
                        </tr>
                    })}
                  </tbody>
                </Table>
                </div>
                <div className='adder'>
                <Form style={{"display":"flex", "alignItems":"center", "flexDirection": "column"}}>
                <Form.Group controlId="hum">
                <Form.Control placeholder="Enter humidity value" type="number"/>
                </Form.Group>
                <Form.Group controlId="tem"  style={{"marginTop": "4%"}}>
                <Form.Control placeholder="Enter temparature value" type="number"/>
                </Form.Group>
                <Form.Group controlId="time" style={{"marginTop": "4%"}}>
                <Form.Control placeholder="Enter time" type="datetime-local" step="1"/>
                </Form.Group>
                <Button onClick={sendData} style={{"marginTop":"5%"}}>Отправить</Button>
                </Form>
                </div>
            </div>: "table xD"
            }
            </div>
    )
}

export default GhTablet