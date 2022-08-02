import React, {useState, useEffect} from 'react'
import axios from 'axios';
import { ExpandableSection } from '@patternfly/react-core';
import { List, ListItem, ListComponent, OrderType } from '@patternfly/react-core';
import { CardBasic } from "../components/CardTemplates";



export default function OSPComponent() {
    const [component, setComponent] = useState({})
    const [activeItem, setActiveItem] = useState(0)
    const [isExpanded, setIsExpanded] = useState(false)
    useEffect(() => {
      axios
      .get('http://localhost:8000/api/component/')
      .then(res => {console.log(res.data)
        setComponent(res.data)})
    }, [])

    function onToggle(isExpanded, itemID){
        setIsExpanded(!isExpanded)
        if (activeItem === itemID){
            setActiveItem('')
        }else{
            setActiveItem(itemID)
        }
    }
  return (
    <div>{Object.entries(component).map((i, j) => {
        const key = j;
        return <div>
                <ExpandableSection
                toggleText={i[0]}
                key={key}
                onToggle={() => {onToggle(isExpanded, key)}}
                isExpanded={activeItem === key}
                itemID={key}
                ><CardBasic header={"All Jobs"}>
                    <List key={activeItem + key} component={ListComponent.ol} type={OrderType.number}>
                        {i[1].map(comp =>{
                            return <ListItem key={comp.timestamp}>{comp.job_id} {comp.success ? "PASS": "FAILURE"}</ListItem>
                        })}
                    </List>
                </CardBasic>
                </ExpandableSection>
            </div>

    })}</div>
  )
}
