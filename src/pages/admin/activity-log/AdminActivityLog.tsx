import React, { useState } from 'react';
import {
    Activity,
    Search,
    Filter,
    Clock,
    User,
    ChevronLeft,
    ChevronRight,
    ArrowRight,
    Database,
    LogIn,
    Edit,
    Plus,
    Trash2,
    ShieldAlert
} from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface ActivityLogEntry {
    id: string;
    admin_name: string;
    admin_id: string;
    action: 'create' | 'update' | 'delete' | 'login' | 'logout' | 'system';
    entity: string;
    entity_id?: string;
    details: string;
    timestamp: string;
    ip_address: string;
}

const mockActivities: ActivityLogEntry[] = [
    {
        id: '1',
        admin_name: 'Super Admin',
        admin_id: 'admin_1',
        action: 'login',
        entity: 'authentication',
        details: 'Successful login from Chrome browser',
        timestamp: new Date().toISOString(),
        ip_address: '192.168.1.1'
    },
    {
        id: '2',
        admin_name: 'Editor User',
        admin_id: 'admin_2',
        action: 'update',
        entity: 'product',
        entity_id: 'prod_123',
        details: 'Updated stock level for "Fender Stratocaster"',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        ip_address: '192.168.1.5'
    },
    {
        id: '3',
        admin_name: 'Super Admin',
        admin_id: 'admin_1',
        action: 'create',
        entity: 'discount_code',
        entity_id: 'disc_456',
        details: 'Created discount code: SUMMER2024',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        ip_address: '192.168.1.1'
    },
    {
        id: '4',
        admin_name: 'Editor User',
        admin_id: 'admin_2',
        action: 'delete',
        entity: 'brand',
        entity_id: 'brand_789',
        details: 'Deleted legacy brand: "Old Guitar Co."',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        ip_address: '192.168.1.5'
    },
    {
        id: '5',
        admin_name: 'System',
        admin_id: 'system',
        action: 'system',
        entity: 'database',
        details: 'Automatic nightly backup completed successfully',
        timestamp: new Date(Date.now() - 43200000).toISOString(),
        ip_address: '::1'
    }
];

