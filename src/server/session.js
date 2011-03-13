/*global exports: false */

var
	crypto = require("crypto"),
	url = require("url");

function Client() {
	var
		self = this,
		session_id;
	
	function generate_session_id() {
		var hash = crypto.createHash("sha1");
		hash.update(Math.random());
		hash.update(new Date().getTime());
		return hash.digest("hex");
	}
	
	function init() {
		// TODO: inject session ID
		session_id = generate_session_id();
	}
	
	self.__defineGetter__("session_id", function() { return session_id; });
	
	init();
}
// TODO: purge sessions after x inactive minutes
function SessionManager() {
	var 
		clients = {};
		
	this.register_client = function register_client(client) {
		clients[client.session_id] = clients;
	};
}

/**
 * Requires QueryParamMiddleware
 * @param {Object} session_manager
 */
function SessionMiddleware(session_manager) {
	var
		self = this;
		
	self.apply = function(req, res) {
		if (!req.queryparams.session_id) {
			console.log("no session id!");
		}
		
		return true;
	};
	
	self.name = self.constructor.name;
}

exports.SessionManager = SessionManager;
exports.Client = Client;
exports.SessionMiddleware = SessionMiddleware;
