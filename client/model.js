var ConnectFourModel = (function() {
	var export = {};
	
	var State = { 
		UNSET: 0,
		RED: 1,
		YELLOW: 2
	};
	
	/**
	 * The main game model. 
	 */
	function Game(numRows, numCols) {
		Game.EVENT_TYPES = {
			WIN: "ConnectFourModel.Game.WIN",
			UPDATE: "ConnectFourModel.Game.UPDATE"
		}
		
		this.numRows = numRows;
		this.numCols = numCols;
		
		var 
			/** The game's state. A 2-dimensional field containing State.{UNSET, RED, YELLOW} */
			_cellData,
			
			/** Array of filters that are used to check whether some player has won */
			_filters,
			
			/** true if it's the red player's turn */
			_redsTurn,
			
			/** true if some player has won */
			_finished,
			
			/** incremented with each move a player conducts */
			_moveNr,
			
			_event_dispatcher;
			
		function init() {
			_event_dispatcher = new HSEvent.EventDispatcher();
			
			_cellData = initCellData();
			_filters = createFilters();
			
			_redsTurn = true;
			_finished = false;
			_moveNr = 0;
		}
		
		this.add_event_listener = function add_event_listener(type, handler) {
			_event_dispatcher.add_event_listener(type, handler);
		}
		
		function checkWinSituation() {
			for (var n = 0; n < _filters.length; n++) {
				var filter = _filters[n];
				var cells = filter.check(_cellData);
				if (cells) {
					_finished = true;
					_event_dispatcher.dispatch_event({
						type: Game.EVENT_TYPES.WIN,
						winner_cells: cells
					});
				}
			}
		}

		function createFilters() {
			var horizontal = new WinFilter([
				[1, 1, 1, 1]
			]);
			
			var vertical = new WinFilter([
				[1],
				[1],
				[1],
				[1]
			]);
			
			var diagonal1 = new WinFilter([
				[1, 0, 0, 0],
				[0, 1, 0, 0],
				[0, 0, 1, 0],
				[0, 0, 0, 1]
			]);
			
			var diagonal2 = new WinFilter([
				[0, 0, 0, 1],
				[0, 0, 1, 0],
				[0, 1, 0, 0],
				[1, 0, 0, 0]
			]);
			
			return [horizontal, vertical, diagonal1, diagonal2];
		}
		
		this.get_cell_data = function get_cell_data() {
			return _cellData;
		}
		
		this.get_event_types = function get_event_types() {
			return Game.EVENT_TYPES;
		}
		
		this.get_move_nr = function get_move_nr() {
			return _moveNr;
		}
		
		function initCellData() {
			var cellData = [];
			for (var rowNum = 0; rowNum < numRows; rowNum++) {
				var row = [];
				for (var colNum = 0; colNum < numCols; colNum++) {
					row.push(State.UNSET);
				}
				
				cellData.push(row);
			}
			return cellData;
		}
		
		/**
		 * insert a disc into the specified column.
		 * @return true if the move was possible (i.e. "something happened"), false else
		 */
		this.insertDisc = function insertDisc(colNum) {
			if (_finished) {
				return;
			}
			
			var cellValue = _redsTurn ? State.RED : State.YELLOW;
			for (var rowNum = 0; rowNum < numRows; rowNum++) {
				if (rowNum < numRows - 1 && _cellData[rowNum + 1][colNum] == State.UNSET) {
					continue;
				} else {
					if (_cellData[rowNum][colNum] == State.UNSET) {
						_cellData[rowNum][colNum] = cellValue;
						
						_moveNr++;
						checkWinSituation();
						if (!_finished) {
							_redsTurn = !_redsTurn;
						}
						
						_event_dispatcher.dispatch_event({
							type: Game.EVENT_TYPES.UPDATE
						})
						
						return true;
					}
				}
			}
			
			return false;
		}
		
		this.is_reds_turn = function is_reds_turn() {
			return _redsTurn;
		}
		
		function onCellClick(rowNum, colNum) {
			if (!_finished) {
				var legalMove = insertDisc(colNum);
				if (legalMove) {
					_redsTurn = !_redsTurn;
					checkWinSituation();
				}
			}
		}
		
		init();
	}
	
	function WinFilter(filterMatrix) {
		var _width,
			_height,
			_cells;
		
		function init() {
			_width = filterMatrix[0].length;
			_height = filterMatrix.length;
			_cells = initCells(filterMatrix);
		}
		
		/**
		 * checks if there is a winner in the given cellData array. 
		 * returns an array of {row: x, col: y} which represent the 
		 * cell positions of the cellData the winners discs are in (first found 
		 * occurence of a winning line), 
		 * null else.
		 * 
		 * @param {Array} cellData
		 */
		this.check = function check(cellData) {
			for (var offsetRow = 0; offsetRow < cellData.length - _height + 1; offsetRow++) {
				for (var offsetCol = 0; offsetCol < cellData[0].length - _width + 1; offsetCol++) {
					var contents = [];
					for (var cellIndex = 0; cellIndex < _cells.length; cellIndex++) {
						var cell = _cells[cellIndex];
						contents.push(
							cellData[offsetRow + cell.row][offsetCol + cell.col]
						);
					}
					var first = contents[0];
					var isWinner = true;
					for (var n = 1; n < contents.length; n++) {
						if (contents[n] != first || contents[n] == State.UNSET) {
							isWinner = false;
							break;
						}
					}
					
					if (isWinner) {
						var result = [];
						for (var cellIndex = 0; cellIndex < _cells.length; cellIndex++) {
							var cell = _cells[cellIndex];
							result.push({
								row: offsetRow + cell.row,
								col: offsetCol + cell.col
							});
						}
						return result;
					}
				}
			}
			return null;
		}
		
		function initCells(matrix) {
			var cells = [];
			
			for (var rowNum = 0; rowNum < matrix.length; rowNum++) {
				var row = matrix[rowNum];
				for (var colNum = 0; colNum < row.length; colNum++) {
					var colContent = row[colNum];
					if (colContent == 1) {
						cells.push({
							row: rowNum,
							col: colNum
						});
					}
				}
			}
			
			return cells;
		}
		
		init(); 
	}
	
	export.Game = Game;
	
	return export;
})();	
