/*global ConnectFour: false, jQuery: false */
	
(function($) {
	
	/**
	 * Periodically call an Ajax-URL. Call a callback when a result is returned.
	 */
	function CometListener(url) {
		var 
			self = this,
			callback,
			on_result,
			started = false,
			killed = false,
			xhr;
		
		function request() {
			if (!killed) {
				xhr = $.get(url, on_result);
			}
		}
		
		on_result = function(data) {
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
	function Connector(session_id, backend_url, event_dispatcher) {
		var 
			self = this,
			STATES = { 
				UNSET: 0,
				RED: 1,
				YELLOW: 2
			},
			num_rows = 6,
			num_cols = 7;
		
		self.insert_disc = function(colnum) {
			$.post(backend_url + "insert_disc?col=" + colnum);
		};
		
		self.get_move_nr = function() {
			return 0;
		};
		
		self.get_cell_data = function() {
			return [
				[STATES.UNSET, STATES.UNSET, STATES.UNSET, STATES.UNSET, STATES.UNSET, STATES.UNSET, STATES.UNSET],
				[STATES.UNSET, STATES.UNSET, STATES.UNSET, STATES.UNSET, STATES.UNSET, STATES.UNSET, STATES.UNSET],
				[STATES.UNSET, STATES.UNSET, STATES.UNSET, STATES.UNSET, STATES.UNSET, STATES.UNSET, STATES.UNSET],
				[STATES.UNSET, STATES.UNSET, STATES.UNSET, STATES.UNSET, STATES.UNSET, STATES.UNSET, STATES.UNSET],
				[STATES.UNSET, STATES.UNSET, STATES.UNSET, STATES.UNSET, STATES.UNSET, STATES.UNSET, STATES.UNSET],
				[STATES.UNSET, STATES.UNSET, STATES.UNSET, STATES.UNSET, STATES.UNSET, STATES.UNSET, STATES.RED]
			];
		};
		
		self.is_reds_turn = function() {
			return true;
		};
		
		self.shutdown = function() {
			event_dispatcher.kill();
		};
		
		self.__defineGetter__("num_cols", function() { return num_cols; });
		self.__defineGetter__("num_rows", function() { return num_rows; });
		
		function init() {
			// TODO: remove timeout, it's only there to mock network latency
			setTimeout(function() {
				event_dispatcher.set_callback(function(data) {
					//console.log(data);
				});
				event_dispatcher.start();
				$(self).trigger("cf:ready");
			}, 1000);
		}
		init();
	}
	
	/** 
	 * Handles the creation of a new game, session data etc.
	 * @param {Object} connector_factory
	 */
	function GameManager(init_url, connector_factory) {
		var
			self = this,
			connector;
		
		function on_game_data_received(data) {
			connector = connector_factory.get_connector(data.session_id);
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
		}
		
	}
	
	ConnectFour.Connector = Connector;
	ConnectFour.CometListener = CometListener;
	ConnectFour.GameManager = GameManager;
	
})(jQuery);
