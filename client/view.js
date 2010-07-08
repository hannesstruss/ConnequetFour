var ConnectFourView = (function ($) {
	var export = {};
	
	function View(container_id, model) {
		var 
			/** The game model */
			_model,
			
			/** 
			 * The game's board view, a 2-dimensional field containing references to the cell-DIV-elements
			 * (jQuery-wrapped) 
			 */
			_canvas;
		
		function init() {
			_model = model;
			
			create_game_info(container_id);
			_canvas = create_canvas(container_id);
			add_event_listeners();
		}
		
		function add_event_listeners() {
			for (var rowNum = 0; rowNum < _canvas.length; rowNum++) {
				var row = _canvas[rowNum];
				for (var colNum = 0; colNum < row.length; colNum++) {
					var col = row[colNum];
					$(col).bind("click", {rowNum: rowNum, colNum: colNum}, function(event) {
						on_cell_click(event.data.rowNum, event.data.colNum);
					});
				}
			}
		}
		
		function create_canvas(container_id) {
			$("#"+container_id).append('<div id="game_canvas"></div>');
			
			var canvas = []
			
			for (var rowNum = 0; rowNum < _model.numRows; rowNum++) {
				var row = [];
				// TODO do not use unique id for game_canvas, store reference instead
				$("#game_canvas").append('<div class="row clearfix"></div>');
				var rowNode = $("#game_canvas *:last");
				
				for (var colNum = 0; colNum < _model.numCols; colNum++) {
					rowNode.append('<div class="cell"><div class="inner"></div></div>');
					var cellNode = $("#game_canvas .row:last .cell:last");
					row.push(cellNode);
				}
				
				canvas.push(row);
			}
			
			return canvas;
		}
		
		function create_game_info(container_id) {
			$("#"+container_id).prepend(
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
			
			$("#"+container_id + " button").click(function() {
				window.location.reload();
			});
		}
		
		function on_cell_click(rowNum, colNum) {
			console.log("CLICK: " + rowNum + ", " + colNum);
		}
		
		init();
	}
	
	export.View = View;
	
	return export;
})(jQuery);
