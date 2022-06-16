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
    
    function onToggle(isExpanded){
      setIsExpanded(!isExpanded)
    }

    function getHistory(job_name){
      axios.get(`https://zuul.opendev.org/api/tenant/openstack/builds?job_name=${job_name}`
        , {'crossdomain': true})
      .then(res=> {
        const history = [jobHistory, {job_name: res.data}];
        setJobHistory(history)
      })
      .catch(err=> console.log(err))
    };

    function loadJobHistory(url){
      axios.get(url)
      .then(res => setJobHistory(res))
      .catch(err => setError(err))
    }

  return (
      <ExpandableSection
        toggleText={isExpanded ? dict.job_name : dict.job_name}
        onToggle={() => onToggle(isExpanded)}
        isExpanded={isExpanded}
        displaySize="large"
        isWidthLimited
      >
        <Button onClick={()=>getHistory(dict.job_name)}><SyncAltIcon/> Load data </Button>
        {console.log(jobHistory)}
      </ExpandableSection>
    )
}

export default JobExpandableSection;