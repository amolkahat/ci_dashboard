import React, { useState, useEffect } from 'react';
import { Tabs, Tab, TabTitleText, TabTitleIcon, Button } from '@patternfly/react-core';
import UsersIcon from '@patternfly/react-icons/dist/esm/icons/users-icon';
import BoxIcon from '@patternfly/react-icons/dist/esm/icons/box-icon';
import DatabaseIcon from '@patternfly/react-icons/dist/esm/icons/database-icon';
import ServerIcon from '@patternfly/react-icons/dist/esm/icons/server-icon';
import LaptopIcon from '@patternfly/react-icons/dist/esm/icons/laptop-icon';
import ProjectDiagramIcon from '@patternfly/react-icons/dist/esm/icons/project-diagram-icon';
import { CardBasic } from './CardTemplates';
import {LaunchpadTableStriped} from './Table';
import axios from 'axios';


const RRToolsTab = (props) => {
  const [activeTabKey, setactiveTabKey] = useState(0)
  const [error, seterror] = useState("")
  const [launchpad, setlaunchpad] = useState([])
    // Toggle currently active tab
  function handleTabClick(event, tabIndex){
      setactiveTabKey(tabIndex);
    };

  useEffect(() => {
    getLaunchpadBugs()
  }, [])

  function getDLRNData(){
    const d = {'commit_hash': ' ', 'distro_hash': '37d256eb4437fa15aec5d8d76957c2d220a06712', 'extended_hash': '', 'success': 'True'}
    axios
    .get("https://trunk.rdoproject.org/api-centos9-wallaby/api/repo_status", d)
    .then(res => console.log(res.data))
    .catch(err => seterror(err))
  }

  function getLaunchpadBugs(){
    axios
    .get("http://localhost:8000/api/launchpad/")
    .then(res => setlaunchpad(res.data))
    .catch(err => seterror(err))
  }

  return (
      <CardBasic title={error}>
      <Tabs activeKey={activeTabKey} onSelect={handleTabClick}
            aria-label="Tabs in the icons and text example">

        <Tab eventKey={1} title={
            <>
              <TabTitleIcon><UsersIcon /></TabTitleIcon>{' '}
              <TabTitleText>Launchpad</TabTitleText>{' '}
            </>
          } >
          <LaunchpadTableStriped repos={launchpad} title="Launchpad Bugs"/>
        </Tab>
        <Tab eventKey={2} title={
            <>
              <TabTitleIcon><BoxIcon /></TabTitleIcon>{' '}
              <TabTitleText>Bugzilla</TabTitleText>{' '}
            </>
          } >
          Bugzilla
        </Tab>
        <Tab eventKey={3} title={
            <>
              <TabTitleIcon><DatabaseIcon /></TabTitleIcon>{' '}
              <TabTitleText>Skiplist</TabTitleText>{' '}
            </>
          }>
          Skiplist
        </Tab>
        <Tab eventKey={4} title={
            <>
              <TabTitleIcon><ServerIcon /></TabTitleIcon>{' '}
              <TabTitleText>Mirrors</TabTitleText>{' '}
            </>
          }>
          Mirrors
        </Tab>
        <Tab eventKey={5} title={
            <>
              <TabTitleIcon><LaptopIcon /></TabTitleIcon>{' '}
              <TabTitleText>System</TabTitleText>{' '}
            </>
          }>
          System
        </Tab>
        <Tab eventKey={6} title={
            <>
              <TabTitleIcon><ProjectDiagramIcon /></TabTitleIcon>{' '}
              <TabTitleText>Network</TabTitleText>{' '}
            </>
          }>
          Network
        </Tab>
      </Tabs>
      </CardBasic>
    );
}


const TempestTabs = (props) => {
  const [activeTabKey, setactiveTabKey] = useState(1)
  function handleTabClick(event, tabIndex){
      setactiveTabKey(tabIndex);
    };

  return (
    <CardBasic>
      <Tabs activeKey={activeTabKey} onSelect={handleTabClick}
            aria-label="Tabs in the icons and text example">
        <Tab eventKey={1} title={
            <>
              <TabTitleIcon><DatabaseIcon /></TabTitleIcon>{' '}
              <TabTitleText>Search Test</TabTitleText>{' '}
            </>
          }>
          {props.testCase}
        </Tab>
        <Tab eventKey={2} title={
            <>
              <TabTitleIcon><BoxIcon /></TabTitleIcon>{' '}
              <TabTitleText>Add Job</TabTitleText>{' '}
            </>
        }>
          {props.jobAdd}
        </Tab>
      </Tabs>
    </CardBasic>
  )
}


export {RRToolsTab, TempestTabs};
