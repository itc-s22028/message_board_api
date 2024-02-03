import express from "express";
import passport from "passport";
import { PrismaClient } from "@prisma/client";
import LocalStrategy from "passport-local";
import { generateSalt, calcHash } from "../util/scrypt.js";
import { timingSafeEqual } from "node:crypto";
import { check, validationResult } from "express-validator";
import * as scrypt from "../util/scrypt.js";

const router = express.Router();
const prisma = new PrismaClient();


passport.use(new LocalStrategy(
    {usernameField: "name", passwordField: "password"},
    async (username, password, cb) => {
      try {
        const user = await prisma.user.findUnique({
          where: {name: username}
        });
        if (!user) {
          // 指定されたユーザがデータベースにない場合
          return cb(null, false, {message: "ユーザ名かパスワードが違います"});
        }
        // あらためてリクエストに含まれるパスワードのハッシュ値を計算する
        const hashedPassword = scrypt.calcHash(password, user.salt);
        // 計算したハッシュ値と、データベースに保存されているハッシュ値の比較
        if (!timingSafeEqual(user.password, hashedPassword)) {
          // 2つのハッシュ値を比較して異なっていた場合(パスワードが間違っている)
          return cb(null, false, {message: "ユーザ名かパスワードが違います"});
        }
        // ユーザもパスワードも正しい場合
        return cb(null, user);
      } catch (e) {
        return cb(e);
      }
    }
));

// ユーザ情報をセッションに保存するルールの定義
passport.serializeUser((user, done) => {
  process.nextTick(() => {
    done(null, {id: user.id, name: user.name});
  });
});

// セッションからユーザ情報を復元するルールの定義
passport.deserializeUser((user, done) => {
  process.nextTick(() => {
    return done(null, user);
  });
});


router.get("/login", function (req, res, next) {
  const data = {
    title: "Users/Login",
    content: "名前とパスワードを入力ください"
  };
  return res.status(200).json({data});
});


/**
 * passport.js の関数を利用して認証処理をおこなう。
 */
router.post("/login", passport.authenticate("local", {
  successReturnToOrRedirect: "/",
  failureRedirect: "/users/login",
  failureMessage: true,
  keepSessionInfo: true
}));

/**
 * ログアウト処理
 */
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/users/login");
  });
});

/**
 * 新規登録のフォームを表示するだけのページ
 */
router.get("/signup", (req, res, next) => {
  const data = {
    title: "Users/Signup",
    name: "",
  };
  return res.status(200).json({data});
});

/**
 * 新規登録をする処理
 */
router.post("/signup", [
  check("name", "NAME は必ず入力してください。").notEmpty(),
  check("password", "PASSWORD は必ず入力してください。").notEmpty(),
], async (req, res, next) => {
  const result = validationResult(req);

  // 入力値チェックで問題があれば登録処理はしないで再入力を求める
  if (!result.isEmpty()) {
    const messages = result.array();
    const data = {
      title: "Users/Signup",
      name: req.body.name,
      messages,
    };
    return res.status(200).json({data: data});
  }
  // 入力値チェックに問題がなければデータ登録
  const {name, password} = req.body;
  const salt = scrypt.generateSalt();
  const hashedPassword = scrypt.calcHash(password, salt);
  const hashedPasswordString = hashedPassword.toString('hex');
  
  await prisma.user.create({
    data: {
      name,
      password: hashedPasswordString,
      salt,
    }
  });
  res.redirect("/users/login");
});



export default router;