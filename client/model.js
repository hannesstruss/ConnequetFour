var ConnectFourModel = (function() {
	var exports = {};
	
	var State = { 
		UNSET: 0,
		RED: 1,
		YELLOW: 2
	};
	
	/**
	 * The main game model. 
	 */
	function Game(num_rows, num_cols) {
		Game.EVENT_TYPES = {
			WIN: "ConnectFourModel.Game.WIN",
			UPDATE: "ConnectFourModel.Game.UPDATE"
		}
		
		this.num_rows = num_rows;
		this.num_cols = num_cols;
		
		var 
			/** The game's state. A 2-dimensional field containing State.{UNSET, RED, YELLOW} */
			_cell_data,
			
			/** Array of filters that are used to check whether some player has won */
			_filters,
			
			/** true if it's the red player's turn */
			_reds_turn,
			
			/** true if some player has won */
			_finished,
			
			/** incremented with each move a player conducts */
			_move_nr,
			
			_event_dispatcher;
			
		function init() {
			_event_dispatcher = new HSEvent.EventDispatcher();
			
			_cell_data = init_cell_data();
			_filters = create_filters();
			
			_reds_turn = true;
			_finished = false;
			_move_nr = 0;
		}
		
		this.add_event_listener = function add_event_listener(type, handler) {
			_event_dispatcher.add_event_listener(type, handler);
		}
		
		function check_win_situation() {
			for (var n = 0; n < _filters.length; n++) {
				var filter = _filters[n];
				var cells = filter.check(_cell_data);
				if (cells) {
					_finished = true;
					_event_dispatcher.dispatch_event({
						type: Game.EVENT_TYPES.WIN,
						winner_cells: cells
					});
				}
			}
		}

		function create_filters() {
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
			return _cell_data;
		}
		
		this.get_event_types = function get_event_types() {
			return Game.EVENT_TYPES;
		}
		
		this.get_move_nr = function get_move_nr() {
			return _move_nr;
		}
		
		function init_cell_data() {
			var cell_data = [];
			for (var row_num = 0; row_num < num_rows; row_num++) {
				var row = [];
				for (var col_num = 0; col_num < num_cols; col_num++) {
					row.push(State.UNSET);
				}
				
				cell_data.push(row);
			}
			return cell_data;
		}
		
		/**
		 * insert a disc into the specified column.
		 * @return true if the move was possible (i.e. "something happened"), false else
		 */
		this.insert_disc = function insert_disc(colNum) {
			if (_finished) {
				return;
			}
			
			var cell_value = _reds_turn ? State.RED : State.YELLOW;
			
			for (var rowNum = 0; rowNum < num_rows; rowNum++) {
				if (rowNum < num_rows - 1 && _cell_data[rowNum + 1][colNum] == State.UNSET) {
					continue;
				} else {
					if (_cell_data[rowNum][colNum] == State.UNSET) {
						_cell_data[rowNum][colNum] = cell_value;
						
						_move_nr++;
						check_win_situation();
						if (!_finished) {
							_reds_turn = !_reds_turn;
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
			return _reds_turn;
		}
		
		init();
	}
	
	function WinFilter(filter_matrix) {
		var _width,
			_height,
			_cells;
		
		function init() {
			_width = filter_matrix[0].length;
			_height = filter_matrix.length;
			_cells = init_cells(filter_matrix);
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
		
		function init_cells(matrix) {
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
	
	exports.Game = Game;
	
	return exports;
})();	
