var config = require('../config');
var request = require('request');
var async = require("async");

function parseTextMessage (recipientId, messageText) {
	if (/(hi)/i.test(messageText) || /(嗨)/.test(messageText)) {
		var special = false;
		var messageData = {
              recipient: {
                id: recipientId
              },
              message: {
                attachment: {
                  type: "template",
                  payload: {
                    template_type: "button",
                    text: "您想要什麼樣的服務？",
                    buttons: [{
                      title: "個人金融",
                      type: "postback",
                      payload: "personal_finance"
                    }, {
                      title: "企業金融",
                      type: "postback",
                      payload: "bussiness_finance"
                    }, {
                      title: "星展最新消息",
                      type: "postback",
                      payload: "dbs_news"
                    }]
                  }
                }
              }
            };
	} else if (/(investment)/i.test(messageText) || /(投資)/.test(messageText)) {
		var messageData = {
              recipient: {
                id: recipientId
              },
              message: {
                attachment: {
                  type: "template",
                  payload: {
                    template_type: "button",
                    text: "那可以先請問你的風險屬性嗎？",
                    buttons: [{
                      title: "積極型",
                      type: "postback",
                      payload: "aggresive"
                    }, {
                      title: "保守型",
                      type: "postback",
                      payload: "normal"
                    }, {
                      title: "穩健型",
                      type: "postback",
                      payload: "health"
                    }]
                  }
                }
              }
            };
	} else if (/(aggresive)/i.test(messageText) || /(積極型)/.test(messageText)) {
		var messageData = {
              recipient: {
                id: recipientId
              },
              message: {
                attachment: {
                  type: "template",
                  payload: {
                    template_type: "generic",
                    elements: [{
                        title: "積極型投資組合",
                        item_url: "http://www.dbs.com.tw/treasures-zh/investments/asset-allocation/aggressive-portfolio",
                        image_url: "http://www.dbs.com.tw/iwov-resources/images/investments/tw-treasures/05_Aggressive-Detail-tw-zh.PNG"
                    }]
                  }
                }
              }
            };
	} else if (/(trump)/i.test(messageText) || /(川普)/.test(messageText)) {
		var messageData = {
              recipient: {
                id: recipientId
              },
              message: {
                attachment: {
                  type: "template",
                  payload: {
                  	template_type: "generic",
                    elements: [{
                        title: "川普研究報告",
                        item_url: "http://www.dbs.com.tw/treasures-zh/investments/asset-allocation/aggressive-portfolio",
                        image_url: "https://s3-ap-northeast-1.amazonaws.com/bonweb-assets/images/trump.jpg",
                        buttons: [{
                          title: "連結",
                          type: "postback",
                          payload: "link"
                        }]
                    }]
                  }
                }
              }
            };
	} else if (/(gold)/i.test(messageText) || /(黃金)/.test(messageText)) {
		var messageData = {
              recipient: {
                id: recipientId
              },
              message: {
                attachment: {
                  type: "template",
                  payload: {
                  	template_type: "generic",
                    elements: [{
                        title: "黃金走勢圖",
                        item_url: "http://www.dbs.com.tw/treasures-zh/investments/asset-allocation/aggressive-portfolio",
                        image_url: "https://s3-ap-northeast-1.amazonaws.com/bonweb-assets/images/IMG_0843.JPG",
                        buttons: [{
                          title: "連結",
                          type: "postback",
                          payload: "link"
                        }]
                    }]
                  }
                }
              }
            };
	} else if (/(fund)/i.test(messageText) || /(基金)/.test(messageText)) {
		var messageData = {
              recipient: {
                id: recipientId
              },
              message: {
                attachment: {
                  type: "template",
                  payload: {
                    template_type: "button",
                    text: "這邊找到三個基金",
                    buttons: [{
                      title: "貝萊德世界金融A2-EUR 2016/11/17 基金淨值19.02",
                      type: "web_url",
                      url: "https://internet-banking.dbs.com.tw/tw/retail/logon"
                    }, {
                      title: "柏瑞日本小型公司股票A3 2016/11/17 基金淨值5304.55",
                      type: "web_url",
                      url: "https://internet-banking.dbs.com.tw/tw/retail/logon"
                    }, {
                      title: "聯博-日本策略價值AD月配紐幣避險級別(基金之配息來源可能為本金) 2016/11/17 基金淨值15.95",
                      type: "web_url",
                      url: "https://internet-banking.dbs.com.tw/tw/retail/logon"
                    }]
                  }
                }
              }
            };
            special = true;
	} else {
		var messageData = {
              recipient: {
                id: recipientId
              },
              message: {
                attachment: {
                  type: "template",
                  payload: {
                    template_type: "button",
                    text: "我們聽不懂您說的話, 如果有任何問題歡迎跟我們聯繫！",
                    buttons: [{
                       "type":"phone_number",
                       "title":"Call",
                       "payload":"+8860266129889"
                    }]
                  }
                }
              }
            };
	}
	sendResponse(messageData, special);
}

function sendAction(recipientId, action, callback) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages?access_token=' + config.PAGE_ACCESS_TOKEN,
    method: 'POST',
    json: {
      "recipient":{
  	    "id": recipientId
      },
      "sender_action": action
    }
  }, function (error, response, body) {
    // if (!error && response.statusCode == 200) {
    // } else {
    // }
    callback(null);
  });
}

function sendResponse(messageData, special) {
  async.series({
    beforeSendResponse: function (cb) {
      callSendAction(messageData.recipient.id, "typing_on", cb);
    },
    sendResponse: function (cb) {
      request({
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: config.PAGE_ACCESS_TOKEN },
        method: 'POST',
        json: messageData
      }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var recipientId = body.recipient_id;
          var messageId = body.message_id;
        } else {
          console.log(error);
        }
        if (special) {
          var sMessageData = {
                  recipient: {
                    id: recipientId
                  },
                  message: {
                    attachment: {
                      type: "template",
                      payload: {
                        template_type: "button",
                        text: "我們偵測到您來自新加坡！請問在台灣旅費還足夠嗎？有需要使用換匯服務嗎？",
                        buttons: [{
                           "type":"postback",
                           "title":"要",
                           "payload":"要"
                        }, {
                           "type":"postback",
                           "title":"不要",
                           "payload":"不要"
                        }]
                      }
                    }
                  }
                };
            setTimeout(function () {
              callSendAPI(sMessageData, false, function(){});
            }, 20000);
        }
      });
    },
    afterSendResponse: function (cb) {
      callSendAction(messageData.recipient.id, "typing_off", cb);
    }
  }, function (error, results) {
    if (error) {
      // log or anything you want to do 
    } else {
      // log or anything you want to do
    }
  });
}

function receivedPostback(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfPostback = event.timestamp;
  var payload = event.postback.payload;

  sendTextMessage(senderID, "Postback called");
}

function sendTextMessage(recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  };

  callSendAPI(messageData);
}

function receivedMessage(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;
  var messageId = message.mid;
  var messageText = message.text;
  var messageAttachments = message.attachments;

  if (messageText) {
    parseTextMessage(senderID, messageText);
  } else if (messageAttachments) {
  }
}

module.exports = function (req, res) {
  var data = req.body;

  if (data.object === 'page') {

    data.entry.forEach(function(entry) {
      var pageID = entry.id;
      var timeOfEvent = entry.time;

      entry.messaging.forEach(function(event) {
        if (event.message) {
          receivedMessage(event);
        }
      });
    });

    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
}