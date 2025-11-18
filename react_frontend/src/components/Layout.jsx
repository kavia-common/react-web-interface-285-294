import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

// PUBLIC_INTERFACE
function Layout({ children }) {
  /**
   * App Layout with navbar at top, footer at bottom, and main content area.
   * @param {React.ReactNode} children
   */
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--gradient-bg)' }}>
      <Navbar />
      <main style={{ flex: 1, width: "100%", maxWidth: 900, margin: "2rem auto", padding: "1rem" }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
