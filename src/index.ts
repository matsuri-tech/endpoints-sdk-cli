#! /usr/bin/env node
import { Command } from "commander";
import pkg from "../package.json";
import { init } from "./commands/init";
import { install } from "./commands/install";
import { update } from "./commands/update";
import { add } from "./commands/add";

const program = new Command();

program.name(pkg.name).description(pkg.description).version(pkg.version);

program.command("init").action(init);

program
  .command("add")
  .description("Add a new service")
  .argument("<repository>", "Repository of the service")
  .option("-w, --workspaces <workspaces...>", "Workspaces of the service")
  .option("-b, --branch <branch>", "Branch of the service")
  .option(
    "-e, --exclude-periods <excludePeriods...>",
    "Periods to exclude from the service",
  )
  .action(
    (
      repository: string,
      options: {
        workspaces?: string[];
        branch?: string;
        excludePeriods?: string[];
      },
    ) => {
      void add(
        repository,
        options.workspaces,
        options.branch,
        options.excludePeriods,
      );
    },
  );

program.command("install").action(install);

program
  .command("update")
  .description("Update the endpoint files")
  .argument("<alias>", "Alias of the service to update")
  .action(update);

program.parse();