const AdminActivityLog = () => {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [actionFilter, setActionFilter] = useState('all');
    const pageSize = 10;

    const getActionIcon = (action: string) => {
        switch (action) {
            case 'login': return <LogIn className="h-4 w-4" />;
            case 'create': return <Plus className="h-4 w-4" />;
            case 'update': return <Edit className="h-4 w-4" />;
            case 'delete': return <Trash2 className="h-4 w-4 text-destructive" />;
            case 'system': return <Database className="h-4 w-4" />;
            default: return <Activity className="h-4 w-4" />;
        }
    };

    const getActionBadge = (action: string) => {
        const baseClass = "text-[9px] uppercase font-black px-2 py-0.5 rounded-full border tracking-widest";
        switch (action) {
            case 'create': return <Badge className={`${baseClass} bg-emerald-500/10 text-emerald-600 border-emerald-500/20`}>Created</Badge>;
            case 'update': return <Badge className={`${baseClass} bg-blue-500/10 text-blue-600 border-blue-500/20`}>Updated</Badge>;
            case 'delete': return <Badge className={`${baseClass} bg-rose-500/10 text-rose-600 border-rose-500/20`}>Deleted</Badge>;
            case 'login': return <Badge className={`${baseClass} bg-indigo-500/10 text-indigo-600 border-indigo-500/20`}>Login</Badge>;
            case 'system': return <Badge className={`${baseClass} bg-slate-500/10 text-slate-600 border-slate-500/20`}>System</Badge>;
            default: return <Badge className={`${baseClass} bg-gray-500/10 text-gray-600 border-gray-500/20`}>{action}</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground/90 font-sans">System Activity Log</h1>
                    <p className="text-muted-foreground text-sm font-medium mt-1">Audit trail for all administrative actions and security events.</p>
                </div>
                <div className="h-10 w-10 md:h-12 md:w-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary shadow-sm ring-1 ring-black/5">
                    <ShieldAlert className="h-6 w-6" />
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col lg:flex-row gap-4 bg-white/50 dark:bg-black/20 p-4 rounded-xl border border-border/50 backdrop-blur-sm shadow-sm ring-1 ring-black/5 dark:ring-white/5">
                <div className="relative flex-1 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Filter by admin, entity, or details..."
                        className="pl-9 bg-background/50 border-border/50 focus-visible:ring-primary/20 transition-all rounded-lg"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex gap-4">
                    <Select value={actionFilter} onValueChange={setActionFilter}>
                        <SelectTrigger className="w-full md:w-[180px] bg-background/50 border-border/50 rounded-lg">
                            <div className="flex items-center gap-2">
                                <Filter className="h-4 w-4 opacity-50" />
                                <SelectValue placeholder="Action Type" />
                            </div>
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-border/50">
                            <SelectItem value="all">All Actions</SelectItem>
                            <SelectItem value="create">Created Items</SelectItem>
                            <SelectItem value="update">Updates Only</SelectItem>
                            <SelectItem value="delete">Deletions</SelectItem>
                            <SelectItem value="login">Logins</SelectItem>
                            <SelectItem value="system">System Logic</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Table */}
            <div className="border border-border/50 rounded-xl overflow-hidden bg-white/30 dark:bg-black/10 backdrop-blur-sm shadow-xl ring-1 ring-black/5 dark:ring-white/5">
                <Table>
                    <TableHeader className="bg-muted/40 font-medium font-sans">
                        <TableRow className="hover:bg-transparent border-border/50">
                            <TableHead className="uppercase tracking-widest text-[10px] font-bold">Time</TableHead>
                            <TableHead className="uppercase tracking-widest text-[10px] font-bold">Admin</TableHead>
                            <TableHead className="uppercase tracking-widest text-[10px] font-bold">Action</TableHead>
                            <TableHead className="uppercase tracking-widest text-[10px] font-bold">Event Details</TableHead>
                            <TableHead className="w-[120px] text-right uppercase tracking-widest text-[10px] font-bold">IP Source</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockActivities.map((entry) => (
                            <TableRow key={entry.id} className="hover:bg-primary/5 transition-colors border-border/40 group">
                                <TableCell className="w-[180px]">
                                    <div className="flex items-center gap-2 text-xs font-bold font-sans opacity-60 group-hover:opacity-100 transition-opacity">
                                        <Clock className="h-3.5 w-3.5" />
                                        <span>{new Date(entry.timestamp).toLocaleString()}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className={`h-8 w-8 rounded-lg ${entry.admin_id === 'system' ? 'bg-slate-500/10 text-slate-500' : 'bg-primary/10 text-primary'} flex items-center justify-center border border-current opacity-20`}>
                                            <User className="h-4 w-4" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold font-sans">{entry.admin_name}</span>
                                            <span className="text-[9px] uppercase font-black opacity-40">#{entry.admin_id}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        {getActionIcon(entry.action)}
                                        {getActionBadge(entry.action)}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] uppercase font-black bg-muted/60 px-1.5 py-0.5 rounded border border-border/40 text-muted-foreground">{entry.entity}</span>
                                            {entry.entity_id && (
                                                <span className="text-[10px] font-mono text-primary font-bold">#{entry.entity_id}</span>
                                            )}
                                        </div>
                                        <p className="text-xs font-medium opacity-80 leading-relaxed font-sans">{entry.details}</p>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <span className="text-[10px] font-mono font-bold opacity-40 group-hover:opacity-100 transition-opacity">{entry.ip_address}</span>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Placeholder */}
            <div className="flex items-center justify-between p-2 bg-white/20 dark:bg-black/10 rounded-xl border border-border/40 backdrop-blur-sm">
                <p className="text-xs text-muted-foreground ml-2 font-medium">
                    Showing <span className="text-foreground font-bold">5</span> of <span className="text-foreground font-bold">5</span> total legacy log entries
                </p>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="rounded-lg h-9 w-9 p-0 opacity-50" disabled>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center justify-center min-w-8 h-8 rounded-lg bg-primary/10 text-primary text-xs font-black border border-primary/20">
                        1
                    </div>
                    <Button variant="ghost" size="sm" className="rounded-lg h-9 w-9 p-0 opacity-50" disabled>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AdminActivityLog;
