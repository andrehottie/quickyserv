#!/usr/bin/env node
import { serverType, TServerInfo, TRoutes, TRoute } from "./definitions";
import { Answers } from "inquirer";
import inquirer = require("inquirer");
import fs = require("fs");

//const inquirer = require("inquirer");

const selectedHost = process.env.npm_config_host || "0.0.0.0";
const selectedPort = process.env.npm_config_port || 3000;

const serverInfo: TServerInfo = {};

const typesArray = Object.keys(serverType);

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
      when: function (answers: Answers): boolean {
        return answers.server_type === "Server with Routes [to JS]";
      },
    },
    {
      name: "routes",
      type: "input",
      message:
        'Write all the "paths->page" name separated by pipe following the example [es: home->index|contacts->contacts|faq->faq]:',
      when: function (answers: Answers): boolean {
        return answers.server_type === "Server with Routes [to HTML]";
      },
    },
  ])
  .then((answer: Answers) => {
    serverInfo.serverType = answer.server_type;
    if (answer.server_type === "Server with Routes [to JS]") {
      const paths = answer.routes.split("|");
      const routes = paths.map((path: string) => ({
        path: path,
      }));
      serverInfo.routes = routes;
      createServer(serverInfo);
    } else if (answer.server_type === "Server with Routes [to HTML]") {
      const routeList = answer.routes.split("|");
      const routes = routeList.map((route: string) => {
        const path = route.split("->")[0];
        const filename = route.split("->")[1];
        return { path: path, filename: filename };
      });
      serverInfo.routes = routes;
      createServer(serverInfo);
    } else {
      createServer(serverInfo);
    }
  });

const createServer = (serverInfo: TServerInfo): void => {
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

const simpleServer = (): void => {
  const serverFile = fs.createWriteStream("server.js");
  serverFile.write(`
const http = require('http');

const server = http.createServer(function (req, res) {

  // ****
  // Your behavior here
  // ****

  res.write('Hello World!'); // Write a response
  res.end(); //end the response
});
server.listen(${selectedPort}, '${selectedHost}', function(){
  console.log("Your custom server at http://${selectedHost}:${selectedPort}");
 });`);
  serverFile.end();
};

const simpleServerHTML = (): void => {
  const serverFile = fs.createWriteStream("server.js");
  serverFile.write(`
const http = require('http');

const server = http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});

    res.write('<h1>Hello World!<h1>'); //Your HTML Here

    res.end(); 
 });
 server.listen(${selectedPort}, '${selectedHost}', function(){
 console.log("Your custom server at http://${selectedHost}:${selectedPort}");
});`);
  serverFile.end();
};

const simpleServerSinglePage = (): void => {
  const index = fs.createWriteStream("index.html");
  index.write(`
  <html>
  <head></head>
  <body></body>
  </html>`);
  index.end();

  const serverFile = fs.createWriteStream("server.js");
  serverFile.write(`
const http = require('http');
const fs = require('fs');


const server = http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});

  fs.readFile('./index.html', function (err, html) {
    if (err) {
        res.write('404'); 
        res.end();
    } else {
        res.write(html); 
    res.end();
    }
});
 });
 server.listen(${selectedPort}, '${selectedHost}', function(){
  console.log("Your custom server at http://${selectedHost}:${selectedPort}");
 });`);
  serverFile.end();
};

const jsServerWithRouting = (routes: TRoutes): void => {
  const casesArray = routes.map(
    (route: TRoute): string => `
case '/${route.path}':
     
// ****
// Your behavior here
// ****
  
  res.end();
break;`
  );

  const serverFile = fs.createWriteStream("server.js");
  serverFile.write(`
const http = require('http');

const server = http.createServer(function (req, res) {
var url = req.url;
switch(url){
  ${casesArray.map((e) => e).join(" ")}
  }
});
server.listen(${selectedPort}, '${selectedHost}', function(){
  console.log("Your custom server at http://${selectedHost}:${selectedPort}");
 });`);
  serverFile.end();
};

const htmlServerWithRouting = (routes: TRoutes): void => {
  const casesArray = routes.map((route: TRoute): string => {
    const newPage = fs.createWriteStream(route.filename + ".html");
    newPage.write(`
    <html>
    <head></head>
    <body>
    <h1>${route.filename ? route.filename.toUpperCase() : ""}</h1>
    </body>
    </html>`);

    newPage.end();

    return `
case '/${route.path}':
  fs.readFile('./${route.filename}.html', function (err, html) {
    if (err) {
        res.write('404'); 
        res.end();
    } else {
        res.write(html); 
        res.end();
    }
});
break;`;
  });

  const serverFile = fs.createWriteStream("server.js");
  serverFile.write(`
const http = require('http');
const fs = require('fs');

const server = http.createServer(function (req, res) {
res.writeHead(200, {'Content-Type': 'text/html'});
var url = req.url;
switch(url){
  ${casesArray.map((e) => e).join(" ")}
  }
});
server.listen(${selectedPort}, '${selectedHost}', function(){
  console.log("Your custom server at http://${selectedHost}:${selectedPort}");
 });`);
  serverFile.end();
};
