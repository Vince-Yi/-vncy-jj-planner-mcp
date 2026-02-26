import axios from 'axios';

const apiKey = process.env.JJ_PLANNER_API_KEY;
const baseURL = process.env.JJ_PLANNER_API_BASE_URL;

if (!apiKey) {
  throw new Error('JJ_PLANNER_API_KEY environment variable is required');
}
if (!baseURL) {
  throw new Error('JJ_PLANNER_API_BASE_URL environment variable is required');
}

export const apiClient = axios.create({
  baseURL,
  headers: {
    'X-API-Key': apiKey,
    'Content-Type': 'application/json',
  },
});

// 응답 래퍼 { data: T } 언래핑
apiClient.interceptors.response.use(
  (response) => {
    if (response.data && 'data' in response.data) {
      response.data = response.data.data;
    }
    return response;
  },
  (error) => Promise.reject(error)
);
