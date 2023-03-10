import './Tablet.css'
import { useEffect, useState } from 'react'
import Table from 'react-bootstrap/Table';
import moment from 'moment'

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

    return(
        <div>
            { 
            data.length !== 0 ?
            <div className='tabletop'>
                <Table striped bordered hover variant="dark" className='tableitself'>
                  <thead>
                    <tr>
                      <th>Humidity</th>
                      <th>Temperature</th>
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
            </div>: "table xD"
            }
            </div>
    )
}

export default Tablet