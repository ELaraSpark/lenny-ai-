
# AI Medical Collaboration Platform

A comprehensive platform enabling healthcare professionals to collaborate with AI medical specialists for patient diagnosis and treatment recommendations.

![AI Medical Platform](https://lovable.dev/projects/aa578b3b-4cba-47c3-ac6c-85204b5045c1)

## Overview

The AI Medical Collaboration Platform assists healthcare professionals by providing AI-powered diagnostics and recommendations from multiple specialized AI agents. Doctors can describe patient symptoms, consult with AI specialists, and receive detailed diagnoses and treatment plans. The platform enables multi-agent collaboration where AI specialists from different fields can work together on complex cases.

## Key Features

### Multi-Agent Collaboration
- Select multiple specialists for complex cases
- Each specialist provides their perspective based on their expertise
- Aggregated view of all diagnoses with confidence levels

### Specialty-Specific AI Agents
- Cardiology (CardioAssist)
- Neurology (NeuroLogic)
- Pathology (PathInsight)
- General Medicine (GeneralMD)
- Ophthalmology (OptiVision)
- Radiology (RadAnalytics)
- Pharmacology (PharmExpert)

### Interactive Chat Interface
- Real-time communication with AI specialists
- Dropdown selectors for patient information and symptoms
- Add-to-chat functionality for template-based queries

### Follow-up Management
- Schedule follow-up appointments
- Auto-generated follow-up questions based on conditions
- Integration with patient records

### Analytics Dashboard
- Patient statistics
- Consultation metrics
- Treatment distribution
- Condition tracking

## Architecture

### Technology Stack
- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn/UI
- **Backend**: Supabase for data storage, authentication, and Edge Functions
- **AI Integration**: Google's Gemini AI via Supabase Edge Functions

### Key Components
1. **Agent System**: AI medical specialists with different specialties
2. **Collaboration System**: Multi-agent diagnostic collaboration
3. **Chat Interface**: Direct communication with individual AI specialists
4. **Patient Records**: Management of patient information
5. **Analytics**: Usage and diagnostic statistics

## User Flow

### Authentication Flow
1. User registers or logs in through the Login/Register pages
2. Authentication is handled via Supabase
3. Protected routes redirect unauthenticated users to the login page

### Main Application Flows

#### Individual Agent Consultation
1. Navigate to the Agents page
2. Select an AI specialist (e.g., CardioAssist for cardiology)
3. Enter patient symptoms or use the dropdown selectors
4. View the AI-generated diagnosis and recommendations
5. Continue the conversation with follow-up questions

#### Collaborative Consultation
1. Navigate to the Collaboration page
2. Select multiple AI specialists to consult with
3. Enter patient symptoms and start the consultation
4. Each AI specialist analyzes the case and provides their perspective
5. View all diagnoses in the conversation tab
6. Switch to the verdict tab to see a summary of all diagnoses
7. Ask follow-up questions to further clarify the diagnosis

#### Follow-up Scheduling
1. Navigate to the Follow-up Scheduler
2. Select a patient and an AI specialist
3. Specify the condition and follow-up date
4. The system automatically generates relevant follow-up questions
5. Schedule the follow-up appointment

## Data Flow

### Consultation Data Flow
1. User inputs symptoms and selects specialists
2. A new consultation is created in the database
3. User messages are processed and sent to AI specialists
4. The Edge Function processes the symptoms using Gemini AI
5. Responses are parsed for diagnosis, confidence, and recommendations
6. Results are displayed in the UI with confidence levels

### Edge Functions
The application uses Supabase Edge Functions for AI integration:

1. **generate-medical-response**: Handles AI-generated medical responses
2. **generate-followup-questions**: Creates relevant follow-up questions
3. **generate-consultation-verdict**: Synthesizes multiple specialist opinions

## Technical Components

### Frontend Components
- Agent System (AgentSelector, AgentProfile, ChatInterface)
- Collaboration System (CollaborativeConsultation, ConsultationSetup)
- UI Components (ChatInput, ChatMessage, DropdownSelectors)

### Backend Services
- Authentication Services via Supabase
- Data Services for consultations and agent interactions
- Edge Functions for AI integration

## Setup and Development

### Prerequisites
- Node.js & npm
- Supabase account

### Local Development

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Project Structure

```
src/
├── components/
│   ├── agents/           # Individual agent consultation
│   ├── analytics/        # Analytics dashboard
│   ├── collaboration/    # Multi-agent collaboration
│   ├── followup/         # Follow-up scheduling
│   ├── layout/           # Layout components
│   ├── patients/         # Patient management
│   ├── settings/         # User settings
│   └── ui/               # UI components (shadcn/ui)
├── contexts/             # Context providers
├── hooks/                # Custom hooks
├── integrations/
│   └── supabase/         # Supabase client
├── lib/                  # Utility functions
├── pages/                # Page components
└── App.tsx               # Main application component
```

## Deployment

Deploy the application using your preferred hosting provider like Netlify, Vercel, or directly from GitHub.

For detailed deployment instructions, visit: [https://docs.lovable.dev/tips-tricks/custom-domain/](https://docs.lovable.dev/tips-tricks/custom-domain/)

## Getting Started

1. Create an account or log in
2. Navigate to the Agents page to consult with individual specialists
3. Use the Collaboration page for complex cases requiring multiple specialists
4. Schedule follow-ups as needed
5. Review analytics for insights into your practice
