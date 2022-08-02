import { TextInput } from "@patternfly/react-core";
import React, {useState} from "react";
import { useSelector, useDispatch } from 'react-redux';

import allActions from '../Actions';



const AdminPage = (props) => {
    const release = useSelector((state)=> state.release)
    const [releaseVal, setReleaseVal] = useState("")
    const dispath = useDispatch()
    console.log(release)
    return(
        <div>
            {JSON.stringify(release)}
            <TextInput
                aria-label="Add release"
                value={releaseVal}
                onChange={e => setReleaseVal(e)}
            />
        <button onClick={() => dispath(allActions.setRelease(releaseVal))}>Set Release</button>
        </div>
    )
}

export default AdminPage;
