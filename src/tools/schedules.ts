import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { apiClient } from '../client.js';

export function registerScheduleTools(server: McpServer): void {
  server.tool(
    'list_schedules',
    '프로젝트 또는 특정 태스크의 일정 목록을 조회합니다.',
    {
      projectId: z.string().describe('일정을 조회할 프로젝트 ID'),
      taskId: z.string().optional().describe('특정 태스크의 일정만 조회할 경우 태스크 ID'),
    },
    async ({ projectId, taskId }) => {
      try {
        let response;
        if (taskId) {
          response = await apiClient.get(`/api/tasks/${taskId}/schedules`, {
            params: { projectId },
          });
        } else {
          response = await apiClient.get(`/api/projects/${projectId}/schedules`);
        }
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
    'create_schedule',
    '태스크에 새 일정을 생성합니다.',
    {
      taskId: z.string().describe('일정을 생성할 태스크 ID'),
      projectId: z.string().describe('프로젝트 ID'),
      startDate: z.string().describe('시작일 (YYYY-MM-DD)'),
      startHalf: z.enum(['AM', 'PM']).describe('시작 반일 (AM 또는 PM)'),
      endDate: z.string().describe('종료일 (YYYY-MM-DD)'),
      endHalf: z.enum(['AM', 'PM']).describe('종료 반일 (AM 또는 PM)'),
      title: z.string().optional().describe('일정 제목'),
    },
    async ({ taskId, projectId, startDate, startHalf, endDate, endHalf, title }) => {
      try {
        const body: Record<string, unknown> = {
          projectId,
          startDate,
          startHalf,
          endDate,
          endHalf,
        };
        if (title !== undefined) body.title = title;

        const response = await apiClient.post(`/api/tasks/${taskId}/schedules`, body);
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
    'update_schedule',
    '일정을 수정합니다.',
    {
      scheduleId: z.string().describe('수정할 일정 ID'),
      startDate: z.string().optional().describe('새 시작일 (YYYY-MM-DD)'),
      startHalf: z.enum(['AM', 'PM']).optional().describe('새 시작 반일 (AM 또는 PM)'),
      endDate: z.string().optional().describe('새 종료일 (YYYY-MM-DD)'),
      endHalf: z.enum(['AM', 'PM']).optional().describe('새 종료 반일 (AM 또는 PM)'),
      title: z.string().optional().describe('새 일정 제목'),
    },
    async ({ scheduleId, startDate, startHalf, endDate, endHalf, title }) => {
      try {
        const body: Record<string, unknown> = {};
        if (startDate !== undefined) body.startDate = startDate;
        if (startHalf !== undefined) body.startHalf = startHalf;
        if (endDate !== undefined) body.endDate = endDate;
        if (endHalf !== undefined) body.endHalf = endHalf;
        if (title !== undefined) body.title = title;

        const response = await apiClient.patch(`/api/schedules/${scheduleId}`, body);
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
    'delete_schedule',
    '일정을 삭제합니다.',
    {
      scheduleId: z.string().describe('삭제할 일정 ID'),
    },
    async ({ scheduleId }) => {
      try {
        await apiClient.delete(`/api/schedules/${scheduleId}`);
        return {
          content: [{ type: 'text', text: `일정 ${scheduleId} 삭제 완료` }],
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
