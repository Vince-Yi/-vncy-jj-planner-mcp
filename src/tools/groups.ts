import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { apiClient } from '../client.js';

export function registerGroupTools(server: McpServer): void {
  server.tool(
    'list_groups',
    '특정 프로젝트의 그룹 목록을 조회합니다.',
    {
      projectId: z.string().describe('그룹을 조회할 프로젝트 ID'),
    },
    async ({ projectId }) => {
      try {
        const response = await apiClient.get(`/api/projects/${projectId}/groups`);
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
