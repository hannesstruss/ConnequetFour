(function() {
	var sys = require('sys'),
		http = require('http'),
		querystring = require("querystring"),
		cfmodel = require("./CFourModel"),
		cfsession = require("./session"),
		bootstrap = require("./bootstrap");
	
	var session_manager = new cfsession.SessionManager();
	
	var bs = new bootstrap.Bootstrap();
	bs.listen(8124);
})();