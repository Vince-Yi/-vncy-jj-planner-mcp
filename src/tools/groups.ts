import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { getApiClient } from '../client.js';

export function registerGroupTools(server: McpServer): void {
  server.tool(
    'list_groups',
    '프로젝트 그룹 목록 조회',
    {
      projectId: z.string(),
    },
    async ({ projectId }) => {
      try {
        const response = await getApiClient().get(`/api/projects/${projectId}/groups`);
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
