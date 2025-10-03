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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      admin_logs: {
        Row: {
          action: string
          admin_id: string | null
          created_at: string
          details: Json | null
          id: string
          ip_address: unknown | null
        }
        Insert: {
          action: string
          admin_id?: string | null
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
        }
        Update: {
          action?: string
          admin_id?: string | null
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_logs_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_users: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          last_login: string | null
          password_hash: string
          updated_at: string
          username: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id?: string
          last_login?: string | null
          password_hash: string
          updated_at?: string
          username: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          last_login?: string | null
          password_hash?: string
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      booking_locations: {
        Row: {
          accuracy: number | null
          booking_id: string
          id: string
          latitude: number
          longitude: number
          recorded_at: string
        }
        Insert: {
          accuracy?: number | null
          booking_id: string
          id?: string
          latitude: number
          longitude: number
          recorded_at?: string
        }
        Update: {
          accuracy?: number | null
          booking_id?: string
          id?: string
          latitude?: number
          longitude?: number
          recorded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_locations_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_media: {
        Row: {
          booking_id: string
          caption: string | null
          created_at: string
          id: string
          latitude: number | null
          longitude: number | null
          media_type: string
          media_url: string
        }
        Insert: {
          booking_id: string
          caption?: string | null
          created_at?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          media_type: string
          media_url: string
        }
        Update: {
          booking_id?: string
          caption?: string | null
          created_at?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          media_type?: string
          media_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_media_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_reports: {
        Row: {
          behavior_notes: string | null
          booking_id: string
          distance_km: number | null
          duration_actual_minutes: number | null
          generated_at: string
          health_notes: string | null
          id: string
          incidents: string | null
          walker_id: string
        }
        Insert: {
          behavior_notes?: string | null
          booking_id: string
          distance_km?: number | null
          duration_actual_minutes?: number | null
          generated_at?: string
          health_notes?: string | null
          id?: string
          incidents?: string | null
          walker_id: string
        }
        Update: {
          behavior_notes?: string | null
          booking_id?: string
          distance_km?: number | null
          duration_actual_minutes?: number | null
          generated_at?: string
          health_notes?: string | null
          id?: string
          incidents?: string | null
          walker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_reports_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_reports_walker_id_fkey"
            columns: ["walker_id"]
            isOneToOne: false
            referencedRelation: "walkers"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          additional_30min_slots: number | null
          booking_date: string
          cancellation_reason: string | null
          cancelled_at: string | null
          cancelled_by: string | null
          client_user_id: string
          commission_amount: number
          commission_rate: number
          completed_at: string | null
          created_at: string
          dog_id: string
          duration_minutes: number
          end_time: string | null
          id: string
          payment_status: string
          pickup_address: string
          pickup_latitude: number | null
          pickup_longitude: number | null
          service_type: string
          special_instructions: string | null
          start_time: string
          started_at: string | null
          status: string
          stripe_payment_intent_id: string | null
          total_price: number
          updated_at: string
          walk_photos: string[] | null
          walker_amount: number
          walker_id: string
          walker_notes: string | null
        }
        Insert: {
          additional_30min_slots?: number | null
          booking_date: string
          cancellation_reason?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          client_user_id: string
          commission_amount: number
          commission_rate?: number
          completed_at?: string | null
          created_at?: string
          dog_id: string
          duration_minutes?: number
          end_time?: string | null
          id?: string
          payment_status?: string
          pickup_address: string
          pickup_latitude?: number | null
          pickup_longitude?: number | null
          service_type?: string
          special_instructions?: string | null
          start_time: string
          started_at?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          total_price: number
          updated_at?: string
          walk_photos?: string[] | null
          walker_amount: number
          walker_id: string
          walker_notes?: string | null
        }
        Update: {
          additional_30min_slots?: number | null
          booking_date?: string
          cancellation_reason?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          client_user_id?: string
          commission_amount?: number
          commission_rate?: number
          completed_at?: string | null
          created_at?: string
          dog_id?: string
          duration_minutes?: number
          end_time?: string | null
          id?: string
          payment_status?: string
          pickup_address?: string
          pickup_latitude?: number | null
          pickup_longitude?: number | null
          service_type?: string
          special_instructions?: string | null
          start_time?: string
          started_at?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          total_price?: number
          updated_at?: string
          walk_photos?: string[] | null
          walker_amount?: number
          walker_id?: string
          walker_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_dog_id_fkey"
            columns: ["dog_id"]
            isOneToOne: false
            referencedRelation: "dogs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_walker_id_fkey"
            columns: ["walker_id"]
            isOneToOne: false
            referencedRelation: "walkers"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_list_items: {
        Row: {
          added_at: string
          contact_id: string
          contact_list_id: string
          id: string
        }
        Insert: {
          added_at?: string
          contact_id: string
          contact_list_id: string
          id?: string
        }
        Update: {
          added_at?: string
          contact_id?: string
          contact_list_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contact_list_items_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_list_items_contact_list_id_fkey"
            columns: ["contact_list_id"]
            isOneToOne: false
            referencedRelation: "contact_lists"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_lists: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contact_lists_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          import_date: string
          last_name: string | null
          latitude: number | null
          longitude: number | null
          phone_number: string | null
          photo_url: string | null
          raw_data: Json | null
          source: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          import_date?: string
          last_name?: string | null
          latitude?: number | null
          longitude?: number | null
          phone_number?: string | null
          photo_url?: string | null
          raw_data?: Json | null
          source?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          import_date?: string
          last_name?: string | null
          latitude?: number | null
          longitude?: number | null
          phone_number?: string | null
          photo_url?: string | null
          raw_data?: Json | null
          source?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contacts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      dogs: {
        Row: {
          age: number
          behavior_notes: string | null
          breed: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          medical_notes: string | null
          name: string
          photo_url: string | null
          size: string
          updated_at: string
          user_id: string
          weight: number | null
        }
        Insert: {
          age: number
          behavior_notes?: string | null
          breed: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          medical_notes?: string | null
          name: string
          photo_url?: string | null
          size: string
          updated_at?: string
          user_id: string
          weight?: number | null
        }
        Update: {
          age?: number
          behavior_notes?: string | null
          breed?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          medical_notes?: string | null
          name?: string
          photo_url?: string | null
          size?: string
          updated_at?: string
          user_id?: string
          weight?: number | null
        }
        Relationships: []
      }
      exports: {
        Row: {
          contact_count: number
          created_at: string
          error_message: string | null
          file_path: string | null
          id: string
          status: string
          type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          contact_count?: number
          created_at?: string
          error_message?: string | null
          file_path?: string | null
          id?: string
          status?: string
          type: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          contact_count?: number
          created_at?: string
          error_message?: string | null
          file_path?: string | null
          id?: string
          status?: string
          type?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exports_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      favorite_walkers: {
        Row: {
          created_at: string
          id: string
          user_id: string
          walker_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_id: string
          walker_id: string
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string
          walker_id?: string
        }
        Relationships: []
      }
      images: {
        Row: {
          created_at: string | null
          file_size: number | null
          id: string
          original_filename: string
          process_type: string
          processed_filename: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          file_size?: number | null
          id?: string
          original_filename: string
          process_type: string
          processed_filename?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          file_size?: number | null
          id?: string
          original_filename?: string
          process_type?: string
          processed_filename?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          booking_id: string | null
          conversation_id: string
          created_at: string
          id: string
          is_read: boolean
          message_text: string
          receiver_user_id: string
          sender_user_id: string
          updated_at: string
        }
        Insert: {
          booking_id?: string | null
          conversation_id: string
          created_at?: string
          id?: string
          is_read?: boolean
          message_text: string
          receiver_user_id: string
          sender_user_id: string
          updated_at?: string
        }
        Update: {
          booking_id?: string | null
          conversation_id?: string
          created_at?: string
          id?: string
          is_read?: boolean
          message_text?: string
          receiver_user_id?: string
          sender_user_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_receiver_user_id_fkey"
            columns: ["receiver_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_user_id_fkey"
            columns: ["sender_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string
          notification_type: string
          related_id: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          notification_type: string
          related_id?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          notification_type?: string
          related_id?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          daily_usage: number | null
          email: string
          full_name: string | null
          id: string
          last_usage_reset: string | null
          plan_type: string | null
          subscription_status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          daily_usage?: number | null
          email: string
          full_name?: string | null
          id?: string
          last_usage_reset?: string | null
          plan_type?: string | null
          subscription_status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          daily_usage?: number | null
          email?: string
          full_name?: string | null
          id?: string
          last_usage_reset?: string | null
          plan_type?: string | null
          subscription_status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          booking_id: string
          client_user_id: string
          comment: string | null
          created_at: string
          id: string
          is_visible: boolean
          rating: number
          walker_id: string
        }
        Insert: {
          booking_id: string
          client_user_id: string
          comment?: string | null
          created_at?: string
          id?: string
          is_visible?: boolean
          rating: number
          walker_id: string
        }
        Update: {
          booking_id?: string
          client_user_id?: string
          comment?: string | null
          created_at?: string
          id?: string
          is_visible?: boolean
          rating?: number
          walker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_walker_id_fkey"
            columns: ["walker_id"]
            isOneToOne: false
            referencedRelation: "walkers"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan_id: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_id: string
          status: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_id?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          description: string | null
          id: string
          setting_key: string
          setting_value: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          description?: string | null
          id?: string
          setting_key: string
          setting_value?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          description?: string | null
          id?: string
          setting_key?: string
          setting_value?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "system_settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      tips: {
        Row: {
          amount: number
          booking_id: string
          client_user_id: string
          created_at: string
          id: string
          stripe_payment_intent_id: string | null
          walker_id: string
        }
        Insert: {
          amount: number
          booking_id: string
          client_user_id: string
          created_at?: string
          id?: string
          stripe_payment_intent_id?: string | null
          walker_id: string
        }
        Update: {
          amount?: number
          booking_id?: string
          client_user_id?: string
          created_at?: string
          id?: string
          stripe_payment_intent_id?: string | null
          walker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tips_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tips_client_user_id_fkey"
            columns: ["client_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tips_walker_id_fkey"
            columns: ["walker_id"]
            isOneToOne: false
            referencedRelation: "walkers"
            referencedColumns: ["id"]
          },
        ]
      }
      user_auth_status: {
        Row: {
          approval_date: string | null
          auth_user_id: string
          created_at: string | null
          email_verified: boolean | null
          id: string
          profile_approved: boolean | null
          profile_completed: boolean | null
          registration_date: string | null
          updated_at: string | null
          user_type: string
        }
        Insert: {
          approval_date?: string | null
          auth_user_id: string
          created_at?: string | null
          email_verified?: boolean | null
          id?: string
          profile_approved?: boolean | null
          profile_completed?: boolean | null
          registration_date?: string | null
          updated_at?: string | null
          user_type?: string
        }
        Update: {
          approval_date?: string | null
          auth_user_id?: string
          created_at?: string | null
          email_verified?: boolean | null
          id?: string
          profile_approved?: boolean | null
          profile_completed?: boolean | null
          registration_date?: string | null
          updated_at?: string | null
          user_type?: string
        }
        Relationships: []
      }
      user_documents: {
        Row: {
          document_type: string
          document_url: string
          id: string
          uploaded_at: string
          user_id: string
          verified: boolean
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          document_type: string
          document_url: string
          id?: string
          uploaded_at?: string
          user_id: string
          verified?: boolean
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          document_type?: string
          document_url?: string
          id?: string
          uploaded_at?: string
          user_id?: string
          verified?: boolean
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_documents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          auto_backup: boolean | null
          created_at: string
          id: string
          language: string | null
          local_backup: boolean | null
          theme: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          auto_backup?: boolean | null
          created_at?: string
          id?: string
          language?: string | null
          local_backup?: boolean | null
          theme?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          auto_backup?: boolean | null
          created_at?: string
          id?: string
          language?: string | null
          local_backup?: boolean | null
          theme?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          address: string | null
          agreement_accepted: boolean | null
          agreement_date: string | null
          auth_user_id: string | null
          avatar_url: string | null
          city: string | null
          contact_limit: number | null
          created_at: string
          email: string
          first_name: string | null
          id: string
          id_card_url: string | null
          id_card_verified: boolean | null
          last_name: string | null
          phone: string | null
          subscription_end_date: string | null
          total_contacts_imported: number | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          agreement_accepted?: boolean | null
          agreement_date?: string | null
          auth_user_id?: string | null
          avatar_url?: string | null
          city?: string | null
          contact_limit?: number | null
          created_at?: string
          email: string
          first_name?: string | null
          id?: string
          id_card_url?: string | null
          id_card_verified?: boolean | null
          last_name?: string | null
          phone?: string | null
          subscription_end_date?: string | null
          total_contacts_imported?: number | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          agreement_accepted?: boolean | null
          agreement_date?: string | null
          auth_user_id?: string | null
          avatar_url?: string | null
          city?: string | null
          contact_limit?: number | null
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          id_card_url?: string | null
          id_card_verified?: boolean | null
          last_name?: string | null
          phone?: string | null
          subscription_end_date?: string | null
          total_contacts_imported?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      walker_availability: {
        Row: {
          created_at: string
          day_of_week: number
          end_time: string
          id: string
          is_active: boolean
          start_time: string
          walker_id: string
        }
        Insert: {
          created_at?: string
          day_of_week: number
          end_time: string
          id?: string
          is_active?: boolean
          start_time: string
          walker_id: string
        }
        Update: {
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: string
          is_active?: boolean
          start_time?: string
          walker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "walker_availability_walker_id_fkey"
            columns: ["walker_id"]
            isOneToOne: false
            referencedRelation: "walkers"
            referencedColumns: ["id"]
          },
        ]
      }
      walker_certifications: {
        Row: {
          certificate_url: string | null
          certification_name: string
          certification_type: string
          created_at: string
          expiry_date: string | null
          id: string
          issue_date: string | null
          issuer: string | null
          verified: boolean
          walker_id: string
        }
        Insert: {
          certificate_url?: string | null
          certification_name: string
          certification_type: string
          created_at?: string
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          issuer?: string | null
          verified?: boolean
          walker_id: string
        }
        Update: {
          certificate_url?: string | null
          certification_name?: string
          certification_type?: string
          created_at?: string
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          issuer?: string | null
          verified?: boolean
          walker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "walker_certifications_walker_id_fkey"
            columns: ["walker_id"]
            isOneToOne: false
            referencedRelation: "walkers"
            referencedColumns: ["id"]
          },
        ]
      }
      walker_photos: {
        Row: {
          caption: string | null
          created_at: string
          id: string
          is_profile_photo: boolean
          photo_url: string
          walker_id: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          id?: string
          is_profile_photo?: boolean
          photo_url: string
          walker_id: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          id?: string
          is_profile_photo?: boolean
          photo_url?: string
          walker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "walker_photos_walker_id_fkey"
            columns: ["walker_id"]
            isOneToOne: false
            referencedRelation: "walkers"
            referencedColumns: ["id"]
          },
        ]
      }
      walkers: {
        Row: {
          address: string | null
          bio: string | null
          certifications: string[] | null
          certifications_urls: string[] | null
          city: string | null
          created_at: string
          criminal_record_b2_url: string | null
          criminal_record_verified: boolean | null
          experience_years: number | null
          formation_completed: boolean | null
          hourly_rate: number
          id: string
          is_active: boolean
          is_verified: boolean
          languages: string[] | null
          latitude: number | null
          longitude: number | null
          rating: number | null
          service_radius: number
          total_reviews: number | null
          total_walks: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          bio?: string | null
          certifications?: string[] | null
          certifications_urls?: string[] | null
          city?: string | null
          created_at?: string
          criminal_record_b2_url?: string | null
          criminal_record_verified?: boolean | null
          experience_years?: number | null
          formation_completed?: boolean | null
          hourly_rate?: number
          id?: string
          is_active?: boolean
          is_verified?: boolean
          languages?: string[] | null
          latitude?: number | null
          longitude?: number | null
          rating?: number | null
          service_radius?: number
          total_reviews?: number | null
          total_walks?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          bio?: string | null
          certifications?: string[] | null
          certifications_urls?: string[] | null
          city?: string | null
          created_at?: string
          criminal_record_b2_url?: string | null
          criminal_record_verified?: boolean | null
          experience_years?: number | null
          formation_completed?: boolean | null
          hourly_rate?: number
          id?: string
          is_active?: boolean
          is_verified?: boolean
          languages?: string[] | null
          latitude?: number | null
          longitude?: number | null
          rating?: number | null
          service_radius?: number
          total_reviews?: number | null
          total_walks?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "walkers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_process_image: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      reset_daily_usage: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      contact_status: "active" | "deleted" | "archived"
      import_source:
        | "gmail"
        | "phone"
        | "sim"
        | "google_drive"
        | "icloud"
        | "onedrive"
        | "sd_card"
      subscription_status: "free" | "premium"
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
      contact_status: ["active", "deleted", "archived"],
      import_source: [
        "gmail",
        "phone",
        "sim",
        "google_drive",
        "icloud",
        "onedrive",
        "sd_card",
      ],
      subscription_status: ["free", "premium"],
    },
  },
} as const
