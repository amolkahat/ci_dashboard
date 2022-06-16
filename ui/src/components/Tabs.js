import React, { useState } from 'react';
import { Tabs, Tab, TabTitleText, TabTitleIcon, Button } from '@patternfly/react-core';
import UsersIcon from '@patternfly/react-icons/dist/esm/icons/users-icon';
import BoxIcon from '@patternfly/react-icons/dist/esm/icons/box-icon';
import DatabaseIcon from '@patternfly/react-icons/dist/esm/icons/database-icon';
import ServerIcon from '@patternfly/react-icons/dist/esm/icons/server-icon';
import LaptopIcon from '@patternfly/react-icons/dist/esm/icons/laptop-icon';
import ProjectDiagramIcon from '@patternfly/react-icons/dist/esm/icons/project-diagram-icon';
import { CardBasic } from './CardTemplates';
import axios from 'axios';


const RRToolsTab = (props) => {
  const [activeTabKey, setactiveTabKey] = useState(0)
  const [error, seterror] = useState("")
    // Toggle currently active tab
  function handleTabClick(event, tabIndex){
      setactiveTabKey(tabIndex);
    };

  function getDLRNData(){
    const d = {'commit_hash': ' ', 'distro_hash': '37d256eb4437fa15aec5d8d76957c2d220a06712', 'extended_hash': '', 'success': 'True'}
    axios
    .get("https://trunk.rdoproject.org/api-centos9-wallaby/api/repo_status", d)
    .then(res => console.log(res))
    .catch(err => seterror(err))
  }

  return (
      <CardBasic title={error}>
      <Tabs activeKey={activeTabKey} onSelect={handleTabClick}
            aria-label="Tabs in the icons and text example">

        <Tab eventKey={0} title={
            <>
              <TabTitleIcon><UsersIcon /></TabTitleIcon>{' '}
              <TabTitleText>Launchpad</TabTitleText>{' '}
            </>
          }>
          Users <Button onClick={getDLRNData}>DLRN</Button>
        </Tab>
        <Tab eventKey={1} title={
            <>
              <TabTitleIcon><BoxIcon /></TabTitleIcon>{' '}
              <TabTitleText>Bugzilla</TabTitleText>{' '}
            </>
          }>
          Containers
        </Tab>
        <Tab eventKey={2} title={
            <>
              <TabTitleIcon><DatabaseIcon /></TabTitleIcon>{' '}
              <TabTitleText>Skiplist</TabTitleText>{' '}
            </>
          }>
          Database
        </Tab>
        <Tab eventKey={3} title={
            <>
              <TabTitleIcon><ServerIcon /></TabTitleIcon>{' '}
              <TabTitleText>Mirrors</TabTitleText>{' '}
            </>
          }>
          Server
        </Tab>
        <Tab eventKey={4} title={
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

export default RRToolsTab;