var ROWS = 6;
var COLS = 7;

function FourInARow(canvasID) {
	this.canvas = this.createCanvas(canvasID);
	this.initCellData();
	this.addEventListeners();
	this.rotIstAnDerReihe = this.rot = true;
	
	this.playerRedName = window.prompt("Bitte geben Sie den Namen von Spieler 1 ein!");
	this.playerYellowName = window.prompt("Bitte geben Sie den Namen von Spieler 2 ein!");
	
	$("#game_info").html("<h1><marquee><span class=\"red active\">" + this.playerRedName + "</span> VS <span class=\"yellow\">" + this.playerYellowName + "</span></marquee></h1>");
}

FourInARow.prototype = {
	addEventListeners: function() {
		for (var rowNum = 0; rowNum < this.canvas.length; rowNum++) {
			var row = this.canvas[rowNum];
			for (var colNum = 0; colNum < row.length; colNum++) {
				var col = row[colNum];
				var me = this;
				$(col).bind("click", {colNum: colNum}, function(event) {
					me.onCellClick(event.data.colNum);
				});
			}
		}
	},
	
	createCanvas: function(canvasID) {
		var canvas = []
		
		for (var rowNum = 0; rowNum < ROWS; rowNum++) {
			var row = [];
			$("#" + canvasID).append('<div class="row clearfix"></div>');
			var rowNode = $("#" + canvasID + " *:last");
			
			for (var colNum = 0; colNum < COLS; colNum++) {
				rowNode.append('<div class="cell"><div class="inner"></div></div>');
				var cellNode = $("#" + canvasID + " .row:last .cell:last");
				row.push(cellNode);
			}
			
			canvas.push(row);
		}
		
		return canvas;
	},
	
	initCellData: function() {
		this.cellData = [];
		for (var rowNum = 0; rowNum < ROWS; rowNum++) {
			var row = [];
			for (var colNum = 0; colNum < COLS; colNum++) {
				row.push(0);
			}
			
			this.cellData.push(row);
		}
	},
	
	onCellClick: function(colNum) {
		var cellValue = this.rot ? 1 : 2;
		for (var rowNum = 0; rowNum < ROWS; rowNum++) {
			if (rowNum < ROWS - 1 && this.cellData[rowNum + 1][colNum] == 0 ) {
				continue;
			} else {
				if (this.cellData[rowNum][colNum] == 0) {
					this.cellData[rowNum][colNum] = cellValue;
					this.rot = !this.rot;
					this.updateView();
					break;
				}
			}
		}
	},
	
	updateView: function() {
		for (var rowNum = 0; rowNum < this.canvas.length; rowNum++) {
			for (var colNum = 0; colNum < row.length; colNum++) {
				var cellClass = ["", "red", "yellow"][this.cellData[rowNum][colNum]];
				$(this.canvas[rowNum][colNum]).addClass(cellClass);
			}
		}
	}
}

var game = new FourInARow("game_canvas");
