export interface Project {
  id: string;
  user_id: number;
  name: string;
  description: string;
  current_step: number;
  current_sub_step: number;
  status: 'in_progress' | 'completed' | 'archived';
  created_at: string;
  updated_at: string;
  completed_at: string | null;
  steps?: StepData[];
}

export interface StepData {
  id: number;
  project_id: string;
  step: number;
  sub_step: number;
  data: Record<string, unknown>;
  is_confirmed: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: number;
  project_id: string;
  step: number;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
}

export const STEP_NAMES = [
  '聆听',
  '代入',
  '分析',
  '转化',
  '测试',
  '生成',
] as const;

export const STEP_NAMES_EN = [
  'Listen',
  'Empathize',
  'Analyze',
  'Transform',
  'Test',
  'Generate',
] as const;

export const STEP_ICONS = [
  'Headphones',
  'Heart',
  'BarChart3',
  'ArrowRightLeft',
  'FlaskConical',
  'FileOutput',
] as const;

export type StepNumber = 1 | 2 | 3 | 4 | 5 | 6;

export interface WorkflowState {
  project: Project | null;
  currentStep: number;
  stepData: Record<number, Record<string, unknown>>;
  chatMessages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
}
