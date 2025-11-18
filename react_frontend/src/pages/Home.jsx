import React, { useState } from "react";
import Button from "../components/Button";
import Card from "../components/Card";

/** Simple icons as SVGs for demo purposes */
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
function IconStar() {
  return (
    <svg width={18} height={18} fill="none" viewBox="0 0 18 18" aria-hidden="true" style={{ color: "#f59e42" }}>
      <polygon
        points="9,2.5 11.19,7.18 16.27,7.73 12.69,11.14 13.82,16.02 9,13.28 4.18,16.02 5.31,11.14 1.73,7.73 6.81,7.18"
        fill="currentColor"
      />
    </svg>
  );
}

// PUBLIC_INTERFACE
function Home() {
  /** Page uses flexible Layout via parent.
   * Demos advanced Button and Card features, sizes, props, and accessibility.
   */
  const [loading, setLoading] = useState(false);
  const [cardSelected, setCardSelected] = useState(0);

  const handleAsyncAction = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1400);
  };
  const cardList = [
    {
      header: "Default Card",
      desc: "Default variant with simple content.",
      variant: "default",
      size: "md"
    },
    {
      header: "Outlined Card",
      desc: "Outlined variant, shows border accent.",
      variant: "outlined",
      size: "md"
    },
    {
      header: "Elevated Card",
      desc: "Elevated surface, higher shadow for emphasis.",
      variant: "elevated",
      size: "md"
    }
  ];

  return (
    <section aria-label="Component showcase" style={{ marginBottom: "2em" }}>
      <h1 style={{
        fontSize: "2.25rem",
        marginBottom: "0.35em",
        fontWeight: 800,
        color: "var(--color-primary)"
      }}>
        UI Component Demo: Button & Card
      </h1>
      <p
        style={{ marginBottom: "2rem", color: "var(--color-secondary)", maxWidth: 570 }}
        id="app-intro"
      >
        Explore the <b>Button</b> and <b>Card</b> design system. All features are accessible: tab through, try interactive states, and see responsive Layout props in action.
      </p>

      {/* Demo: Layout with container and maxWidth */}
      <Card
        variant="outlined"
        size="md"
        header={<h2 style={{ margin: 0 }}>Layout Props</h2>}
        footer={
          <span>
            <code>title</code>, <code>container</code>, and <code>maxWidth</code> shown.
          </span>
        }
      >
        <ul>
          <li>
            Page is wrapped using <b>&lt;Layout container maxWidth="900px" title="..."&gt;</b>.
          </li>
          <li>
            Sets the document <b>title</b> and constrains content width.
          </li>
          <li>
            Ensures content is visually and functionally grouped.
          </li>
        </ul>
      </Card>

      {/* Section: Button variants */}
      <section aria-labelledby="btn-sec-heading" style={{ marginTop: 36 }}>
        <h2 id="btn-sec-heading" style={{ margin: "0 0 0.3em 0", color: "var(--color-primary)" }}>
          Buttons &mdash; Variants, Sizes, States
        </h2>
        <p id="btn-desc" style={{ color: "var(--color-secondary)", marginTop: 0, marginBottom: 20 }}>
          Supports <b>primary, secondary, outline, ghost, danger, link</b> variants, all sizes, loading, disabled, fullWidth, <b>start/end icons</b>, <code>as="a"</code> and more.
        </p>
        {/* All button variants and sizes */}
        <div
          aria-describedby="btn-desc"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1.1rem",
            margin: "18px 0 0 0"
          }}
        >
          <Button variant="primary" size="md" aria-label="Primary action">
            Primary
          </Button>
          <Button variant="secondary" size="md">
            Secondary
          </Button>
          <Button variant="ghost" size="md">
            Ghost
          </Button>
          <Button variant="outline" size="md">
            Outline
          </Button>
          <Button variant="danger" size="md">
            Danger
          </Button>
          <Button variant="link" size="md" as="a" href="#" aria-label="Link button">
            Link
          </Button>

          {/* Small/large/compact */}
          <Button variant="primary" size="sm">
            Small
          </Button>
          <Button variant="primary" size="compact">
            Compact
          </Button>
          <Button variant="primary" size="lg" endIcon={<IconArrowRight />}>
            Large &rarr;
          </Button>

          {/* Start/End icons */}
          <Button variant="secondary" size="md" startIcon={<IconCheck />}>
            Start Icon
          </Button>
          <Button variant="outline" size="md" endIcon={<IconArrowRight />}>
            End Icon
          </Button>
          <Button variant="ghost" size="md" startIcon={<IconStar />}>
            Icon Only
          </Button>
          <Button
            variant="primary"
            size="md"
            loading={loading}
            startIcon={<IconCheck />}
            aria-busy={loading}
            aria-label="Show loading spinner"
            onClick={handleAsyncAction}
          >
            {loading ? "Loading..." : "Loading"}
          </Button>
          <Button variant="danger" disabled>
            Disabled
          </Button>
          <Button variant="primary" size="md" fullWidth>
            Full Width
          </Button>
          <Button
            variant="outline"
            as="a"
            href="https://react.dev"
            target="_blank"
            rel="noopener noreferrer"
            startIcon={<IconArrowRight />}
            aria-label="Open React docs in new tab"
          >
            as="a" with Icons
          </Button>
        </div>
      </section>

      {/* Section: Card features */}
      <section aria-labelledby="card-sec-heading" style={{ marginTop: 60 }}>
        <h2
          id="card-sec-heading"
          style={{ margin: "0 0 0.33em 0", color: "var(--color-success)" }}
        >
          Cards — Variants & Advanced Props
        </h2>
        <p style={{ color: "var(--color-secondary)", marginTop: 0, marginBottom: 18 }}>
          <b>Card</b> supports <b>default, outlined, elevated</b> variants, interactive/selectable/disabled, all sizes, header/media/footer slots, <code>as</code>/"a" href usage.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(333px, 1fr))",
            gap: "1.6rem"
          }}
        >
          {/* Default, Outlined, Elevated = variants */}
          {cardList.map((card, idx) => (
            <Card
              key={card.header}
              variant={card.variant}
              size={card.size}
              title={card.header}
              subtitle={card.desc}
              media={
                <div style={{
                  width: "100%",
                  minHeight: 45,
                  background: idx === 1 ? "var(--color-primary)" : idx === 2 ? "var(--color-success)" : "#e5e7eb",
                  borderRadius: "9px 9px 0 0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <IconStar />
                </div>
              }
              footer={
                <span style={{ fontWeight: 500 }}>
                  Variant: <code>{card.variant}</code>
                </span>
              }
            >
              <p>
                This card uses <b>{card.variant}</b> styling and <code>size="{card.size}"</code>.
              </p>
            </Card>
          ))}

          {/* Interactive card (clickable/selectable/focus) */}
          <Card
            variant="elevated"
            interactive
            selected={cardSelected === 1}
            onClick={() => setCardSelected(1)}
            aria-label="Selectable feature card"
            actions={<Button size="sm" onClick={() => setCardSelected(1)}>Pick</Button>}
            title="Selectable Card"
            subtitle="Interactive, selectable, focusable"
            media={
              <img
                src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=60"
                alt=""
                style={{ width: "100%", height: 55, objectFit: "cover", borderRadius: "9px 9px 0 0" }}
                aria-hidden="true"
              />
            }
          >
            <p>
              <b>Click or tab</b> to select. See <code>interactive</code> and <code>selected</code> props in action.
            </p>
          </Card>

          {/* Disabled card */}
          <Card
            variant="outlined"
            disabled
            title="Disabled Card"
            subtitle="No interaction"
            footer={
              <b style={{ opacity: 0.7 }}>(Disabled)</b>
            }
            media={<IconArrowRight />}
          >
            <p>Disabled cards cannot be focused or activated.</p>
          </Card>

          {/* Card as anchor */}
          <Card
            as="a"
            href="https://react.dev"
            target="_blank"
            rel="noopener noreferrer"
            variant="default"
            interactive
            title="Card as Link"
            subtitle="Renders as &lt;a&gt; with href/target"
            actions={<IconArrowRight />}
            media={<IconStar />}
            size="sm"
            aria-label="Learn more on the React website"
          >
            <p style={{ marginTop: 0 }}>
              Try keyboard or mouse: opens external link.<br />
              <b>as="a"</b> enables robust anchor rendering.
            </p>
          </Card>
        </div>
      </section>

      {/* Accessibility info */}
      <section aria-labelledby="a11y-info" style={{ marginTop: 60, marginBottom: 20 }}>
        <h2 id="a11y-info" style={{ color: "var(--color-error)", marginBottom: 6 }}>
          Accessibility &amp; Keyboard Usability
        </h2>
        <ul>
          <li><b>Buttons</b> use <code>aria-busy</code>, <code>aria-disabled</code>, visually-hidden labels, and forward <code>tabIndex</code>.</li>
          <li>Cards support <code>aria-pressed</code>, <code>aria-disabled</code>, keyboard and click selection, and correct headings hierarchy.</li>
          <li>Start/end icons sized for assistive tech; all controls have focus-visible and accessible labels.</li>
          <li>All layout landmarks (<code>&lt;main&gt;</code>, <code>&lt;header&gt;</code>, <code>&lt;footer&gt;</code>) are ARIA-compliant.</li>
        </ul>
      </section>
    </section>
  );
}

export default Home;
