# AI Agents Components

This directory (`src/components/agents/`) contains all the components, hooks, services, and data related to the AI agents feature within the Leny AI application.

The goal of this feature is to provide users with interactive AI medical assistants specialized in various fields, enabling them to get diagnostic insights, treatment recommendations, and other medical information.

## Folder Structure

-   `card-variants/`: Contains different visual representations (cards) for displaying AI agents.
-   `consultation/`: Components and logic specifically for the agent consultation flow.
-   `data/`: Mock data used for agents and related information.
-   `documentation/`: Components for displaying and editing agent-specific documentation.
-   `hooks/`: Custom React hooks for managing state and logic related to agents and chat.
-   `selectors/`: Components for selecting patients, symptoms, and questions within the consultation context.
-   `services/`: API interaction logic and data fetching for agents and documentation.
-   `types/`: TypeScript type definitions for agent-related data structures.
-   `utils/`: Utility functions and predefined data used across agent components.

## Core Components

-   [`AIAgentsView.tsx`](src/components/agents/AIAgentsView.tsx): The main view component for exploring and interacting with AI agents.
-   [`AgentCard.tsx`](src/components/agents/AgentCard.tsx): A reusable component to display a summary of an AI agent.
-   [`ChatInterface.tsx`](src/components/agents/ChatInterface.tsx): The primary component for the chat interaction with a selected agent.
-   [`AgentProfile.tsx`](src/components/agents/AgentProfile.tsx): Displays detailed information about a selected agent.

## Key Hooks

-   [`useChatMessages.tsx`](src/components/agents/hooks/useChatMessages.tsx): Manages the state and logic for the chat messages within the [`ChatInterface.tsx`](src/components/agents/ChatInterface.tsx).
-   [`useChatSelectors.tsx`](src/components/agents/hooks/useChatSelectors.tsx): Manages the state for the patient, symptom, and question selectors.
-   [`useSelectionToChat.tsx`](src/components/agents/hooks/useSelectionToChat.tsx): Handles formatting and adding selected consultation information to the chat input.

## Services

-   [`agentService.ts`](src/components/agents/services/agentService.ts): Contains logic for generating AI responses (currently mocked).
-   [`agentCommunicationService.ts`](src/components/agents/services/agentCommunicationService.ts): Handles communication with the backend for generating medical responses and managing chat history.
-   [`documentationService.ts`](src/components/agents/services/documentationService.ts): Manages fetching and saving agent documentation.

## Data and Types

-   [`agentsData.ts`](src/components/agents/data/agentsData.ts): Provides the mock data for the available AI agents.
-   [`agentTypes.ts`](src/components/agents/types/agentTypes.ts): Defines the TypeScript interfaces for `Agent` and `Message` objects.
-   [`predefinedData.ts`](src/components/agents/utils/predefinedData.ts): Contains predefined lists for symptoms, questions, and mock patients.