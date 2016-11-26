exports.port = process.env.PORT || 443;
exports.projectName = 'dbshackthon';
exports.mongodb = {
	uri: process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://your.db.com:27017/' + exports.projectName
};
exports.ssl = { 
	chainPath: 'chain.pem',
	fullchainPath: 'fullchain.pem',
	privkeyPath: 'privkey.pem',
	certPath: 'cert.pem'
}
exports.auth = 'your.facebook.messager.auth'
exports.PAGE_ACCESS_TOKEN = 'your.facebook.messager.token'