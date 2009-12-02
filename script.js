function FourInARow(canvasID, numRows, numCols) {
	this.numRows = numRows;
	this.numCols = numCols;
	
	this.canvas = this.createCanvas(canvasID);
	this.initCellData();
	this.addEventListeners();
	this.rotIstAnDerReihe = this.rot = true;
	
	this.playerRedName = "";//window.prompt("Bitte geben Sie den Namen von Spieler 1 ein!");
	this.playerYellowName = "";// window.prompt("Bitte geben Sie den Namen von Spieler 2 ein!");
	
	this.createFilters();
	
	//$("#game_info").html("<h1><marquee><span class=\"red active\">" + this.playerRedName + "</span> VS <span class=\"yellow\">" + this.playerYellowName + "</span></marquee></h1>");
}

FourInARow.UNSET = 0;
FourInARow.RED = 1;
FourInARow.YELLOW = 2;

FourInARow.prototype = {
	addEventListeners: function() {
		for (var rowNum = 0; rowNum < this.canvas.length; rowNum++) {
			var row = this.canvas[rowNum];
			for (var colNum = 0; colNum < row.length; colNum++) {
				var col = row[colNum];
				var me = this;
				$(col).bind("click", {rowNum: rowNum, colNum: colNum}, function(event) {
					me.onCellClick(event.data.rowNum, event.data.colNum);
				});
			}
		}
	},
	
	checkWinSituation: function() {
		for (var n = 0; n < this.filters.length; n++) {
			var filter = this.filters[n];
			var cells = filter.check(this.cellData);
			if (cells) {
				alert("WIN " + ["", "ROT", "GELB"][this.cellData[cells[0].row][cells[0].col]]);
			}
		}
	},
	
	createCanvas: function(canvasID) {
		var canvas = []
		
		for (var rowNum = 0; rowNum < this.numRows; rowNum++) {
			var row = [];
			$("#" + canvasID).append('<div class="row clearfix"></div>');
			var rowNode = $("#" + canvasID + " *:last");
			
			for (var colNum = 0; colNum < this.numCols; colNum++) {
				rowNode.append('<div class="cell"><div class="inner"></div></div>');
				var cellNode = $("#" + canvasID + " .row:last .cell:last");
				row.push(cellNode);
			}
			
			canvas.push(row);
		}
		
		return canvas;
	},
	
	createFilters: function() {
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
		
		this.filters = [horizontal, vertical, diagonal1, diagonal2];
	},
	
	initCellData: function() {
		this.cellData = [];
		for (var rowNum = 0; rowNum < this.numRows; rowNum++) {
			var row = [];
			for (var colNum = 0; colNum < this.numCols; colNum++) {
				row.push(FourInARow.UNSET);
			}
			
			this.cellData.push(row);
		}
	},
	
	/**
	 * insert a disc into the specified column.
	 * @return true if the move was possible (i.e. "something happened"), false else
	 */
	insertDisc: function(colNum) {
		var cellValue = this.rot ? FourInARow.RED : FourInARow.YELLOW;
		for (var rowNum = 0; rowNum < this.numRows; rowNum++) {
			if (rowNum < this.numRows - 1 && this.cellData[rowNum + 1][colNum] == FourInARow.UNSET) {
				continue;
			} else {
				if (this.cellData[rowNum][colNum] == FourInARow.UNSET) {
					this.cellData[rowNum][colNum] = cellValue;
					
					return true;
				}
			}
		}
		return false;
	},
	
	onCellClick: function(rowNum, colNum) {
		var legalMove = this.insertDisc(colNum);
		if (legalMove) {
			this.rot = !this.rot;
			this.updateView();
			this.checkWinSituation();
		}
	},
	
	updateView: function() {
		for (var rowNum = 0; rowNum < this.numRows; rowNum++) {
			for (var colNum = 0; colNum < this.numCols; colNum++) {
				var cellClass = ["", "red", "yellow"][this.cellData[rowNum][colNum]];
				$(this.canvas[rowNum][colNum]).addClass(cellClass);
			}
		}
	}
}

function WinFilter(filterMatrix) {
	this.width = filterMatrix[0].length;
	this.height = filterMatrix.length;
	
	this.initCells(filterMatrix);
}

WinFilter.prototype = {
	/**
	 * checks if there is a winner in the given cellData array. 
	 * returns an array of {row: x, col: y} which represent the 
	 * cell positions of the cellData the winners discs are in (first found 
	 * occurence of a winning line), 
	 * null else.
	 * 
	 * @param {Array} cellData
	 */
	check: function(cellData) {
		for (var offsetRow = 0; offsetRow < cellData.length - this.height + 1; offsetRow++) {
			for (var offsetCol = 0; offsetCol < cellData[0].length - this.width + 1; offsetCol++) {
				var contents = [];
				for (var cellIndex = 0; cellIndex < this.cells.length; cellIndex++) {
					var cell = this.cells[cellIndex];
					contents.push(
						cellData[offsetRow + cell.row][offsetCol + cell.col]
					);
				}
				var first = contents[0];
				var isWinner = true;
				for (var n = 1; n < contents.length; n++) {
					if (contents[n] != first || contents[n] == FourInARow.UNSET) {
						isWinner = false;
						break;
					}
				}
				
				if (isWinner) {
					var result = [];
					for (var cellIndex = 0; cellIndex < this.cells.length; cellIndex++) {
						var cell = this.cells[cellIndex];
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
	},
	
	initCells: function(matrix) {
		this.cells = [];
		
		for (var rowNum = 0; rowNum < matrix.length; rowNum++) {
			var row = matrix[rowNum];
			for (var colNum = 0; colNum < row.length; colNum++) {
				var colContent = row[colNum];
				if (colContent == 1) {
					this.cells.push({
						row: rowNum,
						col: colNum
					});
				}
			}
		}
	}
}

