import React from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'
import { ServerStyleSheets } from '@material-ui/core/styles'

import { cdnify } from '../libs/utils'
export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en-GB">
        <Head>
          <link
            rel="shortcut icon"
            href={cdnify('/favicon.ico')}
            type="image/x-icon"
          />
          <link rel="apple-touch-icon" href={cdnify('/apple-touch-icon.png')} />
          <link
            rel="apple-touch-icon"
            sizes="57x57"
            href={cdnify('/apple-touch-icon-57x57.png')}
          />
          <link
            rel="apple-touch-icon"
            sizes="72x72"
            href={cdnify('/apple-touch-icon-72x72.png')}
          />
          <link
            rel="apple-touch-icon"
            sizes="76x76"
            href={cdnify('/apple-touch-icon-76x76.png')}
          />
          <link
            rel="apple-touch-icon"
            sizes="114x114"
            href={cdnify('/apple-touch-icon-114x114.png')}
          />
          <link
            rel="apple-touch-icon"
            sizes="120x120"
            href={cdnify('/apple-touch-icon-120x120.png')}
          />
          <link
            rel="apple-touch-icon"
            sizes="144x144"
            href={cdnify('/apple-touch-icon-144x144.png')}
          />
          <link
            rel="apple-touch-icon"
            sizes="152x152"
            href={cdnify('/apple-touch-icon-152x152.png')}
          />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href={cdnify('/apple-touch-icon-180x180.png')}
          />
          <meta name="apple-mobile-web-app-title" content="Butterfy" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with server-side generation (SSG).
MyDocument.getInitialProps = async (ctx) => {
  // Render app and page and get the context of the page with collected side effects.
  const sheets = new ServerStyleSheets()
  const originalRenderPage = ctx.renderPage

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
    })

  const initialProps = await Document.getInitialProps(ctx)

  return {
    ...initialProps,
    // Styles fragment is rendered after the app and page rendering finish.
    styles: [
      ...React.Children.toArray(initialProps.styles),
      sheets.getStyleElement(),
    ],
  }
}
