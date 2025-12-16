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
      admins: {
        Row: {
          id: string
          username: string
          email: string
          password_hash: string
          full_name: string | null
          role: string
          is_active: boolean
          last_login: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          username: string
          email: string
          password_hash: string
          full_name?: string | null
          role?: string
          is_active?: boolean
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          email?: string
          password_hash?: string
          full_name?: string | null
          role?: string
          is_active?: boolean
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          slug: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          slug: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          slug?: string
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          title: string
          description: string
          category_id: string | null
          image: string
          client: string | null
          location: string | null
          year: number | null
          area: number | null
          status: string | null
          featured: boolean
          slug: string
          gallery_image_1: string | null
          gallery_image_2: string | null
          gallery_image_3: string | null
          gallery_image_4: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          category_id?: string | null
          image: string
          client?: string | null
          location?: string | null
          year?: number | null
          area?: number | null
          status?: string | null
          featured?: boolean
          slug: string
          gallery_image_1?: string | null
          gallery_image_2?: string | null
          gallery_image_3?: string | null
          gallery_image_4?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          category_id?: string | null
          image?: string
          client?: string | null
          location?: string | null
          year?: number | null
          area?: number | null
          status?: string | null
          featured?: boolean
          slug?: string
          gallery_image_1?: string | null
          gallery_image_2?: string | null
          gallery_image_3?: string | null
          gallery_image_4?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      news_articles: {
        Row: {
          id: string
          title: string
          content: string
          excerpt: string | null
          image: string
          author: string | null
          published_date: string
          slug: string
          featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          excerpt?: string | null
          image: string
          author?: string | null
          published_date?: string
          slug: string
          featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          excerpt?: string | null
          image?: string
          author?: string | null
          published_date?: string
          slug?: string
          featured?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      collaborations: {
        Row: {
          id: string
          name: string
          description: string
          email: string
          company: string | null
          phone: string | null
          project_type: string | null
          budget: string | null
          message: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          email: string
          company?: string | null
          phone?: string | null
          project_type?: string | null
          budget?: string | null
          message: string
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          email?: string
          company?: string | null
          phone?: string | null
          project_type?: string | null
          budget?: string | null
          message?: string
          status?: string
          created_at?: string
        }
      }
      hero_slides: {
        Row: {
          id: string
          title: string
          subtitle: string | null
          image: string
          cta_text: string | null
          cta_link: string | null
          order_position: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          subtitle?: string | null
          image: string
          cta_text?: string | null
          cta_link?: string | null
          order_position?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          subtitle?: string | null
          image?: string
          cta_text?: string | null
          cta_link?: string | null
          order_position?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      work_categories: {
        Row: {
          id: string
          name: string
          description: string | null
          slug: string
          cover_image: string | null
          order_position: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          slug: string
          cover_image?: string | null
          order_position?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          slug?: string
          cover_image?: string | null
          order_position?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      works: {
        Row: {
          id: string
          title: string
          description: string
          category_id: string | null
          image: string
          client: string | null
          year: number | null
          featured: boolean
          slug: string
          gallery_image_1: string | null
          gallery_image_2: string | null
          gallery_image_3: string | null
          gallery_image_4: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          category_id?: string | null
          image: string
          client?: string | null
          year?: number | null
          featured?: boolean
          slug: string
          gallery_image_1?: string | null
          gallery_image_2?: string | null
          gallery_image_3?: string | null
          gallery_image_4?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          category_id?: string | null
          image?: string
          client?: string | null
          year?: number | null
          featured?: boolean
          slug?: string
          gallery_image_1?: string | null
          gallery_image_2?: string | null
          gallery_image_3?: string | null
          gallery_image_4?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      team_members: {
        Row: {
          id: string
          name: string
          position: string
          bio: string | null
          image: string
          email: string | null
          phone: string | null
          linkedin: string | null
          twitter: string | null
          order_position: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          position: string
          bio?: string | null
          image: string
          email?: string | null
          phone?: string | null
          linkedin?: string | null
          twitter?: string | null
          order_position?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          position?: string
          bio?: string | null
          image?: string
          email?: string | null
          phone?: string | null
          linkedin?: string | null
          twitter?: string | null
          order_position?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      about_section: {
        Row: {
          id: string
          title: string
          content: string
          mission: string | null
          vision: string | null
          values: string | null
          image: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          mission?: string | null
          vision?: string | null
          values?: string | null
          image?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          mission?: string | null
          vision?: string | null
          values?: string | null
          image?: string | null
          updated_at?: string
        }
      }
      about_media: {
        Row: {
          id: string
          title: string
          caption: string
          file_url: string
          file_type: 'image' | 'video'
          order_position: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          caption: string
          file_url: string
          file_type: 'image' | 'video'
          order_position?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          caption?: string
          file_url?: string
          file_type?: 'image' | 'video'
          order_position?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      slogan_section: {
        Row: {
          id: string
          main_slogan: string
          sub_slogan: string | null
          background_image: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          main_slogan: string
          sub_slogan?: string | null
          background_image?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          main_slogan?: string
          sub_slogan?: string | null
          background_image?: string | null
          updated_at?: string
        }
      }
    }
  }
}
