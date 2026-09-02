import './globals.css'

export const metadata = {
  title: 'UniAsk — Find Your University',
  description: 'Ask AI about any university program — admissions, scholarships, requirements, life abroad. Compare 12,400+ programs worldwide.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800&family=Instrument+Serif:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
