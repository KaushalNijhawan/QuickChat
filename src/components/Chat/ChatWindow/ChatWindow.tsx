import "./ChatWindow.css";
import { SocketIO } from "../../socket-io/socket-io";
import { Socket } from "socket.io-client";
import { store } from "../../Redux/store";
import { useEffect, useReducer, useState } from "react";
import { useDispatch } from "react-redux";
import { setConnection } from "../../Redux/ClientRedux";
import { ChatUser, User } from "../../Model and Interfaces/Models";
import { getChats } from "./commonMethods";
import { addChats } from "../../Redux/ChatsRedux";

export const ChatWindow = () => {
  let initialState: Map<String, User> = new Map();

  const [currMessage, setCurrMessgae] = useState("");
  const [toUsername, setToUsername] = useState("");
  const dispatching = useDispatch();
  
  const checkUser = (u1: { username: string, email: string }, u2: { username: string, email: string }): Boolean => {
    if (u1.username == u2.username || u1.email == u2.email) {
      return false;
    } else {
      return true;
    }
  }

  const reducer = (state: Map<String, User>, action: { type: string, payload: User }): Map<String, User> => {
    switch (action.type) {
      case "addUser":
        if (state && state.size > 0) {
          if (!state.get(action.payload.username)) {
            let newMap = new Map(state);
            newMap.set(action.payload.username, action.payload);
            state = newMap;
            return state;
          } else {
            return state;
          }
        } else {
          let newMap = new Map(state);
          newMap.set(action.payload.username, action.payload);
          state = newMap;
          return state;
        }
      case "setCurrentUser":
        return state;
      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if(store.getState().user && store.getState().user.username){
      getChats().then((res: ChatUser[])=>{
        dispatching(addChats(res));   
      });
    }
    
    handlejoinSocket();
    console.log(store.getState().chat);
  }, [state]);
  const handlejoinSocket = async () => {
    if (store.getState().user && store.getState().user.token && store.getState().user.email && store.getState().user.username
    ) {
      let response: any = new SocketIO().init(store.getState().user.token, store.getState().user.username, store.getState().user.email);
      dispatching(setConnection(response));
      response.emit("new-join", store.getState().user);
      getListUsersConnected(response);
      return () => {
        response.disconnect();
      }
    }
  }


  const getListUsersConnected = (io: Socket) => {
    io.on("update", function (userList: User[]) {
      if (userList && userList.length > 0 && store.getState().user) {
        userList.map((user) => {
          if (checkUser(user, store.getState().user)) {
            dispatch({ type: "addUser", payload: user });
          }
        });
      }
    });
  }


  const handleChatClick = (e : React.MouseEvent , username: string) => {
    if (username) {
      setToUsername(username);
    }
  }

  const handleSendButton = (e: any) => {
    e.preventDefault();
    if (store.getState().socket && store.getState().socket.io && currMessage && store.getState().user.username && toUsername) {
      let socket = store.getState().socket.io;
      console.log(store.getState().socket.io);
      socket.emit("private-message", {
        fromUsername: store.getState().user.username,
        toUsername: toUsername,
        messageContent: currMessage,
        timeStamp : new Date().valueOf()
      });

      socket.on("private-chat", (message: any) => {
        console.log(message);
      })
    }
  }

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h4>Hey, {store.getState().user.username}</h4>
            </div>
            <div className="card-body">
              <ul className="list-group">
                {Array.from(state.values()).map((user: User) => {
                  return <li className="btn btn-outline-secondary" onClick={(e) => handleChatClick(e,user.username)}>{user.username}</li>
                })}
                {/* <li className="list-group-item">John Doe {state.length}</li>
                <li className="list-group-item">Jane Doe</li>
                <li className="list-group-item">Bob Smith</li> */}
                {/* <!-- Add more contacts here --> */}
              </ul>
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <div className={toUsername ? "card" : "card opacity-50"}>
            <div className="card-header">
              {toUsername ? <h4>Chat with {toUsername}!</h4> : <h4>Let's Beign Chat Guys!</h4>}
            </div>
            <div className="card-body chat-container">
              {/* <div className="mb-3">
                <div className="d-flex justify-content-end">
                  <div className="bg-primary text-white p-2 rounded">
                    <p>Hello, how can I help you?</p>
                  </div>
                </div>
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-start">
                  <div className="bg-secondary text-white p-2 rounded">
                    <p>Hi, I have a question about your product.</p>
                  </div>
                </div>
              </div> */}
              {toUsername && currMessage ? null : <div className="mb-3">
                <div className="d-flex justify-content-center">
                  <div className="text-black p-2 rounded">
                    <p>Let's begin Your Chat!</p>
                  </div>
                </div>
              </div>}

            </div>
            <div className="card-footer">
              <form>
                <div className="input-group">
                  <input type="text" className="form-control" placeholder="Type your message..." onChange={(e) => setCurrMessgae(e.target.value)} />
                  <button className="btn btn-primary"><i className="bi bi-arrow-up" style={{ fontSize: "30px" }}
                    onClick={(e) => handleSendButton(e)}></i></button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

