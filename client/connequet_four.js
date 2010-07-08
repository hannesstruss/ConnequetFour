var ConnectFour = (function(ConnectFourModel) {
	var export = {};
	
	function Game(containerID, numRows, numCols) {
		function init() {
			var game = new ConnectFourModel.Game(containerID, numRows, numCols);
		}
		
		init();
	}
	
	export.Game = Game;
	
	return export;
})(ConnectFourModel);
