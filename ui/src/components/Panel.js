import React from 'react';
import { Panel, PanelFooter, PanelHeader, PanelMain, PanelMainBody } from '@patternfly/react-core';

const BasicPanel = (props) => (
  <Panel variant='raised'>
    <PanelHeader>
      {props.header}
    </PanelHeader>
    <PanelMain>
      <PanelMainBody>{props.children}</PanelMainBody>
    </PanelMain>
    <PanelFooter>
      {props.footer}
    </PanelFooter>
  </Panel>
);

export default  BasicPanel;