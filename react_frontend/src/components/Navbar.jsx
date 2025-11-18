import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  Fragment,
  forwardRef,
} from "react";
import styles from "./Navbar.module.css";

/**
 * PUBLIC_INTERFACE
 * Enhanced Navbar with advanced accessibility, search input, submenu, sticky shadow, action slot, keyboard support, and mobile focus trapping.
 * 
 * @param {object} props
 * @param brand ReactNode | string: Brand area (defaults to MyApp)
 * @param links Array<{label: string, href?: string, external?: boolean, children?: Array, [key:string]: any}>: Navigation links (submenu supported with `children` array)
 * @param sticky boolean: Whether the navbar sticks to the viewport top (default true)
 * @param className string: Optional extra styling
 * @param searchPlaceholder string: Search input placeholder
 * @param onSearch function: Handler fired on user search (string)
 * @param actions ReactNode: Optional slot on right side for actions (e.g., theme toggle)
 */
function Navbar({
  brand,
  links,
  sticky = true,
  className = "",
  searchPlaceholder = "Search…",
  onSearch,
  actions,
}) {
  // State and refs
  const [mobileOpen, setMobileOpen] = useState(false);
  const [navShadow, setNavShadow] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [submenuOpen, setSubmenuOpen] = useState(null); // track open submenu index
  const navMenuRef = useRef(null);
  const hamburgerRef = useRef(null);
  const navRef = useRef(null);
  const focusTrapStart = useRef(null);
  const focusTrapEnd = useRef(null);

  // Default nav structure if links empty or not provided
  const navLinks =
    Array.isArray(links) && links.length
      ? links
      : [
          { label: "Home", href: "/" },
          { label: "About", href: "/about" },
          { label: "Contact", href: "/contact" },
        ];

  // Current path detection for aria-current
  let currentPath;
  if (
    typeof window !== "undefined" &&
    window.location &&
    window.location.pathname
  ) {
    currentPath = window.location.pathname.replace(/\/+$/, "");
    if (currentPath === "") currentPath = "/";
  } else {
    currentPath = "/";
  }

  // Sticky + shadow on scroll (for .navbar only)
  useEffect(() => {
    if (!sticky) return;
    function onScroll() {
      const scrollY = window.scrollY || window.pageYOffset;
      setNavShadow(scrollY > 8);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [sticky]);

  // Escape closes submenu or mobile menu
  function handleMainKeyDown(e) {
    if (e.key === "Escape") {
      if (submenuOpen !== null) setSubmenuOpen(null);
      else if (mobileOpen) {
        setMobileOpen(false);
        setTimeout(() => hamburgerRef.current && hamburgerRef.current.focus(), 10);
      }
    }
  }

  // Mobile: trap focus (cycles inside nav when open)
  useEffect(() => {
    if (!mobileOpen) return;
    function handleTrap(e) {
      // If tab shifted outside, wrap inside
      if (e.key === "Tab") {
        const start = focusTrapStart.current;
        const end = focusTrapEnd.current;
        if (!start || !end) return;
        if (e.shiftKey && document.activeElement === start) {
          end.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === end) {
          start.focus();
          e.preventDefault();
        }
      }
    }
    document.addEventListener("keydown", handleTrap, true);
    return () => document.removeEventListener("keydown", handleTrap, true);
  }, [mobileOpen]);

  // Collapsible submenu (for mobile and desktop, open on click or arrow keys)
  const openSubmenu = useCallback((idx) => setSubmenuOpen(idx), []);
  const closeSubmenu = useCallback(() => setSubmenuOpen(null), []);

  // Keyboard navigation for menu/submenu (left/right/up/down, esc)
  function handleNavItemKeyDown(e, idx, hasSubmenu) {
    // On ArrowDown, open submenu or move to submenu first link
    if (hasSubmenu && (e.key === "Enter" || e.key === "ArrowDown")) {
      setSubmenuOpen(idx);
      setTimeout(() => {
        const firstSub =
          navMenuRef.current &&
          navMenuRef.current.querySelector(
            `[data-navsubmenu="${idx}"] li:first-child a`
          );
        firstSub && firstSub.focus();
      }, 10);
      e.preventDefault();
    } else if (e.key === "ArrowUp" && hasSubmenu && submenuOpen === idx) {
      // Move focus to last submenu link
      const lastSub =
        navMenuRef.current &&
        navMenuRef.current.querySelector(
          `[data-navsubmenu="${idx}"] li:last-child a`
        );
      lastSub && lastSub.focus();
      e.preventDefault();
    } else if (e.key === "ArrowRight") {
      // Focus next top-level nav item
      navMenuRef.current &&
        navMenuRef.current
          .querySelectorAll("li > a, li > button")
        [((idx + 1) % navLinks.length)].focus();
      e.preventDefault();
    } else if (e.key === "ArrowLeft") {
      // Focus prev top-level nav item
      navMenuRef.current &&
        navMenuRef.current
          .querySelectorAll("li > a, li > button")
        [
          idx - 1 < 0 ? navLinks.length - 1 : idx - 1
        ].focus();
      e.preventDefault();
    } else if (
      hasSubmenu &&
      submenuOpen === idx &&
      (e.key === "Escape" || e.key === "Tab")
    ) {
      setSubmenuOpen(null);
    }
  }

  // Keyboard navigation inside submenu
  function handleSubmenuKeyDown(e, idx, subLinksLen, subIdx) {
    if (e.key === "ArrowDown") {
      // Next submenu
      const sublist =
        navMenuRef.current &&
        navMenuRef.current.querySelectorAll(
          `[data-navsubmenu="${idx}"] li a`
        );
      sublist &&
        sublist[
          (subIdx + 1) % subLinksLen
        ].focus();
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      const sublist =
        navMenuRef.current &&
        navMenuRef.current.querySelectorAll(
          `[data-navsubmenu="${idx}"] li a`
        );
      sublist &&
        sublist[
          subIdx - 1 < 0 ? subLinksLen - 1 : subIdx - 1
        ].focus();
      e.preventDefault();
    } else if (e.key === "Escape" || e.key === "Tab") {
      setSubmenuOpen(null);
      // Move focus back to parent nav item
      navMenuRef.current &&
        navMenuRef.current
          .querySelectorAll("li > a, li > button")[idx].focus();
      e.preventDefault();
    }
  }

  // Minimal fallback hamburger style (if CSS missing)
  const fallbackHamburgerStyle = {
    background: "none",
    border: "none",
    borderRadius: 4,
    fontSize: "1.7rem",
    padding: "0.35em 0.7em",
    alignItems: "center",
    cursor: "pointer",
    outline: "2px solid var(--color-primary, #3b82f6)",
    outlineOffset: 2,
    backgroundColor: "transparent",
    marginLeft: "auto",
  };

  // Hamburger SVG
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
          <rect width="100%" height="4" rx="2" fill="currentColor" y={open ? 14 : 22} x="4" transform={open ? "rotate(45 16 16)" : "none"} />
          <rect width="100%" height="4" rx="2" fill="currentColor" y={open ? 14 : 22} x="4" transform={open ? "rotate(-45 16 16)" : "none"} />
        </svg>
      </span>
    );
  }

  // Search form submit handler
  function handleSearchSubmit(e) {
    e.preventDefault();
    if (onSearch && typeof onSearch === "function") onSearch(searchValue);
  }

  // Focus trap sentinels (invisible, tab stops)
  // For accessibility, first/last elements catch tabbing and cycle inside open mobile nav
  const focusTrapProps = mobileOpen
    ? {
        tabIndex: 0,
        "aria-hidden": true,
        style: { position: "absolute", opacity: 0, width: 1, height: 1 },
      }
    : {};

  // Main navbar rendering
  return (
    <nav
      className={`
        ${styles.navbar ? styles.navbar : ""}
        ${sticky ? "" : " not-sticky"}
        ${className || ""}
      `}
      style={{
        ...(sticky
          ? { position: "sticky", top: 0, zIndex: 100 }
          : {}),
        background: "#fff",
        boxShadow: navShadow
          ? "0 4px 14px 0 rgba(59,130,246,0.13)"
          : "0 2px 6px 0 rgba(59,130,246,0.07)",
        width: "100%",
        padding: styles.navbar ? undefined : "0.5rem 2rem",
        transition: "box-shadow 0.22s",
        willChange: "box-shadow",
      }}
      role="navigation"
      aria-label="Main navigation"
      ref={navRef}
      onKeyDown={handleMainKeyDown}
      data-sticky={!!sticky}
      data-shadow={!!navShadow ? "true" : undefined}
    >
      {/* Visually hidden skip link */}
      <a
        href="#main-content"
        tabIndex={0}
        style={{
          position: "absolute",
          left: -9999,
          top: "auto",
          width: "1px",
          height: "1px",
          overflow: "hidden",
          zIndex: -100,
        }}
        aria-label="Skip to main content"
      >
        Skip to content
      </a>

      {/* Brand area */}
      <div
        className={styles.brand ? styles.brand : ""}
        style={
          !styles.brand
            ? { fontWeight: 800, fontSize: "1.28rem", color: "#3b82f6" }
            : {}
        }
      >
        {brand ? (
          typeof brand === "string" ? (
            <a
              href="/"
              className={styles.title ? styles.title : ""}
              style={
                !styles.title
                  ? { textDecoration: "none", color: "#3b82f6" }
                  : {}
              }
            >
              {brand}
            </a>
          ) : (
            brand
          )
        ) : (
          <a
            href="/"
            className={styles.title ? styles.title : ""}
            style={
              !styles.title
                ? { textDecoration: "none", color: "#3b82f6" }
                : {}
            }
          >
            MyApp
          </a>
        )}
      </div>

      {/* Optional: search input (desktop only, inside nav, customizable) */}
      {onSearch && (
        <form
          role="search"
          aria-label="Site search"
          onSubmit={handleSearchSubmit}
          style={{
            marginLeft: "1.8rem",
            marginRight: "1.2rem",
            display: "flex",
            alignItems: "center",
            flex: "0 1 270px",
          }}
        >
          <label
            htmlFor="navbar-search"
            className="sr-only"
            style={{
              position: "absolute",
              left: "-10000px",
              width: "1px",
              height: "1px",
              overflow: "hidden",
            }}
          >
            Search
          </label>
          <input
            id="navbar-search"
            name="navbar-search"
            type="search"
            autoComplete="off"
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            placeholder={searchPlaceholder}
            style={{
              fontSize: 15,
              padding: "5px 12px 5px 10px",
              borderRadius: 6,
              border: "1px solid var(--border-color, #e9ecef)",
              outline: "none",
              background: "#f7f8fa",
              color: "#222",
              minWidth: 0,
              width: "180px",
              marginRight: 8,
              transition: "border .15s",
            }}
            aria-label={searchPlaceholder}
            tabIndex={0}
            onKeyDown={e => e.stopPropagation()}
          />
          <button
            type="submit"
            title="Search"
            aria-label="Search"
            style={{
              border: "none",
              background: "#2563eb",
              color: "#fff",
              padding: "5.5px 12px",
              fontWeight: 500,
              borderRadius: 6,
            }}
          >
            🔍
          </button>
        </form>
      )}

      {/* Hamburger Toggle Button (mobile only: hidden by CSS on desktop) */}
      <button
        ref={hamburgerRef}
        className={styles.hamburger || ""}
        style={
          !styles.hamburger
            ? {
                ...fallbackHamburgerStyle,
                display: "none",
                marginLeft: "1rem",
              }
            : undefined
        }
        aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-controls="navbar-menu"
        aria-expanded={!!mobileOpen}
        onClick={() => setMobileOpen((open) => !open)}
        type="button"
      >
        <span className="sr-only" aria-live="polite" style={{
          position: "absolute",
          left: -10000,
          height: 1,
          width: 1,
          overflow: "hidden",
        }}>
          {mobileOpen ? "Close menu" : "Open menu"}
        </span>
        {HamburgerIcon({ open: mobileOpen })}
      </button>

      {/* Nav links, search, submenu */}
      <ul
        ref={navMenuRef}
        id="navbar-menu"
        className={
          styles.navlinks
            ? styles.navlinks + (mobileOpen ? " mobile-open" : "")
            : ""
        }
        style={
          styles.navlinks
            ? undefined
            : {
                listStyle: "none",
                display:
                  mobileOpen ||
                  (typeof window !== "undefined" &&
                    window.innerWidth >= 700)
                    ? "flex"
                    : "none",
                flexDirection: (mobileOpen ? "column" : "row"),
                margin: 0,
                padding: 0,
                width: "100%",
                alignItems: "center",
                gap: "1rem",
                marginTop: mobileOpen ? "0.6rem" : undefined,
              }
        }
        aria-label="Primary"
        aria-hidden={
          !mobileOpen && typeof window !== "undefined" && window.innerWidth < 700
        }
        onKeyDown={handleMainKeyDown}
      >
        {/* Focus trap sentinel - start */}
        <li style={{ padding: 0, margin: 0 }}>
          <span
            ref={focusTrapStart}
            {...focusTrapProps}
            tabIndex={mobileOpen ? 0 : -1}
          />
        </li>
        {/* Nav items (support submenu; recursive for children) */}
        {navLinks.map((link, idx) => {
          const hasSubmenu =
            link.children && Array.isArray(link.children) && link.children.length;
          const linkPath =
            typeof link.href === "string"
              ? link.href.replace(/\/+$/, "")
              : "";
          const isActive =
            linkPath === currentPath ||
            (linkPath && linkPath !== "/" && currentPath.startsWith(linkPath));
          // For submenu keyboard: if parent focused, Enter/ArrowDown opens submenu
          if (hasSubmenu) {
            return (
              <li
                key={link.label + (link.href || idx)}
                style={{ position: "relative" }}
                aria-haspopup="true"
                aria-expanded={submenuOpen === idx}
                data-has-submenu
              >
                <button
                  aria-haspopup="true"
                  aria-expanded={submenuOpen === idx}
                  tabIndex={0}
                  className={isActive ? styles.active : undefined}
                  style={
                    isActive
                      ? {
                          background: "var(--color-primary, #3b82f6)",
                          color: "#fff",
                          borderRadius: 4,
                          padding: "0.25rem 0.5rem",
                        }
                      : undefined
                  }
                  onClick={() =>
                    submenuOpen === idx ? closeSubmenu() : openSubmenu(idx)
                  }
                  onKeyDown={e => handleNavItemKeyDown(e, idx, true)}
                  type="button"
                  aria-label={link.label + " menu"}
                >
                  {link.label} <span aria-hidden="true">▾</span>
                </button>
                {/* Submenu dropdown, visible if open */}
                {submenuOpen === idx ? (
                  <ul
                    role="menu"
                    aria-label={link.label + " submenu"}
                    data-navsubmenu={idx}
                    style={{
                      position: "absolute",
                      left: 0,
                      top: "100%",
                      background: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "7px",
                      boxShadow: "0 10px 28px 0 rgba(59,130,246,0.09)",
                      minWidth: 170,
                      zIndex: 99,
                      margin: 0,
                      padding: 0,
                      display: "block",
                    }}
                  >
                    {link.children.map((sublink, subIdx) => {
                      const subPath =
                        typeof sublink.href === "string"
                          ? sublink.href.replace(/\/+$/, "")
                          : "";
                      const isSubActive =
                        subPath === currentPath ||
                        (subPath && subPath !== "/" && currentPath.startsWith(subPath));
                      return (
                        <li key={sublink.href + sublink.label}>
                          <a
                            href={sublink.href}
                            tabIndex={0}
                            role="menuitem"
                            aria-current={isSubActive ? "page" : undefined}
                            className={isSubActive ? styles.active : undefined}
                            style={
                              isSubActive
                                ? {
                                    background: "var(--color-primary, #3b82f6)",
                                    color: "#fff",
                                    borderRadius: 4,
                                    padding: "0.22rem 0.52rem",
                                  }
                                : undefined
                            }
                            onClick={() => {
                              setMobileOpen(false);
                              closeSubmenu();
                            }}
                            onKeyDown={e =>
                              handleSubmenuKeyDown(e, idx, link.children.length, subIdx)
                            }
                            {...(sublink.external
                              ? {
                                  target: "_blank",
                                  rel: "noopener noreferrer",
                                  "aria-label": sublink.label + " (opens in a new tab)",
                                }
                              : {})}
                          >
                            {sublink.label}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
              </li>
            );
          } else {
            // Normal nav item
            const linkProps = {
              href: link.href,
              tabIndex: 0,
              "aria-current": isActive ? "page" : undefined,
              className: isActive ? styles.active : undefined,
              style: isActive
                ? {
                    background: "var(--color-primary, #3b82f6)",
                    color: "#fff",
                    borderRadius: 4,
                    padding: "0.25rem 0.5rem",
                  }
                : undefined,
              onClick: () => setMobileOpen(false),
              onKeyDown: e => handleNavItemKeyDown(e, idx, false),
              ...(link.external
                ? {
                    target: "_blank",
                    rel: "noopener noreferrer",
                    "aria-label": link.label + " (opens in a new tab)",
                  }
                : {}),
            };
            return (
              <li key={link.href + link.label}>
                <a {...linkProps}>{link.label}</a>
              </li>
            );
          }
        })}
        {/* Focus trap sentinel - end */}
        <li style={{ padding: 0, margin: 0 }}>
          <span
            ref={focusTrapEnd}
            {...focusTrapProps}
            tabIndex={mobileOpen ? 0 : -1}
          />
        </li>
        {/* Optional: actions (right-aligned; e.g. theme toggle, user menu, etc) */}
        {actions && (
          <li
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              minWidth: 44,
              justifyContent: "end",
              gap: 8,
              paddingLeft: 14,
            }}
          >
            {actions}
          </li>
        )}
      </ul>

      {/* Auto fallback: show hamburger on <700px if missing CSS */}
      <style>
        {`
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
        `}
      </style>
    </nav>
  );
}

export default Navbar;
