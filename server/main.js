var sys = require('sys'),
	http = require('http'),
	url = require("url"),
	cfmodel = require("./CFourModel"),
	cfsession = require("./session"),
	bootstrap = require("./bootstrap");
	
(function() {
	
	var session_manager = new cfsession.SessionManager();
	
	var bs = new bootstrap.Bootstrap();
	
	bs.post("/register_session", function(req, res) {
		var client = new cfsession.Client();
		session_manager.register_client(client);
		
		var result = {
			session_id: client.get_session_id()
		};
		
		bs.ok(res, "application/json");
		res.end(JSON.stringify(result));
	});
	
	bs.get("/poll", function(req, res) {
		var qp = url.parse(req.url, true).query;
		console.log(JSON.stringify(qp));
		
		setTimeout(function() {
			bs.ok(res, "application/json");
			res.end(JSON.stringify({
				op: "nop"
			}));
		}, 20000);
	});
	
	bs.listen(8124);
})();