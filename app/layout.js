import './globals.css'

export const metadata = {
  title: 'UniFind — AI ilə Universitet Axtar',
  description: 'AI ilə dünya universitetlərini kəşf et',
}

export default function RootLayout({ children }) {
  return (
    <html lang="az">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
