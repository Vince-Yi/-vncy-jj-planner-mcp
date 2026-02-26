import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { apiClient } from '../client.js';

export function registerTaskTools(server: McpServer): void {
  server.tool(
    'list_tasks',
    '특정 프로젝트의 태스크 목록을 조회합니다.',
    {
      projectId: z.string().describe('태스크를 조회할 프로젝트 ID'),
    },
    async ({ projectId }) => {
      try {
        const response = await apiClient.get(`/api/projects/${projectId}/tasks`);
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
    '특정 태스크의 상세 정보를 조회합니다.',
    {
      taskId: z.string().describe('조회할 태스크 ID'),
    },
    async ({ taskId }) => {
      try {
        const response = await apiClient.get(`/api/tasks/${taskId}`);
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
    '새 태스크를 생성합니다.',
    {
      projectId: z.string().describe('태스크를 생성할 프로젝트 ID'),
      title: z.string().describe('태스크 이름'),
      groupId: z.string().optional().describe('그룹 ID'),
      assignees: z.array(z.string()).optional().describe('담당자 이메일 목록'),
      status: z.enum(['pending', 'in_progress', 'completed']).optional().describe('태스크 상태'),
      progress: z.number().min(0).max(100).optional().describe('진행률 (0~100)'),
    },
    async ({ projectId, title, groupId, assignees, status, progress }) => {
      try {
        const body: Record<string, unknown> = { name: title };
        if (groupId !== undefined) body.groupId = groupId;
        if (assignees !== undefined) body.assignees = assignees;
        if (status !== undefined) body.status = status;
        if (progress !== undefined) body.progress = progress;

        const response = await apiClient.post(`/api/projects/${projectId}/tasks`, body);
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
    '태스크를 수정합니다.',
    {
      taskId: z.string().describe('수정할 태스크 ID'),
      title: z.string().optional().describe('새 태스크 이름'),
      groupId: z.string().optional().describe('새 그룹 ID'),
      assignees: z.array(z.string()).optional().describe('새 담당자 이메일 목록'),
      status: z.enum(['pending', 'in_progress', 'completed']).optional().describe('새 상태'),
      progress: z.number().min(0).max(100).optional().describe('새 진행률 (0~100)'),
    },
    async ({ taskId, title, groupId, assignees, status, progress }) => {
      try {
        const body: Record<string, unknown> = {};
        if (title !== undefined) body.name = title;
        if (groupId !== undefined) body.groupId = groupId;
        if (assignees !== undefined) body.assignees = assignees;
        if (status !== undefined) body.status = status;
        if (progress !== undefined) body.progress = progress;

        const response = await apiClient.patch(`/api/tasks/${taskId}`, body);
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
    '태스크를 삭제합니다.',
    {
      taskId: z.string().describe('삭제할 태스크 ID'),
    },
    async ({ taskId }) => {
      try {
        await apiClient.delete(`/api/tasks/${taskId}`);
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
