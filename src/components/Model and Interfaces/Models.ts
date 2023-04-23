export interface ChatUser{
    fromUsername : string;
    toUsername: string;
    messageContent: string;
}

export interface currentUser {
    selected: Boolean;
    fromUsername: string;
    toUsername: string;
    messageContent: string;
  }
  
export interface User {
    username: string;
    email: string;
    token: string;
    socketId: string;
    currentUserSelection: currentUser;
  }