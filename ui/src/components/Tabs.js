import React, { useState, useEffect } from 'react';
import { Tabs, Tab, TabTitleText, TabTitleIcon, Alert } from '@patternfly/react-core';
import UsersIcon from '@patternfly/react-icons/dist/esm/icons/users-icon';
import BoxIcon from '@patternfly/react-icons/dist/esm/icons/box-icon';
import DatabaseIcon from '@patternfly/react-icons/dist/esm/icons/database-icon';
import ServerIcon from '@patternfly/react-icons/dist/esm/icons/server-icon';
import LaptopIcon from '@patternfly/react-icons/dist/esm/icons/laptop-icon';
import ProjectDiagramIcon from '@patternfly/react-icons/dist/esm/icons/project-diagram-icon';
import { CardBasic } from './CardTemplates';
import {LaunchpadTableStriped} from './Table';
import axios from 'axios';
import { Caption, TableComposable, Tbody, Thead, Tr, Th, Td } from '@patternfly/react-table';
import { ReleaseToolbar } from './Dropdown';
import BasicSpinner from './Spinner';
import ReviewList from '../apps/ReviewList';
import { useSelector, useDispatch } from 'react-redux';
import MirrorTable from './Mirrors';



const RRToolsTab = (props) => {
  const [activeTabKey, setactiveTabKey] = useState(1)
  const [error, seterror] = useState("")
  const [launchpad, setlaunchpad] = useState([])
  const [loading, setLoading] = useState(true)

  function handleTabClick(event, tabIndex){
      setactiveTabKey(tabIndex);
    };

  useEffect(() => {
    getLaunchpadBugs()
  }, [])

  function getLaunchpadBugs(){
    axios
    .get("http://localhost:8000/api/launchpad/")
    .then(res => setlaunchpad(res.data))
    .catch(err => seterror(err))
    setLoading(false)
  }

  return (
      <CardBasic header={error.message ? <Alert variant='danger' title={error.message}/>: ""}>
      <Tabs activeKey={activeTabKey} onSelect={handleTabClick}
            aria-label="Tabs in the icons and text example">

        <Tab eventKey={1} title={
            <>
              <TabTitleIcon><UsersIcon /></TabTitleIcon>{' '}
              <TabTitleText>Launchpad</TabTitleText>{' '}
            </>
          } >
          {error ? <Alert variant='danger' title={error.message}/> :  loading ? <BasicSpinner/>: <LaunchpadTableStriped repos={launchpad} title="Launchpad Bugs"/>}
        </Tab>
        <Tab eventKey={2} title={
            <>
              <TabTitleIcon><BoxIcon /></TabTitleIcon>{' '}
              <TabTitleText>Review List</TabTitleText>{' '}
            </>
          } >
          <ReviewList/>
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
          } >
            <MirrorTable/>
        </Tab>
        <Tab eventKey={5} title={
            <>
              <TabTitleIcon><LaptopIcon /></TabTitleIcon>{' '}
              <TabTitleText>System</TabTitleText>{' '}
            </>
          } isDisabled>
          System
        </Tab>
        <Tab eventKey={6} title={
            <>
              <TabTitleIcon><ProjectDiagramIcon /></TabTitleIcon>{' '}
              <TabTitleText>Network</TabTitleText>{' '}
            </>
          } isDisabled>
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
