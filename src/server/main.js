var sys = require('sys'),
	http = require('http'),
	url = require("url"),
	cfmodel = require("./CFourModel"),
	cfsession = require("./session"),
	cfserver = require("./server"),
	helper = require("./helper"),
	constants = require("./constants").CONSTANTS,
	CometQueue = require("./cometqueue").CometQueue;
	
(function() {
	
	var 
		session_manager = new cfsession.SessionManager(),
		server = new cfserver.Server(),
		model = new cfmodel.Game(6, 7),
		comet_queue = new CometQueue();
		
	server.add_middleware(new cfsession.SessionMiddleware(session_manager));
	server.add_middleware(new helper.QueryParamMiddleware());
	
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
		var col = parseInt(req.queryparams.col, 10);
		if (!isNaN(col)) {
			model.insert_disc(col);
			server.ok(res);
			res.end();
			comet_queue.send("0", JSON.stringify({
				op: "game_update",
				cell_data: model.get_cell_data(),
				is_reds_turn: model.is_reds_turn()
			}));
		}
		
	});
	
	server.get("/poll", function(req, res) {
		var qp = url.parse(req.url, true).query;
		
		comet_queue.add("0", res);
	});
	
	server.listen(8124);
})();