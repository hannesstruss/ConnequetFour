/*global exports: false */

var 
	http = require("http"),
	sys = require("sys"),
	url = require("url");

function Server() {
	var
		self = this,
		post_map = {},
		get_map = {},
		middlewares = [],
		server;
		
	function fail(res, code, message) {
		res.writeHead(code, {
			'Content-type': 'text/plain'
		});
		res.end(message);
	}
	
	self.add_middleware = function(middleware) {
		middlewares.push(middleware);
	};
	
	/**
	 * Apply the registered middlewares to the request/response objects
	 * Throws an error if a middleware cannot be applied
	 * @param {Object} req The request object
	 * @param {Object} res The response object
	 */
	function apply_middlewares(req, res) {
		for (var n = 0; n < middlewares.length; n++) {
			var middleware = middleware[n];
			if (!middleware.apply(req, res)) {
				throw new Error("Failure in middleware " + middleware.name);
			}
		}
	}

	function handle_request(req, res) {
		var 
			parsed_url = url.parse(req.url, true),
			handler;
			
		switch (req.method.toLowerCase()) {
			case "post":
				handler = post_map[parsed_url.pathname];
				break;
				
			case "get":
			case "head":
				handler = get_map[parsed_url.pathname];
				break;
				
			default:
				fail(res, 405, "Method not allowed");
		}
		
		if (handler) {
			var success = true;
			try {
				apply_middlewares(req, res);
			} catch (e) {
				success = false;
				fail(res, 500, e.message);
			}
			if (success) {
				handler(req, res);
			}
		} else {
			fail(res, 404, "Not found");
		}
	}
	
	this.listen = function listen(port, host) {
		server.listen(port, host);
		sys.puts("Server at http://" + (host || "127.0.0.1") + ":" + port.toString() + "/");
	};
	
	this.ok = function ok(res, content_type) {
		res.writeHead(200, {
			'Content-type': content_type || "application/json"
		});
	};
	
	this.post = function post(path, handler) {
		post_map[path] = handler;
	};
	
	this.get = function get(path, handler) {
		get_map[path] = handler;
	};
	
	function init() {
		// TODO: inject http server in constructor
		server = http.createServer(handle_request);
	}
	init();
}

function get_param_wrapper(func) {
	function wrapper(req, res) {
		var qp = url.parse(req.url, true).query;
		return func(req, res, qp);
	}
	return wrapper;
}

exports.Server = Server;
exports.get_param_wrapper = get_param_wrapper;
