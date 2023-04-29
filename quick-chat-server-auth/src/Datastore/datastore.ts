import { Datastore } from "@google-cloud/datastore";
import { User } from "./UserModel/UserModel";
import { CommitResponse } from "@google-cloud/datastore/build/src/request";

let datastore = new Datastore({
    projectId: "superb-cycle-384321",
    keyFilename:"C:/Users/Kaushal Nijhawan/Downloads/superb-cycle.json"
});

export const addUser = async({username , password , email }:{username: string , password : string, email : string})=>{
     const taskKey = datastore.key({ namespace : "ChatUser" , path : ["User", username.toLowerCase()]});
    if(username && password && email ){
        const task = {
            key : taskKey, 
            data:{ 
                username : username ,
                password: password,
                email : email
            }
        }
       let response : CommitResponse = await datastore.save(task);
    
       return response;
    }

    return null;
  }

 export const checkUser = async (user : User): Promise<boolean> =>{
    if(user && user.username && user.email ){
        //    always mention the namespace and kind together inside the createQuery method arguments
          let query = datastore.createQuery("ChatUser", "User").filter("username" , "=" , user.username).limit(1);

          let [users] = await datastore.runQuery(query);
          if(users.length > 0 ){
            return false;
          }

          query  = datastore.createQuery("ChatUser", "User").filter("email" , "=" , user.email).limit(1);
          [users] = await datastore.runQuery(query);
          if(users.length > 0 ){
            return false;
          }
          return true;
    }
    return true;
 }  


 export const fetchUser = async(username : string , password : string) : Promise<any> =>{
      if(username && password){
          const query = datastore.createQuery("ChatUser" , "User").filter("username" , "=" , username).limit(1);

          const [user] = await datastore.runQuery(query);

          if(user.length > 0 ){
            return user[0];
          }else{
            return null;
          }
      }

      return null;
 }
=======
const datastore = new Datastore({
  projectId: "upbeat-glow-381318",
  keyFilename: "/Users/air2017/Downloads/superb-cycle.json",
});

export const addUser = async ({
  username,
  password,
  email,
}: {
  username: string;
  password: string;
  email: string;
}) => {
  const taskKey = datastore.key({ path: ["User"], namespace: "ChatUser" });
  if (username && password && email) {
    const task = {
      key: taskKey,
      data: {
        username: username,
        password: password,
        email: email,
      },
    };
    let response = await datastore.save(task);
    console.log(response);
    return response;
  }

  return null;
};