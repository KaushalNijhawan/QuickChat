import { useState } from "react";
import { Modal } from "react-bootstrap";

export const FileModal = (props: { showModal: boolean , showModalLoader(showModal : boolean) : void}) => {
    const [items, setItems] = useState<string[]>(['File', 'Audio', 'Video'])
    const [currentFile, setCurrentFile] = useState<File>();
    const handleClose = () => {

    }

    const handleChangeFile = async (e: any, type : string ) => {
        if(type && e){
            const file : File = e.target.files[0];
            props.showModalLoader(true);
            const chunkSize = 4*1024*1024; // 4mb size reading big audio and videos files in terms of chunks;
            let offset = 0 ;
            let contents = '';
            while(offset <= file.size){
                contents += await readFileInChunk(file , offset , chunkSize);
                offset += chunkSize;
            } 
            props.showModalLoader(false);
            console.log(contents.length);
        }
    }

 

    const readFileInChunk = (file : File, offset : number, length : number): Promise<string | ArrayBuffer | null | undefined> =>{
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            const blob = file.slice(offset, offset + length);
            reader.onload = (event : ProgressEvent<FileReader>) => {
              const contents = event?.target?.result;
              resolve(contents);
            };
            reader.onerror = (error) => {
              reject(error);
            };
            reader.readAsBinaryString(blob);
          });
    }



    return (
        <>
            <Modal show={props.showModal ? true : false} onHide={handleClose} style={{ position: "fixed", top: "60%", left: "78%", width: "10%" }} autoFocus={true}
                enforceFocus={true} keyboard={true} backdrop={false}>
                <Modal.Body>
                    <div className="input-group" >
                        <div className="custom-file" style={{ display: "none" }}>
                            <input type="file" className="custom-file-input" id="customFile1" accept="audio/*" onChange={(e) => handleChangeFile(e , "audio")}/>
                        </div>
                        <div className="input-group-append">
                            <a style={{ textDecoration: "none", textDecorationColor: "black" }} onClick={() => document?.getElementById('customFile1')?.click()}>
                                <span style={{ marginLeft: "-60%" }}>Audio</span>
                            </a>
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="custom-file" style={{ display: "none" }}>
                            <input type="file" className="custom-file-input" id="customFile2" accept="video/*" onChange={(e) => handleChangeFile(e , "video")}/>
                        </div>
                        <div className="input-group-append">
                            <a style={{ textDecoration: "none", textDecorationColor: "black" }} onClick={() => document?.getElementById('customFile2')?.click()}>
                                <span style={{ marginLeft: "-60%" }}>Video</span>
                            </a>
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="custom-file" style={{ display: "none" }}>
                            <input type="file" className="custom-file-input" id="customFile3" onChange={(e) => handleChangeFile(e , "files")}/>
                        </div>
                        <div className="input-group-append">
                            <a style={{ textDecoration: "none", textDecorationColor: "black" }} onClick={() => document?.getElementById('customFile3')?.click()}>
                                <span style={{ marginLeft: "-60%" }}>Files</span>
                            </a>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}