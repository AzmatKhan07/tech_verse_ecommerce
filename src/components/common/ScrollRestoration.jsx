import { useEffect } from "react";

const ScrollRestoration = () => {
  useEffect(() => {
    // Force scroll to top on page load/refresh
    // This runs once when the component mounts (page loads)
    window.scrollTo(0, 0);

    // Disable browser's built-in scroll restoration
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
  }, []);

  return null;
};

export default ScrollRestoration;
