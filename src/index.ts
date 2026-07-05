#!/usr/bin/env node
import { Builtins, Cli } from 'clipanion';
import {
  EntrypointListCommand,
  ModuleGraphCommand,
  OpenApiDumpCommand,
  RouteListCommand,
} from './commands/introspect.commands.js';
import { SeedCommand } from './commands/seed.command.js';

const cli = new Cli({
  binaryName: 'vela',
  binaryLabel: 'Vela CLI',
  binaryVersion: '0.2.0',
});

cli.register(Builtins.HelpCommand);
cli.register(Builtins.VersionCommand);
cli.register(SeedCommand);
cli.register(RouteListCommand);
cli.register(ModuleGraphCommand);
cli.register(EntrypointListCommand);
cli.register(OpenApiDumpCommand);

void cli.runExit(process.argv.slice(2));

export { SeedCommand } from './commands/seed.command.js';
export {
  EntrypointListCommand,
  ModuleGraphCommand,
  OpenApiDumpCommand,
  RouteListCommand,
} from './commands/introspect.commands.js';
export { collectRoutes, collectModules, collectEntrypoints, renderModuleTree } from './introspect.js';
export type { RouteRow, EntrypointRow } from './introspect.js';
export { renderTable } from './format.js';
export { loadConfig, defineVelaConfig } from './config.js';
export type { VelaConfig } from './config.js';
export { formatSeedResults } from './format.js';
