import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function HashScroll() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;

    const id = location.hash.replace("#", "");
    const el = document.getElementById(id);
    if (!el) return;

    // slight delay so layout is mounted
    const t = setTimeout(() => {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);

    return () => clearTimeout(t);
  }, [location]);

  return null;
}
