import express from "express";
import session from "express-session";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import passport from "passport";
import cors from "cors";


import indexRouter from "./routes/index.js";
import usersRouter from "./routes/users.js";
// import messagesRouter from "./routes/messages.js";


const app = express();

// CORS設定
app.use(cors());


app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(import.meta.dirname, "routes")));

app.use(session({
    secret: "cOhCCpKivdc5NpqcT2y1O4jqKIpmwZsW8ib2VGRZk1qICPpT",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000, httpOnly: false } // セッションの有効期限
}));

app.use(passport.authenticate("session"));
// app.use(passportConfig(passport));

app.use("/", indexRouter);
app.use("/users", usersRouter);
// app.use("/messages", messagesRouter);



export default app;