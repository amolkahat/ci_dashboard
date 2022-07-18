import React, { useState, useEffect } from 'react';
import { Button, Dropdown, DropdownToggle, DropdownItem} from '@patternfly/react-core';
import { CardBasic } from './CardTemplates';
import axios from 'axios';


export const DropdownBasic  = (props) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [dropdownTitle, setDropdownTitle] = React.useState(props.title);
  const releases = props.release || ['master'];

  const onToggle = (isOpen) => {
    setIsOpen(isOpen);
  };

  const onFocus = () => {
    const element = document.getElementById('toggle-basic');
    element.focus();
  };

  const onSelect = (e) => {
    setDropdownTitle(e.target.text)
    props.setRelease(e.target.text)
    setIsOpen(false);
    onFocus();
  };

  const dropdownItems = Array.isArray(releases) && releases.map(item => {
      return <DropdownItem key={item}>
      {item}
    </DropdownItem>});

  return (
    <Dropdown
      onSelect={e =>onSelect(e)}
      toggle={
        <DropdownToggle id="toggle-basic" onToggle={onToggle}>
          {dropdownTitle}
        </DropdownToggle>
      }
      isOpen={isOpen}
      dropdownItems={dropdownItems}
    />
  );
};


export class ReleaseDistroDropdown extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      releaseList: [],
      releaseData: {},
      distroList: [],
      error: "",
      release: this.props.release
    }

  }

  componentDidMount(){
    this.getRelease()
  }

  getRelease = () => {
    const releaseList = []
    axios
    .get("http://localhost:8000/api/releases/")
    .then(res => {
       Object.keys(res.data).map((key, i) => {
            releaseList.push(key)
       })
       this.setState({releaseData: res.data, releaseList: releaseList})
    })
    .catch(err=>this.setState({error: err}))
    console.log("RElease List", this.state.releaseList)
  }

  render(){
    return (
      <CardBasic header="Select Mirrors ">
        <DropdownBasic release={this.state.releaseList} 
                        title='Select Release'
                        setRelease={this.props.setRelease}>
        </DropdownBasic> {' '}{console.log(this.state.releaseData[this.state.release])}
        <DropdownBasic release={this.state.releaseData[this.state.release]}
                        title='Select Distro'
                        setRelease={this.props.setDistro}
                        //  onSelect={() => fetchMirrors}
                        >
        </DropdownBasic> {' '}
        <Button onClick={this.props.buttonOnClick}> {this.props.buttonTitle} </Button>
      </CardBasic>
    )
  }
}