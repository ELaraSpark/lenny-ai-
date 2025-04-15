import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageCard } from './PageCard'; // Use the created PageCard
import { EmptyState } from './EmptyState'; // Use the created EmptyState

// Example pages data (replace with actual data fetching)
const examplePages = [
  {
    id: '1',
    title: 'Project Requirements',
    preview: 'This document outlines the requirements for the new patient management system. Key features include...',
    date: new Date('2025-03-20'),
    lastEditor: 'Dr. Smith',
  },
  {
    id: '2',
    title: 'Meeting Notes: March 15',
    preview: 'Attendees: Dr. Smith, Dr. Johnson, Tech Team. Discussion points: 1. Implementation timeline 2. Integration with existing systems...',
    date: new Date('2025-03-15'),
    lastEditor: 'Dr. Johnson',
  },
  {
    id: '3',
    title: 'Research Summary',
    preview: 'Summary of recent research papers on AI applications in diagnostic imaging. Key findings include improved accuracy rates...',
    date: new Date('2025-03-10'),
    lastEditor: 'Dr. Chen',
  },
];

export const PagesList = () => {
  const navigate = useNavigate();
  const pages = examplePages; // Replace with state/props/fetched data

  const handlePageClick = (pageId: string) => {
    navigate(`/pages/${pageId}`); // Adjust route as needed
  };

  const handleEditPage = (pageId: string) => {
    console.log(`Edit page ${pageId}`);
    // Implement edit functionality
  };

  const handleDeletePage = (pageId: string) => {
    console.log(`Delete page ${pageId}`);
    // Implement delete functionality
  };

  const handleSharePage = (pageId: string) => {
    console.log(`Share page ${pageId}`);
    // Implement share functionality
  };

  if (pages.length === 0) {
    return (
      <EmptyState
        title="No pages yet"
        description="Create a new page to save documents, notes, or reports."
        actionLabel="New Page"
        onAction={() => console.log('Create new page')} // Adjust action as needed
      />
    );
  }

  return (
    <div className="divide-y divide-perplexity-border">
      {pages.map((page) => (
        <PageCard
          key={page.id}
          id={page.id}
          title={page.title}
          preview={page.preview}
          date={page.date}
          lastEditor={page.lastEditor}
          onClick={() => handlePageClick(page.id)}
          onEdit={() => handleEditPage(page.id)}
          onDelete={() => handleDeletePage(page.id)}
          onShare={() => handleSharePage(page.id)}
        />
      ))}
    </div>
  );
};
