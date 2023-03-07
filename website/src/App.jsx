import { useState } from 'react'
import './App.css'
import { Container, Row, Col } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'


function App() {
  const [count, setCount] = useState(0)
  

  return (
    <div className="App" >
      <div style={{"width": "93%", "height": "100%"}}>
      <Container className="columnbg">
        <Row className='columnwrapper'>
          <Col className="column">
            Датчики влажности и температуры теплицы
          </Col>
          <Col className="column">
            Датчики бороздок
          </Col>
          <Col className="column">
            Общие сведения о таблице
          </Col>
          <Col className="column">
            Управление таблицей
          </Col>
        </Row>
      </Container>
      </div>
      <div className='goddiv'>
      <Button variant="danger" className='godbtn'>God-Mode</Button>
      </div>
    </div>
  )
}

export default App
