var ConnectFour = (function(ConnectFourModel, ConnectFourView) {
	var exports = {};
	
	function Game(containerID, numRows, numCols) {
		function init() {
			var game = new ConnectFourModel.Game(numRows, numCols);
			var view = new ConnectFourView.View(containerID, game);
		}
		
		init();
	}
	
	exports.Game = Game;
	
	return exports;
})(ConnectFourModel, ConnectFourView);
