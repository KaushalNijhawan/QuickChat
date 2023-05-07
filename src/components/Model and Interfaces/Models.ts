export interface ChatUser{
    fromUsername : string;
    toUsername: string;
    messageContent: any;
    timestamp: number;
    Id: number;
    messageType: string;
}

export interface currentUser {
    selected: Boolean;
    fromUsername: string;
    toUsername: string;
    messageContent: any;
}
  
export interface User {
    username: string;
    email: string;
    token: string;
    socketId: string;
    currentUserSelection: currentUser;
}

export interface GroupChat{
  usernames : string[],
  groupTitle : string
}

export interface GroupChatMessage{
  groupTitle: string;
  fromUsername : string;
  toUsernames: string[];
  Id: number;
  timestamp: number;
  messageContent : any;
  messageType: string;
}