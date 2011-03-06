var fs = require('fs'),
    sys = require('sys'),
    arguments = process.argv.slice(2),
	quit = function (code) {process.exit(code)},
	print = function(what) { sys.puts(what) };
	
var JSHINT = require("./jshint.js").JSHINT;
var JSHINT_OPTS = require(arguments[1]).JSHINT_OPTS;
JSHINT_OPTS.rhino = false;

var contents = fs.readFileSync(arguments[0]).toString();

if (!JSHINT(contents, JSHINT_OPTS)) { 
    for (var i = 0, err; err = JSHINT.errors[i]; i++) {
        print(err.reason + ' (line: ' + err.line + ', character: ' + err.character + ')');
        print('> ' + (err.evidence || '').replace(/^\s*(\S*(\s+\S+)*)\s*$/, "$1"));
        print('');
    }
    quit(1);
}

quit(0);
