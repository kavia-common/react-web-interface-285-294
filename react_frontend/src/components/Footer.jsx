import React from "react";
import styles from "./Footer.module.css";

// PUBLIC_INTERFACE
function Footer() {
  /**
   * Semantic and accessible page footer with brand, current year, navigation, and social media placeholders.
   * Uses role="contentinfo" and aria-label for landmark region.
   */
  const year = new Date().getFullYear();
  return (
    <footer
      className={styles.footer}
      role="contentinfo"
      aria-label="Site footer"
    >
      <div style={{ width: "100%", display: "flex", justifyContent: "space-between", flexWrap: "wrap", alignItems: "center" }}>
        {/* Left: Brand and year info */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.7em" }}>
          <span>
            © {year} <span style={{ fontWeight: 600, letterSpacing: 0.5 }}>MyApp</span>. All rights reserved.
          </span>
        </div>

        {/* Right: Navigation links and social placeholders */}
        <nav aria-label="Footer navigation" style={{ display: "flex", alignItems: "center", gap: "1.3em" }}>
          <a href="#" tabIndex={0} className={styles.link}>
            Home
          </a>
          <a href="#" tabIndex={0} className={styles.link}>
            About
          </a>
          <a href="#" tabIndex={0} className={styles.link}>
            Contact
          </a>
          {/* Social icons placeholders */}
          <span
            aria-label="Social media links"
            style={{ display: "inline-flex", gap: "0.6em", marginLeft: "1.3em" }}
          >
            <a href="#" className={styles.link} tabIndex={0} aria-label="Twitter (placeholder)">
              <span style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(1px, 1px, 1px, 1px)", whiteSpace: "nowrap" }}>Twitter</span>
              <svg width="20" height="20" aria-hidden="true" focusable="false" style={{ display: "inline-block", verticalAlign: "middle" }}>
                <circle cx="10" cy="10" r="8" stroke="#64748b" strokeWidth="2" fill="none"/>
                <path d="M15 7.6c-.35.15-.7.25-1.1.3a2.03 2.03 0 0 0-.9-1.12 2.06 2.06 0 0 0-2.3.1A2.04 2.04 0 0 0 9.7 8.6v.3a5.7 5.7 0 0 1-4.2-2.1s-1 2 1.2 2.8c-.3 0-.65-.1-.93-.18 0 1.2.81 2.2 2.01 2.5-.22.06-.51.1-.8-.02.23.8.9 1.4 1.7 1.4A4.11 4.11 0 0 1 5 14.3a5.8 5.8 0 0 0 3.1.92A5.76 5.76 0 0 0 14.93 8.1l.01-.25c.3-.19.58-.5.81-.81Z" fill="#64748b"/>
              </svg>
            </a>
            <a href="#" className={styles.link} tabIndex={0} aria-label="GitHub (placeholder)">
              <span style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(1px, 1px, 1px, 1px)", whiteSpace: "nowrap" }}>GitHub</span>
              <svg width="20" height="20" aria-hidden="true" focusable="false" style={{ display: "inline-block", verticalAlign: "middle" }}>
                <circle cx="10" cy="10" r="8" stroke="#64748b" strokeWidth="2" fill="none"/>
                <path d="M13.3 15V13.43c0-.47-.16-.75-.49-.88 1.8-.2 3.69-.9 3.69-4A3.15 3.15 0 0 0 15 5.53 3.1 3.1 0 0 0 14.91 3.5s-.44-.13-1.47.58A5 5 0 0 0 10 3c-1.06.01-2.09.15-3.44 1.08-.99-.74-1.46-.59-1.46-.59A3.09 3.09 0 0 0 5 5.54a3.12 3.12 0 0 0-.85 4.35c.31.54.49 1.2.49 2.12C4.64 13.33 6.29 13.64 10 15c3.7-1.35 5.36-1.67 5.36-3.92 0-.92.19-1.58.49-2.12ZM7.39 16c.28.1.57.17.89.22.32.05.65.09.99.09.33 0 .67-.04.99-.09s.61-.12.89-.22" fill="#64748b"/>
              </svg>
            </a>
          </span>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;
