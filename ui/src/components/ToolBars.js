import React from 'react';
import {
  Button,
  ButtonVariant,
  KebabToggle,
  Select,
  SelectOption,
  SelectVariant,
  Pagination,
  Dropdown,
  DropdownSeparator,
  DropdownToggle,
  DropdownToggleCheckbox,
  DropdownItem,
  DropdownPosition,
  Divider,
  OverflowMenu,
  OverflowMenuContent,
  OverflowMenuControl,
  OverflowMenuGroup,
  OverflowMenuItem,
  Toolbar,
  ToolbarContent,
  ToolbarToggleGroup,
  ToolbarItem
} from '@patternfly/react-core';
import FilterIcon from '@patternfly/react-icons/dist/esm/icons/filter-icon';
import axios from 'axios';


export class ReleaseToolbar extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            error: ''
        }
        this.resourceOptions = [
            {value: "All resources", disabled: false}
        ]
    }

    componentDidMount(){
        this.getRelease()
    }

    getRelease = () => {
        axios
        .get("http://localhost:8000/api/releases/")
        .then(res => {this.resourceOptions = res.data})
        .catch(err => this.setState({error: err}))
    }

    render(){
        return(
            <div>
                <h1>Get Release TESTing {console.log(this.resourceOptions)}</h1>
            </div>
        )
    }
}


export class ToolbarStacked extends React.Component {
  constructor(props) {
    super(props);

    // toggle group - three option menus with labels, two icon buttons, Kebab menu - right aligned
    // pagination - right aligned
    this.resourceOptions = [
      { value: 'All resources', disabled: false },
      { value: 'Deployment', disabled: false },
      { value: 'Pod', disabled: false }
    ];

    this.statusOptions = [
      { value: 'Running', disabled: false },
      { value: 'New', disabled: false },
      { value: 'Pending', disabled: false },
      { value: 'Cancelled', disabled: false }
    ];

    this.typeOptions = [
      { value: 'Any type', disabled: false, isPlaceholder: true },
      { value: 'No type', disabled: false }
    ];

    this.state = {
      kebabIsOpen: false,
      resourceIsExpanded: false,
      resourceSelected: null,
      statusIsExpanded: false,
      statusSelected: null,
      splitButtonDropdownIsOpen: false,
      page: 1,
      perPage: 20
    };

    this.onKebabToggle = isOpen => {
      this.setState({
        kebabIsOpen: isOpen
      });
    };

    this.onResourceToggle = isExpanded => {
      this.setState({
        resourceIsExpanded: isExpanded
      });
    };

    this.onResourceSelect = (event, selection) => {
      this.setState({
        resourceSelected: selection,
        resourceIsExpanded: false
      });
    };

    this.onStatusToggle = isExpanded => {
      this.setState({
        statusIsExpanded: isExpanded
      });
    };

    this.onStatusSelect = (event, selection) => {
      this.setState({
        statusSelected: selection,
        statusIsExpanded: false
      });
    };

    this.onSetPage = (_event, pageNumber) => {
      this.setState({
        page: pageNumber
      });
    };

    this.onPerPageSelect = (_event, perPage) => {
      this.setState({
        perPage
      });
    };

    this.onSplitButtonToggle = isOpen => {
      this.setState({
        splitButtonDropdownIsOpen: isOpen
      });
    };

    this.onSplitButtonSelect = event => {
      this.setState({
        splitButtonDropdownIsOpen: !this.state.splitButtonDropdownIsOpen
      });
    };
  }

