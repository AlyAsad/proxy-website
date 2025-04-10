import { redirect } from "next/navigation";
import ProxyContent from "./ProxyContent";

export default async function ProxyPage({ searchParams }) {
  const url = searchParams.url;

  // Redirect back to the homepage if no URL is provided
  if (!url) {
    redirect("/");
  }

  let targetUrl = url;
  if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
    targetUrl = "http://" + targetUrl;
  }

  try {
    // Fetch the target URL's HTML.
    // (Consider adding error handling, timeouts, and caching in production.)
    const res = await fetch(targetUrl);
    const html = await res.text();
    return <ProxyContent html={html} url={targetUrl} />;
  } catch (error) {
    return (
      <div style={{ padding: "20px" }}>
        <h1>Error loading page</h1>
        <p>{error.message}</p>
      </div>
    );
  }
}
