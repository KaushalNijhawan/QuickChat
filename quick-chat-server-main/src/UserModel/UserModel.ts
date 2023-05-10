export interface User{
    username: string;
    token : string;
    email : string;
    socketId: string;
}

export interface ChatUser{
    fromUsername : string;
    toUsername: string;
    messageContent : any; 
    timestamp: number;
    Id: number;
    type: string;
    specialMessage: any;
}

export interface GroupChat{
    usernames : string[],
    groupTitle : string
}

export interface groupChatMessage{
    groupTitle: string;
    fromUsername : string;
    toUsernames: string[];
    Id: number;
    timestamp: number;
    messageContent : any;
    type: string;
    specialMessage: any;
}