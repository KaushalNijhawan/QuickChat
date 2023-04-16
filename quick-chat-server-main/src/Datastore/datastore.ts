import {Datastore} from "@google-cloud/datastore";

const datastore = new Datastore({
    projectId: "upbeat-glow-381318",
    keyFilename:"C:/Practice Project/ATSE-2/quick-chat-server/credentials/upbeat-glow.json"
});

export const addUser = async({username , password , email}:{username: string , password : string, email : string})=>{
     const taskKey = datastore.key({path : ["User"] ,  namespace : "ChatUser"});
    if(username && password && email ){
        const task = {
            key : taskKey, 
            data:{
                username : username ,
                password: password,
                email : email
            }
        }
       let response  = await datastore.save(task);
       return response;
    }

    return null;
  }

