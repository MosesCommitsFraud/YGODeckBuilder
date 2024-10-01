import DashboardLayout from "@/components/DashboardLayout"
import "./globals.css"
import {ReactNode} from "react";

export const metadata = {
  title: "YGO Deck Builder",
  description: "Build your deck with popular card combinations",
}

export default function RootLayout({
                                       children,
                                   }: {
    children: ReactNode
}) {
    return (
        <html lang="en">
        <body>
        <DashboardLayout>
            {children}
        </DashboardLayout>
        </body>
        </html>
    )
}