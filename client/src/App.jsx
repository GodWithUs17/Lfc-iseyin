/**
 * App.jsx - Main application entry for the client workspace.
 * Keeps the current hash-based navigation while the app scales toward
 * route-based screens and feature modules.
 */

import { useEffect, useState } from "react";
import { SiteDataProvider } from "@/context/SiteDataContext";
import Home from "@/pages/Home";
import Admin from "@/pages/Admin";

function App() {
  const getInitialRoute = () => {
    if (typeof window === "undefined") return "home";
    return window.location.hash.includes("admin") ? "admin" : "home";
  };

  const [route, setRoute] = useState(getInitialRoute);

  useEffect(() => {
    const onHashChange = () => {
      setRoute(window.location.hash.includes("admin") ? "admin" : "home");
    };

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return (
    <SiteDataProvider>
      {route === "admin" ? <Admin /> : <Home />}
    </SiteDataProvider>
  );
}

export default App;
