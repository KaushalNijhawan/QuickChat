import {io} from "socket.io-client";

export class SocketIO{
    socketObject: any;
    constructor(){
        
    }

    init = () =>{
        return io('http://localhost:4000');

    }

}