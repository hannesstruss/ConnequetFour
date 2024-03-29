/*global exports: false */

var
	crypto = require("crypto"),
	url = require("url");

function Client(data_sink) {
	var
		self = this,
		session_id;
	
	function generate_session_id() {
		var hash = crypto.createHash("sha1");
		hash.update(Math.random());
		hash.update(new Date().getTime());
		return hash.digest("hex");
	}
	
	self.__defineGetter__("session_id", function() { return session_id; });
	
	self.toString = function() {
		return '[Client session_id="' + session_id + '"]';
	};
	
	self.send = function(data) {
		data_sink.send(data);
	};
	
	self.set_comet_response = function(res) {
		data_sink.add(res);
	};
	
	function init() {
		// TODO: inject session ID
		session_id = generate_session_id();
		
		console.log("Create client: " + session_id);
	}
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
		
		if (!client) {
			throw new Error("Invalid session (expired?)"); // sessions can't expire yet...
		}
		
		req.client = client;
	};
	
	self.name = self.constructor.name;
}

exports.SessionManager = SessionManager;
exports.Client = Client;
exports.SessionMiddleware = SessionMiddleware;
