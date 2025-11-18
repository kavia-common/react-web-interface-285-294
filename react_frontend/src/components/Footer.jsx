import React from "react";
import styles from "./Footer.module.css";

// PUBLIC_INTERFACE
function Footer() {
  /**
   * Page footer with copyright and links
   */
  return (
    <footer className={styles.footer} role="contentinfo">
      <div>
        <span>
          © {new Date().getFullYear()} MyApp. 
        </span>
        <a href="#" tabIndex={0} className={styles.link}>Privacy</a>
        <a href="#" tabIndex={0} className={styles.link}>Terms</a>
      </div>
    </footer>
  );
}

export default Footer;
