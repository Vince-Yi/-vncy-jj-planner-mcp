import 'dotenv/config';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { registerProjectTools } from './tools/projects.js';
import { registerGroupTools } from './tools/groups.js';
import { registerTaskTools } from './tools/tasks.js';
import { registerScheduleTools } from './tools/schedules.js';

const server = new McpServer({
  name: 'jj-planner-mcp',
  version: '1.0.0',
});

registerProjectTools(server);
registerGroupTools(server);
registerTaskTools(server);
registerScheduleTools(server);

async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
