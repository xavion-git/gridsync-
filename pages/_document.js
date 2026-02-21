import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Load Inter font from Google — the same font Vercel uses */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="description" content="ML-powered platform that predicts Alberta grid stress and coordinates community action to prevent blackouts." />
      </Head>
      <body style={{ backgroundColor: "#000" }}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
