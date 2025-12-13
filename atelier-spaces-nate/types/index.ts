import { Database } from './database'

export type Admin = Database['public']['Tables']['admins']['Row']
export type AdminInsert = Database['public']['Tables']['admins']['Insert']
export type AdminUpdate = Database['public']['Tables']['admins']['Update']

export type Project = Database['public']['Tables']['projects']['Row']
export type ProjectInsert = Database['public']['Tables']['projects']['Insert']
export type ProjectUpdate = Database['public']['Tables']['projects']['Update']

export type NewsArticle = Database['public']['Tables']['news_articles']['Row']
export type NewsArticleInsert = Database['public']['Tables']['news_articles']['Insert']
export type NewsArticleUpdate = Database['public']['Tables']['news_articles']['Update']

export type Work = Database['public']['Tables']['works']['Row']
export type WorkInsert = Database['public']['Tables']['works']['Insert']
export type WorkUpdate = Database['public']['Tables']['works']['Update']

export type TeamMember = Database['public']['Tables']['team_members']['Row']
export type TeamMemberInsert = Database['public']['Tables']['team_members']['Insert']
export type TeamMemberUpdate = Database['public']['Tables']['team_members']['Update']

export type HeroSlide = Database['public']['Tables']['hero_slides']['Row']
export type HeroSlideInsert = Database['public']['Tables']['hero_slides']['Insert']
export type HeroSlideUpdate = Database['public']['Tables']['hero_slides']['Update']

export type Category = Database['public']['Tables']['categories']['Row']
export type WorkCategory = Database['public']['Tables']['work_categories']['Row']

export type Collaboration = Database['public']['Tables']['collaborations']['Row']
export type CollaborationInsert = Database['public']['Tables']['collaborations']['Insert']

export type AboutSection = Database['public']['Tables']['about_section']['Row']
export type SloganSection = Database['public']['Tables']['slogan_section']['Row']
