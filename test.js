var fs = require("fs");
var GSON = require("./index");

fs.readFile("init.gson", 'utf-8', function(err, result) {
	var obj = GSON.parse(result);
	console.log(obj);
});

var obj = {
	"obj": {
		"key0": "value0",
		"key1": "value1",
		"nested_obj": {
			"key": "value"
		},
		"arr": [
			0,
			1,
			2, {
				test: "testval"
			}
		]
	}
}

console.log(GSON.stringify(obj))
