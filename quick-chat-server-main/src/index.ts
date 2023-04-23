import express from 'express';
import bodyParser from 'body-parser';
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import router from './Controller/SocketController';
import { ChatUser, User } from './UserModel/UserModel';
import { verifyToken } from './Controller/ServiceMethods';
import { addChats } from './Datastore/datastore';
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
            socket.on("new-join", (userInfo: User) => {
                let found: Boolean = false;
                if (userList && userList.length > 0) {
                    userList.map((userObj) => {
                        if (userObj.username == userInfo.username || userInfo.email == userObj.email) {
                            found = true;
                        }
                    });
                    if (!found) {
                        userInfo.socketId = socket.id.toString();
                        userList.push(userInfo);
                    }
                } else {
                    userInfo.socketId = socket.id.toString();
                    userList.push(userInfo);
                    found = false;
                }
                if (!found) {
                    io.emit("update", userList);
                }
            });
            //  making the content for the private message;
            socket.on("private-message" , (responseObject : ChatUser) =>{
                console.log(responseObject);
                socket.join(responseObject.fromUsername + "-"+ responseObject.toUsername);
                addChats(responseObject).then((res : any)=>{
                    console.log(res);
                });
                io.to(responseObject.fromUsername + "-"+ responseObject.toUsername).emit("private-chat",responseObject.messageContent); 
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