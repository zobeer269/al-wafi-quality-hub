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
      changes: {
        Row: {
          approval_notes: string | null
          approved_by: string | null
          change_reason: string | null
          change_title: string
          created_at: string | null
          id: string
          implementation_date: string | null
          implementation_plan: string | null
          linked_area: string | null
          requested_by: string | null
          risk_id: string | null
          status: Database["public"]["Enums"]["change_status"]
          updated_at: string | null
        }
        Insert: {
          approval_notes?: string | null
          approved_by?: string | null
          change_reason?: string | null
          change_title: string
          created_at?: string | null
          id?: string
          implementation_date?: string | null
          implementation_plan?: string | null
          linked_area?: string | null
          requested_by?: string | null
          risk_id?: string | null
          status?: Database["public"]["Enums"]["change_status"]
          updated_at?: string | null
        }
        Update: {
          approval_notes?: string | null
          approved_by?: string | null
          change_reason?: string | null
          change_title?: string
          created_at?: string | null
          id?: string
          implementation_date?: string | null
          implementation_plan?: string | null
          linked_area?: string | null
          requested_by?: string | null
          risk_id?: string | null
          status?: Database["public"]["Enums"]["change_status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "changes_risk_id_fkey"
            columns: ["risk_id"]
            isOneToOne: false
            referencedRelation: "risks"
            referencedColumns: ["id"]
          },
        ]
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
      nc_attachments: {
        Row: {
          description: string | null
          file_name: string
          file_type: string
          file_url: string
          id: string
          nc_id: string
          uploaded_at: string | null
          uploaded_by: string
        }
        Insert: {
          description?: string | null
          file_name: string
          file_type: string
          file_url: string
          id?: string
          nc_id: string
          uploaded_at?: string | null
          uploaded_by: string
        }
        Update: {
          description?: string | null
          file_name?: string
          file_type?: string
          file_url?: string
          id?: string
          nc_id?: string
          uploaded_at?: string | null
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "nc_attachments_nc_id_fkey"
            columns: ["nc_id"]
            isOneToOne: false
            referencedRelation: "non_conformances"
            referencedColumns: ["id"]
          },
        ]
      }
      non_conformances: {
        Row: {
          assigned_to: string | null
          capa_required: boolean | null
          category: string
          closed_by: string | null
          closed_date: string | null
          containment_action: string | null
          correction: string | null
          created_at: string | null
          description: string
          due_date: string | null
          id: string
          linked_audit_finding_id: string | null
          linked_capa_id: string | null
          lot_number: string | null
          nc_number: string
          product_affected: string | null
          reported_by: string
          reported_date: string
          root_cause: string | null
          severity: Database["public"]["Enums"]["nc_severity"]
          source: string | null
          status: Database["public"]["Enums"]["nc_status"]
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          capa_required?: boolean | null
          category: string
          closed_by?: string | null
          closed_date?: string | null
          containment_action?: string | null
          correction?: string | null
          created_at?: string | null
          description: string
          due_date?: string | null
          id?: string
          linked_audit_finding_id?: string | null
          linked_capa_id?: string | null
          lot_number?: string | null
          nc_number: string
          product_affected?: string | null
          reported_by: string
          reported_date?: string
          root_cause?: string | null
          severity: Database["public"]["Enums"]["nc_severity"]
          source?: string | null
          status?: Database["public"]["Enums"]["nc_status"]
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          capa_required?: boolean | null
          category?: string
          closed_by?: string | null
          closed_date?: string | null
          containment_action?: string | null
          correction?: string | null
          created_at?: string | null
          description?: string
          due_date?: string | null
          id?: string
          linked_audit_finding_id?: string | null
          linked_capa_id?: string | null
          lot_number?: string | null
          nc_number?: string
          product_affected?: string | null
          reported_by?: string
          reported_date?: string
          root_cause?: string | null
          severity?: Database["public"]["Enums"]["nc_severity"]
          source?: string | null
          status?: Database["public"]["Enums"]["nc_status"]
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "non_conformances_linked_audit_finding_id_fkey"
            columns: ["linked_audit_finding_id"]
            isOneToOne: false
            referencedRelation: "audit_findings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "non_conformances_linked_capa_id_fkey"
            columns: ["linked_capa_id"]
            isOneToOne: false
            referencedRelation: "capas"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          notification_type: string
          read_at: string | null
          related_id: string
          related_to: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          notification_type: string
          read_at?: string | null
          related_id: string
          related_to: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          notification_type?: string
          read_at?: string | null
          related_id?: string
          related_to?: string
          title?: string
          user_id?: string
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
      risks: {
        Row: {
          area: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          impact: number | null
          likelihood: number | null
          mitigation_plan: string | null
          responsible: string | null
          risk_score: number | null
          status: Database["public"]["Enums"]["risk_status"]
          title: string
          updated_at: string | null
        }
        Insert: {
          area?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          impact?: number | null
          likelihood?: number | null
          mitigation_plan?: string | null
          responsible?: string | null
          risk_score?: number | null
          status?: Database["public"]["Enums"]["risk_status"]
          title: string
          updated_at?: string | null
        }
        Update: {
          area?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          impact?: number | null
          likelihood?: number | null
          mitigation_plan?: string | null
          responsible?: string | null
          risk_score?: number | null
          status?: Database["public"]["Enums"]["risk_status"]
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      supplier_audits: {
        Row: {
          audit_id: string | null
          created_at: string | null
          id: string
          linked_findings: string | null
          result: string | null
          supplier_id: string | null
        }
        Insert: {
          audit_id?: string | null
          created_at?: string | null
          id?: string
          linked_findings?: string | null
          result?: string | null
          supplier_id?: string | null
        }
        Update: {
          audit_id?: string | null
          created_at?: string | null
          id?: string
          linked_findings?: string | null
          result?: string | null
          supplier_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "supplier_audits_audit_id_fkey"
            columns: ["audit_id"]
            isOneToOne: false
            referencedRelation: "audits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_audits_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_qualifications: {
        Row: {
          certificate_url: string | null
          id: string
          next_review_date: string | null
          notes: string | null
          qualification_date: string | null
          qualified_by: string | null
          supplier_id: string
        }
        Insert: {
          certificate_url?: string | null
          id?: string
          next_review_date?: string | null
          notes?: string | null
          qualification_date?: string | null
          qualified_by?: string | null
          supplier_id: string
        }
        Update: {
          certificate_url?: string | null
          id?: string
          next_review_date?: string | null
          notes?: string | null
          qualification_date?: string | null
          qualified_by?: string | null
          supplier_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "supplier_qualifications_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          address: string | null
          approval_date: string | null
          category: string
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          created_by: string | null
          id: string
          name: string
          requalification_due: string | null
          status: Database["public"]["Enums"]["supplier_status"]
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          approval_date?: string | null
          category: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          name: string
          requalification_due?: string | null
          status?: Database["public"]["Enums"]["supplier_status"]
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          approval_date?: string | null
          category?: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          name?: string
          requalification_due?: string | null
          status?: Database["public"]["Enums"]["supplier_status"]
          updated_at?: string | null
        }
        Relationships: []
      }
      training_assignments: {
        Row: {
          assigned_by: string
          assigned_date: string
          comments: string | null
          completed_date: string | null
          due_date: string | null
          evaluated_by: string | null
          evaluation_score: number | null
          id: string
          status: Database["public"]["Enums"]["training_status"]
          training_item_id: string
          user_id: string
          user_name: string
        }
        Insert: {
          assigned_by: string
          assigned_date?: string
          comments?: string | null
          completed_date?: string | null
          due_date?: string | null
          evaluated_by?: string | null
          evaluation_score?: number | null
          id?: string
          status?: Database["public"]["Enums"]["training_status"]
          training_item_id: string
          user_id: string
          user_name: string
        }
        Update: {
          assigned_by?: string
          assigned_date?: string
          comments?: string | null
          completed_date?: string | null
          due_date?: string | null
          evaluated_by?: string | null
          evaluation_score?: number | null
          id?: string
          status?: Database["public"]["Enums"]["training_status"]
          training_item_id?: string
          user_id?: string
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "training_assignments_training_item_id_fkey"
            columns: ["training_item_id"]
            isOneToOne: false
            referencedRelation: "training_items"
            referencedColumns: ["id"]
          },
        ]
      }
      training_items: {
        Row: {
          description: string | null
          document_id: string | null
          evaluation_required: boolean
          evaluation_type: string | null
          frequency: string
          id: string
          plan_id: string | null
          required_by: string | null
          title: string
          type: Database["public"]["Enums"]["training_type"]
        }
        Insert: {
          description?: string | null
          document_id?: string | null
          evaluation_required?: boolean
          evaluation_type?: string | null
          frequency: string
          id?: string
          plan_id?: string | null
          required_by?: string | null
          title: string
          type: Database["public"]["Enums"]["training_type"]
        }
        Update: {
          description?: string | null
          document_id?: string | null
          evaluation_required?: boolean
          evaluation_type?: string | null
          frequency?: string
          id?: string
          plan_id?: string | null
          required_by?: string | null
          title?: string
          type?: Database["public"]["Enums"]["training_type"]
        }
        Relationships: [
          {
            foreignKeyName: "training_items_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_items_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "training_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      training_plans: {
        Row: {
          created_at: string | null
          created_by: string
          department: string
          description: string | null
          id: string
          job_role: string
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          department: string
          description?: string | null
          id?: string
          job_role: string
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          department?: string
          description?: string | null
          id?: string
          job_role?: string
          status?: string
          title?: string
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
      non_conformance_summary: {
        Row: {
          capa_required_count: number | null
          count: number | null
          critical_count: number | null
          status: Database["public"]["Enums"]["nc_status"] | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_role: {
        Args: {
          requested_user_id: string
          requested_role: Database["public"]["Enums"]["user_role"]
        }
        Returns: boolean
      }
      is_qa_or_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      send_nc_reminders: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      audit_status: "Scheduled" | "In Progress" | "Completed" | "Cancelled"
      audit_type: "Internal" | "External" | "Supplier" | "Regulatory"
      capa_status: "Open" | "Investigation" | "In Progress" | "Closed"
      capa_type: "Corrective" | "Preventive" | "Both"
      change_status:
        | "Pending"
        | "Under Review"
        | "Approved"
        | "Rejected"
        | "Implemented"
      document_status: "Draft" | "In Review" | "Approved" | "Obsolete"
      finding_severity: "Minor" | "Major" | "Critical"
      finding_status: "Open" | "In Progress" | "Closed"
      nc_severity: "Minor" | "Major" | "Critical"
      nc_status:
        | "Open"
        | "Investigation"
        | "Containment"
        | "Correction"
        | "Verification"
        | "Closed"
      risk_status: "Open" | "Mitigated" | "Closed"
      supplier_status: "Pending" | "Approved" | "Suspended" | "Blacklisted"
      training_status:
        | "Pending"
        | "In Progress"
        | "Completed"
        | "Overdue"
        | "Waived"
      training_type:
        | "SOP"
        | "Policy"
        | "Work Instruction"
        | "External"
        | "On-the-job"
        | "Classroom"
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
      change_status: [
        "Pending",
        "Under Review",
        "Approved",
        "Rejected",
        "Implemented",
      ],
      document_status: ["Draft", "In Review", "Approved", "Obsolete"],
      finding_severity: ["Minor", "Major", "Critical"],
      finding_status: ["Open", "In Progress", "Closed"],
      nc_severity: ["Minor", "Major", "Critical"],
      nc_status: [
        "Open",
        "Investigation",
        "Containment",
        "Correction",
        "Verification",
        "Closed",
      ],
      risk_status: ["Open", "Mitigated", "Closed"],
      supplier_status: ["Pending", "Approved", "Suspended", "Blacklisted"],
      training_status: [
        "Pending",
        "In Progress",
        "Completed",
        "Overdue",
        "Waived",
      ],
      training_type: [
        "SOP",
        "Policy",
        "Work Instruction",
        "External",
        "On-the-job",
        "Classroom",
      ],
      user_role: ["admin", "manager", "supervisor", "user", "readonly"],
    },
  },
} as const
