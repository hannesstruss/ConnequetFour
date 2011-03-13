/*global ConnectFour: false, jQuery: false */
	
(function($) {
	
	function AjaxConnector(session_id, base_url) {
		var
			self = this;
		
		function get_query_string(param_map) {
			var result = [];
			
			for (var key in param_map) {
				result.push(key + "=" + param_map[key]);
			}
			
			return result.join("&");
		}
		
		function augment_params(params) {
			params = params || {};
			params.session_id = session_id;
			return params;
		}
		
		function build_url(procedure, params) {
			return base_url + "/" + procedure + "?" + get_query_string(augment_params(params)); 
		}
		
		self.get = function(procedure, callback, params) {
			return $.get(build_url(procedure, params), callback);
		};
		
		self.post = function(procedure, callback, params) {
			return $.post(build_url(procedure, params), callback);
		};
		
		console.log("Connector Created: " + session_id);
	}
	
	/**
	 * Periodically call an Ajax-URL. Call a callback when a result is returned.
	 */
	function CometListener(ajax) {
		var 
			self = this,
			callback,
			on_result,
			started = false,
			killed = false,
			xhr;
		
		function request() {
			if (!killed) {
				xhr = ajax.get("poll", on_result);
			}
		}
		
		on_result = function(data) {
			console.log(data);
			if (started) {
				request();
				callback(data);
			}
		};
		
		self.start = function() {
			started = true;
			request();
		};
		
		self.stop = function() {
			started = false;
			if (xhr) {
				xhr.abort();
			}
		};
		
		self.set_callback = function(f) {
			callback = f;
		};
		
		self.kill = function() {
			killed = true;
			self.stop();
		};
	}
	
	/**
	 * Connects to the backend
	 */
	function Connector(ajax, event_dispatcher, num_rows, num_cols) {
		var 
			self = this,
			STATES = { 
				UNSET: 0,
				RED: 1,
				YELLOW: 2
			},
			cell_data = [[]];
		
		self.insert_disc = function(colnum) {
			ajax.post("insert_disc", function() {}, {col: colnum});
		};
		
		self.get_move_nr = function() {
			return 0;
		};
		
		self.get_cell_data = function() {
			return cell_data;
		};
		
		self.is_reds_turn = function() {
			return true;
		};
		
		self.shutdown = function() {
			event_dispatcher.kill();
		};
		
		self.__defineGetter__("num_cols", function() { return num_cols; });
		self.__defineGetter__("num_rows", function() { return num_rows; });
		
		self.start = function() {
			event_dispatcher.start();
		};
		
		function trigger_update() {
			$(self).trigger("cf:update");
		}
		
		function on_comet_event(data) {
			switch (data.op) {
				case "nop":
					break;
				case "game_update":
					cell_data = data.cell_data;
					trigger_update();
					break;
			}
		}
		
		function init() {
			event_dispatcher.set_callback(on_comet_event);
			$(self).trigger("cf:ready");
		}
		init();
	}
	
	/** 
	 * Handles the creation of a new game, session data etc.
	 */
	function GameManager(init_url, connector_factory) {
		var
			self = this,
			connector;
		
		function on_game_data_received(data) {
			connector = connector_factory.get_connector(
				data.session_id, data.num_rows, data.num_cols);
			connector.start();
			$(self).trigger("cf:new_game_started");
		}
		
		function load_game_data() {
			$.post(init_url, on_game_data_received);
		}
		
		self.start_new_game = function() {
			console.log("GM: starting new game...");
			if (connector) {
				connector.shutdown();
			}
			load_game_data();
		};
		
		self.get_connector = function() {
			return connector;
		};
		
	}
	
	ConnectFour.Connector = Connector;
	ConnectFour.CometListener = CometListener;
	ConnectFour.GameManager = GameManager;
	ConnectFour.AjaxConnector = AjaxConnector;
	
})(jQuery);
