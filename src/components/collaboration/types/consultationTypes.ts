
import { ReactNode } from "react";
import { AgentDocument } from "../../agents/services/documentationService";

export interface Agent {
  id: string;
  name: string;
  specialty: string;
  description: string;
  icon: React.FC<{ className?: string }>;
  color: string;
  availability?: boolean;
  rating?: number;
  documentation?: AgentDocument[];
}

export interface Diagnosis {
  agentId: string;
  agentName: string;
  specialty: string;
  diagnosis: string;
  confidence: number;
  recommendation: string;
  timestamp?: Date;
  patientId?: string;
  consultationId?: string;
  severity?: 'low' | 'medium' | 'high';
  referencedDocuments?: string[]; // IDs of referenced documents
}

export interface Message {
  id: string;
  sender: string;
  senderId: string;
  content: string;
  timestamp: Date;
  isDoctor?: boolean;
  isUser?: boolean;
  attachments?: Attachment[];
  status?: 'sending' | 'sent' | 'delivered' | 'read' | 'error';
  metadata?: Record<string, any>;
  referencedDocuments?: AgentDocument[]; // Referenced documents in the message
}

export interface Attachment {
  id: string;
  type: 'image' | 'document' | 'audio';
  url: string;
  name: string;
  size?: number;
  thumbnailUrl?: string;
}

export interface Consultation {
  id: string;
  patientId?: string;
  symptoms: string;
  agents: Agent[];
  messages: Message[];
  diagnoses: Diagnosis[];
  startTime: Date;
  endTime?: Date;
  status: 'in_progress' | 'completed' | 'cancelled';
  metadata?: Record<string, any>;
  references?: AgentDocument[];
}

export interface AIVerdict {
  fullText: string;
  consensusDiagnosis: string;
  agreementAnalysis: string;
  recommendations: string;
  nextSteps: string;
  timestamp: string;
}
