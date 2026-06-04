"use client";

import styles from "./NavBar.module.css";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import largeLogo from "../assets/images/dads-know-stuff-large-logo.webp";

type NavLink = {
  href: string;
  label: string;
};

const navLinks: NavLink[] = [
  { href: "/dad-abase", label: "Dad Abase" },
  { href: "/dadvice", label: "Dadvice" },
  { href: "/dad-facts", label: "Dad Facts" },
  { href: "/merch", label: "Merch" },
  { href: "/dad-gram", label: "Dadgram" },
];

export default function NavBar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileNavWrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (!mobileNavWrapperRef.current) {
        return;
      }

      const clickTarget = event.target as Node;
      const clickedOutside = !mobileNavWrapperRef.current.contains(clickTarget);

      if (clickedOutside) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* mobile and smaller screen nav bar section */}
      <div ref={mobileNavWrapperRef} className={styles["mobile-nav-wrapper"]}>
        <nav className={`${styles["nav-bar"]} ${styles["mobile-nav-bar"]}`}>
          <Link href="/" className={styles["image-nav-link"]}>
            <Image
              className={styles["logo"]}
              src={largeLogo}
              alt="Dad's Know Stuff Logo"
            />
          </Link>
          <button
            type="button"
            className={styles["mobile-menu-button"]}
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-nav-links"
            aria-label="Toggle navigation menu"
          >
            <span className={styles["hamburger-line"]} />
            <span className={styles["hamburger-line"]} />
            <span className={styles["hamburger-line"]} />
          </button>
        </nav>
        <nav
          id="mobile-nav-links"
          className={`${styles["mobile-menu-panel"]} ${
            isMobileMenuOpen
              ? styles["mobile-menu-panel-open"]
              : styles["mobile-menu-panel-closed"]
          }`}
          aria-label="Mobile navigation"
          aria-hidden={!isMobileMenuOpen}
        >
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href || pathname.startsWith(`${link.href}/`);

            return (
              <Link
                key={`mobile-${link.href}`}
                href={link.href}
                className={`${styles["nav-link"]} ${styles["mobile-nav-link"]} ${
                  isActive ? styles["active-nav-link"] : ""
                }`}
                aria-current={isActive ? "page" : undefined}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* large screen nav bar section */}
      <nav className={`${styles["nav-bar"]} ${styles["desktop-nav-bar"]}`}>
        <Link href="/" className={styles["image-nav-link"]}>
          <Image
            className={styles["logo"]}
            src={largeLogo}
            alt="Dad's Know Stuff Logo"
          />
        </Link>
        {navLinks.map((link) => {
          const isActive =
            pathname === link.href || pathname.startsWith(`${link.href}/`);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles["nav-link"]} ${
                isActive ? styles["active-nav-link"] : ""
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
