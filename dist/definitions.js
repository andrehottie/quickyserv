(function (serverType) {
    serverType[serverType["Simple Node Server"] = "Simple Node Server"] = "Simple Node Server";
    serverType[serverType["Simple Node With HTML"] = "Simple Node Server"] = "Simple Node With HTML";
    serverType[serverType["Simple Node Single Page"] = "Simple Node Server"] = "Simple Node Single Page";
    serverType[serverType["Server with Routes [to JS]"] = "Simple Node Server"] = "Server with Routes [to JS]";
    serverType[serverType["Server with Routes [to HTML]"] = "Simple Node Server"] = "Server with Routes [to HTML]";
})(exports.serverType || (exports.serverType = {}));
var serverType = exports.serverType;
