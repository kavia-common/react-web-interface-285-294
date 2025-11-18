import React from "react";
import styles from "./Navbar.module.css";

// PUBLIC_INTERFACE
function Navbar() {
  /**
   * Top navigation bar for the app with branding and links
   */
  return (
    <nav className={styles.navbar} role="navigation" aria-label="Main navigation">
      <div className={styles.brand}>
        <a href="#" className={styles.title}>MyApp</a>
      </div>
      <ul className={styles.navlinks}>
        <li><a href="#" tabIndex={0}>Home</a></li>
        <li><a href="#" tabIndex={0}>About</a></li>
        <li><a href="#" tabIndex={0}>Contact</a></li>
      </ul>
    </nav>
  );
}

export default Navbar;
