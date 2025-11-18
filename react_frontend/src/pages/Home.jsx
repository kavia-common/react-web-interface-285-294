import React from "react";
import Button from "../components/Button";
import Card from "../components/Card";

// PUBLIC_INTERFACE
function Home() {
  /**
   * Home page to showcase Button and Card components.
   */
  return (
    <section>
      <h1 style={{ fontSize: "2.125rem", marginBottom: "0.6em", color: "var(--color-primary)" }}>
        Welcome to MyApp!
      </h1>
      <Card>
        <h2 style={{ marginTop: 0, color: "var(--color-secondary)" }}>Getting Started</h2>
        <p>
          This is a <b>starter React project</b> with a simple component library.<br />
          Use the buttons below to see different variants:
        </p>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", margin: "1em 0" }}>
          <Button>Primary Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button disabled>Disabled Button</Button>
        </div>
      </Card>
      <Card>
        <h2 style={{ marginTop: 0, color: "var(--color-success)" }}>Responsive, Accessible UI</h2>
        <p>
          Try resizing your window or tabbing through the elements.<br />
          All components are keyboard and screen reader friendly.
        </p>
      </Card>
    </section>
  );
}

export default Home;
