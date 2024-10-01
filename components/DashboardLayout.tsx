// components/DashboardLayout.tsx
import { TooltipProvider } from "@/components/ui/tooltip"
import Image from "next/image"
import Link from "next/link"
import { Home, Package, ShoppingCart, Users2, LineChart, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { ReactNode } from "react"

type DashboardLayoutProps = {
    children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <TooltipProvider>
            <div className="flex min-h-screen">
                {/* Sidebar */}
                <aside className="flex w-14 flex-col items-center border-r bg-background py-4">
                    <nav className="flex flex-1 flex-col items-center gap-4">
                        <Link href="/dashboard" className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <Package className="h-5 w-5" />
                            <span className="sr-only">Dashboard</span>
                        </Link>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link href="/home" className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground">
                                    <Home className="h-5 w-5" />
                                    <span className="sr-only">Home</span>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right">Home</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link href="/orders" className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground">
                                    <ShoppingCart className="h-5 w-5" />
                                    <span className="sr-only">Orders</span>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right">Orders</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link href="/customers" className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground">
                                    <Users2 className="h-5 w-5" />
                                    <span className="sr-only">Customers</span>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right">Customers</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link href="/analytics" className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground">
                                    <LineChart className="h-5 w-5" />
                                    <span className="sr-only">Analytics</span>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right">Analytics</TooltipContent>
                        </Tooltip>
                    </nav>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link href="/settings" className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground">
                                <Settings className="h-5 w-5" />
                                <span className="sr-only">Settings</span>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">Settings</TooltipContent>
                    </Tooltip>
                </aside>

                {/* Main content area */}
                <div className="flex flex-1 flex-col">
                    {/* Header */}
                    <header className="flex h-14 items-center justify-between border-b px-4">
                        <div className="flex items-center space-x-4">
                            <div className="h-8 w-8 rounded-lg bg-primary" aria-hidden="true" />
                            <h1 className="text-lg font-semibold">Dashboard</h1>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                    <Image
                                        src="/placeholder-user.jpg"
                                        width={32}
                                        height={32}
                                        alt="Avatar"
                                        className="rounded-full"
                                    />
                                    <span className="sr-only">Toggle user menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Profile</DropdownMenuItem>
                                <DropdownMenuItem>Settings</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Logout</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </header>

                    {/* Main content */}
                    <main className="flex-1 p-4">
                        {children}
                    </main>
                </div>
            </div>
        </TooltipProvider>
    )
}
