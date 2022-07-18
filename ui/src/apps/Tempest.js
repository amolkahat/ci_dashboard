// import Component from the react module
import { Alert, Button, InputGroup, TextInput } from "@patternfly/react-core";
import React, { Component, useEffect, useState } from "react";
import DisclosureExpandableSection from "../components/ExpandSection";
import { Panel, PanelFooter, PanelHeader, PanelMain, PanelMainBody } from '@patternfly/react-core';
import axios from "axios";
import BasicPanel from "../components/Panel";
import JobExpandableSection from "../components/ExpandSection";
import { CardBasic } from "../components/CardTemplates";
import {TempestTabs} from "../components/Tabs";
import { Tabs, Tab, TabTitleText, TabTitleIcon} from '@patternfly/react-core';

import UsersIcon from '@patternfly/react-icons/dist/esm/icons/users-icon';
import BoxIcon from '@patternfly/react-icons/dist/esm/icons/box-icon';
import DatabaseIcon from '@patternfly/react-icons/dist/esm/icons/database-icon';
import ServerIcon from '@patternfly/react-icons/dist/esm/icons/server-icon';
import LaptopIcon from '@patternfly/react-icons/dist/esm/icons/laptop-icon';
import ProjectDiagramIcon from '@patternfly/react-icons/dist/esm/icons/project-diagram-icon';
import validator from 'validator';

export const TempestSkip = (props) =>{
    const [api, setapi] = useState({job_url: "", job_name: "", job_tests: ""})
    const [job_url, setjob_url] = useState("")
    const [error, seterror] = useState({'message': "Invalid Input"})
    const [loading, setloading] = useState(false)
    const [testcase, settestcase] = useState("")
    const [activeTabKey, setactiveTabKey] = useState(1)
    function handleTabClick(event, tabIndex){
        setactiveTabKey(tabIndex);
      };

    function addJob(item){
        const item_dict = {job_url: '', job_domain: '', job_name: ''}
        if (validator.isURL(item)){
         if (item.includes("rdoproject")){
            item_dict.job_domain = "rdoproject"
         }
         else if (item.includes("opendev.org")){
             item_dict.job_domain = "opendev"
         }
         item_dict.job_name = job_url.split("?job_name=")[1]
         item_dict.job_url = job_url
        }
        axios.post("http://localhost:8000/api/jobs/", item_dict)
        .then(res => refreshList())
        .catch(err => setTimeout(seterror({error: err}), 2000))
    }

    useEffect(()=> {
        refreshList()
    }, []);

    function refreshList(){
        axios
        .get("http://localhost:8000/api/jobs/")
        .then(res => {
            setloading(true)
            seterror("")
            console.log("Refresh list: ", res)
            setapi(res.data)
        })
        .catch(err => seterror({error: err}));
    };

    function onSetJobUrl(event){
        setjob_url(event)
    }
    function setTestCase(event){
        settestcase(event)
    }

    function searchTestCase(event){
        console.log("Searching testcase..", event)
    }

    const SearchTest = () => (
            <InputGroup>
            <TextInput id="testcase"
                        type="text"
                        key="testcase"
                        value={testcase}
                        onChange={setTestCase}
                        aria-label="ZuuTruel job name"
                        tabIndex={1}

                        />
            <Button id="zuul_job_button"
                    onClick={()=>searchTestCase(testcase)}
                    tabIndex={2}
                    >Search Testcase</Button>
        </InputGroup>
    );
    const ShowTestResult = () => (
            <>Test Results</>
    )

    const AddJobInput = () => (
        <InputGroup>
            <TextInput id="zuul_job"
                        type="text"
                        key="Zuul_job"
                        value={job_url}
                        onChange={(e) => setjob_url(e)}
                        aria-label="ZuuTruel job name"
                        tabIndex={1}/>
            <Button id="zuul_job_button"
                    onClick={()=>addJob(job_url)}
                    tabIndex={2}
                    >Add Job</Button>
        </InputGroup>);

    const ShowJobResults = () => (
        <>
        {api.job_name !== "" && Object.values(api).map((i, v) => (
                <JobExpandableSection key={i.id} dict={i}>{console.log(i, v)}</JobExpandableSection>
        ))  || <h1>"No jobs to display"</h1>}
        </>

    )

    const ShowError = () => {
        error &&
            <Alert variant="danger" title={error.message}/>
    }
    return (
        <div>
            <Panel>
                <PanelHeader>
                    <ShowError/>
                </PanelHeader>
                <PanelMain>
                    <PanelMainBody>
                    <CardBasic>
                    <Tabs activeKey={activeTabKey} onSelect={handleTabClick}
                            aria-label="Tabs in the icons and text example">
                        <Tab eventKey={1} title={
                            <>
                            <TabTitleIcon><DatabaseIcon /></TabTitleIcon>{' '}
                            <TabTitleText>Search Test</TabTitleText>{' '}
                            </>
                        }>
                            <CardBasic>
                              <SearchTest></SearchTest>
                              <ShowTestResult/>
                            </CardBasic>

                        </Tab>
                        <Tab eventKey={2} title={
                            <>
                            <TabTitleIcon><BoxIcon /></TabTitleIcon>{' '}
                            <TabTitleText>Add Job</TabTitleText>{' '}
                            </>
                        }>
                            <CardBasic>
                                <AddJobInput></AddJobInput>
                                <ShowJobResults></ShowJobResults>
                            </CardBasic>
                        </Tab>
                    </Tabs>
                    </CardBasic>
                    </PanelMainBody>
                </PanelMain>
                <PanelFooter>
                </PanelFooter>
            </Panel>
        </div>
    )
}

export default TempestSkip;
