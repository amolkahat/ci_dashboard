import { Bullseye, Spinner } from '@patternfly/react-core';
import React from 'react';
import BasicPanel from './Panel';

const BasicSpinner = (props) => (
   <BasicPanel>
       <Bullseye>
            <Spinner/>
       </Bullseye>
   </BasicPanel>
  );

  export default  BasicSpinner;
