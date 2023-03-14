import Tablet from './Tablet'
import Graph from './Graph'
import { Container, Row, Col } from 'react-bootstrap'
import { useState, useEffect } from 'react'
import './Temphum.css'


function Temphum(props){

    const [temphum, setTemphum] = useState(0)
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
            <Container className="temphumcontainer">
                <Row className='temphumcolumnwrapper'>
                    <Col className="temphumcolumn" onClick={() => {
                        setMode("choosevistype")
                        setTemphum(1)}}>
                        1
                    </Col>
                    <Col className="temphumcolumn" onClick={() => {
                        setMode("choosevistype")
                        setTemphum(2)}}>
                        2
                    </Col>
                    <Col className="temphumcolumn" onClick={() => {
                        setMode("choosevistype")
                        setTemphum(3)}}>
                        3
                    </Col>
                    <Col className="temphumcolumn" onClick={() => {
                        setMode("choosevistype")
                        setTemphum(4)}}>
                        4
                    </Col>
                </Row>
            </Container> 
            : mode === "choosevistype" ?
            <Container className="temphumcontainer">
            <Row className='temphumcolumnwrapper'>
                <Col className="temphumcolumn" onClick={() => {
                        setMode("displaydata")
                        setVistype("table")}}>
                    Таблица
                </Col>
                <Col className="temphumcolumn" onClick={() => {
                    setMode("displaydata")
                    setVistype("graph")}}>
                    График
                </Col>
            </Row>
            </Container> 
            :
            vistype === 
            "graph" ? 
            <Graph type={"temp_hum_sensor_" + temphum} ts={props.ts}/> :
            vistype === "table" ? 
            <Tablet type={"temp_hum_sensor_" + temphum} ts={props.ts}/> :
            null
            }
        </div>
    )
}


export default Temphum