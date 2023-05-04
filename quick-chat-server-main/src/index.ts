import express from 'express';
import bodyParser from 'body-parser';
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import router from './Controller/SocketController';
import { ChatUser, GroupChat, User, groupChatMessage } from './UserModel/UserModel';
import { verifyToken } from './Controller/ServiceMethods';
import { addChats, addGroup, saveGroupChat } from './Datastore/datastore';
import path from "path";
import fs from "fs";
let writableStream : any = null;
const app = express();
let userList: User[] = [];
app.use(bodyParser.json(), cors());

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
                if (responseObject.messageContent.length > 0) {
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

            socket.on("uploadStart", ({ name, size }) => {
                console.log(`File upload started: ${name}, size: ${size}`);
                writableStream = fs.createWriteStream(`C:/Users/Kaushal Nijhawan/Downloads/video-shared/${name}`);
              });
            
              socket.on("uploadChunk", ({ buffer, offset }) => {
                console.log(`Received chunk: ${offset} - ${offset + buffer.byteLength}`);
                writableStream.write(Buffer.from(buffer));
              });
            
              socket.on("uploadComplete", () => {
                console.log("File upload complete");
                writableStream.end();
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