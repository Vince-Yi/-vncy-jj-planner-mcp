import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { getApiClient } from '../client.js';

export function registerProjectTools(server: McpServer): void {
  server.tool(
    'list_projects',
    '프로젝트 목록 조회',
    {},
    async () => {
      try {
        const response = await getApiClient().get('/api/projects');
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [{ type: 'text', text: `Error: ${message}` }],
          isError: true,
        };
      }
    }
  );

  server.tool(
    'get_project',
    '프로젝트 상세 조회',
    {
      projectId: z.string(),
    },
    async ({ projectId }) => {
      try {
        const response = await getApiClient().get(`/api/projects/${projectId}`);
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [{ type: 'text', text: `Error: ${message}` }],
          isError: true,
        };
      }
    }
  );
}
