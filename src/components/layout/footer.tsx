import Link from "next/link"
import { Heart, Shield, Users, TrendingUp } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/80 backdrop-blur mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Shurokkha</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Transparent, AI-powered donation platform connecting donors with verified providers and beneficiaries
              across Bangladesh.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h3 className="font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/crises" className="text-muted-foreground hover:text-foreground transition-colors">
                  Active Crises
                </Link>
              </li>
              <li>
                <Link href="/providers" className="text-muted-foreground hover:text-foreground transition-colors">
                  Verified Providers
                </Link>
              </li>
            </ul>
          </div>

          {/* For Users */}
          <div>
            <h3 className="font-semibold mb-4">For Users</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/auth/login?role=donor"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Donor Portal
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/login?role=provider"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Provider Portal
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/login?role=beneficiary"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Beneficiary Portal
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/login?role=admin"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Security */}
          <div>
            <h3 className="font-semibold mb-4">Trust & Security</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Shield className="w-4 h-4 text-green-600" />
                <span>AI Fraud Detection</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Users className="w-4 h-4 text-blue-600" />
                <span>Verified Providers</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span>Real-time Tracking</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">© 2025 Shurokkha Platform. All rights reserved.</p>
          <div className="flex gap-6 text-sm">
            <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
