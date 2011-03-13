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
		
		console.log("Create client: " + session_id);
	}
	
	self.__defineGetter__("session_id", function() { return session_id; });
	
	self.toString = function() {
		return '[Client session_id="' + session_id + '"]';
	};
	
	init();
}
// TODO: purge sessions after x inactive minutes
function SessionManager() {
	var 
		self = this,
		clients = {};
		
	self.register_client = function register_client(client) {
		clients[client.session_id] = client;
	};
	
	self.get_client = function(session_id) {
		return clients[session_id];
	};
	
	self.is_client_valid = function(client) {
		return client && client.session_id && !!clients[client.session_id];
	};
}

function ClientFactory() {
	var self = this;
	self.get_client = function() {
		return new Client();
	};
}

/**
 * Requires QueryParamMiddleware
 * @param {Object} session_manager
 */
function SessionMiddleware(session_manager, client_factory) {
	var
		self = this;
		
	self.apply = function(req, res) {
		var client;
		
		if (!req.queryparams.session_id) {
			client = client_factory.get_client();
			session_manager.register_client(client);
		} else {
			client = session_manager.get_client(req.queryparams.session_id);
		}
		
		req.client = client;
		
		return true;
	};
	
	self.name = self.constructor.name;
}

exports.SessionManager = SessionManager;
exports.Client = Client;
exports.SessionMiddleware = SessionMiddleware;
exports.ClientFactory = ClientFactory;
