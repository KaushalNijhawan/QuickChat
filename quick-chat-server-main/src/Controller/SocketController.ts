import express, { response } from "express";
import { getChats, getChatsGroupSpecific, getGroups } from "../Datastore/datastore";
import { ChatUser, GroupChat, groupChatMessage } from "../UserModel/UserModel";
import multer from "multer";
import path from "path";
import fs from "fs";
import { FILE_PATH } from "../Constants/Constants";
import { compressVideo, deleteCreatedFile, saveSpecialChatFromGroup, saveSpecialChatFromPrivate } from "./ServiceMethods";
import { saveBucketVideo } from "../CloudStorageBucket/CloudStorageBucket";
const upload = multer();
const router = express.Router();

router.get("/chats", async (req, res) => {
    let response: any = null;
    try {
        const token = req.headers['authorization'];
        response = await getChats();
    } catch (err) {
        console.log(err);
    }
    if (response) {
        res.status(200).send(response);
    } else {
        res.status(400).send("Invalid  payload!");
    }
});

router.get("/groups", async (req, res) => {
    let response: GroupChat[] = [];
    try {
        const token = req.headers["authorization"];
        response = await getGroups();
        console.log(response);
    } catch (err) {
        console.log(err);
    }
    if (response) {
        res.status(200).send(response);
    } else {
        res.status(400).send("Invalid Payload!");
    }
});

router.post("/groupChats", async (req, res) => {
    let request: { username: string, groupTitle: string } = req.body;
    let response: groupChatMessage[] = [];
    if (request.username && request.groupTitle) {
        response = await getChatsGroupSpecific(request.username, request.groupTitle);
    }
    if (response) {
        res.status(200).send(response);
    } else {
        res.status(400).send("Invalid Payload");
    }
});

const toArrayBuffer = (buffer: Buffer) => {
    var ab = new ArrayBuffer(buffer.length);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buffer.length; ++i) {
        view[i] = buffer[i];
    }
    return ab;
}

