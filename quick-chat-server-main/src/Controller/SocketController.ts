import express from "express";
import {Server} from "socket.io";
import http from "http";
const app = express();
const router = express.Router();
const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin: '*'
    }
});

app.post("")
export default router;