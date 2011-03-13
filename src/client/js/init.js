/*global ConnectFour: false, jQuery: false */

(function($) {
	
	var 
		connector_factory = {
			get_connector: function(session_id, num_rows, num_cols) {
				var 
					ajax_connector = new ConnectFour.AjaxConnector(session_id, "/cfour_be"),
				
					comet_listener = new ConnectFour.CometListener(ajax_connector),
				
					connector = new ConnectFour.Connector(ajax_connector, 
						comet_listener, num_rows, num_cols);
				
				return connector;
			}
		},
		
		view_factory = {
			get_view: function(connector) {
				return new ConnectFour.View($("#game_container"), connector);
			}
		},
	
		game_manager = new ConnectFour.GameManager("/cfour_be/init_game", connector_factory),
	
		meta_view = new ConnectFour.MetaView($("#meta_view"), game_manager, view_factory);
	
})(jQuery);
