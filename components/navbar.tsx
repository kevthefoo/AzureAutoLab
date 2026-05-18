"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const linkClass = (href: string) => {
    const isActive =
      href === "/" ? pathname === "/" : pathname.startsWith(href);
    return `px-3 py-1.5 rounded text-sm transition-colors ${
      isActive
        ? "text-accent bg-accent/10"
        : "text-text-secondary hover:text-text-primary"
    }`;
  };

  return (
    <nav className="bg-bg-nav border-b border-border px-6 py-3 flex items-center justify-between">
      <Link href="/" className="text-accent font-bold text-lg">
        AzureAutoLab
      </Link>
      <div className="flex gap-1">
        <Link href="/" className={linkClass("/")}>
          Dashboard
        </Link>
        <Link href="/labs" className={linkClass("/labs")}>
          Labs
        </Link>
        <Link href="/quiz" className={linkClass("/quiz")}>
          Quiz
        </Link>
      </div>
    </nav>
  );
}
