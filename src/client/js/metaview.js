/*global ConnectFour: false, jQuery: false */
	
(function($) {
	
	function MetaView(container, game_manager) {
		
		function new_game() {
			game_manager.start_new_game();
		}
		
		function init() {
			$(container).find("button.new_game").click(new_game);
		}
		init();
	}
	
	ConnectFour.MetaView = MetaView;
	
})(jQuery);
