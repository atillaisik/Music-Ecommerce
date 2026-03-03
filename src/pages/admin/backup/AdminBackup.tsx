import React, { useState } from 'react';
import {
    Database,
    Download,
    Upload,
    History,
    AlertTriangle,
    CheckCircle2,
    Clock,
    HardDrive,
    Search,
    Play,
    Loader2,
    ShieldAlert
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Progress } from "@/components/ui/progress";
import { toast } from 'sonner';

interface BackupEntry {
    id: string;
    filename: string;
    size: string;
    date: string;
    type: 'automatic' | 'manual';
    status: 'success' | 'failed' | 'in_progress';
}

const mockBackups: BackupEntry[] = [
    {
        id: '1',
        filename: 'arasounds_prod_2024-03-03_040001.sql',
        size: '42.5 MB',
        date: new Date().toISOString(),
        type: 'automatic',
        status: 'success'
    },
    {
        id: '2',
        filename: 'arasounds_manual_pre-refactor.sql',
        size: '41.8 MB',
        date: new Date(Date.now() - 86400000).toISOString(),
        type: 'manual',
        status: 'success'
    },
    {
        id: '3',
        filename: 'arasounds_prod_2024-03-02_040001.sql',
        size: '41.2 MB',
        date: new Date(Date.now() - 86400000 * 2).toISOString(),
        type: 'automatic',
        status: 'success'
    }
];

const AdminBackup = () => {
    const [isBackingUp, setIsBackingUp] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleCreateBackup = () => {
        setIsBackingUp(true);
        setProgress(0);

        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        setIsBackingUp(false);
                        toast.success('System snapshot created successfully');
                    }, 500);
                    return 100;
                }
                return prev + 10;
            });
        }, 300);
    };

    const handleRestore = (filename: string) => {
        toast.info(`Initializing restoration from ${filename}`);
        // In a real app, this would trigger a backend process
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground/90 font-sans">Data Sovereignty</h1>
                    <p className="text-muted-foreground text-sm font-medium mt-1">Manage database lifecycle, snapshots, and disaster recovery orchestration.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="gap-2 h-10 px-6 rounded-xl font-bold uppercase tracking-widest text-[9px] border-border/50 bg-white/50 backdrop-blur-sm shadow-sm ring-1 ring-black/5 hover:bg-white transition-all active:scale-95">
                        <Upload className="h-4 w-4" />
                        Import External Asset
                    </Button>
                    <Button onClick={handleCreateBackup} disabled={isBackingUp} className="gap-2 h-10 px-8 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 active:scale-95 transition-all">
                        {isBackingUp ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                        Generate Snapshot
                    </Button>
                </div>
            </div>

            {isBackingUp && (
                <Card className="border-primary/20 bg-primary/[0.02] shadow-2xl shadow-primary/10 animate-in zoom-in-95 duration-300">
                    <CardContent className="p-8 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Database className="h-5 w-5 text-primary animate-pulse" />
                                <span className="text-sm font-bold font-sans uppercase tracking-widest">Compiling Production Schema...</span>
                            </div>
                            <span className="text-xs font-black font-mono text-primary">{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2 bg-primary/10" />
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter text-center italic opacity-60">Synchronizing relational clusters and optimizing binary payloads</p>
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Stats */}
                <Card className="lg:col-span-1 border-border/40 shadow-xl shadow-black/5 ring-1 ring-black/5 bg-white/50 backdrop-blur-sm overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-indigo-500 to-rose-500" />
                    <CardHeader>
                        <CardTitle className="text-lg font-bold font-sans">Storage Topology</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <HardDrive className="h-5 w-5 text-primary opacity-60" />
                                <div className="flex flex-col">
                                    <span className="text-xs font-black uppercase tracking-widest opacity-40 leading-none mb-1">Total Payload</span>
                                    <span className="text-xl font-black font-sans tracking-tight">1.28 GB</span>
                                </div>
                            </div>
                            <div className="h-10 w-10 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                        </div>

                        <div className="space-y-4 pt-4">
                            <h4 className="text-[10px] uppercase font-black text-muted-foreground tracking-widest border-l-2 border-primary pl-2">System Directives</h4>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-xs font-bold font-sans opacity-70">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                    <span>Daily Automated Redundancy Enabled</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs font-bold font-sans opacity-70">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                    <span>Off-site Cloud Storage Synchronized</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs font-bold font-sans opacity-70">
                                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                                    <span>Restricted to Super Admin Override</span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-border/10">
                            <div className="p-4 rounded-2xl border border-destructive/20 bg-destructive/5 space-y-2">
                                <div className="flex items-center gap-2 text-destructive">
                                    <ShieldAlert className="h-4 w-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">Emergency Protocol</span>
                                </div>
                                <p className="text-[10px] font-medium leading-relaxed opacity-60 italic">Restoration will overwrite all current live data with the selected snapshot state.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Backup History */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-border/40 shadow-xl shadow-black/5 ring-1 ring-black/5 bg-white/50 backdrop-blur-sm">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="font-sans font-bold text-xl flex items-center gap-2">
                                    <History className="h-5 w-5 opacity-40" />
                                    Snapshot Sequence
                                </CardTitle>
                                <div className="relative group w-48">
                                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground opacity-50" />
                                    <Input placeholder="Filter history..." className="h-8 pl-7 text-[10px] bg-background/30 rounded-lg" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-muted/30 font-sans">
                                    <TableRow className="border-border/20">
                                        <TableHead className="uppercase tracking-widest text-[9px] font-black pl-6">Snapshot Identity</TableHead>
                                        <TableHead className="uppercase tracking-widest text-[9px] font-black">Origin</TableHead>
                                        <TableHead className="uppercase tracking-widest text-[9px] font-black">Capacity</TableHead>
                                        <TableHead className="w-[120px] text-right pr-6 uppercase tracking-widest text-[9px] font-black">Operations</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mockBackups.map((bk) => (
                                        <TableRow key={bk.id} className="border-border/10 hover:bg-primary/5 transition-colors group">
                                            <TableCell className="pl-6">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold font-sans group-hover:text-primary transition-colors">{bk.filename}</span>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Clock className="h-2.5 w-2.5 opacity-40" />
                                                        <span className="text-[9px] opacity-40 font-bold uppercase">{new Date(bk.date).toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={`text-[9px] uppercase font-black tracking-widest ${bk.type === 'automatic' ? 'bg-indigo-500/5 text-indigo-500 border-indigo-500/20' : 'bg-primary/5 text-primary border-primary/20'}`}>
                                                    {bk.type}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-[10px] font-mono font-bold opacity-60">
                                                {bk.size}
                                            </TableCell>
                                            <TableCell className="text-right pr-6 space-x-1">
                                                <Button variant="ghost" size="icon" title="Download" className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary transition-all active:scale-95">
                                                    <Download className="h-3.5 w-3.5" />
                                                </Button>
                                                <Button variant="ghost" size="icon" title="Restore" onClick={() => handleRestore(bk.filename)} className="h-8 w-8 rounded-lg hover:bg-rose-500/10 hover:text-rose-500 transition-all active:scale-95">
                                                    <History className="h-3.5 w-3.5" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AdminBackup;
