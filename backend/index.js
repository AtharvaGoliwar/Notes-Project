import express from "express";
// const expressLayouts = require("express-ejs-layouts")
import passport from "passport";
import { Strategy } from "passport-jwt";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken"
import cors from "cors"
import MongoStore from "connect-mongo";
import { authRouter } from "./routes/authRoute.js";
import { router } from "./routes/homeRoute.js";
import { connectDB } from "./config/db.js";
import session from "express-session";
import 'dotenv/config'

const app = express()
const PORT = 8800 || process.env.PORT
// const dbURL = process.env.MONGODB_URL

//Database connection
connectDB()

// app.use(session({
//   secret:"abc123secret",
//   resave:false,
//   saveUninitialized:true,
//   store: MongoStore.create({
//     mongoUrl: process.env.MONGODB_URL
//   })
// }))

app.use(passport.initialize())
// app.use(passport.session())
app.use(cookieParser(process.env.COOKIEKEY));
app.use(express.urlencoded({extended:true}))
app.use(express.json())

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PUT, PATCH, DELETE"
//   );
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   next();
// });



// Apply CORS middleware to allow all origins
// app.use(cors({
//   origin: 'http://localhost:5173', // Allow all origins
//   credentials: true, // Allow credentials (cookies, authorization headers, etc.)
//   optionsSuccessStatus:200
// }));

// // Handle preflight requests
// app.options('*', cors({
//   origin: '*', // Allow all origins
//   credentials: true // Allow credentials
// }));

// const allowedOrigins = ['http://localhost:5173']
// app.use(cors({
//     origin: (origin, callback) => {
//       // Allow requests with no origin (like mobile apps, curl, etc.)
//       if (!origin) return callback(null, true);
//       if (allowedOrigins.includes(origin)) {
//         return callback(null, true);
//       } else {
//         const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
//         return callback(new Error(msg), false);
//       }
//     },
//     credentials: true
//   }));

app.use(cors({
  origin: 'http://localhost:5173', // React app URL
  credentials: true
}));

// app.get("/",(req,res)=>{
//     res.json({message:"Hello World"})
// })

//Routes
app.use("/",router)
app.use("/",authRouter)


app.listen(PORT,()=>{
    console.log("Connected to backend at port",PORT)
})