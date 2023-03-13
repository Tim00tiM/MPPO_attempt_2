import './GhTablet.css'
import { useEffect, useState } from 'react'
import Table from 'react-bootstrap/Table';
import moment from 'moment'

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
                tem: (Number(dd[i*4].tem)+ Number(dd[i*4+3].tem) + Number(dd[i*4+2].tem) + Number(dd[i*4+1].tem))/4, 
                hum: (Number(dd[i*4].hum) + Number(dd[i*4+3].hum) + Number(dd[i*4+2].hum) + Number(dd[i*4+1].hum))/4,
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

    return(
        <div>
            { 
            data.length !== 0 ?
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
                            {item.hum.toFixed(2)}
                          </td>
                        <td>
                        {item.tem.toFixed(2)}
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

export default GhTablet