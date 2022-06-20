
import React from 'react';
import {
  Card,
  CardHeader,
  CardActions,
  CardTitle,
  CardBody,
  CardFooter,
  CardExpandableContent,
  Checkbox,
  Dropdown,
  DropdownItem,
  DropdownSeparator,
  KebabToggle
} from '@patternfly/react-core';


export const CardBasic = (props) => (
  <Card>
    { props.header && <CardTitle>{props.header}</CardTitle>}
    <CardBody>{props.children}</CardBody>
    { props.footer && <CardFooter>{props.footer}</CardFooter>}
  </Card>
);


export const CardExpandable = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isChecked, setIsChecked] = React.useState(false);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [isToggleRightAligned, setIsToggleRightAligned] = React.useState(false);

  const onSelect = () => {
    setIsOpen(!isOpen);
  };

  const onClick = (checked) => {
    setIsChecked(checked);
  };

  const onExpand = (event, id) => {
    // eslint-disable-next-line no-console
    console.log(id);
    setIsExpanded(!isExpanded);
  };

  const onRightAlign = () => {
    setIsToggleRightAligned(!isToggleRightAligned);
  };

  const dropdownItems = [
    <DropdownItem key="link">Link</DropdownItem>,
    <DropdownItem key="action" component="button">
      Action
    </DropdownItem>,
    <DropdownItem key="disabled link" isDisabled>
      Disabled Link
    </DropdownItem>,
    <DropdownItem key="disabled action" isDisabled component="button">
      Disabled Action
    </DropdownItem>,
    <DropdownSeparator key="separator" />,
    <DropdownItem key="separated link">Separated Link</DropdownItem>,
    <DropdownItem key="separated action" component="button">
      Separated Action
    </DropdownItem>
  ];

  return (
    <React.Fragment>
      <div style={{ marginBottom: '12px' }}>
        <Checkbox
          id={'isToggleRightAligned-1'}
          key={'isToggleRightAligned'}
          label={'isToggleRightAligned'}
          isChecked={isToggleRightAligned}
          onChange={onRightAlign}
        />
      </div>
      <Card id="expandable-card" isExpanded={isExpanded}>
        <CardHeader
          onExpand={onExpand}
          isToggleRightAligned={isToggleRightAligned}
          toggleButtonProps={{
            id: 'toggle-button1',
            'aria-label': 'Details',
            'aria-labelledby': 'expandable-card-title toggle-button1',
            'aria-expanded': isExpanded
          }}
        >
          <CardActions>
            <Dropdown
              onSelect={onSelect}
              toggle={<KebabToggle onToggle={setIsOpen} />}
              isOpen={isOpen}
              isPlain
              dropdownItems={dropdownItems}
              position={'right'}
            />
            <Checkbox
              isChecked={isChecked}
              onChange={onClick}
              aria-label="card checkbox example"
              id="check-4"
              name="check4"
            />
          </CardActions>
          <CardTitle id="expandable-card-title">Header</CardTitle>
        </CardHeader>
        <CardExpandableContent>
          <CardBody>Body</CardBody>
          <CardFooter>Footer</CardFooter>
        </CardExpandableContent>
      </Card>
    </React.Fragment>
  );
};

