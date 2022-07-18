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
import { ReleaseDistroDropdown } from './Dropdown';
import BasicSpinner from './Spinner';


const RRToolsTab = (props) => {
  const [activeTabKey, setactiveTabKey] = useState(0)
  const [error, seterror] = useState("")
  const [launchpad, setlaunchpad] = useState([])
  const [mirrors, setMirrors] = useState([])
  const [release, setRelease] = useState("master")
  const [distro, setDistro] = useState("centos9")
  const [loading, setLoading] = useState(true)
    // Toggle currently active tab
  function handleTabClick(event, tabIndex){
      setactiveTabKey(tabIndex);
    };

  useEffect(() => {
    getLaunchpadBugs()
    fetchMirrors()
  }, [])

  function getLaunchpadBugs(){
    axios
    .get("http://localhost:8000/api/launchpad/")
    .then(res => setlaunchpad(res.data))
    .catch(err => seterror(err))
  }

  function fetchMirrors(){
    seterror('')
    axios
    .get(`http://localhost:8000/api/mirrors/?release=${release}&distro=${distro}`)
    .then(res => {
      setMirrors(res.data)
      setLoading(false)
    })
    .catch(err => seterror(err.response.data))
  }

  const MirrorTable = (props) => {
      return <TableComposable 
                aria-label='Mirrors Table'
                variant='compact'
              >
          <Caption> Mirrors Table </Caption>
            <Thead>
              <Tr>
                <Th>Mirror Name</Th>
                <Th>Mirror Status</Th>
                <Th>Release</Th>
                <Th>Distro</Th>
              </Tr>
            </Thead>
          <Tbody>
            {mirrors.map(item => (
              <Tr key={item.name}>
                <Td dataLabel="Mirror Name">{item.name}</Td>
                <Td dataLabel="Mirror Status">{item.status}</Td>
                <Td dataLabel="Release">{item.release}</Td>
                <Td dataLabel="Distro">{item.distro}</Td>
              </Tr>
            ))}
          </Tbody>
          </TableComposable>
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
          } >
            <ReleaseDistroDropdown buttonOnClick={fetchMirrors}
                                   release={release}
                                   distro={distro}
                                   setRelease={setRelease} 
                                   setDistro={setDistro}
                                   buttonTitle="Get Mirrors"/>
             {error ? <Alert variant='danger' title={error}/> :  loading ? <BasicSpinner/>: <MirrorTable/>}
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
