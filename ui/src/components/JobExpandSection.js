import React, { useState } from 'react';
import { Button, ExpandableSection } from '@patternfly/react-core';
import { Link } from 'react-router-dom';
import {CardBasic} from './CardTemplates';
import axios from 'axios';
import {LoadingStateDemo} from './Table';
import { RedditSquareIcon, SyncAltIcon } from '@patternfly/react-icons'

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
        isWidthLimited
      >

      </ExpandableSection>
    )
}

export default JobExpandableSection;
