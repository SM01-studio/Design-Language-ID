import { create } from 'zustand';
import { projectApi, workflowApi, chatApi } from '@/services/api';
import type { Project, StepData, ChatMessage } from '@/types';

interface WorkflowStore {
  // State
  project: Project | null;
  currentStep: number;
  stepData: Record<number, Record<string, unknown>>;
  chatMessages: ChatMessage[];
  isLoading: boolean;
  isChatLoading: boolean;
  streamingText: string;
  error: string | null;
  isScraping: boolean;
  scrapeStatus: {
    status: string;
    keywords?: string[];
    total?: number;
    platforms: {
      wechat: { status: string; count: number; results: Array<{ title: string; content: string }> };
      xiaohongshu: { status: string; count: number; results: Array<{ title: string; content: string }> };
      douyin: { status: string; count: number; results: Array<{ title: string; content: string }> };
    };
  };

  // Actions
  loadProject: (projectId: string) => Promise<void>;
  createProject: (name: string, description?: string) => Promise<string>;
  executeStep: (step: number, input?: Record<string, unknown>) => Promise<void>;
  confirmStep: (step: number) => Promise<void>;
  modifyStep: (step: number, section: string, feedback: string) => Promise<void>;
  gotoStep: (targetStep: number) => Promise<void>;
  sendChat: (message: string) => Promise<void>;
  loadChatHistory: (step?: number) => Promise<void>;
  clearError: () => void;
}

/** Reload a step's merged data from backend (prefers sub_step=0). */
async function reloadStepFromBackend(step: number): Promise<Record<string, unknown>> {
  const projectId = useWorkflowStore.getState().project!.id;
  const project = await projectApi.get(projectId);
  const match = (project.steps || []).find((s: StepData) => s.step === step && (s as any).sub_step === 0);
  if (match?.data && !('raw_text' in match.data)) return match.data;
  // Fallback: any sub_step for this step
  const anyMatch = (project.steps || []).find((s: StepData) => s.step === step);
  if (anyMatch?.data) return anyMatch.data;
  // Last resort: non-streaming execute
  const resp = await workflowApi.executeStep(projectId, step);
  return resp.data;
}

