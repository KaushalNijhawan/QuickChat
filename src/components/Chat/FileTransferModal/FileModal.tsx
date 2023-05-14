import { useState } from "react";
import { Modal } from "react-bootstrap";
import "./FileMOdal.css";
import { store } from "../../Redux/store";
import { Socket } from "socket.io-client";
import { ChatUser, GroupChatMessage } from "../../Model and Interfaces/Models";
import axios from "axios";
import { Constants } from "../../../Constants/Constants";
import { uploadFileGroup, uploadFilePrivate } from "../ChatWindow/commonMethods";
export const FileModal = (props: { showModal: boolean, showModalLoader(showModal: boolean): void, groupToggle: boolean, toUsername: string , onClose : any,
toUsernames : string[] , handleSpecialMessage(chatObject : ChatUser | GroupChatMessage ) : void }) => {
    const [fileChunks, setFileChunks] = useState<ArrayBuffer[]>([]);
    const [fileChunk , setFileChunk] = useState<ArrayBuffer>();
    const handleClose = () => {

    }

    const handleChangeFile = (e: any, type: string) => {
        let file: File = e.target.files[0];
        let socket: Socket = store.getState().socket.io;
        if((file.size/(1024*1024)) > 30 ){
            props.onClose();
            return;
        }
        switch (type) {
            case "audio":
                handleVideoFiles(file, socket , type);
                break;
            case "files":
                handleVideoFiles(file, socket, type);
                break;
            case "video":
                handleVideoFiles(file, socket, type);
                break;
        }
    }

    const handleVideoFiles = async (file : File , socket: Socket , type : string) =>{
        if(file && socket && type){
            socket.emit("uploadStart" , { name: file.name, size: file.size });
            const formData = new FormData();
            formData.append('file', file);
            formData.append('fromUsername' , store.getState().user.username);
            formData.append('toUsername' , props.toUsername);
            console.log(props.groupToggle);
            if(props.groupToggle){
                uploadFileGroup(store.getState().user.username,  props.toUsernames , store.getState().groupChat.get(props.toUsername)?.length != undefined ? store.getState().groupChat.get(props.toUsername)?.length as number + 1 : 1 
                , props.toUsername , file , type);
            }else{
              let response : ChatUser = await uploadFilePrivate(store.getState().user.username,props.toUsername , store.getState().chat.length + 1 ,file, type);
              props.handleSpecialMessage(response);
            }
                    
        }
    }


    return (
        <>
            <Modal show={props.showModal ? true : false} onHide={handleClose} style={{ position: "fixed", top: "60%", left: "79%", width: "7%" }} autoFocus={true}
                enforceFocus={true} keyboard={true} backdrop={false}>
                <Modal.Body>
                    <ul className="list-unstyled text-center">
                        <div className="custom-file" style={{ display: "none" }}>
                            <input type="file" className="custom-file-input" id="customFile1" accept="audio/*" onChange={(e) => handleChangeFile(e, "audio")} />
                        </div>
                        <div className="input-group-append">
                            <a style={{ textDecoration: "none", textDecorationColor: "black" }} onClick={() => document?.getElementById('customFile1')?.click()}>
                                <span style={{ marginLeft: "-60%" }}>Audio</span>
                            </a>
                        </div>
                        <div className="custom-file" style={{ display: "none" }}>
                            <input type="file" className="custom-file-input" id="customFile2" accept="video/*" onChange={(e) => handleChangeFile(e, "video")} />
                        </div>
                        <div className="input-group-append">
                            <a style={{ textDecoration: "none", textDecorationColor: "black" }} onClick={() => document?.getElementById('customFile2')?.click()}>
                                <span style={{ marginLeft: "-60%" }}>Video</span>
                            </a>
                        </div>
                        <div className="custom-file" style={{ display: "none" }}>
                            <input type="file" className="custom-file-input" id="customFile3" onChange={(e) => handleChangeFile(e, "files")} />
                        </div>
                        <div className="input-group-append">
                            <a style={{ textDecoration: "none", textDecorationColor: "black" }} onClick={() => document?.getElementById('customFile3')?.click()}>
                                <span style={{ marginLeft: "-60%" }}>Files</span>
                            </a>
                        </div>
                        <div className="custom-file" style={{ display: "none" }}>
                            <input type="file" className="custom-file-input" id="customFile4" accept="image/*" onChange={(e) => handleChangeFile(e, "files")} />
                        </div>
                        <div className="input-group-append">
                            <a style={{ textDecoration: "none", textDecorationColor: "black" }} onClick={() => document?.getElementById('customFile4')?.click()}>
                                <span style={{ marginLeft: "-60%" }}>Images</span>
                            </a>
                        </div>
                    </ul>
                </Modal.Body>
            </Modal>
        </>
    );
}