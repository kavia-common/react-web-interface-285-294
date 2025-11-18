import React, { useState, useEffect } from "react";
import Layout from "./components/Layout";
import Home from "./pages/Home";
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

  // Optionally, leave the theme toggle for demonstration purpose, but can be moved to Navbar if desired
  return (
    <div className="App">
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        style={{ position: "fixed", top: 10, right: 10, zIndex: 2000 }}
      >
        {theme === "light" ? "🌙 Dark" : "☀️ Light"}
      </button>
      <Layout>
        <Home />
      </Layout>
    </div>
  );
}

export default App;
