import "./ChatWindow.css";
import { SocketIO } from "../../socket-io/socket-io";
import { Socket } from "socket.io-client";
import { store } from "../../Redux/store";
import { useEffect, useReducer, useState } from "react";
import { useDispatch } from "react-redux";
import { setConnection } from "../../Redux/ClientRedux";
import { ChatUser, User } from "../../Model and Interfaces/Models";
import { getChats, provideClassPlacement, provideTextHighlight } from "./commonMethods";
import { addChats, appendChat } from "../../Redux/ChatsRedux";

export const ChatWindow = () => {
  let initialState: Map<String, User> = new Map();
  const [chats, setChats] = useState<ChatUser>();
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

  const getChat = () => {
    getChats().then((res: ChatUser[]) => {
      dispatching(addChats(res));
    });
  }

  useEffect(() => {
    handlejoinSocket();
  }, [state, store.getState().chat]);

  useEffect(() => {
    getChat();
    let socket = store.getState().socket.io;
    handlePrivateChat("" , "" , socket);
  }, []);

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

  const handleChatClick = (e: React.MouseEvent, username: string) => {
    if (username) {
      setToUsername(username);
    }
  }

  const handleSendButton = (e: any) => {
    e?.preventDefault();
    let socket: Socket = store.getState().socket.io;
    handlePrivateChat(toUsername , currMessage , socket);
  }

  const handlePrivateChat = (toUsername: string , messageContent : string , socket : Socket) =>{
    socket.emit("private-message", {
      fromUsername: store.getState().user.username,
      toUsername: toUsername,
      messageContent: currMessage,
      timeStamp: new Date().valueOf(),
      Id: store.getState().chat.length + 1
    });
    socket.on("private-chat", (message: ChatUser) => {
      dispatching(appendChat(message));
       setChats(message);
      console.log(message);
    });
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
                {Array.from(state.values()).map((user: User, index: number) => {
                  return <li className="btn btn-outline-secondary" key={index} onClick={(e) => handleChatClick(e, user.username)}>{user.username}</li>
                })}
              </ul>
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <div className={toUsername ? "card" : "card opacity-50"}>
            <div className="card-header">
              {toUsername ? <h4>Chat with {toUsername}!</h4> : <h4>Welcome to QuickChat Service!
                 You can start the wonderful Chat Service with a simple Hi!</h4>}
            </div>
            <div className="card-body chat-container">
              {toUsername ? store.getState().chat.map((chatObj: ChatUser, index: number) => {
                return (
                  <div className="mb-3" key={index}>
                    <div className={provideClassPlacement(chatObj, toUsername)}>
                      <div className={provideTextHighlight(chatObj, toUsername)}>
                        <p>{provideTextHighlight(chatObj, toUsername) ? chatObj.messageContent : null}</p>
                      </div>
                    </div>
                  </div>
                )
              }) : <div className="mb-3">
                <div className="d-flex justify-content-center">
                  <div className="text-black p-2 rounded">
                    <p>Let's begin the Chat!</p>
                  </div>
                </div>
              </div>}

            </div>
            <div className="card-footer">
              <form>
                <div className="input-group">
                  <input type="text" className="form-control" placeholder="Type your message..." onChange={(e) => setCurrMessgae(e.target.value)} />
                  <button className="btn btn-primary" onClick={(e) => handleSendButton(e)}><i className="bi bi-arrow-up" style={{ fontSize: "30px" }}></i></button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

