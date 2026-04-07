'use client';

import { useEffect, useState, useCallback, useRef, Suspense } from 'react';
import { useParams } from 'next/navigation';
import { useWorkflowStore } from '@/store/workflowStore';
import AuthGuard from '@/components/auth/AuthGuard';
import Sidebar from '@/components/layout/Sidebar';
import WorkflowPanel from '@/components/layout/WorkflowPanel';
import ChatPanel from '@/components/layout/ChatPanel';
import OnboardingOverlay from '@/components/onboarding/OnboardingOverlay';
import NewProjectView from '@/components/onboarding/NewProjectView';
import { Menu } from 'lucide-react';

const DEFAULT_CHAT_WIDTH = 420;
const MIN_CHAT_WIDTH = 280;
const MAX_CHAT_WIDTH = 800;

function WorkspaceContent() {
  const params = useParams();
  const projectId = params.projectId as string;
  const { project, loadProject, loadChatHistory, currentStep } = useWorkflowStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatWidth, setChatWidth] = useState(DEFAULT_CHAT_WIDTH);
  const isResizing = useRef(false);

  const isNewProject = projectId === 'new';

  useEffect(() => {
    if (isNewProject) {
      useWorkflowStore.setState({ project: null, currentStep: 0, stepData: {}, chatMessages: [] });
    } else if (projectId) {
      loadProject(projectId);
    }
  }, [projectId, loadProject, isNewProject]);

  useEffect(() => {
    if (currentStep > 0) {
      loadChatHistory(currentStep);
    }
  }, [currentStep, loadChatHistory]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current) return;
      const newWidth = window.innerWidth - e.clientX;
      const clamped = Math.min(MAX_CHAT_WIDTH, Math.max(MIN_CHAT_WIDTH, newWidth));
      setChatWidth(clamped);
    };

    const handleMouseUp = () => {
      if (isResizing.current) {
        isResizing.current = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <AuthGuard>
      <div className="flex h-screen bg-[var(--bg-primary)] overflow-hidden">
        {/* Mobile header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-3 bg-[var(--bg-card)] border-b border-[var(--border)] shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-[var(--bg-hover)] cursor-pointer"
          >
            <Menu size={20} />
          </button>
          <span className="font-heading font-semibold text-sm">Design Language Translation - ID Showflat</span>
          <div className="w-8" />
        </div>

        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

        {/* Main content + Chat */}
        <div className="flex-1 flex flex-col lg:ml-[280px] pt-14 lg:pt-0">
          {isNewProject ? (
            <NewProjectView />
          ) : (
            <div className="flex-1 flex overflow-hidden">
              {/* Workflow panel */}
              <div className="flex-1 overflow-hidden">
                <WorkflowPanel />
              </div>

              {/* Resize handle */}
              <div
                className="relative hidden lg:block"
                onMouseDown={handleMouseDown}
                style={{ width: '12px', zIndex: 20, cursor: 'col-resize' }}
              >
                <div className={`resize-handle absolute inset-0 ${isResizing.current ? 'active' : ''}`} />
              </div>

              {/* Chat panel */}
              <div
                className="hidden lg:flex shrink-0 border-l border-[var(--border)]"
                style={{ width: chatWidth }}
              >
                <ChatPanel />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Onboarding overlay - only for new project */}
      {isNewProject && (
        <Suspense fallback={null}>
          <OnboardingOverlay />
        </Suspense>
      )}
    </AuthGuard>
  );
}

export default function WorkspacePage() {
  return <WorkspaceContent />;
}
