import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import { useEffect } from 'react';
import { SocketIO } from './components/socket-io/socket-io';
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Login } from './components/Authentication/Login/login';
import { Signup } from './components/Authentication/SignUp/SignUp';
import { ChatWindow } from './components/Chat/ChatWindow/ChatWindow';
import { store } from './components/Redux/store';
import { useDispatch } from "react-redux";
import { setConnection } from './components/Redux/ClientRedux';
function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    let connection : any = new SocketIO().init();
    console.log(connection);
    dispatch(setConnection( connection));
    console.log(store.getState());
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signUp" element={<Signup />} />
        <Route path="/chat" element = {<ChatWindow/>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
