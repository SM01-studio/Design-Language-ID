import type { Project, StepData, ChatMessage } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.siliang.cfd/api/design-id';
const MAIN_PORTAL = 'https://siliang.cfd';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token') ||
    new URLSearchParams(window.location.search).get('auth_token');
}

function authHeaders(): HeadersInit {
  const headers: HeadersInit = {};
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...authHeaders(), ...options.headers },
  });

  if (response.status === 401) {
    window.location.href = `${MAIN_PORTAL}/index.html?from=design-id`;
    throw new Error('Unauthorized');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
}

// Projects
export const projectApi = {
  list: () => apiRequest<Project[]>('/projects'),
  create: (name: string, description?: string) =>
    apiRequest<Project>('/projects', {
      method: 'POST',
      body: JSON.stringify({ name, description }),
    }),
  get: (id: string) => apiRequest<Project & { steps: StepData[] }>(`/projects/${id}`),
  delete: (id: string) =>
    apiRequest<{ status: string }>(`/projects/${id}`, { method: 'DELETE' }),

  clearAll: () =>
    apiRequest<{ status: string; count: number }>('/projects/clear-all', { method: 'DELETE' }),
};

// Workflow
export const workflowApi = {
  executeStep: (projectId: string, step: number, input?: Record<string, unknown>) =>
    apiRequest<{ step: number; data: Record<string, unknown> }>(
      `/projects/${projectId}/step/${step}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(input || {}),
      }
    ),

  executeStepStream: async (
    projectId: string,
    step: number,
    input: Record<string, unknown>,
    onChunk: (text: string, fullText: string) => void,
    onEvent?: (event: Record<string, unknown>) => void,
  ): Promise<Record<string, unknown>> => {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/step/${step}/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(input || {}),
    });

    if (response.status === 401) {
      window.location.href = `${MAIN_PORTAL}/index.html?from=design-id`;
      throw new Error('Unauthorized');
    }
    if (!response.ok) {
      throw new Error('Stream request failed');
    }

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let fullText = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        if (!trimmed.startsWith('data: ')) continue;
        const jsonStr = trimmed.slice(6).trim();
        if (!jsonStr || jsonStr === '[DONE]') break;
        try {
          const parsed = JSON.parse(jsonStr);
          if (parsed.error) throw new Error(parsed.error);
          if (parsed.done) break;
          if (parsed.type === 'scrape_event') {
            onEvent?.(parsed.data);
            continue;
          }
          if (parsed.chunk) {
            fullText += parsed.chunk;
            onChunk(parsed.chunk, fullText);
          }
        } catch (e) {
          if (e instanceof SyntaxError) continue;
          throw e;
        }
      }
    }

    try {
      return JSON.parse(fullText);
    } catch {
      return { raw_text: fullText };
    }
  },

  confirmStep: (projectId: string, step: number) =>
    apiRequest<{ status: string; step: number }>(
      `/projects/${projectId}/step/${step}/confirm`,
      { method: 'POST' }
    ),

  modifyStep: (projectId: string, step: number, section: string, feedback: string) =>
    apiRequest<{ step: number; data: Record<string, unknown> }>(
      `/projects/${projectId}/step/${step}/modify`,
      {
        method: 'POST',
        body: JSON.stringify({ section, feedback }),
      }
    ),

  gotoStep: (projectId: string, targetStep: number) =>
    apiRequest<{ step: number; data: Record<string, unknown> | null }>(
      `/projects/${projectId}/goto/${targetStep}`,
      { method: 'POST' }
    ),
};

// Chat
export const chatApi = {
  send: (projectId: string, message: string, step: number) =>
    apiRequest<{ role: string; content: string; updated_data?: Record<string, unknown> }>(`/projects/${projectId}/chat`, {
      method: 'POST',
      body: JSON.stringify({ message, step }),
    }),

  getHistory: (projectId: string, step?: number) => {
    const query = step ? `?step=${step}` : '';
    return apiRequest<ChatMessage[]>(`/projects/${projectId}/chat/history${query}`);
  },
};

// Upload
export const uploadApi = {
  upload: async (file: File): Promise<{
    filename: string;
    type: string;
    text: string;
    page_count?: number;
  }> => {
    const formData = new FormData();
    formData.append('file', file);

    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(error.error);
    }

    return response.json();
  },
};

// Export
export const exportApi = {
  exportStep: async (
    projectId: string,
    format: 'docx' | 'pdf',
    step: number,
  ): Promise<void> => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/export`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ format, step }),
    });

    if (response.status === 401) {
      window.location.href = `${MAIN_PORTAL}/index.html?from=design-id`;
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(error.error || '导出失败');
    }

    const disposition = response.headers.get('Content-Disposition');
    let filename = `step${step}-export.${format}`;
    if (disposition) {
      const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (match?.[1]) {
        filename = decodeURIComponent(match[1].replace(/['"]/g, ''));
      }
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  exportPackage: async (
    projectId: string,
    format: 'docx' | 'pdf' = 'docx',
  ): Promise<void> => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/export-package?format=${format}`, {
      method: 'GET',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (response.status === 401) {
      window.location.href = `${MAIN_PORTAL}/index.html?from=design-id`;
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(error.error || '导出失败');
    }

    const disposition = response.headers.get('Content-Disposition');
    let filename = `完整交付包.zip`;
    if (disposition) {
      const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (match?.[1]) {
        filename = decodeURIComponent(match[1].replace(/['"]/g, ''));
      }
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
};

// Auth
export async function verifyAuth(): Promise<boolean> {
  try {
    const token = getToken();
    if (!token) return false;

    const response = await fetch(`${API_BASE_URL}/verify`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.ok;
  } catch {
    return false;
  }
}
