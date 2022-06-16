// import Component from the react module
import React, { Component } from "react";
import axios from 'axios';
import { ComposableTableStriped } from "../components/Table";
import BasicPanel from "../components/Panel";
import IconAndTextTabs from "../components/Tabs";


class Mirrors extends Component{
    constructor(props){
        super(props)
        this.state = {
            mirrors_list: []
        }
    }

    render(){
        return (
            <BasicPanel>
            </BasicPanel>
        )
    }
}


export default Mirrors;