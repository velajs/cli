# @velajs/cli

Node-side command-line tools for [Vela](https://github.com/velajs/vela) apps. Runs
outside the edge Worker (it uses `node:*` / `process`), so it stays out of your
Worker bundle.

## Install

```bash
pnpm add -D @velajs/cli
```

## Commands

| Command | What it does |
| --- | --- |
| `vela db seed` | Build the app and run all `@Seeder()` classes in order. |
| `vela route list` | HTTP route table: framework-composed controller routes (`Controller#handler`, full paths incl. prefix/version) plus `(mounted)` extras (CRUD/contributed, doc UIs). |
| `vela module graph` | Module graph: imports tree with `global`/`lazy` flags and provider counts (`--json` for the raw graph). |
| `vela entrypoint list` | Declared entrypoint kinds (websocket, queue, cron, …) and their entries — lazy modules stay unmaterialized. |
| `vela openapi dump` | Emit the OpenAPI document (needs `rootModule` in the config; `--out`, `--title`, `--api-version`, `--global-prefix`). |
| `vela mcp serve` | Run a Model Context Protocol stdio server exposing the introspection above as read-only tools (`route_list`, `module_graph`, `entrypoint_list`, `openapi_dump`, `token_describe`) plus a `vela://openapi` resource — for AI agents. |

All introspection commands take `--config <path>`; the four listing/dump commands also take `--json`.

### MCP server

`vela mcp serve` builds the app from `vela.config` and speaks the [Model Context
Protocol](https://modelcontextprotocol.io) over stdio, so an AI agent can query
the app's shape. It exposes read-only tools — `route_list`, `module_graph`
(`{ tree? }`), `entrypoint_list`, `openapi_dump` (`{ globalPrefix?, title?,
apiVersion? }`, needs `rootModule`), `token_describe` (`{ token }`) — and, when
`rootModule` is set, a `vela://openapi` resource. Tool results are JSON text.
stdout carries only JSON-RPC; all logging goes to stderr. The server runs until
the client disconnects, then disposes the app.

```jsonc
// e.g. in an MCP client config
{
  "mcpServers": {
    "vela": { "command": "vela", "args": ["mcp", "serve"] }
  }
}
```

## Configure

Create a `vela.config.{js,mjs,ts}` at your project root that builds your app.
Wire your runtime bindings here (e.g. via miniflare for Cloudflare, or a Node
adapter):

```ts
// vela.config.ts
import { defineVelaConfig } from '@velajs/cli/config';
import { AppModule } from './src/app.module';

export default defineVelaConfig({
  rootModule: AppModule, // optional — needed by `vela openapi dump`
  async createApp() {
    const { createCloudflareApp } = await import('@velajs/cloudflare');
    return createCloudflareApp(AppModule);
  },
});
```

> `.ts` configs require a runtime that strips types (Node 22+
> `--experimental-strip-types`, or `tsx`). `.js`/`.mjs` load directly.

## Commands

```bash
# Run all @Seeder() classes (see @velajs/vela/seeder), in order:
vela db seed
vela db seed --config ./config/vela.config.js
vela db seed --continue-on-error
```

Exit code is `0` when all seeders run and `1` if any fail.
