#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var definitions_1 = require("./definitions");
var inquirer = require("inquirer");
var fs = require("fs");
//const inquirer = require("inquirer");
var selectedHost = process.env.npm_config_host || "0.0.0.0";
var selectedPort = process.env.npm_config_port || 3000;
var serverInfo = {};
var typesArray = Object.keys(definitions_1.serverType);
inquirer
  .prompt([
    {
      name: "server_type",
      type: "list",
      message: "Select one:",
      choices: typesArray,
    },
    {
      name: "routes",
      type: "input",
      message:
        "Write all the paths separated by pipe [es: routeOne|routeTwo|routeThree]:",
      when: function (answers) {
        return answers.server_type === "Server with Routes [to JS]";
      },
    },
    {
      name: "routes",
      type: "input",
      message:
        'Write all the "paths->page" name separated by pipe following the example [es: home->index|contacts->contacts|faq->faq]:',
      when: function (answers) {
        return answers.server_type === "Server with Routes [to HTML]";
      },
    },
  ])
  .then(function (answer) {
    serverInfo.serverType = answer.server_type;
    if (answer.server_type === "Server with Routes [to JS]") {
      var paths = answer.routes.split("|");
      var routes = paths.map(function (path) {
        return {
          path: path,
        };
      });
      serverInfo.routes = routes;
      createServer(serverInfo);
    } else if (answer.server_type === "Server with Routes [to HTML]") {
      var routeList = answer.routes.split("|");
      var routes = routeList.map(function (route) {
        var path = route.split("->")[0];
        var filename = route.split("->")[1];
        return { path: path, filename: filename };
      });
      serverInfo.routes = routes;
      createServer(serverInfo);
    } else {
      createServer(serverInfo);
    }
  });
var createServer = function (serverInfo) {
  switch (serverInfo.serverType) {
    case "Simple Node Server":
      simpleServer();
      break;
    case "Simple Node With HTML":
      simpleServerHTML();
      break;
    case "Simple Node Single Page":
      simpleServerSinglePage();
      break;
    case "Server with Routes [to JS]":
      jsServerWithRouting(serverInfo.routes || []);
      break;
    case "Server with Routes [to HTML]":
      htmlServerWithRouting(serverInfo.routes || []);
      break;
  }
};
var simpleServer = function () {
  var serverFile = fs.createWriteStream("server.js");
  serverFile.write(
    "\nconst http = require('http');\n\nconst server = http.createServer(function (req, res) {\n\n  // ****\n  // Your behavior here\n  // ****\n\n  res.write('Hello World!'); // Write a response\n  res.end(); //end the response\n});\nserver.listen(" +
      selectedPort +
      ", '" +
      selectedHost +
      "', function(){\n  console.log(\"Your custom server at http://" +
      selectedHost +
      ":" +
      selectedPort +
      '");\n });'
  );
  serverFile.end();
};
var simpleServerHTML = function () {
  var serverFile = fs.createWriteStream("server.js");
  serverFile.write(
    "\nconst http = require('http');\n\nconst server = http.createServer(function (req, res) {\n  res.writeHead(200, {'Content-Type': 'text/html'});\n\n    res.write('<h1>Hello World!<h1>'); //Your HTML Here\n\n    res.end(); \n });\n server.listen(" +
      selectedPort +
      ", '" +
      selectedHost +
      "', function(){\n console.log(\"Your custom server at http://" +
      selectedHost +
      ":" +
      selectedPort +
      '");\n});'
  );
  serverFile.end();
};
var simpleServerSinglePage = function () {
  var index = fs.createWriteStream("index.html");
  index.write("\n  <html>\n  <head></head>\n  <body></body>\n  </html>");
  index.end();
  var serverFile = fs.createWriteStream("server.js");
  serverFile.write(
    "\nconst http = require('http');\nconst fs = require('fs');\n\n\nconst server = http.createServer(function (req, res) {\n  res.writeHead(200, {'Content-Type': 'text/html'});\n\n  fs.readFile('./index.html', function (err, html) {\n    if (err) {\n        res.write('404'); \n        res.end();\n    } else {\n        res.write(html); \n    res.end();\n    }\n});\n });\n server.listen(" +
      selectedPort +
      ", '" +
      selectedHost +
      "', function(){\n  console.log(\"Your custom server at http://" +
      selectedHost +
      ":" +
      selectedPort +
      '");\n });'
  );
  serverFile.end();
};
var jsServerWithRouting = function (routes) {
  var casesArray = routes.map(function (route) {
    return (
      "\ncase '/" +
      route.path +
      "':\n     \n// ****\n// Your behavior here\n// ****\n  \n  res.end();\nbreak;"
    );
  });
  var serverFile = fs.createWriteStream("server.js");
  serverFile.write(
    "\nconst http = require('http');\n\nconst server = http.createServer(function (req, res) {\nvar url = req.url;\nswitch(url){\n  " +
      casesArray
        .map(function (e) {
          return e;
        })
        .join(" ") +
      "\n  }\n});\nserver.listen(" +
      selectedPort +
      ", '" +
      selectedHost +
      "', function(){\n  console.log(\"Your custom server at http://" +
      selectedHost +
      ":" +
      selectedPort +
      '");\n });'
  );
  serverFile.end();
};
var htmlServerWithRouting = function (routes) {
  var casesArray = routes.map(function (route) {
    var newPage = fs.createWriteStream(route.filename + ".html");
    newPage.write(
      "\n    <html>\n    <head></head>\n    <body>\n    <h1>" +
        (route.filename ? route.filename.toUpperCase() : "") +
        "</h1>\n    </body>\n    </html>"
    );
    newPage.end();
    return (
      "\ncase '/" +
      route.path +
      "':\n  fs.readFile('./" +
      route.filename +
      ".html', function (err, html) {\n    if (err) {\n        res.write('404'); \n        res.end();\n    } else {\n        res.write(html); \n        res.end();\n    }\n});\nbreak;"
    );
  });
  var serverFile = fs.createWriteStream("server.js");
  serverFile.write(
    "\nconst http = require('http');\nconst fs = require('fs');\n\nconst server = http.createServer(function (req, res) {\nres.writeHead(200, {'Content-Type': 'text/html'});\nvar url = req.url;\nswitch(url){\n  " +
      casesArray
        .map(function (e) {
          return e;
        })
        .join(" ") +
      "\n  }\n});\nserver.listen(" +
      selectedPort +
      ", '" +
      selectedHost +
      "', function(){\n  console.log(\"Your custom server at http://" +
      selectedHost +
      ":" +
      selectedPort +
      '");\n });'
  );
  serverFile.end();
};
