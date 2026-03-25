export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      action_items: {
        Row: {
          assignee_id: string
          completed_at: string | null
          created_at: string | null
          description: string
          due_date: string | null
          exchange_thread_id: string
          id: string
          meeting_instance_id: string | null
          status: string | null
          tenant_id: string
        }
        Insert: {
          assignee_id: string
          completed_at?: string | null
          created_at?: string | null
          description: string
          due_date?: string | null
          exchange_thread_id: string
          id?: string
          meeting_instance_id?: string | null
          status?: string | null
          tenant_id: string
        }
        Update: {
          assignee_id?: string
          completed_at?: string | null
          created_at?: string | null
          description?: string
          due_date?: string | null
          exchange_thread_id?: string
          id?: string
          meeting_instance_id?: string | null
          status?: string | null
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "action_items_assignee_id_fkey"
            columns: ["assignee_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "action_items_exchange_thread_id_fkey"
            columns: ["exchange_thread_id"]
            isOneToOne: false
            referencedRelation: "exchange_threads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "action_items_meeting_instance_id_fkey"
            columns: ["meeting_instance_id"]
            isOneToOne: false
            referencedRelation: "meeting_instances"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "action_items_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_feedback_summaries: {
        Row: {
          bi_directionality_score: number | null
          exchange_thread_id: string
          feedback_cadence_pct: number | null
          generated_at: string | null
          id: string
          improvement_areas: Json | null
          model_version: string | null
          strengths: Json | null
          summary_text: string
        }
        Insert: {
          bi_directionality_score?: number | null
          exchange_thread_id: string
          feedback_cadence_pct?: number | null
          generated_at?: string | null
          id?: string
          improvement_areas?: Json | null
          model_version?: string | null
          strengths?: Json | null
          summary_text: string
        }
        Update: {
          bi_directionality_score?: number | null
          exchange_thread_id?: string
          feedback_cadence_pct?: number | null
          generated_at?: string | null
          id?: string
          improvement_areas?: Json | null
          model_version?: string | null
          strengths?: Json | null
          summary_text?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_feedback_summaries_exchange_thread_id_fkey"
            columns: ["exchange_thread_id"]
            isOneToOne: true
            referencedRelation: "exchange_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          changes: Json | null
          created_at: string | null
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: unknown
          tenant_id: string
          user_agent: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          changes?: Json | null
          created_at?: string | null
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: unknown
          tenant_id: string
          user_agent?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          changes?: Json | null
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: unknown
          tenant_id?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      calendar_links: {
        Row: {
          created_at: string | null
          event_summary: string | null
          exchange_thread_id: string
          google_calendar_event_id: string
          google_calendar_id: string | null
          id: string
          is_active: boolean | null
          last_synced_at: string | null
          linked_by_user_id: string
          next_occurrence_at: string | null
          oauth_refresh_token_encrypted: string
          oauth_token_encrypted: string
          recurrence_rule: string | null
          tenant_id: string
        }
        Insert: {
          created_at?: string | null
          event_summary?: string | null
          exchange_thread_id: string
          google_calendar_event_id: string
          google_calendar_id?: string | null
          id?: string
          is_active?: boolean | null
          last_synced_at?: string | null
          linked_by_user_id: string
          next_occurrence_at?: string | null
          oauth_refresh_token_encrypted: string
          oauth_token_encrypted: string
          recurrence_rule?: string | null
          tenant_id: string
        }
        Update: {
          created_at?: string | null
          event_summary?: string | null
          exchange_thread_id?: string
          google_calendar_event_id?: string
          google_calendar_id?: string | null
          id?: string
          is_active?: boolean | null
          last_synced_at?: string | null
          linked_by_user_id?: string
          next_occurrence_at?: string | null
          oauth_refresh_token_encrypted?: string
          oauth_token_encrypted?: string
          recurrence_rule?: string | null
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "calendar_links_exchange_thread_id_fkey"
            columns: ["exchange_thread_id"]
            isOneToOne: true
            referencedRelation: "exchange_threads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_links_linked_by_user_id_fkey"
            columns: ["linked_by_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_links_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          created_at: string | null
          head_user_id: string | null
          id: string
          name: string
          parent_department_id: string | null
          tenant_id: string
        }
        Insert: {
          created_at?: string | null
          head_user_id?: string | null
          id?: string
          name: string
          parent_department_id?: string | null
          tenant_id: string
        }
        Update: {
          created_at?: string | null
          head_user_id?: string | null
          id?: string
          name?: string
          parent_department_id?: string | null
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "departments_parent_department_id_fkey"
            columns: ["parent_department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "departments_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      exchange_threads: {
        Row: {
          created_at: string | null
          direct_report_id: string
          id: string
          is_active: boolean | null
          manager_id: string
          tenant_id: string
        }
        Insert: {
          created_at?: string | null
          direct_report_id: string
          id?: string
          is_active?: boolean | null
          manager_id: string
          tenant_id: string
        }
        Update: {
          created_at?: string | null
          direct_report_id?: string
          id?: string
          is_active?: boolean | null
          manager_id?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exchange_threads_direct_report_id_fkey"
            columns: ["direct_report_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exchange_threads_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exchange_threads_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback_acknowledgments: {
        Row: {
          acknowledged_at: string | null
          acknowledged_by: string
          feedback_id: string
          id: string
        }
        Insert: {
          acknowledged_at?: string | null
          acknowledged_by: string
          feedback_id: string
          id?: string
        }
        Update: {
          acknowledged_at?: string | null
          acknowledged_by?: string
          feedback_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedback_acknowledgments_acknowledged_by_fkey"
            columns: ["acknowledged_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_acknowledgments_feedback_id_fkey"
            columns: ["feedback_id"]
            isOneToOne: false
            referencedRelation: "feedback_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback_entries: {
        Row: {
          author_id: string
          content: string
          created_at: string | null
          direction: string | null
          exchange_thread_id: string | null
          feedback_request_id: string | null
          id: string
          meeting_instance_id: string | null
          recipient_id: string
          tenant_id: string
          type: string
          updated_at: string | null
          visibility: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string | null
          direction?: string | null
          exchange_thread_id?: string | null
          feedback_request_id?: string | null
          id?: string
          meeting_instance_id?: string | null
          recipient_id: string
          tenant_id: string
          type: string
          updated_at?: string | null
          visibility: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string | null
          direction?: string | null
          exchange_thread_id?: string | null
          feedback_request_id?: string | null
          id?: string
          meeting_instance_id?: string | null
          recipient_id?: string
          tenant_id?: string
          type?: string
          updated_at?: string | null
          visibility?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedback_entries_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_entries_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_entries_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_feedback_exchange"
            columns: ["exchange_thread_id"]
            isOneToOne: false
            referencedRelation: "exchange_threads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_feedback_meeting"
            columns: ["meeting_instance_id"]
            isOneToOne: false
            referencedRelation: "meeting_instances"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_feedback_request"
            columns: ["feedback_request_id"]
            isOneToOne: false
            referencedRelation: "feedback_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback_entry_tags: {
        Row: {
          feedback_id: string
          tag_id: string
        }
        Insert: {
          feedback_id: string
          tag_id: string
        }
        Update: {
          feedback_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedback_entry_tags_feedback_id_fkey"
            columns: ["feedback_id"]
            isOneToOne: false
            referencedRelation: "feedback_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_entry_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "feedback_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback_ratings: {
        Row: {
          dimension_id: string
          feedback_id: string
          id: string
          value: number
        }
        Insert: {
          dimension_id: string
          feedback_id: string
          id?: string
          value: number
        }
        Update: {
          dimension_id?: string
          feedback_id?: string
          id?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "feedback_ratings_dimension_id_fkey"
            columns: ["dimension_id"]
            isOneToOne: false
            referencedRelation: "rating_dimensions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_ratings_feedback_id_fkey"
            columns: ["feedback_id"]
            isOneToOne: false
            referencedRelation: "feedback_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback_request_peers: {
        Row: {
          completed_at: string | null
          id: string
          peer_id: string
          request_id: string
          status: string | null
        }
        Insert: {
          completed_at?: string | null
          id?: string
          peer_id: string
          request_id: string
          status?: string | null
        }
        Update: {
          completed_at?: string | null
          id?: string
          peer_id?: string
          request_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feedback_request_peers_peer_id_fkey"
            columns: ["peer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_request_peers_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "feedback_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback_requests: {
        Row: {
          context: string | null
          created_at: string | null
          deadline: string | null
          id: string
          requester_id: string
          status: string | null
          tenant_id: string
        }
        Insert: {
          context?: string | null
          created_at?: string | null
          deadline?: string | null
          id?: string
          requester_id: string
          status?: string | null
          tenant_id: string
        }
        Update: {
          context?: string | null
          created_at?: string | null
          deadline?: string | null
          id?: string
          requester_id?: string
          status?: string | null
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedback_requests_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_requests_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback_tags: {
        Row: {
          category: string
          created_at: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          name: string
          tenant_id: string
        }
        Insert: {
          category: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          tenant_id: string
        }
        Update: {
          category?: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedback_tags_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback_thread_replies: {
        Row: {
          author_id: string
          content: string
          created_at: string | null
          feedback_id: string
          id: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string | null
          feedback_id: string
          id?: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string | null
          feedback_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedback_thread_replies_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_thread_replies_feedback_id_fkey"
            columns: ["feedback_id"]
            isOneToOne: false
            referencedRelation: "feedback_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      meeting_instances: {
        Row: {
          calendar_link_id: string | null
          created_at: string | null
          ended_at: string | null
          exchange_thread_id: string
          id: string
          scheduled_at: string
          status: string | null
          tenant_id: string
        }
        Insert: {
          calendar_link_id?: string | null
          created_at?: string | null
          ended_at?: string | null
          exchange_thread_id: string
          id?: string
          scheduled_at: string
          status?: string | null
          tenant_id: string
        }
        Update: {
          calendar_link_id?: string | null
          created_at?: string | null
          ended_at?: string | null
          exchange_thread_id?: string
          id?: string
          scheduled_at?: string
          status?: string | null
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meeting_instances_calendar_link_id_fkey"
            columns: ["calendar_link_id"]
            isOneToOne: false
            referencedRelation: "calendar_links"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meeting_instances_exchange_thread_id_fkey"
            columns: ["exchange_thread_id"]
            isOneToOne: false
            referencedRelation: "exchange_threads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meeting_instances_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      rating_dimensions: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          name: string
          tenant_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          tenant_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rating_dimensions_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      talking_points: {
        Row: {
          author_id: string
          carried_from_id: string | null
          content: string
          created_at: string | null
          exchange_thread_id: string
          id: string
          is_discussed: boolean | null
          meeting_instance_id: string | null
          order_index: number | null
        }
        Insert: {
          author_id: string
          carried_from_id?: string | null
          content: string
          created_at?: string | null
          exchange_thread_id: string
          id?: string
          is_discussed?: boolean | null
          meeting_instance_id?: string | null
          order_index?: number | null
        }
        Update: {
          author_id?: string
          carried_from_id?: string | null
          content?: string
          created_at?: string | null
          exchange_thread_id?: string
          id?: string
          is_discussed?: boolean | null
          meeting_instance_id?: string | null
          order_index?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "talking_points_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "talking_points_carried_from_id_fkey"
            columns: ["carried_from_id"]
            isOneToOne: false
            referencedRelation: "talking_points"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "talking_points_exchange_thread_id_fkey"
            columns: ["exchange_thread_id"]
            isOneToOne: false
            referencedRelation: "exchange_threads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "talking_points_meeting_instance_id_fkey"
            columns: ["meeting_instance_id"]
            isOneToOne: false
            referencedRelation: "meeting_instances"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          created_at: string | null
          domain: string | null
          id: string
          name: string
          plan_tier: string | null
          settings: Json | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          domain?: string | null
          id?: string
          name: string
          plan_tier?: string | null
          settings?: Json | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          domain?: string | null
          id?: string
          name?: string
          plan_tier?: string | null
          settings?: Json | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          department_id: string | null
          display_name: string | null
          email: string
          employment_status: string | null
          external_id: string | null
          first_name: string
          hire_date: string | null
          id: string
          job_title: string | null
          last_name: string
          manager_id: string | null
          role: string
          settings: Json | null
          slack_user_id: string | null
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          department_id?: string | null
          display_name?: string | null
          email: string
          employment_status?: string | null
          external_id?: string | null
          first_name: string
          hire_date?: string | null
          id: string
          job_title?: string | null
          last_name: string
          manager_id?: string | null
          role?: string
          settings?: Json | null
          slack_user_id?: string | null
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          department_id?: string | null
          display_name?: string | null
          email?: string
          employment_status?: string | null
          external_id?: string | null
          first_name?: string
          hire_date?: string | null
          id?: string
          job_title?: string | null
          last_name?: string
          manager_id?: string | null
          role?: string
          settings?: Json | null
          slack_user_id?: string | null
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
