// import Component from the react module
import React, { Component, useState } from "react";
import axios from 'axios';
import { Button } from "@patternfly/react-core";
import { ComposableTableExpandable } from "../components/Table";
import { CardBasic } from "../components/CardTemplates";


class Promoter extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            data: [],
            distro: 'centos9',
            release: 'master',
            error: ''
        }
        this.url = "https://trunk.rdoproject.org/api-centos9-master-uc/api/promotions"

    }
    componentDidMount(){
        this.requestDLRN()
    }
    
    requestDLRN = (url, params)=>{
        axios
        .get("https://cors-anywhere.herokuapp.com/" + this.url, {params: params})
        .then(res => this.setState({data: res.data}))
        .catch(err => this.setState({error: err}))
    }

    render(){
        const jobs_params = {'commit_hash': '', 'distro_hash': '', 'extended_hash': '', 'success': 'True', 'promote_name': 'tripleo-ci-testing'}
        const promotion_params = {'aggregate_hash': '',
        'commit_hash': '',
        'component': '',
        'distro_hash': '',
        'extended_hash': '',
        'limit': '',
        'offset': '',
        'promote_name': 'tripleo-ci-testing'}
        return (
            <CardBasic>
                {console.log(this.state.data)}
                <ComposableTableExpandable data={this.state.data}/>
            </CardBasic>
        )
    }
}


export default Promoter;