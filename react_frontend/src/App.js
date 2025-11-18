import React, { useState, useEffect } from "react";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Button from "./components/Button";
import "./App.css";

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // Demo navbar configuration
  const navbarLinks = [
    { label: "Home", href: "/" },
    {
      label: "Products",
      children: [
        { label: "Product A", href: "/products/a" },
        { label: "Product B", href: "/products/b" },
      ],
    },
    { label: "About", href: "/about" },
    { label: "External", href: "https://google.com", external: true },
  ];

  // Stub for search handler (replace with real search logic)
  const handleNavbarSearch = (value) => {
    // e.g. window.alert("Search: " + value);
    // For demo: no-op
  };

  // Theme toggle button as right-side Navbar action
  const themeToggleButton = (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      style={{ fontWeight: 550, fontSize: 16, minWidth: 80 }}
      autoFocus={false}
    >
      {theme === "light" ? <>🌙 Dark</> : <>☀️ Light</>}
    </Button>
  );

  // Show enhanced Layout and Navbar; Layout passes demo props: title, container, maxWidth
  return (
    <div className="App">
      <Layout
        title="KAVIA UI Demo"
        container={true}
        maxWidth="900px"
        // Layout renders Navbar by default; inject demo Navbar props via context/children
      >
        {/* Override Layout's internal Navbar with our demo config */}
        <Navbar
          brand={<span style={{ fontWeight: 900, color: "#3b82f6" }}>KAVIA</span>}
          links={navbarLinks}
          sticky={true}
          searchPlaceholder="Search docs…"
          onSearch={handleNavbarSearch}
          actions={themeToggleButton}
        />
        <Home />
      </Layout>
    </div>
  );
}

export default App;
