import React , {useState} from "react";

import { AboutModal, Button, TextContent, TextList, TestListItem, TextListItem } from "@patternfly/react-core";
import { useSelector, useDispatch } from 'react-redux';


export const AboutModalBasic = (props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen)
    }

    const relDistro = useSelector((state)=> state.release)
    const distro = relDistro.distro
    const release = relDistro.release

    const Hash = props.promotionHash[0] || ""
    const columnNames = {
        aggregate_hash: 'Aggregate Hash',
        commit_hash: 'Commit Hash',
        distro_hash: 'Distro hash',
        extended_hash: 'Extended Hash',
        full_hash: 'Full Hash',
        component: 'Component',
        timestamp: 'Timestamp'
    };
    const HashInfo = (props) => {
        return 
    }
    return (
        <div>
        <Button variant="primary" 
                onClick={toggleModal}
                isDisabled={props.isDisabled}
        >
            {props.buttonText ? props.buttonText: " "}
        </Button>
        <AboutModal
            isOpen={isModalOpen}
            onClose={toggleModal}
            // trademark="Trademark and copyright information here"
            brandImageAlt=""
            productName={props.headLine}>
            <TextContent>
                <TextList component="dl">
                {Hash !== "" ? <>
                    <TextListItem component="dt">Release</TextListItem>
                    <TextListItem component="dd">{release}</TextListItem>
                    <TextListItem component="dt">Distro</TextListItem>
                    <TextListItem component="dd">{distro}</TextListItem>
                    <TextListItem component="dt">{columnNames.commit_hash}</TextListItem>
                    <TextListItem component="dd">{Hash.commit_hash.toString().toUpperCase()}</TextListItem>
                    <TextListItem component="dt">{columnNames.distro_hash}</TextListItem>
                    <TextListItem component="dd">{Hash.distro_hash.toString().toUpperCase()}</TextListItem>
                    <TextListItem component="dt">{columnNames.aggregate_hash}</TextListItem>
                    <TextListItem component="dd">{Hash.aggregate_hash.toString().toUpperCase()}</TextListItem>
                    <TextListItem component="dt">{columnNames.component}</TextListItem>
                    <TextListItem component="dd">{Hash.component}</TextListItem>
                    <TextListItem component="dt">{columnNames.timestamp}</TextListItem>
                    <TextListItem component="dd">{Hash.timestamp}</TextListItem>
                    <TextListItem component="dt"><Button onClick={() => props.promoteMethod()}>Promote</Button></TextListItem>
                    </> :"No hashes to display"}
                </TextList>
            </TextContent>
        </AboutModal>
        </div>
    )
}