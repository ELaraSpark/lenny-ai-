export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      agent_documentation: {
        Row: {
          agent_id: string
          category: string | null
          content: string
          created_at: string | null
          id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          agent_id: string
          category?: string | null
          content: string
          created_at?: string | null
          id?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          agent_id?: string
          category?: string | null
          content?: string
          created_at?: string | null
          id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      ai_consultation_messages: {
        Row: {
          consultation_id: string | null
          content: string
          created_at: string | null
          id: string
          role: string
        }
        Insert: {
          consultation_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          role: string
        }
        Update: {
          consultation_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_consultation_messages_consultation_id_fkey"
            columns: ["consultation_id"]
            isOneToOne: false
            referencedRelation: "ai_consultations"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_consultations: {
        Row: {
          doctor_id: string | null
          doctor_notes: string | null
          ended_at: string | null
          expert_id: string | null
          feedback: string | null
          id: string
          rating: number | null
          recommendation: string | null
          referred_to_doctor: boolean | null
          severity: string | null
          started_at: string | null
          status: string | null
          summary: string | null
          user_id: string | null
        }
        Insert: {
          doctor_id?: string | null
          doctor_notes?: string | null
          ended_at?: string | null
          expert_id?: string | null
          feedback?: string | null
          id?: string
          rating?: number | null
          recommendation?: string | null
          referred_to_doctor?: boolean | null
          severity?: string | null
          started_at?: string | null
          status?: string | null
          summary?: string | null
          user_id?: string | null
        }
        Update: {
          doctor_id?: string | null
          doctor_notes?: string | null
          ended_at?: string | null
          expert_id?: string | null
          feedback?: string | null
          id?: string
          rating?: number | null
          recommendation?: string | null
          referred_to_doctor?: boolean | null
          severity?: string | null
          started_at?: string | null
          status?: string | null
          summary?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_consultations_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "agent_analytics"
            referencedColumns: ["expert_id"]
          },
          {
            foreignKeyName: "ai_consultations_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "ai_experts"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_expert_capabilities: {
        Row: {
          capability: string
          created_at: string | null
          expert_id: string | null
          id: string
        }
        Insert: {
          capability: string
          created_at?: string | null
          expert_id?: string | null
          id?: string
        }
        Update: {
          capability?: string
          created_at?: string | null
          expert_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_expert_capabilities_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "agent_analytics"
            referencedColumns: ["expert_id"]
          },
          {
            foreignKeyName: "ai_expert_capabilities_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "ai_experts"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_expert_knowledge_base: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      ai_expert_knowledge_documents: {
        Row: {
          content: string
          created_at: string | null
          created_by: string | null
          document_type: string | null
          embedding: string | null
          id: string
          knowledge_base_id: string | null
          source: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by?: string | null
          document_type?: string | null
          embedding?: string | null
          id?: string
          knowledge_base_id?: string | null
          source?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string | null
          document_type?: string | null
          embedding?: string | null
          id?: string
          knowledge_base_id?: string | null
          source?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_expert_knowledge_documents_knowledge_base_id_fkey"
            columns: ["knowledge_base_id"]
            isOneToOne: false
            referencedRelation: "ai_expert_knowledge_base"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_expert_personalities: {
        Row: {
          communication_style: string | null
          created_at: string | null
          description: string | null
          expert_id: string | null
          id: string
          name: string
          tone: string | null
          updated_at: string | null
        }
        Insert: {
          communication_style?: string | null
          created_at?: string | null
          description?: string | null
          expert_id?: string | null
          id?: string
          name: string
          tone?: string | null
          updated_at?: string | null
        }
        Update: {
          communication_style?: string | null
          created_at?: string | null
          description?: string | null
          expert_id?: string | null
          id?: string
          name?: string
          tone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_expert_personalities_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "agent_analytics"
            referencedColumns: ["expert_id"]
          },
          {
            foreignKeyName: "ai_expert_personalities_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "ai_experts"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_expert_referrals: {
        Row: {
          assessment: string
          consultation_id: string | null
          created_at: string | null
          decline_reason: string | null
          doctor_id: string | null
          doctor_notes: string | null
          id: string
          patient_id: string | null
          severity: string
          status: string | null
          symptoms: string
          updated_at: string | null
        }
        Insert: {
          assessment: string
          consultation_id?: string | null
          created_at?: string | null
          decline_reason?: string | null
          doctor_id?: string | null
          doctor_notes?: string | null
          id?: string
          patient_id?: string | null
          severity: string
          status?: string | null
          symptoms: string
          updated_at?: string | null
        }
        Update: {
          assessment?: string
          consultation_id?: string | null
          created_at?: string | null
          decline_reason?: string | null
          doctor_id?: string | null
          doctor_notes?: string | null
          id?: string
          patient_id?: string | null
          severity?: string
          status?: string | null
          symptoms?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_expert_referrals_consultation_id_fkey"
            columns: ["consultation_id"]
            isOneToOne: false
            referencedRelation: "ai_consultations"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_expert_training_data: {
        Row: {
          completion: string
          created_at: string | null
          created_by: string | null
          expert_id: string | null
          id: string
          is_verified: boolean | null
          prompt: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          completion: string
          created_at?: string | null
          created_by?: string | null
          expert_id?: string | null
          id?: string
          is_verified?: boolean | null
          prompt: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          completion?: string
          created_at?: string | null
          created_by?: string | null
          expert_id?: string | null
          id?: string
          is_verified?: boolean | null
          prompt?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_expert_training_data_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "agent_analytics"
            referencedColumns: ["expert_id"]
          },
          {
            foreignKeyName: "ai_expert_training_data_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "ai_experts"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_expert_versions: {
        Row: {
          changes: string | null
          created_at: string | null
          created_by: string | null
          expert_id: string | null
          id: string
          is_active: boolean | null
          version: string
        }
        Insert: {
          changes?: string | null
          created_at?: string | null
          created_by?: string | null
          expert_id?: string | null
          id?: string
          is_active?: boolean | null
          version: string
        }
        Update: {
          changes?: string | null
          created_at?: string | null
          created_by?: string | null
          expert_id?: string | null
          id?: string
          is_active?: boolean | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_expert_versions_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "agent_analytics"
            referencedColumns: ["expert_id"]
          },
          {
            foreignKeyName: "ai_expert_versions_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "ai_experts"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_experts: {
        Row: {
          agent_type: string | null
          api_key: string | null
          color: string | null
          configuration: Json | null
          created_at: string | null
          created_by: string | null
          description: string | null
          fine_tuning_progress: number | null
          fine_tuning_status: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          knowledge_base_id: string | null
          llm_model: string | null
          llm_provider: string | null
          max_tokens: number | null
          name: string
          specialty: string
          system_prompt: string | null
          temperature: number | null
          training_data_path: string | null
          updated_at: string | null
        }
        Insert: {
          agent_type?: string | null
          api_key?: string | null
          color?: string | null
          configuration?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          fine_tuning_progress?: number | null
          fine_tuning_status?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          knowledge_base_id?: string | null
          llm_model?: string | null
          llm_provider?: string | null
          max_tokens?: number | null
          name: string
          specialty: string
          system_prompt?: string | null
          temperature?: number | null
          training_data_path?: string | null
          updated_at?: string | null
        }
        Update: {
          agent_type?: string | null
          api_key?: string | null
          color?: string | null
          configuration?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          fine_tuning_progress?: number | null
          fine_tuning_status?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          knowledge_base_id?: string | null
          llm_model?: string | null
          llm_provider?: string | null
          max_tokens?: number | null
          name?: string
          specialty?: string
          system_prompt?: string | null
          temperature?: number | null
          training_data_path?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string
          credits: string | null
          email: string | null
          full_name: string | null
          id: string
          image: string | null
          name: string | null
          subscription: string | null
          token_identifier: string
          updated_at: string | null
          user_id: string | null
          user_role: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          credits?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          image?: string | null
          name?: string | null
          subscription?: string | null
          token_identifier: string
          updated_at?: string | null
          user_id?: string | null
          user_role?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          credits?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          image?: string | null
          name?: string | null
          subscription?: string | null
          token_identifier?: string
          updated_at?: string | null
          user_id?: string | null
          user_role?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      agent_analytics: {
        Row: {
          average_rating: number | null
          completed_consultations: number | null
          consultation_count: number | null
          expert_id: string | null
          expert_name: string | null
          in_progress_consultations: number | null
          specialty: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
