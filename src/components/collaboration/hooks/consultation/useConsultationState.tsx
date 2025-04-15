
import { useState } from "react";
import { Agent, Diagnosis, Message, AIVerdict } from "../../types/consultationTypes";

export function useConsultationState() {
  const [consultationStarted, setConsultationStarted] = useState(false);
  const [consultationId, setConsultationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [activeTab, setActiveTab] = useState("conversation");
  const [isTurnBasedMode, setIsTurnBasedMode] = useState(false);
  const [currentTurn, setCurrentTurn] = useState<string | null>(null);
  const [aiVerdict, setAiVerdict] = useState<AIVerdict | null>(null);
  const [isRefreshingVerdict, setIsRefreshingVerdict] = useState(false);

  return {
    consultationStarted,
    setConsultationStarted,
    consultationId,
    setConsultationId,
    messages,
    setMessages,
    isLoading,
    setIsLoading,
    diagnoses,
    setDiagnoses,
    activeTab,
    setActiveTab,
    isTurnBasedMode,
    setIsTurnBasedMode,
    currentTurn,
    setCurrentTurn,
    aiVerdict,
    setAiVerdict,
    isRefreshingVerdict,
    setIsRefreshingVerdict
  };
}
