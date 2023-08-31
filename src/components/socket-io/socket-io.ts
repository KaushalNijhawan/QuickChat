import { io } from "socket.io-client";
import { Constants } from "../../Constants/Constants";

export class SocketIO {
    socketObject: any;
    constructor() {

    }

    init = (token: string , username: string ,  email: string) => {
        console.log(token);
        console.log(username);
        console.log(email);
        if (token) {
            console.log(token);
            return io(`http://${Constants.CHAT_MAIN_IP}:4000`,
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