/*global ConnectFour: false, jQuery: false */
	
(function($) {
	
	function MetaView(container, game_manager, view_factory) {
		
		function new_game() {
			game_manager.start_new_game();
		}
		
		function on_new_game_started() {
			var view = view_factory.get_view(game_manager.get_connector());
			view.start();
		}
		
		function init() {
			$(game_manager).bind("cf:new_game_started", on_new_game_started);
			
			$(container).find("button.new_game").click(new_game);
		}
		init();
	}
	
	ConnectFour.MetaView = MetaView;
	
})(jQuery);
