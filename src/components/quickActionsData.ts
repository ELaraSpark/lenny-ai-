import React from 'react';

// Interfaces for quick actions
export interface QuickOption {
  id: string;
  label: string;
  prompt: string;
}

export interface QuickAction {
  id: string;
  icon: string;
  label: string;
  options: QuickOption[];
  baseClassName: string; // For styling consistency with original buttons
}

// Quick action data
export const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'research',
    icon: `<svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>`,
    label: 'Latest Research?',
    options: [
      {
        id: 'research-breakthroughs',
        label: 'Medical Breakthroughs',
        prompt: "What's the latest research on recent medical breakthroughs?"
      },
      {
        id: 'research-covid',
        label: 'COVID-19 Research',
        prompt: "What's the latest research on COVID-19 treatments and vaccines?"
      },
      {
        id: 'research-oncology',
        label: 'Oncology Advances',
        prompt: "What are the recent advances in cancer treatment research?"
      }
    ],
    baseClassName: "bg-white border border-neutral-200 border-l-[3px] border-l-secondary rounded-md text-base font-medium text-neutral-700 shadow-sm hover:border-blue-500 hover:shadow-md transition-all transform -rotate-1 hover:scale-105 hover:rotate-0"
  },
  {
    id: 'interpret',
    icon: `<svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>`,
    label: 'Interpret Labs?',
    options: [
      {
        id: 'interpret-general',
        label: 'General Lab Results',
        prompt: "Help me interpret these lab results"
      },
      {
        id: 'interpret-cbc',
        label: 'CBC Analysis',
        prompt: "Can you help me interpret this complete blood count (CBC) lab result?"
      },
      {
        id: 'interpret-lipid',
        label: 'Lipid Panel',
        prompt: "What do these lipid panel results mean for my patient?"
      }
    ],
    baseClassName: "bg-blue-50 border border-transparent rounded-md text-base font-medium text-neutral-700 shadow-sm hover:border-blue-500 hover:shadow-md transition-all transform rotate-1 hover:scale-105 hover:rotate-0"
  },
  {
    id: 'note',
    icon: `<svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>`,
    label: 'Draft a note',
    options: [
      {
        id: 'note-hypertension',
        label: 'Hypertension Note',
        prompt: "Draft a clinical note about patient with hypertension"
      },
      {
        id: 'note-diabetes',
        label: 'Diabetes Note',
        prompt: "Create a clinical note for a type 2 diabetes follow-up visit"
      },
      {
        id: 'note-followup',
        label: 'General Follow-up',
        prompt: "Write a follow-up clinical note template for a routine visit"
      }
    ],
    baseClassName: "bg-white border border-neutral-200 border-l-[3px] border-l-tertiary rounded-md text-base font-medium text-neutral-700 shadow-sm hover:border-blue-500 hover:shadow-md transition-all transform -rotate-[0.5deg] translate-y-0.5 hover:scale-105 hover:rotate-0"
  }
];