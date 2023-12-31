
import './globals.css'
import { validateLanguage, metaKeywords, sectionTitles } from '../utils/helpers'

export async function generateMetadata({ params }) {
  const languageRoute = validateLanguage(params.language) ? params.language : 'en'
  const title = sectionTitles[languageRoute].siteTitle
  const description = sectionTitles[languageRoute].description
  return {
    title,
    description,
    keywords: metaKeywords,
    alternates: {
      canonical: '/',
      languages: {
        'en-US': '/',
        'de-DE': '/de',
        'zh-TW': '/tw'
      },
    },
    openGraph: {
      siteName: title,
      images: '/img/opengraph.jpg',
    },
  }
}


export default function RootLayout({ children, params }) {

    return (
      // children
      <html>
        <link rel="icon" href="img/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="img/apple-touch-icon.png" type="image/png" sizes="180x180"/>
        <link rel="icon" type="image/png" sizes="32x32" href="img/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="img/favicon-16x16.png" />
        <link rel="shortcut icon" href="img/favicon-32x32.png" />
        <link rel="manifest" href="img/site.webmanifest" />
        <link rel="mask-icon" href="img/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        {/* <meta name="theme-color" content="#ffffff"></meta> */}
        {/* <meta property="og:image" content="img/opengraph.jpg" /> */}
        <body>{children}</body>
      </html>
    )
  }
