import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToTop() {
  const { pathname } = useLocation();

  // useLayoutEffect fires before paint, ensuring scroll resets before the user sees anything
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Fallback: also disable browser scroll restoration
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  return null;
}
