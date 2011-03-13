/*global exports: false */

var 
	http = require("http"),
	sys = require("sys"),
	url = require("url");

function Server() {
	var
		post_map = {},
		get_map = {},
		server;
		
	function fail_404(res) {
		res.writeHead(404, {
			'Content-type': 'text/plain'
		});
		res.end("Not found");
	}

	function handle_request(req, res) {
		var parsed = url.parse(req.url, true);
		switch (req.method.toLowerCase()) {
			case "post":
				if (post_map[parsed.pathname]) {
					post_map[parsed.pathname](req, res);
				} else {
					fail_404(res);
				}
				break;
				
			case "get":
			case "head":
				if (get_map[parsed.pathname]) {
					get_map[parsed.pathname](req, res);
				} else {
					fail_404(res);
				}
				break;
				
			default:
				fail_404(res);
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
