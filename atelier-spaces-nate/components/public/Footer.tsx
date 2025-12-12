import Link from 'next/link'
import { FiMail, FiPhone, FiMapPin, FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-foreground text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">ATELIER</h3>
            <p className="text-white/80 text-sm">
              Creating innovative architectural solutions that transform spaces and inspire communities.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/projects" className="text-white/80 hover:text-white text-sm transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/works" className="text-white/80 hover:text-white text-sm transition-colors">
                  Works
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-white/80 hover:text-white text-sm transition-colors">
                  News
                </Link>
              </li>
              <li>
                <Link href="/team" className="text-white/80 hover:text-white text-sm transition-colors">
                  Team
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <FiMapPin className="mt-1 flex-shrink-0" size={16} />
                <span className="text-white/80 text-sm">123 Architecture Street, City</span>
              </li>
              <li className="flex items-center gap-2">
                <FiPhone size={16} />
                <span className="text-white/80 text-sm">+1 234 567 890</span>
              </li>
              <li className="flex items-center gap-2">
                <FiMail size={16} />
                <span className="text-white/80 text-sm">info@atelier.com</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex gap-4">
              <a href="#" className="text-white/80 hover:text-white transition-colors" aria-label="Facebook">
                <FiFacebook size={20} />
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors" aria-label="Twitter">
                <FiTwitter size={20} />
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors" aria-label="Instagram">
                <FiInstagram size={20} />
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors" aria-label="LinkedIn">
                <FiLinkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/20 text-center">
          <p className="text-white/60 text-sm">
            © {currentYear} Atelier Spaces. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
