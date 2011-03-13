/*global exports: false */

var
	crypto = require("crypto"),
	url = require("url");

function Client() {
	var
		_session_id;
	
	function generate_session_id() {
		var hash = crypto.createHash("sha1");
		hash.update(Math.random());
		hash.update(new Date().getTime());
		return hash.digest("hex");
	}
	
	this.get_session_id = function get_session_id() {
		return _session_id;
	};
	
	function init() {
		_session_id = generate_session_id();
	}
	
	init();
}
// TODO: purge sessions after x inactive minutes
function SessionManager() {
	var 
		_clients = {};
		
	this.register_client = function register_client(client) {
		_clients[client.get_session_id()] = client;
	};
}

function SessionMiddleware(session_manager) {
	var
		self = this;
		
	self.apply = function(req, res) {
		return true;
	};
}

exports.SessionManager = SessionManager;
exports.Client = Client;
exports.SessionMiddleware = SessionMiddleware;
