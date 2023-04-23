export interface User{
    username: string;
    token : string;
    email : string;
    socketId: string;
}

export interface ChatUser{
    fromUsername : string;
    toUsername: string;
    messageContent : string; 
    timestamp: number;
}
