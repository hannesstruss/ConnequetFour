var 
	ConnectFour = ConnectFour || {},
	jQuery = jQuery || function() {};

jQuery(function($) {
	var connector = new ConnectFour.Connector("/cfour_be/");
	var view = new ConnectFour.View("game_container", connector);
	
});
