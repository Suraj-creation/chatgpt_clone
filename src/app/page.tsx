'use client';

import React, { useEffect, useState } from 'react';
import { useChatContext } from '@/contexts/ChatContext';
import { Sidebar } from '@/components/Sidebar';
import { ChatHeader } from '@/components/ChatHeader';
import { MessageList } from '@/components/MessageList';
import { ChatInput } from '@/components/ChatInput';
import { SystemPromptEditor } from '@/components/SystemPromptEditor';
import { createNewMessage } from '@/lib/utils';
import { Message } from '@/lib/types';

export default function Home() {
  const {
    conversations,
    activeConversationId,
    currentModel,
    systemPrompt,
    isStreaming,
    isSidebarOpen,
    createConversation,
    deleteConversation,
    loadConversation,
    addMessage,
    updateLastMessage,
    setSystemPrompt,
    setIsStreaming,
    toggleSidebar,
    clearAllConversations,
    getActiveConversation,
  } = useChatContext();

  const [abortController, setAbortController] = useState<AbortController | null>(null);

  // Create initial conversation if none exists
  useEffect(() => {
    if (conversations.length === 0) {
      createConversation();
    }
  }, []);

  const handleSendMessage = async (content: string) => {
    const activeConv = getActiveConversation();
    
    // Create conversation if none exists
    if (!activeConv) {
      createConversation();
      // Wait for next render to add message
      setTimeout(() => handleSendMessage(content), 100);
      return;
    }

    // Add user message
    const userMessage = createNewMessage('user', content);
    addMessage(userMessage);

    // Prepare messages for API
    const messages: Message[] = [...activeConv.messages, userMessage];

    // Create assistant message placeholder
    const assistantMessage = createNewMessage('assistant', '');
    addMessage(assistantMessage);

    // Start streaming
    setIsStreaming(true);
    const controller = new AbortController();
    setAbortController(controller);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages,
          model: currentModel,
          systemPrompt,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n').filter(line => line.trim());

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const jsonStr = line.slice(6);
              try {
                const data = JSON.parse(jsonStr);
                if (data.text) {
                  fullResponse += data.text;
                  updateLastMessage(fullResponse);
                }
              } catch (e) {
                console.error('Failed to parse streaming data:', e);
              }
            }
          }
        }
      }

      // If no response received, show error
      if (!fullResponse) {
        updateLastMessage('❌ No response received from the model. Please try again.');
      }

    } catch (error: any) {
      console.error('Chat error:', error);
      
      if (error.name === 'AbortError') {
        updateLastMessage('⏹️ Response stopped by user.');
      } else {
        updateLastMessage(`❌ Error: ${error.message || 'Failed to get response. Please try again.'}`);
      }
    } finally {
      setIsStreaming(false);
      setAbortController(null);
    }
  };

  const handleStopStreaming = () => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
    }
  };

  return (
    <main className="flex h-screen overflow-hidden bg-bg-primary">
      {/* Sidebar */}
      <Sidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onNewChat={createConversation}
        onSelectConversation={loadConversation}
        onDeleteConversation={deleteConversation}
        onClearAll={clearAllConversations}
        isOpen={isSidebarOpen}
        onToggle={toggleSidebar}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* System Prompt Editor */}
        <SystemPromptEditor
          systemPrompt={systemPrompt}
          onSystemPromptChange={setSystemPrompt}
        />

        {/* Chat Header */}
        <ChatHeader />

        {/* Messages */}
        <MessageList />

        {/* Input Area */}
        <ChatInput
          onSendMessage={handleSendMessage}
          onStopStreaming={handleStopStreaming}
          isStreaming={isStreaming}
        />
      </div>
    </main>
  );
}
