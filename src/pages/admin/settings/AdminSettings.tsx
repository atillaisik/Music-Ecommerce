import React from 'react';
import {
    Settings,
    Store,
    Truck,
    CreditCard,
    Mail,
    Globe,
    ShieldCheck,
    Bell,
    Save,
    MapPin,
    Phone,
    Monitor,
    Database,
    Palette,
    Code,
    Smartphone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const AdminSettings = () => {
    const handleSave = () => {
        toast.success('System settings updated successfully');
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground/90 font-sans">System Configuration</h1>
                    <p className="text-muted-foreground text-sm font-medium mt-1">Global administrative controls and platform behavior parameters.</p>
                </div>
                <Button onClick={handleSave} className="gap-2 shadow-xl shadow-primary/20 h-10 px-8 rounded-xl font-black uppercase tracking-widest text-[10px] active:scale-95 transition-all">
                    <Save className="h-4 w-4" />
                    Synchronize Settings
                </Button>
            </div>

            <Tabs defaultValue="store" className="w-full space-y-6">
                <TabsList className="bg-white/30 dark:bg-black/20 p-1 border border-border/50 backdrop-blur-sm rounded-2xl h-14 w-full md:w-auto overflow-x-auto overflow-y-hidden justify-start md:justify-center ring-1 ring-black/5">
                    <TabsTrigger value="store" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-xl h-11 px-6 gap-2 font-bold uppercase tracking-widest text-[9px] transition-all"><Store className="h-4 w-4" /> Store Details</TabsTrigger>
                    <TabsTrigger value="shipping" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-xl h-11 px-6 gap-2 font-bold uppercase tracking-widest text-[9px] transition-all"><Truck className="h-4 w-4" /> Shipping & Logistics</TabsTrigger>
                    <TabsTrigger value="payments" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-xl h-11 px-6 gap-2 font-bold uppercase tracking-widest text-[9px] transition-all"><CreditCard className="h-4 w-4" /> Financial Gateways</TabsTrigger>
                    <TabsTrigger value="notifications" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-xl h-11 px-6 gap-2 font-bold uppercase tracking-widest text-[9px] transition-all"><Bell className="h-4 w-4" /> Communication Hub</TabsTrigger>
                    <TabsTrigger value="security" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-xl h-11 px-6 gap-2 font-bold uppercase tracking-widest text-[9px] transition-all"><ShieldCheck className="h-4 w-4" /> Access & Sovereignty</TabsTrigger>
                </TabsList>

                {/* Store Profile */}
                <TabsContent value="store" className="mt-6 space-y-6">
                    <Card className="border-border/40 shadow-xl shadow-black/5 ring-1 ring-black/5 overflow-hidden">
                        <CardHeader className="bg-primary/[0.02] border-b border-border/20">
                            <CardTitle className="text-xl font-bold font-sans">Store Identity</CardTitle>
                            <CardDescription className="text-xs font-semibold">Define your brand's public profile across the platform.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <Label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">Entity Name</Label>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/30" />
                                        <Input defaultValue="ARASOUNDS Music E-Commerce" className="h-11 pl-10 font-bold bg-background/50 border-border/50 rounded-xl" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">Support Hotline</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/30" />
                                        <Input defaultValue="+1 (555) 888-0000" className="h-11 pl-10 font-mono font-bold bg-background/50 border-border/50 rounded-xl" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">Communication Channel</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/30" />
                                        <Input defaultValue="support@arasounds.com" className="h-11 pl-10 font-bold bg-background/50 border-border/50 rounded-xl" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">Physical Headquarters</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/30" />
                                        <Input defaultValue="1200 Harmony Way, Nashville, TN" className="h-11 pl-10 font-bold bg-background/50 border-border/50 rounded-xl" />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3 border-t border-border/10 pt-8">
                                <Label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">Brand Mission Statement</Label>
                                <Textarea defaultValue="Providing high-end musical equipment to dedicated artists worldwide with professional support and seamless experience." className="min-h-[120px] font-medium leading-relaxed bg-background/50 border-border/50 rounded-xl resize-none" />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Shipping Logistics */}
                <TabsContent value="shipping" className="mt-6 space-y-6">
                    <Card className="border-border/40 shadow-xl shadow-black/5">
                        <CardHeader>
                            <CardTitle className="font-sans font-bold">Delivery Parameters</CardTitle>
                            <CardDescription className="text-xs">Configure shipping rates and regional availability.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-primary/5 border border-primary/20">
                                <div className="space-y-0.5">
                                    <Label className="text-sm font-bold font-sans">Global Distribution</Label>
                                    <p className="text-[10px] text-muted-foreground font-black uppercase opacity-60">Enable international checkout flows</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                                <div className="space-y-3">
                                    <Label className="text-[10px] uppercase tracking-widest font-black">Standard Courier Fee ($)</Label>
                                    <Input type="number" defaultValue="15.00" className="h-11 font-mono font-bold" />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] uppercase tracking-widest font-black">Expedited Service Addition ($)</Label>
                                    <Input type="number" defaultValue="45.00" className="h-11 font-mono font-bold" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Financial Gateways */}
                <TabsContent value="payments" className="mt-6 space-y-6">
                    <Card className="border-border/40 shadow-xl shadow-black/5 overflow-hidden">
                        <CardContent className="p-0">
                            <div className="p-8 space-y-8">
                                <div className="flex items-center gap-4 text-emerald-500 bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20">
                                    <div className="h-10 w-10 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                                        <ShieldCheck className="h-6 w-6" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-black uppercase tracking-widest leading-none mb-1">Stripe Integration Active</span>
                                        <span className="text-[10px] font-bold opacity-70">Production environment synchronized and verified.</span>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <Label className="text-[10px] uppercase tracking-widest font-black">Public API Key (VITE_STRIPE_KEY)</Label>
                                        <div className="relative">
                                            <Code className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/30" />
                                            <Input type="password" value="pk_live_********************************" disabled className="h-11 pl-10 font-mono tracking-tighter bg-muted/40 opacity-50 rounded-xl" />
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-4 rounded-2xl border border-border/50 bg-background/50">
                                        <div className="space-y-0.5">
                                            <Label className="text-sm font-bold font-sans">Debug Sandbox Mode</Label>
                                            <p className="text-[10px] text-muted-foreground font-black uppercase opacity-60">Redirect transactions to testing environment</p>
                                        </div>
                                        <Switch />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Notifications */}
                <TabsContent value="notifications" className="mt-6 space-y-6">
                    <Card className="border-border/40 shadow-xl shadow-black/5 ring-1 ring-black/5">
                        <CardHeader>
                            <CardTitle className="font-sans font-bold">Email Orchestration</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-2xl border border-border/40 bg-background/50 hover:bg-white transition-all cursor-pointer group">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary border border-primary/20 group-hover:scale-110 transition-transform">
                                            <Mail className="h-5 w-5" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold font-sans">Purchase Confirmation Template</span>
                                            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Sent automatically after checkout</span>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm" className="font-bold text-[9px] uppercase tracking-widest">Edit Payload</Button>
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-2xl border border-border/40 bg-background/50 hover:bg-white transition-all cursor-pointer group">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-orange-500/5 flex items-center justify-center text-orange-500 border border-orange-500/20 group-hover:scale-110 transition-transform">
                                            <Truck className="h-5 w-5" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold font-sans">Shipment Dispatch Blueprint</span>
                                            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Sent when order status changes to "shipped"</span>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm" className="font-bold text-[9px] uppercase tracking-widest">Edit Payload</Button>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-border/10">
                                <Button variant="outline" onClick={() => toast.promise(new Promise(res => setTimeout(res, 2000)), { loading: 'Dispatching test broadcast...', success: 'Test notification delivered to administrator email', error: 'SMTP Handshake Failed' })} className="w-full h-11 rounded-xl border-dashed border-primary/30 text-primary font-bold uppercase tracking-widest text-[10px] gap-2 hover:bg-primary/5 transition-all">
                                    <ShieldCheck className="h-4 w-4" />
                                    Validate SMTP Connection
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Access Governance */}
                <TabsContent value="security" className="mt-6 space-y-6">
                    <Card className="border-border/40 shadow-xl shadow-black/5 ring-1 ring-black/5 overflow-hidden">
                        <CardHeader className="bg-destructive/[0.02]">
                            <CardTitle className="font-sans font-bold text-destructive">Infrastructure Vault</CardTitle>
                            <CardDescription className="text-xs">Critical system access and data sovereignty controls.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8">
                            <div className="flex items-center justify-between p-6 rounded-2xl bg-destructive/5 border border-destructive/20 mt-4">
                                <div className="space-y-0.5">
                                    <Label className="text-sm font-bold font-sans text-destructive">Production Lockdown</Label>
                                    <p className="text-[10px] text-muted-foreground font-black uppercase opacity-60">Disable all administrative write operations globally</p>
                                </div>
                                <Switch className="data-[state=checked]:bg-destructive" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                                <Button variant="outline" className="h-14 rounded-2xl justify-start px-6 gap-4 border-border/40 hover:bg-white hover:shadow-lg transition-all active:scale-95 group">
                                    <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                                        <ShieldCheck className="h-5 w-5" />
                                    </div>
                                    <div className="flex flex-col items-start">
                                        <span className="text-xs font-black uppercase tracking-widest">Credential Rotation</span>
                                        <span className="text-[9px] opacity-40 font-bold uppercase">Update system master keys</span>
                                    </div>
                                </Button>
                                <Button variant="outline" className="h-14 rounded-2xl justify-start px-6 gap-4 border-border/40 hover:bg-white hover:shadow-lg transition-all active:scale-95 group">
                                    <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                                        <Database className="h-5 w-5" />
                                    </div>
                                    <div className="flex flex-col items-start">
                                        <span className="text-xs font-black uppercase tracking-widest">Database Optimization</span>
                                        <span className="text-[9px] opacity-40 font-bold uppercase">Run health vacuum and reindex</span>
                                    </div>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AdminSettings;
