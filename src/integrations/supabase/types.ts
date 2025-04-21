export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      contact_click_logs: {
        Row: {
          click_type: string
          created_at: string | null
          id: string
          instructor_id: string | null
        }
        Insert: {
          click_type: string
          created_at?: string | null
          id?: string
          instructor_id?: string | null
        }
        Update: {
          click_type?: string
          created_at?: string | null
          id?: string
          instructor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_click_logs_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "instructors"
            referencedColumns: ["id"]
          },
        ]
      }
      instructor_stats: {
        Row: {
          contact_clicks: number | null
          created_at: string | null
          id: string
          instructor_id: string | null
          profile_views: number | null
          updated_at: string | null
        }
        Insert: {
          contact_clicks?: number | null
          created_at?: string | null
          id?: string
          instructor_id?: string | null
          profile_views?: number | null
          updated_at?: string | null
        }
        Update: {
          contact_clicks?: number | null
          created_at?: string | null
          id?: string
          instructor_id?: string | null
          profile_views?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "instructor_stats_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "instructors"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_users: {
        Row: {
          id: string;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['admin_users']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['admin_users']['Insert']>;
      }
      instructors: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string;
          website: string;
          experience: number;
          specialization: string;
          location: string;
          bio: string;
          additional_bio: string;
          tagline: string;
          user_id: string | null;
          latitude: number | null;
          longitude: number | null;
          status: 'pending' | 'approved' | 'rejected';
          is_approved: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['instructors']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['instructors']['Insert']>;
      }
      instructor_specializations: {
        Row: {
          id: string;
          instructor_id: string;
          specialization: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['instructor_specializations']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['instructor_specializations']['Insert']>;
      }
      instructor_services: {
        Row: {
          id: string;
          instructor_id: string;
          title: string;
          description: string;
          price: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['instructor_services']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['instructor_services']['Insert']>;
      }
      instructor_faqs: {
        Row: {
          id: string;
          instructor_id: string;
          question: string;
          answer: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['instructor_faqs']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['instructor_faqs']['Insert']>;
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_average_rating: {
        Args: { instructor_uuid: string }
        Returns: number
      }
      increment: {
        Args: { row_id: string; column_name: string }
        Returns: number
      }
      increment_contact_clicks: {
        Args: { instructor_uuid: string; click_type: string }
        Returns: undefined
      }
      increment_profile_views: {
        Args: { instructor_uuid: string }
        Returns: undefined
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
    Enums: {},
  },
} as const

export interface Instructor {
  id: string;
  name: string;
  email: string;
  experience: number;
  specialization: string;
  location: string;
  bio: string | null;
  contact_info: any | null;
  certifications: string[] | null;
  highlights: any | null;
  faqs: any | null;
  is_approved: boolean | null;
  created_at: string;
  updated_at: string;
  user_id: string | null;
  additional_bio: string | null;
}

export interface InstructorInsert extends Omit<Instructor, 'id' | 'created_at' | 'updated_at'> {
  id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface InstructorUpdate extends Partial<InstructorInsert> {
  id: string;
}
