export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <title>Simple Proxy</title>
      </head>
      <body>{children}</body>
    </html>
  );
}
