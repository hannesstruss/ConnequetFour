/*global ConnectFour: false, jQuery: false */
	
(function($) {
	
	function MetaView(container, game_manager) {
		
		function new_game() {
			game_manager.start_new_game();
		}
		
		function on_new_game_started() {
			
		}
		
		function init() {
			$(game_manager).bind("cf:new_game_started", on_new_game_started);
			
			$(container).find("button.new_game").click(new_game);
		}
		init();
	}
	
	ConnectFour.MetaView = MetaView;
	
})(jQuery);
