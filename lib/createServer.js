#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var definitions_1 = require("./definitions");
var inquirer = require("inquirer");
var serverList_1 = require("./serverList");
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
        message: "Write all the paths separated by pipe [es: routeOne|routeTwo|routeThree]:",
        when: function (answers) {
            return answers.server_type === "Server with Routes [to JS]";
        },
    },
    {
        name: "routes",
        type: "input",
        message: 'Write all the "paths->page" name separated by pipe following the example [es: home->index|contacts->contacts|faq->faq]:',
        when: function (answers) {
            return answers.server_type === "Server with Routes [to HTML]";
        },
    },
])
    .then(function (answer) {
    serverInfo.serverType = answer.server_type;
    if (answer.server_type === "Server with Routes [to JS]") {
        var paths = answer.routes.split("|");
        var routes = paths.map(function (path) { return ({
            path: path,
        }); });
        serverInfo.routes = routes;
        createServer(serverInfo);
    }
    else if (answer.server_type === "Server with Routes [to HTML]") {
        var routeList = answer.routes.split("|");
        var routes = routeList.map(function (route) {
            var path = route.split("->")[0];
            var filename = route.split("->")[1];
            return { path: path, filename: filename };
        });
        serverInfo.routes = routes;
        createServer(serverInfo);
    }
    else {
        createServer(serverInfo);
    }
});
var createServer = function (serverInfo) {
    switch (serverInfo.serverType) {
        case "Simple Node Server":
            serverList_1.simpleServer({ selectedPort: selectedPort, selectedHost: selectedHost });
            break;
        case "Simple Node With HTML":
            serverList_1.simpleServerHTML({
                selectedPort: selectedPort,
                selectedHost: selectedHost,
            });
            break;
        case "Simple Node Single Page":
            serverList_1.simpleServerSinglePage({
                selectedPort: selectedPort,
                selectedHost: selectedHost,
            });
            break;
        case "Server with Routes [to JS]":
            serverList_1.jsServerWithRouting({
                selectedPort: selectedPort,
                selectedHost: selectedHost,
                routes: serverInfo.routes || [],
            });
            break;
        case "Server with Routes [to HTML]":
            serverList_1.htmlServerWithRouting({
                selectedPort: selectedPort,
                selectedHost: selectedHost,
                routes: serverInfo.routes || [],
            });
            break;
    }
};
