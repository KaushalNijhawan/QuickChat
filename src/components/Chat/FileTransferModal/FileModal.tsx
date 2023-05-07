import { useState } from "react";
import { Modal } from "react-bootstrap";
import "./FileMOdal.css";
import { store } from "../../Redux/store";
import { Socket } from "socket.io-client";
export const FileModal = (props: { showModal: boolean, showModalLoader(showModal: boolean): void, groupToggle : boolean}) => {
    const [items, setItems] = useState<string[]>(['File', 'Audio', 'Video'])
    const [currentFile, setCurrentFile] = useState<File>();
    const handleClose = () => {

    }

    const handleChangeFile = (e: any, type: string) => {
        let file = e.target.files[0];
        let socket: Socket = store.getState().socket.io;
        const fileSize = file.size;
        const chunkSize = 768 * 1024; // 64KB chunks
        let offset : number = 0;

        const readChunk = (chunkOffset : number) => {
            const chunkReader = new FileReader();
            const chunk = file.slice(chunkOffset, chunkOffset + chunkSize);
            props.showModalLoader(true);
            chunkReader.onload = (e : any) => {
                const buffer : ArrayBuffer = e.target.result;
                socket.emit("uploadChunk", { buffer, offset });
                socket.on("video-received" , (data : ArrayBuffer)=>{
                    console.log(data);
                });
                offset += buffer.byteLength;

                if (offset < fileSize) {
                    readChunk(offset);
                } else {
                    props.showModalLoader(false);
                    socket.emit("uploadComplete");
                }
            };

            chunkReader.readAsArrayBuffer(chunk);
            
        };

        socket.emit("uploadStart", { name: file.name, size: fileSize });
        
        
        readChunk(0);
    }

    const concatArrayBuffers = (...buffers: ArrayBuffer[]): ArrayBuffer => {
        const totalByteLength = buffers.reduce((acc, buffer) => acc + buffer.byteLength, 0);
        const result = new Uint8Array(totalByteLength);
      
        let offset = 0;
        for (const buffer of buffers) {
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
                    </ul>
                </Modal.Body>
            </Modal>
        </>
    );
}