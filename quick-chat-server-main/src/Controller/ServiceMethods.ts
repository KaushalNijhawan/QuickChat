import {verify} from "jsonwebtoken"; 

export const verifyToken =  (token: string, username: string, email: string) : Boolean => {
    if(token && username && email){
        try{
            const secretKey = username+","+email;
            let response  =  verify(token,secretKey);
            return true;
        }catch(err){
             console.log(err);
        }
    }
    return false;
}

export const concatArrayBuffers = (arrayBuffers : ArrayBuffer[]) => {
    const totalLength = arrayBuffers.reduce((acc, buffer) => acc + buffer.byteLength, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;
    for (const buffer of arrayBuffers) {
      result.set(new Uint8Array(buffer), offset);
      offset += buffer.byteLength;
    }
    return result.buffer;
  }