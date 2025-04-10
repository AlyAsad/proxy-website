"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [url, setUrl] = useState("");
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    let formattedUrl = url.trim();
    // Add HTTP protocol if missing
    if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
      formattedUrl = "http://" + formattedUrl;
    }
    router.push(`/proxy?url=${encodeURIComponent(formattedUrl)}`);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Simple Proxy</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter a website URL (e.g., example.com)"
          style={{ width: "300px", padding: "8px", fontSize: "16px" }}
        />
        <button
          type="submit"
          style={{ marginLeft: "10px", padding: "8px 16px", fontSize: "16px" }}
        >
          Go
        </button>
      </form>
    </div>
  );
}
