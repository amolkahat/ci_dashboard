import React, { useState } from 'react';
import { OptionsMenu, OptionsMenuItem, OptionsMenuToggle } from '@patternfly/react-core';

const SingleOption = (props) => {

    const [isOpen, setisOpen] = useState(false)
    const [toggleTemplateText, settoggleTemplateText] = useState("Jobs")
    const [selectedOption, setselectedOption] = useState("master")

    const onToggle = () => {
          setisOpen(!isOpen);
    };

    const onSelect = event => {
        const id = event.currentTarget.id;
        console.log(id)
        setselectedOption(id)
        settoggleTemplateText(id)
    }

    const menuItems = [
      <OptionsMenuItem onSelect={onSelect} isSelected={selectedOption === "singleOption1"} id="singleOption1" key="option 1">Option 1</OptionsMenuItem>,
      <OptionsMenuItem onSelect={onSelect} isSelected={selectedOption === "singleOption2"} id="singleOption2" key="option 2">Option 2</OptionsMenuItem>,
      <OptionsMenuItem onSelect={onSelect} isSelected={selectedOption === "singleOption3"} id="singleOption3" key="option 3">Option 3</OptionsMenuItem>
    ];
    const toggle = <OptionsMenuToggle onToggle={onToggle} toggleTemplate={toggleTemplateText} />

    return (
      <OptionsMenu
        id="options-menu-single-option-example"
        menuItems={menuItems}
        isOpen={isOpen}
        toggle={toggle}/>
    );
}

export default SingleOption;
