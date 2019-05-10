const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
    console.log(`Request for access into ${ req.protocol + '://' + req.get('host') + req.originalUrl}`);

    const token = req.header('auth-token');
    if (!token) return res.status(401).send('hmmmm... Where is your token?');

    try {
    const decode = jwt.verify(token, "FiveAlive");
    req.user = decode;
    next();
    }
    catch (ex) {
        return res.status(400).send('WRONG! That\'s not a valid token!');
    }
}
