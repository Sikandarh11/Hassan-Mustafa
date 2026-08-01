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
      certificates: {
        Row: {
          created_at: string
          id: string
          issuer: string | null
          issuer_color: string | null
          link: string | null
          name: string
          sort_order: number
          updated_at: string
          year: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          issuer?: string | null
          issuer_color?: string | null
          link?: string | null
          name: string
          sort_order?: number
          updated_at?: string
          year?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          issuer?: string | null
          issuer_color?: string | null
          link?: string | null
          name?: string
          sort_order?: number
          updated_at?: string
          year?: string | null
        }
        Relationships: []
      }
      experiences: {
        Row: {
          bullets: string[] | null
          company: string
          created_at: string
          date_end: string | null
          date_start: string | null
          id: string
          link: string | null
          location: string | null
          role: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          bullets?: string[] | null
          company: string
          created_at?: string
          date_end?: string | null
          date_start?: string | null
          id?: string
          link?: string | null
          location?: string | null
          role: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          bullets?: string[] | null
          company?: string
          created_at?: string
          date_end?: string | null
          date_start?: string | null
          id?: string
          link?: string | null
          location?: string | null
          role?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      hero_stats: {
        Row: {
          created_at: string
          icon_type: string | null
          id: string
          is_visible: boolean | null
          label: string
          sort_order: number
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          icon_type?: string | null
          id?: string
          is_visible?: boolean | null
          label: string
          sort_order?: number
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          icon_type?: string | null
          id?: string
          is_visible?: boolean | null
          label?: string
          sort_order?: number
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      profile: {
        Row: {
          about_text: string | null
          accent_color: string | null
          brand_initials: string | null
          brand_name: string | null
          created_at: string
          email: string | null
          github: string | null
          id: string
          linkedin: string | null
          meta_description: string | null
          name: string
          phone: string | null
          photo_url: string | null
          resume_url: string | null
          site_title: string | null
          tagline: string | null
          updated_at: string
          website: string | null
          whatsapp: string | null
        }
        Insert: {
          about_text?: string | null
          accent_color?: string | null
          brand_initials?: string | null
          brand_name?: string | null
          created_at?: string
          email?: string | null
          github?: string | null
          id?: string
          linkedin?: string | null
          meta_description?: string | null
          name?: string
          phone?: string | null
          photo_url?: string | null
          resume_url?: string | null
          site_title?: string | null
          tagline?: string | null
          updated_at?: string
          website?: string | null
          whatsapp?: string | null
        }
        Update: {
          about_text?: string | null
          accent_color?: string | null
          brand_initials?: string | null
          brand_name?: string | null
          created_at?: string
          email?: string | null
          github?: string | null
          id?: string
          linkedin?: string | null
          meta_description?: string | null
          name?: string
          phone?: string | null
          photo_url?: string | null
          resume_url?: string | null
          site_title?: string | null
          tagline?: string | null
          updated_at?: string
          website?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          alt_text: string | null
          created_at: string
          description: string | null
          flip_preview_text: string | null
          github_url: string | null
          id: string
          image_url: string | null
          is_private: boolean | null
          is_visible: boolean | null
          live_url: string | null
          sort_order: number
          tech_stack: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          description?: string | null
          flip_preview_text?: string | null
          github_url?: string | null
          id?: string
          image_url?: string | null
          is_private?: boolean | null
          is_visible?: boolean | null
          live_url?: string | null
          sort_order?: number
          tech_stack?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          description?: string | null
          flip_preview_text?: string | null
          github_url?: string | null
          id?: string
          image_url?: string | null
          is_private?: boolean | null
          is_visible?: boolean | null
          live_url?: string | null
          sort_order?: number
          tech_stack?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      research: {
        Row: {
          created_at: string
          description: string | null
          id: string
          link: string | null
          sort_order: number
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          link?: string | null
          sort_order?: number
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          link?: string | null
          sort_order?: number
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      skills: {
        Row: {
          category: string
          created_at: string
          id: string
          name: string
          sort_order: number
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          name: string
          sort_order?: number
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      team_members: {
        Row: {
          alt_text: string | null
          created_at: string
          email: string | null
          id: string
          linkedin_url: string | null
          name: string
          photo_url: string | null
          role: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          email?: string | null
          id?: string
          linkedin_url?: string | null
          name: string
          photo_url?: string | null
          role?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          email?: string | null
          id?: string
          linkedin_url?: string | null
          name?: string
          photo_url?: string | null
          role?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      typewriter_lines: {
        Row: {
          created_at: string
          id: string
          sort_order: number
          text: string
        }
        Insert: {
          created_at?: string
          id?: string
          sort_order?: number
          text: string
        }
        Update: {
          created_at?: string
          id?: string
          sort_order?: number
          text?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      upsert_project_with_order: {
        Args: {
          p_alt_text?: string
          p_description?: string
          p_flip_preview_text?: string
          p_github_url?: string
          p_id?: string
          p_image_url?: string
          p_is_private?: boolean
          p_is_visible?: boolean
          p_live_url?: string
          p_sort_order?: number
          p_tech_stack?: string[]
          p_title?: string
        }
        Returns: {
          alt_text: string | null
          created_at: string
          description: string | null
          flip_preview_text: string | null
          github_url: string | null
          id: string
          image_url: string | null
          is_private: boolean | null
          is_visible: boolean | null
          live_url: string | null
          sort_order: number
          tech_stack: string[] | null
          title: string
          updated_at: string
        }
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
