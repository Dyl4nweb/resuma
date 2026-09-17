import Link from "next/link";
import { auth } from "@/auth";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { HeroResumePreview } from "@/components/marketing/HeroResumePreview";
import { HeroScrollExperience } from "@/components/marketing/HeroScrollExperience";
import { HeroIntroSection } from "@/components/marketing/HeroIntroSection";
import {
  FileText,
  Sparkles,
  Zap,
  ShieldCheck,
  ArrowRight,
  Printer,
  GripVertical,
  Check,
  Eye,
  Sliders,
} from "lucide-react";
import { LiveTestimonials } from "@/components/marketing/LiveTestimonials";

export const metadata = {
  title: "Resuma — Lightweight Production Resume Builder",
  description:
    "Build ATS-friendly, beautifully designed resumes in minutes. Reorder sections with drag-and-drop, export high-fidelity PDFs, and share your work.",
};

export default async function MarketingPage() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-red-600/30">
      <Navbar user={session?.user} />

      <main className="flex-1">
        {/* Solo Scroll-Driven Assembling Hero Section: Resuma. */}
        <HeroScrollExperience />

        {/* Dedicated Next Section: Tagline, Short Description, and CTAs */}
        <HeroIntroSection user={session?.user} />

        {/* Dedicated Live Resume Template Showcase Section */}
        <section id="templates-showcase" className="py-20 bg-background relative">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-xs font-bold uppercase tracking-widest text-red-500 mb-2">
                ATS-Optimized Templates
              </h2>
              <p className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                Preview ATS-tested resumes in real-time
              </p>
            </div>

            <HeroResumePreview />
          </div>
        </section>

        {/* Feature Highlights Grid */}
        <section className="py-14 sm:py-20 border-t border-border bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
              <h2 className="text-xs font-bold uppercase tracking-widest text-red-500 mb-2">
                Built for Precision
              </h2>
              <p className="text-xl sm:text-3xl font-bold text-foreground tracking-tight">
                Everything you need to showcase your career
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {/* Feature 1 */}
              <div className="rounded-2xl border border-border bg-card p-5 sm:p-8 hover:border-border transition-colors">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-red-400 mb-4 sm:mb-5">
                  <GripVertical className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-foreground">
                  Drag & Drop Reordering
                </h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  Powered by dnd-kit. Effortlessly rearrange Work Experience, Education, Skills, and Projects to highlight what matters most for each job application.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="rounded-2xl border border-border bg-card p-5 sm:p-8 hover:border-border transition-colors">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-blue-400 mb-4 sm:mb-5">
                  <FileText className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-foreground">
                  4 Tested ATS Templates
                </h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  Choose between Modern, Classic Executive, Minimalist, and Compact Tech. Every layout parses cleanly in applicant tracking systems without table traps.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="rounded-2xl border border-border bg-card p-5 sm:p-8 hover:border-border transition-colors">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-emerald-400 mb-4 sm:mb-5">
                  <Eye className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-foreground">
                  Live Public Links & Analytics
                </h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  Toggle on a public shareable URL slug (`/r/your-slug`) and see how many times prospective employers and recruiters review your resume.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="rounded-2xl border border-border bg-card p-5 sm:p-8 hover:border-border transition-colors">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-purple-400 mb-4 sm:mb-5">
                  <Sliders className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-foreground">
                  Color Themes & Typography
                </h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  Custom accent colors, brand hex codes, and switchable fonts (Sans, Serif, and Monospace) to suit your personal branding.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="rounded-2xl border border-border bg-card p-5 sm:p-8 hover:border-border transition-colors">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-amber-400 mb-4 sm:mb-5">
                  <Printer className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-foreground">
                  High-Fidelity PDF Print
                </h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  Custom print CSS rules format the document exactly to A4/Letter specifications with pristine vector text and no awkward page cuts.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="rounded-2xl border border-border bg-card p-5 sm:p-8 hover:border-border transition-colors">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-red-500 mb-4 sm:mb-5">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-foreground">
                  Data Portability & Backup
                </h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  Your data belongs to you. Download complete JSON backups of your resume at any time, or restore previous versions with one click.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-14 sm:py-20 border-t border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
              <h2 className="text-xs font-bold uppercase tracking-widest text-red-500 mb-2">
                Simple, Transparent Pricing
              </h2>
              <p className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                Start for free. Upgrade when you need more.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto gap-6 sm:gap-8">
              {/* Free Plan */}
              <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-foreground">Free Plan</h3>
                    <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-foreground">
                      $0 Forever
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Perfect for crafting and maintaining a single primary resume.
                  </p>

                  <ul className="mt-6 sm:mt-8 space-y-3 sm:space-y-3.5 text-xs text-foreground">
                    <li className="flex items-center gap-2.5">
                      <Check className="h-4 w-4 text-muted-foreground" />
                      <span><strong>1 Full Resume Included</strong></span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="h-4 w-4 text-muted-foreground" />
                      <span>Access to all 4 ATS-friendly templates</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="h-4 w-4 text-muted-foreground" />
                      <span>Drag-and-drop section reordering</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="h-4 w-4 text-muted-foreground" />
                      <span>Real-time debounced autosave</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="h-4 w-4 text-muted-foreground" />
                      <span>Unlimited PDF & print exports</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-border flex justify-center">
                  <Link
                    href="/register"
                    className="w-full max-w-xs flex items-center justify-center gap-2 rounded-xl bg-muted-foreground hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                  >
                    <span>Get Started Free</span>
                  </Link>
                </div>
              </div>

              {/* Pro Plan */}
              <div className="relative rounded-2xl border border-red-500/40 bg-gradient-to-b from-red-50 to-white dark:from-red-950/20 dark:to-zinc-900 p-6 sm:p-8 flex flex-col justify-between shadow-xl shadow-red-950/20">
                <div className="absolute -top-3.5 right-6 rounded-full bg-red-600 px-3 py-1 text-[10px] font-bold text-white tracking-wide uppercase shadow">
                  Pro Plan
                </div>

                <div>
                  <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                    <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                      <span>Resuma PRO</span>
                      <Sparkles className="h-4 w-4 text-red-400" />
                    </h3>
                    <div className="text-right shrink-0">
                      <span className="text-lg sm:text-2xl font-bold text-foreground whitespace-nowrap">$1.00 / ₱62.78</span>
                      <span className="text-xs text-muted-foreground whitespace-nowrap"> / mo</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    For active job hunters targeting different companies and roles.
                  </p>

                  <ul className="mt-6 sm:mt-8 space-y-3 sm:space-y-3.5 text-xs text-foreground">
                    <li className="flex items-center gap-2.5">
                      <Check className="h-4 w-4 text-red-500" />
                      <span><strong className="text-foreground">Unlimited Resumes</strong> (Create variations for every role)</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="h-4 w-4 text-red-400" />
                      <span><strong>One-Click Resume Duplication</strong></span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="h-4 w-4 text-red-400" />
                      <span>Custom color palettes and typography controls</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="h-4 w-4 text-red-400" />
                      <span>Recruiter link tracking & view analytics</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="h-4 w-4 text-red-400" />
                      <span>Priority support & new template releases</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-border space-y-2 text-center flex flex-col items-center">
                  <Link
                    href="/register"
                    className="w-full max-w-xs flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-xs font-bold text-white hover:bg-red-500 transition-colors shadow-sm active:scale-95"
                  >
                    <span>Start with Pro ($1.00 / ₱62.78)</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <span className="text-[10px] sm:text-[11px] text-muted-foreground block max-w-xs">
                    Card (Stripe $1.00) &bull; InstaPay / GCash / Maya QR Ph (₱62.78)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Banner */}
        <section className="py-14 sm:py-20 border-t border-border text-center">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              Ready to upgrade your job search
              <span className="text-[#dc2626]">?</span>
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
              Join engineers, designers, and managers building clean, standout resumes with Resuma.
            </p>
            <div className="mt-6 sm:mt-8 flex justify-center">
              <Link
                href="/register"
                className="w-auto min-w-[200px] max-w-xs inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white hover:bg-red-500 transition-all shadow-lg shadow-red-600/25 active:scale-95 text-center"
              >
                <span>Create Your Resume Now</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <LiveTestimonials />
      <Footer />
    </div>
  );
}
