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
      audit_evidence: {
        Row: {
          audit_id: string
          description: string | null
          file_name: string
          file_type: string
          file_url: string
          finding_id: string | null
          id: string
          uploaded_at: string | null
          uploaded_by: string
        }
        Insert: {
          audit_id: string
          description?: string | null
          file_name: string
          file_type: string
          file_url: string
          finding_id?: string | null
          id?: string
          uploaded_at?: string | null
          uploaded_by: string
        }
        Update: {
          audit_id?: string
          description?: string | null
          file_name?: string
          file_type?: string
          file_url?: string
          finding_id?: string | null
          id?: string
          uploaded_at?: string | null
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_evidence_audit_id_fkey"
            columns: ["audit_id"]
            isOneToOne: false
            referencedRelation: "audits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_evidence_finding_id_fkey"
            columns: ["finding_id"]
            isOneToOne: false
            referencedRelation: "audit_findings"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_findings: {
        Row: {
          assigned_to: string | null
          audit_id: string
          capa_required: boolean | null
          created_at: string | null
          description: string
          due_date: string | null
          finding_number: string
          id: string
          linked_capa_id: string | null
          severity: Database["public"]["Enums"]["finding_severity"]
          status: Database["public"]["Enums"]["finding_status"]
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          audit_id: string
          capa_required?: boolean | null
          created_at?: string | null
          description: string
          due_date?: string | null
          finding_number: string
          id?: string
          linked_capa_id?: string | null
          severity: Database["public"]["Enums"]["finding_severity"]
          status?: Database["public"]["Enums"]["finding_status"]
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          audit_id?: string
          capa_required?: boolean | null
          created_at?: string | null
          description?: string
          due_date?: string | null
          finding_number?: string
          id?: string
          linked_capa_id?: string | null
          severity?: Database["public"]["Enums"]["finding_severity"]
          status?: Database["public"]["Enums"]["finding_status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_findings_audit_id_fkey"
            columns: ["audit_id"]
            isOneToOne: false
            referencedRelation: "audits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_findings_linked_capa_id_fkey"
            columns: ["linked_capa_id"]
            isOneToOne: false
            referencedRelation: "capas"
            referencedColumns: ["id"]
          },
        ]
      }
      audits: {
        Row: {
          audit_number: string
          audit_type: Database["public"]["Enums"]["audit_type"]
          auditor_names: string[] | null
          created_at: string | null
          created_by: string
          department: string | null
          id: string
          scheduled_end_date: string | null
          scheduled_start_date: string | null
          scope: string
          status: Database["public"]["Enums"]["audit_status"]
          title: string
          updated_at: string | null
        }
        Insert: {
          audit_number: string
          audit_type: Database["public"]["Enums"]["audit_type"]
          auditor_names?: string[] | null
          created_at?: string | null
          created_by: string
          department?: string | null
          id?: string
          scheduled_end_date?: string | null
          scheduled_start_date?: string | null
          scope: string
          status?: Database["public"]["Enums"]["audit_status"]
          title: string
          updated_at?: string | null
        }
        Update: {
          audit_number?: string
          audit_type?: Database["public"]["Enums"]["audit_type"]
          auditor_names?: string[] | null
          created_at?: string | null
          created_by?: string
          department?: string | null
          id?: string
          scheduled_end_date?: string | null
          scheduled_start_date?: string | null
          scope?: string
          status?: Database["public"]["Enums"]["audit_status"]
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      capas: {
        Row: {
          action_plan: string | null
          assigned_to: string | null
          capa_type: Database["public"]["Enums"]["capa_type"]
          closed_date: string | null
          created_at: string | null
          created_by: string
          description: string
          due_date: string | null
          effectiveness_check_required: boolean | null
          effectiveness_verified: boolean | null
          id: string
          number: string
          priority: number
          root_cause: string | null
          status: Database["public"]["Enums"]["capa_status"]
          title: string
          updated_at: string | null
        }
        Insert: {
          action_plan?: string | null
          assigned_to?: string | null
          capa_type: Database["public"]["Enums"]["capa_type"]
          closed_date?: string | null
          created_at?: string | null
          created_by: string
          description: string
          due_date?: string | null
          effectiveness_check_required?: boolean | null
          effectiveness_verified?: boolean | null
          id?: string
          number: string
          priority?: number
          root_cause?: string | null
          status?: Database["public"]["Enums"]["capa_status"]
          title: string
          updated_at?: string | null
        }
        Update: {
          action_plan?: string | null
          assigned_to?: string | null
          capa_type?: Database["public"]["Enums"]["capa_type"]
          closed_date?: string | null
          created_at?: string | null
          created_by?: string
          description?: string
          due_date?: string | null
          effectiveness_check_required?: boolean | null
          effectiveness_verified?: boolean | null
          id?: string
          number?: string
          priority?: number
          root_cause?: string | null
          status?: Database["public"]["Enums"]["capa_status"]
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      document_history: {
        Row: {
          content_url: string | null
          created_at: string | null
          document_id: string
          id: string
          notes: string | null
          status: Database["public"]["Enums"]["document_status"]
          updated_by: string
          version: string
        }
        Insert: {
          content_url?: string | null
          created_at?: string | null
          document_id: string
          id?: string
          notes?: string | null
          status: Database["public"]["Enums"]["document_status"]
          updated_by: string
          version: string
        }
        Update: {
          content_url?: string | null
          created_at?: string | null
          document_id?: string
          id?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["document_status"]
          updated_by?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_history_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          approved_by: string | null
          content_url: string | null
          created_at: string | null
          created_by: string
          description: string | null
          document_type: string
          effective_date: string | null
          expiry_date: string | null
          id: string
          number: string
          review_date: string | null
          status: Database["public"]["Enums"]["document_status"]
          title: string
          updated_at: string | null
          version: string
        }
        Insert: {
          approved_by?: string | null
          content_url?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          document_type: string
          effective_date?: string | null
          expiry_date?: string | null
          id?: string
          number: string
          review_date?: string | null
          status?: Database["public"]["Enums"]["document_status"]
          title: string
          updated_at?: string | null
          version: string
        }
        Update: {
          approved_by?: string | null
          content_url?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          document_type?: string
          effective_date?: string | null
          expiry_date?: string | null
          id?: string
          number?: string
          review_date?: string | null
          status?: Database["public"]["Enums"]["document_status"]
          title?: string
          updated_at?: string | null
          version?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          department: string | null
          first_name: string | null
          id: string
          job_title: string | null
          last_name: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          department?: string | null
          first_name?: string | null
          id: string
          job_title?: string | null
          last_name?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          department?: string | null
          first_name?: string | null
          id?: string
          job_title?: string | null
          last_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          requested_user_id: string
          requested_role: Database["public"]["Enums"]["user_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      audit_status: "Scheduled" | "In Progress" | "Completed" | "Cancelled"
      audit_type: "Internal" | "External" | "Supplier" | "Regulatory"
      capa_status: "Open" | "Investigation" | "In Progress" | "Closed"
      capa_type: "Corrective" | "Preventive" | "Both"
      document_status: "Draft" | "In Review" | "Approved" | "Obsolete"
      finding_severity: "Minor" | "Major" | "Critical"
      finding_status: "Open" | "In Progress" | "Closed"
      user_role: "admin" | "manager" | "supervisor" | "user" | "readonly"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      audit_status: ["Scheduled", "In Progress", "Completed", "Cancelled"],
      audit_type: ["Internal", "External", "Supplier", "Regulatory"],
      capa_status: ["Open", "Investigation", "In Progress", "Closed"],
      capa_type: ["Corrective", "Preventive", "Both"],
      document_status: ["Draft", "In Review", "Approved", "Obsolete"],
      finding_severity: ["Minor", "Major", "Critical"],
      finding_status: ["Open", "In Progress", "Closed"],
      user_role: ["admin", "manager", "supervisor", "user", "readonly"],
    },
  },
} as const
