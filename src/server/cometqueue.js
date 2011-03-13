/*global exports: false, setTimeout: false, clearTimeout: false */

function CometQueue() {
	var
		self = this,
		DEFAULT_TIMEOUT = 5000,
		message_queue = [],
		poll;
	
	function flush() {
		clearTimeout(poll.timeout);
		poll.res.writeHead(200, {
			"Content-type": "application/json"
		});
		poll.res.end(JSON.stringify({
			messages: message_queue
		}));
	}
	
	self.send = function(data) {
		message_queue.push(data);
		
		if (poll) {
			flush();
		}
	};
	
	self.add = function(res) {
		if (poll) {
			return;
		}
		
		poll = {res: res};
		
		if (message_queue.length) {
			flush();
		} else {
			poll.timeout = setTimeout(function() {
				res.writeHead(200, {
					'Content-type': "application/json"
				});
				res.end(JSON.stringify({
					messages: [{
						op: "nop"
					}]
				}));
				poll = undefined;
			}, DEFAULT_TIMEOUT);
		}
	};
}

exports.CometQueue = CometQueue;