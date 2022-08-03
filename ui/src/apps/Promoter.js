// import Component from the react module
import React, { Component, useState, useEffect } from "react";
import axios from 'axios';
import { Alert, ExpandableSection, 
         FlexItem, Grid, GridItem, Label, Flex, 
         Toolbar, ToolbarItem, ToolbarContent, ClipboardCopy, 
         ClipboardCopyVariant } from "@patternfly/react-core";
import { CardBasic } from "../components/CardTemplates";
import BasicSpinner from "../components/Spinner";

import { TableComposable, Caption, Thead, Tr, Th, Tbody, Td, OuterScrollContainer, InnerScrollContainer} from '@patternfly/react-table';
import { ReleaseToolbar } from "../components/Dropdown";
import { List, ListItem, ListComponent, OrderType } from '@patternfly/react-core';
import ListIcon from '@patternfly/react-icons/dist/esm/icons/list-icon';
import BuildICon from '@patternfly/react-icons/dist/esm/icons/build-icon';

import { useSelector, useDispatch } from 'react-redux';
import { EmptyStateRow } from "../components/Table";
import { AboutModalBasic } from "../components/Modal";


export const Promoter = props => {

    const relDistro = useSelector((state)=> state.release)

    const [data, setData] = useState([])
    const distro = relDistro.distro
    const release = relDistro.release
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(true)
    const [isExpanded, setIsExpanded] = useState(false)
    const [activeItem, setActiveItem] = useState(0)
    const [info, setInfo] = useState("")

    console.log(release)
    useEffect(() => {
      getHashes()
    }, [release, distro])

    async function getHashes(){
        try{
            setInfo("Loading hashes")
            const resp = await axios
            .get(`http://localhost:8000/api/promotions/?release=${release}&distro=${distro}`)
            setData(resp.data)
            setLoading(false)
            setError("")
            setInfo("")
        }
        catch(err){
            setError(err.response)
        }
    }

    function onToggle(isExpanded, itemId){
        setIsExpanded(!isExpanded)
        if (activeItem === itemId){
            setActiveItem('')
        }
        else{
            setActiveItem(itemId)
        }
    }

    async function PromoteHash(){
        try{
            setInfo("Promoting Hash")
            console.log("Promote hash Called")
            // const resp = await axios
            // .get(`http://localhost:8000/api/promotions/?release=${release}&distro=${distro}`)
            // setData(resp.data)
            // setLoading(false)
            // setError("")
            // setInfo("")
        }catch(error){
            setError(error.response)
        }
    }

    const PromoteToolbar = (props) => {
        const ProjecText = props.missing_jobs.map(key => {
        return `
        - ${key}:
            vars:
              force_periodic: true
              featureset_override: 
                dlrn_hash_tag: ${props.hash}
        `}).join(' ')
        
        return <div>
            <Toolbar id='promoter-toolbar'>
                <ToolbarContent>
                    <ToolbarItem>Missing Jobs</ToolbarItem>
                    <ToolbarItem variant="separator"/>
                    {/* <ToolbarItem></ToolbarItem>
                    <ToolbarItem variant="separator"/> */}
                    <ToolbarItem>
                    <ClipboardCopy isCode hoverTip="Copy" clickTip="Copied" variant={ClipboardCopyVariant.expansion}>
                    {`- project:
    check:
     jobs:
                            ${ProjecText.toString()}
                    `}
                    </ClipboardCopy>
                    </ToolbarItem>
                </ToolbarContent>
            </Toolbar>
        </div>
    }

    const JobList = (props) => {
        return <div>
                <CardBasic header={<PromoteToolbar missing_jobs={props.missing_jobs} hash={props.hash}/>}>
                    <List component={ListComponent.ol} type={OrderType.number}>
                        {props.missing_jobs.length !== 0 ? props.missing_jobs.map(item => (
                            <ListItem key={item}>{item}</ListItem>
                        )): "No jobs ran"}
                    </List>
                </CardBasic>
            </div>
    }

    const ExpandSection = (props) => {
        const columnNames = {
            aggregate_hash: 'Aggregate Hash',
            commit_hash: 'Commit Hash',
            distro_hash: 'Distro hash',
            extended_hash: 'Extended Hash',
            full_hash: 'Full Hash',
            passed_jobs: 'Passed Jobs',
            component: 'Component',
            timestamp: 'Timestamp'
        };
        return data && Object.entries(data).map((value, key) => {
            const itemId = key

            return <ExpandableSection
                toggleText={
                    <div>
                        <Flex>
                            <FlexItem>
                                <Label icon={<ListIcon />} variant='outline' color="blue">
                                    {value[1].hash_list.length < 10 ? "0" + value[1].hash_list.length: value[1].hash_list.length}
                                </Label>
                            </FlexItem>
                            <FlexItem>
                                <Label icon={<BuildICon />}
                                    variant={value[1].missing_jobs.length <= 5 ? '': 'outline'}
                                    color={value[1].missing_jobs.length > 0 && value[1].missing_jobs.length <= 5 ? "green": "blue"}>
                                    {value[1].missing_jobs.length < 10 ? "0" + value[1].missing_jobs.length: value[1].missing_jobs.length}
                                </Label>
                            </FlexItem>
                            <FlexItem align={{ default: "alignRight"}}>
                                {value[0].toUpperCase()}
                            </FlexItem>
                        </Flex>
                    </div>}
                onToggle={() => onToggle(isExpanded, itemId)}
                isExpanded={activeItem === itemId}
                displaySize='large'
                itemID={itemId}
                key={itemId}
                >

                <Grid hasGutter>
                    <GridItem span={5}>
                        <JobList missing_jobs={value[1].missing_jobs} hash={value[0]}/>
                    </GridItem>
                    <GridItem span={7}>
                        <OuterScrollContainer>
                            <InnerScrollContainer>
                            <TableComposable aria-label="Expandable table" variant='compact'>
                                <Caption>
                                   <Toolbar id='promoter-toolbar'>
                                        <ToolbarContent>
                                            <ToolbarItem>Promotion Hashes</ToolbarItem>
                                            <ToolbarItem variant="separator"/>
                                            <ToolbarItem>
                                                <AboutModalBasic  
                                                    isDisabled={value[1].missing_jobs.length <= 5 ? false : true}
                                                    buttonText={"Promote hash"}
                                                    headLine={"Promote Hash"}
                                                    promoteMethod={PromoteHash}
                                                    promotionHash={value[1].hash_list}/>
                                            </ToolbarItem>
                                        </ToolbarContent>
                                    </Toolbar>
                                </Caption>
                                <Thead>
                                    <Tr>
                                    <Th>{columnNames.component}</Th>
                                    <Th>{columnNames.commit_hash}</Th>
                                    <Th>{columnNames.distro_hash}</Th>
                                    <Th>{columnNames.timestamp}</Th>
                                    </Tr>
                                </Thead>
                                <Tbody >
                                    {value[1].hash_list.length > 0 ? Object.values(value[1].hash_list).map((hash, index) => {
                                        return <Tr key={index}>
                                        <Td>{hash.component}</Td>
                                        <Td>{hash.commit_hash}</Td>
                                        <Td>{hash.distro_hash}</Td>
                                        <Td>{hash.timestamp}</Td>

                                        {/* <Td>{hash.extended_hash || "-"}</Td> */}
                                        </Tr>
                                    }) : EmptyStateRow}
                                </Tbody>
                            </TableComposable>
                            </InnerScrollContainer>
                        </OuterScrollContainer>
                        </GridItem>
                </Grid>
            </ExpandableSection>
        })
    }

    return (
        <div>
            {info !== "" ? <Alert variant="info" title="Loading hashes"/>: " "}
            <ReleaseToolbar buttonOnClick={getHashes}
                buttonTitle="Get Promotions"/>{' '}
            {error ? <Alert variant="danger" title={error.message}/> : ""} {' '}
            {loading ? <BasicSpinner/>: data ? <ExpandSection/> : "" }
        </div>
    )
}


export default Promoter;
