(function() {
	var
		crypto = require("crypto");
	
	function Client() {
		var
			_session_id;
		
		function init() {
			_session_id = generate_session_id();
		}
		
		function generate_session_id() {
			var hash = crypto.createHash("sha1");
			hash.update(Math.random());
			hash.update(new Date().getTime());
			return hash.digest("hex");
		}
		
		this.get_session_id = function get_session_id() {
			return _session_id;
		}
		
		init();
	}
	
	function SessionManager() {
		var 
			_clients;
			
		function init() {
			_clients = {};
		}
		
		this.register_client = function register_client() {
			
		}
	}

	exports.SessionManager = SessionManager;
	exports.Client = Client;
})();
