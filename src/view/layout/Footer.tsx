"use client";

import React from "react";
import Link from "next/link";
import { TrustRow } from "../components/TrustRow";
import { Wordmark } from "@/view/primitives/Wordmark";

export const Footer: React.FC = () => (
  <footer className="mt-16 bg-ink pb-8 pt-14 text-panel">
    <div className="mx-auto max-w-[1680px] px-6 md:px-[60px]">
      <div className="grid grid-cols-2 gap-10 pb-12 md:grid-cols-4 md:gap-12">
        <div className="col-span-2 flex flex-col gap-3 md:col-span-1">
          <Link href="/">
            <Wordmark fontSize={26} tone="ink" endorsement sew className="items-start" />
          </Link>
          <div className="mt-2 font-tamil text-[15px] text-panel/70">ஈரோடு · 1977 முதல்</div>
        </div>

        <FooterColumn
          title="SHOP"
          links={[
            { label: "All sarees", href: "/shop" },
            { label: "By colour", href: "/colour/maroon" },
            { label: "By occasion", href: "/occasion/muhurtham" },
            { label: "Offers", href: "/offers" },
          ]}
        />

        <FooterColumn
          title="HELP"
          links={[
            { label: "Track your order", href: "/track/VLR-4821" },
            { label: "Returns & exchange", href: "/story" },
            { label: "Delivery timelines", href: "/story" },
            { label: "Ask on WhatsApp", href: "https://wa.me/919876543210", external: true },
          ]}
        />

        <FooterColumn
          title="THE HOUSE"
          links={[
            { label: "Her story", href: "/story" },
            { label: "The Erode shop", href: "/story" },
            { label: "Authenticity", href: "/story" },
          ]}
        />
      </div>

      <div className="rule-temple my-4" />

      <div className="py-4">
        <TrustRow onInk />
      </div>
    </div>
  </footer>
);

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

const FooterColumn: React.FC<{ title: string; links: FooterLink[] }> = ({ title, links }) => (
  <div className="flex flex-col gap-3">
    <span className="font-sans text-[10px] uppercase tracking-label-wide text-[var(--thread-lit)]">
      {title}
    </span>
    <ul className="flex list-none flex-col gap-2 p-0 font-sans text-[11px] uppercase tracking-[0.14em] text-panel/75">
      {links.map((link) => (
        <li key={`${link.label}-${link.href}`}>
          {link.external ? (
            <a
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="text-panel/75 transition-colors hover:text-[var(--thread-lit)]"
            >
              {link.label}
            </a>
          ) : (
            <Link
              href={link.href}
              className="text-panel/75 transition-colors hover:text-[var(--thread-lit)]"
            >
              {link.label}
            </Link>
          )}
        </li>
      ))}
    </ul>
  </div>
);
