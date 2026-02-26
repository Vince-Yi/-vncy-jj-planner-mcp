import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { getApiClient } from '../client.js';

export function registerScheduleTools(server: McpServer): void {
  server.tool(
    'list_schedules',
    '일정 목록 조회',
    {
      projectId: z.string(),
      taskId: z.string().optional().describe('지정 시 해당 태스크 일정만 조회'),
    },
    async ({ projectId, taskId }) => {
      try {
        let response;
        if (taskId) {
          response = await getApiClient().get(`/api/tasks/${taskId}/schedules`, {
            params: { projectId },
          });
        } else {
          response = await getApiClient().get(`/api/projects/${projectId}/schedules`);
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
    '태스크 일정 생성',
    {
      taskId: z.string(),
      projectId: z.string(),
      startDate: z.string().describe('YYYY-MM-DD'),
      startHalf: z.enum(['AM', 'PM']),
      endDate: z.string().describe('YYYY-MM-DD'),
      endHalf: z.enum(['AM', 'PM']),
      title: z.string().optional(),
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

        const response = await getApiClient().post(`/api/tasks/${taskId}/schedules`, body);
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
    '일정 수정',
    {
      scheduleId: z.string(),
      startDate: z.string().optional().describe('YYYY-MM-DD'),
      startHalf: z.enum(['AM', 'PM']).optional(),
      endDate: z.string().optional().describe('YYYY-MM-DD'),
      endHalf: z.enum(['AM', 'PM']).optional(),
      title: z.string().optional(),
    },
    async ({ scheduleId, startDate, startHalf, endDate, endHalf, title }) => {
      try {
        const body: Record<string, unknown> = {};
        if (startDate !== undefined) body.startDate = startDate;
        if (startHalf !== undefined) body.startHalf = startHalf;
        if (endDate !== undefined) body.endDate = endDate;
        if (endHalf !== undefined) body.endHalf = endHalf;
        if (title !== undefined) body.title = title;

        const response = await getApiClient().patch(`/api/schedules/${scheduleId}`, body);
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
    '일정 삭제',
    {
      scheduleId: z.string(),
    },
    async ({ scheduleId }) => {
      try {
        await getApiClient().delete(`/api/schedules/${scheduleId}`);
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
