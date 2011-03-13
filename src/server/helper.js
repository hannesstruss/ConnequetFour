/*global exports: false */

var
	url = require("url");

function QueryParamMiddleware() {
	var
		self = this;
		
	self.apply = function(req, res) {
		req.queryparams = url.parse(req.url, true).query;
		return true;
	};
}

exports.QueryParamMiddleware = QueryParamMiddleware;
