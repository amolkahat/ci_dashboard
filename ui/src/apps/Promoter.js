// import Component from the react module
import React, { Component, useState, useEffect } from "react";
import axios from 'axios';
import { Alert, ExpandableSection, FlexItem, Grid, GridItem, Label, Flex, TitleSizes } from "@patternfly/react-core";
import { CardBasic } from "../components/CardTemplates";
import BasicSpinner from "../components/Spinner";

import { TableComposable, Caption, Thead, Tr, Th, Tbody, Td} from '@patternfly/react-table';
import { ReleaseDistroDropdown } from "../components/Dropdown";
import { List, ListItem, ListComponent, OrderType } from '@patternfly/react-core';
import ListIcon from '@patternfly/react-icons/dist/esm/icons/list-icon';
import BuildICon from '@patternfly/react-icons/dist/esm/icons/build-icon';

import {
    Bullseye,
    EmptyState,
    EmptyStateVariant,
    EmptyStateIcon,
    Title,
    EmptyStateBody,
    Button
  } from '@patternfly/react-core';
  import SearchIcon from '@patternfly/react-icons/dist/esm/icons/search-icon';


export class Promoter extends React.Component {
    
    constructor(props){
        super(props)
        this.state = {
            data: [],
            distro: "centos9",
            release: "master",
            error: "",
            loading: true,
            isExpanded: false,
            activeItem: 0,
        }
    }

    componentDidMount(){
        this.getHashes()
    }

    // const [data, setData] = useState([])
    // const [distro, setDistro] = useState("centos9")
    // const [release, setRelease] = useState("master")
    // const [error, setError] = useState("")
    // const [loading, setLoading] = useState(true)
    // const [isExpanded, setisExpanded] = useState(false)
    // const [activeItem, setactiveItem] = useState(0)

    // useEffect(
    //   getHashes()
    // )
    
    getHashes = () => {
        axios
        .get(`http://localhost:8000/api/promotions/?release=${this.state.release}&distro=${this.state.distro}`)
        .then(res => {
            this.setState({
                data: res.data,
                loading: false,
                error: '',
            })
        })
        .catch(err => this.setState({error: err.response}))
    }

    onToggle = (isExpanded, itemId) => {
        this.setState({isExpanded: !isExpanded})
        if (this.state.activeItem === itemId){
            this.setState({activeItem: ''})
        }
        else{
            this.setState({activeItem: itemId})
        }
    }

    render(){

        const ExpandSection = (props) => {
            return this.state.data && Object.entries(this.state.data).map((value, key) => {
                const itemId = key
                const columnNames = {
                    aggregate_hash: 'Aggregate Hash',
                    commit_hash: 'Commit Hash',
                    distro_hash: 'Distro hash',
                    extended_hash: 'Extended Hash',
                    full_hash: 'Full Hash',
                    passed_jobs: 'Passed Jobs',
                    component: 'Component',
                };
                return <ExpandableSection
                    toggleText={
                        <div>
                            <Flex hasGutter>
                                <FlexItem>
                                    <Label icon={<ListIcon />} variant='outline' color="blue">  {value[1].hash_list.length} </Label>
                                </FlexItem>
                                <FlexItem>
                                    <Label icon={<BuildICon />} 
                                        variant={value[1].missing_jobs.length <= 5 ? '': 'outline'}
                                        color={value[1].missing_jobs.length <= 5 ? "green": "blue"}>
                                        {value[1].missing_jobs.length}
                                    </Label>
                                </FlexItem>
                                <FlexItem align={{ default: "alignRight"}}>{ value[0].toUpperCase()}</FlexItem>
                            </Flex>
                        </div>}
                    onToggle={() => this.onToggle(this.state.isExpanded, itemId)}
                    isExpanded={this.state.activeItem === itemId}
                    displaySize='large'
                    itemID={itemId}
                    >
                    <Grid hasGutter>
                        <GridItem>
                            <CardBasic>
                            <ExpandableSection toggleText="Missing jobs">
                            <List component={ListComponent.ol} type={OrderType.number}>
                                {value[1].missing_jobs.map(item => (
                                    <ListItem key={item}>{item}</ListItem>
                                ))}
                            </List>
                            </ExpandableSection>
                            </CardBasic>
                            <CardBasic>
                                <ExpandableSection toggleText="Component hashes">
                            <TableComposable aria-label="Expandable table" variant='compact'>
                                <Caption>Promotion Hashes</Caption>
                                <Thead>
                                    <Tr>
                                    <Th>{columnNames.component}</Th>
                                    <Th>{columnNames.commit_hash}</Th>
                                    <Th>{columnNames.distro_hash}</Th>
                                    <Th>{columnNames.extended_hash}</Th>
                                    </Tr>
                                </Thead>
                                <Tbody >
                                    {value[1].hash_list.length > 0 ? Object.values(value[1].hash_list).map((hash, index) => {
                                        return <Tr key={index}>
                                        <Td>{hash.component}</Td>
                                        <Td>{hash.commit_hash}</Td>
                                        <Td>{hash.distro_hash}</Td>
                                        <Td>{hash.extended_hash || "-"}</Td>
                                        </Tr>
                                    }) : <Tr>
                                    <Td colSpan={8}>
                                    <Bullseye>
                                        <EmptyState variant={EmptyStateVariant.small}>
                                        <EmptyStateIcon icon={SearchIcon} />
                                        <Title headingLevel="h2" size="lg">
                                            No results found
                                        </Title>
                                        <EmptyStateBody>Clear all filters and try again.</EmptyStateBody>
                                        <Button variant="link">Clear all filters</Button>
                                        </EmptyState>
                                    </Bullseye>
                                    </Td>
                                </Tr>}
                                </Tbody>
                            </TableComposable>
                            </ExpandableSection>
                            </CardBasic>
                        </GridItem>
                    </Grid>
                </ExpandableSection>
            })

        }

        return (
            <CardBasic>
                <ReleaseDistroDropdown buttonOnClick={this.getHashes}
                     release={this.state.release}
                     distro={this.state.distro}
                     setRelease={this.setRelease} 
                     setDistro={this.setDistro}
                     buttonTitle="Get Promotions"/>
                {' '}
                { this.state.loading ? <BasicSpinner/>: this.state.data ? <ExpandSection/> : "" }
                {this.state.error ? <Alert variant="danger" title={this.state.error}/> : ""}
    
            </CardBasic>
        )
    }
}


export default Promoter;
