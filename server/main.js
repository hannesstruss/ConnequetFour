var sys = require('sys'),
	http = require('http'),
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
	
	bs.listen(8124);
})();