import { redirect } from 'next/navigation'

export default function AdminPage() {
  // Redirect to dashboard - middleware will handle auth check
  redirect('/admin/dashboard')
}
