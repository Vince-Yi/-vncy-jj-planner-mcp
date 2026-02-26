import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { getApiClient } from '../client.js';

export function registerTaskTools(server: McpServer): void {
  server.tool(
    'list_tasks',
    '프로젝트 태스크 목록 조회',
    {
      projectId: z.string(),
    },
    async ({ projectId }) => {
      try {
        const response = await getApiClient().get(`/api/projects/${projectId}/tasks`);
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
    'get_task',
    '태스크 상세 조회',
    {
      taskId: z.string(),
    },
    async ({ taskId }) => {
      try {
        const response = await getApiClient().get(`/api/tasks/${taskId}`);
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
    'create_task',
    '태스크 생성',
    {
      projectId: z.string(),
      title: z.string(),
      groupId: z.string().optional(),
      assignees: z.array(z.string()).optional().describe('담당자 이메일[]'),
      status: z.enum(['pending', 'in_progress', 'completed']).optional(),
      progress: z.number().min(0).max(100).optional().describe('0-100'),
    },
    async ({ projectId, title, groupId, assignees, status, progress }) => {
      try {
        const body: Record<string, unknown> = { name: title };
        if (groupId !== undefined) body.groupId = groupId;
        if (assignees !== undefined) body.assignees = assignees;
        if (status !== undefined) body.status = status;
        if (progress !== undefined) body.progress = progress;

        const response = await getApiClient().post(`/api/projects/${projectId}/tasks`, body);
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
    'update_task',
    '태스크 수정',
    {
      taskId: z.string(),
      title: z.string().optional(),
      groupId: z.string().optional(),
      assignees: z.array(z.string()).optional().describe('담당자 이메일[]'),
      status: z.enum(['pending', 'in_progress', 'completed']).optional(),
      progress: z.number().min(0).max(100).optional().describe('0-100'),
    },
    async ({ taskId, title, groupId, assignees, status, progress }) => {
      try {
        const body: Record<string, unknown> = {};
        if (title !== undefined) body.name = title;
        if (groupId !== undefined) body.groupId = groupId;
        if (assignees !== undefined) body.assignees = assignees;
        if (status !== undefined) body.status = status;
        if (progress !== undefined) body.progress = progress;

        const response = await getApiClient().patch(`/api/tasks/${taskId}`, body);
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
    'delete_task',
    '태스크 삭제',
    {
      taskId: z.string(),
    },
    async ({ taskId }) => {
      try {
        await getApiClient().delete(`/api/tasks/${taskId}`);
        return {
          content: [{ type: 'text', text: `태스크 ${taskId} 삭제 완료` }],
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
