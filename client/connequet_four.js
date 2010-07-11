var ConnectFour = (function(ConnectFourModel, ConnectFourView) {
	var export = {};
	
	function Game(containerID, numRows, numCols) {
		function init() {
			var game = new ConnectFourModel.Game(numRows, numCols);
			var view = new ConnectFourView.View(containerID, game);
		}
		
		init();
	}
	
	export.Game = Game;
	
	return export;
})(ConnectFourModel, ConnectFourView);
