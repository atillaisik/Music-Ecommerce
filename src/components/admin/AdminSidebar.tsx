import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    Layers,
    Tag,
    ShoppingCart,
    Users,
    BarChart3,
    Percent,
    History,
    Settings,
    Database,
    LogOut,
    ChevronRight,
    Music
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAdminStore } from '@/lib/adminStore';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger,
    useSidebar
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

const menuItems = [
    {
        title: "Overview",
        label: "Dashboard",
        icon: LayoutDashboard,
        url: "/admin",
        roles: ['super_admin', 'editor', 'viewer']
    },
    {
        title: "Inventory",
        label: "Products",
        icon: Package,
        url: "/admin/products",
        roles: ['super_admin', 'editor', 'viewer']
    },
    {
        title: "Inventory",
        label: "Categories",
        icon: Layers,
        url: "/admin/categories",
        roles: ['super_admin', 'editor']
    },
    {
        title: "Inventory",
        label: "Brands",
        icon: Tag,
        url: "/admin/brands",
        roles: ['super_admin', 'editor']
    },
    {
        title: "Sales",
        label: "Orders",
        icon: ShoppingCart,
        url: "/admin/orders",
        roles: ['super_admin', 'editor', 'viewer']
    },
    {
        title: "Sales",
        label: "Customers",
        icon: Users,
        url: "/admin/customers",
        roles: ['super_admin', 'editor', 'viewer']
    },
    {
        title: "Reports",
        label: "Analytics",
        icon: BarChart3,
        url: "/admin/analytics",
        roles: ['super_admin', 'viewer']
    },
    {
        title: "Marketing",
        label: "Discounts",
        icon: Percent,
        url: "/admin/discounts",
        roles: ['super_admin', 'editor']
    },
    {
        title: "System",
        label: "Activity Log",
        icon: History,
        url: "/admin/activity-log",
        roles: ['super_admin']
    },
    {
        title: "System",
        label: "Settings",
        icon: Settings,
        url: "/admin/settings",
        roles: ['super_admin']
    },
    {
        title: "System",
        label: "Database Backup",
        icon: Database,
        url: "/admin/backup",
        roles: ['super_admin']
    },
];

const AdminSidebar = () => {
    const { user, logout } = useAdminStore();
    const location = useLocation();
    const { state } = useSidebar();
    const isCollapsed = state === 'collapsed';

    // Filter menu items by user role
    const filteredMenuItems = menuItems.filter(item =>
        user && item.roles.includes(user.role)
    );

    // Group menu items by title
    const groupedItems = filteredMenuItems.reduce((acc, item) => {
        if (!acc[item.title]) acc[item.title] = [];
        acc[item.title].push(item);
        return acc;
    }, {} as Record<string, typeof menuItems>);

    return (
        <Sidebar collapsible="icon" className="border-r border-border/50 bg-card/50 backdrop-blur-sm">
            <SidebarHeader className="p-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
                        <Music className="h-6 w-6" />
                    </div>
                    {!isCollapsed && (
                        <div className="flex flex-col overflow-hidden">
                            <span className="font-bold text-lg leading-tight tracking-tight">ARASOUNDS</span>
                            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Admin Panel</span>
                        </div>
                    )}
                </div>
            </SidebarHeader>

            <SidebarContent className="px-2">
                {Object.entries(groupedItems).map(([group, items]) => (
                    <SidebarGroup key={group}>
                        {!isCollapsed && (
                            <SidebarGroupLabel className="px-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60 mb-1">
                                {group}
                            </SidebarGroupLabel>
                        )}
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {items.map((item) => (
                                    <SidebarMenuItem key={item.url}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={location.pathname === item.url}
                                            tooltip={item.label}
                                            className={cn(
                                                "h-10 transition-all duration-200 ease-in-out",
                                                location.pathname === item.url
                                                    ? "bg-primary/10 text-primary font-medium border-l-2 border-primary rounded-none rounded-r-md"
                                                    : "hover:bg-accent/50 text-muted-foreground hover:text-foreground hover:translate-x-1"
                                            )}
                                        >
                                            <Link to={item.url} className="flex items-center gap-3 w-full capitalize">
                                                <item.icon className={cn("h-4.5 w-4.5 shrink-0", location.pathname === item.url ? "text-primary" : "text-muted-foreground")} />
                                                {!isCollapsed && <span className="text-sm">{item.label}</span>}
                                                {!isCollapsed && location.pathname === item.url && (
                                                    <ChevronRight className="ml-auto h-3 w-3 opacity-50" />
                                                )}
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>

            <SidebarFooter className="p-4">
                <Separator className="mb-4 opacity-50" />
                <div className={cn("flex items-center gap-3", isCollapsed ? "justify-center" : "px-2")}>
                    <Avatar className="h-9 w-9 border-2 border-primary/20 shadow-sm">
                        <AvatarImage src={`https://avatar.iran.liara.run/username?username=${user?.name || 'Admin'}`} />
                        <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
                            {user?.name?.substring(0, 2).toUpperCase() || 'AD'}
                        </AvatarFallback>
                    </Avatar>
                    {!isCollapsed && (
                        <div className="flex flex-col overflow-hidden flex-1">
                            <span className="text-sm font-semibold truncate leading-none mb-1">{user?.name}</span>
                            <span className="text-[10px] text-muted-foreground truncate uppercase tracking-tighter">{user?.role?.replace('_', ' ')}</span>
                        </div>
                    )}
                    {!isCollapsed && (
                        <button
                            onClick={logout}
                            className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors text-muted-foreground"
                            title="Logout"
                        >
                            <LogOut className="h-4 w-4" />
                        </button>
                    )}
                </div>
                {isCollapsed && (
                    <button
                        onClick={logout}
                        className="mx-auto mt-4 p-2 hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors text-muted-foreground"
                        title="Logout"
                    >
                        <LogOut className="h-4 w-4" />
                    </button>
                )}
            </SidebarFooter>
        </Sidebar>
    );
};

export default AdminSidebar;
