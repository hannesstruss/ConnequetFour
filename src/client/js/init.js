var 
	ConnectFour = ConnectFour || {},
	jQuery = jQuery || function() {};

jQuery(function($) {
	
	var connector = new ConnectFour.Connector("/cfour_be/", 
		new ConnectFour.CometListener("/cfour_be/poll"));
	var view = new ConnectFour.View("game_container", connector);
	
});
