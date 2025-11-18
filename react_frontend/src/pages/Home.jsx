import React, { useState } from "react";
import Button from "../components/Button";
import Card from "../components/Card";

// Example icon: simple SVG circle for demonstration.
function IconCheck() {
  return (
    <svg width={18} height={18} fill="none" viewBox="0 0 18 18" aria-hidden="true">
      <circle cx="9" cy="9" r="8" stroke="#06b6d4" strokeWidth="2" fill="none" />
      <path d="M5.2 9.2l2.1 2.1 4.3-4.6" stroke="#3b82f6" strokeWidth="2" fill="none" strokeLinecap="round"/>
    </svg>
  );
}
function IconArrowRight() {
  return (
    <svg width={18} height={18} fill="none" viewBox="0 0 18 18" aria-hidden="true">
      <path d="M7 5l4 4-4 4" stroke="#64748b" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

// PUBLIC_INTERFACE
function Home() {
  /**
   * Home page to showcase Button and Card components.
   */
  const [loading, setLoading] = useState(false);

  function triggerLoading() {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  }

  return (
    <section>
      <h1 style={{ fontSize: "2.125rem", marginBottom: "0.6em", color: "var(--color-primary)" }}>
        Welcome to MyApp!
      </h1>

      <Card>
        <h2 style={{ marginTop: 0, color: "var(--color-secondary)" }}>
          Button Variants & Sizes
        </h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gap: "1.1rem",
          margin: "1em 0"
        }}>
          {/* Variants, sizes, icons */}
          <Button variant="primary" size="md">Primary</Button>
          <Button variant="secondary" size="md">Secondary</Button>
          <Button variant="outline" size="md">Outline</Button>
          <Button variant="ghost" size="md">Ghost</Button>
          <Button variant="danger" size="md">Danger</Button>
          <Button variant="primary" size="sm">Small</Button>
          <Button variant="primary" size="md">Medium</Button>
          <Button variant="primary" size="lg">Large</Button>
          <Button variant="outline" size="sm" startIcon={<IconCheck />}>Small startIcon</Button>
          <Button variant="ghost" size="md" endIcon={<IconArrowRight />}>End Icon</Button>
          <Button variant="secondary" size="lg" startIcon={<IconCheck />}>Large with Icon</Button>
          <Button variant="danger" disabled>Disabled</Button>
          <Button variant="primary" fullWidth>Full Width Button</Button>
          <Button variant="outline" as="a" href="https://react.dev" target="_blank" rel="noopener noreferrer">As Link (Outline)</Button>
        </div>
      </Card>

      <Card>
        <h2 style={{ marginTop: 0, color: "var(--color-success)" }}>
          Loading State & Accessibility
        </h2>
        <p>
          Try out the loading state and keyboard navigation. Buttons use
          <code style={{
            background: "#f1f5f9",
            color: "#3b82f6",
            borderRadius: 4,
            margin: "0 3px", padding: "1px 6px"
          }}>aria-busy</code> & <code>aria-disabled</code>!
        </p>
        <div style={{ display: "flex", gap: "1.1rem", flexWrap: "wrap" }}>
          <Button
            variant="primary"
            loading={loading}
            onClick={triggerLoading}
            startIcon={<IconCheck />}
            size="md"
            style={{ minWidth: 145 }}
          >
            Load (Primary)
          </Button>
          <Button
            variant="outline"
            loading={loading}
            endIcon={<IconArrowRight />}
            size="md"
          >
            Loading Outline
          </Button>
          <Button
            variant="ghost"
            loading
            size="md"
          >
            Loading Ghost
          </Button>
        </div>
      </Card>

      <Card>
        <h2 style={{ marginTop: 0, color: "var(--color-error)" }}>Accessibility Notes</h2>
        <ul>
          <li>All buttons and links are keyboard-focusable (Tab, Shift+Tab).</li>
          <li>
            <b>:focus-visible</b> highlights are shown for keyboard users.
          </li>
          <li>
            <b>aria-busy</b> is set when loading, and <b>aria-disabled</b> disables actions.
          </li>
        </ul>
      </Card>
    </section>
  );
}

export default Home;
