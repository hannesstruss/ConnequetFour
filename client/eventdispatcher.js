/**
 * A very basic event dispatching framework inspired by DOM/Actionscript 3 Events
 */

var HSEvent = (function() {

	var ED = function() {
		this.listeners = {};
	};
	
	ED.prototype = {
		/**
		 * register an event listener
		 * @param type a string determining the type of the event
		 * @param handler a function handling the event. 
		 * 
		 * The handling function receives an event object with at least the following properties:
		 * - target: the event target
		 * - type: the event type
		 */
		add_event_listener: function(type, handler) {
			if (!this.listeners[type]) {
				this.listeners[type] = [];
			}
			
			this.listeners[type].push(handler);
		},

		/**
		 * dispatch an event to the corresponding listeners
		 */
		dispatch_event: function(event) {
			if (this.listeners[event.type]) {
				var listeners = this.listeners[event.type];
				
				for (var n = 0; n < listeners.length; n++) {
					listeners[n](event);
				}
			}
		},
		
		/**
		 * remove an event listener
		 */
		remove_event_listener: function(type, handler) {
			if (this.listeners[event.type]) {
				var listeners = this.listeners[event.type];
				
				// iterate from end to beginning to remove the last added listener
				for (var n = listeners.length - 1; n > 0; n--) {
					if (listeners[n] === handler) {
						listeners.splice(n, 1);
						return;
					}
				}
			}
		}
	};

	return {
		EventDispatcher: ED
	};
})();

