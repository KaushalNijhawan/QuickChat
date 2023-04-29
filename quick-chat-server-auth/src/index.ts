import express from "express";
import bodyParser from "body-parser";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import { addUser } from "./Datastore/datastore";

import router from "./Controller/AuthenticationRoutes";
const app = express();

app.use(bodyParser.json(), cors());

//below line is for making the /auth/** controllers to be a separate file */
app.use("/auth", router);

app.listen(3000, () => {
  console.log("Server is Started! 2.o");
});
