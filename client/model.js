var ConnectFour = (function($) {
	var export = {};
	
	var State = { 
		UNSET: 0,
		RED: 1,
		YELLOW: 2
	};
	
	function FourInARow(containerID, numRows, numCols) {
		var _canvas,
			_cellData,
			_filters,
			_redsTurn,
			_finished,
			_moveNr;
			
		function init() {
			createGameInfo(containerID);
			
			_canvas = createCanvas(containerID);
			_cellData = initCellData();
			_filters = createFilters();
			
			addEventListeners();
			_redsTurn = true;
			_finished = false;
			_moveNr = 0;
		}
		
		function addEventListeners() {
			for (var rowNum = 0; rowNum < _canvas.length; rowNum++) {
				var row = _canvas[rowNum];
				for (var colNum = 0; colNum < row.length; colNum++) {
					var col = row[colNum];
					$(col).bind("click", {rowNum: rowNum, colNum: colNum}, function(event) {
						onCellClick(event.data.rowNum, event.data.colNum);
					});
				}
			}
		}

		function checkWinSituation() {
			for (var n = 0; n < _filters.length; n++) {
				var filter = _filters[n];
				var cells = filter.check(_cellData);
				if (cells) {
					_finished = true;
					notifyWin(cells);
				}
			}
		}

		function createCanvas(containerID) {
			$("#"+containerID).append('<div id="game_canvas"></div>');
			
			var canvas = []
			
			for (var rowNum = 0; rowNum < numRows; rowNum++) {
				var row = [];
				$("#game_canvas").append('<div class="row clearfix"></div>');
				var rowNode = $("#game_canvas *:last");
				
				for (var colNum = 0; colNum < numCols; colNum++) {
					rowNode.append('<div class="cell"><div class="inner"></div></div>');
					var cellNode = $("#game_canvas .row:last .cell:last");
					row.push(cellNode);
				}
				
				canvas.push(row);
			}
			
			return canvas;
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
		
		function createGameInfo(containerID) {
			$("#"+containerID).prepend(
				'<div id="game_info" class="clearfix">' +
					'<span class="player_info">' +
						'Player ' +
						'<span class="player_name red">RED</span> ' +
						'<div class="win_message hidden">WINS! <button>restart</button></div>' +
					'</span>' +
					'<span class="move_info">' +
						'Move ' +
						'<span class="move_nr">1</span>' + 
					'</span>' +
				'</div>'
			);
			
			$("#"+containerID + " button").click(function() {
				window.location.reload();
			});
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
		function insertDisc(colNum) {
			var cellValue = _redsTurn ? State.RED : State.YELLOW;
			for (var rowNum = 0; rowNum < numRows; rowNum++) {
				if (rowNum < numRows - 1 && _cellData[rowNum + 1][colNum] == State.UNSET) {
					continue;
				} else {
					if (_cellData[rowNum][colNum] == State.UNSET) {
						_cellData[rowNum][colNum] = cellValue;
						
						_moveNr++;
						
						return true;
					}
				}
			}
			return false;
		}
		
		function notifyWin(winnerCells) {
			var winnerIsRed = _cellData[winnerCells[0].row][winnerCells[0].col] == State.RED;
			updatePlayerNameView(winnerIsRed);
			$(".win_message").removeClass("hidden");
			
			for (var n = 0; n < winnerCells.length; n++) {
				var cell = winnerCells[n];
				
				$(_canvas[cell.row][cell.col])
					.removeClass("red yellow")
					.addClass("win");
			}
		}
		
		function onCellClick(rowNum, colNum) {
			if (!_finished) {
				var legalMove = insertDisc(colNum);
				if (legalMove) {
					_redsTurn = !_redsTurn;
					updateView();
					checkWinSituation();
				}
			}
		}
		
		function updatePlayerNameView(isRed) {
			$(".player_name").html(isRed ? "RED" : "YELLOW");
			$(".player_name").toggleClass("red", isRed);
			$(".player_name").toggleClass("yellow", !isRed);
		}
		
		function updateView() {
			updatePlayerNameView(_redsTurn);
			$(".move_nr").html(_moveNr + 1);
			
			for (var rowNum = 0; rowNum < numRows; rowNum++) {
				for (var colNum = 0; colNum < numCols; colNum++) {
					var cellClass = ["", "red", "yellow"][_cellData[rowNum][colNum]];
					$(_canvas[rowNum][colNum]).addClass(cellClass);
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
	
	export.Game = FourInARow;
	
	return export;
})(jQuery);	
