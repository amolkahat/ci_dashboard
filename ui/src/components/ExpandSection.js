import React, { useState } from 'react';
import { Button, ExpandableSection } from '@patternfly/react-core';
import { Link } from 'react-router-dom';
import {CardBasic} from './CardTemplates';
import axios from 'axios';
import {DynamicTable} from './Table';

const JobExpandableSection =  (props) => {
    const dict = props.dict;
    const [jobHistory, setJobHistory] = useState([]);
    const [isExpanded, setIsExpanded] = useState(false)
    const [error, setError] = useState("")
    const [job_id, setjob_id] = useState(1)

    function onToggle(isExpanded, id){
      setIsExpanded(!isExpanded)
      getHistory(id)
    }

    function getHistory(job_id){
      axios.get(`http://localhost:8000/api/jobs/${job_id}/history/`
        , {'crossdomain': true})
      .then(res=> {
        setJobHistory(res.data)
      })
      .catch(err=> console.log(err))
    };

  return (
      <ExpandableSection
        toggleText={isExpanded ? dict.job_name : dict.job_name}
        onToggle={() => onToggle(isExpanded, dict.id)}
        isExpanded={isExpanded}
        displaySize="large"
      >
        <DynamicTable
          head={[ //  "job_name_id",
                "tests_log_url",
                 // "duration",  "end_time", "event_timestamp",
                  "project", "pipeline", "result", "voting", "job_tests"]}
          data={[jobHistory]}/>
      </ExpandableSection>
    )
}


export const HashExpandableSection =  (props) => {
  const dataDict = props.dict;
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeItem, setActiveItem] = useState(0)

  function onToggle(isExpanded){
    setIsExpanded(!isExpanded)
  }

  const dispay = Object.keys(dataDict).map((d, key) => {
    function onExpand(result){
      setActiveItem(result.itemId)
    }

    return (
      <ExpandableSection
        toggleText={isExpanded ? d : d}
        onToggle={() => onToggle(isExpanded)}
        isExpanded={isExpanded}
        onExpand={e=>onExpand(e)}
        displaySize='large'
        itemId={key}
      >
        {key} {d} {console.log(dataDict[d])}
      </ExpandableSection>
    )
  })

  return (
    <div>
      {dispay}
    </div>
  )
}

export default {JobExpandableSection, HashExpandableSection};
