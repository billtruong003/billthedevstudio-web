import Script from "next/script";
import { Nunito } from "next/font/google";
import { LITE_SCRIPT } from "@/lib/lite";
import type { Locale } from "@/lib/site";
import "@/app/globals.css";

// One family for everything: Nunito (variable), rounded like the games, full Vietnamese. 400 reading, 700 UI, 900 titles.
const nunito = Nunito({ subsets: ["latin", "vietnamese"], variable: "--font-nunito", display: "swap" });

/** The <html> of every page; each language has its own root layout so `lang` is right in the static HTML. */
export function Shell({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return (
    <html lang={locale} className={nunito.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: LITE_SCRIPT }} />
        <meta name="google-adsense-account" content="ca-pub-6751218490710547" />
      </head>
      <body className="min-h-screen overflow-x-clip bg-ink font-sans text-white antialiased">
        {children}
        {/* AdSense loads after the page has painted: on a slow phone its 250 KB used to compete with the first screen */}
        <Script src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6751218490710547" crossOrigin="anonymous" strategy="lazyOnload" />
      </body>
    </html>
  );
}
