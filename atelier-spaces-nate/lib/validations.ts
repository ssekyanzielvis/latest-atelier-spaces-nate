import { z } from 'zod'

export const projectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().min(1, 'Description is required'),
  category_id: z.string().optional(),
  image: z.string().min(1, 'Main image is required'),
  client: z.string().optional(),
  location: z.string().optional(),
  year: z.number().optional(),
  area: z.number().optional(),
  status: z.string().optional(),
  featured: z.boolean().default(false),
  slug: z.string().min(1, 'Slug is required'),
  gallery_image_1: z.string().optional(),
  gallery_image_2: z.string().optional(),
  gallery_image_3: z.string().optional(),
  gallery_image_4: z.string().optional(),
})

export const newsSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().optional(),
  image: z.string().min(1, 'Image is required'),
  author: z.string().optional(),
  published_date: z.string().optional(),
  slug: z.string().min(1, 'Slug is required'),
  featured: z.boolean().default(false),
})

export const workSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().min(1, 'Description is required'),
  category_id: z.string().optional(),
  image: z.string().min(1, 'Main image is required'),
  client: z.string().optional(),
  year: z.number().optional(),
  featured: z.boolean().default(false),
  slug: z.string().min(1, 'Slug is required'),
  gallery_image_1: z.string().optional(),
  gallery_image_2: z.string().optional(),
  gallery_image_3: z.string().optional(),
  gallery_image_4: z.string().optional(),
})

export const teamMemberSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  position: z.string().min(1, 'Position is required').max(100),
  bio: z.string().optional(),
  image: z.string().min(1, 'Image is required'),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  linkedin: z.string().url().optional().or(z.literal('')),
  twitter: z.string().url().optional().or(z.literal('')),
  order_position: z.number().default(0),
  is_active: z.boolean().default(true),
})

export const heroSlideSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  subtitle: z.string().optional(),
  image: z.string().min(1, 'Image is required'),
  cta_text: z.string().optional(),
  cta_link: z.string().optional(),
  order_position: z.number().default(0),
  is_active: z.boolean().default(true),
})

export const collaborationSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  description: z.string().min(1, 'Description is required'),
  email: z.string().email('Invalid email address'),
  company: z.string().optional(),
  phone: z.string().optional(),
  project_type: z.string().optional(),
  budget: z.string().optional(),
  message: z.string().min(1, 'Message is required'),
})

export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
})
