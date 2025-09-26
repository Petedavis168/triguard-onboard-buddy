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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          email: string
          first_name: string
          id: string
          is_active: boolean
          last_name: string
          password_hash: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name: string
          id?: string
          is_active?: boolean
          last_name: string
          password_hash: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          is_active?: boolean
          last_name?: string
          password_hash?: string
          updated_at?: string
        }
        Relationships: []
      }
      email_addresses: {
        Row: {
          created_at: string
          email: string
          first_name: string
          id: string
          is_active: boolean
          last_name: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name: string
          id?: string
          is_active?: boolean
          last_name: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          is_active?: boolean
          last_name?: string
        }
        Relationships: []
      }
      managers: {
        Row: {
          created_at: string
          email: string
          first_name: string
          force_password_change: boolean
          id: string
          last_activity_at: string | null
          last_login_at: string | null
          last_name: string
          password: string
          team_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name: string
          force_password_change?: boolean
          id?: string
          last_activity_at?: string | null
          last_login_at?: string | null
          last_name: string
          password: string
          team_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          force_password_change?: boolean
          id?: string
          last_activity_at?: string | null
          last_login_at?: string | null
          last_name?: string
          password?: string
          team_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "managers_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_forms: {
        Row: {
          account_type: string | null
          badge_photo_url: string | null
          bank_account_number: string | null
          bank_routing_number: string | null
          cell_phone: string | null
          city: string
          coat_size: Database["public"]["Enums"]["size_type"]
          created_at: string
          current_step: number
          direct_deposit_completed_at: string | null
          direct_deposit_confirmed: boolean | null
          direct_deposit_form_url: string | null
          documents_uploaded_at: string | null
          drivers_license_url: string | null
          first_name: string
          gender: Database["public"]["Enums"]["gender_type"]
          generated_email: string | null
          hat_size: Database["public"]["Enums"]["size_type"]
          id: string
          last_name: string
          manager_id: string | null
          nickname: string | null
          pant_size: Database["public"]["Enums"]["size_type"]
          personal_email: string | null
          recruiter_id: string | null
          same_as_mailing: boolean
          shipping_city: string | null
          shipping_state: string | null
          shipping_street_address: string | null
          shipping_zip_code: string | null
          shirt_size: Database["public"]["Enums"]["size_type"]
          shoe_size: Database["public"]["Enums"]["shoe_size_type"]
          social_security_card_url: string | null
          state: string
          status: Database["public"]["Enums"]["form_status_type"]
          street_address: string
          submitted_at: string | null
          team_id: string | null
          updated_at: string
          user_password: string | null
          username: string | null
          voice_recording_completed_at: string | null
          voice_recording_url: string | null
          w9_completed: boolean
          w9_submitted_at: string | null
          zip_code: string
        }
        Insert: {
          account_type?: string | null
          badge_photo_url?: string | null
          bank_account_number?: string | null
          bank_routing_number?: string | null
          cell_phone?: string | null
          city: string
          coat_size: Database["public"]["Enums"]["size_type"]
          created_at?: string
          current_step?: number
          direct_deposit_completed_at?: string | null
          direct_deposit_confirmed?: boolean | null
          direct_deposit_form_url?: string | null
          documents_uploaded_at?: string | null
          drivers_license_url?: string | null
          first_name: string
          gender: Database["public"]["Enums"]["gender_type"]
          generated_email?: string | null
          hat_size: Database["public"]["Enums"]["size_type"]
          id?: string
          last_name: string
          manager_id?: string | null
          nickname?: string | null
          pant_size: Database["public"]["Enums"]["size_type"]
          personal_email?: string | null
          recruiter_id?: string | null
          same_as_mailing?: boolean
          shipping_city?: string | null
          shipping_state?: string | null
          shipping_street_address?: string | null
          shipping_zip_code?: string | null
          shirt_size: Database["public"]["Enums"]["size_type"]
          shoe_size: Database["public"]["Enums"]["shoe_size_type"]
          social_security_card_url?: string | null
          state: string
          status?: Database["public"]["Enums"]["form_status_type"]
          street_address: string
          submitted_at?: string | null
          team_id?: string | null
          updated_at?: string
          user_password?: string | null
          username?: string | null
          voice_recording_completed_at?: string | null
          voice_recording_url?: string | null
          w9_completed?: boolean
          w9_submitted_at?: string | null
          zip_code: string
        }
        Update: {
          account_type?: string | null
          badge_photo_url?: string | null
          bank_account_number?: string | null
          bank_routing_number?: string | null
          cell_phone?: string | null
          city?: string
          coat_size?: Database["public"]["Enums"]["size_type"]
          created_at?: string
          current_step?: number
          direct_deposit_completed_at?: string | null
          direct_deposit_confirmed?: boolean | null
          direct_deposit_form_url?: string | null
          documents_uploaded_at?: string | null
          drivers_license_url?: string | null
          first_name?: string
          gender?: Database["public"]["Enums"]["gender_type"]
          generated_email?: string | null
          hat_size?: Database["public"]["Enums"]["size_type"]
          id?: string
          last_name?: string
          manager_id?: string | null
          nickname?: string | null
          pant_size?: Database["public"]["Enums"]["size_type"]
          personal_email?: string | null
          recruiter_id?: string | null
          same_as_mailing?: boolean
          shipping_city?: string | null
          shipping_state?: string | null
          shipping_street_address?: string | null
          shipping_zip_code?: string | null
          shirt_size?: Database["public"]["Enums"]["size_type"]
          shoe_size?: Database["public"]["Enums"]["shoe_size_type"]
          social_security_card_url?: string | null
          state?: string
          status?: Database["public"]["Enums"]["form_status_type"]
          street_address?: string
          submitted_at?: string | null
          team_id?: string | null
          updated_at?: string
          user_password?: string | null
          username?: string | null
          voice_recording_completed_at?: string | null
          voice_recording_url?: string | null
          w9_completed?: boolean
          w9_submitted_at?: string | null
          zip_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_forms_generated_email_fkey"
            columns: ["generated_email"]
            isOneToOne: false
            referencedRelation: "email_addresses"
            referencedColumns: ["email"]
          },
          {
            foreignKeyName: "onboarding_forms_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "managers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "onboarding_forms_recruiter_id_fkey"
            columns: ["recruiter_id"]
            isOneToOne: false
            referencedRelation: "recruiters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "onboarding_forms_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      recruiters: {
        Row: {
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name: string
          id?: string
          last_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      task_assignments: {
        Row: {
          acknowledged_at: string | null
          created_at: string
          id: string
          onboarding_form_id: string | null
          task_id: string | null
          updated_at: string
        }
        Insert: {
          acknowledged_at?: string | null
          created_at?: string
          id?: string
          onboarding_form_id?: string | null
          task_id?: string | null
          updated_at?: string
        }
        Update: {
          acknowledged_at?: string | null
          created_at?: string
          id?: string
          onboarding_form_id?: string | null
          task_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_assignments_onboarding_form_id_fkey"
            columns: ["onboarding_form_id"]
            isOneToOne: false
            referencedRelation: "onboarding_forms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_assignments_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          manager_id: string | null
          team_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          manager_id?: string | null
          team_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          manager_id?: string | null
          team_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "managers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_secure_password: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      is_admin_user: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      form_status_type: "draft" | "in_progress" | "completed" | "submitted"
      gender_type: "male" | "female"
      shoe_size_type:
        | "6"
        | "6.5"
        | "7"
        | "7.5"
        | "8"
        | "8.5"
        | "9"
        | "9.5"
        | "10"
        | "10.5"
        | "11"
        | "11.5"
        | "12"
        | "12.5"
        | "13"
        | "13.5"
        | "14"
        | "14.5"
        | "15"
      size_type: "xs" | "s" | "m" | "l" | "xl" | "xxl" | "xxxl"
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
    Enums: {
      form_status_type: ["draft", "in_progress", "completed", "submitted"],
      gender_type: ["male", "female"],
      shoe_size_type: [
        "6",
        "6.5",
        "7",
        "7.5",
        "8",
        "8.5",
        "9",
        "9.5",
        "10",
        "10.5",
        "11",
        "11.5",
        "12",
        "12.5",
        "13",
        "13.5",
        "14",
        "14.5",
        "15",
      ],
      size_type: ["xs", "s", "m", "l", "xl", "xxl", "xxxl"],
    },
  },
} as const
