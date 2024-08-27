import express from "express";
import {postUser, getUsers, deleteUser, putUser} from "../controllers/userController.js"

const route = express.Router();
route.post("/createUser", postUser);
route.get("/getUsers", getUsers);
route.delete("/deleteUser/:id", deleteUser);
route.put("/putUser/:id", putUser);
export default route;
