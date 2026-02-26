import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { apiClient } from '../client.js';

export function registerProjectTools(server: McpServer): void {
  server.tool(
    'list_projects',
    'JJ Planner의 모든 프로젝트 목록을 조회합니다.',
    {},
    async () => {
      try {
        const response = await apiClient.get('/api/projects');
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
    '특정 프로젝트의 상세 정보를 조회합니다.',
    {
      projectId: z.string().describe('조회할 프로젝트 ID'),
    },
    async ({ projectId }) => {
      try {
        const response = await apiClient.get(`/api/projects/${projectId}`);
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