router.post('/upload/private', upload.single('file'), async (req, res) => {
    let requestObject: { fromUsername: string, ID: string, toUsername: string, type: string, filename: string, file: File } = req.body;

    console.log(requestObject.type);
    console.log(requestObject.filename);

    if (requestObject.type == "images") {
        const start = new Date().valueOf();
        let responseArray: ArrayBuffer = new ArrayBuffer(0);
        let storageBucketLink: string = "";
        try {
            responseArray = toArrayBuffer(req?.file?.buffer as Buffer);
            storageBucketLink = await saveBucketVideo(responseArray, requestObject.filename as string);
            console.log(storageBucketLink);
            await saveSpecialChatFromPrivate(requestObject.fromUsername, requestObject.toUsername, storageBucketLink, parseInt(requestObject.ID), requestObject.type);
            console.log(`time taken to compress is ${(new Date().valueOf() - start) / 1000} seconds`);
        } catch (err) {
            console.log(err);
        }
        if (!responseArray) {
            res.status(400).send("Error");
        } else {
            const buffer = Buffer.from(responseArray);
            res.set({
                'Content-Type': 'application/octet-stream', // Set the appropriate content type
                'Content-Length': buffer.length.toString(), // Set the content length to the buffer size
            });
            let chatUser: ChatUser = {
                fromUsername: requestObject.fromUsername,
                Id: parseInt(requestObject.ID),
                messageContent: "",
                specialMessage: {
                    isDownloaded: true,
                    specialMessagelink: storageBucketLink,
                    messageVideoBuffer: null
                },
                timestamp: new Date().valueOf(),
                type: requestObject.type,
                toUsername: requestObject.type
            }
            res.send(chatUser);
        }
    }
    else if (requestObject.type == "files") {

    } else if (requestObject.type == "audio") {
        const start = new Date().valueOf();
        let responseArray: ArrayBuffer = new ArrayBuffer(0);
        let storageBucketLink: string = "";
        try {
            responseArray = toArrayBuffer(req?.file?.buffer as Buffer);
            storageBucketLink = await saveBucketVideo(responseArray, requestObject.filename as string);
            console.log(storageBucketLink);
            await saveSpecialChatFromPrivate(requestObject.fromUsername, requestObject.toUsername, storageBucketLink, parseInt(requestObject.ID), requestObject.type);
            console.log(`time taken to compress is ${(new Date().valueOf() - start) / 1000} seconds`);
        } catch (err) {
            console.log(err);
        }

        if (responseArray.byteLength == 0) {
            res.status(400).send("Error");
        } else {
            const buffer = Buffer.from(responseArray);
            let chatUser: ChatUser = {
                fromUsername: requestObject.fromUsername,
                Id: parseInt(requestObject.ID),
                messageContent: "",
                specialMessage: {
                    isDownloaded: true,
                    specialMessagelink: storageBucketLink,
                    messageVideoBuffer: null
                },
                timestamp: new Date().valueOf(),
                type: requestObject.type,
                toUsername: requestObject.type
            }
            res.send(chatUser);
        }
    } else {
        const start = new Date().valueOf();
        let responseArray: ArrayBuffer = new ArrayBuffer(0);
        let storageBucketLink: string = "";
        try {
            responseArray = toArrayBuffer(req?.file?.buffer as Buffer);
            storageBucketLink = await saveBucketVideo(responseArray, requestObject.filename as string);
            console.log(storageBucketLink);
            await saveSpecialChatFromPrivate(requestObject.fromUsername, requestObject.toUsername, storageBucketLink, parseInt(requestObject.ID), requestObject.type);
            console.log(`time taken to compress is ${(new Date().valueOf() - start) / 1000} seconds`);
        } catch (err) {
            console.log(err);
        }

        if (responseArray.byteLength == 0) {
            res.status(400).send("Error");
        } else {
            const buffer = Buffer.from(responseArray);
            let chatUser: ChatUser = {
                fromUsername: requestObject.fromUsername,
                Id: parseInt(requestObject.ID),
                messageContent: "",
                specialMessage: {
                    isDownloaded: true,
                    specialMessagelink: storageBucketLink,
                    messageVideoBuffer: null
                },
                timestamp: new Date().valueOf(),
                type: requestObject.type,
                toUsername: requestObject.type
            }
            res.send(chatUser);
        }
    }

});

router.post("/upload/group", upload.single('file'), (req, res) => {
    const originalFilePath = req?.file?.path as string;
    console.log(originalFilePath);
    const videoExtension = path.extname(originalFilePath);
    let requestObject: { fromUsername: string, ID: string, toUsernames: string, type: string, groupTitle: string } = req.body;
    const newFilePath = originalFilePath + '.mp4'; // New file path with the desired extension
    const outputFileName = FILE_PATH + '/' + req.file?.originalname + '.mp4';



    fs.rename(originalFilePath, newFilePath, async (err) => {
        if (err) {
            console.error('Error renaming file:', err);
            res.status(500).send('Error saving file');
        } else {
            console.log('File saved:', newFilePath);
            const start = new Date().valueOf();
            let responseArray: ArrayBuffer = new ArrayBuffer(0);
            let storageBucketLink: string = "";
            try {
                let response = await compressVideo(newFilePath, outputFileName, 50);
                responseArray = response;
                storageBucketLink = await saveBucketVideo(response, req.file?.filename as string);
                saveSpecialChatFromGroup(requestObject.fromUsername, requestObject.toUsernames, storageBucketLink, parseInt(requestObject.ID), requestObject.groupTitle, requestObject.type);
                console.log(`time taken to compress is ${(new Date().valueOf() - start) / 1000} seconds`);
            } catch (err) {
                console.log(err);
            }

            if (responseArray.byteLength == 0) {
                res.status(400).send("Error");
            } else {
                const buffer = Buffer.from(responseArray);
                res.set({
                    'Content-Type': 'application/octet-stream', // Set the appropriate content type
                    'Content-Length': buffer.length.toString(), // Set the content length to the buffer size
                });
                res.send(buffer);
            }

        }
    });

});

export default router;