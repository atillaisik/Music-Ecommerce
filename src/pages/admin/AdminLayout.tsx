import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import AdminSidebar from '@/components/admin/AdminSidebar';
import {
    Bell,
    Search,
    Settings,
    User,
    Terminal,
    LayoutDashboard,
    ShieldCheck,
    Package,
    ShoppingCart,
    Users,
    BarChart3,
    SearchIcon,
    Search as SearchLucide,
    ChevronRight
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAdminStore } from '@/lib/adminStore';
import { motion } from 'framer-motion';
import { useRealTimeSubscriptions } from '@/hooks/useRealTimeSubscriptions';

import { ThemeToggle } from '@/components/ThemeToggle';

const AdminLayout = () => {
    // Initialize real-time subscriptions
    useRealTimeSubscriptions();

    const { user } = useAdminStore();
    const location = useLocation();

    // Simple breadcrumb logic based on path
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = pathSegments.map((segment, index) => {
        const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
        return {
            label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
            path,
            active: index === pathSegments.length - 1
        };
    });

    return (
        <SidebarProvider>
            <div className="flex h-screen w-full bg-background/50 overflow-hidden font-sans antialiased text-foreground selection:bg-primary/20 selection:text-primary">
                <AdminSidebar />
                <SidebarInset className="relative flex flex-col min-w-0 bg-[#f8f9fc] dark:bg-[#0b0c10] border-l border-border/40">
                    {/* Topbar */}
                    <header className="h-16 flex items-center justify-between px-6 border-b border-border/50 bg-white/80 dark:bg-[#0d0e12]/80 backdrop-blur-md sticky top-0 z-10 transition-colors duration-300">
                        <div className="flex items-center gap-4 flex-1">
                            <SidebarTrigger className="hover:bg-accent/80 transition-all active:scale-95 duration-200" />
                            <div className="hidden md:flex items-center gap-2 text-sm font-medium text-muted-foreground ml-4">
                                <LayoutDashboard className="h-4 w-4" />
                                <span className="opacity-40">/</span>
                                {breadcrumbs.map((bc, idx) => (
                                    <React.Fragment key={bc.path}>
                                        <Link
                                            to={bc.path}
                                            className={`hover:text-primary transition-colors hover:underline underline-offset-4 decoration-primary/50 ${bc.active ? 'text-foreground font-bold' : ''}`}
                                        >
                                            {bc.label}
                                        </Link>
                                        {idx < breadcrumbs.length - 1 && <span className="opacity-40 font-normal">/</span>}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="relative hidden lg:flex group">
                                <SearchLucide className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input
                                    placeholder="Search products, orders..."
                                    className="pl-9 h-9 w-[260px] bg-accent/30 border-none focus-visible:ring-1 focus-visible:ring-primary/50 transition-all group-focus-within:w-[320px] shadow-sm rounded-full text-xs"
                                />
                            </div>
                            <Separator orientation="vertical" className="h-4 mx-2 hidden md:block opacity-30" />

                            <ThemeToggle />

                            <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 active:scale-90 transition-transform relative">
                                <Bell className="h-4.5 w-4.5" />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-white dark:border-[#0d0e12]" />
                            </Button>
                            <div className="h-9 px-3 gap-2 flex items-center bg-primary/5 border border-primary/10 rounded-full hover:bg-primary/10 cursor-pointer transition-colors shadow-sm active:scale-95 duration-200 group">
                                <ShieldCheck className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
                                <span className="text-[11px] font-bold text-primary uppercase tracking-wider">{user?.role?.substring(0, 5)}</span>
                            </div>
                        </div>
                    </header>

                    {/* Main Content Area */}
                    <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 relative">
                        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none opacity-50 z-0" />
                        <div className="max-w-[1400px] mx-auto relative z-1">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                            >
                                <Outlet />
                            </motion.div>
                        </div>
                    </main>

                    {/* Activity Logs Bar / Mini Footer */}
                    <footer className="h-10 px-6 border-t border-border/30 bg-white/50 dark:bg-black/20 flex items-center justify-between text-[10px] text-muted-foreground/70 uppercase tracking-widest font-medium transition-colors">
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-bold border border-emerald-500/20">
                                <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                                System Online
                            </span>
                            <span className="opacity-60">ARASOUNDS Platform v1.2</span>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 group cursor-pointer hover:text-foreground transition-colors uppercase">
                                <Terminal className="h-3 w-3" />
                                Logs
                            </div>
                            <div className="flex items-center gap-2 group cursor-pointer hover:text-foreground transition-colors uppercase">
                                <Settings className="h-3 w-3" />
                                Settings
                            </div>
                            <span className="opacity-40">© 2026 ARASOUNDS LLC</span>
                        </div>
                    </footer>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
};

export default AdminLayout;
