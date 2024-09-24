//require everything
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import route from "./routes/userRoutes.js";
import morgan from "morgan";

//create app
const app = express();
//body parser
app.use(express.urlencoded({extended: false}))
app.use(express.json());
//get the env
dotenv.config();
const port = process.env.PORT || 3000;
const mongo_url = process.env.MONGO_URL;
//connect mongoose
mongoose
  .connect(mongo_url)
  .then(() => {
    console.log("database connection successful");
  })
  .catch((err) => {
    console.log(err);
  });
  
app.use(morgan('tiny'));

//call api 
app.use("/api", route);

//listen server
app.listen(port, () => {
  console.log(`server is connected on port ${port}`);
});
