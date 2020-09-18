"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.htmlServerWithRouting = exports.jsServerWithRouting = exports.simpleServerSinglePage = exports.simpleServerHTML = exports.simpleServer = void 0;
var fs = require("fs");
exports.simpleServer = function (_a) {
    var selectedPort = _a.selectedPort, selectedHost = _a.selectedHost;
    var serverFile = fs.createWriteStream("server.js");
    serverFile.write("\n  const http = require('http');\n  \n  const server = http.createServer(function (req, res) {\n  \n    // ****\n    // Your behavior here\n    // ****\n  \n    res.write('Hello World!'); // Write a response\n    res.end(); //end the response\n  });\n  server.listen(" + selectedPort + ", '" + selectedHost + "', function(){\n    console.log(\"Your custom server at http://" + selectedHost + ":" + selectedPort + "\");\n   });");
    serverFile.end();
};
exports.simpleServerHTML = function (_a) {
    var selectedPort = _a.selectedPort, selectedHost = _a.selectedHost;
    var serverFile = fs.createWriteStream("server.js");
    serverFile.write("\n  const http = require('http');\n  \n  const server = http.createServer(function (req, res) {\n    res.writeHead(200, {'Content-Type': 'text/html'});\n  \n      res.write('<h1>Hello World!<h1>'); //Your HTML Here\n  \n      res.end(); \n   });\n   server.listen(" + selectedPort + ", '" + selectedHost + "', function(){\n   console.log(\"Your custom server at http://" + selectedHost + ":" + selectedPort + "\");\n  });");
    serverFile.end();
};
exports.simpleServerSinglePage = function (_a) {
    var selectedPort = _a.selectedPort, selectedHost = _a.selectedHost;
    var index = fs.createWriteStream("index.html");
    index.write("\n    <html>\n    <head></head>\n    <body></body>\n    </html>");
    index.end();
    var serverFile = fs.createWriteStream("server.js");
    serverFile.write("\n  const http = require('http');\n  const fs = require('fs');\n  \n  \n  const server = http.createServer(function (req, res) {\n    res.writeHead(200, {'Content-Type': 'text/html'});\n  \n    fs.readFile('./index.html', function (err, html) {\n      if (err) {\n          res.write('404'); \n          res.end();\n      } else {\n          res.write(html); \n      res.end();\n      }\n  });\n   });\n   server.listen(" + selectedPort + ", '" + selectedHost + "', function(){\n    console.log(\"Your custom server at http://" + selectedHost + ":" + selectedPort + "\");\n   });");
    serverFile.end();
};
exports.jsServerWithRouting = function (_a) {
    var selectedPort = _a.selectedPort, selectedHost = _a.selectedHost, routes = _a.routes;
    var casesArray = routes.map(function (route) { return "\n  case '/" + route.path + "':\n       \n  // ****\n  // Your behavior here\n  // ****\n    \n    res.end();\n  break;"; });
    var serverFile = fs.createWriteStream("server.js");
    serverFile.write("\n  const http = require('http');\n  \n  const server = http.createServer(function (req, res) {\n  var url = req.url;\n  switch(url){\n    " + casesArray.map(function (e) { return e; }).join(" ") + "\n    }\n  });\n  server.listen(" + selectedPort + ", '" + selectedHost + "', function(){\n    console.log(\"Your custom server at http://" + selectedHost + ":" + selectedPort + "\");\n   });");
    serverFile.end();
};
exports.htmlServerWithRouting = function (_a) {
    var selectedPort = _a.selectedPort, selectedHost = _a.selectedHost, routes = _a.routes;
    var casesArray = routes.map(function (route) {
        var newPage = fs.createWriteStream(route.filename + ".html");
        newPage.write("\n      <html>\n      <head></head>\n      <body>\n      <h1>" + (route.filename ? route.filename.toUpperCase() : "") + "</h1>\n      </body>\n      </html>");
        newPage.end();
        return "\n  case '/" + route.path + "':\n    fs.readFile('./" + route.filename + ".html', function (err, html) {\n      if (err) {\n          res.write('404'); \n          res.end();\n      } else {\n          res.write(html); \n          res.end();\n      }\n  });\n  break;";
    });
    var serverFile = fs.createWriteStream("server.js");
    serverFile.write("\n  const http = require('http');\n  const fs = require('fs');\n  \n  const server = http.createServer(function (req, res) {\n  res.writeHead(200, {'Content-Type': 'text/html'});\n  var url = req.url;\n  switch(url){\n    " + casesArray.map(function (e) { return e; }).join(" ") + "\n    }\n  });\n  server.listen(" + selectedPort + ", '" + selectedHost + "', function(){\n    console.log(\"Your custom server at http://" + selectedHost + ":" + selectedPort + "\");\n   });");
    serverFile.end();
};
