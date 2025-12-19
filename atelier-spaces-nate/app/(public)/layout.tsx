import Header from '@/components/public/Header'
import Footer from '@/components/public/Footer'
import AnalyticsTracker from '@/components/AnalyticsTracker'
import ToastNotifications from '@/components/ToastNotifications'
import '../globals.css'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <ToastNotifications />
      <AnalyticsTracker />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
