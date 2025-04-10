"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function ProxyContent({ html, url }) {
  const contentRef = useRef(null);
  const router = useRouter();

  // Fallback client-side interception for clicks.
  useEffect(() => {
    const handleLinkClick = (e) => {
      const anchor = e.target.closest("a");
      if (anchor) {
        e.preventDefault();
        const href = anchor.getAttribute("href");
        if (href) {
          router.push(href);
        }
      }
    };

    const currentRef = contentRef.current;
    if (currentRef) {
      currentRef.addEventListener("click", handleLinkClick);
    }
    return () => {
      if (currentRef) {
        currentRef.removeEventListener("click", handleLinkClick);
      }
    };
  }, [router]);

  return (
    <div
      ref={contentRef}
      style={{ padding: "10px" }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
