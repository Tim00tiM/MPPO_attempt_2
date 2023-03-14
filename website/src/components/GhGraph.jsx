import './Graph.css'
import { useEffect, useState } from 'react'
import moment from 'moment'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Legend, Tooltip } from 'recharts';




function GhGraph(props){

    const [data, setData] = useState([])
    const [time, setTime] = useState(1);

    const pageWidth = document.documentElement.scrollWidth
    const pageHeight = document.documentElement.scrollHeight

    useEffect(() => {
      const interval = setInterval(() =>{
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
    <div className='conta'>
        {data.length !== 0 ?
        <LineChart className='graph' data={data} width={pageWidth*0.65} height={pageHeight*0.8}>
        <XAxis dataKey={(date) => moment(date["time"]).format("HH:mm:ss")}/>
        <YAxis />
        <Line type="monotoneX" dataKey="tem" stroke="#cec757"/>
        <Line type="monotoneX" dataKey="hum" stroke="#00a400"/>
        <Legend verticalAlign="top" />
        <Tooltip />
    </LineChart>
    :
    "Graph xd"
    }
    </div>)
}


export default GhGraph