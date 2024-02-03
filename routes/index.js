// import express from 'express'
// const router = express.Router();
//
// /* GET home page. */
// router.get('/', function(req, res, next) {
//   return res.status(200).json({message: "ok"});
// });
//
// module.exports = router;

import express from "express";

const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  return res.status(200).json({a: "hello"});
});

export default router;