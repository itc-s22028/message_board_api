const router = require("express").Router();

router.get("/login", (req, res, next) => {
  const data = {
    title: "Users/Login",
    content: "名前とパスワードを入力ください"
  };
  res.render("users/login", data);
});

module.exports = router;