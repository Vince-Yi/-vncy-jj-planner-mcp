# JJ Planner MCP 서버

AI 에이전트(Cursor, Claude 등)와 프로젝트 관리 PWA인 [JJ Planner](https://github.com/your-org/jj-planner)를 연결하는 MCP(Model Context Protocol) 서버입니다. 에이전트는 이 서버를 통해 프로젝트·태스크·일정을 조회·생성·수정·삭제할 수 있습니다.

## 요구사항

- Node.js 22.x 이상
- JJ Planner API 키 (JJ Planner 설정 페이지에서 발급)

## 설치

```bash
git clone https://github.com/your-org/jj-planner-mcp.git
cd jj-planner-mcp
npm install
npm run build
```

## 환경 설정

`.env.example`을 `.env`로 복사한 뒤 값을 입력합니다:

```bash
cp .env.example .env
```

```env
JJ_PLANNER_API_BASE_URL=https://your-backend-url.com
JJ_PLANNER_API_KEY=jjp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

| 변수 | 설명 |
|---|---|
| `JJ_PLANNER_API_BASE_URL` | JJ Planner 백엔드 베이스 URL |
| `JJ_PLANNER_API_KEY` | `jjp_` + 64자리 hex 형식 API 키 (총 68자) |

## Cursor 등록 방법

Cursor `mcp.json`에 아래 내용을 추가합니다:

```json
{
    "mcpServers": {
        "jj-planner": {
            "command": "node",
            "args": ["/절대경로/jj-planner-mcp/dist/index.js"],
            "env": {
                "JJ_PLANNER_API_BASE_URL": "https://your-backend-url.com",
                "JJ_PLANNER_API_KEY": "jjp_..."
            }
        }
    }
}
```

## Claude Code 등록 방법

`claude_desktop_config.json` 또는 Claude Code MCP 설정에 추가합니다:

```json
{
    "mcpServers": {
        "jj-planner": {
            "command": "node",
            "args": ["/절대경로/jj-planner-mcp/dist/index.js"],
            "env": {
                "JJ_PLANNER_API_BASE_URL": "https://your-backend-url.com",
                "JJ_PLANNER_API_KEY": "jjp_..."
            }
        }
    }
}
```

## 제공 도구 목록

### 프로젝트

| 도구 | 필수 인자 | 선택 인자 | 설명 |
|---|---|---|---|
| `list_projects` | — | — | 전체 프로젝트 목록 조회 |
| `get_project` | `projectId` | — | 프로젝트 상세 정보 조회 |

### 그룹

| 도구 | 필수 인자 | 선택 인자 | 설명 |
|---|---|---|---|
| `list_groups` | `projectId` | — | 프로젝트 내 그룹 목록 조회 |

### 태스크

| 도구 | 필수 인자 | 선택 인자 | 설명 |
|---|---|---|---|
| `list_tasks` | `projectId` | — | 프로젝트 내 태스크 목록 조회 |
| `get_task` | `taskId` | — | 태스크 상세 정보 조회 |
| `create_task` | `projectId`, `title` | `groupId`, `assignees`, `status`, `progress` | 태스크 생성 |
| `update_task` | `taskId` | `title`, `groupId`, `assignees`, `status`, `progress` | 태스크 수정 |
| `delete_task` | `taskId` | — | 태스크 삭제 |

**태스크 상태값:** `pending` / `in_progress` / `completed`

**진행률:** `0` ~ `100` 정수

### 일정

| 도구 | 필수 인자 | 선택 인자 | 설명 |
|---|---|---|---|
| `list_schedules` | `projectId` | `taskId` | 일정 목록 조회 (전체 또는 태스크별) |
| `create_schedule` | `taskId`, `projectId`, `startDate`, `startHalf`, `endDate`, `endHalf` | `title` | 일정 생성 |
| `update_schedule` | `scheduleId` | `startDate`, `startHalf`, `endDate`, `endHalf`, `title` | 일정 수정 |
| `delete_schedule` | `scheduleId` | — | 일정 삭제 |

**날짜 형식:** `YYYY-MM-DD`

**반일 값:** `AM` / `PM`

## 프로젝트 구조

```
jj-planner-mcp/
├── package.json
├── tsconfig.json
├── .env.example
└── src/
    ├── index.ts          # MCP 서버 진입점, 도구 등록, stdio transport 연결
    ├── client.ts         # axios 인스턴스 (X-API-Key 헤더, 응답 언래핑)
    └── tools/
        ├── projects.ts   # list_projects, get_project
        ├── groups.ts     # list_groups
        ├── tasks.ts      # list_tasks, get_task, create_task, update_task, delete_task
        └── schedules.ts  # list_schedules, create_schedule, update_schedule, delete_schedule
```

## 스크립트

| 명령어 | 설명 |
|---|---|
| `npm run build` | TypeScript를 `dist/`로 컴파일 |
| `npm start` | 컴파일된 서버 실행 |
| `npm run dev` | ts-node로 직접 실행 (개발용) |

## 인증 방식

JJ Planner 백엔드로의 모든 요청에 아래 헤더가 포함됩니다:

```
X-API-Key: <발급받은 API 키>
```

API 키는 JJ Planner 설정 페이지에서 발급받을 수 있으며, `jjp_` 뒤에 64자리 16진수가 붙는 형식(총 68자)입니다.

## 라이선스

MIT
