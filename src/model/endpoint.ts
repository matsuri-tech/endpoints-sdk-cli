export type EnvList = Record<string, string>;

export type AuthSchema =
  | {
      type: "Bearer" | "Basic";
      header: "Authorization";
    }
  | {
      type: "ApiKey";
      header: "X-Access-Token";
    };

export interface Endpoint {
  path: string;
  desc: string;
  method?: string;
  authSchema?: AuthSchema;
  request?: null | Record<string, unknown>;
  response?: null | Record<string, unknown>;
}

type EndpointList = Record<string, Endpoint>;

export interface EndpointAssets {
  env?: EnvList;
  api?: EndpointList;
}

export type EndpointSetting = Record<string, EndpointAssets>;
