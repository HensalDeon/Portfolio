"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { Monogram } from "@/components/brand/monogram";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { getLenis } from "@/components/providers/smooth-scroll";
import { LinkButton } from "@/components/ui/button";
import { LocalTime } from "@/components/ui/local-time";
import { Magnetic } from "@/components/ui/magnetic";
import { navLinks, sectionIds } from "@/content/nav";
import { site } from "@/content/site";
import { useActiveSection } from "@/hooks/use-active-section";
import { useHeaderHidden } from "@/hooks/use-header-hidden";
import { useScrolled } from "@/hooks/use-scrolled";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [open, setOpen] = useState(false);
  const scrolled = useScrolled(24);
  const hidden = useHeaderHidden();
  const active = useActiveSection(sectionIds);
  const menuButton = useRef<HTMLButtonElement>(null);

  // Section links scroll in place on the home page and navigate back to it elsewhere.
  const hrefFor = (id: string) => (onHome ? `#${id}` : `/#${id}`);

  const close = useCallback(() => setOpen(false), []);
  const closeAndRestoreFocus = useCallback(() => {
    setOpen(false);
    menuButton.current?.focus();
  }, []);

  // Close the overlay on route change.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  // The active bar is positioned imperatively so it can slide between links
  // with a CSS transition instead of a layout-animation library.
  const navRef = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const nav = navRef.current;
    const bar = barRef.current;
    if (!nav || !bar) return;

    const place = () => {
      const link = nav.querySelector<HTMLElement>("[aria-current]");
      if (!link) {
        bar.style.opacity = "0";
        return;
      }
      bar.style.opacity = "1";
      bar.style.width = `${link.offsetWidth - 28}px`;
      bar.style.transform = `translateX(${link.offsetLeft + 14}px)`;
    };

    place();
    const observer = new ResizeObserver(place);
    observer.observe(nav);
    return () => observer.disconnect();
  }, [active]);

  return (
    <>
      <header
        style={{ viewTransitionName: "site-header" }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,translate] duration-500 ease-out-expo",
          scrolled ? "border-line bg-background/80 backdrop-blur-md" : "border-transparent",
          hidden && !open ? "-translate-y-full" : "translate-y-0",
        )}
      >
        <div className="flex h-16 items-center justify-between px-5 sm:px-8 lg:h-20 lg:px-12">
          <Link
            href="/"
            transitionTypes={onHome ? undefined : ["nav-back"]}
            className="group flex items-center gap-2.5 rounded-full focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
          >
            <Monogram className="h-7 w-7 transition-transform duration-500 ease-out-expo group-hover:rotate-[-8deg]" />
            <span className="text-sm font-semibold tracking-tight">{site.name}</span>
          </Link>

          <nav ref={navRef} aria-label="Primary" className="relative hidden items-center md:flex">
            <span
              ref={barRef}
              aria-hidden
              className="absolute bottom-1 left-0 h-px w-0 bg-foreground opacity-0 transition-[transform,width,opacity] duration-500 ease-out-expo motion-reduce:transition-none"
            />
            {navLinks.map((link) => {
              const isActive = onHome && active === link.id;
              return (
                <a
                  key={link.id}
                  href={hrefFor(link.id)}
                  aria-current={isActive ? "location" : undefined}
                  className={cn(
                    "rounded-full px-3.5 py-2 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none",
                    isActive ? "text-foreground" : "text-muted hover:text-foreground",
                  )}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-1.5">
            <LocalTime className="mr-3 hidden font-eyebrow text-muted tabular-nums lg:inline" />
            <ThemeToggle />
            <div className="hidden md:block">
              <Magnetic strength={0.25}>
                <LinkButton href={hrefFor("contact")} size="sm">
                  Let&apos;s talk
                </LinkButton>
              </Magnetic>
            </div>
            <button
              ref={menuButton}
              type="button"
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen(true)}
              className="inline-flex h-10 items-center rounded-full px-3 font-eyebrow transition-colors hover:bg-subtle focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none md:hidden"
            >
              Menu
            </button>
          </div>
        </div>
      </header>

      {open && <MobileMenu hrefFor={hrefFor} onClose={closeAndRestoreFocus} onNavigate={close} />}
    </>
  );
}

type MobileMenuProps = {
  hrefFor: (id: string) => string;
  onClose: () => void;
  onNavigate: () => void;
};

/** Full-screen menu for small screens; locks scrolling and closes on Escape. */
function MobileMenu({ hrefFor, onClose, onNavigate }: MobileMenuProps) {
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeButton.current?.focus();
    const lenis = getLenis();
    lenis?.stop();
    const root = document.documentElement;
    root.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      root.style.overflow = "";
      lenis?.start();
    };
  }, [onClose]);

  return (
    <div
      id="mobile-nav"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className="surface-ink fixed inset-0 z-[70] flex animate-menu-in flex-col motion-reduce:animate-none md:hidden"
    >
      <div className="flex h-16 items-center justify-between px-5 sm:px-8">
        <span className="flex items-center gap-2.5">
          <Monogram className="h-7 w-7" />
          <span className="text-sm font-semibold tracking-tight">{site.name}</span>
        </span>
        <button
          ref={closeButton}
          type="button"
          onClick={onClose}
          className="inline-flex h-10 items-center rounded-full px-3 font-eyebrow transition-colors hover:bg-subtle focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
        >
          Close
        </button>
      </div>

      <nav aria-label="Mobile" className="flex flex-1 flex-col justify-center px-5 sm:px-8">
        <ol className="flex flex-col gap-1">
          {navLinks.map((link, index) => (
            <li key={link.id} className="overflow-hidden">
              <a
                href={hrefFor(link.id)}
                onClick={onNavigate}
                className="flex animate-line-up items-baseline gap-4 py-1 motion-reduce:animate-none"
                style={{ animationDelay: `${0.25 + index * 0.06}s` }}
              >
                <span className="font-eyebrow text-muted tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-[clamp(3.5rem,17vw,7rem)]">{link.label}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="flex items-end justify-between gap-6 border-t border-line px-5 py-6 sm:px-8">
        <ul className="flex flex-col gap-2 font-eyebrow">
          {site.socials.map((social) => (
            <li key={social.label}>
              <a
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-muted transition-colors hover:text-foreground"
              >
                {social.label}
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
              </a>
            </li>
          ))}
        </ul>
        <p className="flex flex-col items-end gap-1 font-eyebrow text-muted">
          <span>{site.location}</span>
          <LocalTime className="tabular-nums" />
        </p>
      </div>
    </div>
  );
}