export const CardSelectableA11yHighlight = () => {
  const [selected, setSelected] = React.useState('');

  const onKeyDown = (event) => {
    if (event.target !== event.currentTarget) {
      return;
    }
    if ([' ', 'Enter'].includes(event.key)) {
      event.preventDefault();
      const newSelected = event.currentTarget.id === selected ? null : event.currentTarget.id;
      setSelected(newSelected);
    }
  };

  const onClick = (event) => {
    const newSelected = event.currentTarget.id === selected ? null : event.currentTarget.id;
    setSelected(newSelected);
  };

  const onChange = (labelledById, _event) => {
    const newSelected = labelledById === selected ? null : labelledById;
    setSelected(newSelected);
  };

  return (
    <React.Fragment>
      <Card
        id="selectable-first-card"
        onKeyDown={onKeyDown}
        onClick={onClick}
        hasSelectableInput
        onSelectableInputChange={onChange}
        isSelectableRaised
        isSelected={selected === 'selectable-first-card'}
      >
        <CardTitle>Selectable card with proper accessibility considerations</CardTitle>
        <CardBody>
          When using a screen reader a checkbox will become navigable that indicates this card is selectable and
          communicate if it is currently selected.
        </CardBody>
      </Card>
      <br />
      <Card
        id="selectable-second-card"
        onKeyDown={onKeyDown}
        onClick={onClick}
        isSelectableRaised
        isSelected={selected === 'selectable-second-card'}
      >
        <CardTitle>Selectable card without proper accessibility considerations</CardTitle>
        <CardBody>
          When using a screen reader there are no indications that this card is selectable or if it is currently
          selected.
        </CardBody>
      </Card>
    </React.Fragment>
  );
};


export const CardSelectable = () => {
  const [selected, setSelected] = React.useState('');
  const [isKebabOpen, setIsKebabOpen] = React.useState(false);

  const onKeyDown = (event) => {
    if (event.target !== event.currentTarget) {
      return;
    }
    if ([' ', 'Enter'].includes(event.key)) {
      event.preventDefault();
      const newSelected = event.currentTarget.id === selected ? null : event.currentTarget.id;
      setSelected(newSelected);
    }
  };

  const onClick = (event) => {
    const newSelected = event.currentTarget.id === selected ? null : event.currentTarget.id;
    setSelected(newSelected);
  };

  const onChange = (labelledById, _event) => {
    const newSelected = labelledById === selected ? null : labelledById;
    setSelected(newSelected);
  };

  const onToggle = (isOpen, event) => {
    event.stopPropagation();
    setIsKebabOpen(isOpen);
  };

  const onSelect = (event) => {
    event.stopPropagation();
    setIsKebabOpen(false);
  };

  const dropdownItems = [
    <DropdownItem key="link">Link</DropdownItem>,
    <DropdownItem key="action" component="button">
      Action
    </DropdownItem>,
    <DropdownItem key="disabled link" isDisabled>
      Disabled Link
    </DropdownItem>,
    <DropdownItem key="disabled action" isDisabled component="button">
      Disabled Action
    </DropdownItem>,
    <DropdownSeparator key="separator" />,
    <DropdownItem key="separated link">Separated Link</DropdownItem>,
    <DropdownItem key="separated action" component="button">
      Separated Action
    </DropdownItem>
  ];

  return (
    <React.Fragment>
      <Card
        id="selectable-first-card"
        onKeyDown={onKeyDown}
        onClick={onClick}
        hasSelectableInput
        onSelectableInputChange={onChange}
        isSelectableRaised
        isSelected={selected === 'selectable-first-card'}
      >
        <CardHeader>
          <CardActions>
            <Dropdown
              onSelect={onSelect}
              toggle={<KebabToggle onToggle={onToggle} />}
              isOpen={isKebabOpen}
              isPlain
              dropdownItems={dropdownItems}
              position={'right'}
            />
          </CardActions>
        </CardHeader>
        <CardTitle>First card</CardTitle>
        <CardBody>This is a selectable card. Click me to select me. Click again to deselect me.</CardBody>
      </Card>
      <br />
      <Card
        id="selectable-second-card"
        onKeyDown={onKeyDown}
        onClick={onClick}
        hasSelectableInput
        onSelectableInputChange={onChange}
        isSelectableRaised
        isSelected={selected === 'selectable-second-card'}
      >
        <CardTitle>Second card</CardTitle>
        <CardBody>This is a selectable card. Click me to select me. Click again to deselect me.</CardBody>
      </Card>
      <br />
      <Card id="selectable-third-card" isSelectableRaised isDisabledRaised hasSelectableInput>
        <CardTitle>Third card</CardTitle>
        <CardBody>This is a raised but disabled card.</CardBody>
      </Card>
    </React.Fragment>
  );
};
