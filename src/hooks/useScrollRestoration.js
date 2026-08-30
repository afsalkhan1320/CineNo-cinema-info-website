import { useEffect, useState } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

/**
 * Custom hook to restore scroll position on back navigation (POP).
 * Saves scroll position on scroll and restores it when navigating back.
 * Guards against transitions overwriting position, handles slow mobile layout,
 * and sets native history.scrollRestoration to manual.
 * @param {boolean} isReady - Flag indicating if page content is loaded and ready for scroll restoration.
 */
export const useScrollRestoration = (isReady = true) => {
  const { pathname } = useLocation();
  const navType = useNavigationType();
  const [isRestored, setIsRestored] = useState(navType !== "POP");

  // Disable browser's native scroll restoration to avoid jumping/fightingcustom scroll
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  // Reset restored state when path or navType changes
  useEffect(() => {
    setIsRestored(navType !== "POP");
  }, [pathname, navType]);

  // Clear scroll position for new/forward navigations (PUSH/REPLACE)
  useEffect(() => {
    if (navType !== "POP") {
      try {
        sessionStorage.removeItem(`scroll_${pathname}`);
      } catch (e) {
        console.error("Error clearing scroll cache", e);
      }
    }
  }, [pathname, navType]);

  // Listen to scroll events and save Y position (only after restoration is complete)
  useEffect(() => {
    if (!isRestored) return;

    const handleScroll = () => {
      try {
        sessionStorage.setItem(`scroll_${pathname}`, window.scrollY.toString());
      } catch (e) {
        console.error("Error saving scroll position", e);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname, isRestored]);

  // Restore scroll position on POP navigation when content is ready
  useEffect(() => {
    if (isReady && navType === "POP" && !isRestored) {
      try {
        const savedPosition = sessionStorage.getItem(`scroll_${pathname}`);
        if (savedPosition) {
          const y = parseInt(savedPosition, 10);
          let attempts = 0;
          let lastHeight = document.documentElement.scrollHeight;

          const interval = setInterval(() => {
            window.scrollTo(0, y);
            attempts++;

            const currentHeight = document.documentElement.scrollHeight;

            // Stop if we reached target, timed out, or height stabilized & scroll is capped at bottom
            if (
              Math.abs(window.scrollY - y) < 2 ||
              attempts >= 10 ||
              (attempts > 3 &&
                currentHeight === lastHeight &&
                window.scrollY === document.documentElement.scrollHeight - window.innerHeight)
            ) {
              clearInterval(interval);
              setIsRestored(true);
            }
            lastHeight = currentHeight;
          }, 100);

          return () => clearInterval(interval);
        } else {
          setIsRestored(true);
        }
      } catch (e) {
        console.error("Error restoring scroll position", e);
        setIsRestored(true);
      }
    }
  }, [pathname, isReady, navType, isRestored]);
};
