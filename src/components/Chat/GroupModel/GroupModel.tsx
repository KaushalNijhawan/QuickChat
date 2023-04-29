
import { Modal, Button } from "react-bootstrap";
import { useState} from "react";
import { User } from "../../Model and Interfaces/Models";
import { store } from "../../Redux/store";

export const GroupModel = (props:{ showModal: Boolean , initialState : Map<String, User> , handleDataFromModal(data : any): void, handleModal() : void }) => {
    const [usernames , setUsernames] = useState<Set<string>>(new Set());
    const [groupName , setGroupName] = useState<string>("");
    
    const handleCloseModal = () => {
        props.handleModal();
    }

    const handleCheckboxClick  = (username : string , e : any) =>{
        if(e.target.checked){
            let setCopy = usernames;
            setCopy.add(username);
            setUsernames(setCopy);
        }else{
            usernames.delete(username);
            setUsernames(usernames);
        }
    }

    const handleCreateModal  = () =>{
        let setCopy = usernames;
        setCopy.add(store.getState().user.username);    
        props.handleDataFromModal({
                usernames : Array.from(usernames),
                groupTitle : groupName
        });
    }
    
    return (
        <Modal show={props.showModal ? true : false} onHide={handleCloseModal} >
            <Modal.Header closeButton>
                <Modal.Title>Create Group</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {Array.from(props.initialState.values()).map((user, index: number)=>{
                    return(
                        <div className="form-check" style={{marginTop:"1%"}} key = {index}>
                        <input className="form-check-input" type="checkbox" value="" id={user.username} onChange={ (e) => handleCheckboxClick(user.username , e)}/>
                        <label className="form-check-label" htmlFor={user.username}>
                            {user.username}
                        </label>
                    </div>
                    )
                })}
                <div className="form-group" style={{marginTop:"5%"}}>
                    <input type="text" className="form-control" id="inputTag" placeholder="Enter Group Title" onChange={(e) => setGroupName(e.target.value)} />
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleCreateModal} disabled = {usernames.size > 0 && groupName ? false : true}>
                    Create
                </Button>
            </Modal.Footer>
        </Modal>
    );
};