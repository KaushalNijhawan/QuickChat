import { useState } from "react";
import { Modal } from "react-bootstrap";
import "./FileMOdal.css";
import { store } from "../../Redux/store";
export const FileModal = (props: { showModal: boolean, showModalLoader(showModal: boolean): void }) => {
    const [items, setItems] = useState<string[]>(['File', 'Audio', 'Video'])
    const [currentFile, setCurrentFile] = useState<File>();
    const handleClose = () => {

    }

    const handleChangeFile = (e: any, type: string) => {
        let file = e.target.files[0];
        let socket  = store.getState().socket.io;
        const fileSize = file.size;
        const chunkSize = 64 * 1024; // 64KB chunks
        let offset = 0;

        const readChunk = (chunkOffset : number) => {
            const chunkReader = new FileReader();
            const chunk = file.slice(chunkOffset, chunkOffset + chunkSize);

            chunkReader.onload = (e : any) => {
                console.log(e);
                const buffer = e.target.result;
                socket.emit("uploadChunk", { buffer, offset });
                offset += buffer.byteLength;

                if (offset < fileSize) {
                    readChunk(offset);
                } else {
                    socket.emit("uploadComplete");
                    console.log("Upload complete");
                }
            };

            chunkReader.readAsArrayBuffer(chunk);
        };

        socket.emit("uploadStart", { name: file.name, size: fileSize });
        readChunk(0);
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