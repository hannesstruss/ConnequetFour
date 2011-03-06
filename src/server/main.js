var sys = require('sys'),
	http = require('http'),
	url = require("url"),
	cfmodel = require("./CFourModel"),
	cfsession = require("./session"),
	cfserver = require("./server");
	
(function() {
	
	var 
		session_manager = new cfsession.SessionManager(),
		server = new cfserver.Server();
	
	server.post("/register_session", function(req, res) {
		var client = new cfsession.Client();
		session_manager.register_client(client);
		
		var result = {
			session_id: client.get_session_id()
		};
		
		server.ok(res);
		res.end(JSON.stringify(result));
	});
	
	server.get("/poll", function(req, res) {
		var qp = url.parse(req.url, true).query;
		
		setTimeout(function() {
			server.ok(res);
			res.end(JSON.stringify({
				op: "nop"
			}));
		}, 20000);
	});
	
	server.listen(8124);
})();