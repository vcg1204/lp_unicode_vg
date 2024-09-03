// import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

// export const getUsers = async (req, res) => {
//   try {
//     const users = await User.find();
//     console.log("success");
//     return res.status(200).json(users);
//   } catch (e) {
//     res.status(404).send(e);
//   }
// };
// export const postUser = async (req, res) => {
//   const body = req.body;
//   try {
//     const result = await User.create({
//       name: body.name,
//       email: body.email,
//       number: body.number,
//     });
//     console.log("User created successfully");
//     return res.status(200).json(result);
//   } catch (e) {
//     res.status(500).send(e);
//   }
// };

// export const deleteUser = async (req, res) => {
//   try {
//     const deleteid = await User.findByIdAndDelete(req.params.id);
//     if (!req.params.id) {
//       res.status(400).send();
//     }
//     res.send(deleteid);
//     console.log("deleted successfully");
//   } catch (e) {
//     res.status(500).send(e);
//   }
// };

// export const putUser = async (req, res) => {
//   try {
//     const userUp = await User.findByIdAndUpdate(req.params.id, req.body);
//     res.send(req.body);
//   } catch (e) {
//     res.status(404).send(e);
//   }
// };

dotenv.config();
const Secret = process.env.secretkey;

const transporter = nodemailer.createTransport({
  host : "smtp.gmail.com",
  service :  "gmail",
  port: 465,
  secure : true,
  auth: {
    user : process.env.Email,
    pass : process.env.Pass
  }
});

export const signupUser = async (req, res) => {
  try {
    const { fname, lname, email, password } = req.body;
    const emailExists = await userModel.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPass = await bcrypt.hash(password, 10);
    //save new user in db
    const result = await userModel.create({
      fname,
      lname,
      email,
      password: hashedPass,
    });
    console.log("User created successfully");
    return res.status(200).json({ result });
  } catch (err) {
    res.status(500).send(err);
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userexists = await userModel.findOne({ email });
    if (!userexists) {
      return res.status(400).json({ message: "User doesnt exist" });
    }
    const match = await bcrypt.compare(password, userexists.password); //(input pw and exisiting pw)
    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({userid: userexists._id}, Secret, {expiresIn:"1h"});

    const mailInfo ={
      to: email,
      from: process.env.Email,
      subject: "Using Nodemailer",
      text: "Successfully Logged In"
    }

    transporter.sendMail(mailInfo, (err, info) => {
      if (err) {
          return res.status(500).json({ message: 'Email could not be sent', err});
      } else {
          console.log('Email sent: ' + info.response);
          res.json({ message: 'Login successful', token });
      }
  });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


