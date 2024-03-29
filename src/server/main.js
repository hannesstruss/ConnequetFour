var sys = require('sys'),
	http = require('http'),
	url = require("url"),
	cfmodel = require("./CFourModel"),
	cfsession = require("./session"),
	cfserver = require("./server"),
	helper = require("./helper"),
	constants = require("./constants").CONSTANTS,
	CometQueue = require("./cometqueue").CometQueue,
	
	session_manager = new cfsession.SessionManager(),
	server = new cfserver.Server(),
	model = new cfmodel.Game(6, 7),

	client_factory = {
		get_client: function() {
			return new cfsession.Client(new CometQueue());
		}
	};

server.add_middleware(new helper.QueryParamMiddleware());
server.add_middleware(new cfsession.SessionMiddleware(session_manager, client_factory));

server.post("/init_game", function(req, res) {
	var result = {
		session_id: req.client.session_id,
		num_rows: constants.num_rows,
		num_cols: constants.num_cols
	};
	
	server.ok(res);
	res.end(JSON.stringify(result));
});

server.post("/insert_disc", function(req, res) {
	var col = parseInt(req.queryparams.col, 10);
	console.log("Insert disc: " + col);
	if (!isNaN(col)) {
		model.insert_disc(col);
		server.ok(res);
		res.end();
		req.client.send({
			op: "game_update",
			cell_data: model.get_cell_data(),
			is_reds_turn: model.is_reds_turn()
		});
	} else {
		server.fail(res, 400, "Bad/missing parameter col");
	}
});

server.get("/poll", function(req, res) {
	console.log("Poll: " + req.client);
	req.client.set_comet_response(res);
});

server.listen(8124);
