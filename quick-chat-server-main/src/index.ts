import express from 'express';
import bodyParser from 'body-parser';
import {Server} from "socket.io";
import http from "http";
import cors from "cors";
import { addUser } from './Datastore/datastore';
const app = express();

app.use(bodyParser.json(), cors());

const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin: '*'
    }
});

io.listen(4000);
io.on("connection" , (socket)=>{
    console.log(`user joined the chat! with id ${socket.id}`);

    socket.on('new-join' , (s)=>{
        console.log(s);
    });
});

app.get("/", (req, res)=>{
    res.send("Helllo from Chat!!");
});

app.listen(3001 , ()=>{
    console.log("Server is Started! 1.o");
});