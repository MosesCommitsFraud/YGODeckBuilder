import "./globals.css"

export const metadata = {
  title: "YGO Deck Builder",
  description: "Build your deck with popular card combinations",
}

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode
}) {
  return (
      <html lang="en">
      <body className="font-sans antialiased">{children}</body>
      </html>
  )
}