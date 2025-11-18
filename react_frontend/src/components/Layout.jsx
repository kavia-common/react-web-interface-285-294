import React, { useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

// PUBLIC_INTERFACE
function Layout({
  children,
  title,
  description,
  noNavbar = false,
  noFooter = false,
  container = false,
  maxWidth = "900px",
}) {
  /**
   * Flexible and accessible app layout: optional Navbar/Footer, visually hidden skip link, updates title, container wrapping, and ARIA landmarks.
   * @param {React.ReactNode} children - Page content
   * @param {string} [title] - Optional document title for this page
   * @param {string} [description] - Optional description (not used as meta, for future use)
   * @param {boolean} [noNavbar] - Hide Navbar if true
   * @param {boolean} [noFooter] - Hide Footer if true
   * @param {boolean} [container] - Wrap main children in a container div for maxWidth/margin
   * @param {string} [maxWidth] - Max width for container (default: 900px)
   */

  useEffect(() => {
    if (title) {
      document.title = title;
    }
  }, [title]);

  // Visually hidden skip to content link, only visible on focus
  // Uses current color vars, no external css. High zIndex to always be on top.
  const skipLinkStyle = {
    position: "absolute",
    top: 1,
    left: 1,
    background: "#fff",
    color: "#2563eb",
    padding: "0.6em 1.2em",
    borderRadius: "6px",
    zIndex: 3000,
    fontWeight: 600,
    boxShadow: "0 2px 8px 0 rgba(59,130,246,0.07)",
    transform: "translateY(-120%)",
    transition: "transform 0.22s",
    textDecoration: "none",
  };

  const skipLinkFocusStyle = {
    transform: "translateY(0%)",
    outline: "2px solid #2563eb",
    outlineOffset: 2,
  };

  // Merge focus state in a simple way
  const [skipFocused, setSkipFocused] = React.useState(false);

  const mergedSkipLinkStyle = skipFocused
    ? { ...skipLinkStyle, ...skipLinkFocusStyle }
    : skipLinkStyle;

  // Container styling for main content
  const containerStyle = {
    maxWidth: maxWidth,
    marginLeft: "auto",
    marginRight: "auto",
    width: "100%",
    padding: "1rem",
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: "var(--gradient-bg)",
      }}
    >
      {/* Accessibility Skip Link */}
      <a
        href="#main-content"
        tabIndex={0}
        style={mergedSkipLinkStyle}
        onFocus={() => setSkipFocused(true)}
        onBlur={() => setSkipFocused(false)}
        onMouseDown={() => setSkipFocused(false)}
        onKeyDown={e => {
          if (e.key === "Escape") setSkipFocused(false);
        }}
        aria-label="Skip to main content"
      >
        Skip to content
      </a>

      {!noNavbar && (
        // Site global navigation landmark
        <header role="banner">
          <Navbar />
        </header>
      )}

      {/* Main landmark for page content */}
      <main
        id="main-content"
        role="main"
        tabIndex={-1}
        aria-label="Main content"
        style={{
          flex: 1,
          width: "100%",
          padding: container ? 0 : "1rem",
          margin: container ? 0 : "2rem auto",
          outline: "none",
        }}
      >
        {container ? (
          <div style={containerStyle}>{children}</div>
        ) : (
          children
        )}
      </main>

      {!noFooter && (
        // Site-wide footer/contentinfo landmark
        <Footer />
      )}
    </div>
  );
}

export default Layout;
