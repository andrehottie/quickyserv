#!/usr/bin/env node
import { serverType, TServerInfo, TRoutes, TRoute } from "./definitions";
import { Answers } from "inquirer";
import inquirer = require("inquirer");
import {
  htmlServerWithRouting,
  jsServerWithRouting,
  simpleServer,
  simpleServerHTML,
  simpleServerSinglePage,
} from "./serverList";

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
      simpleServer({ selectedPort: selectedPort, selectedHost: selectedHost });
      break;
    case "Simple Node With HTML":
      simpleServerHTML({
        selectedPort: selectedPort,
        selectedHost: selectedHost,
      });
      break;
    case "Simple Node Single Page":
      simpleServerSinglePage({
        selectedPort: selectedPort,
        selectedHost: selectedHost,
      });
      break;
    case "Server with Routes [to JS]":
      jsServerWithRouting({
        selectedPort: selectedPort,
        selectedHost: selectedHost,
        routes: serverInfo.routes || [],
      });
      break;
    case "Server with Routes [to HTML]":
      htmlServerWithRouting({
        selectedPort: selectedPort,
        selectedHost: selectedHost,
        routes: serverInfo.routes || [],
      });
      break;
  }
};
