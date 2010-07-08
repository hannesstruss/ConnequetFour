var sys = require('sys'),
	http = require('http'),
	cfmodel = require("./CFourModel");




	
http.createServer(function(req, res) {
	res.writeHead(200, {
		'Content-Type': 'text/html'
	});
	res.write('<br/><strong>    Heasdllo World!</strong>');
	res.end();
}).listen(8124);
				
sys.puts('Server running at http://127.0.0.1:8124/');

