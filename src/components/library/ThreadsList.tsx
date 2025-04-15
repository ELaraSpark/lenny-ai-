import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ThreadCard } from './ThreadCard'; // Use the created ThreadCard
import { EmptyState } from './EmptyState'; // Use the created EmptyState

// Example thread data (replace with actual data fetching)
const exampleThreads = [
  {
    id: '1',
    title: 'how do I get the API key',
    preview: 'To get an API key, the process varies depending on the service provider. Here are some general steps for popular platforms: 1. Log in to your OpenAI account at [openai.com](https://openai.com). 2. Click on your...',
    date: new Date('2025-03-21'),
    messageCount: 12,
  },
  {
    id: '2',
    title: 'Implementing authentication in React',
    preview: 'For implementing authentication in React, you have several approaches. You can use libraries like Auth0, Firebase Authentication, or implement your own solution with JWT tokens...',
    date: new Date('2025-03-18'),
    messageCount: 8,
  },
  {
    id: '3',
    title: 'Best practices for API design',
    preview: 'When designing APIs, consider these best practices: 1. Use RESTful principles 2. Implement proper error handling 3. Version your APIs 4. Use HTTPS 5. Implement rate limiting...',
    date: new Date('2025-03-15'),
    messageCount: 5,
  },
];

export const ThreadsList = () => {
  const navigate = useNavigate();
  const threads = exampleThreads; // Replace with state/props/fetched data

  const handleThreadClick = (threadId: string) => {
    navigate(`/threads/${threadId}`); // Adjust route as needed
  };

  const handleEditThread = (threadId: string) => {
    console.log(`Edit thread ${threadId}`);
    // Implement edit functionality (e.g., open modal, navigate to edit page)
  };

  const handleDeleteThread = (threadId: string) => {
    console.log(`Delete thread ${threadId}`);
    // Implement delete functionality (e.g., show confirmation, call API)
  };

  const handleShareThread = (threadId: string) => {
    console.log(`Share thread ${threadId}`);
    // Implement share functionality (e.g., copy link, open share dialog)
  };

  if (threads.length === 0) {
    return (
      <EmptyState
        title="No threads yet"
        description="Create a new thread to start a conversation or save information."
        actionLabel="New Thread"
        onAction={() => navigate('/chat/new')} // Adjust action as needed
      />
    );
  }

  return (
    <div className="divide-y divide-perplexity-border">
      {threads.map((thread) => (
        <ThreadCard
          key={thread.id}
          id={thread.id}
          title={thread.title}
          preview={thread.preview}
          date={thread.date}
          messageCount={thread.messageCount}
          onClick={() => handleThreadClick(thread.id)}
          onEdit={() => handleEditThread(thread.id)}
          onDelete={() => handleDeleteThread(thread.id)}
          onShare={() => handleShareThread(thread.id)}
        />
      ))}
    </div>
  );
};
