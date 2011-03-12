var 
	ConnectFour = ConnectFour || {},
	jQuery = jQuery || function() {};
	
(function($) {
	
	function CometListener(url) {
		var 
			self = this,
			callback,
			on_result;
		
		function request() {
			$.get(url, on_result);
		}
		
		on_result = function(data) {
			request();
			callback(data);
		};
		
		self.start = function() {
			request();
		};
		
		self.stop = function() {
			// TODO implement
		};
		
		self.set_callback = function(f) {
			callback = f;
		};
	}
	
	function Connector(backend_url, event_dispatcher) {
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
		
		self.__defineGetter__("num_cols", function() { return num_cols; });
		self.__defineGetter__("num_rows", function() { return num_rows; });
		
		function init() {
			setTimeout(function() {
				event_dispatcher.set_callback(function(data) {
					console.log(data);
				});
				event_dispatcher.start();
				$(self).trigger("cf:ready");
			}, 1000);
		}
		init();
	}
	
	ConnectFour.Connector = Connector;
	ConnectFour.CometListener = CometListener;
	
})(jQuery);
