import express from "express";
import passport from "passport";
import { PrismaClient } from "@prisma/client";
import LocalStrategy from "passport-local";
import { check, validationResult } from "express-validator";
import * as scrypt from "../util/auth.js";

const router = express.Router();
const prisma = new PrismaClient();

passport.use(new LocalStrategy(
    async (username, password, done) => {
      try {
        const user = await prisma.user.findUnique({ where: { name: username } });

        if (!user) {
          return done(null, false, { message: 'ユーザーが見つかりません' });
        }

        const hashedPassword = scrypt.calcHash(password, user.salt).toString('hex');
        if (hashedPassword !== user.password) {
          return done(null, false, { message: 'パスワードが一致しません' });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
));

passport.serializeUser((user, done) => {
  process.nextTick(() => {
    done(null, { id: user.id, name: user.name });
  });
});

passport.deserializeUser((user, done) => {
  process.nextTick(() => {
    done(null, user);
  });
});

const checkAuthentication = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.status(200).json({ message: "logged in" });
  } else {
    return res.status(401).json({ message: "unauthenticated" });
  }
};


router.get("/", checkAuthentication, (req, res) => {
  // 必要に応じて追加のロジックを記述
  res.json({ message: "このルートにアクセスできます。" });
});

router.get("/login", (req, res, next) => {
  const data = {
    title: "Users/Login",
    content: "名前とパスワードを入力してください"
  };
  if (req.isAuthenticated()) {
    return res.status(200).json({ message: "OK" , user: req.user});
  } else {
    return res.status(401).json({ message: "name and/or password is invalid"});
  }
});

router.post("/login", passport.authenticate("local", {
  successReturnToOrRedirect: "/users/normally",
  failureRedirect: "/users/error",
  failureMessage: true,
  keepSessionInfo: true
}), (req, res, next) => {
  try {
    // ログイン成功後にユーザー情報を取得
    const user = req.user;

    // ユーザー情報をボードに渡す処理
    const username = user.name;

    // ボードへのリダイレクト
    res.redirect(`/board?username=${username}`);
  } catch (error) {
    console.error('ログイン成功後の処理エラー:', error);
    res.redirect("/users/error");
  }
});

router.get("/board", (req, res) => {
  // リクエストからユーザー情報を取得
  const username = req.query.username;

  // ここで必要な処理を行う
  res.render("board", { username });
});

router.get("/error", (req, res, next) => {
  res.json({message: "name and/or password is invalid"})
})

router.get("/normally", (req, res, next) => {
  res.json({message: "OK"})
})

router.get("/logout", (req, res, next) => {
  const LoginInfo = req.query.username

  return res.status(200).json({LoginInfo});
});

router.get("/signup", (req, res, next) => {
  const data = {
    title: "Users/Signup",
    content: "新規登録",
    name: "",
    password:"",
  };
  return res.status(200).json({ data });
});

router.post("/signup", [
  check("name", "NAME は必ず入力してください。").notEmpty(),
  check("password", "PASSWORD は必ず入力してください。").notEmpty(),
], async (req, res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const messages = result.array();
    const data = {
      title: "Users/Signup",
      name: req.body.name,
      messages,
    };
    return res.status(400).json({ data });
  }

  const { name, password } = req.body;
  const salt = scrypt.generateSalt();
  const hashedPassword = scrypt.calcHash(password, salt);
  const hashedPasswordString = hashedPassword.toString('hex');

  try {
    const newUser = await prisma.user.create({
      data: {
        name,
        password: hashedPasswordString,
        salt,
      }
    });

    req.login(newUser, async (loginErr) => {
      if (loginErr) {
        console.error("ログインエラー:", loginErr);
        return res.status(500).json({ message: "サインアップとログインに失敗しました" });
      }

      // ログイン成功後の処理をここに移動
      return res.status(201).json({ message: "created!" });
    });
  } catch (error) {
    console.error("新規登録エラー:", error);
    return res.status(500).json({ message: "サインアップに失敗しました" });
  }
});

export default router;
