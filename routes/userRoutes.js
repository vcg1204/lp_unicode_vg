import express from "express";
import{getAllUsers, signupUser, loginUser,updateUser,deleteUser} from "../controllers/userController.js";
import{uploadImg, updateImg} from "../controllers/userController.js"
import{sinupCompany, loginCompany} from "../controllers/companyController.js";
import authVerify from '../middlewares/middleware.js';
import upload from "../middlewares/multer.js";
const route = express.Router();

route.get("/allUsers",authVerify,getAllUsers);
route.post("/signUp", upload.single("resume"),signupUser);
route.post("/logIn",loginUser);
route.put("/updateUser",authVerify,updateUser);
route.delete("deleteUser",authVerify,deleteUser);

route.post("/uploadImg",authVerify,upload.single("image"),uploadImg);
route.post("/updateImg",upload.single("image"),updateImg);

route.post("/singupCompany",sinupCompany )
route.post("/loginCompany", loginCompany );

export default route;
