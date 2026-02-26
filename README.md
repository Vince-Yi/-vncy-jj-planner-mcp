# JJ Planner MCP Server

An MCP (Model Context Protocol) server that connects AI agents (Cursor, Claude, etc.) to [JJ Planner](https://github.com/your-org/jj-planner) — a project management PWA. Agents can query, create, update, and delete projects, tasks, and schedules through this server.

## Requirements

- Node.js 22.x or higher
- A valid JJ Planner API key (issued from JJ Planner settings page)

## Installation

**Via npm (recommended):**

```bash
npm install -g @vncy/jj-planner-mcp
```

**From source:**

```bash
git clone https://github.com/Vince-Yi/-vncy-jj-planner-mcp.git
cd -vncy-jj-planner-mcp
npm install
npm run build
```

## Configuration

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

```env
JJ_PLANNER_API_BASE_URL=https://your-backend-url.com
JJ_PLANNER_API_KEY=jjp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

| Variable | Description |
|---|---|
| `JJ_PLANNER_API_BASE_URL` | Base URL of the JJ Planner backend |
| `JJ_PLANNER_API_KEY` | API key in the format `jjp_` + 64-char hex (68 chars total) |

## Registering with Cursor

Add the following to your Cursor `mcp.json`:

```json
{
    "mcpServers": {
        "jj-planner": {
            "command": "npx",
            "args": ["-y", "@vncy/jj-planner-mcp"],
            "env": {
                "JJ_PLANNER_API_BASE_URL": "https://your-backend-url.com",
                "JJ_PLANNER_API_KEY": "jjp_..."
            }
        }
    }
}
```

## Registering with Claude Code

Add to your `claude_desktop_config.json` (or Claude Code MCP settings):

```json
{
    "mcpServers": {
        "jj-planner": {
            "command": "npx",
            "args": ["-y", "@vncy/jj-planner-mcp"],
            "env": {
                "JJ_PLANNER_API_BASE_URL": "https://your-backend-url.com",
                "JJ_PLANNER_API_KEY": "jjp_..."
            }
        }
    }
}
```

## Available Tools

### Projects

| Tool | Required Args | Optional Args | Description |
|---|---|---|---|
| `list_projects` | — | — | List all projects |
| `get_project` | `projectId` | — | Get project details |

### Groups

| Tool | Required Args | Optional Args | Description |
|---|---|---|---|
| `list_groups` | `projectId` | — | List groups in a project |

### Tasks

| Tool | Required Args | Optional Args | Description |
|---|---|---|---|
| `list_tasks` | `projectId` | — | List tasks in a project |
| `get_task` | `taskId` | — | Get task details |
| `create_task` | `projectId`, `title` | `groupId`, `assignees`, `status`, `progress` | Create a new task |
| `update_task` | `taskId` | `title`, `groupId`, `assignees`, `status`, `progress` | Update a task |
| `delete_task` | `taskId` | — | Delete a task |

**Task status values:** `pending` / `in_progress` / `completed`

**Task progress:** integer from `0` to `100`

### Schedules

| Tool | Required Args | Optional Args | Description |
|---|---|---|---|
| `list_schedules` | `projectId` | `taskId` | List schedules (all or per task) |
| `create_schedule` | `taskId`, `projectId`, `startDate`, `startHalf`, `endDate`, `endHalf` | `title` | Create a new schedule |
| `update_schedule` | `scheduleId` | `startDate`, `startHalf`, `endDate`, `endHalf`, `title` | Update a schedule |
| `delete_schedule` | `scheduleId` | — | Delete a schedule |

**Date format:** `YYYY-MM-DD`

**Half-day values:** `AM` / `PM`

## Project Structure

```
jj-planner-mcp/
├── package.json
├── tsconfig.json
├── .env.example
└── src/
    ├── index.ts          # MCP server entry point, tool registration, stdio transport
    ├── client.ts         # axios instance with X-API-Key header and response unwrapping
    └── tools/
        ├── projects.ts   # list_projects, get_project
        ├── groups.ts     # list_groups
        ├── tasks.ts      # list_tasks, get_task, create_task, update_task, delete_task
        └── schedules.ts  # list_schedules, create_schedule, update_schedule, delete_schedule
```

## Scripts

| Command | Description |
|---|---|
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run the compiled server |
| `npm run dev` | Run directly with ts-node (development) |

## Authentication

Every request to the JJ Planner backend includes the following header:

```
X-API-Key: <your-api-key>
```

The API key can be generated from the JJ Planner settings page. It follows the format `jjp_` followed by 64 hexadecimal characters (68 characters total).

## License

MIT
