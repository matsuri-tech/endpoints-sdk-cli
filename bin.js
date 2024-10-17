#!/usr/bin/env node
const cli = require("./index");

cli.run(process.argv.slice(1)).catch((e) => {
  console.error(e);
  process.exit(1);
});
