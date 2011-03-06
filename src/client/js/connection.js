var 
	ConnectFour = ConnectFour || {},
	jQuery = jQuery || function() {};
	
(function($) {
	
	function Connector(backend_url) {
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
			setTimeout(function() {
				$(self).trigger("cf:update");
			}, 1000);
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
		}
		
		self.__defineGetter__("num_cols", function() { return num_cols; });
		self.__defineGetter__("num_rows", function() { return num_rows; });
	}
	
	ConnectFour.Connector = Connector;
	
})(jQuery);
