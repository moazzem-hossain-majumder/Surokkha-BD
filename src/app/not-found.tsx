import Link from "next/link";

export default function NotFound() {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", padding: "4rem 1.5rem", maxWidth: 640, margin: "0 auto" }}>
        <h1>Page not found / পাতাটি পাওয়া যায়নি</h1>
        <p>
          <Link href="/">Go to the home page</Link> · <Link href="/bn">হোম পাতায় যান</Link>
        </p>
      </body>
    </html>
  );
}
