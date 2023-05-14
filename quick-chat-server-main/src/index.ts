import express from 'express';
import bodyParser from 'body-parser';
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import router from './Controller/SocketController';
import { ChatUser, GroupChat, User, groupChatMessage } from './UserModel/UserModel';
import { concatArrayBuffers, verifyToken } from './Controller/ServiceMethods';
import { addChats, addGroup, saveGroupChat } from './Datastore/datastore';
import { saveBucketVideo, uploadFileToBucket } from './CloudStorageBucket/CloudStorageBucket';
import { writeFile } from "fs";

const app = express();
app.use(bodyParser.json(), cors());

let receivedBuffers: ArrayBuffer[] = [];

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*'
    }
});

app.use("/token", router);

io.listen(4000);

if (!io.listenerCount('connection')) {
    io.on("connection", (socket) => {
        let authObject: User = socket.handshake.auth as User;
        let response = verifyToken(authObject.token, authObject.username, authObject.email);
        if (response) {
            socket.on("private-message", (responseObject: ChatUser) => {
                socket.join("private-chat-room");
                if (responseObject && responseObject.messageContent.length > 0) {
                    addChats(responseObject).then((res: any) => {
                        console.log(res);

                    });
                }
                io.to("private-chat-room").emit("private-chat", responseObject);
            });
            socket.on("group-chat", (groupChatObject: GroupChat) => {
                addGroup(groupChatObject).then((res) => console.log(res));
            });

            socket.on("join-group", (groupTitle: string) => {
                socket.join(groupTitle);
            });

            socket.on("group-message", (groupChatMessage: groupChatMessage) => {

                if (groupChatMessage.messageContent.length > 0) {
                    // save this message 
                    saveGroupChat(groupChatMessage).then((res) => { console.log(res) });
                }
                io.to(groupChatMessage.groupTitle).emit("group-discussion", groupChatMessage);
            });
            let fileName: string = "";
            socket.on("uploadStart", ({ name, size }) => {
                fileName = name;
                console.log(`File upload started: ${name}, size: ${size}`);
                // writableStream = fs.createWriteStream(`C:/Users/Kaushal Nijhawan/Downloads/video-shared/${name}`);
            });

            socket.on("upload", (file, callback) => {
                // console.log(`Received chunk: ${data.offset} - ${data.offset + data.buffer.byteLength}`);
                socket.join("video-sharing");
                console.log("here");
                console.log(file);
                writeFile("C:/Users/Kaushal Nijhawan/Downloads/video-shared", file, (err) => {
                    callback({ message: err ? "failure" : "success" });
                  });
                // let buffer = data.buffer;
                // receivedBuffers.push(buffer);
                // io.to("video-sharing").emit("video-received", buffer);
                // writableStream.write(Buffer.from(data.buffer));
            });

            socket.on("uploadComplete", () => {
                console.log("File upload complete");
                let receivedBuffer = concatArrayBuffers(receivedBuffers);
                saveBucketVideo(receivedBuffer, fileName).then((res) => {
                    console.log(res);
                    if (res == "saved!") {
                        socket.emit("bucket-upload-complete", "sucess");
                    }
                });
            });

        } else {
            socket.disconnect(true);
        }
    });
}


app.get("/", (req, res) => {
    res.send("Helllo from Chat!!");
});

app.listen(3001, () => {
    console.log("Server is Started! 1.o");
});