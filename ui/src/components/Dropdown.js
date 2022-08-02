import React, { useState, useEffect } from 'react';
import { Button, Dropdown, DropdownToggle, DropdownItem} from '@patternfly/react-core';
import { CardBasic } from './CardTemplates';
import axios from 'axios';
import { Toolbar, ToolbarItem, ToolbarContent } from '@patternfly/react-core';

import { useSelector, useDispatch } from 'react-redux';
import allActions from '../Actions';


export const DropdownBasic  = (props) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [dropdownTitle, setDropdownTitle] = React.useState(props.title);
  const releases = props.release;

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
      title={props.id}
      onChange={e =>onSelect(e)}
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


export const ReleaseToolbar = (props) => {

  const relDistro = useSelector((state)=> state.release)
  const [releaseList, setReleaseList] = useState([])
  const [distroList, setDistroList] = useState([])
  const [error, setError] = useState("")
  const [release, setRelease] = useState(relDistro.release || " ")
  const [distro, setDistro] = useState(relDistro.distro || " ")
  const [isOpen, setIsOpen] = React.useState(false);
  const [isOpenDistro, setIsOpenDistro] = React.useState(false);

  const dispath = useDispatch()

  useEffect(() => {
    axios
    .get('http://localhost:8000/api/releases/')
    .then(response => {
      setReleaseList(response.data)
    });
  }, [release])

  const changeState = (e) =>{
    setRelease(e.target.text)
    dispath(allActions.setRelease(e.target.text))
    setIsOpen(!isOpen)
    axios
    .get('http://localhost:8000/api/releases/',
          {params: {"release":  e.target.text }})
    .then(response => {
      setDistroList(response.data)
    })
    .catch(err => setError(err));
  }


  const onToggle = (isOpen) => {
    setIsOpen(isOpen);
  };

  const onToggleD = (isOpen) => {
    setIsOpenDistro(isOpen);
  };

  const onFocus = () => {
    const element = document.getElementById('toggle-basic');
    element.focus();
  };

  const onChangeDistro = (e) => {
    setDistro(e.target.text)
    dispath(allActions.setDistro(distro))
    setIsOpenDistro(false);
    onFocus();
  };

  const dropdownReleaseItems = Array.isArray(releaseList) && releaseList.map(item => {
      return <DropdownItem key={item}>{item}</DropdownItem>});

  const dropdownDistroItems = Array.isArray(distroList) && distroList.map(item => {
    return <DropdownItem key={item}>{item}</DropdownItem>
  })

  return (
      <Toolbar id="toolbar-items">
        <ToolbarContent>
          <ToolbarItem>Release</ToolbarItem>
        <ToolbarItem>
          <Dropdown
            title="release"
            isOpen={isOpen}
            onSelect={(e) => changeState(e)}
            toggle={
                      <DropdownToggle id="toggle-basic" onToggle={onToggle}>
                        {release? release: "Select Release"}
                      </DropdownToggle>
                    }
            dropdownItems={dropdownReleaseItems}
          />
        </ToolbarItem>
        <ToolbarItem variant="separator" />
        <ToolbarItem>Distro</ToolbarItem>
        <ToolbarItem>
          <Dropdown
            title="distro"
            isOpen={isOpenDistro}
            onSelect={e => onChangeDistro(e)}
            toggle={
                      <DropdownToggle id="toggle-basic" onToggle={onToggleD}>
                        {distro? distro: "Select Distro"}
                      </DropdownToggle>
                    }
            dropdownItems={dropdownDistroItems}
          />
        </ToolbarItem>
        <ToolbarItem variant="separator" />
        <Button onClick={props.buttonOnClick}> {props.buttonTitle} </Button>
      </ToolbarContent>
      </Toolbar>
  );
}
