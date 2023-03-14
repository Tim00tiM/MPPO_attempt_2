import Tablet from './Tablet'
import Graph from './Graph'
import { Container, Row, Col } from 'react-bootstrap'
import { useState, useEffect } from 'react'
import './Hum.css'





function Hum(props){
    const [hum, setHum] = useState(0)
    const [mode, setMode] = useState(props.md)
    const [vistype, setVistype] = useState(null)
    const [count, setCount] = useState(0)

    useEffect(() => {
        if (count != props.count){
            setMode("chooseid")
            setCount(props.count)
        }
    })


    return(
        <div style={{"width": "100%", "height": "100%"}}>
            { mode === "chooseid" ?
            <Container className="humcontainer">
                <Row className='humcolumnwrapper'>
                    <Col className="humcolumn" onClick={() => {
                        setMode("choosevistype")
                        setHum(1)}}>
                        1
                    </Col>
                    <Col className="humcolumn" onClick={() => {
                        setMode("choosevistype")
                        setHum(2)}}>
                        2
                    </Col>
                    <Col className="humcolumn" onClick={() => {
                        setMode("choosevistype")
                        setHum(3)}}>
                        3
                    </Col>
                    <Col className="humcolumn" onClick={() => {
                        setMode("choosevistype")
                        setHum(4)}}>
                        4
                    </Col>
                    <Col className="humcolumn" onClick={() => {
                        setMode("choosevistype")
                        setHum(5)}}>
                        5
                    </Col>
                    <Col className="humcolumn" onClick={() => {
                        setMode("choosevistype")
                        setHum(6)}}>
                        6
                    </Col>
                </Row>
            </Container> 
            : mode === "choosevistype" ?
            <Container className="humcontainer">
            <Row className='humcolumnwrapper'>
                <Col className="humcolumn" onClick={() => {
                        setMode("displaydata")
                        setVistype("table")}}>
                    Таблица
                </Col>
                <Col className="humcolumn" onClick={() => {
                    setMode("displaydata")
                    setVistype("graph")}}>
                    График
                </Col>
            </Row>
            </Container> 
            :
            vistype === 
            "graph" ? 
            <Graph type={"hum_sensor_" + hum} ts={props.ts}/> :
            vistype === "table" ? 
            <Tablet type={"hum_sensor_" + hum} ts={props.ts}/> :
            null
            }
        </div>
    )
}


export default Hum