var sha256 = require('sha256');


var AuthUtil = {

	generateSalt: function() {
		return sha256(JSON.stringify(new Date()));
	},

	encryptPassword: function(pwd, salt) {
		return sha256(salt + pwd);
	}
}

module.exports = AuthUtil;
