const express = require("express");
const router = express.Router();
const path = require("path");

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render(path.resolve(__dirname, "../public/index.html"), {
    title: "Express"
  });
});

module.exports = router;
