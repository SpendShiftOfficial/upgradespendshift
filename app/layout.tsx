import Script from "next/script";
import "./globals.css";
import type { Metadata } from "next";
import { Inter, Mona_Sans } from "next/font/google";
import ConsentBanner from "@/components/ConsentBanner";

const inter = Inter({
subsets: ["latin"],
variable: "--font-inter",
display: "swap",
});

const monaSans = Mona_Sans({
subsets: ["latin"],
variable: "--font-mona-sans",
display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.spendshift.com.au"),

  title: {
    default: "SpendShift | Find Hidden Money Leaks",
    template: "%s | SpendShift",
  },

  description:
    "SpendShift helps Australians uncover hidden money leaks with a fast, AI-powered savings audit and personalised financial report.",

  keywords: [
    "money saving",
    "personal finance",
    "budget audit",
    "financial health",
    "Australia",
    "AI savings",
    "expense tracker",
    "SpendShift",
  ],

  authors: [{ name: "SpendShift" }],

  creator: "SpendShift",

  publisher: "SpendShift",

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "SpendShift",
    description:
      "Find hidden money leaks and discover how much you could save every year.",
    url: "https://www.spendshift.com.au",
    siteName: "SpendShift",
    locale: "en_AU",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "SpendShift",
    description:
      "Find hidden money leaks and save more with a personalised AI savings report.",
    images: ["/og-image.jpg"],
  },

  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${monaSans.variable}`}>
      <head>
        
       
      </head>

      <body>
        {children}
        <ConsentBanner />
<Script id="consent-default" strategy="beforeInteractive">
{`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}

gtag('consent', 'default', {
analytics_storage: 'denied',
ad_storage: 'denied',
ad_user_data: 'denied',
ad_personalization: 'denied',
wait_for_update: 500
});
`}
</Script>
        <Script id="consent-restore" strategy="beforeInteractive">
{`
try {
var savedConsent = localStorage.getItem("spendshift_cookie_consent");

if (savedConsent === "granted" || savedConsent === "denied") {
gtag("consent", "update", {
analytics_storage: savedConsent,
ad_storage: savedConsent,
ad_user_data: savedConsent,
ad_personalization: savedConsent
});
}
} catch (e) {}
`}
</Script>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-MEHDG2Y7T2"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-MEHDG2Y7T2');
          `}
        </Script>
        {/* Microsoft Clarity */}
        <Script id="microsoft-clarity" strategy="lazyOnload">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "ykimmnar80");
          `}
        </Script>
        {/* TIK TOK PIXEL INTEGRATION */}
        <Script id="tiktok-pixel" strategy="lazyOnload">
  {`
  if (localStorage.getItem("spendshift_cookie_consent") === "granted") {
    !function (w, d, t) {
      w.TiktokAnalyticsObject=t;
      var ttq=w[t]=w[t]||[];
      ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"];
      ttq.setAndDefer=function(t,e){
        t[e]=function(){
          t.push([e].concat(Array.prototype.slice.call(arguments,0)))
        }
      };

      for(var i=0;i<ttq.methods.length;i++){
        ttq.setAndDefer(ttq,ttq.methods[i]);
      }

      ttq.instance=function(t){
        for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++){
          ttq.setAndDefer(e,ttq.methods[n]);
        }
        return e;
      };

      ttq.load=function(e,n){
        var i="https://analytics.tiktok.com/i18n/pixel/events.js";
        ttq._i=ttq._i||{};
        ttq._i[e]=[];
        ttq._i[e]._u=i;
        ttq._t=ttq._t||{};
        ttq._t[e]=+new Date;
        ttq._o=ttq._o||{};
        ttq._o[e]=n||{};

        var o=document.createElement("script");
        o.type="text/javascript";
        o.async=!0;
        o.src=i+"?sdkid="+e+"&lib="+t;

        var a=document.getElementsByTagName("script")[0];
        a.parentNode.insertBefore(o,a);
      };

      ttq.load("DAQ7793C77UFPT8032V0");
      ttq.page();
    }(window, document, "ttq");
    }
  `}
</Script>
{/* META INTEGRATION */}
<Script id="meta-pixel" strategy="lazyOnload">
  {`
  if (localStorage.getItem("spendshift_cookie_consent") === "granted") {
    !function(f,b,e,v,n,t,s)
    {
      if(f.fbq)return;
      n=f.fbq=function(){
        n.callMethod
          ? n.callMethod.apply(n,arguments)
          : n.queue.push(arguments)
      };
      if(!f._fbq)f._fbq=n;
      n.push=n;
      n.loaded=!0;
      n.version='2.0';
      n.queue=[];
      t=b.createElement(e);
      t.async=!0;
      t.src=v;
      s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)
    }(
      window,
      document,
      'script',
      'https://connect.facebook.net/en_US/fbevents.js'
    );

    fbq('init', '1092210323744514');
    fbq('track', 'PageView');
    }
  `}
</Script>


      </body>
    </html>
  );
}
