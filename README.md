# 🤝 Shurokkha - AI-Powered Transparent Donation Platform

**Donate with Confidence. Track with Precision. Impact with Certainty.**

Shurokkha is a revolutionary donation platform that uses triple-layer AI verification to connect donors with verified providers, ensuring every taka reaches genuine crisis-affected people in Bangladesh with complete transparency and accountability.

> **Built for**: Solvio Hackathon by AlphaVerse-BUET  
> **Repository**: [AlphaVerse-BUET/Shurokkha](https://github.com/AlphaVerse-BUET/Shurokkha)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#-key-features)
- [Technology Stack](#️-technology-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [AI Features](#-ai-features-implemented)
- [User Roles & Portals](#-user-roles--portals)
- [Core Workflows](#-core-workflows)
- [Development Guide](#-development-guide)
- [Deployment](#-deployment)
- [Documentation](#-documentation)
- [Contributing](#-contributing)

---

## Overview

Shurokkha addresses the trust crisis in traditional charitable aid by implementing:

- **Triple-Layer AI Verification**: Document verification, fraud detection, and behavioral analysis
- **100% Transparency**: GPS-tagged photos, real-time tracking, complete audit trail
- **Smart Matching**: AI-powered donor-provider-beneficiary matching with weighted scoring
- **Trust Score System**: Dynamic 0-100 scoring based on 5 performance factors
- **Real-Time Analytics**: Live dashboards, heatmaps, and predictive risk analysis

### Platform Metrics (Mock Data)

- **<1% Fraud Rate** (vs 20-30% traditional)
- **5-7 Days** average delivery (vs 45 days traditional)
- **100% Transparency** with real-time tracking
- **85% Donor Retention** (vs 40% traditional)

---

## 🌟 Key Features

### For Donors 💰

- **Smart Donation Recommender**: AI-powered crisis recommendations with match scores
- **Impact Prediction**: See predicted impact before donating
- **Portfolio Analyzer**: Track your donor personality and impact score
- **Real-Time Tracking**: GPS-tagged distribution proofs
- **Fund Recovery**: Withdraw unused funds anytime with money-back guarantee
- **Tax Receipts**: Downloadable PDF receipts for tax purposes
- **Interactive Impact Map**: Visualize donations across Bangladesh

### For Providers (NGOs) 🏢

- **Trust Score System**: 0-100 score based on completion rate, rating, response time, fraud record, and longevity
- **Performance Optimizer**: AI coach with personalized improvement tips
- **Smart Matching Pool**: Receive matched donations based on specialization
- **Beneficiary Management**: Upload and verify beneficiary lists with AI
- **Distribution Verification**: GPS-tagged photos, face matching, SMS confirmations
- **Analytics Dashboard**: Comprehensive performance reports

### For Beneficiaries 🙏

- **Direct Application**: Apply for aid without middlemen
- **Profile Creation**: Multi-step profile setup with document verification
- **Privacy Controls**: Choose information visibility (anonymous, limited, full)
- **Status Tracking**: Real-time updates on application and distribution
- **Provider Matching**: AI matches you with suitable providers
- **SMS Confirmations**: Direct verification of distribution

### For Admins 🔐

- **Crisis Risk Analyzer**: Predictive analytics for next 30/60/90 days
- **Fraud Detection Center**: Real-time suspicious pattern detection
- **Crisis Management**: Create and manage crises manually or via AI detection
- **Provider Verification**: Monitor and verify all providers
- **Financial Command Center**: Real-time platform-wide metrics
- **Evidence Upload**: Image/video uploads with preview for crisis creation

---

## 🏗️ Technology Stack

### Frontend

- **Next.js 16.0.0** with App Router (React Server Components)
- **React 19.2.0** with latest hooks and patterns
- **TypeScript 5+** with strict mode enabled
- **Tailwind CSS 4.1.9** with custom design tokens
- **shadcn/ui** component library (Radix UI primitives)
- **Recharts** for data visualization
- **Lucide React** for icons

### State Management

- **Zustand** with persist middleware for global state
- **React Hook Form** with Zod validation
- **Mock Data** system ready for backend integration

### Development Tools

- **pnpm** as package manager
- **ESLint** for code quality
- **Playwright MCP** for visual testing and automation
- **Vercel Analytics** for production monitoring

### AI/ML Implementation (Mock)

All AI features implemented with realistic mock behavior:

- Document verification simulation (`src/lib/ai-engines.ts`)
- Fraud detection patterns (`src/lib/ai-verification.ts`)
- Smart matching algorithms (`src/lib/provider-matching.ts`, `src/lib/ai-matching.ts`)
- Trust score calculation (exact formula implementation)
- Impact prediction models

---

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** (LTS recommended)
- **pnpm** (uses `pnpm-lock.yaml`)

### Installation

```bash
# Clone the repository
git clone https://github.com/AlphaVerse-BUET/Shurokkha.git
cd Shurokkha

# Install dependencies
pnpm install

# Run development server
pnpm dev

# Open http://localhost:3000
```

### Build for Production

```bash
# Create optimized production build
pnpm build

# Start production server
pnpm start
```

### Demo Accounts (Mock Authentication)

**Donor:**

- Navigate to `/auth/login?role=donor`
- Any email/password combination works

**Provider:**

- Navigate to `/auth/login?role=provider`
- Any credentials work (mock auth)

**Beneficiary:**

- Navigate to `/auth/login?role=beneficiary`
- Mock authentication enabled

**Admin:**

- Navigate to `/auth/login?role=admin`
- Full platform access with mock credentials

**Guest:**

- Browse public pages without login
- Access `/crises` page

---

## 📁 Project Structure

```
Shurokkha/
├── app/                          # Next.js App Router pages
│   ├── admin/                    # Admin portal
│   │   ├── analytics/           # Risk analyzer, fraud detection
│   │   ├── create-crisis/       # Crisis creation with media upload
│   │   └── crisis/              # Crisis management
│   ├── auth/                     # Login/signup pages
│   │   ├── login/               # Role-based login
│   │   └── signup/              # Registration flow
│   ├── beneficiary/              # Beneficiary portal
│   │   ├── profile/create/      # Multi-step profile creation
│   │   ├── providers/           # Provider matching
│   │   └── preferences/         # Privacy controls
│   ├── crises/                   # Public crisis listing (with Suspense)
│   ├── dashboard/                # Unified role-based dashboard
│   ├── donor/                    # Donor portal
│   │   ├── donate/              # Smart donation recommender
│   │   ├── impact-map/          # Interactive Bangladesh map
│   │   └── profile/             # Portfolio analyzer
│   ├── impact-map/               # Public impact visualization
│   ├── provider/                 # Provider portal
│   │   ├── analytics/           # Performance optimizer
│   │   ├── matching/            # Matching pool
│   │   └── performance/         # Trust score breakdown
│   ├── globals.css               # Tailwind config with custom animations
│   ├── layout.tsx                # Root layout with providers
│   └── page.tsx                  # Landing page with heatmap
│
├── src/
│   ├── components/
│   │   ├── admin/               # Admin-specific components
│   │   ├── ai-chatbot/          # AI assistant (separate module)
│   │   ├── ai-features/         # 5 main AI feature components
│   │   │   ├── donation-recommender/
│   │   │   ├── crisis-risk-analyzer/
│   │   │   ├── donor-portfolio-analyzer/
│   │   │   ├── provider-performance-optimizer/
│   │   │   └── needs-heatmap/
│   │   ├── beneficiary/         # Beneficiary components
│   │   ├── donor/               # Donor components
│   │   ├── homepage/            # Landing page sections
│   │   │   ├── digital-trust-narrative.tsx
│   │   │   ├── trust-score-simulator.tsx
│   │   │   ├── live-fraud-detection.tsx
│   │   │   └── impact-metrics-dashboard.tsx
│   │   ├── layout/              # Navbar, footer
│   │   ├── portals/             # Role-specific dashboards
│   │   │   ├── admin-dashboard.tsx
│   │   │   ├── beneficiary-dashboard.tsx
│   │   │   ├── donor-dashboard.tsx
│   │   │   └── provider-dashboard.tsx
│   │   ├── provider/            # Provider components
│   │   ├── shared/              # Reusable components
│   │   └── ui/                  # shadcn/ui primitives (50+ components)
│   │
│   ├── contexts/
│   │   └── currency-context.tsx # Currency formatting context
│   │
│   ├── lib/
│   │   ├── ai-engines.ts        # Core AI mock implementations
│   │   ├── ai-matching.ts       # Smart matching algorithm
│   │   ├── ai-verification.ts   # Document & fraud verification
│   │   ├── provider-matching.ts # Provider suggestion engine
│   │   ├── currency-formatter.ts
│   │   └── utils.ts             # Utility functions
│   │
│   ├── store/
│   │   ├── app-store.ts         # Zustand global state (auth, role)
│   │   └── mock-data.ts         # Comprehensive mock data
│   │                             # (crises, users, donations, providers)
│   └── types/
│       └── index.ts              # TypeScript type definitions
│                                 # (Crisis, User, Donation, Provider, etc.)
│
├── components/                   # Shared root-level components
│   ├── bangladesh-map.tsx        # Interactive division map
│   ├── beneficiary-card.tsx
│   └── theme-provider.tsx
│
├── public/                       # Static assets
│   └── *.png, *.jpg             # Images, placeholders
│
├── Documentation/
│   ├── AI_FEATURES_INTEGRATION_COMPLETE.md
│   ├── PLATFORM_FEATURES.md
│   ├── TESTING_GUIDE.md
│   ├── VISUAL_DEBUG_GUIDE.md
│   └── WHERE_TO_FIND_AI_FEATURES.md
│
├── next.config.mjs               # Next.js config (TypeScript errors ignored)
├── package.json                  # Dependencies (pnpm)
├── pnpm-lock.yaml
├── tsconfig.json                 # TypeScript config (strict mode)
└── tailwind.config.ts            # Tailwind v4 config
```

---

## 🤖 AI Features (Implemented)

All 5 AI features are **fully implemented with mock behavior**:

### 1. Smart Donation Recommender 🎯

- **Location**: `/donor/donate` (top of page)
- **Features**:
  - AI-powered crisis recommendations
  - Match scoring (location, type, urgency, capacity)
  - Impact optimizer with satisfaction score
  - Confidence scores (85-95%)
- **Component**: `src/components/ai-features/donation-recommender/`

### 2. AI Crisis Risk Analyzer 📊

- **Location**: `/admin/analytics` (below metrics)
- **Features**:
  - Predictive risk analysis (30/60/90 days)
  - Confidence scores and affected populations
  - Recommended preventive actions
  - Historical accuracy tracking (92-94%)
- **Component**: `src/components/ai-features/crisis-risk-analyzer/`

### 3. Donor Portfolio Analyzer 🏆

- **Location**: `/donor/profile` → "AI Portfolio" tab
- **Features**:
  - 6 donor personality types
  - Impact score calculation (0-100)
  - Donation streak tracking
  - Category distribution analysis
  - Personalized insights
- **Component**: `src/components/ai-features/donor-portfolio-analyzer/`

### 4. Provider Performance Optimizer 🚀

- **Location**: `/provider/analytics` (below metrics)
- **Features**:
  - AI coach with improvement tips
  - Benchmark comparison (top 10%)
  - Potential score increase calculator
  - Priority-based recommendations
- **Component**: `src/components/ai-features/provider-performance-optimizer/`

### 5. Real-Time Needs Heatmap 🗺️

- **Location**: Homepage `/` (middle section)
- **Features**:
  - Live updating (5-second intervals)
  - All 8 Bangladesh divisions
  - Need type filtering (food, medical, shelter, education, livelihood)
  - Severity-based color coding
  - Live/pause toggle
- **Component**: `src/components/ai-features/needs-heatmap/`

**Implementation Details**: See `WHERE_TO_FIND_AI_FEATURES.md` and `TESTING_GUIDE.md`

---

## 👥 User Roles & Portals

### Donor Portal

- Dashboard with wallet overview and impact metrics
- Gamification (Bronze→Platinum levels)
- Smart donation recommender
- Interactive impact map
- Portfolio analyzer
- Tax receipts

### Provider Portal

- Trust score dashboard (0-100)
- Performance optimizer
- Matching pool visualization
- Beneficiary management
- Distribution verification workflow
- Analytics and reports

### Beneficiary Portal

- Multi-step profile creation
- Provider matching and browsing
- Application form with needs assessment
- Status tracking with SMS notifications
- Privacy controls (3 levels)
- Provider ratings

### Admin Portal

- Crisis risk analyzer
- Fraud detection center
- Crisis management (create, edit, verify)
- Provider verification and monitoring
- Financial command center
- Platform-wide analytics

---

## 🎯 Core Workflows

### Complete Donation Journey

1. **Crisis Detection**: AI detects crisis (satellite + news) or admin creates manually
2. **Donor Browses**: Views crises with AI recommendations
3. **Donation**: Sets amount, preferences, sees impact prediction
4. **Smart Matching**: AI matches with best-fit provider
5. **Provider Accepts**: Reviews beneficiary list, submits distribution plan
6. **AI Verification**: Verifies documents (NID, photos, GPS)
7. **Fund Release**: 50% upfront, 50% on completion
8. **Distribution**: GPS-tagged photos, face matching at beneficiary location
9. **AI Verification**: Validates distribution proof
10. **SMS Confirmation**: Beneficiary confirms via SMS
11. **Impact Report**: Donor receives detailed impact breakdown

### Beneficiary Self-Application Flow

1. Creates profile with documents (NID, selfie, family info)
2. AI verifies NID and documents
3. Profile visible to matching providers
4. Provider selects beneficiary from pool
5. AI matches with available donor funds
6. Distribution and verification
7. Completion and rating

### Trust Score Calculation (Provider)

```
Trust Score =
  30% × Completion Rate +
  25% × Average Rating +
  20% × Response Time Score +
  15% × Fraud Bonus (0 incidents) +
  10% × Longevity Score (capped at 5 years)
```

---

## 💻 Development Guide

### Common Development Patterns

#### Client vs Server Components

```tsx
// Server Component (default in app/)
export default function Page() {
  return <div>Server rendered</div>;
}

// Client Component (needs interactivity)
("use client");
export default function ClientPage() {
  const [state, setState] = useState();
  return <div>Client rendered</div>;
}
```

#### Using Suspense for Client Hooks

```tsx
// app/page.tsx (Server Component)
import { Suspense } from "react";
import ClientComponent from "./ClientComponent";

export default function Page() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ClientComponent />
    </Suspense>
  );
}

// ClientComponent.tsx
("use client");
import { useSearchParams } from "next/navigation";

export default function ClientComponent() {
  const searchParams = useSearchParams();
  // Use searchParams...
}
```

### Recent Notable Changes

- **Media Upload**: Added image/video evidence upload to admin crisis creation (`app/admin/create-crisis/page.tsx`) with 10MB limit and preview
- **Full-Screen Viewer**: Facebook-style image viewer modal with prev/next controls
- **Impact Map Enhancement**: Animated gradient background at `app/impact-map/page.tsx`
- **Suspense Fix**: Wrapped client hooks in Suspense boundary at `app/crises/page.tsx` to resolve prerender errors

### Mock Data System

All data is in `src/store/mock-data.ts`:

- `mockCrises`: 10 crisis scenarios
- `mockDonations`: Sample donation records
- `mockProviders`: 15 verified providers
- `mockBeneficiaries`: 20 beneficiary profiles
- `mockFraudAlerts`: Fraud detection examples

### Adding New AI Features

1. Create component in `src/components/ai-features/[feature-name]/`
2. Implement mock algorithm in `src/lib/`
3. Add to relevant portal dashboard
4. Document in `WHERE_TO_FIND_AI_FEATURES.md`

### Styling Guidelines

- Use Tailwind utility classes
- Custom animations in `app/globals.css`
- Follow shadcn/ui component patterns
- Responsive design: mobile-first approach

---

## 🚀 Deployment

### Vercel (Recommended)

This project is optimized for Vercel deployment:

```bash
# Deploy to Vercel
vercel

# Production deployment
vercel --prod
```

**Build Configuration**:

- Framework: Next.js
- Build Command: `pnpm build`
- Output Directory: `.next`
- Install Command: `pnpm install`

**Known Issues**:

- **Sharp warning**: Run `pnpm approve-builds` locally if needed
- **TypeScript errors**: Intentionally ignored in `next.config.mjs`
- **Prerender warnings**: `ReferenceError: location` is non-blocking

### Environment Variables

Create `.env.local` for local development:

```env
# Optional (not required for mock data)
NEXT_PUBLIC_API_URL=http://localhost:3000/api
DATABASE_URL=postgresql://...
```

---

## 📚 Documentation

Comprehensive documentation available:

- **`WHERE_TO_FIND_AI_FEATURES.md`**: Step-by-step guide to access each AI feature
- **`TESTING_GUIDE.md`**: How to test all 5 AI features
- **`PLATFORM_FEATURES.md`**: Complete feature implementation summary
- **`AI_FEATURES_INTEGRATION_COMPLETE.md`**: Technical implementation details
- **`VISUAL_DEBUG_GUIDE.md`**: Visual debugging and screenshot guide

---

## 🐛 Troubleshooting

### Build Errors

**`useSearchParams() should be wrapped in a suspense boundary`**

- **Solution**: Wrap the client component in `<Suspense>` at the page level
- **Example**: See `app/crises/page.tsx`

**`ReferenceError: location is not defined`**

- **Cause**: Browser globals accessed during SSR
- **Solution**: Guard with `typeof window !== 'undefined'` or move to client component

**`Ignored build scripts: sharp`**

- **Non-blocking**: Image optimization warning
- **Solution**: Run `pnpm approve-builds` to allow native builds (optional)

### Development Issues

**Port 3000 already in use**

```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
pnpm dev -- -p 3001
```

**Stale cache issues**

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

---

## 🤝 Contributing

We welcome contributions! Here's how:

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes following our patterns
4. Test thoroughly (see `TESTING_GUIDE.md`)
5. Commit: `git commit -m 'Add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Code Guidelines

- Follow TypeScript strict mode
- Use Tailwind for styling (no CSS modules)
- Keep components small and focused
- Add Suspense boundaries for client hooks
- Document new AI features in `WHERE_TO_FIND_AI_FEATURES.md`

### Testing Checklist

- [ ] Runs without errors: `pnpm dev`
- [ ] Builds successfully: `pnpm build`
- [ ] Tested in all relevant user roles
- [ ] Responsive on mobile/tablet/desktop
- [ ] No console errors or warnings

---

## 📞 Contact & Support

- **GitHub**: [AlphaVerse-BUET/Shurokkha](https://github.com/AlphaVerse-BUET/Shurokkha)
- **Issues**: [Report bugs or request features](https://github.com/AlphaVerse-BUET/Shurokkha/issues)
- **Email**: contact@shurokkha.app

---

## 🙏 Acknowledgments

- **Built by**: AlphaVerse team, BUET
- **Hackathon**: Solvio Hackathon 2025
- **Inspiration**: The need for transparent humanitarian aid in Bangladesh
- **Tools**: Next.js, Tailwind CSS, shadcn/ui, Vercel
- **Special thanks**: All NGOs and volunteers working on the ground in Bangladesh

---

## 📄 License

This project is part of the Solvio Hackathon submission. All rights reserved by AlphaVerse-BUET team.

---

**Made with ❤️ for Bangladesh**

_Last Updated: November 10, 2025_

1. Fork the repo and create a branch for your feature/fix.
2. Run the development server and make changes.
3. Keep changes small and focused; add unit or component tests where appropriate.
4. Open a PR with a clear description of the change, why it’s needed, and any manual testing steps.

Developer tips

- When adding pages that need browser-only hooks, implement them as client components and wrap them in `Suspense` at the route-level to keep static prerendering intact.
- When adding file uploads, use preview URLs (`URL.createObjectURL`) for UI preview, and upload to a durable storage (S3/GCS) in production.

---

## Contact & Support

If you need help, reach out to the maintainers:

- Email: contact@shurokkha.app
- Slack / Teams: (internal)

---

If you'd like, I can:

1. Commit this README update to a branch and open a PR draft.
2. Run a CI-friendly `pnpm build` locally and capture the output for the README troubleshooting section.
3. Add a CONTRIBUTING.md and short developer onboarding checklist.

Tell me which of the three you'd like next — I can run the build and attach results, or commit the README change for you.

---

Made with ❤️ for Bangladesh
