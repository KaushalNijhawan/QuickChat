
export class User{
    username: string;
    password: string;
    email : string;
    token: string;
    Id: string;
    constructor(username : string , password : string  , email : string , token : string , Id : string){
        this.username = username;
        this.password = password;
        this.email = email;
        this.token = token;
        this.Id = Id;
    }
}