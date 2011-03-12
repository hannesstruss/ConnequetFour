var sys = require('sys'),
	http = require('http'),
	url = require("url"),
	cfmodel = require("./CFourModel"),
	cfsession = require("./session"),
	cfserver = require("./server")
	constants = require("./constants").CONSTANTS;
	
(function() {
	
	var 
		session_manager = new cfsession.SessionManager(),
		server = new cfserver.Server(),
		model = new cfmodel.Game(6, 7);
	
	server.post("/init_game", function(req, res) {
		var client = new cfsession.Client();
		session_manager.register_client(client);
		
		var result = {
			session_id: client.get_session_id(),
			num_rows: constants.num_rows,
			num_cols: constants.num_cols
		};
		
		server.ok(res);
		res.end(JSON.stringify(result));
	});
	
	server.post("/insert_disc", function(req, res) {
		var qp = url.parse(req.url, true).query;
		
		var col = parseInt(qp.col, 10);
		if (!isNaN(col)) {
			model.insert_disc(col);
			server.ok(res);
			res.end();
		}
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