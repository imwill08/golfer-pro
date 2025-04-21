export interface Database {
  public: {
    Tables: {
      instructors: {
        Row: {
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
          is_approved: boolean;
          created_at: string;
          updated_at: string;
          user_id: string | null;
          additional_bio: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          experience: number;
          specialization: string;
          location: string;
          bio?: string | null;
          contact_info?: any | null;
          certifications?: string[] | null;
          highlights?: any | null;
          faqs?: any | null;
          is_approved?: boolean;
          created_at?: string;
          updated_at?: string;
          user_id?: string | null;
          additional_bio?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          experience?: number;
          specialization?: string;
          location?: string;
          bio?: string | null;
          contact_info?: any | null;
          certifications?: string[] | null;
          highlights?: any | null;
          faqs?: any | null;
          is_approved?: boolean;
          created_at?: string;
          updated_at?: string;
          user_id?: string | null;
          additional_bio?: string | null;
        };
      };
      instructor_stats: {
        Row: {
          id: string;
          instructor_id: string;
          profile_views: number;
          contact_clicks: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          instructor_id: string;
          profile_views?: number;
          contact_clicks?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          instructor_id?: string;
          profile_views?: number;
          contact_clicks?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      contact_click_logs: {
        Row: {
          id: string;
          instructor_id: string;
          click_type: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          instructor_id: string;
          click_type: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          instructor_id?: string;
          click_type?: string;
          created_at?: string;
        };
      };
    };
  };
} 