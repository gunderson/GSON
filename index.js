#! /usr/bin/env node

function getIndentationString(lines) {
    if (lines[1].charAt(0) === "\t") {
        return "\t";
    } else if (lines[1].charAt(0) === " ") {
        if (lines[1].substr(0, 4) === "    ") {
            return "    ";
        } else if (lines[1].substr(0, 2) === "  ") {
            return "  ";
        }
    }

    if (!indentationString) {
        throw new Error("Unable to determine indentation style. Please use Tabs or 2/4 Spaces");
    }
}

function getDepth(input, indentationString) {
    var depth = -1;
    var levels = input.split(indentationString);
    while (levels[++depth] === '') {
        //count!

    }
    return depth;
}

function parseGSONLines(lines) {
    var indentationString = getIndentationString(lines);
    var output = {};
    var currentPath = [output];
    var parsedLines = [];

    for (var i = 0; i < lines.length; i++) {
        var lineDepth = getDepth(lines[i], indentationString);
        var currentDepth = currentPath.length - 1;
        if (lineDepth == currentDepth) {
            // it's the same level
            //don't change parent
        } else if (lineDepth > currentDepth) {
            // it's a child
            // set last created obj as parentObject
            currentPath.push(parsedLines[i - 1]);
        } else if (lineDepth < currentDepth) {
            // it's an uncle
            // back out the path by difference
            var i_d = currentDepth - lineDepth;

            while (i_d-- > 0) {
                currentPath.pop();
            }
        }
        currentPath[currentPath.length - 1] = parsedLines[i] = parseLine(currentPath, lines, i);
    }

    return output;
}

function parseLine(currentPath, lines, i) {
    var parentObject = currentPath[currentPath.length - 1];
    var words, key, value;
    // reduce indentation
    var line = lines[i].trim();
    words = line.split(" ");


    var type = getObjectType(line);
    switch (type) {
        case "key:value":
            parentObject[words.shift()] = JSON.parse(words.join(" "));
            break;
        case "string":
            parentObject.push(JSON.parse(line));
            break;
        case "number":
            parentObject.push(parseInt(line));
            break;
        case "object":
            if (i < lines.length - 1 && getObjectType(lines[i + 1]) !== "key:value") {
                parentObject[line] = [];
            } else {
                parentObject[line] = {};
            }
            break;
    }

    return (typeof parentObject[line] === "object") ? parentObject[line] : parentObject;
}

function getObjectType(line) {
    var words, key, value;
    line = line.trim();
    words = line.split(" ");
    if (words.length > 1 && words[1].charAt(0)) {
        return "key:value";
    } else if (isString(line)) {
        return "string";
    } else if (/[0-9]/g.test(line.charAt(0))) {
        return "number";
    } else {
        return "object";
    }
}


function stringifyObject(obj, indentationChar, indentationLevel) {
    indentationLevel = indentationLevel || 0;
    var str = "";
    if (typeof obj === "object" && typeof obj.push !== "function") {
        // object
        for (var key in obj) {
            var val = (typeof obj[key] == "object") ? stringifyObject(obj[key], indentationChar, indentationLevel + 1) : JSON.stringify(obj[key]);
            str += "\n" + indent(indentationChar, indentationLevel) + key + " " + val;
        }
    } else if (typeof obj === "object" && typeof obj.push === "function") {
        // array
        obj.forEach(function(element) {
            if (typeof element == "object") {
                element = stringifyObject(element);
            }
            str += "\n" + indent(indentationChar, indentationLevel) + element;
        });
    }
    return str;
}

function indent(indentationChar, indentationLevel) {
    var str = "";
    while (indentationLevel--) {
        str += indentationChar
    }
    return str;
}

function isString(input) {
    return input.charAt(0) == "\"" || input.charAt(0) == "'";
}

function isNumber(input) {
    var num = parseInt(input);
    return num || num === 0 ? true : false;
}


module.exports = {
    toJSON: function(input) {
        var lines = stringInput.trim().split("\n");
        return parseGSONLines(JSON.stringify(lines));
    },
    stringify: function(objectInput) {
        return stringifyObject(objectInput, "\t").substr(1);
    },
    parse: function(stringInput) {
        var lines = stringInput.trim().split("\n");
        return parseGSONLines(lines);
    }
};
