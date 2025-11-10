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
      availability: {
        Row: {
          created_at: string | null
          day_of_week: number
          end_time: string
          id: string
          sitter_id: string
          start_time: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          day_of_week: number
          end_time: string
          id?: string
          sitter_id: string
          start_time: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          day_of_week?: number
          end_time?: string
          id?: string
          sitter_id?: string
          start_time?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "availability_sitter_id_fkey"
            columns: ["sitter_id"]
            isOneToOne: false
            referencedRelation: "owner_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "availability_sitter_id_fkey"
            columns: ["sitter_id"]
            isOneToOne: false
            referencedRelation: "sitter_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "availability_sitter_id_fkey"
            columns: ["sitter_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "availability_sitter_id_fkey"
            columns: ["sitter_id"]
            isOneToOne: false
            referencedRelation: "walkers"
            referencedColumns: ["user_id"]
          },
        ]
      }
      booking_reports: {
        Row: {
          bathroom_breaks: number | null
          behavior_notes: string | null
          booking_id: string
          created_at: string | null
          distance_km: number | null
          duration_minutes: number | null
          id: string
          incidents: string | null
          report_text: string
          treats_given: boolean | null
          updated_at: string | null
          water_provided: boolean | null
        }
        Insert: {
          bathroom_breaks?: number | null
          behavior_notes?: string | null
          booking_id: string
          created_at?: string | null
          distance_km?: number | null
          duration_minutes?: number | null
          id?: string
          incidents?: string | null
          report_text: string
          treats_given?: boolean | null
          updated_at?: string | null
          water_provided?: boolean | null
        }
        Update: {
          bathroom_breaks?: number | null
          behavior_notes?: string | null
          booking_id?: string
          created_at?: string | null
          distance_km?: number | null
          duration_minutes?: number | null
          id?: string
          incidents?: string | null
          report_text?: string
          treats_given?: boolean | null
          updated_at?: string | null
          water_provided?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_reports_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          additional_price: number | null
          additional_services: string[] | null
          base_price: number
          booking_number: string
          created_at: string | null
          duration: number
          end_date: string
          id: string
          notes: string | null
          owner_id: string
          payment_status: string
          pet_id: string
          service_type: string
          sitter_id: string
          start_date: string
          status: string
          total_price: number
          updated_at: string | null
        }
        Insert: {
          additional_price?: number | null
          additional_services?: string[] | null
          base_price: number
          booking_number: string
          created_at?: string | null
          duration: number
          end_date: string
          id?: string
          notes?: string | null
          owner_id: string
          payment_status?: string
          pet_id: string
          service_type: string
          sitter_id: string
          start_date: string
          status?: string
          total_price: number
          updated_at?: string | null
        }
        Update: {
          additional_price?: number | null
          additional_services?: string[] | null
          base_price?: number
          booking_number?: string
          created_at?: string | null
          duration?: number
          end_date?: string
          id?: string
          notes?: string | null
          owner_id?: string
          payment_status?: string
          pet_id?: string
          service_type?: string
          sitter_id?: string
          start_date?: string
          status?: string
          total_price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "owner_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "sitter_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "walkers"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "bookings_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_sitter_id_fkey"
            columns: ["sitter_id"]
            isOneToOne: false
            referencedRelation: "owner_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_sitter_id_fkey"
            columns: ["sitter_id"]
            isOneToOne: false
            referencedRelation: "sitter_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_sitter_id_fkey"
            columns: ["sitter_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_sitter_id_fkey"
            columns: ["sitter_id"]
            isOneToOne: false
            referencedRelation: "walkers"
            referencedColumns: ["user_id"]
          },
        ]
      }
      documents: {
        Row: {
          created_at: string | null
          id: string
          status: string
          type: string
          updated_at: string | null
          url: string
          user_id: string
          verified_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          status?: string
          type: string
          updated_at?: string | null
          url: string
          user_id: string
          verified_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          status?: string
          type?: string
          updated_at?: string | null
          url?: string
          user_id?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "owner_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "sitter_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "walkers"
            referencedColumns: ["user_id"]
          },
        ]
      }
      earnings: {
        Row: {
          amount: number
          booking_id: string | null
          created_at: string | null
          description: string | null
          id: string
          sitter_id: string
          status: string
          type: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          booking_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          sitter_id: string
          status?: string
          type: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          booking_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          sitter_id?: string
          status?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "earnings_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "earnings_sitter_id_fkey"
            columns: ["sitter_id"]
            isOneToOne: false
            referencedRelation: "owner_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "earnings_sitter_id_fkey"
            columns: ["sitter_id"]
            isOneToOne: false
            referencedRelation: "sitter_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "earnings_sitter_id_fkey"
            columns: ["sitter_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "earnings_sitter_id_fkey"
            columns: ["sitter_id"]
            isOneToOne: false
            referencedRelation: "walkers"
            referencedColumns: ["user_id"]
          },
        ]
      }
      messages: {
        Row: {
          attachment_url: string | null
          content: string
          created_at: string | null
          id: string
          is_read: boolean | null
          recipient_id: string
          sender_id: string
        }
        Insert: {
          attachment_url?: string | null
          content: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          recipient_id: string
          sender_id: string
        }
        Update: {
          attachment_url?: string | null
          content?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          recipient_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "owner_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "sitter_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "walkers"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "owner_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "sitter_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "walkers"
            referencedColumns: ["user_id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          description: string
          id: string
          is_read: boolean | null
          link: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          is_read?: boolean | null
          link?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          is_read?: boolean | null
          link?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "owner_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "sitter_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "walkers"
            referencedColumns: ["user_id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          booking_id: string
          created_at: string | null
          id: string
          paid_at: string | null
          payment_method: string
          status: string
          transaction_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          booking_id: string
          created_at?: string | null
          id?: string
          paid_at?: string | null
          payment_method: string
          status?: string
          transaction_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          booking_id?: string
          created_at?: string | null
          id?: string
          paid_at?: string | null
          payment_method?: string
          status?: string
          transaction_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      pets: {
        Row: {
          age: number | null
          allergies: string[] | null
          bio: string | null
          breed: string | null
          created_at: string | null
          dietary_needs: string | null
          exercise_level: string | null
          id: string
          last_vet_visit: string | null
          medical_history: string | null
          name: string
          owner_id: string
          photo_url: string | null
          special_needs: string | null
          temperament: string | null
          type: string
          updated_at: string | null
          vaccinations: string[] | null
          vet_name: string | null
          vet_phone: string | null
          weight: number | null
        }
        Insert: {
          age?: number | null
          allergies?: string[] | null
          bio?: string | null
          breed?: string | null
          created_at?: string | null
          dietary_needs?: string | null
          exercise_level?: string | null
          id?: string
          last_vet_visit?: string | null
          medical_history?: string | null
          name: string
          owner_id: string
          photo_url?: string | null
          special_needs?: string | null
          temperament?: string | null
          type: string
          updated_at?: string | null
          vaccinations?: string[] | null
          vet_name?: string | null
          vet_phone?: string | null
          weight?: number | null
        }
        Update: {
          age?: number | null
          allergies?: string[] | null
          bio?: string | null
          breed?: string | null
          created_at?: string | null
          dietary_needs?: string | null
          exercise_level?: string | null
          id?: string
          last_vet_visit?: string | null
          medical_history?: string | null
          name?: string
          owner_id?: string
          photo_url?: string | null
          special_needs?: string | null
          temperament?: string | null
          type?: string
          updated_at?: string | null
          vaccinations?: string[] | null
          vet_name?: string | null
          vet_phone?: string | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pets_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "owner_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pets_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "sitter_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pets_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pets_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "walkers"
            referencedColumns: ["user_id"]
          },
        ]
      }
      reviews: {
        Row: {
          author_id: string
          booking_id: string
          comment: string
          created_at: string | null
          id: string
          is_verified: boolean | null
          photo_urls: string[] | null
          rating: number
          sitter_id: string
          updated_at: string | null
        }
        Insert: {
          author_id: string
          booking_id: string
          comment: string
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          photo_urls?: string[] | null
          rating: number
          sitter_id: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string
          booking_id?: string
          comment?: string
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          photo_urls?: string[] | null
          rating?: number
          sitter_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "owner_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "sitter_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "walkers"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_sitter_id_fkey"
            columns: ["sitter_id"]
            isOneToOne: false
            referencedRelation: "owner_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_sitter_id_fkey"
            columns: ["sitter_id"]
            isOneToOne: false
            referencedRelation: "sitter_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_sitter_id_fkey"
            columns: ["sitter_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_sitter_id_fkey"
            columns: ["sitter_id"]
            isOneToOne: false
            referencedRelation: "walkers"
            referencedColumns: ["user_id"]
          },
        ]
      }
      service_photos: {
        Row: {
          booking_id: string
          caption: string | null
          created_at: string | null
          id: string
          sent: boolean | null
          url: string
        }
        Insert: {
          booking_id: string
          caption?: string | null
          created_at?: string | null
          id?: string
          sent?: boolean | null
          url: string
        }
        Update: {
          booking_id?: string
          caption?: string | null
          created_at?: string | null
          id?: string
          sent?: boolean | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_photos_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          average_rating: number | null
          background_checked: boolean | null
          bio: string | null
          created_at: string | null
          email: string
          first_name: string
          id: string
          is_verified: boolean | null
          last_name: string
          location: string | null
          phone: string | null
          role: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          average_rating?: number | null
          background_checked?: boolean | null
          bio?: string | null
          created_at?: string | null
          email: string
          first_name: string
          id?: string
          is_verified?: boolean | null
          last_name: string
          location?: string | null
          phone?: string | null
          role: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          average_rating?: number | null
          background_checked?: boolean | null
          bio?: string | null
          created_at?: string | null
          email?: string
          first_name?: string
          id?: string
          is_verified?: boolean | null
          last_name?: string
          location?: string | null
          phone?: string | null
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      booking_media: {
        Row: {
          booking_id: string | null
          caption: string | null
          created_at: string | null
          id: string | null
          media_type: string | null
          media_url: string | null
          sent: boolean | null
        }
        Insert: {
          booking_id?: string | null
          caption?: string | null
          created_at?: string | null
          id?: string | null
          media_type?: never
          media_url?: string | null
          sent?: boolean | null
        }
        Update: {
          booking_id?: string | null
          caption?: string | null
          created_at?: string | null
          id?: string | null
          media_type?: never
          media_url?: string | null
          sent?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "service_photos_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      owner_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          first_name: string | null
          id: string | null
          last_name: string | null
          location: string | null
          role: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          first_name?: string | null
          id?: string | null
          last_name?: string | null
          location?: string | null
          role?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          first_name?: string | null
          id?: string | null
          last_name?: string | null
          location?: string | null
          role?: string | null
        }
        Relationships: []
      }
      sitter_profiles: {
        Row: {
          avatar_url: string | null
          average_rating: number | null
          background_checked: boolean | null
          bio: string | null
          created_at: string | null
          first_name: string | null
          id: string | null
          is_verified: boolean | null
          last_name: string | null
          location: string | null
          role: string | null
        }
        Insert: {
          avatar_url?: string | null
          average_rating?: number | null
          background_checked?: boolean | null
          bio?: string | null
          created_at?: string | null
          first_name?: string | null
          id?: string | null
          is_verified?: boolean | null
          last_name?: string | null
          location?: string | null
          role?: string | null
        }
        Update: {
          avatar_url?: string | null
          average_rating?: number | null
          background_checked?: boolean | null
          bio?: string | null
          created_at?: string | null
          first_name?: string | null
          id?: string | null
          is_verified?: boolean | null
          last_name?: string | null
          location?: string | null
          role?: string | null
        }
        Relationships: []
      }
      user_documents: {
        Row: {
          document_type: string | null
          document_url: string | null
          id: string | null
          updated_at: string | null
          uploaded_at: string | null
          user_id: string | null
          verified: boolean | null
          verified_at: string | null
        }
        Insert: {
          document_type?: string | null
          document_url?: string | null
          id?: string | null
          updated_at?: string | null
          uploaded_at?: string | null
          user_id?: string | null
          verified?: never
          verified_at?: string | null
        }
        Update: {
          document_type?: string | null
          document_url?: string | null
          id?: string | null
          updated_at?: string | null
          uploaded_at?: string | null
          user_id?: string | null
          verified?: never
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "owner_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "sitter_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "walkers"
            referencedColumns: ["user_id"]
          },
        ]
      }
      walkers: {
        Row: {
          avatar_url: string | null
          background_checked: boolean | null
          bio: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          hourly_rate: number | null
          is_active: boolean | null
          is_verified: boolean | null
          last_name: string | null
          location: string | null
          phone: string | null
          rating: number | null
          total_reviews: number | null
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          background_checked?: boolean | null
          bio?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          hourly_rate?: never
          is_active?: never
          is_verified?: boolean | null
          last_name?: string | null
          location?: string | null
          phone?: string | null
          rating?: number | null
          total_reviews?: never
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          background_checked?: boolean | null
          bio?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          hourly_rate?: never
          is_active?: never
          is_verified?: boolean | null
          last_name?: string | null
          location?: string | null
          phone?: string | null
          rating?: number | null
          total_reviews?: never
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_public_profiles: {
        Args: never
        Returns: {
          avatar_url: string
          average_rating: number
          background_checked: boolean
          bio: string
          created_at: string
          first_name: string
          id: string
          is_verified: boolean
          last_name: string
          location: string
          role: string
        }[]
      }
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
