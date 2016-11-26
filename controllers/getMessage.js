var config = require('../config');

module.exports = function(req, res) {
	if (req.query['hub.mode'] === 'subscribe' &&
	    req.query['hub.verify_token'] === config.auth) {
	    res.status(200).send(req.query['hub.challenge']);
	} else {
	    res.sendStatus(403);          
	}
}