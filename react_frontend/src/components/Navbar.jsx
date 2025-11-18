import React, { useState, useRef } from "react";
import styles from "./Navbar.module.css";

// PUBLIC_INTERFACE
/**
 * ✓ Responsive Navbar with accessibility features, WAI-ARIA roles, and a programmable API.
 * - Brand area (props.brand)
 * - Nav links: props.links = [{label, href, external}]
 * - Hamburger/collapsible mobile menu for small screens
 * - Keyboard navigable & aria-expanded/controls/label
 * - "sticky" prop keeps Navbar at top
 * - Integrates with skip link via href="#main-content"
 * - Highlights active link (when window.location.pathname matches href)
 *
 * @param {object} props
 * @param brand ReactNode | string: Brand area (defaults to MyApp)
 * @param links Array<{label: string, href: string, external?: boolean}>: Navigation links (defaults to Home/About/Contact)
 * @param sticky boolean: Whether the navbar sticks to the viewport top (default true)
 * @param className string: Optional extra styling
 */
function Navbar({
  brand,
  links,
  sticky = true,
  className = "",
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navMenuRef = useRef(null);

  // Generate navigation links array
  const navLinks =
    Array.isArray(links) && links.length
      ? links
      : [
          { label: "Home", href: "/" },
          { label: "About", href: "/about" },
          { label: "Contact", href: "/contact" },
        ];

  // Determine active link based on window.location (best effort)
  let currentPath;
  if (typeof window !== "undefined" && window.location && window.location.pathname) {
    currentPath = window.location.pathname.replace(/\/+$/, ""); // remove trailing slash
    if (currentPath === "") currentPath = "/";
  } else {
    currentPath = "/";
  }

  // "Skip to content" link (alignment with Layout.jsx, hardcoded target)
  // This is positioned visually hidden but is included for screen reader context
  // The actual skip link is rendered in Layout.jsx – included here for a11y.
  const skipStyle = {
    position: "absolute",
    left: -9999,
    top: "auto",
    width: "1px",
    height: "1px",
    overflow: "hidden",
    zIndex: -100,
  };

  // Class for sticky if supported
  let navbarClass =
    (styles.navbar ? styles.navbar : "") +
    (sticky ? "" : " not-sticky") +
    (className ? ` ${className}` : "");

  // Responsive toggle button label/ids
  const menuId = "navbar-menu";
  const toggleMenu = () => setMobileOpen((open) => !open);

  // Accessibility: close menu with Escape
  function handleKeyDown(e) {
    if (e.key === "Escape" && mobileOpen) {
      setMobileOpen(false);
      // Focus hamburger
      if (hamburgerRef.current) hamburgerRef.current.focus();
    }
  }

  // Ref to hamburger for focus management
  const hamburgerRef = useRef(null);

  // Handle link click (closes mobile menu if open)
  function handleLinkClick() {
    setMobileOpen(false);
  }

  // Compute minimal fallback styles for missing classes
  const fallbackNavLinksStyle =
    styles.navlinks ||
    {
      listStyle: "none",
      display: "flex",
      gap: "2rem",
      margin: 0,
      padding: 0,
      alignItems: "center",
    };

  const fallbackHamburgerStyle = {
    background: "none",
    border: "none",
    padding: "0.35em 0.7em",
    borderRadius: 5,
    fontSize: "1.7rem",
    display: "inline-flex",
    alignItems: "center",
    cursor: "pointer",
    // Minimal focus indicator if missing from CSS
    outline: "2px solid var(--color-primary, #3b82f6)",
    outlineOffset: 2,
    backgroundColor: "transparent",
    marginLeft: "auto",
  };

  // Hamburger icon SVG (for accessibility: aria-hidden)
  function HamburgerIcon({ open }) {
    return (
      <span aria-hidden="true">
        <svg width={28} height={28} viewBox="0 0 32 32" focusable="false">
          <rect width="100%" height="4" rx="2" fill="currentColor" y={open ? 14 : 6} x="4" />
          <rect
            width="100%"
            height="4"
            rx="2"
            fill="currentColor"
            y={open ? 14 : 14}
            x={open ? 4 : 4}
            style={{
              opacity: open ? 0 : 1,
              transition: "opacity 0.1s linear",
            }}
          />
          <rect width="100%" height="4" rx="2" fill="currentColor" y={open ? 14 : 22} x="4" transform={open ?"rotate(45 16 16)":"none"} />
          <rect width="100%" height="4" rx="2" fill="currentColor" y={open ? 14 : 22} x="4" transform={open ?"rotate(-45 16 16)":"none"} />
        </svg>
      </span>
    );
  }

  // Mobile expanded: trap focus within menu using tabIndex, allow keyboard navigation
  // (Does not use a full focus trap for simplicity.)
  return (
    <nav
      className={navbarClass}
      style={{
        ...(sticky
          ? { position: "sticky", top: 0, zIndex: 100 }
          : {}),
        background: "#fff",
        boxShadow: "0 2px 6px 0 rgba(59,130,246,0.07)",
        ...(!styles.navbar ? { width: "100%", padding: "0.5rem 2rem" } : {}),
      }}
      role="navigation"
      aria-label="Main navigation"
    >
      <a href="#main-content" tabIndex={0} style={skipStyle} aria-label="Skip to main content">
        Skip to content
      </a>

      {/* Brand area */}
      <div className={styles.brand ? styles.brand : ""} style={!styles.brand ? { fontWeight: 800, fontSize: "1.28rem", color: "#3b82f6" } : {}}>
        {brand ? (
          typeof brand === "string" ? (
            <a href="/" className={styles.title ? styles.title : ""} style={!styles.title ? { textDecoration: "none", color: "#3b82f6" } : {}}>
              {brand}
            </a>
          ) : (
            brand
          )
        ) : (
          <a href="/" className={styles.title ? styles.title : ""} style={!styles.title ? { textDecoration: "none", color: "#3b82f6" } : {}}>
            MyApp
          </a>
        )}
      </div>

      {/* Hamburger Toggle Button - always rendered for accessibility, hidden on desktop by CSS */}
      <button
        ref={hamburgerRef}
        className={styles["hamburger"] || ""}
        style={!styles.hamburger ? { ...fallbackHamburgerStyle, display: "none", marginLeft: "1rem" } : undefined}
        aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-controls={menuId}
        aria-expanded={mobileOpen}
        onClick={toggleMenu}
        tabIndex={0}
        type="button"
        // Simple visibility: shown with media queries, fallback to always hide if missing CSS
        // For improved fallback: show hamburger if CSS is missing
        // Use window.matchMedia for minimal fallback if required
      >
        <span className="sr-only" style={skipStyle}>
          {mobileOpen ? "Close menu" : "Open menu"}
        </span>
        {HamburgerIcon({ open: mobileOpen })}
      </button>

      {/* Nav links */}
      <ul
        ref={navMenuRef}
        id={menuId}
        className={
          styles.navlinks
            ? styles.navlinks +
              (mobileOpen ? " mobile-open" : "")
            : ""
        }
        style={
          styles.navlinks
            ? // partially collapse in mobile via CSS if present
              undefined
            : {
                ...fallbackNavLinksStyle,
                flexDirection:
                  typeof window !== "undefined" &&
                  window.innerWidth < 700
                    ? "column"
                    : "row",
                display:
                  mobileOpen ||
                  (typeof window !== "undefined" &&
                    window.innerWidth >= 700)
                    ? "flex"
                    : "none",
                marginTop: mobileOpen ? "0.6rem" : 0,
                padding: 0,
                width: "100%",
              }
        }
        aria-label="Primary"
        aria-hidden={!mobileOpen && typeof window !== "undefined" && window.innerWidth < 700}
        onKeyDown={handleKeyDown}
        // Not implementing full focus trap for simplicity
      >
        {navLinks.map((link) => {
          // Determine active/selected by pathname (basic)
          const linkPath =
            typeof link.href === "string"
              ? link.href.replace(/\/+$/, "")
              : "";
          const isActive =
            linkPath === currentPath ||
            (linkPath !== "/" &&
              currentPath.startsWith(linkPath));
          const linkProps = {
            href: link.href,
            tabIndex: 0,
            "aria-current": isActive ? "page" : undefined,
            className: isActive
              ? styles.active ||
                undefined
              : undefined,
            style: isActive
              ? {
                  background: "var(--color-primary, #3b82f6)",
                  color: "#fff",
                  borderRadius: 4,
                  padding: "0.25rem 0.5rem",
                }
              : undefined,
            onClick: handleLinkClick,
            ...(link.external
              ? {
                  target: "_blank",
                  rel: "noopener noreferrer",
                  "aria-label":
                    link.label + " (opens in a new tab)",
                }
              : {}),
          };
          return (
            <li key={link.href + link.label}>
              <a {...linkProps}>{link.label}</a>
            </li>
          );
        })}
      </ul>

      {/* Responsive: Inline style for the hamburger if no CSS hides it */}
      <style>{`
        /* Fallback if .hamburger is missing: show hamburger on <700px only */
        @media (max-width:700px) {
          .${styles.hamburger || "fallback-navbar-hamburger"} {
            display:inline-flex!important;
          }
          ul.${styles.navlinks} {
            display: ${mobileOpen ? "flex" : "none"};
            flex-direction: column;
            width: 100%;
            margin-top: 0.8rem;
          }
        }
        @media (min-width:700px) {
          .${styles.hamburger || "fallback-navbar-hamburger"} {
            display:none!important;
          }
          ul.${styles.navlinks} {
            display: flex!important;
            flex-direction: row!important;
            margin-top: 0 !important;
          }
        }
      `}</style>
    </nav>
  );
}

export default Navbar;
