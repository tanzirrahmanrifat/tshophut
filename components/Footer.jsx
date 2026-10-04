import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative pt-16 border-t border-line mt-20 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, #17140F 1px, transparent 1px)", backgroundSize: "18px 18px" }}
      />
      <div className="relative max-w-[1220px] mx-auto px-5 sm:px-7">
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-10 pb-12">
          <div>
            <Link href="/" className="flex items-center gap-2.5 font-display text-xl mb-3.5">
              <svg viewBox="0 0 34 34" className="w-8 h-8" fill="none">
                <circle cx="17" cy="17" r="16" stroke="currentColor" strokeWidth="1.5" />
                <path d="M9 12H25M17 12V25" stroke="currentColor" strokeWidth="2.4" strokeLinecap="square" />
              </svg>
              TSHOPHUT
            </Link>
            <p className="text-ink/70 text-sm max-w-[34ch]">
              Small-batch heavyweight tees, dropped every Friday out of Dhaka.
              No restocks, no filler colours.
            </p>
          </div>

          <div>
            <h4 className="eyebrow mb-4">Shop</h4>
            <FooterLinks
              links={[
                ["All Tees", "/collections/tees"],
                ["Caps", "/collections/caps"],
                ["Print on Demand", "/custom"],
              ]}
            />
          </div>

          <div>
            <h4 className="eyebrow mb-4">Help</h4>
            <FooterLinks
              links={[
                ["Size Guide", "/"],
                ["Shipping", "/"],
                ["Track Order", "/account"],
              ]}
            />
          </div>

          <div>
            <h4 className="eyebrow mb-4">Company</h4>
            <FooterLinks
              links={[
                ["Our Story", "/#story"],
                ["Admin", "/admin"],
              ]}
            />
          </div>
        </div>

        <div className="flex items-center justify-between py-5 border-t border-line font-mono text-[11px] text-ink/45 flex-wrap gap-3">
          <p>© 2026 Tshophut. All rights reserved.</p>
          <div className="flex gap-4">
            <span>Terms of Service</span>
            <span>Privacy Policy</span>
            <span>Return &amp; Refund Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLinks({ links }) {
  return (
    <div className="space-y-1.5">
      {links.map(([label, href]) => (
        <Link key={label} href={href} className="block text-sm text-ink/70 hover:text-cobalt py-0.5">
          {label}
        </Link>
      ))}
    </div>
  );
}
