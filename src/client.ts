import axios from 'axios';

let _apiClient: ReturnType<typeof axios.create> | null = null;

function getConfig(): { apiKey: string; baseURL: string } {
  const apiKey = process.env.JJ_PLANNER_API_KEY;
  const baseURL = process.env.JJ_PLANNER_API_BASE_URL;
  if (!apiKey || !baseURL) {
    throw new Error(
      'JJ_PLANNER_API_KEY와 JJ_PLANNER_API_BASE_URL 환경 변수를 설정하세요. Cursor MCP 설정의 env에 넣거나 .env 파일을 사용하세요.'
    );
  }
  return { apiKey, baseURL };
}

export function getApiClient(): ReturnType<typeof axios.create> {
  if (!_apiClient) {
    const { apiKey, baseURL } = getConfig();
    _apiClient = axios.create({
      baseURL,
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json',
      },
    });
    _apiClient.interceptors.response.use(
      (response) => {
        if (response.data && 'data' in response.data) {
          response.data = response.data.data;
        }
        return response;
      },
      (error) => Promise.reject(error)
    );
  }
  return _apiClient;
}
