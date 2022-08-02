import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Caption, TableComposable, Tbody, Thead, Tr, Th, Td } from '@patternfly/react-table';
import { useSelector} from 'react-redux';
import { CardBasic } from './CardTemplates';
import { ReleaseToolbar } from './Dropdown';
import { Alert } from '@patternfly/react-core';
import { EmptyStateRow } from './Table';




const MirrorTable = (props) => {
    const [mirrors, setMirrors] = useState([])
    const [error, seterror] = useState("")


    const relDistro = useSelector((state)=> state.release)
    const distro = relDistro.distro
    const release = relDistro.release

    useEffect(() => {
        fetchMirrors()
      }, [release, distro])

    async function fetchMirrors(){
        seterror('')
        try{
          const resp = await axios
          .get(`http://localhost:8000/api/mirrors/?release=${release}&distro=${distro}`)
          setMirrors(resp.data)
        }catch(error){
          seterror(error.response)
        }
    }
    
    return (<CardBasic header={<ReleaseToolbar buttonOnClick={fetchMirrors}
    buttonTitle="Get Mirrors"/>}>
        {error? <Alert variant='danger' title={error.message}/>: " "}
        <TableComposable
              aria-label='Mirrors Table'
              variant='compact'
            >
        <Caption> Mirrors Table </Caption>
          <Thead>
            <Tr>
              <Th>Mirror Name</Th>
              <Th>Mirror Status</Th>
              <Th>Release</Th>
              <Th>Distro</Th>
            </Tr>
          </Thead>
        <Tbody>
          {mirrors ? mirrors.map(item => (
            <Tr key={item.name}>
              <Td dataLabel="Mirror Name">{item.name}</Td>
              <Td dataLabel="Mirror Status">{item.status}</Td>
              <Td dataLabel="Release">{item.release}</Td>
              <Td dataLabel="Distro">{item.distro}</Td>
            </Tr>
          )): <EmptyStateRow/>}
        </Tbody>
    </TableComposable>

    </CardBasic> )
}

export default MirrorTable;
