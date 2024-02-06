import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import indexRouter from "./routes/index.js";
import usersRouter from "./routes/users.js";
import boardRouter from "./routes/board.js";
import cors from 'cors';
import passport from "passport";
import session from "express-session";


const app = express();

app.use(session({
    secret: "</2aiG^bd29iC5rj)=G?mKTm",
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 60 * 60 * 1000}
}));


app.use(passport.authenticate("session"));
app.use((req, res, next) => {
    const messages = req.session.messages || [];
    res.locals.messages = messages;
    res.locals.hasMessages = !!messages.length;
    req.session.messages = [];
    next();
});



app.use(passport.initialize());



// ビューエンジンの設定
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(import.meta.dirname, "routes")));
// CORS middleware
app.use(cors({
    origin: 'http://localhost:3000', //アクセス許可するオリジン
    credentials: true, //レスポンスヘッダーにAccess-Control-Allow-Credentials追加
    // optionsSuccessStatus: 200 //レスポンスstatusを200に設定

}))

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/board", boardRouter);




export default app;
