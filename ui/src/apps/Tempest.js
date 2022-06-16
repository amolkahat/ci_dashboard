// import Component from the react module
import { Alert, Button, InputGroup, TextInput } from "@patternfly/react-core";
import React, { Component, useState } from "react";
import DisclosureExpandableSection from "../components/JobExpandSection";
import { Panel, PanelFooter, PanelHeader, PanelMain, PanelMainBody } from '@patternfly/react-core';
import axios from "axios";
import BasicPanel from "../components/Panel";
import JobExpandableSection from "../components/JobExpandSection";
import { CardBasic } from "../components/CardTemplates";
import SingleOption from "../components/OptionsComp";



const TempestSkip = (props) =>{
    const [api, setapi] = useState({job_url: "", job_name: "", job_tests: ""})
    const [job_url, setjob_url] = useState("")
    const [error, seterror] = useState({'message': "Invalid Input"})
    const [loading, setloading] = useState(false)

    function addJob(item){
        axios.post("http://localhost:8000/api/tools/", {'job_url': item})
        .then(res => refreshList())
        .catch(err => seterror({error: err}))
    }

    function refreshList(){
        axios
        .get("http://localhost:8000/api/tools/")
        .then(res => {
            setloading(true)
            seterror("")
            setapi(res.data)
        })
        .catch(err => seterror({error: err}));
    };

    function handleOnChange(event){
        setjob_url(event)
    }

    const AddJobInput = () => (
        <InputGroup>
            <TextInput id="zuul_job"
                        type="text"
                        key="Zuul_job"
                        value={job_url}
                        onChange={handleOnChange}
                        aria-label="ZuuTruel job name"
                        tabIndex={1}/>
            <Button id="zuul_job_button"
                    onClick={()=>addJob(job_url)}
                    tabIndex={2}
                    >Add Job</Button>
        </InputGroup>);

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
                        <AddJobInput/>
                        </CardBasic>
                        <CardBasic>
                            {Object.values(api).map((i, v) => (
                                <JobExpandableSection key={i.id} dict={i}>{console.log(i, v)}</JobExpandableSection>
                            ))}
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
