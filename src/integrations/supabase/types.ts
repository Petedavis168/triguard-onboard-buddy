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
          force_password_change: boolean
          id: string
          is_active: boolean
          last_activity_at: string | null
          last_login_at: string | null
          last_name: string
          password_hash: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name: string
          force_password_change?: boolean
          id?: string
          is_active?: boolean
          last_activity_at?: string | null
          last_login_at?: string | null
          last_name: string
          password_hash: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          force_password_change?: boolean
          id?: string
          is_active?: boolean
          last_activity_at?: string | null
          last_login_at?: string | null
          last_name?: string
          password_hash?: string
          updated_at?: string
        }
        Relationships: []
      }
      appointments: {
        Row: {
          appointment_date: string
          appointment_type: string | null
          created_at: string | null
          duration_minutes: number | null
          id: string
          job_id: string | null
          notes: string | null
          setter_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          appointment_date: string
          appointment_type?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          job_id?: string | null
          notes?: string | null
          setter_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          appointment_date?: string
          appointment_type?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          job_id?: string | null
          notes?: string | null
          setter_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_setter_id_fkey"
            columns: ["setter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          changed_at: string | null
          changed_by: string | null
          id: string
          new_values: Json | null
          old_values: Json | null
          record_id: string
          table_name: string
        }
        Insert: {
          action: string
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          record_id: string
          table_name: string
        }
        Update: {
          action?: string
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string
          table_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      commissions: {
        Row: {
          base_amount: number
          commission_amount: number
          commission_rate: number
          commission_type: string
          created_at: string | null
          earned_date: string
          employee_id: string | null
          id: string
          job_id: string | null
          override_amount: number | null
          override_approved_by: string | null
          override_reason: string | null
          paid_date: string | null
          payment_batch_id: string | null
          status: Database["public"]["Enums"]["payment_status"] | null
          updated_at: string | null
        }
        Insert: {
          base_amount: number
          commission_amount: number
          commission_rate: number
          commission_type: string
          created_at?: string | null
          earned_date: string
          employee_id?: string | null
          id?: string
          job_id?: string | null
          override_amount?: number | null
          override_approved_by?: string | null
          override_reason?: string | null
          paid_date?: string | null
          payment_batch_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          updated_at?: string | null
        }
        Update: {
          base_amount?: number
          commission_amount?: number
          commission_rate?: number
          commission_type?: string
          created_at?: string | null
          earned_date?: string
          employee_id?: string | null
          id?: string
          job_id?: string | null
          override_amount?: number | null
          override_approved_by?: string | null
          override_reason?: string | null
          paid_date?: string | null
          payment_batch_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "commissions_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commissions_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commissions_override_approved_by_fkey"
            columns: ["override_approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commissions_payment_batch_id_fkey"
            columns: ["payment_batch_id"]
            isOneToOne: false
            referencedRelation: "payment_batches"
            referencedColumns: ["id"]
          },
        ]
      }
      course_enrollments: {
        Row: {
          completed_at: string | null
          course_id: string
          created_at: string
          due_date: string | null
          enrolled_by: string | null
          enrollment_date: string
          final_score: number | null
          id: string
          is_required: boolean
          started_at: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          course_id: string
          created_at?: string
          due_date?: string | null
          enrolled_by?: string | null
          enrollment_date?: string
          final_score?: number | null
          id?: string
          is_required?: boolean
          started_at?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          course_id?: string
          created_at?: string
          due_date?: string | null
          enrolled_by?: string | null
          enrollment_date?: string
          final_score?: number | null
          id?: string
          is_required?: boolean
          started_at?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_enrollments_enrolled_by_fkey"
            columns: ["enrolled_by"]
            isOneToOne: false
            referencedRelation: "managers"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          category: string
          created_at: string
          created_by: string | null
          description: string | null
          difficulty_level: string
          duration_minutes: number | null
          id: string
          is_active: boolean
          is_required: boolean
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          difficulty_level?: string
          duration_minutes?: number | null
          id?: string
          is_active?: boolean
          is_required?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          difficulty_level?: string
          duration_minutes?: number | null
          id?: string
          is_active?: boolean
          is_required?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "courses_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "managers"
            referencedColumns: ["id"]
          },
        ]
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
      jobs: {
        Row: {
          address: string
          appointment_date: string | null
          city: string
          commission_amount: number | null
          completion_date: string | null
          created_at: string | null
          created_by: string | null
          customer_email: string | null
          customer_name: string
          customer_phone: string | null
          id: string
          installer_id: string | null
          job_number: string
          job_value: number
          notes: string | null
          regional_manager_id: string | null
          sales_rep_id: string | null
          setter_id: string | null
          state: string
          status: Database["public"]["Enums"]["job_status"] | null
          updated_at: string | null
          zip_code: string
        }
        Insert: {
          address: string
          appointment_date?: string | null
          city: string
          commission_amount?: number | null
          completion_date?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_email?: string | null
          customer_name: string
          customer_phone?: string | null
          id?: string
          installer_id?: string | null
          job_number: string
          job_value: number
          notes?: string | null
          regional_manager_id?: string | null
          sales_rep_id?: string | null
          setter_id?: string | null
          state: string
          status?: Database["public"]["Enums"]["job_status"] | null
          updated_at?: string | null
          zip_code: string
        }
        Update: {
          address?: string
          appointment_date?: string | null
          city?: string
          commission_amount?: number | null
          completion_date?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string | null
          id?: string
          installer_id?: string | null
          job_number?: string
          job_value?: number
          notes?: string | null
          regional_manager_id?: string | null
          sales_rep_id?: string | null
          setter_id?: string | null
          state?: string
          status?: Database["public"]["Enums"]["job_status"] | null
          updated_at?: string | null
          zip_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "jobs_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_installer_id_fkey"
            columns: ["installer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_regional_manager_id_fkey"
            columns: ["regional_manager_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_sales_rep_id_fkey"
            columns: ["sales_rep_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_setter_id_fkey"
            columns: ["setter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_assignments: {
        Row: {
          assigned_by: string
          assigned_to: string
          assignment_type: string
          completion_notes: string | null
          course_id: string | null
          created_at: string
          due_date: string | null
          id: string
          priority: string
          quiz_id: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          task_id: string | null
          updated_at: string
        }
        Insert: {
          assigned_by: string
          assigned_to: string
          assignment_type: string
          completion_notes?: string | null
          course_id?: string | null
          created_at?: string
          due_date?: string | null
          id?: string
          priority?: string
          quiz_id?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          task_id?: string | null
          updated_at?: string
        }
        Update: {
          assigned_by?: string
          assigned_to?: string
          assignment_type?: string
          completion_notes?: string | null
          course_id?: string | null
          created_at?: string
          due_date?: string | null
          id?: string
          priority?: string
          quiz_id?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          task_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "learning_assignments_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "managers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_assignments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_assignments_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_assignments_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "managers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_assignments_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_completions: {
        Row: {
          completed_at: string | null
          created_at: string
          enrollment_id: string
          id: string
          lesson_id: string
          notes: string | null
          score: number | null
          started_at: string | null
          status: string
          time_spent_minutes: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          enrollment_id: string
          id?: string
          lesson_id: string
          notes?: string | null
          score?: number | null
          started_at?: string | null
          status?: string
          time_spent_minutes?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          enrollment_id?: string
          id?: string
          lesson_id?: string
          notes?: string | null
          score?: number | null
          started_at?: string | null
          status?: string
          time_spent_minutes?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_completions_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "course_enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_completions_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          content_text: string | null
          content_url: string | null
          course_id: string
          created_at: string
          description: string | null
          duration_minutes: number | null
          id: string
          is_active: boolean
          is_required: boolean
          lesson_order: number
          lesson_type: string
          title: string
          updated_at: string
        }
        Insert: {
          content_text?: string | null
          content_url?: string | null
          course_id: string
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_active?: boolean
          is_required?: boolean
          lesson_order?: number
          lesson_type?: string
          title: string
          updated_at?: string
        }
        Update: {
          content_text?: string | null
          content_url?: string | null
          course_id?: string
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_active?: boolean
          is_required?: boolean
          lesson_order?: number
          lesson_type?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      manager_teams: {
        Row: {
          assigned_at: string
          created_at: string
          id: string
          manager_id: string
          team_id: string
        }
        Insert: {
          assigned_at?: string
          created_at?: string
          id?: string
          manager_id: string
          team_id: string
        }
        Update: {
          assigned_at?: string
          created_at?: string
          id?: string
          manager_id?: string
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "manager_teams_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "managers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "manager_teams_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      managers: {
        Row: {
          created_at: string
          email: string
          first_name: string
          force_password_change: boolean
          id: string
          is_admin: boolean
          last_activity_at: string | null
          last_login_at: string | null
          last_name: string
          password_hash: string
          team_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name: string
          force_password_change?: boolean
          id?: string
          is_admin?: boolean
          last_activity_at?: string | null
          last_login_at?: string | null
          last_name: string
          password_hash: string
          team_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          force_password_change?: boolean
          id?: string
          is_admin?: boolean
          last_activity_at?: string | null
          last_login_at?: string | null
          last_name?: string
          password_hash?: string
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
      pay_rules: {
        Row: {
          applicable_roles: Database["public"]["Enums"]["user_role"][] | null
          base_rate: number | null
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          rule_type: string
          tier_1_rate: number | null
          tier_1_threshold: number | null
          tier_2_rate: number | null
          tier_2_threshold: number | null
          tier_3_rate: number | null
          tier_3_threshold: number | null
          updated_at: string | null
        }
        Insert: {
          applicable_roles?: Database["public"]["Enums"]["user_role"][] | null
          base_rate?: number | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          rule_type: string
          tier_1_rate?: number | null
          tier_1_threshold?: number | null
          tier_2_rate?: number | null
          tier_2_threshold?: number | null
          tier_3_rate?: number | null
          tier_3_threshold?: number | null
          updated_at?: string | null
        }
        Update: {
          applicable_roles?: Database["public"]["Enums"]["user_role"][] | null
          base_rate?: number | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          rule_type?: string
          tier_1_rate?: number | null
          tier_1_threshold?: number | null
          tier_2_rate?: number | null
          tier_2_threshold?: number | null
          tier_3_rate?: number | null
          tier_3_threshold?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      payment_batches: {
        Row: {
          batch_number: string
          created_at: string | null
          employee_count: number
          id: string
          pay_period_end: string
          pay_period_start: string
          processed_at: string | null
          processed_by: string | null
          status: Database["public"]["Enums"]["payment_status"] | null
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          batch_number: string
          created_at?: string | null
          employee_count: number
          id?: string
          pay_period_end: string
          pay_period_start: string
          processed_at?: string | null
          processed_by?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          batch_number?: string
          created_at?: string | null
          employee_count?: number
          id?: string
          pay_period_end?: string
          pay_period_start?: string
          processed_at?: string | null
          processed_by?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_batches_processed_by_fkey"
            columns: ["processed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          annual_salary: number | null
          commission_eligible: boolean | null
          commission_rate: number | null
          created_at: string | null
          email: string
          employee_id: string
          first_name: string
          hire_date: string | null
          hourly_rate: number | null
          id: string
          is_active: boolean | null
          last_name: string
          manager_id: string | null
          pay_type: Database["public"]["Enums"]["pay_type"]
          phone: string | null
          region_id: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          annual_salary?: number | null
          commission_eligible?: boolean | null
          commission_rate?: number | null
          created_at?: string | null
          email: string
          employee_id: string
          first_name: string
          hire_date?: string | null
          hourly_rate?: number | null
          id: string
          is_active?: boolean | null
          last_name: string
          manager_id?: string | null
          pay_type?: Database["public"]["Enums"]["pay_type"]
          phone?: string | null
          region_id?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          annual_salary?: number | null
          commission_eligible?: boolean | null
          commission_rate?: number | null
          created_at?: string | null
          email?: string
          employee_id?: string
          first_name?: string
          hire_date?: string | null
          hourly_rate?: number | null
          id?: string
          is_active?: boolean | null
          last_name?: string
          manager_id?: string | null
          pay_type?: Database["public"]["Enums"]["pay_type"]
          phone?: string | null
          region_id?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_profiles_manager_id"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_attempts: {
        Row: {
          attempt_number: number
          completed_at: string | null
          created_at: string
          enrollment_id: string | null
          id: string
          max_possible_score: number | null
          passed: boolean | null
          percentage_score: number | null
          quiz_id: string
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          started_at: string
          status: string
          time_spent_minutes: number | null
          total_score: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          attempt_number?: number
          completed_at?: string | null
          created_at?: string
          enrollment_id?: string | null
          id?: string
          max_possible_score?: number | null
          passed?: boolean | null
          percentage_score?: number | null
          quiz_id: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          started_at?: string
          status?: string
          time_spent_minutes?: number | null
          total_score?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          attempt_number?: number
          completed_at?: string | null
          created_at?: string
          enrollment_id?: string | null
          id?: string
          max_possible_score?: number | null
          passed?: boolean | null
          percentage_score?: number | null
          quiz_id?: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          started_at?: string
          status?: string
          time_spent_minutes?: number | null
          total_score?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_attempts_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "course_enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_attempts_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_attempts_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "managers"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_question_options: {
        Row: {
          created_at: string
          id: string
          is_correct: boolean
          option_order: number
          option_text: string
          question_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_correct?: boolean
          option_order?: number
          option_text: string
          question_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_correct?: boolean
          option_order?: number
          option_text?: string
          question_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_question_options_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "quiz_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_questions: {
        Row: {
          correct_answer: string | null
          created_at: string
          explanation: string | null
          id: string
          is_active: boolean
          points: number
          question_order: number
          question_text: string
          question_type: string
          quiz_id: string
        }
        Insert: {
          correct_answer?: string | null
          created_at?: string
          explanation?: string | null
          id?: string
          is_active?: boolean
          points?: number
          question_order?: number
          question_text: string
          question_type?: string
          quiz_id: string
        }
        Update: {
          correct_answer?: string | null
          created_at?: string
          explanation?: string | null
          id?: string
          is_active?: boolean
          points?: number
          question_order?: number
          question_text?: string
          question_type?: string
          quiz_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_responses: {
        Row: {
          attempt_id: string
          created_at: string
          feedback: string | null
          id: string
          is_correct: boolean | null
          points_earned: number | null
          question_id: string
          selected_option_id: string | null
          text_response: string | null
        }
        Insert: {
          attempt_id: string
          created_at?: string
          feedback?: string | null
          id?: string
          is_correct?: boolean | null
          points_earned?: number | null
          question_id: string
          selected_option_id?: string | null
          text_response?: string | null
        }
        Update: {
          attempt_id?: string
          created_at?: string
          feedback?: string | null
          id?: string
          is_correct?: boolean | null
          points_earned?: number | null
          question_id?: string
          selected_option_id?: string | null
          text_response?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_responses_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "quiz_attempts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_responses_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "quiz_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_responses_selected_option_id_fkey"
            columns: ["selected_option_id"]
            isOneToOne: false
            referencedRelation: "quiz_question_options"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          course_id: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          instructions: string | null
          is_active: boolean
          lesson_id: string | null
          max_attempts: number | null
          passing_score: number
          time_limit_minutes: number | null
          title: string
          updated_at: string
        }
        Insert: {
          course_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          instructions?: string | null
          is_active?: boolean
          lesson_id?: string | null
          max_attempts?: number | null
          passing_score?: number
          time_limit_minutes?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          course_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          instructions?: string | null
          is_active?: boolean
          lesson_id?: string | null
          max_attempts?: number | null
          passing_score?: number
          time_limit_minutes?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quizzes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "managers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quizzes_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
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
      regions: {
        Row: {
          code: string
          created_at: string | null
          id: string
          is_active: boolean | null
          manager_id: string | null
          name: string
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          manager_id?: string | null
          name: string
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          manager_id?: string | null
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_regions_manager_id"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      timecards: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          break_minutes: number | null
          clock_in: string | null
          clock_out: string | null
          created_at: string | null
          employee_id: string | null
          id: string
          job_id: string | null
          notes: string | null
          overtime_hours: number | null
          regular_hours: number | null
          updated_at: string | null
          work_date: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          break_minutes?: number | null
          clock_in?: string | null
          clock_out?: string | null
          created_at?: string | null
          employee_id?: string | null
          id?: string
          job_id?: string | null
          notes?: string | null
          overtime_hours?: number | null
          regular_hours?: number | null
          updated_at?: string | null
          work_date: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          break_minutes?: number | null
          clock_in?: string | null
          clock_out?: string | null
          created_at?: string | null
          employee_id?: string | null
          id?: string
          job_id?: string | null
          notes?: string | null
          overtime_hours?: number | null
          regular_hours?: number | null
          updated_at?: string | null
          work_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "timecards_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timecards_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timecards_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      authenticate_admin: {
        Args: { admin_email: string; admin_password: string }
        Returns: {
          email: string
          first_name: string
          force_password_change: boolean
          id: string
          last_activity_at: string
          last_login_at: string
          last_name: string
          user_type: string
        }[]
      }
      authenticate_manager: {
        Args: { manager_email: string; manager_password: string }
        Returns: {
          email: string
          first_name: string
          force_password_change: boolean
          id: string
          last_activity_at: string
          last_login_at: string
          last_name: string
          team_id: string
        }[]
      }
      generate_secure_password: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      hash_password: {
        Args: { password: string }
        Returns: string
      }
      is_admin_manager: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_admin_user: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_authenticated_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      update_admin_password: {
        Args: {
          admin_id: string
          current_password: string
          new_password: string
        }
        Returns: boolean
      }
      update_manager_password: {
        Args: {
          current_password: string
          manager_id: string
          new_password: string
        }
        Returns: boolean
      }
      verify_password: {
        Args: { password: string; password_hash: string }
        Returns: boolean
      }
    }
    Enums: {
      form_status_type: "draft" | "in_progress" | "completed" | "submitted"
      gender_type: "male" | "female"
      job_status: "pending" | "in_progress" | "completed" | "cancelled"
      pay_type: "salary" | "hourly" | "commission"
      payment_status: "pending" | "processed" | "paid" | "failed"
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
      user_role:
        | "admin"
        | "roof_pro_sales"
        | "recruiter"
        | "manager"
        | "setter"
        | "regional_manager"
        | "payroll_specialist"
        | "csr"
        | "executive_team"
        | "installer"
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
      job_status: ["pending", "in_progress", "completed", "cancelled"],
      pay_type: ["salary", "hourly", "commission"],
      payment_status: ["pending", "processed", "paid", "failed"],
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
      user_role: [
        "admin",
        "roof_pro_sales",
        "recruiter",
        "manager",
        "setter",
        "regional_manager",
        "payroll_specialist",
        "csr",
        "executive_team",
        "installer",
      ],
    },
  },
} as const
