import { API_CONFIG } from '../config/api';

class ApiClient {
  private baseUrl: string;
  private groupId: string;

  constructor() {
    this.baseUrl = API_CONFIG.baseUrl;
    this.groupId = API_CONFIG.defaultGroupId;
  }

  async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${response.statusText}`);
    }

    // Handle empty responses (common for DELETE requests)
    const contentType = response.headers.get('content-type');
    if (response.status === 204 || !contentType?.includes('application/json')) {
      return undefined as T;
    }

    // Check if response has content
    const text = await response.text();
    if (!text) {
      return undefined as T;
    }

    try {
      return JSON.parse(text);
    } catch (error) {
      console.warn('Failed to parse JSON response:', text);
      return undefined as T;
    }
  }

  getGroupEndpoint(path: string): string {
    return `/groups/${this.groupId}${path}`;
  }
}

export const apiClient = new ApiClient();