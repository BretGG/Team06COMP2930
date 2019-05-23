const jwt = require("jsonwebtoken");
const path = require("path");

module.exports = function(req, res, next) {
  console.log(
    `Request for access into ${req.protocol +
      "://" +
      req.get("host") +
      req.originalUrl}`
  );

  const token = req.header("auth-token");
  if (!token) res.render(path.resolve(__dirname, "../public/views/index.html"));

  try {
    const decode = jwt.verify(token, "F1veAl1ve");
    req.user = decode;
    next();
  } catch (ex) {
    res.send(ex);
  }
};
