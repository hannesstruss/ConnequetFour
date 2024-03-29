/*global ConnectFour: false, jQuery: false */

(function ($) {
	function View(container, model) {
		var 
			self = this,
			/** The game model */
			_model,
			
			/** 
			 * The game's board view, a 2-dimensional field containing references to the cell-DIV-elements
			 * (jQuery-wrapped) 
			 */
			_canvas;
		
		
		function on_cell_click(rowNum, colNum) {
			_model.insert_disc(colNum);
		}
		
		function add_cell_event_listeners() {
			var click_handler = function(event) {
				on_cell_click(event.data.rowNum, event.data.colNum);
			};
			
			for (var rowNum = 0; rowNum < _canvas.length; rowNum++) {
				var row = _canvas[rowNum];
				for (var colNum = 0; colNum < row.length; colNum++) {
					var col = row[colNum];
					$(col).bind("click", {rowNum: rowNum, colNum: colNum}, click_handler);
				}
			}
		}
		
		function create_canvas(container_id) {
			$(container).append('<div id="game_canvas"></div>');
			
			var canvas = [];
			
			for (var rowNum = 0; rowNum < _model.num_rows; rowNum++) {
				var row = [];
				// TODO do not use unique id for game_canvas, store reference instead
				$("#game_canvas").append('<div class="row clearfix"></div>');
				var rowNode = $("#game_canvas *:last");
				
				for (var colNum = 0; colNum < _model.num_cols; colNum++) {
					rowNode.append('<div class="cell"><div class="inner"></div></div>');
					var cellNode = $("#game_canvas .row:last .cell:last");
					row.push(cellNode);
				}
				
				canvas.push(row);
			}
			
			return canvas;
		}
		
		function create_game_info(container_id) {
			$(container).prepend(
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
			
			$(container).find("button").click(function() {
				window.location.reload();
			});
		}
		
		function display_win(winnerCells) {
			// TODO show correct winner
			//var winnerIsRed = _cellData[winnerCells[0].row][winnerCells[0].col] == State.RED;
			$(".win_message").removeClass("hidden");
			
			for (var n = 0; n < winnerCells.length; n++) {
				var cell = winnerCells[n];
				
				$(_canvas[cell.row][cell.col])
					.removeClass("red yellow")
					.addClass("win");
			}
		}
		
		function update_player_name_view(isRed) {
			// TODO don't use classnames, store references instead
			$(".player_name").html(isRed ? "RED" : "YELLOW");
			$(".player_name").toggleClass("red", isRed);
			$(".player_name").toggleClass("yellow", !isRed);
		}
		
		function update_view() {
			update_player_name_view(_model.is_reds_turn());
			$(".move_nr").html(_model.get_move_nr() + 1);
			
			var cellData = _model.get_cell_data();
			for (var rowNum = 0; rowNum < cellData.length; rowNum++) {
				for (var colNum = 0; colNum < cellData[rowNum].length; colNum++) {
					var cellClass = ["", "red", "yellow"][cellData[rowNum][colNum]];
					$(_canvas[rowNum][colNum]).addClass(cellClass);
				}
			}
		}
		
		function on_win(event) {
			display_win(event.winner_cells);
		}
		
		function on_update(event) {
			update_view();
		}
		
		self.start = function() {
			create_game_info(container);
			_canvas = create_canvas(container);
			
			add_cell_event_listeners();
		};
		
		function init() {
			_model = model;
			
			$(_model).bind("cf:win", on_win);
			$(_model).bind("cf:update", on_update);
		}
		init();
	}
	
	ConnectFour.View = View;
})(jQuery);
