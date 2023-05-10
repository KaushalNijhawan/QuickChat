import { io } from "socket.io-client";

export class SocketIO {
    socketObject: any;
    constructor() {

    }

    init = (token: string , username: string ,  email: string) => {
        if (token) {
            return io('http://35.233.134.93:4000',
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