  render() {
    const {
      kebabIsOpen,
      resourceIsExpanded,
      resourceSelected,
      statusIsExpanded,
      statusSelected,
      splitButtonDropdownIsOpen
    } = this.state;

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

    const splitButtonDropdownItems = [
      <DropdownItem key="link">Link</DropdownItem>,
      <DropdownItem key="action" component="button">
        Action
      </DropdownItem>,
      <DropdownItem key="disabled link" isDisabled>
        Disabled Link
      </DropdownItem>,
      <DropdownItem key="disabled action" isDisabled component="button">
        Disabled Action
      </DropdownItem>
    ];

    const toggleGroupItems = (
      <React.Fragment>
        <ToolbarItem variant="label" id="stacked-example-resource-select">
          Resource
        </ToolbarItem>
        <ToolbarItem>
          <Select
            variant={SelectVariant.single}
            aria-label="Select Input"
            onToggle={this.onResourceToggle}
            onSelect={this.onResourceSelect}
            selections={resourceSelected}
            isOpen={resourceIsExpanded}
            ariaLabelledBy="stacked-example-resource-select"
          >
            {this.resourceOptions.map((option, index) => (
              <SelectOption isDisabled={option.disabled} key={index} value={option.value} />
            ))}
          </Select>
        </ToolbarItem>
        <ToolbarItem variant="label" id="stacked-example-status-select">
          Status
        </ToolbarItem>
        <ToolbarItem>
          <Select
            variant={SelectVariant.single}
            aria-label="Select Input"
            onToggle={this.onStatusToggle}
            onSelect={this.onStatusSelect}
            selections={statusSelected}
            isOpen={statusIsExpanded}
            ariaLabelledBy="stacked-example-status-select"
          >
            {this.statusOptions.map((option, index) => (
              <SelectOption isDisabled={option.disabled} key={index} value={option.value} />
            ))}
          </Select>
        </ToolbarItem>
      </React.Fragment>
    );

    const firstRowItems = (
      <React.Fragment>
        <Toolbar>
          <ToolbarContent>
            <ToolbarToggleGroup toggleIcon={<FilterIcon />} breakpoint="lg">
              {toggleGroupItems}
            </ToolbarToggleGroup>
            <ToolbarItem variant="overflow-menu">
              <OverflowMenu breakpoint="2xl">
                <OverflowMenuContent>
                  <OverflowMenuGroup groupType="button">
                    <OverflowMenuItem>
                      <Button variant={ButtonVariant.primary}>Primary</Button>
                    </OverflowMenuItem>
                    <OverflowMenuItem>
                      <Button variant={ButtonVariant.secondary}>Secondary</Button>
                    </OverflowMenuItem>
                  </OverflowMenuGroup>
                </OverflowMenuContent>
                <OverflowMenuControl hasAdditionalOptions>
                  <Dropdown
                    onSelect={this.onResourceSelect}
                    toggle={<KebabToggle onToggle={this.onKebabToggle} />}
                    isOpen={kebabIsOpen}
                    isPlain
                    dropdownItems={dropdownItems}
                    position={DropdownPosition.right}
                  />
                </OverflowMenuControl>
              </OverflowMenu>
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>
      </React.Fragment>
    );

    const secondRowItems = (
      <React.Fragment>
        <Toolbar>
          <ToolbarContent>
            <ToolbarItem variant="bulk-select">
              <Dropdown
                onSelect={this.onSplitButtonSelect}
                toggle={
                  <DropdownToggle
                    id="stacked-example-toggle"
                    splitButtonItems={[
                      <DropdownToggleCheckbox id="example-checkbox-1" key="split-checkbox" aria-label="Select all" />
                    ]}
                    onToggle={this.onSplitButtonToggle}
                  />
                }
                isOpen={splitButtonDropdownIsOpen}
                dropdownItems={splitButtonDropdownItems}
              />
            </ToolbarItem>
            <ToolbarItem variant="pagination" align={{ default: 'alignRight' }}>
              <Pagination
                itemCount={37}
                perPage={this.state.perPage}
                page={this.state.page}
                onSetPage={this.onSetPage}
                widgetId="pagination-options-menu-top"
                onPerPageSelect={this.onPerPageSelect}
              />
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>
      </React.Fragment>
    );

    return (
      <React.Fragment>
        {firstRowItems}
        <Divider />
        {secondRowItems}
        <ReleaseToolbar></ReleaseToolbar>
      </React.Fragment>
    );
  }
}
