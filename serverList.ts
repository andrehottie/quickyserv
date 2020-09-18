import fs = require("fs");
import { RoutedServerParams, SimpleServerParams, TRoute } from "./definitions";

export const simpleServer = ({
  selectedPort,
  selectedHost,
}: SimpleServerParams): void => {
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

export const simpleServerHTML = ({
  selectedPort,
  selectedHost,
}: SimpleServerParams): void => {
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

export const simpleServerSinglePage = ({
  selectedPort,
  selectedHost,
}: SimpleServerParams): void => {
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

export const jsServerWithRouting = ({
  selectedPort,
  selectedHost,
  routes,
}: RoutedServerParams): void => {
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

export const htmlServerWithRouting = ({
  selectedPort,
  selectedHost,
  routes,
}: RoutedServerParams): void => {
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
