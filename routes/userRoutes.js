import express from "express";
import{getAllUsers, signupUser, loginUser,updateUser,deleteUser} from "../controllers/userController.js";
import{uploadImg, updateImg} from "../controllers/userController.js"
import authVerify from '../middlewares/middleware.js';
import upload from "../middlewares/multer.js";
const route = express.Router();

route.get("/allUsers",authVerify,getAllUsers);
route.post("/signUp", signupUser);
route.post("/logIn",loginUser);
route.put("/updateUser",authVerify,updateUser);
route.delete("deleteUser",authVerify,deleteUser);

route.post("/uploadImg",upload.single("image"),uploadImg);
route.post("/updateImg",upload.single("image"),updateImg);

export default route;
