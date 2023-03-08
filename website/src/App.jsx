import { useEffect } from 'react'
import { useState } from 'react'
import './App.css'
import { Container, Row, Col } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import Temphum from './components/Temphum'
import Gh from './components/Gh'
import Ghv from './components/Ghv'
import Hum from './components/Hum'

function App() {
  const [mode, setMode] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [timestamp, setTimestamp] = useState(Date.now)

  
  const start = async (time) =>{
      setIsLoading(true)
      try {
        const response = await fetch('http://localhost:5000/start', {
          method: "GET",  
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        if (!response.ok) {
          throw new Error(`Error! status: ${response.status}`);
        }
  
        const result = await response.json();
  
        console.log('result is: ', JSON.stringify(result, null, 4));
      } 
     finally {
        setIsLoading(false);
      }

  }
  

  return (
    <div className="App" >
      <div style={{"width": "93%", "height": "100%", "display": "flex", "flex-direction": "row"}}>
      <Container className="columnbg">
        <Row className='columnwrapper'>
          <Col className="column" onClick={() => {
            start(timestamp)
            setMode("th")
            }}>
            Датчики влажности и температуры теплицы
          </Col>
          <Col className="column" onClick={() => setMode("h")}>
            Датчики бороздок
          </Col>
          <Col className="column" onClick={() => setMode("gh")}>
            Общие сведения о теплице
          </Col>
          <Col className="column" onClick={() => setMode("ghv")}>
            Управление теплицей
          </Col>
        </Row>
      </Container>
      {mode === "th" ? <div>
        <Temphum ts={timestamp}/>
      </div> : null}
      {mode === "h" ? <div>
        <Hum/>
      </div> : null}
      {mode === "gh" ? <div>
        <Gh/>
      </div> : null}
      {mode === "ghv" ? <div>
        <Ghv/>
      </div> : null}
      </div>
      <div className='goddiv'>
      <Button variant="danger" className='godbtn'>God-Mode</Button>
      </div>
    </div>
  )
}

export default App
