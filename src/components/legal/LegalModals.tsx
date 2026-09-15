"use client";

import { useEffect } from "react";
import { X, ShieldCheck, FileText } from "lucide-react";

export type LegalModalType = "terms" | "privacy" | null;

interface LegalModalsProps {
  type: LegalModalType;
  onClose: () => void;
}

export function LegalModals({ type, onClose }: LegalModalsProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (type) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [type]);

  if (!type) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div 
        className="relative w-full max-w-2xl max-h-[85vh] bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-800/80">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800">
              {type === "terms" ? (
                <FileText className="h-5 w-5 text-red-500" />
              ) : (
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {type === "terms" ? "Terms and Conditions" : "Privacy Policy"}
              </h2>
              <p className="text-xs text-zinc-400">
                Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 text-sm text-zinc-300 space-y-6 custom-scrollbar">
          {type === "terms" ? (
            <>
              <section>
                <h3 className="text-base font-semibold text-white mb-2">1. Acceptance of Terms</h3>
                <p className="leading-relaxed">
                  By accessing or using Resuma, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access the service.
                </p>
              </section>

              <section>
                <h3 className="text-base font-semibold text-white mb-2">2. User Accounts and Security</h3>
                <p className="leading-relaxed mb-2">
                  You are responsible for safeguarding the PIN or password that you use to access the service and for any activities or actions under your password.
                </p>
                <p className="leading-relaxed text-red-400 font-medium">
                  Important: Resuma does not store plain-text passwords. We cannot recover a lost PIN or password. If you lose your credentials, your account and associated resumes may become inaccessible.
                </p>
              </section>

              <section>
                <h3 className="text-base font-semibold text-white mb-2">3. Subscriptions and Payments</h3>
                <p className="leading-relaxed mb-2">
                  Resuma offers a Pro subscription. Payments are processed securely via third-party gateways (Stripe, Maya, GCash). 
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Subscriptions are billed in advance on a monthly basis.</li>
                  <li><strong>Manual Payments (QR Ph):</strong> Manual payments may take up to 24-48 hours to be verified and activated.</li>
                  <li><strong>Refund Policy:</strong> All payments are non-refundable unless required by applicable law. By completing a transaction, you waive your right to a refund for the current billing cycle.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-base font-semibold text-white mb-2">4. Limitation of Liability</h3>
                <p className="leading-relaxed uppercase text-xs font-semibold tracking-wider text-zinc-500">
                  IN NO EVENT SHALL RESUMA, NOR ITS DIRECTORS, EMPLOYEES, PARTNERS, AGENTS, SUPPLIERS, OR AFFILIATES, BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM (I) YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICE; (II) ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE SERVICE; (III) ANY CONTENT OBTAINED FROM THE SERVICE; AND (IV) UNAUTHORIZED ACCESS, USE OR ALTERATION OF YOUR TRANSMISSIONS OR CONTENT, WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE) OR ANY OTHER LEGAL THEORY.
                </p>
              </section>

              <section>
                <h3 className="text-base font-semibold text-white mb-2">5. User Content</h3>
                <p className="leading-relaxed">
                  Our Service allows you to create, store, and share resumes. You retain all of your ownership rights in your User Content. However, by uploading User Content, you grant Resuma a worldwide, non-exclusive, royalty-free license to use, reproduce, and display the User Content solely in connection with providing the Service.
                </p>
              </section>
            </>
          ) : (
            <>
              <section>
                <h3 className="text-base font-semibold text-white mb-2">1. Information We Collect</h3>
                <p className="leading-relaxed mb-2">
                  We only collect information necessary to provide and improve our services:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Account Data:</strong> Your name and email address when you register.</li>
                  <li><strong>Resume Data:</strong> Professional experience, education, skills, and any other details you choose to include in your resumes.</li>
                  <li><strong>Payment Data:</strong> We do not store your credit card information. Payments are processed entirely by our secure payment providers.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-base font-semibold text-white mb-2">2. How We Use Your Information</h3>
                <p className="leading-relaxed mb-2">
                  We use the information we collect primarily to provide, maintain, and protect Resuma. Specifically, we use your data to:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Create and manage your account.</li>
                  <li>Generate and format your resume PDFs.</li>
                  <li>Process payments and provide customer support.</li>
                </ul>
                <p className="mt-3 leading-relaxed font-medium text-emerald-400">
                  We will never sell your personal data or resume information to third parties or recruiters.
                </p>
              </section>

              <section>
                <h3 className="text-base font-semibold text-white mb-2">3. Data Security</h3>
                <p className="leading-relaxed">
                  We use industry-standard encryption to protect your data both in transit (HTTPS) and at rest. Your account is secured by bcrypt hashing algorithms for passwords and PINs. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
                </p>
              </section>

              <section>
                <h3 className="text-base font-semibold text-white mb-2">4. Your Rights</h3>
                <p className="leading-relaxed">
                  You have the right to access, update, or delete your personal information at any time. You can delete your account entirely from the settings panel, which will permanently remove all your resume data from our servers.
                </p>
              </section>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-zinc-800/80 bg-zinc-950/50 rounded-b-2xl flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-zinc-100 text-zinc-900 text-sm font-semibold hover:bg-white transition-colors"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}
