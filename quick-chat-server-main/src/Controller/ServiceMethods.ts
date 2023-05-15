import {verify} from "jsonwebtoken"; 
import * as fs from 'fs';
import * as util from 'util';
import ffmpeg from 'fluent-ffmpeg';
import { FILE_PATH } from "../Constants/Constants";
import { addChats, saveGroupChat } from "../Datastore/datastore";
import { ChatUser, SpecialMessage, groupChatMessage } from "../UserModel/UserModel";

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

export const convertArrayBufferToFile = (chunks: ArrayBuffer[], filename: string, fileType: string) =>{
    const concatenatedArrayBuffer = new Uint8Array(
      chunks.reduce((totalLength, chunk) => totalLength + chunk.byteLength, 0)
    );
  
    let offset = 0;
    for (const chunk of chunks) {
      concatenatedArrayBuffer.set(new Uint8Array(chunk), offset);
      offset += chunk.byteLength;
    }
  
    const file = Buffer.from(concatenatedArrayBuffer);

    fs.writeFileSync("a.mp4", file);
}

export const compressVideo = (filePath : string, outputFileName : string,sizeReductionPercentage : number) : Promise<ArrayBuffer>  =>{
  const readFileAsync = util.promisify(fs.readFile);
  return new Promise<ArrayBuffer>((resolve, reject) => {
    ffmpeg(filePath)
        .outputOptions('-vf','scale=-2:480')
        .output(outputFileName)
        .on('end', async () => {
          try {
            // Read the compressed video file as a buffer
            const videoBuffer = await readFileAsync(outputFileName);
            // Convert the buffer to an ArrayBuffer
            const arrayBuffer = videoBuffer.buffer.slice(
              videoBuffer.byteOffset,
              videoBuffer.byteOffset + videoBuffer.byteLength
            );
            // Resolve the promise with the ArrayBuffer
            resolve(arrayBuffer);
          } catch (error) {
            reject(error);
          }
        })
        .on('error', (error) => {
          reject(error);
        })
        .run();
  });
}

export const saveSpecialChatFromPrivate = (fromUsername : string , toUsername : string ,storageBucketFileLink : string , Id : number  , type: string) =>{
  const specialMessage : SpecialMessage =   {specialMessagelink : storageBucketFileLink , isDownloaded : false ,messageVideoBuffer : new ArrayBuffer(0)};
  let chatUser : ChatUser = {
    fromUsername : fromUsername,
    Id : Id,
    messageContent : "",
    specialMessage : specialMessage,
    timestamp : new Date().valueOf(),
    type  : type,
    toUsername : toUsername
  }  
  addChats(chatUser);
}

export const saveSpecialChatFromGroup = (fromUsername : string , toUsernames: string ,storageBucketFileLink : string , Id : number, groupTitle : string , type : string ) =>{
  const specialMessage : SpecialMessage =   {specialMessagelink : storageBucketFileLink , isDownloaded : false , messageVideoBuffer : new ArrayBuffer(0)};
  let groupChatUserMessage : groupChatMessage = {
    fromUsername : fromUsername , 
    Id : Id,
    groupTitle : groupTitle,
    messageContent : "",
    specialMessage : specialMessage,
    timestamp : new Date().valueOf(),
    toUsernames : toUsernames.split(","),
    type : type
  }

  saveGroupChat(groupChatUserMessage);
}

export const deleteCreatedFile = (filePath: string) =>{
  fs.unlink(filePath, (error) => {
    if (error) {
      console.error('An error occurred while deleting the file:', error);
    } else {
      console.log('File deleted successfully');
    }
  });
}