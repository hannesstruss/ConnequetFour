var http = require("http"),
	sys = require("sys");


function Bootstrap() {
	var
		_post_map,
		_server;
		
	function init() {
		_post_map = {};
		
		_server = http.createServer(handle_request);
	}

	function handle_request(req, res) {
		switch (req.method.toLowerCase()) {
			case "post":
				console.log("POST");
				break;
			case "get":
				console.log("GET");
				break;
		}
		
		res.writeHead(200, {
			'Content-Type': 'text/html'
		});
		
		res.end("XXX");
	}
	
	this.listen = function listen(port, host) {
		_server.listen(port, host);
		sys.puts("Server at http://" + (host || "127.0.0.1") + ":" + port.toString() + "/");
	}
	
	this.post = function post(path, handler) {
		_post_map[path] = handler;
	}
	
	init();
}

exports.Bootstrap = Bootstrap;
