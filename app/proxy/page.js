import { redirect } from "next/navigation";
import ProxyContent from "./ProxyContent";
import { load } from "cheerio"; // Named import from Cheerio

export default async function ProxyPage({ searchParams }) {
  // Await searchParams before using its properties
  const params = await Promise.resolve(searchParams);
  const url = params.url;

  // If no URL is provided, redirect to the homepage.
  if (!url) {
    redirect("/");
  }

  // Ensure the URL starts with http:// or https://
  let targetUrl = url;
  if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
    targetUrl = "http://" + targetUrl;
  }

  let fetchedHtml = "";
  try {
    const res = await fetch(targetUrl);
    fetchedHtml = await res.text();
  } catch (error) {
    fetchedHtml = `<h1>Error loading page</h1><p>${error.message}</p>`;
    return <ProxyContent html={fetchedHtml} url={targetUrl} />;
  }
  
  // Use Cheerio to load and rewrite HTML.
  const $ = load(fetchedHtml, { decodeEntities: false });

  // Helper function to rewrite URLs for resources.
  const rewriteUrl = (attrValue) => {
    try {
      if (!attrValue) return attrValue;
      const absoluteUrl = new URL(attrValue, targetUrl).href;
      return `/proxy?url=${encodeURIComponent(absoluteUrl)}`;
    } catch (error) {
      return attrValue;
    }
  };

  // Rewrite <a> tags.
  $("a").each((i, el) => {
    const href = $(el).attr("href");
    if (href) {
      $(el).attr("href", rewriteUrl(href));
    }
  });

  // Rewrite <img> tags.
  $("img").each((i, el) => {
    const src = $(el).attr("src");
    if (src) {
      $(el).attr("src", rewriteUrl(src));
    }
  });

  // Rewrite <script> tags.
  $("script").each((i, el) => {
    const src = $(el).attr("src");
    if (src) {
      $(el).attr("src", rewriteUrl(src));
    }
  });

  // Rewrite <link> tags.
  $("link").each((i, el) => {
    const href = $(el).attr("href");
    if (href) {
      $(el).attr("href", rewriteUrl(href));
    }
  });

  // Rewrite <source> tags.
  $("source").each((i, el) => {
    const src = $(el).attr("src");
    if (src) {
      $(el).attr("src", rewriteUrl(src));
    }
  });

  const processedHtml = $.html();

  return <ProxyContent html={processedHtml} url={targetUrl} />;
}
