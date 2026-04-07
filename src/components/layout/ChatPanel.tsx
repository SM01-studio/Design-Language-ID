'use client';

import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { useWorkflowStore } from '@/store/workflowStore';

export default function ChatPanel() {
  const { chatMessages, isChatLoading, sendChat, currentStep } = useWorkflowStore();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSend = () => {
    const msg = input.trim();
    if (!msg || isChatLoading) return;
    setInput('');
    sendChat(msg);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[var(--bg-primary)]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
        <div>
          <h3 className="text-sm font-semibold">AI 助手</h3>
          <p className="text-[10px] text-[var(--text-muted)]">
            步骤 {currentStep} — 审查与修改
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {chatMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-12 h-12 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center mb-3">
              <span className="text-lg">💬</span>
            </div>
            <p className="text-sm text-[var(--text-secondary)]">有任何问题？</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">请告诉我需要修改的内容</p>
          </div>
        )}

        {chatMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
          >
            <div
              className={`max-w-[85%] px-3 py-2 text-sm leading-relaxed ${
                msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-assistant'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isChatLoading && (
          <div className="flex justify-start animate-slide-up">
            <div className="chat-bubble-assistant px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-[var(--text-muted)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-[var(--text-muted)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-[var(--text-muted)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-[var(--border)]">
        <div className="flex items-end gap-2 bg-[var(--bg-card)] rounded-xl px-3 py-2 border border-[var(--border)]">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入修改意见..."
            rows={1}
            className="flex-1 bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] resize-none outline-none max-h-32"
            style={{ minHeight: '24px' }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isChatLoading}
            className="p-2 rounded-lg bg-[var(--accent-green)] text-white hover:bg-[var(--accent-green-hover)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer shrink-0"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
