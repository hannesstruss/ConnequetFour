/*global ConnectFour: false, jQuery: false */
	
(function($) {
	
	function MetaView(container) {
		
		function new_game() {
			
		}
		
		function init() {
			$(container).find("button.new_game").click(new_game);
		}
		init();
	}
	
	ConnectFour.MetaView = MetaView;
	
})(jQuery);
