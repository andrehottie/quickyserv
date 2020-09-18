export enum serverType {
  "Simple Node Server" = "Simple Node Server",
  "Simple Node With HTML" = "Simple Node Server",
  "Simple Node Single Page" = "Simple Node Server",
  "Server with Routes [to JS]" = "Simple Node Server",
  "Server with Routes [to HTML]" = "Simple Node Server",
}

export type TRoute = {
  path: string;
  filename?: string;
};

export type TRoutes = TRoute[];

export type TServerInfo = {
  serverType?: string;
  routes?: TRoutes;
};

export interface SimpleServerParams {
  selectedPort: string | number;
  selectedHost: string;
}

export interface RoutedServerParams extends SimpleServerParams {
  routes: TRoutes;
}
