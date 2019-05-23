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

  // Verify token
  try {
    const decode = jwt.verify(token, "FiveAlive");
    req.user = decode;
    next();
  } catch (ex) {
    res.send(ex);
  }
};
