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
    Id: number;
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
    messageContent : string;
}