import { useState } from "react";
import { Modal } from "react-bootstrap";
import "./FileMOdal.css";
import { store } from "../../Redux/store";
import { Socket } from "socket.io-client";
import { ChatUser, GroupChatMessage } from "../../Model and Interfaces/Models";
export const FileModal = (props: { showModal: boolean, showModalLoader(showModal: boolean): void, groupToggle: boolean, toUsername: string , onClose : any,
toUsernames : string[] , handleSpecialMessage(chatObject : ChatUser | GroupChatMessage ) : void }) => {
    const [fileChunks, setFileChunks] = useState<ArrayBuffer[]>([]);
    const [fileChunk , setFileChunk] = useState<ArrayBuffer>();
    const handleClose = () => {

    }

    const handleChangeFile = (e: any, type: string) => {
        let file: File = e.target.files[0];
        let socket: Socket = store.getState().socket.io;
        if((file.size/(1024*1024)) > 25 ){
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


    const handleVideoFiles = (file: File, socket: Socket , type : string) => {
        const fileSize = file.size;
        const chunkSize = 768 * 1024; // 768KB chunks
        let offset: number = 0;
        let fileChunksList  : ArrayBuffer[] = []; 
        const readChunk = (chunkOffset: number) => {
            const chunkReader = new FileReader();
            const chunk = file.slice(chunkOffset, chunkOffset + chunkSize);
            props.showModalLoader(true);
            chunkReader.onload = (e: any) => {
                const buffer: ArrayBuffer = e.target.result;
                socket.emit("uploadChunk",
                    {
                        buffer,
                        offset
                    });
                socket.on("video-received", (data: ArrayBuffer) => {
                    fileChunksList.push(data);
                });
                offset += buffer.byteLength;

                if (offset < fileSize) {
                    readChunk(offset);
                } else {
                    socket.emit("uploadComplete");
                    socket.on("bucket-upload-complete" , (message) =>{
                        props.showModalLoader(false);
                    });

                    if(props.groupToggle){
                        let chatObject : GroupChatMessage = {
                            fromUsername : store.getState().user.username,
                            Id: store.getState().groupChat.get(props.toUsername)?.length != undefined ? store.getState().groupChat.get(props.toUsername)?.length as number + 1 : 1,
                            groupTitle : props.toUsername , 
                            messageContent : "",
                            specialMessage : fileChunksList,
                            type  : type,
                            timestamp : new Date().valueOf(),
                            toUsernames : props.toUsernames
                        };
                        props.handleSpecialMessage(chatObject);
                    }else{
                        let chatObject : ChatUser = {
                            fromUsername : store.getState().user.username,
                            Id : store.getState().chat.length + 1,
                            messageContent : "",
                            type : type,
                            specialMessage : fileChunksList,
                            timestamp : new Date().valueOf(),
                            toUsername : props.toUsername
                        }

                        props.handleSpecialMessage(chatObject);

                    }
                }
            };

            chunkReader.readAsArrayBuffer(chunk);

        };

        socket.emit("uploadStart", { name: file.name, size: fileSize });


        readChunk(0);
    }

    const concatArrayBuffers = (arrayBuffers: ArrayBuffer[]): ArrayBuffer => {
        const totalLength = arrayBuffers.reduce((acc, buffer) => acc + buffer.byteLength, 0);
        const result = new Uint8Array(totalLength);
        let offset = 0;
        for (const buffer of arrayBuffers) {
            result.set(new Uint8Array(buffer), offset);
            offset += buffer.byteLength;
        }
        return result.buffer;
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