module.exports = function (req, res) {
  var data = req.body;

  if (data.object === 'page') {
    var bot = require('../util/bot')(data);

    bot.start();
    res.sendStatus(200);
  }