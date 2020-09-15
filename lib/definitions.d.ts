export declare enum serverType {
    "Simple Node Server" = "Simple Node Server",
    "Simple Node With HTML" = "Simple Node Server",
    "Simple Node Single Page" = "Simple Node Server",
    "Server with Routes [to JS]" = "Simple Node Server",
    "Server with Routes [to HTML]" = "Simple Node Server"
}
export declare type TRoute = {
    path: string;
    filename?: string;
};
export declare type TRoutes = TRoute[];
export declare type TServerInfo = {
    serverType?: string;
    routes?: TRoutes;
};
