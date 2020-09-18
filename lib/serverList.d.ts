import { RoutedServerParams, SimpleServerParams } from "./definitions";
export declare const simpleServer: ({ selectedPort, selectedHost, }: SimpleServerParams) => void;
export declare const simpleServerHTML: ({ selectedPort, selectedHost, }: SimpleServerParams) => void;
export declare const simpleServerSinglePage: ({ selectedPort, selectedHost, }: SimpleServerParams) => void;
export declare const jsServerWithRouting: ({ selectedPort, selectedHost, routes, }: RoutedServerParams) => void;
export declare const htmlServerWithRouting: ({ selectedPort, selectedHost, routes, }: RoutedServerParams) => void;
