/*global exports: false, setTimeout: false, clearTimeout: false */

function CometQueue() {
	
	var
		self = this,
		DEFAULT_TIMEOUT = 5000,
		queue = [];
	
	// TODO: send a list of messages instead of only one per request
	self.send = function(session_id, data) {
		var queued = queue[session_id];
		clearTimeout(queued.timeout);
		queued.res.writeHead(200, {
			"Content-type": "application/json"
		});
		queued.res.end(data);
		delete queued[session_id];
	};
	
	self.add = function(session_id, res) {
		console.log("queue add: " + session_id);
		var timeout = setTimeout(function() {
			res.writeHead(200, {
				'Content-type': "application/json"
			});
			res.end(JSON.stringify({
				op: "nop"
			}));
			delete queue[session_id];
		}, DEFAULT_TIMEOUT);
		queue[session_id] = {
			res: res,
			timeout: timeout
		};
	};
}

exports.CometQueue = CometQueue;