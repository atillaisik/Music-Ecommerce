import React, { useEffect, useState } from 'react';
import {
    Store,
    Truck,
    Mail,
    Globe,
    Save,
    MapPin,
    Phone,
    Loader2,
    FileText,
    ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
    DEFAULT_STORE_SETTINGS,
    useStoreSettings,
    useUpdateStoreSettings,
    type StoreSettings,
} from '@/lib/storeSettingsAPI';

const AdminSettings = () => {
    const { data, isLoading } = useStoreSettings();
    const updateSettings = useUpdateStoreSettings();
    const [form, setForm] = useState<StoreSettings>(DEFAULT_STORE_SETTINGS);

    useEffect(() => {
        if (data) setForm(data);
    }, [data]);

    const handleSave = async () => {
        await updateSettings.mutateAsync(form);
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground/90 font-sans">
                        Store Settings
                    </h1>
                    <p className="text-muted-foreground text-sm font-medium mt-1">
                        Public storefront identity and shipping rates. Saved to{' '}
                        <code className="text-xs">site_content / system / settings</code>.
                    </p>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={updateSettings.isPending || isLoading}
                    className="gap-2 h-10 px-8 rounded-xl font-black uppercase tracking-widest text-[10px]"
                >
                    {updateSettings.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save settings
                </Button>
            </div>

            {isLoading ? (
                <Card>
                    <CardContent className="p-8 space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </CardContent>
                </Card>
            ) : (
                <Tabs defaultValue="store" className="w-full space-y-6">
                    <TabsList className="bg-white/30 dark:bg-black/20 p-1 border border-border/50 backdrop-blur-sm rounded-2xl h-14 w-full md:w-auto overflow-x-auto">
                        <TabsTrigger value="store" className="rounded-xl h-11 px-6 gap-2 font-bold uppercase tracking-widest text-[9px]">
                            <Store className="h-4 w-4" /> Store identity
                        </TabsTrigger>
                        <TabsTrigger value="legal" className="rounded-xl h-11 px-6 gap-2 font-bold uppercase tracking-widest text-[9px]">
                            <ShieldCheck className="h-4 w-4" /> Legal / Künye
                        </TabsTrigger>
                        <TabsTrigger value="shipping" className="rounded-xl h-11 px-6 gap-2 font-bold uppercase tracking-widest text-[9px]">
                            <Truck className="h-4 w-4" /> Shipping
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="store" className="mt-6 space-y-6">
                        <Card className="border-border/40">
                            <CardHeader>
                                <CardTitle className="text-xl font-bold font-sans">Store Identity</CardTitle>
                                <CardDescription className="text-xs font-semibold">
                                    Public-facing store information.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">
                                            Store name
                                        </Label>
                                        <div className="relative">
                                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/30" />
                                            <Input
                                                value={form.storeName}
                                                onChange={(e) => setForm({ ...form, storeName: e.target.value })}
                                                className="h-11 pl-10"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">
                                            Support phone
                                        </Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/30" />
                                            <Input
                                                value={form.supportPhone}
                                                onChange={(e) => setForm({ ...form, supportPhone: e.target.value })}
                                                className="h-11 pl-10 font-mono"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">
                                            Support email
                                        </Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/30" />
                                            <Input
                                                type="email"
                                                value={form.supportEmail}
                                                onChange={(e) => setForm({ ...form, supportEmail: e.target.value })}
                                                className="h-11 pl-10"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">
                                            Headquarters
                                        </Label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/30" />
                                            <Input
                                                value={form.address}
                                                onChange={(e) => setForm({ ...form, address: e.target.value })}
                                                className="h-11 pl-10"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2 border-t border-border/10 pt-6">
                                    <Label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">
                                        Brand mission
                                    </Label>
                                    <Textarea
                                        value={form.mission}
                                        onChange={(e) => setForm({ ...form, mission: e.target.value })}
                                        className="min-h-[120px] font-medium leading-relaxed resize-none"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="legal" className="mt-6 space-y-6">
                        <Card className="border-border/40">
                            <CardHeader>
                                <CardTitle className="font-sans font-bold flex items-center gap-2">
                                    <FileText className="h-4 w-4" /> Türkiye e-ticaret kimlik bilgileri
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    6563 sayılı Elektronik Ticaretin Düzenlenmesi Hakkında Kanun ve Mesafeli
                                    Sözleşmeler Yönetmeliği gereği Künye, Mesafeli Satış Sözleşmesi ve
                                    Footer'da gösterilir.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">
                                            Yasal ünvan (Legal name)
                                        </Label>
                                        <Input
                                            value={form.legalName}
                                            onChange={(e) => setForm({ ...form, legalName: e.target.value })}
                                            placeholder="Şirketinizin tam yasal ünvanı"
                                            className="h-11"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">
                                            MERSIS No
                                        </Label>
                                        <Input
                                            value={form.mersisNo}
                                            onChange={(e) => setForm({ ...form, mersisNo: e.target.value })}
                                            placeholder="0000000000000000"
                                            className="h-11 font-mono"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">
                                            Vergi Dairesi
                                        </Label>
                                        <Input
                                            value={form.taxOffice}
                                            onChange={(e) => setForm({ ...form, taxOffice: e.target.value })}
                                            placeholder="Sarıgazi"
                                            className="h-11"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">
                                            Vergi Kimlik No
                                        </Label>
                                        <Input
                                            value={form.taxNumber}
                                            onChange={(e) => setForm({ ...form, taxNumber: e.target.value })}
                                            placeholder="1234567890"
                                            className="h-11 font-mono"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">
                                            Ticaret Sicil No
                                        </Label>
                                        <Input
                                            value={form.tradeRegistryNo}
                                            onChange={(e) => setForm({ ...form, tradeRegistryNo: e.target.value })}
                                            placeholder="123456-0"
                                            className="h-11 font-mono"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">
                                            KEP Adresi (opsiyonel)
                                        </Label>
                                        <Input
                                            value={form.kepAddress}
                                            onChange={(e) => setForm({ ...form, kepAddress: e.target.value })}
                                            placeholder="firma@kep.tr"
                                            className="h-11"
                                        />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <Label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">
                                            ETBİS Kayıt No (opsiyonel — Ticaret Bakanlığı portalı)
                                        </Label>
                                        <Input
                                            value={form.etbisNo}
                                            onChange={(e) => setForm({ ...form, etbisNo: e.target.value })}
                                            placeholder="ETBIS-XXXXXXX"
                                            className="h-11 font-mono"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="shipping" className="mt-6 space-y-6">
                        <Card className="border-border/40">
                            <CardHeader>
                                <CardTitle className="font-sans font-bold">Shipping rates</CardTitle>
                                <CardDescription className="text-xs">
                                    Default shipping fees applied at checkout.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between p-4 rounded-2xl bg-primary/5 border border-primary/20">
                                    <div className="space-y-0.5">
                                        <Label className="text-sm font-bold font-sans">International shipping</Label>
                                        <p className="text-[10px] text-muted-foreground font-black uppercase opacity-60">
                                            Allow customers outside the home country to check out
                                        </p>
                                    </div>
                                    <Switch
                                        checked={form.internationalShipping}
                                        onCheckedChange={(v) => setForm({ ...form, internationalShipping: v })}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] uppercase tracking-widest font-black">
                                            Standard shipping fee ($)
                                        </Label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            min={0}
                                            value={form.standardShippingFee}
                                            onChange={(e) =>
                                                setForm({ ...form, standardShippingFee: Number(e.target.value) || 0 })
                                            }
                                            className="h-11 font-mono font-bold"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] uppercase tracking-widest font-black">
                                            Expedited shipping addition ($)
                                        </Label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            min={0}
                                            value={form.expeditedShippingFee}
                                            onChange={(e) =>
                                                setForm({ ...form, expeditedShippingFee: Number(e.target.value) || 0 })
                                            }
                                            className="h-11 font-mono font-bold"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            )}
        </div>
    );
};

export default AdminSettings;
