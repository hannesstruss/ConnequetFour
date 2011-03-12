/*global ConnectFour: false, jQuery: false */

(function($) {
	
	var 
		connector_factory = {
			get_connector: function() {
				return new ConnectFour.Connector("/cfour_be/", 
					new ConnectFour.CometListener("/cfour_be/poll"));
			}
		},
	
		game_manager = new ConnectFour.GameManager(connector_factory),
	
		meta_view = new ConnectFour.MetaView($("#meta_view"), game_manager);
	
	//var view = new ConnectFour.View("game_container", connector);
	
})(jQuery);
