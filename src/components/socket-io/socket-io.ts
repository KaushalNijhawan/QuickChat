import { io } from "socket.io-client";

export class SocketIO {
    socketObject: any;
    constructor() {

    }

    init = (token: string , username: string ,  email: string) => {
        if (token) {
            return io('http://34.168.174.126:4000',
                {
                    auth: {
                        token: token,
                        username: username,
                        email : email
                    }
                }
            );
        }
        return null;
    }

}