export const useWorkflowStore = create<WorkflowStore>((set, get) => ({
  project: null,
  currentStep: 0,
  stepData: {},
  chatMessages: [],
  isLoading: false,
  isChatLoading: false,
  streamingText: '',
  error: null,
  isScraping: false,
  scrapeStatus: {
    status: '',
    platforms: {
      wechat: { status: 'idle', count: 0, results: [] },
      xiaohongshu: { status: 'idle', count: 0, results: [] },
      douyin: { status: 'idle', count: 0, results: [] },
    },
  },

  loadProject: async (projectId) => {
    set({ error: null });
    try {
      const project = await projectApi.get(projectId);
      const stepDataMap: Record<number, Record<string, unknown>> = {};
      (project.steps || []).forEach((s: StepData) => {
        // Prefer sub_step=0 (merged result) — only overwrite if same step but sub=0
        const subStep = (s as any).sub_step ?? 0;
        if (subStep === 0 || !stepDataMap[s.step]) {
          stepDataMap[s.step] = s.data;
        }
      });
      set({
        project,
        currentStep: project.current_step,
        stepData: stepDataMap,
      });
    } catch (e: any) {
      set({ error: e.message });
    }
  },

  createProject: async (name, description) => {
    const project = await projectApi.create(name, description);
    set({ project, currentStep: 0, stepData: {}, chatMessages: [] });
    return project.id;
  },

  executeStep: async (step, input) => {
    set({
      isLoading: true, error: null, currentStep: step, streamingText: '',
      isScraping: false,
      scrapeStatus: {
        status: '',
        platforms: {
          wechat: { status: 'idle', count: 0, results: [] },
          xiaohongshu: { status: 'idle', count: 0, results: [] },
          douyin: { status: 'idle', count: 0, results: [] },
        },
      },
    });
    try {
      let result: Record<string, unknown>;
      try {
        result = await workflowApi.executeStepStream(
          get().project!.id,
          step,
          input || {},
          (_chunk, fullText) => {
            set({ streamingText: fullText });
          },
          (event) => {
            const data = event as any;
            // Top-level status events
            if (data.scrape_status === 'start') {
              set({ isScraping: true, scrapeStatus: { status: 'start', keywords: data.keywords, platforms: { wechat: { status: 'idle', count: 0, results: [] }, xiaohongshu: { status: 'idle', count: 0, results: [] }, douyin: { status: 'idle', count: 0, results: [] } } } });
            } else if (data.scrape_status === 'complete') {
              set((s) => ({
                isScraping: false,
                scrapeStatus: { ...s.scrapeStatus, status: 'complete', total: data.total },
              }));
            } else if (data.scrape_status === 'cached') {
              set({ isScraping: false, scrapeStatus: { status: 'cached', total: data.total, platforms: { wechat: { status: 'idle', count: 0, results: [] }, xiaohongshu: { status: 'idle', count: 0, results: [] }, douyin: { status: 'idle', count: 0, results: [] } } } });
            }
            // Per-platform progress events
            else if (data.platform && data.status) {
              const p = data.platform as 'wechat' | 'xiaohongshu' | 'douyin';
              set((s) => {
                const platforms = { ...s.scrapeStatus.platforms };
                const current = { ...platforms[p] };
                if (data.status === 'scraping') {
                  current.status = 'scraping';
                } else if (data.status === 'result') {
                  current.results = [...current.results, { title: data.title || '', content: data.content || '' }];
                } else if (data.status === 'done') {
                  current.status = 'done';
                  current.count = data.count;
                }
                platforms[p] = current;
                return { scrapeStatus: { ...s.scrapeStatus, platforms } };
              });
            }
          },
        );
        // Reload from backend to get complete saved data (_kb_references, _scrape_results)
        // Steps 2-6 all may have RAG or scrape data appended server-side
        const needsReload = (step >= 2 && step <= 6);
        if (needsReload) {
          result = await reloadStepFromBackend(step);
        }
      } catch {
        set({ streamingText: '' });
        result = await reloadStepFromBackend(step);
      }
      set((state) => ({
        stepData: { ...state.stepData, [step]: result },
        isLoading: false,
        streamingText: '',
        isScraping: false,
      }));
    } catch (e: any) {
      const msg = e.message === 'AUTH_EXPIRED'
        ? '登录状态已过期，请返回主门户重新进入'
        : e.message;
      set({ error: msg, isLoading: false, streamingText: '', isScraping: false });
    }
  },

  confirmStep: async (step) => {
    try {
      await workflowApi.confirmStep(get().project!.id, step);
      // 确认后自动执行下一步
      if (step < 6) {
        await get().executeStep(step + 1);
      }
    } catch (e: any) {
      set({ error: e.message });
    }
  },

  modifyStep: async (step, section, feedback) => {
    set({ isLoading: true });
    try {
      const result = await workflowApi.modifyStep(get().project!.id, step, section, feedback);
      set((state) => ({
        stepData: { ...state.stepData, [step]: result.data },
        isLoading: false,
      }));
    } catch (e: any) {
      set({ error: e.message, isLoading: false });
    }
  },

  gotoStep: async (targetStep) => {
    try {
      const result = await workflowApi.gotoStep(get().project!.id, targetStep);
      set({ currentStep: targetStep });
      if (result.data) {
        set((state) => ({
          stepData: { ...state.stepData, [targetStep]: result.data! },
        }));
      }
    } catch (e: any) {
      set({ error: e.message });
    }
  },

  sendChat: async (message) => {
    set({ isChatLoading: true });
    const { project, currentStep, chatMessages } = get();

    // Add user message optimistically
    const userMsg: ChatMessage = {
      id: Date.now(),
      project_id: project!.id,
      step: currentStep,
      role: 'user',
      content: message,
      created_at: new Date().toISOString(),
    };
    set({ chatMessages: [...chatMessages, userMsg] });

    try {
      const response = await chatApi.send(project!.id, message, currentStep);
      const assistantMsg: ChatMessage = {
        id: Date.now() + 1,
        project_id: project!.id,
        step: currentStep,
        role: 'assistant',
        content: response.content,
        created_at: new Date().toISOString(),
      };
      set((state) => {
        const updates: Partial<WorkflowStore> = {
          chatMessages: [...state.chatMessages, assistantMsg],
          isChatLoading: false,
        };
        // If AI executed a modification, update stepData
        if (response.updated_data) {
          updates.stepData = { ...state.stepData, [currentStep]: response.updated_data };
        }
        return updates;
      });
    } catch (e: any) {
      set({ isChatLoading: false, error: e.message });
    }
  },

  loadChatHistory: async (step) => {
    try {
      const history = await chatApi.getHistory(get().project!.id, step);
      set({ chatMessages: history });
    } catch {
      // Chat history loading is non-critical
    }
  },

  clearError: () => set({ error: null }),
}));
