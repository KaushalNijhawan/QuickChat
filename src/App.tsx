import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import { useEffect } from 'react';
import { BrowserRouter, Route, Routes, Navigate, redirect, useNavigation } from "react-router-dom";
import { Login } from './components/Authentication/Login/login';
import { Signup } from './components/Authentication/SignUp/SignUp';
import { ChatWindow } from './components/Chat/ChatWindow/ChatWindow';
import { store } from './components/Redux/store';
import { useDispatch } from "react-redux";

function App() {
  const dispatch = useDispatch();
  // const checkToken = (): boolean => {
  //   console.log(store.getState().user);
  //   if (store && store.getState() && store.getState().user && store.getState().user.token) {
  //     return false;
  //   } else {
  //     return true;
  //   }
  // }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signUp" element={<Signup />} />
        {/* {!checkToken() ?  */}
        <Route path="/chat" element={<ChatWindow />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
