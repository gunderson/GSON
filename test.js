var fs = require("fs");
var GSON = require("./index");

fs.readFile("init.gson", 'utf-8', function(err, result) {
	var obj = GSON.parse(result);
	console.log(obj);
});
