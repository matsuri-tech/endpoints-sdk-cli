interface Config {
    dependencies: {
      [service: string]: {
        version: string;
        repository: string;
      };
    } | undefined;
  }

  interface Endpoints {
    [prefixName: string]: {
        env: {
            local: string;
            dev: string;
            prod: string;
            [envName: string]: string;
        };
        api: {
            [endpointName: string]: {
                path: string;
                desc?: string;
            };
        };
    };
}

type UnPartial<T> = {
  [K in keyof T]: Exclude<T[K], undefined>
}