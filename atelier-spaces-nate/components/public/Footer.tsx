import Link from 'next/link'
import { FiMail, FiPhone, FiMapPin, FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-black text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Atelier Spaces Nate</h3>
            <p className="text-white text-sm leading-relaxed">
              Atelier Spaces Nate is a multi disciplinary design studio working with form, systems, and cultural intelligence. Our work spans object design, spatial thinking, game systems, and speculative futures rooted in African context. 
            </p>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wide">Explore</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/" className="text-white hover:text-gray-300 text-sm transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/works" className="text-white hover:text-gray-300 text-sm transition-colors">
                  Works
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-white hover:text-gray-300 text-sm transition-colors">
            ANS Studio
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-white hover:text-gray-300 text-sm transition-colors">
                  News
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wide">Company</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/#about" className="text-white hover:text-gray-300 text-sm transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/team" className="text-white hover:text-gray-300 text-sm transition-colors">
                  Team
                </Link>
              </li>
              <li>
                <Link href="/collaborate" className="text-white hover:text-gray-300 text-sm transition-colors">
                  Collaborate
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white hover:text-gray-300 text-sm transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wide">Connect</h4>
            <div className="space-y-2">
              <div className="flex items-start gap-2 text-white text-sm">
                <FiMapPin className="mt-0.5 flex-shrink-0" size={16} />
                <span>Kampala, Uganda</span>
              </div>
              <div className="flex items-center gap-2 text-white text-sm">
                <FiPhone className="flex-shrink-0" size={16} />
                <a href="tel:+256770669746" className="hover:text-gray-300 transition-colors">
                  +256-770669746
                </a>
              </div>
              <div className="flex items-start gap-2 text-white text-sm">
                <FiMail className="mt-0.5 flex-shrink-0" size={16} />
                <div className="flex flex-col">
                  <a href="mailto:contact@atelierspacenate.com" className="hover:text-gray-300 transition-colors">
                    contact@atelierspacenate.com
                  </a>
                  <a href="mailto:atelierspacesnate@gmail.com" className="hover:text-gray-300 transition-colors">
                    atelierspacesnate@gmail.com
                  </a>
                </div>
              </div>
            </div>
            <div className="flex gap-4 pt-3">
              <a href="https://instagram.com/natespaces.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors" aria-label="Instagram">
                <FiInstagram size={18} />
              </a>
              <a href="https://twitter.com/natespaces.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors" aria-label="Twitter">
                <FiTwitter size={18} />
              </a>
              <a href="https://tiktok.com/@natespaces.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors" aria-label="TikTok">
                <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white text-xs">
              © {currentYear} Atelier Spaces Nate. All rights reserved.
            </p>
            <div className="flex gap-6 text-xs text-white">
              <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
