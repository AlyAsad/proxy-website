"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function ProxyContent({ html, url }) {
  const contentRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const handleLinkClick = (e) => {
      // Find the closest anchor element
      const anchor = e.target.closest("a");
      if (anchor) {
        e.preventDefault();
        let href = anchor.getAttribute("href");

        // Ignore empty, anchor-only, or javascript links
        if (!href || href.startsWith("javascript:") || href === "#") return;

        try {
          // Resolve relative URLs to absolute URLs based on the target URL
          const absoluteUrl = new URL(href, url).href;
          router.push(`/proxy?url=${encodeURIComponent(absoluteUrl)}`);
        } catch (error) {
          console.error("Error processing URL:", error);
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
  }, [url, router]);

  return (
    <div
      ref={contentRef}
      style={{ padding: "10px" }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
