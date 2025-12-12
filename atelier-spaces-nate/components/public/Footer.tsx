import Link from 'next/link'
import { FiMail, FiPhone, FiMapPin, FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Atelier Spaces Nate</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              A research-led design studio working with form, systems, and cultural intelligence, rooted in African contexts.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/works" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Our Works
                </Link>
              </li>
              <li>
                <Link href="/team" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Our Team
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-gray-400 hover:text-white text-sm transition-colors">
                  News
                </Link>
              </li>
              <li>
                <Link href="/collaborate" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Collaborate
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Connect</h3>
            <div className="space-y-3">
              <a href="mailto:contact@atelierspacesnate.com" className="text-gray-400 hover:text-white text-sm transition-colors block">
                contact@atelierspacesnate.com
              </a>
              <div className="flex gap-4 pt-2">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Instagram">
                  <FiInstagram size={20} />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Twitter">
                  <FiTwitter size={20} />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="LinkedIn">
                  <FiLinkedin size={20} />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Facebook">
                  <FiFacebook size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-500 text-sm">
            © {currentYear} Atelier Spaces Nate. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
