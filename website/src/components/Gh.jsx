import './Gh.css'
import GhGraph from './GhGraph'
import GhTablet from './GhTablet'
import { Container, Row, Col } from 'react-bootstrap'
import { useState, useEffect } from 'react'

function Gh(props){

    const [mode, setMode] = useState(props.md)
    const [vistype, setVistype] = useState(null)
    const [count, setCount] = useState(0)

    useEffect(() => {
        if (count != props.count){
            setMode("choosevistype")
            setCount(props.count)
        }
    })


    return(
        <div style={{"width": "100%", "height": "100%"}}>
            {mode === "choosevistype" ?
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
             <GhGraph /> :
            vistype === "table" ? 
            <GhTablet ts = {props.ts}/> :
            null
            }
            
        </div>
    )
}

export default Gh