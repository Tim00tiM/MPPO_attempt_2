import './Table.css'
import { useEffect, useState } from 'react'

function Table(props){
    const [isLoading, setIsLoading] = useState(false)
    const [data, setData] = useState(0)

    useEffect(() => {
    setIsLoading(true)
        fetch('http://127.0.0.1:5000/' + props.type + "/", {
          method: "GET",  
          headers: {
            "ts": props.ts,
            "Content-Type": "application/json",
          },
        }).then(data => setData(data)).finally(() => {
            console.log(data)
            setIsLoading(false)});
    }, [])




    return(
        <div>
            { isLoading ?
            "table xD"
            :
            <div>
                
            </div>
            }
            </div>
    )
}

export default Table